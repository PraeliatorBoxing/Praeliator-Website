import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "./components/ui/button";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float } from "@react-three/drei";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  ArrowLeft,
  ChevronRight,
  Crown,
  Gem,
  Image as ImageIcon,
  Instagram,
  Mail,
  Medal,
  Menu,
  MessageCircle,
  Package,
  ShieldCheck,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const products = [
  {
    name: "Praeliator VIS",
    category: "Training Gloves",
    price: "$6,000 MXN",
    note: "Acquired through private client service",
    description:
      "A luxury training glove built for those who treat boxing as art. Designed for disciplined training, elevated presentation, and a more personal buying process.",
    longDescription:
      "Praeliator VIS is presented as a luxury acquisition rather than a mass-market product. Its page is built to communicate rarity, control, and intention before the client ever enters conversation.",
  },
  {
    name: "Founding Client Access",
    category: "Private Purchase Experience",
    price: "By inquiry",
    note: "Limited availability",
    description:
      "A concierge-style route for clients who want guidance, priority communication, and access to upcoming releases through direct consultation.",
    longDescription:
      "This route is for clients who want a more tailored relationship with the brand, including priority access, more direct communication, and a stronger sense of exclusivity.",
  },
  {
    name: "Collector Waitlist",
    category: "Early Access",
    price: "Complimentary",
    note: "Invitation-oriented",
    description:
      "Reserve your place for future drops, limited editions, and new Praeliator releases before public announcements.",
    longDescription:
      "The collector route is designed to support scarcity and anticipation. It signals that access matters, timing matters, and not everything is permanently available.",
  },
];

const visSpecifications = [
  { label: "Type", value: "Training boxing gloves" },
  { label: "Price", value: "$6,000 MXN" },
  { label: "Weight", value: "16 oz" },
  { label: "Closure", value: "Lace-up" },
  { label: "Use", value: "Training · Technical sparring" },
  { label: "Outer Material", value: "Top-grain cowhide leather" },
  { label: "Leather Thickness", value: "0.9–1.0 mm" },
  { label: "Lining", value: "High-quality 4-way stretch lining" },
  { label: "Palm", value: "Ventilated palm panel · Integrated grip bar" },
  { label: "Thumb", value: "Attached thumb with safety strap" },
  { label: "Wrist", value: "Extended lace-up cuff · Structured wrist support" },
  { label: "Assembly", value: "Hand-assembled in Pakistan" },
];

const visPaddingLayers = ["Multi-foam", "EVA", "Natural latex", "Natural latex"];

const visPackaging = [
  "Rigid presentation box",
  "Silk dust bag",
  "Silk wrapping paper",
  "Authenticity card",
  "Care card",
];

const visService = [
  "Leather cleaning",
  "Leather conditioning",
  "Lace replacement",
];

const visImageSources = {
  hero: "/images/vis-hero.jpg",
  leather: "/images/vis-leather.jpg",
  plate: "/images/vis-logo-detail.jpg",
  packaging: "/images/vis-packaging.jpg",
  videoPoster: "/images/video-poster.jpg",
};

const galleryImages = [
  "/images/gallery-01.jpg",
  "/images/gallery-02.jpg",
  "/images/gallery-03.jpg",
  "/images/gallery-04.jpg",
  "/images/gallery-05.jpg",
  "/images/gallery-06.jpg",
  "/images/gallery-07.jpg",
  "/images/gallery-08.jpg",
  "/images/gallery-09.jpg",
  "/images/gallery-10.jpg",
];

const pillars = [
  {
    title: "Private Client Purchase",
    text: "Every purchase begins with a direct conversation, allowing the brand to deliver a more tailored and elevated buying experience.",
    icon: Crown,
  },
  {
    title: "Luxury Positioning",
    text: "Minimal design, restrained language, and a deliberate sense of scarcity shape how the brand is presented online.",
    icon: Gem,
  },
  {
    title: "Built Around Boxing",
    text: "Designed for professionals, amateurs, Olympians, collectors, and clients who value both performance and presence.",
    icon: Medal,
  },
  {
    title: "White-Glove Support",
    text: "Clients are guided personally through product details, availability, and next steps rather than pushed through a generic checkout flow.",
    icon: ShieldCheck,
  },
];

const audience = [
  "Professionals",
  "Amateurs",
  "Olympians",
  "Collectors",
  "Private clients",
];

const countryOptions = [
  { code: "+52", label: "Mexico" },
  { code: "+1", label: "United States" },
  { code: "+1", label: "Canada" },
  { code: "+34", label: "Spain" },
  { code: "+44", label: "United Kingdom" },
  { code: "+33", label: "France" },
  { code: "+49", label: "Germany" },
  { code: "+39", label: "Italy" },
  { code: "+971", label: "United Arab Emirates" },
  { code: "+974", label: "Qatar" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+54", label: "Argentina" },
  { code: "+57", label: "Colombia" },
  { code: "+56", label: "Chile" },
  { code: "+51", label: "Peru" },
];

const initialWaitlistForm = {
  fullName: "",
  email: "",
  phoneCountryCode: "+52",
  whatsapp: "",
  country: "Mexico",
  clientType: "",
  buyerProfile: "",
  trainingFrequency: "",
  timeline: "",
  productInterest: "",
  ounceInterest: "",
  contactPreference: "",
  message: "",
};

type Route =
  | "/"
  | "/collection"
  | "/praeliator-vis"
  | "/acquisition"
  | "/trust"
  | "/experience"
  | "/clients"
  | "/gallery"
  | "/waitlist"
  | "/contact";

const routeTitles: Record<Route, string> = {
  "/": "Praeliator",
  "/collection": "Collection",
  "/praeliator-vis": "Praeliator VIS",
  "/acquisition": "Acquisition",
  "/trust": "Trust",
  "/experience": "Experience",
  "/clients": "Clients",
  "/gallery": "Gallery",
  "/waitlist": "Waitlist",
  "/contact": "Contact",
};

const navItems: Array<{ label: string; path: Route }> = [
  { label: "Collection", path: "/collection" },
  { label: "VIS", path: "/praeliator-vis" },
  { label: "Acquisition", path: "/acquisition" },
  { label: "Trust", path: "/trust" },
  { label: "Experience", path: "/experience" },
  { label: "Clients", path: "/clients" },
  { label: "Gallery", path: "/gallery" },
  { label: "Waitlist", path: "/waitlist" },
  { label: "Contact", path: "/contact" },
];

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];

const staggerSlow = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: easeLuxury },
  },
};

const pageTransition = {
  initial: { opacity: 0, y: 8, filter: "blur(4px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.05, ease: easeLuxury },
  },
  exit: {
    opacity: 0,
    y: 6,
    filter: "blur(3px)",
    transition: { duration: 0.55, ease: easeLuxury },
  },
};

