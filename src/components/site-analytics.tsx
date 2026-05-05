import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const metaPixelId = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

function injectScript(src: string, id: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function SiteAnalytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!gaId && !metaPixelId) return;

    const run = () => {
      if (gaId) {
        injectScript(
          `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`,
          "praeliator-ga-script",
        );
        window.dataLayer = window.dataLayer || [];
        window.gtag =
          window.gtag ||
          function gtag(...args: unknown[]) {
            window.dataLayer?.push(args as unknown as Record<string, unknown>);
          };
        window.gtag("js", new Date());
        window.gtag("config", gaId, {
          anonymize_ip: true,
          send_page_view: true,
        });
      }

      if (metaPixelId && !window.fbq) {
        ((f: Window & typeof globalThis, b: Document, e: "script", v: string) => {
          if (f.fbq) return;
          const n = function (...args: unknown[]) {
            if (n.callMethod) {
              n.callMethod(...args);
            } else {
              n.queue.push(args);
            }
          } as typeof window.fbq & {
            callMethod?: (...args: unknown[]) => void;
            queue: unknown[][];
            loaded?: boolean;
            version?: string;
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = "2.0";
          n.queue = [];
          f.fbq = n;
          const script = b.createElement(e);
          script.id = "praeliator-meta-pixel";
          script.async = true;
          script.src = v;
          const firstScript = b.getElementsByTagName(e)[0];
          firstScript?.parentNode?.insertBefore(script, firstScript);
        })(
          window,
          document,
          "script",
          "https://connect.facebook.net/en_US/fbevents.js",
        );
        window.fbq?.("init", metaPixelId);
        window.fbq?.("track", "PageView");
      }
    };

    const idleScheduler =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(run, { timeout: 1800 })
        : window.setTimeout(run, 900);

    return () => {
      if ("cancelIdleCallback" in window && typeof idleScheduler === "number") {
        window.cancelIdleCallback(idleScheduler);
      } else {
        window.clearTimeout(idleScheduler as number);
      }
    };
  }, []);

  return null;
}
