import { useEffect } from "react";
import {
  getCanonicalUrl,
  getSiteMetadata,
  getSiteSchema,
  type SiteRoute,
} from "../lib/site-seo";
import type { SiteLocale } from "../lib/site-locale";

function ensureMeta(name: string, attribute: "name" | "property") {
  const selector = `meta[${attribute}="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  return element;
}

function ensureMetaList(name: string, attribute: "name" | "property", values: string[]) {
  const selector = `meta[${attribute}="${name}"]`;
  const existing = Array.from(
    document.head.querySelectorAll(selector),
  ) as HTMLMetaElement[];

  values.forEach((value, index) => {
    const element = existing[index] || document.createElement("meta");
    element.setAttribute(attribute, name);
    element.content = value;
    if (!existing[index]) document.head.appendChild(element);
  });

  existing.slice(values.length).forEach((element) => element.remove());
}

const openGraphLocales: Record<SiteLocale, string> = {
  en: "en_US",
  es: "es_MX",
  ja: "ja_JP",
  fr: "fr_FR",
};

export function SiteHead({
  route,
  locale,
}: {
  route: SiteRoute;
  locale: SiteLocale;
}) {
  useEffect(() => {
    const metadata = getSiteMetadata(route);
    const canonicalUrl = getCanonicalUrl(metadata.canonicalPath);

    document.documentElement.lang = locale;
    document.title = metadata.title;

    ensureMeta("description", "name").content = metadata.description;
    ensureMeta("robots", "name").content =
      metadata.robots ?? "index, follow";
    ensureMeta("keywords", "name").content = (metadata.keywords ?? []).join(", ");
    ensureMeta("og:type", "property").content = "website";
    ensureMeta("og:site_name", "property").content = "Praeliator";
    ensureMeta("og:title", "property").content = metadata.title;
    ensureMeta("og:description", "property").content = metadata.description;
    ensureMeta("og:image", "property").content = metadata.image;
    ensureMeta("og:image:alt", "property").content = metadata.title;
    ensureMeta("og:url", "property").content = canonicalUrl;
    ensureMeta("og:locale", "property").content = openGraphLocales[locale];
    ensureMetaList(
      "og:locale:alternate",
      "property",
      (Object.keys(openGraphLocales) as SiteLocale[])
        .filter((candidate) => candidate !== locale)
        .map((candidate) => openGraphLocales[candidate]),
    );
    ensureMeta("twitter:card", "name").content = "summary_large_image";
    ensureMeta("twitter:title", "name").content = metadata.title;
    ensureMeta("twitter:description", "name").content = metadata.description;
    ensureMeta("twitter:image", "name").content = metadata.image;
    ensureMeta("twitter:image:alt", "name").content = metadata.title;

    let canonical = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schemaId = "praeliator-structured-data";
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = schemaId;
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(getSiteSchema(route));
  }, [locale, route]);

  return null;
}