function normalizePath(pathname: string): Route {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (
    clean === "/" ||
    clean === "/collection" ||
    clean === "/praeliator-vis" ||
    clean === "/acquisition" ||
    clean === "/trust" ||
    clean === "/experience" ||
    clean === "/clients" ||
    clean === "/gallery" ||
    clean === "/waitlist" ||
    clean === "/contact"
  ) {
    return clean as Route;
  }
  return "/";
}

function SectionFrame({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 xl:py-32">
      <div className="max-w-3xl">
        <div className="mb-7 h-px w-20 bg-[linear-gradient(90deg,rgba(185,161,141,0.85),rgba(185,161,141,0))]" />
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-12 sm:mt-14">{children}</div>
    </section>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.95, delay, ease: easeLuxury }}
    >
      {children}
    </motion.div>
  );
}

function RevealStagger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14 }}
      variants={staggerSlow}
    >
      {children}
    </motion.div>
  );
}

function InfoPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div variants={fadeUp} className="border-t border-white/10 pt-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/34 sm:text-[11px]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[#f4efe7] sm:text-[15px]">
        {value}
      </p>
    </motion.div>
  );
}

function LuxuryImagePanel({
  src,
  eyebrow,
  title,
  description,
  heightClass = "min-h-[28rem]",
  onClick,
  compact = false,
  showCta = true,
  ctaLabel = "Open",
}: {
  src: string;
  eyebrow: string;
  title: string;
  description?: string;
  heightClass?: string;
  onClick?: () => void;
  compact?: boolean;
  showCta?: boolean;
  ctaLabel?: string;
}) {
  const isInteractive = typeof onClick === "function";

  const baseClass = `group relative block w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#11100f] text-left shadow-[0_28px_80px_rgba(0,0,0,0.36)] sm:rounded-[2rem] ${heightClass}`;

  const content = (
    <>
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
        whileHover={isInteractive ? { scale: 1.02 } : undefined}
        transition={{ duration: 1.4, ease: easeLuxury }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,6,0.76)_0%,rgba(6,6,6,0.30)_25%,rgba(6,6,6,0.32)_55%,rgba(6,6,6,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,163,90,0.06),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,91,68,0.12),transparent_34%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(9,9,9,0.74)_100%)]" />

      {!compact ? (
        <>
          <div className="absolute left-5 right-5 top-5 z-10 sm:left-8 sm:right-8 sm:top-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#d0b39b] sm:text-[11px]">
                {eyebrow}
              </p>

              <span className="hidden rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/44 sm:inline-block">
                Editorial frame
              </span>
            </div>

            <h3 className="mt-4 max-w-[16rem] text-2xl font-semibold leading-[0.98] tracking-[-0.05em] text-[#f4efe7] sm:max-w-[21rem] sm:text-3xl md:text-[3rem]">
              {title}
            </h3>
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-10 sm:bottom-8 sm:left-8 sm:right-8">
            <div className="flex items-end justify-between gap-4">
              <div className="max-w-[18rem] sm:max-w-sm">
                {description ? (
                  <p className="text-xs leading-6 text-white/68 sm:text-sm sm:leading-7">
                    {description}
                  </p>
                ) : null}
              </div>

              {showCta ? (
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] sm:text-[11px] ${
                      isInteractive
                        ? "text-white/52 transition duration-700 group-hover:text-white/76"
                        : "text-white/40"
                    }`}
                  >
                    {ctaLabel}
                    <span
                      className={`block h-px ${
                        isInteractive
                          ? "w-7 bg-white/28 transition duration-700 group-hover:w-10 group-hover:bg-white/56"
                          : "w-7 bg-white/20"
                      }`}
                    />
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px]">
              {eyebrow}
            </p>

            <span className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-white/42 sm:text-[10px]">
              Editorial frame
            </span>
          </div>

          <div className="mt-4">
            <h3 className="max-w-[12ch] text-[2rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[#f4efe7] sm:text-[2.28rem]">
              {title}
            </h3>

            {description ? (
              <p className="mt-3 max-w-[34rem] text-sm leading-6 text-white/66">
                {description}
              </p>
            ) : null}
          </div>

          {showCta ? (
            <div className="mt-5 flex justify-end">
              <span
                className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] sm:text-[11px] ${
                  isInteractive
                    ? "text-white/52 transition duration-700 group-hover:text-white/76"
                    : "text-white/40"
                }`}
              >
                {ctaLabel}
                <span
                  className={`block h-px ${
                    isInteractive
                      ? "w-7 bg-white/28 transition duration-700 group-hover:w-10 group-hover:bg-white/56"
                      : "w-7 bg-white/20"
                  }`}
                />
              </span>
            </div>
          ) : null}
        </div>
      )}
    </>
  );

  if (isInteractive) {
    return (
      <Reveal>
        <motion.button
          type="button"
          onClick={onClick}
          className={baseClass}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.8, ease: easeLuxury }}
        >
          {content}
        </motion.button>
      </Reveal>
    );
  }

  return (
    <Reveal>
      <div className={baseClass}>{content}</div>
    </Reveal>
  );
}

function FloatingGloveSculpt() {
  const mesh = useRef<any>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.45) * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
      <group ref={mesh} position={[0, 0.1, 0]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <sphereGeometry args={[1.02, 64, 64]} />
          <meshStandardMaterial
            color="#0f0f10"
            metalness={0.35}
            roughness={0.28}
          />
        </mesh>

        <mesh castShadow position={[0.76, -0.2, 0]}>
          <boxGeometry args={[0.7, 1.18, 1.08]} />
          <meshStandardMaterial color="#151311" metalness={0.26} roughness={0.34} />
        </mesh>

        <mesh castShadow position={[-0.2, 0.12, 0.95]}>
          <capsuleGeometry args={[0.12, 1.1, 8, 20]} />
          <meshStandardMaterial color="#201814" metalness={0.18} roughness={0.38} />
        </mesh>

        <mesh castShadow position={[-0.02, 0.14, -0.95]}>
          <capsuleGeometry args={[0.12, 1.1, 8, 20]} />
          <meshStandardMaterial color="#201814" metalness={0.18} roughness={0.38} />
        </mesh>

        <mesh castShadow position={[0.24, 0.12, 0]}>
          <capsuleGeometry args={[0.1, 0.92, 8, 20]} />
          <meshStandardMaterial color="#c6a35a" metalness={0.72} roughness={0.22} />
        </mesh>
      </group>
    </Float>
  );
}

function Hero3DPanel() {
  return (
    <div className="relative h-[24rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(28,22,18,0.8),rgba(10,10,10,1))] shadow-[0_30px_100px_rgba(0,0,0,0.42)] sm:h-[30rem] lg:h-[42rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,163,90,0.08),transparent_24%)]" />
      <Canvas camera={{ position: [0, 0.6, 4.5], fov: 38 }}>
        <ambientLight intensity={0.65} />
        <directionalLight position={[3, 4, 4]} intensity={2.2} />
        <directionalLight position={[-3, -2, -4]} intensity={0.4} />
        <Environment preset="city" />
        <FloatingGloveSculpt />
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.45}
          scale={7}
          blur={2.5}
          far={5}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.55))]" />
    </div>
  );
}

function LuxuryLoaderMark() {
  return (
    <div className="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-sm">
      <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-black/20">
        <DotLottieReact
          src="/lottie/mark.lottie"
          autoplay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
          Signature motion
        </p>
        <p className="mt-1 text-sm text-white/56">
          Drop your `.lottie` mark in `/public/lottie/mark.lottie`
        </p>
      </div>
    </div>
  );
}

function EmblaPreview({
  images,
  onOpenGallery,
}: {
  images: string[];
  onOpenGallery: () => void;
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 28 }, [Fade()]);

  return (
    <Reveal>
      <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#11100f] shadow-[0_22px_70px_rgba(0,0,0,0.34)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a18d]">
            Gallery
          </p>
          <button
            type="button"
            onClick={onOpenGallery}
            className="text-[10px] uppercase tracking-[0.24em] text-white/52 transition duration-500 hover:text-white"
          >
            Open full gallery
          </button>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((src, index) => (
              <div key={src} className="min-w-0 flex-[0_0_100%]">
                <div className="relative aspect-[4/3] sm:aspect-[16/8]">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.45))]" />
                  <div className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function PraeliatorWebsite() {
  const whatsappBase = "https://wa.me/525540658550";
  const createWhatsAppLink = (message: string) =>
    `${whatsappBase}?text=${encodeURIComponent(message)}`;

  const whatsappLink = createWhatsAppLink(
    "Hello Praeliator, I would like to inquire about a private purchase."
  );
  const whatsappVisLink = createWhatsAppLink(
    "Hello Praeliator, I would like to inquire about Praeliator VIS."
  );
  const whatsappCollectorLink = createWhatsAppLink(
    "Hello Praeliator, I would like to inquire about Collector Access and future releases."
  );
  const whatsappGeneralLink = createWhatsAppLink(
    "Hello Praeliator, I would like to learn more about the private purchase process."
  );
  const whatsappWaitlistFollowUpLink = createWhatsAppLink(
    "Hello Praeliator, I joined the waitlist and would like to follow up on my inquiry."
  );

  const emailLink =
    "mailto:praeliatorboxing@gmail.com?subject=Praeliator%20Purchase%20Inquiry";
  const instagramLink = "https://instagram.com/praeliatorboxing";
  const waitlistEndpoint = "https://formsubmit.co/ajax/praeliatorboxing@gmail.com";

  const [route, setRoute] = useState<Route>(() => {
    if (typeof window === "undefined") return "/";
    return normalizePath(window.location.pathname);
  });

  const [waitlistForm, setWaitlistForm] = useState(initialWaitlistForm);
  const [waitlistState, setWaitlistState] = useState({
    loading: false,
    success: false,
    error: "",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroTextRef = useRef<HTMLHeadingElement | null>(null);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const homeFilmRef = useRef<HTMLDivElement | null>(null);

  const heroImageY = useTransform(
    scrollY,
    [0, 900],
    reduceMotion ? [0, 0] : [0, 18]
  );

  const heroTextY = useTransform(
    scrollY,
    [0, 900],
    reduceMotion ? [0, 0] : [0, -8]
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    document.title = `${routeTitles[route]} | Praeliator`;
  }, [route]);

  useEffect(() => {
    if (reduceMotion) return;

    const lenis = new Lenis({
      duration: 1.45,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    const onResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, [reduceMotion]);

  useLayoutEffect(() => {
    if (route !== "/" || reduceMotion || !heroTextRef.current) return;

    const split = new SplitType(heroTextRef.current, {
      types: "lines,words",
      lineClass: "split-line",
      wordClass: "split-word",
    });

    gsap.set(heroTextRef.current.querySelectorAll(".split-word"), {
      yPercent: 110,
      opacity: 0,
    });

    gsap.to(heroTextRef.current.querySelectorAll(".split-word"), {
      yPercent: 0,
      opacity: 1,
      duration: 1.15,
      ease: "power4.out",
      stagger: 0.045,
      delay: 0.1,
    });

    return () => {
      split.revert();
    };
  }, [route, reduceMotion]);

  useGSAP(
    () => {
      if (route !== "/" || reduceMotion) return;

      if (heroSectionRef.current) {
        const cards = heroSectionRef.current.querySelectorAll("[data-home-fade]");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: "top 75%",
            },
          }
        );
      }

      if (homeFilmRef.current) {
        gsap.fromTo(
          homeFilmRef.current,
          { scale: 0.96, opacity: 0.65 },
          {
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: homeFilmRef.current,
              start: "top 85%",
              end: "bottom 30%",
              scrub: 0.8,
            },
          }
        );
      }
    },
    { dependencies: [route, reduceMotion] }
  );

  const currentPageTitle = useMemo(() => routeTitles[route], [route]);

  const goTo = (nextRoute: Route) => {
    if (typeof window !== "undefined") {
      const current = normalizePath(window.location.pathname);

      if (current !== nextRoute) {
        window.history.pushState({}, "", nextRoute);
      }

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }, 80);
    }

    setRoute(nextRoute);
    setMobileMenuOpen(false);
  };

  const currentPurchaseLink =
    route === "/praeliator-vis"
      ? whatsappVisLink
      : route === "/waitlist"
        ? whatsappWaitlistFollowUpLink
        : whatsappGeneralLink;

  const handleWaitlistChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "country") {
      const selectedCountry = countryOptions.find((option) => option.label === value);

      setWaitlistForm((current) => ({
        ...current,
        country: value,
        phoneCountryCode: selectedCountry ? selectedCountry.code : current.phoneCountryCode,
      }));
      return;
    }

    if (name === "phoneCountryCode") {
      setWaitlistForm((current) => ({ ...current, phoneCountryCode: value }));
      return;
    }

    if (name === "whatsapp") {
      const cleanedNumber = value.replace(/[^\d]/g, "");
      setWaitlistForm((current) => ({ ...current, whatsapp: cleanedNumber }));
      return;
    }

    setWaitlistForm((current) => ({ ...current, [name]: value }));
  };

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setWaitlistState({ loading: true, success: false, error: "" });

    const payload = {
      fullName: waitlistForm.fullName.trim(),
      email: waitlistForm.email.trim(),
      phoneCountryCode: waitlistForm.phoneCountryCode.trim(),
      whatsapp: waitlistForm.whatsapp.trim(),
      fullWhatsapp: `${waitlistForm.phoneCountryCode} ${waitlistForm.whatsapp.trim()}`.trim(),
      country: waitlistForm.country.trim(),
      clientType: waitlistForm.clientType.trim(),
      buyerProfile: waitlistForm.buyerProfile.trim(),
      trainingFrequency: waitlistForm.trainingFrequency.trim(),
      timeline: waitlistForm.timeline.trim(),
      productInterest: waitlistForm.productInterest.trim(),
      ounceInterest: waitlistForm.ounceInterest.trim(),
      contactPreference: waitlistForm.contactPreference.trim(),
      message: waitlistForm.message.trim(),
      _subject: "New Praeliator Waitlist Submission",
      _template: "table",
      _captcha: "false",
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.phoneCountryCode ||
      !payload.whatsapp ||
      !payload.country ||
      !payload.clientType ||
      !payload.buyerProfile ||
      !payload.timeline ||
      !payload.productInterest ||
      !payload.contactPreference
    ) {
      setWaitlistState({
        loading: false,
        success: false,
        error: "Please complete all required fields.",
      });
      return;
    }

    try {
      const response = await fetch(waitlistEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || result?.success === "false") {
        throw new Error("Submission failed.");
      }

      setWaitlistState({ loading: false, success: true, error: "" });
      setWaitlistForm(initialWaitlistForm);
    } catch {
      setWaitlistState({
        loading: false,
        success: false,
        error:
          "Submission failed. The first time this is used, you may need to activate the form from the confirmation email sent to praeliatorboxing@gmail.com.",
      });
    }
  };

  const renderHomePage = () => (
    <>
      <section
        ref={heroSectionRef}
        className="relative overflow-hidden border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.18),transparent_36%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[44%] bg-[radial-gradient(circle_at_center,rgba(198,163,90,0.05),transparent_74%)] lg:block" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(0,0,0,0),rgba(185,161,141,0.30),rgba(0,0,0,0))]" />

        <div className="mx-auto grid max-w-[96rem] gap-10 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20 xl:gap-16 xl:py-24">
          <motion.div
            style={{ y: heroTextY }}
            variants={staggerSlow}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex max-w-[35rem] flex-col justify-center"
          >
            <motion.div variants={fadeUp} data-home-fade>
              <div className="inline-flex w-fit items-center rounded-full border border-[#5b4638]/35 bg-[#120f0d]/80 px-3 py-1.5 backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.26em] text-[#d0b39b] sm:text-[11px]">
                  Luxury Boxing House
                </span>
              </div>
            </motion.div>

            <motion.h1
              ref={heroTextRef}
              variants={fadeUp}
              data-home-fade
              className="mt-6 max-w-[31rem] text-4xl font-semibold leading-[0.88] tracking-[-0.06em] sm:text-5xl md:text-7xl xl:text-[5.4rem]"
            >
              Praeliator VIS.
              <span className="mt-2 block max-w-[8ch] text-white/68">
                Discipline, shaped.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              data-home-fade
              className="mt-7 max-w-[28rem] text-sm leading-7 text-white/60 sm:text-base sm:leading-8 md:text-lg"
            >
              A flagship training glove presented with restraint, material clarity, and a
              slower, more deliberate route into the house.
            </motion.p>

            <motion.div
              variants={fadeUp}
              data-home-fade
              className="mt-9 grid gap-3 sm:flex sm:flex-wrap sm:gap-4"
            >
              <Button
                type="button"
                onClick={() => goTo("/praeliator-vis")}
                className="w-full rounded-full border border-[#6b5344]/50 bg-[linear-gradient(180deg,#1a1512_0%,#120f0d_100%)] px-6 py-5 text-sm text-[#f4efe7] shadow-[0_16px_36px_rgba(0,0,0,0.34)] transition duration-500 hover:-translate-y-0.5 hover:border-[#8b6c56]/70 hover:bg-[linear-gradient(180deg,#211916_0%,#16110f_100%)] hover:shadow-[0_22px_44px_rgba(0,0,0,0.42)] sm:w-auto sm:px-7 sm:py-6"
              >
                View VIS
              </Button>

              <Button
                asChild
                className="w-full rounded-full bg-[#efe5d7] px-6 py-5 text-sm text-[#151210] shadow-[0_14px_30px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e6dacb] hover:shadow-[0_20px_40px_rgba(239,229,215,0.22)] sm:w-auto sm:px-7 sm:py-6"
              >
                <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Private Inquiry
                </a>
              </Button>
            </motion.div>

            <RevealStagger className="mt-11 grid max-w-[26rem] grid-cols-2 gap-x-8 gap-y-6">
              <InfoPill label="Position" value="Flagship model" />
              <InfoPill label="Acquisition" value="Direct inquiry" />
              <div className="col-span-2 max-w-[12rem]">
                <InfoPill label="Presentation" value="Luxury boxed" />
              </div>
            </RevealStagger>

            <Reveal className="mt-8 max-w-[26rem]" delay={0.15}>
              <LuxuryLoaderMark />
            </Reveal>
          </motion.div>

          <motion.div
            style={{ y: heroImageY }}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.3, ease: easeLuxury }}
            className="relative lg:-mr-4 xl:-mr-8"
          >
            <Hero3DPanel />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0c0b]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.18em] text-white/40 sm:gap-x-16 sm:text-sm sm:tracking-[0.26em]">
              {audience.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs">
                Flagship
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl md:text-5xl">
                The house begins with VIS.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                One expression. One route. One product that defines how the brand is
                understood before the first expansion ever begins.
              </p>

              <div className="mt-9 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
                <Button
                  type="button"
                  onClick={() => goTo("/praeliator-vis")}
                  className="w-full rounded-full border border-[#6b5344]/50 bg-[linear-gradient(180deg,#1a1512_0%,#120f0d_100%)] px-6 py-5 text-sm text-[#f4efe7] shadow-[0_12px_28px_rgba(0,0,0,0.32)] transition duration-500 hover:-translate-y-0.5 hover:border-[#8b6c56]/70 hover:shadow-[0_18px_38px_rgba(0,0,0,0.38)] sm:w-auto sm:py-6"
                >
                  View VIS
                </Button>

                <Button
                  asChild
                  className="w-full rounded-full bg-[#efe5d7] px-6 py-5 text-sm text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto sm:py-6"
                >
                  <a href={whatsappVisLink} target="_blank" rel="noreferrer">
                    Request Acquisition
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-8 border-t border-white/10 pt-6 lg:pt-0">
              <div className="lg:max-w-[24rem]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#b9a18d] sm:text-[11px]">
                  Acquisition
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  No open-cart theatre. No generic checkout energy. The route is quieter,
                  more deliberate, and more aligned with the house.
                </p>
              </div>

              <div className="lg:ml-auto lg:max-w-[22rem]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#b9a18d] sm:text-[11px]">
                  Presentation
                </p>
                <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  Box, dust bag, paper, authenticity, and care. The object extends beyond
                  the glove and the experience begins before opening.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo("/acquisition")}
                  className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                >
                  Explore Acquisition
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-b border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#0a0a0a_100%)]">
        <div className="mx-auto max-w-[92rem] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div ref={homeFilmRef}>
            <Reveal>
              <div className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-[#11100f] shadow-[0_30px_90px_rgba(0,0,0,0.36)]">
                <div className="relative mx-auto aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/9] lg:max-w-[82rem]">
                  <video
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={visImageSources.videoPoster}
                  >
                    <source src="/videos/praeliator-film.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <EmblaPreview
          images={galleryImages}
          onOpenGallery={() => goTo("/gallery")}
        />
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#080808_100%)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 xl:py-20">
          <Reveal>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.34em]">
                Private Access
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:mt-4 sm:text-3xl md:text-4xl">
                Request acquisition or enter the waitlist.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/waitlist")}
                className="w-full rounded-full border-white/15 bg-transparent px-6 py-5 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto sm:py-6"
              >
                Join Waitlist
              </Button>

              <Button
                asChild
                className="w-full rounded-full bg-[#efe5d7] px-6 py-5 text-sm text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto sm:py-6"
              >
                <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                  Private Inquiry
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );

  const renderAcquisitionPage = () => (
    <SectionFrame
      eyebrow="Acquisition"
      title="How acquisition works at Praeliator."
      description="The acquisition process is direct, controlled, and personal. This page clarifies what a serious buyer should expect before making contact."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <Reveal>
          <div className="rounded-[1.6rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Process
            </p>

            <div className="mt-5 grid gap-4 sm:mt-6">
              {[
                [
                  "01",
                  "Inquiry",
                  "The client enters through WhatsApp or email rather than conventional checkout.",
                ],
                [
                  "02",
                  "Qualification",
                  "Praeliator confirms intent, product interest, and the correct route for the client.",
                ],
                [
                  "03",
                  "Confirmation",
                  "Availability, delivery scope, and next steps are clarified directly.",
                ],
                [
                  "04",
                  "Acquisition",
                  "Purchase is completed through private client communication rather than a mass-market transaction flow.",
                ],
              ].map(([step, title, text]) => (
                <div
                  key={step}
                  className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 sm:p-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                    {step}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold sm:text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[1.6rem] border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0d0b0a_100%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Frequently Asked
            </p>

            <div className="mt-5 grid gap-4 sm:mt-6">
              {[
                ["How do I buy?", "Through direct inquiry, not open checkout."],
                [
                  "Is VIS always available?",
                  "Availability is confirmed directly through client service.",
                ],
                [
                  "What is included?",
                  "Presentation box, silk dust bag, silk wrapping paper, authenticity card, and care card.",
                ],
                [
                  "Is there aftercare?",
                  "Yes. Praeliator Legacy Refresh is available after the first year.",
                ],
                [
                  "Do you ship internationally?",
                  "Shipping scope is confirmed during inquiry based on destination.",
                ],
              ].map(([q, a]) => (
                <div
                  key={q}
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  <h3 className="text-base font-medium sm:text-lg">{q}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65">{a}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
              <Button
                asChild
                className="w-full rounded-full bg-[#efe5d7] px-6 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto"
              >
                <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                  Private Purchase Inquiry
                </a>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/contact")}
                className="w-full rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
              >
                Contact Page
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionFrame>
  );

  const renderCollectionPage = () => (
    <SectionFrame
      eyebrow="Collection"
      title="The collection deserves its own frame."
      description="This page presents Praeliator products as selective acquisitions rather than standard ecommerce listings."
    >
      <div className="divide-y divide-white/10 border-t border-white/10">
        {products.map((product, index) => {
          const isVis = product.name === "Praeliator VIS";
          const isOdd = index % 2 === 1;

          return (
            <Reveal key={product.name}>
              <div
                className={`grid gap-8 py-10 lg:items-center lg:gap-14 lg:py-16 ${
                  isOdd ? "lg:grid-cols-[1.08fr_0.92fr]" : "lg:grid-cols-[0.92fr_1.08fr]"
                }`}
              >
                <div
                  className={`${isOdd ? "lg:order-2 lg:pl-6 xl:pl-12" : "lg:pr-6 xl:pr-12"}`}
                >
                  <div
                    className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,#151210_0%,#0f0d0c_100%)] shadow-[0_22px_70px_rgba(0,0,0,0.32)] ${
                      index === 0
                        ? "min-h-[24rem] sm:min-h-[30rem] lg:min-h-[36rem]"
                        : index === 1
                          ? "min-h-[18rem] sm:min-h-[22rem] lg:min-h-[24rem]"
                          : "min-h-[20rem] sm:min-h-[24rem] lg:min-h-[28rem]"
                    } ${isOdd ? "lg:mt-12" : ""}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,163,90,0.08),transparent_28%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,91,68,0.14),transparent_34%)]" />
                    <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(9,9,9,0.72)_100%)]" />

                    <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px]">
                          {product.category}
                        </p>
                        <Package className="h-5 w-5 text-white/35" />
                      </div>

                      <div className="max-w-[16rem]">
                        <h3 className="text-[2rem] font-semibold leading-[0.92] tracking-[-0.05em] text-[#f4efe7] sm:text-[2.5rem]">
                          {product.name}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-white/55 sm:leading-8">
                          {product.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${isOdd ? "lg:order-1" : ""}`}>
                  <div className={`${isOdd ? "max-w-2xl" : "max-w-[38rem]"}`}>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d] sm:text-xs">
                      {product.category}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-[3.1rem]">
                      {product.name}
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                      {product.description}
                    </p>

                    <p className="mt-4 text-sm leading-7 text-white/45 sm:leading-8">
                      {product.longDescription}
                    </p>

                    <div className="mt-6 border-t border-white/10 pt-5">
                      <p className="text-lg font-medium">{product.price}</p>
                      <p className="mt-2 text-sm text-white/50">{product.note}</p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        asChild
                        className="rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)]"
                      >
                        <a
                          href={isVis ? whatsappVisLink : whatsappCollectorLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Request Acquisition
                        </a>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => goTo(isVis ? "/praeliator-vis" : "/waitlist")}
                        className="rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                      >
                        {isVis ? "View VIS" : "Join Waitlist"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionFrame>
  );

  const renderVisPage = () => (
    <SectionFrame
      eyebrow="Praeliator VIS"
      title="A flagship training glove shaped by restraint, structure, and intent."
      description="Praeliator VIS is built for disciplined training and technical sparring. It is presented as a luxury acquisition: materially specific, visually controlled, and service-backed."
    >
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <Reveal>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Flagship Product
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:mt-4 sm:text-4xl md:text-5xl">
              Praeliator VIS
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:mt-6 sm:text-base sm:leading-8">
              A 16 oz lace-up training glove built in top-grain cowhide leather with a
              soft satin finish and a restrained two-tone character. Deep black remains
              the primary visual read, while a minimal espresso tone reveals itself
              depending on light direction.
            </p>

            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
              <InfoPill label="Weight" value="16 oz" />
              <InfoPill label="Closure" value="Lace-up" />
              <InfoPill label="Use" value="Training / sparring" />
            </div>

            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <Button
                asChild
                className="w-full rounded-full bg-[#efe5d7] px-6 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto"
              >
                <a href={whatsappVisLink} target="_blank" rel="noreferrer">
                  Private Purchase Inquiry
                </a>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/waitlist")}
                className="w-full rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[1.6rem] border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0d0b0a_100%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] sm:p-8 md:p-10">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Visual Identity
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
              Minimal branding. Controlled presence.
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/65 sm:mt-5 sm:leading-8">
              External branding is deliberately restrained. The primary visible marking is
              a debossed PRAELIATOR logo on the wrist strap plate. The leather finish is
              soft satin rather than gloss, and the black surface carries a subtle
              espresso reveal under changing light.
            </p>

            <div className="mt-6 divide-y divide-white/10 border-t border-white/10 sm:mt-8">
              <div className="py-4 sm:py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Primary tone
                </p>
                <p className="mt-2 text-base font-medium sm:text-lg">Deep black</p>
              </div>

              <div className="py-4 sm:py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                  Secondary tone
                </p>
                <p className="mt-2 text-base font-medium sm:text-lg">Espresso brown</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <LuxuryImagePanel
          src={visImageSources.hero}
          eyebrow="Praeliator VIS"
          title="The silhouette carries the house."
          description="Black remains dominant. Espresso appears only when light breaks across the leather."
          heightClass="min-h-[22rem] sm:min-h-[28rem] lg:min-h-[42rem]"
          showCta={false}
        />

        <div className="grid gap-6 lg:gap-8">
          <LuxuryImagePanel
            src={visImageSources.leather}
            eyebrow="Leather Finish"
            title="Soft satin. Quiet depth."
            description="Top-grain cowhide with a restrained two-tone response under shifting light."
            heightClass="min-h-[15rem] sm:min-h-[16rem]"
            compact
            showCta={false}
          />

          <LuxuryImagePanel
            src={visImageSources.plate}
            eyebrow="Wrist Plate"
            title="Debossed, not announced."
            description="Branding remains controlled and deliberate."
            heightClass="min-h-[15rem] sm:min-h-[16rem]"
            compact
            showCta={false}
          />

          <LuxuryImagePanel
            src={visImageSources.packaging}
            eyebrow="Presentation"
            title="Presented as acquisition, not shipment."
            description="Rigid box, silk dust bag, wrapping paper, authenticity card, and care card."
            heightClass="min-h-[15rem] sm:min-h-[16rem]"
            compact
            showCta={false}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <Reveal>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Specifications
            </p>

            <div className="mt-5 grid gap-4 sm:mt-6">
              {visSpecifications.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-white/40 sm:text-sm">
                    {item.label}
                  </p>
                  <p className="text-sm text-white/80 sm:text-right">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Padding System
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
              Four-layer impact structure
            </h3>

            <div className="mt-5 divide-y divide-white/10 border-t border-white/10 sm:mt-6">
              {visPaddingLayers.map((layer, index) => (
                <div
                  key={`${layer}-${index}`}
                  className="grid gap-3 py-4 sm:grid-cols-[88px_1fr] sm:items-center sm:py-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                    Layer {index + 1}
                  </p>
                  <p className="text-base font-medium sm:text-lg">{layer}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
        <Reveal>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Packaging
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
              Presented as acquisition, not shipment.
            </h3>

            <div className="mt-5 divide-y divide-white/10 border-t border-white/10 sm:mt-6">
              {visPackaging.map((item) => (
                <div key={item} className="py-4 sm:py-5">
                  <p className="text-sm leading-7 text-white/80 sm:leading-8">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Aftercare
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
              Praeliator Legacy Refresh
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/65 sm:mt-5 sm:leading-8">
              Available after the first year, this service extends the life and finish of
              the glove through maintenance rather than replacement culture.
            </p>

            <div className="mt-6 divide-y divide-white/10 border-t border-white/10 sm:mt-8">
              {visService.map((item) => (
                <div key={item} className="py-4 sm:py-5">
                  <p className="text-sm leading-7 text-white/80 sm:leading-8">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionFrame>
  );

  const renderTrustPage = () => (
    <SectionFrame
      eyebrow="Trust"
      title="Credibility built into the brand architecture."
      description="Praeliator should not rely on hype to feel legitimate. This page communicates material seriousness, construction clarity, aftercare, and the logic behind the private client model."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <Reveal>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Construction Integrity
            </p>

            <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
              {[
                [
                  "Top-grain cowhide leather",
                  "Built in top-grain cowhide with a 0.9–1.0 mm leather thickness for a controlled, premium surface.",
                ],
                [
                  "Four-layer impact structure",
                  "Multi-foam, EVA, and dual natural latex layers define the internal protection system.",
                ],
                [
                  "4-way stretch lining",
                  "The internal lining is chosen to support comfort, fit response, and sustained use in training.",
                ],
                [
                  "Extended lace-up cuff",
                  "The cuff and wrist structure are built to reinforce support rather than rely on superficial bulk.",
                ],
              ].map(([title, text]) => (
                <div key={title} className="py-5 sm:py-6">
                  <h3 className="text-base font-medium sm:text-lg">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65 sm:leading-8">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[1.6rem] border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0d0b0a_100%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Brand Assurance
            </p>

            <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
              {[
                [
                  "Hand-assembled",
                  "Each pair is hand-assembled rather than presented as anonymous mass production.",
                ],
                [
                  "Made in Pakistan",
                  "The manufacturing origin is stated directly rather than hidden behind vague brand language.",
                ],
                [
                  "Authenticity card included",
                  "Presentation includes an authenticity card to reinforce legitimacy and ownership.",
                ],
                [
                  "Legacy Refresh service",
                  "Praeliator supports long-term care through leather cleaning, conditioning, and lace replacement after year one.",
                ],
              ].map(([title, text]) => (
                <div key={title} className="py-5 sm:py-6">
                  <h3 className="text-base font-medium sm:text-lg">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/65 sm:leading-8">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
        <Reveal>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Trust Signals
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              What reinforces the house.
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/65 sm:leading-8">
              Trust improves when the brand speaks in specifics: what the client receives,
              how the object is built, and what happens after delivery.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="divide-y divide-white/10 border-t border-white/10">
            {[
              {
                title: "Authenticity",
                text: "Presentation is specific: box, dust bag, wrapping paper, authenticity card, and care card.",
              },
              {
                title: "Aftercare",
                text: "A glove positioned as luxury should not end at delivery. Refresh service strengthens continuity and stewardship.",
              },
              {
                title: "Private Client Logic",
                text: "The inquiry-led model exists to preserve control, clarity, and a more tailored acquisition process.",
              },
            ].map((item) => (
              <div key={item.title} className="py-5 sm:py-6">
                <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/65 sm:leading-8">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08} className="mt-10">
        <div className="rounded-[1.6rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8 md:p-10">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
            Why this matters
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
            Luxury without proof is decoration.
          </h3>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:mt-5 sm:leading-8">
            Praeliator gains credibility when it speaks in specifics: material, thickness,
            assembly, structure, service, and presentation. Trust architecture is not
            filler. It is the layer that makes the brand feel deliberate rather than
            theatrical.
          </p>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
            <Button
              asChild
              className="w-full rounded-full bg-[#efe5d7] px-6 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto"
            >
              <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                Discuss Acquisition
              </a>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/praeliator-vis")}
              className="w-full rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
            >
              View VIS
            </Button>
          </div>
        </div>
      </Reveal>
    </SectionFrame>
  );

  const renderExperiencePage = () => (
    <SectionFrame
      eyebrow="Experience"
      title="Why the Praeliator journey is intentionally slower."
      description="This page explains the brand model: less transactional, more selective, more personal."
    >
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <Reveal>
          <div>
            <p className="max-w-sm text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              The experience is designed to feel measured from first inquiry to final
              delivery.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="divide-y divide-white/10 border-t border-white/10">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <div
                  key={pillar.title}
                  className="grid gap-4 py-6 sm:grid-cols-[88px_1fr] sm:gap-6"
                >
                  <div className="flex items-start gap-3 sm:block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#b9a18d]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="mt-2 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 sm:flex">
                      <Icon className="h-4 w-4 text-[#b9a18d]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                      {pillar.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </SectionFrame>
  );

  const renderClientsPage = () => (
    <SectionFrame
      eyebrow="Clients"
      title="Built for serious fighters and serious buyers."
      description="This page isolates the intended audience so the brand feels exact rather than generic."
    >
      <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12">
        <Reveal>
          <div>
            <p className="max-w-sm text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              The audience should read as specific, not broad. The page exists to narrow
              the brand rather than widen it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="divide-y divide-white/10 border-t border-white/10">
            {audience.map((item, index) => (
              <div
                key={item}
                className="grid gap-4 py-5 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-6"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#b9a18d] sm:text-[11px]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                    {item}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/65 sm:leading-8">
                    A dedicated audience category within the Praeliator ecosystem, presented
                    with sharper focus and stronger positioning.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </SectionFrame>
  );

  const renderGalleryPage = () => (
    <SectionFrame eyebrow="Gallery" title="Gallery">
      <Reveal>
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-4 w-4 text-[#b9a18d]" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs">
              Gallery
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => goTo("/")}
            className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
          >
            Return Home
          </Button>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {galleryImages.map((src, index) => (
          <Reveal key={src} delay={index * 0.03}>
            <motion.div
              className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#11100f] shadow-[0_18px_52px_rgba(0,0,0,0.28)] ${
                index === 0 || index === 4 || index === 7
                  ? "aspect-[4/5]"
                  : index === 2 || index === 8
                    ? "aspect-[5/4]"
                    : "aspect-square"
              }`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.8, ease: easeLuxury }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${src})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.46))]" />
              <div className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58 backdrop-blur-sm">
                {String(index + 1).padStart(2, "0")}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </SectionFrame>
  );

  const renderWaitlistPage = () => (
    <SectionFrame
      eyebrow="Waitlist"
      title="Controlled access deserves its own frame."
      description="This page is dedicated to future-release demand, collector access, and waitlist intake routed directly to your email."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <Reveal>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Waitlist Logic
            </p>

            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              Why a waitlist matters
            </h3>

            <p className="mt-4 text-sm leading-7 text-white/65 sm:leading-8">
              A luxury brand should not feel endlessly available. A dedicated waitlist page
              strengthens demand, selectivity, and restraint.
            </p>

            <div className="mt-6 divide-y divide-white/10 border-t border-white/10 sm:mt-8">
              {[
                "Supports controlled access.",
                "Separates intent from casual browsing.",
                "Creates a cleaner path for future releases.",
              ].map((item) => (
                <div key={item} className="py-4 sm:py-5">
                  <p className="text-sm leading-7 text-white/65 sm:leading-8">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8 md:p-10">
            <form className="grid gap-4" onSubmit={handleWaitlistSubmit}>
              <input
                name="fullName"
                autoComplete="name"
                value={waitlistForm.fullName}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none placeholder:text-white/30"
                placeholder="Full name *"
              />

              <input
                name="email"
                type="email"
                autoComplete="email"
                value={waitlistForm.email}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none placeholder:text-white/30"
                placeholder="Email address *"
              />

              <select
                name="country"
                value={waitlistForm.country}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                {countryOptions.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
                <select
                  name="phoneCountryCode"
                  value={waitlistForm.phoneCountryCode}
                  onChange={handleWaitlistChange}
                  className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-4 text-sm text-[#f4efe7] outline-none"
                >
                  {countryOptions.map((option) => (
                    <option key={`${option.label}-${option.code}`} value={option.code}>
                      {`${option.code} · ${option.label}`}
                    </option>
                  ))}
                </select>

                <input
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  value={waitlistForm.whatsapp}
                  onChange={handleWaitlistChange}
                  className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none placeholder:text-white/30"
                  placeholder="Phone number *"
                />
              </div>

              <select
                name="clientType"
                value={waitlistForm.clientType}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                <option value="">Client type *</option>
                <option value="Professional">Professional</option>
                <option value="Amateur">Amateur</option>
                <option value="Olympian">Olympian</option>
                <option value="Collector">Collector</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="buyerProfile"
                value={waitlistForm.buyerProfile}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                <option value="">Buyer profile *</option>
                <option value="Personal use">Personal use</option>
                <option value="Collector">Collector</option>
                <option value="Gift">Gift</option>
                <option value="Gym / team purchase">Gym / team purchase</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="trainingFrequency"
                value={waitlistForm.trainingFrequency}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                <option value="">Training frequency</option>
                <option value="Daily">Daily</option>
                <option value="4–6 times per week">4–6 times per week</option>
                <option value="2–3 times per week">2–3 times per week</option>
                <option value="Occasionally">Occasionally</option>
                <option value="Not applicable">Not applicable</option>
              </select>

              <select
                name="timeline"
                value={waitlistForm.timeline}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                <option value="">Purchase timeline *</option>
                <option value="Ready now">Ready now</option>
                <option value="Within 30 days">Within 30 days</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="Researching only">Researching only</option>
              </select>

              <select
                name="productInterest"
                value={waitlistForm.productInterest}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                <option value="">Product interest *</option>
                <option value="Praeliator VIS">Praeliator VIS</option>
                <option value="Collector Access">Collector Access</option>
                <option value="Future Releases">Future Releases</option>
                <option value="General Brand Interest">General Brand Interest</option>
              </select>

              <select
                name="ounceInterest"
                value={waitlistForm.ounceInterest}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                <option value="">Glove ounce interest</option>
                <option value="10 oz">10 oz</option>
                <option value="12 oz">12 oz</option>
                <option value="14 oz">14 oz</option>
                <option value="16 oz">16 oz</option>
                <option value="Unsure">Unsure</option>
              </select>

              <select
                name="contactPreference"
                value={waitlistForm.contactPreference}
                onChange={handleWaitlistChange}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none"
              >
                <option value="">Preferred contact method *</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
                <option value="Either">Either</option>
              </select>

              <textarea
                name="message"
                value={waitlistForm.message}
                onChange={handleWaitlistChange}
                className="min-h-[130px] rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 py-4 text-sm text-[#f4efe7] outline-none placeholder:text-white/30"
                placeholder="Add any relevant detail about intended use, fit preference, or purchase context"
              />

              <Button
                type="submit"
                disabled={waitlistState.loading}
                className="h-14 w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {waitlistState.loading ? "Submitting..." : "Join Waitlist"}
              </Button>

              {waitlistState.success ? (
                <p className="text-sm leading-6 text-[#d7c5ae]">
                  You are on the list. The submission has been routed to
                  praeliatorboxing@gmail.com.
                </p>
              ) : null}

              {waitlistState.error ? (
                <p className="text-sm leading-6 text-[#d99b8d]">{waitlistState.error}</p>
              ) : null}
            </form>
          </div>
        </Reveal>
      </div>
    </SectionFrame>
  );

  const renderContactPage = () => (
    <SectionFrame
      eyebrow="Contact"
      title="Direct channels for private client communication."
      description="This page centralizes the channels that matter: WhatsApp, email, and Instagram."
    >
      <Reveal>
        <div className="divide-y divide-white/10 border-t border-white/10">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 py-5 transition duration-500 hover:bg-white/[0.02] sm:py-6"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 sm:h-12 sm:w-12 sm:rounded-2xl">
                <MessageCircle className="h-5 w-5 text-[#b9a18d]" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">WhatsApp Client Service</p>
                <p className="text-sm text-white/45">
                  Preferred for private purchase inquiries
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-white/35" />
          </a>

          <a
            href={emailLink}
            className="flex items-center justify-between gap-4 py-5 transition duration-500 hover:bg-white/[0.02] sm:py-6"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Mail className="h-5 w-5 text-[#b9a18d]" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-white/45">
                  For formal inquiries and brand communication
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-white/35" />
          </a>

          <a
            href={instagramLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-4 py-5 transition duration-500 hover:bg-white/[0.02] sm:py-6"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Instagram className="h-5 w-5 text-[#b9a18d]" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">Instagram</p>
                <p className="text-sm text-white/45">
                  Visual presence, updates, and brand atmosphere
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-white/35" />
          </a>
        </div>
      </Reveal>
    </SectionFrame>
  );

  const renderPage = () => {
    switch (route) {
      case "/collection":
        return renderCollectionPage();
      case "/praeliator-vis":
        return renderVisPage();
      case "/acquisition":
        return renderAcquisitionPage();
      case "/trust":
        return renderTrustPage();
      case "/experience":
        return renderExperiencePage();
      case "/clients":
        return renderClientsPage();
      case "/gallery":
        return renderGalleryPage();
      case "/waitlist":
        return renderWaitlistPage();
      case "/contact":
        return renderContactPage();
      default:
        return renderHomePage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4efe7]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <motion.button
            type="button"
            onClick={() => goTo("/")}
            whileHover={{ scale: 1.02, y: -1 }}
            transition={{ duration: 0.55, ease: easeLuxury }}
            className="group flex min-w-0 items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#6a4f3e] bg-[#120f0d] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:h-11 sm:w-11">
              <div className="flex h-full w-full items-center justify-center p-[3px] sm:p-[4px]">
                <img
                  src="/logo-header.png"
                  alt="Praeliator"
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] uppercase tracking-[0.28em] text-[#b9a18d] transition duration-500 group-hover:text-[#d7b797] sm:text-xs sm:tracking-[0.35em]">
                Praeliator
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.20em] text-white/45 sm:text-[11px] sm:tracking-[0.28em]">
                {currentPageTitle}
              </p>
            </div>
          </motion.button>

          <nav className="hidden items-center gap-6 text-sm text-white/68 lg:flex xl:gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                className="relative transition duration-500 hover:text-white"
              >
                <span>{item.label}</span>
                {item.path === "/" ? null : null}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {route !== "/" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/")}
                className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/waitlist")}
                className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                Join Waitlist
              </Button>
            )}

            <Button
              asChild
              className="rounded-full bg-[#efe5d7] px-5 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)]"
            >
              <a href={currentPurchaseLink} target="_blank" rel="noreferrer">
                Private Purchase
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              className="rounded-full bg-[#efe5d7] px-3 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:px-5"
            >
              <a href={currentPurchaseLink} target="_blank" rel="noreferrer">
                Inquire
              </a>
            </Button>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-500 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.7, ease: easeLuxury }}
              className="overflow-hidden border-t border-white/10 bg-[#0a0a0a] lg:hidden"
            >
              <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white/80 transition duration-500 hover:bg-white/10"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-white/35" />
                  </button>
                ))}

                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goTo(route !== "/" ? "/" : "/waitlist")}
                    className="h-12 rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    {route !== "/" ? "Return Home" : "Join Waitlist"}
                  </Button>

                  <Button
                    asChild
                    className="h-12 rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)]"
                  >
                    <a href={currentPurchaseLink} target="_blank" rel="noreferrer">
                      Private Purchase
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.08),transparent_30%)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#080808_100%)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-white/45 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="uppercase tracking-[0.24em] text-[#b9a18d] sm:tracking-[0.3em]">
              Praeliator
            </p>
            <p className="mt-2">Luxury boxing brand. Private client acquisition.</p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                className="transition duration-500 hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}