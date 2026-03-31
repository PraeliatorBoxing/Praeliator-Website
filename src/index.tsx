
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Lenis from "lenis";
import {
  ArrowLeft,
  ChevronRight,
  Instagram,
  Mail,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";

const visSpecifications = [
  { label: "Type", value: "Training boxing gloves" },
  { label: "Price", value: "$6,000 MXN" },
  { label: "Weight", value: "16 oz" },
  { label: "Closure", value: "Lace-up" },
  { label: "Use", value: "Training · Technical sparring" },
  { label: "Outer Material", value: "Top-grain cowhide leather" },
  { label: "Leather Thickness", value: "0.9–1.0 mm" },
  { label: "Lining", value: "4-way stretch lining" },
  { label: "Palm", value: "Ventilated palm panel · Integrated grip bar" },
  { label: "Thumb", value: "Attached thumb" },
  { label: "Wrist", value: "Extended lace-up cuff" },
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

const constructionEvidence = [
  {
    label: "Construction",
    value:
      "Top-grain cowhide, balanced structure, ventilated palm, extended lace-up cuff.",
  },
  {
    label: "Presentation",
    value:
      "Rigid box, silk dust bag, silk wrapping, authenticity card, care card.",
  },
  {
    label: "Ownership",
    value:
      "Allocation, delivery, aftercare.",
  },
];

const trustArchitecture = [
  {
    title: "Inquiry",
    text:
      "Private review and client reference.",
  },
  {
    title: "Delivery",
    text:
      "Allocation, dispatch, confirmation.",
  },
  {
    title: "Aftercare",
    text:
      "Maintenance and continued service.",
  },
];

const ownershipSignals = [
  { label: "Allocation", value: "Held under the client record." },
  { label: "Authenticity", value: "Linked to the order record." },
  { label: "Delivery", value: "Tracked through dispatch and receipt." },
  { label: "Aftercare", value: "Retained under ownership history." },
];

const serviceStandards = [
  "Inquiry entered into the client record.",
  "Follow-up handled directly.",
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
  "/images/gallery-03.jpg",
  "/images/gallery-06.jpg",
  "/images/gallery-09.jpg",
];

const homeImageSources = {
  hero: galleryImages[0],
  videoPoster: galleryImages[1],
  material: galleryImages[2],
  presentation: galleryImages[3],
};

const countryOptions = [
  { code: "+93", label: "Afghanistan" },
  { code: "+355", label: "Albania" },
  { code: "+213", label: "Algeria" },
  { code: "+1684", label: "American Samoa" },
  { code: "+244", label: "Angola" },
  { code: "+1264", label: "Anguilla" },
  { code: "+1268", label: "Antigua and Barbuda" },
  { code: "+54", label: "Argentina" },
  { code: "+374", label: "Armenia" },
  { code: "+297", label: "Aruba" },
  { code: "+61", label: "Australia" },
  { code: "+43", label: "Austria" },
  { code: "+994", label: "Azerbaijan" },
  { code: "+973", label: "Bahrain" },
  { code: "+880", label: "Bangladesh" },
  { code: "+1246", label: "Barbados" },
  { code: "+375", label: "Belarus" },
  { code: "+32", label: "Belgium" },
  { code: "+501", label: "Belize" },
  { code: "+229", label: "Benin" },
  { code: "+1441", label: "Bermuda" },
  { code: "+975", label: "Bhutan" },
  { code: "+387", label: "Bosnia and Herzegovina" },
  { code: "+267", label: "Botswana" },
  { code: "+55", label: "Brazil" },
  { code: "+246", label: "British Indian Ocean Territory" },
  { code: "+359", label: "Bulgaria" },
  { code: "+226", label: "Burkina Faso" },
  { code: "+257", label: "Burundi" },
  { code: "+855", label: "Cambodia" },
  { code: "+237", label: "Cameroon" },
  { code: "+1", label: "Canada" },
  { code: "+1345", label: "Cayman Islands" },
  { code: "+236", label: "Central African Republic" },
  { code: "+235", label: "Chad" },
  { code: "+56", label: "Chile" },
  { code: "+86", label: "China" },
  { code: "+61", label: "Christmas Island" },
  { code: "+61", label: "Cocos (Keeling) Islands" },
  { code: "+57", label: "Colombia" },
  { code: "+269", label: "Comoros" },
  { code: "+682", label: "Cook Islands" },
  { code: "+506", label: "Costa Rica" },
  { code: "+385", label: "Croatia" },
  { code: "+53", label: "Cuba" },
  { code: "+357", label: "Cyprus" },
  { code: "+45", label: "Denmark" },
  { code: "+253", label: "Djibouti" },
  { code: "+1767", label: "Dominica" },
  { code: "+1809", label: "Dominican Republic" },
  { code: "+593", label: "Ecuador" },
  { code: "+20", label: "Egypt" },
  { code: "+503", label: "El Salvador" },
  { code: "+240", label: "Equatorial Guinea" },
  { code: "+291", label: "Eritrea" },
  { code: "+372", label: "Estonia" },
  { code: "+251", label: "Ethiopia" },
  { code: "+298", label: "Faroe Islands" },
  { code: "+679", label: "Fiji" },
  { code: "+358", label: "Finland" },
  { code: "+33", label: "France" },
  { code: "+594", label: "French Guiana" },
  { code: "+689", label: "French Polynesia" },
  { code: "+241", label: "Gabon" },
  { code: "+995", label: "Georgia" },
  { code: "+49", label: "Germany" },
  { code: "+233", label: "Ghana" },
  { code: "+350", label: "Gibraltar" },
  { code: "+30", label: "Greece" },
  { code: "+299", label: "Greenland" },
  { code: "+1473", label: "Grenada" },
  { code: "+590", label: "Guadeloupe" },
  { code: "+1671", label: "Guam" },
  { code: "+502", label: "Guatemala" },
  { code: "+44", label: "Guernsey" },
  { code: "+224", label: "Guinea" },
  { code: "+245", label: "Guinea-Bissau" },
  { code: "+592", label: "Guyana" },
  { code: "+509", label: "Haiti" },
    { code: "+504", label: "Honduras" },
  { code: "+852", label: "Hong Kong" },
  { code: "+36", label: "Hungary" },
  { code: "+354", label: "Iceland" },
  { code: "+91", label: "India" },
  { code: "+62", label: "Indonesia" },
  { code: "+964", label: "Iraq" },
  { code: "+353", label: "Ireland" },
  { code: "+44", label: "Isle of Man" },
  { code: "+972", label: "Israel" },
  { code: "+39", label: "Italy" },
  { code: "+1876", label: "Jamaica" },
  { code: "+81", label: "Japan" },
  { code: "+44", label: "Jersey" },
  { code: "+962", label: "Jordan" },
  { code: "+7", label: "Kazakhstan" },
  { code: "+254", label: "Kenya" },
  { code: "+686", label: "Kiribati" },
  { code: "+965", label: "Kuwait" },
  { code: "+996", label: "Kyrgyzstan" },
  { code: "+856", label: "Lao People's Democratic Republic" },
  { code: "+371", label: "Latvia" },
  { code: "+961", label: "Lebanon" },
  { code: "+266", label: "Lesotho" },
  { code: "+231", label: "Liberia" },
  { code: "+218", label: "Libya" },
  { code: "+423", label: "Liechtenstein" },
  { code: "+370", label: "Lithuania" },
  { code: "+352", label: "Luxembourg" },
  { code: "+261", label: "Madagascar" },
  { code: "+265", label: "Malawi" },
  { code: "+60", label: "Malaysia" },
  { code: "+960", label: "Maldives" },
  { code: "+223", label: "Mali" },
  { code: "+356", label: "Malta" },
  { code: "+692", label: "Marshall Islands" },
  { code: "+596", label: "Martinique" },
  { code: "+222", label: "Mauritania" },
  { code: "+230", label: "Mauritius" },
  { code: "+262", label: "Mayotte" },
  { code: "+52", label: "Mexico" },
  { code: "+377", label: "Monaco" },
  { code: "+976", label: "Mongolia" },
  { code: "+1664", label: "Montserrat" },
  { code: "+212", label: "Morocco" },
  { code: "+258", label: "Mozambique" },
  { code: "+264", label: "Namibia" },
  { code: "+674", label: "Nauru" },
  { code: "+977", label: "Nepal" },
  { code: "+31", label: "Netherlands" },
  { code: "+687", label: "New Caledonia" },
  { code: "+64", label: "New Zealand" },
  { code: "+505", label: "Nicaragua" },
  { code: "+227", label: "Niger" },
  { code: "+234", label: "Nigeria" },
  { code: "+683", label: "Niue" },
  { code: "+672", label: "Norfolk Island" },
  { code: "+1670", label: "Northern Mariana Islands" },
  { code: "+47", label: "Norway" },
  { code: "+968", label: "Oman" },
  { code: "+92", label: "Pakistan" },
  { code: "+680", label: "Palau" },
  { code: "+507", label: "Panama" },
  { code: "+675", label: "Papua New Guinea" },
  { code: "+595", label: "Paraguay" },
  { code: "+51", label: "Peru" },
  { code: "+63", label: "Philippines" },
  { code: "+48", label: "Poland" },
  { code: "+351", label: "Portugal" },
  { code: "+1787", label: "Puerto Rico" },
  { code: "+974", label: "Qatar" },
  { code: "+40", label: "Romania" },
  { code: "+7", label: "Russian Federation" },
  { code: "+250", label: "Rwanda" },
  { code: "+262", label: "Réunion" },
  { code: "+1869", label: "Saint Kitts and Nevis" },
  { code: "+1758", label: "Saint Lucia" },
  { code: "+508", label: "Saint Pierre and Miquelon" },
  { code: "+1784", label: "Saint Vincent and the Grenadines" },
  { code: "+685", label: "Samoa" },
  { code: "+378", label: "San Marino" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+221", label: "Senegal" },
  { code: "+381", label: "Serbia" },
  { code: "+248", label: "Seychelles" },
  { code: "+232", label: "Sierra Leone" },
  { code: "+65", label: "Singapore" },
  { code: "+421", label: "Slovakia" },
  { code: "+386", label: "Slovenia" },
  { code: "+677", label: "Solomon Islands" },
  { code: "+252", label: "Somalia" },
  { code: "+27", label: "South Africa" },
  { code: "+500", label: "South Georgia and the South Sandwich Islands" },
  { code: "+211", label: "South Sudan" },
  { code: "+34", label: "Spain" },
  { code: "+94", label: "Sri Lanka" },
  { code: "+249", label: "Sudan" },
  { code: "+597", label: "Suriname" },
  { code: "+47", label: "Svalbard and Jan Mayen" },
  { code: "+46", label: "Sweden" },
  { code: "+41", label: "Switzerland" },
  { code: "+963", label: "Syrian Arab Republic" },
  { code: "+992", label: "Tajikistan" },
  { code: "+66", label: "Thailand" },
  { code: "+228", label: "Togo" },
  { code: "+690", label: "Tokelau" },
  { code: "+676", label: "Tonga" },
  { code: "+1868", label: "Trinidad and Tobago" },
  { code: "+216", label: "Tunisia" },
  { code: "+993", label: "Turkmenistan" },
  { code: "+688", label: "Tuvalu" },
  { code: "+256", label: "Uganda" },
  { code: "+380", label: "Ukraine" },
  { code: "+971", label: "United Arab Emirates" },
  { code: "+44", label: "United Kingdom" },
  { code: "+1", label: "United States" },
  { code: "+598", label: "Uruguay" },
  { code: "+998", label: "Uzbekistan" },
  { code: "+678", label: "Vanuatu" },
  { code: "+681", label: "Wallis and Futuna" },
  { code: "+212", label: "Western Sahara" },
  { code: "+967", label: "Yemen" },
  { code: "+260", label: "Zambia" },
  { code: "+263", label: "Zimbabwe" },
];

const dialCodeSuggestions = Array.from(
  new Map(countryOptions.map((option) => [option.code, option])).values()
);

const initialWaitlistForm = {
  title: "",
  fullName: "",
  email: "",
  phoneCountryCode: "+52",
  whatsapp: "",
  country: "Mexico",
  interest: "",
  timeline: "",
  contactPreference: "",
  note: "",
};

type Route =
  | "/"
  | "/praeliator-vis"
  | "/acquisition"
  | "/waitlist"
  | "/contact";

const routeTitles: Record<Route, string> = {
  "/": "Home",
  "/praeliator-vis": "Praeliator VIS",
  "/acquisition": "Acquisition",
  "/waitlist": "Waitlist",
  "/contact": "Contact",
};

const navItems: Array<{ label: string; path: Route }> = [
  { label: "VIS", path: "/praeliator-vis" },
  { label: "Acquisition", path: "/acquisition" },
  { label: "Waitlist", path: "/waitlist" },
  { label: "Contact", path: "/contact" },
];

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageTransition = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeLuxury },
  },
  exit: {
    opacity: 0,
    y: 8,
    filter: "blur(4px)",
    transition: { duration: 0.45, ease: easeLuxury },
  },
};

function normalizePath(pathname: string): Route {
  const clean = pathname.replace(/\/$/, "") || "/";

  if (
    clean === "/" ||
    clean === "/praeliator-vis" ||
    clean === "/acquisition" ||
    clean === "/waitlist" ||
    clean === "/contact"
  ) {
    return clean as Route;
  }

  if (clean === "/collection" || clean === "/trust" || clean === "/gallery") {
    return "/praeliator-vis";
  }

  if (clean === "/experience" || clean === "/clients") {
    return "/acquisition";
  }

  return "/";
}

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-4xl md:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58 sm:text-base sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.85, delay, ease: easeLuxury }}
    >
      {children}
    </motion.div>
  );
}

function DataList({
  items,
  compact = false,
}: {
  items: Array<{ label: string; value: string }>;
  compact?: boolean;
}) {
  return (
    <div className="divide-y divide-white/10 border-t border-white/10">
      {items.map((item) => (
        <div
          key={item.label}
          className={`grid gap-2 py-4 ${compact ? "sm:grid-cols-[110px_1fr]" : "sm:grid-cols-[160px_1fr]"} sm:items-start`}
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-[11px]">
            {item.label}
          </p>
          <p className="text-sm leading-7 text-white/78 sm:text-[15px] sm:leading-8">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ImageSurface({
  src,
  alt,
  className = "",
  priorityCopy,
}: {
  src: string;
  alt: string;
  className?: string;
  priorityCopy?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#11100f] shadow-[0_32px_90px_rgba(0,0,0,0.38)] ${className}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${src})` }}
        aria-label={alt}
        role="img"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.62))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,91,68,0.12),transparent_32%)]" />
      {priorityCopy ? (
        <div className="relative z-10 flex h-full items-end p-6 sm:p-8 lg:p-10">
          <div className="max-w-sm">{priorityCopy}</div>
        </div>
      ) : null}
    </div>
  );
}

function QuietLinkButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-white/58 transition duration-500 hover:text-white"
    >
      <span>{children}</span>
      <span className="block h-px w-8 bg-white/28 transition duration-500 hover:w-10" />
    </button>
  );
}

function InputField({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none transition duration-300 placeholder:text-white/28 focus:border-[#705645] focus:bg-[#11100f]"
      placeholder={placeholder}
    />
  );
}

function SelectField({
  name,
  value,
  onChange,
  children,
}: {
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="h-14 rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none transition duration-300 focus:border-[#705645] focus:bg-[#11100f]"
    >
      {children}
    </select>
  );
}

function SearchPicker({
  value,
  onChange,
  options,
  placeholder,
  exactMatchUpdates,
  inputMode,
}: {
  value: string;
  onChange: (value: string, matchedOption?: { label: string; code: string }) => void;
  options: Array<{ label: string; code: string }>;
  placeholder: string;
  exactMatchUpdates?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return options.slice(0, 12);

    return options
      .filter((option) => {
        const label = option.label.toLowerCase();
        const code = option.code.toLowerCase();
        return label.includes(query) || code.includes(query);
      })
      .slice(0, 12);
  }, [options, value]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          const cleaned = inputMode === "tel" ? next.replace(/[^\d+]/g, "") : next;
          const matchedOption = options.find(
            (option) =>
              option.label.toLowerCase() === cleaned.trim().toLowerCase() ||
              option.code.toLowerCase() === cleaned.trim().toLowerCase()
          );

          if (exactMatchUpdates) {
            onChange(cleaned, matchedOption);
          } else {
            onChange(cleaned);
          }

          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        inputMode={inputMode}
        className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 text-sm text-[#f4efe7] outline-none transition duration-300 placeholder:text-white/28 focus:border-[#705645] focus:bg-[#11100f]"
        placeholder={placeholder}
      />

      {open && filtered.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-30 overflow-hidden rounded-[1.35rem] border border-[#2a211b] bg-[#0b0a09]/98 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div
            className="max-h-72 overflow-y-auto overscroll-contain py-2"
            onWheelCapture={(event) => {
              event.stopPropagation();
            }}
            onTouchMoveCapture={(event) => {
              event.stopPropagation();
            }}
          >
            {filtered.map((option) => (
              <button
                key={`${option.code}-${option.label}`}
                type="button"
                onClick={() => {
                  onChange(inputMode === "tel" ? option.code : option.label, option);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition duration-300 hover:bg-white/[0.04]"
              >
                <span className="truncate text-sm text-[#f4efe7]">{option.label}</span>
                <span className="shrink-0 text-[11px] uppercase tracking-[0.2em] text-[#b9a18d]">
                  {option.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function PraeliatorWebsite() {
  const whatsappBase = "https://wa.me/525540658550";
  const createWhatsAppLink = (message: string) =>
    `${whatsappBase}?text=${encodeURIComponent(message)}`;

  const whatsappGeneralLink = createWhatsAppLink(
    "Hello Praeliator, I would like to inquire about a private purchase."
  );
  const whatsappVisLink = createWhatsAppLink(
    "Hello Praeliator, I would like to inquire about Praeliator VIS."
  );
  const whatsappWaitlistFollowUpLink = createWhatsAppLink(
    "Hello Praeliator, I joined the waitlist and would like to follow up."
  );
  const emailLink =
    "mailto:praeliatorboxing@gmail.com?subject=Praeliator%20Inquiry";
  const instagramLink = "https://instagram.com/praeliatorboxing";
  const waitlistEndpoint = "/api/private-client-intake";

  const [route, setRoute] = useState<Route>(() => {
    if (typeof window === "undefined") return "/";
    return normalizePath(window.location.pathname);
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState(initialWaitlistForm);
  const [waitlistState, setWaitlistState] = useState({
    loading: false,
    success: false,
    error: "",
    reference: "",
    serviceMessage: "",
  });

  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const heroTextRef = useRef<HTMLDivElement | null>(null);

  const heroMediaY = useTransform(
    scrollY,
    [0, 900],
    reduceMotion ? [0, 0] : [0, 24]
  );

  const heroTextY = useTransform(
    scrollY,
    [0, 900],
    reduceMotion ? [0, 0] : [0, -10]
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

    const isTouchDevice =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    if (isTouchDevice) return;

    const lenis = new Lenis({
      duration: 0.95,
      smoothWheel: true,
      wheelMultiplier: 0.88,
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [reduceMotion]);

  const currentPurchaseLink = useMemo(() => {
    if (route === "/praeliator-vis") return whatsappVisLink;
    if (route === "/waitlist") return whatsappWaitlistFollowUpLink;
    return whatsappGeneralLink;
  }, [route]);

  const currentPageTitle = routeTitles[route];

  const goTo = (nextRoute: Route) => {
    if (typeof window !== "undefined") {
      const current = normalizePath(window.location.pathname);

      if (current !== nextRoute) {
        window.history.pushState({}, "", nextRoute);
      }

      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }

    setRoute(nextRoute);
    setMobileMenuOpen(false);
  };

  const handleWaitlistChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "whatsapp") {
      const cleanedNumber = value.replace(/[^\d]/g, "");
      setWaitlistForm((current) => ({ ...current, whatsapp: cleanedNumber }));
      return;
    }

    setWaitlistForm((current) => ({ ...current, [name]: value }));
  };

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setWaitlistState({
      loading: true,
      success: false,
      error: "",
      reference: "",
      serviceMessage: "",
    });

    const payload = {
      title: waitlistForm.title.trim(),
      fullName: waitlistForm.fullName.trim(),
      email: waitlistForm.email.trim(),
      phoneCountryCode: waitlistForm.phoneCountryCode.trim(),
      phoneNumber: waitlistForm.whatsapp.trim(),
      fullPhone: `${waitlistForm.phoneCountryCode} ${waitlistForm.whatsapp.trim()}`.trim(),
      country: waitlistForm.country.trim(),
      interest: waitlistForm.interest.trim(),
      timeline: waitlistForm.timeline.trim(),
      contactPreference: waitlistForm.contactPreference.trim(),
      note: waitlistForm.note.trim(),
      sourceRoute: route,
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.phoneCountryCode ||
      !payload.phoneNumber ||
      !payload.country ||
      !payload.interest ||
      !payload.timeline ||
      !payload.contactPreference
    ) {
      setWaitlistState({
        loading: false,
        success: false,
        error: "Please complete all required fields.",
        reference: "",
        serviceMessage: "",
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

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Submission failed.");
      }

      setWaitlistState({
        loading: false,
        success: true,
        error: "",
        reference: result.reference || "",
        serviceMessage:
          result.serviceMessage ||
          "A private reply will follow after review.",
      });
      setWaitlistForm(initialWaitlistForm);
    } catch (error) {
      setWaitlistState({
        loading: false,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Submission failed. Please try again or contact Praeliator directly by WhatsApp.",
        reference: "",
        serviceMessage: "",
      });
    }
  };

  const renderHomePage = () => (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-[#060606]">
        <motion.div
          style={{ y: heroMediaY }}
          className="absolute inset-0 bg-cover bg-center opacity-55"
          aria-hidden="true"
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${homeImageSources.hero})` }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.12),transparent_32%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.68)_55%,rgba(0,0,0,0.94))]" />

        <Container className="relative py-10 sm:py-12 lg:py-16">
          <motion.div
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: easeLuxury }}
            className="flex min-h-[82svh] max-w-[58rem] flex-col justify-end pb-6 sm:pb-10 lg:min-h-[88svh] lg:pb-14"
          >
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#d0b39b] sm:text-xs">
              Praeliator
            </p>

            <h1 className="mt-5 max-w-[12ch] text-5xl font-semibold leading-[0.84] tracking-[-0.07em] sm:text-6xl md:text-7xl lg:text-[6.4rem] xl:text-[7rem]">
              Equipment for those who treat boxing as art.
              <span className="mt-4 block max-w-[9ch] text-white/68">
                Luxury boxing equipment built with restraint, precision, and lasting purpose.
              </span>
            </h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end lg:gap-12">
              <p className="max-w-[31rem] text-sm leading-7 text-white/60 sm:text-base sm:leading-8 md:text-lg">
                A 16 oz lace-up training glove in top-grain cowhide, built for disciplined training and technical sparring.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
                <Button
                  type="button"
                  onClick={() => goTo("/praeliator-vis")}
                  className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
                >
                  View VIS
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                >
                  <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Private Inquiry
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-[#090909]">
        <Container className="py-10 sm:py-12 lg:py-16">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#11100f] shadow-[0_42px_120px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[16/8]">
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
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.36))]" />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-[#070707]">
        <Container className="py-20 sm:py-24 lg:py-32">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Standard</p>
              </div>

              <div>
                <h2 className="text-4xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-5xl md:text-6xl lg:text-[5rem]">
                  Performance, without excess.
                </h2>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-[#060606]">
        <Container className="py-10 sm:py-12 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
            <Reveal>
              <ImageSurface
                src={homeImageSources.hero}
                alt="Praeliator editorial still"
                className="min-h-[24rem] sm:min-h-[34rem] lg:min-h-[46rem]"
                priorityCopy={
                  <>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#d0b39b] sm:text-[11px]">Approach</p>
                    <p className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.92] tracking-[-0.05em] text-[#f4efe7] sm:text-4xl lg:text-5xl">
                      Boxing, reduced to essentials.
                    </p>
                  </>
                }
              />
            </Reveal>

            <div className="grid gap-6 lg:gap-8">
              <Reveal delay={0.06}>
                <ImageSurface
                  src={homeImageSources.material}
                  alt="Praeliator editorial material detail"
                  className="min-h-[16rem] sm:min-h-[18rem] lg:min-h-[22rem]"
                  priorityCopy={
                    <>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#d0b39b] sm:text-[11px]">Material</p>
                      <p className="mt-4 max-w-[14ch] text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7] sm:text-3xl">
                        Top-grain leather. Soft satin finish.
                      </p>
                    </>
                  }
                />
              </Reveal>

              <Reveal delay={0.12}>
                <ImageSurface
                  src={homeImageSources.presentation}
                  alt="Praeliator editorial presentation"
                  className="min-h-[16rem] sm:min-h-[18rem] lg:min-h-[22rem]"
                  priorityCopy={
                    <>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#d0b39b] sm:text-[11px]">Ownership</p>
                      <p className="mt-4 max-w-[14ch] text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7] sm:text-3xl">
                        From presentation to aftercare.
                      </p>
                    </>
                  }
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#080808_100%)]">
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <Reveal>
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Product seriousness</p>
                <h2 className="mt-4 max-w-[11ch] text-3xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-4xl md:text-5xl">
                  Strong claims need stronger records.
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
                <DataList items={constructionEvidence} compact />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#080808_100%)]">
        <Container className="py-16 sm:py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
            <Reveal>
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Praeliator VIS</p>
                <h2 className="mt-4 max-w-[11ch] text-3xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-4xl md:text-5xl">
                  Praeliator VIS
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  A 16 oz lace-up training glove in top-grain cowhide, built for disciplined training and technical sparring.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    onClick={() => goTo("/praeliator-vis")}
                    className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
                  >
                    Enter VIS
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    <a href={whatsappVisLink} target="_blank" rel="noreferrer">
                      Request Acquisition
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:grid-cols-2">
                {[
                  { label: "Weight", value: "16 oz" },
                  { label: "Closure", value: "Lace-up only" },
                  { label: "Use", value: "Training · Technical sparring" },
                  { label: "Leather", value: "Top-grain cowhide · 0.9–1.0 mm" },
                ].map((item) => (
                  <div key={item.label} className="bg-[#11100f] p-6 sm:p-7">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/38">{item.label}</p>
                    <p className="mt-3 text-lg font-medium text-[#f4efe7] sm:text-xl">{item.value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-[#070707]">
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {galleryImages.map((src, index) => (
              <Reveal key={src} delay={index * 0.05}>
                <div className={`relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#11100f] shadow-[0_22px_64px_rgba(0,0,0,0.3)] ${index % 2 === 0 ? "aspect-[4/5]" : "aspect-square"}`}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.35))]" />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );

  const renderVisPage = () => (
    <section className="border-b border-white/10 bg-[#080808]">
      <Container className="py-16 sm:py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Praeliator VIS"
              title="A flagship training glove built with discipline."
              description="Made for disciplined training and technical sparring."
            />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
              >
                <a href={whatsappVisLink} target="_blank" rel="noreferrer">
                  Private Purchase Inquiry
                </a>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/waitlist")}
                className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                Join Waitlist
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ImageSurface
              src={visImageSources.hero}
              alt="Praeliator VIS"
              className="min-h-[24rem] sm:min-h-[34rem] lg:min-h-[44rem]"
              priorityCopy={
                <>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#d0b39b] sm:text-[11px]">
                    Praeliator VIS
                  </p>
                  <p className="mt-4 max-w-[13ch] text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7] sm:text-4xl">
                    Restrained by design. Precise in execution.
                  </p>
                </>
              }
            />
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                A 16 oz lace-up training glove in top-grain cowhide with a soft satin finish. Deep black leads. Espresso reveals itself in the light.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
              <DataList
                items={[
                  { label: "Primary tone", value: "Deep black" },
                  { label: "Secondary tone", value: "Espresso brown" },
                  { label: "Branding", value: "Debossed PRAELIATOR wrist plate" },
                  { label: "Finish", value: "Soft satin" },
                ]}
                compact
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <ImageSurface
              src={visImageSources.leather}
              alt="Praeliator VIS leather"
              className="min-h-[22rem] sm:min-h-[26rem] lg:min-h-[34rem]"
            />
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={0.06}>
              <ImageSurface
                src={visImageSources.plate}
                alt="Praeliator VIS plate"
                className="min-h-[15rem] sm:min-h-[16rem]"
              />
            </Reveal>

            <Reveal delay={0.12}>
              <ImageSurface
                src={visImageSources.packaging}
                alt="Praeliator VIS packaging"
                className="min-h-[15rem] sm:min-h-[16rem]"
              />
            </Reveal>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <Reveal>
            <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                Specifications
              </p>
              <div className="mt-6">
                <DataList items={visSpecifications} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                Padding system
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Four-layer impact structure
              </h3>
              <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {visPaddingLayers.map((layer, index) => (
                  <div
                    key={`${layer}-${index}`}
                    className="grid gap-2 py-4 sm:grid-cols-[92px_1fr] sm:items-center"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 sm:text-[11px]">
                      Layer {index + 1}
                    </p>
                    <p className="text-sm leading-7 text-white/80 sm:text-[15px] sm:leading-8">
                      {layer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Ownership</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Allocation, delivery, aftercare.
              </h3>
              <div className="mt-6 rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8">
                <DataList items={ownershipSignals} compact />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Aftercare</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Praeliator Legacy Refresh
              </h3>
              <p className="mt-5 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                Available after the first year, this service supports longevity through maintenance rather than replacement culture.
              </p>
              <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {visService.map((item) => (
                  <div key={item} className="py-4">
                    <p className="text-sm leading-7 text-white/78 sm:text-[15px] sm:leading-8">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Presentation</p>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">The object extends beyond the glove.</h3>
              <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {visPackaging.map((item) => (
                  <div key={item} className="py-4">
                    <p className="text-sm leading-7 text-white/78 sm:text-[15px] sm:leading-8">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Proof architecture</p>
              <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {constructionEvidence.map((item) => (
                  <div key={item.label} className="py-5">
                    <h3 className="text-lg font-medium text-[#f4efe7]">{item.label}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );

  const renderAcquisitionPage = () => (
    <section className="border-b border-white/10 bg-[#090909]">
      <Container className="py-16 sm:py-20 lg:py-28">
        <SectionHeading
          eyebrow="Acquisition"
          title="Private acquisition, handled directly."
          description="Each qualified inquiry is reviewed and carried through direct contact."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <Reveal>
            <div className="divide-y divide-white/10 border-t border-white/10">
              {[
                ["01", "Inquiry", "The client enters by WhatsApp, email, or the private intake form rather than conventional checkout."],
                ["02", "Record creation", "The inquiry becomes a persistent client record with a reference number, route status, and follow-up ownership."],
                ["03", "Review and allocation", "Product interest, timing, destination, and allocation status are clarified before payment and dispatch."],
                ["04", "Delivery and aftercare", "Delivery progress and future service history continue under the same record after purchase."],
              ].map(([step, title, text]) => (
                <div key={step} className="grid gap-4 py-5 sm:grid-cols-[90px_1fr] sm:gap-6 sm:py-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#b9a18d] sm:text-[11px]">
                    {step}
                  </p>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">Trust architecture</p>
              <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {trustArchitecture.map((item) => (
                  <div key={item.title} className="py-5">
                    <h3 className="text-lg font-medium text-[#f4efe7]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
                >
                  <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                    Begin Inquiry
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo("/waitlist")}
                  className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );

  const renderWaitlistPage = () => (
    <section className="border-b border-white/10 bg-[#090909]">
      <Container className="pt-0 pb-14 sm:pt-1 sm:pb-16 lg:pt-2 lg:pb-20">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-10">
          <Reveal>
            <SectionHeading
              eyebrow="Waitlist"
              title="A quieter route into future access."
              description="For future releases, collector interest, and private access."
            />

            <div className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              Client reference returned after submission.
            </div>

            <div className="mt-5 divide-y divide-white/10 border-t border-white/10">
              {serviceStandards.map((item) => (
                <div key={item} className="py-4">
                  <p className="text-sm leading-7 text-white/62 sm:text-base sm:leading-8">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                  Prefer direct inquiry instead
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
              <form className="grid gap-4" onSubmit={handleWaitlistSubmit}>
                <div className="grid gap-4 sm:grid-cols-[0.72fr_1.28fr]">
                  <SelectField
                    name="title"
                    value={waitlistForm.title}
                    onChange={handleWaitlistChange}
                  >
                    <option value="">Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Mx.">Mx.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                  </SelectField>

                  <InputField
                    name="fullName"
                    value={waitlistForm.fullName}
                    onChange={handleWaitlistChange}
                    autoComplete="name"
                    placeholder="Full name *"
                  />
                </div>

                <InputField
                  name="email"
                  type="email"
                  value={waitlistForm.email}
                  onChange={handleWaitlistChange}
                  autoComplete="email"
                  placeholder="Email address *"
                />

                <SearchPicker
                  value={waitlistForm.country}
                  onChange={(value, matchedOption) => {
                    setWaitlistForm((current) => ({
                      ...current,
                      country: value,
                      phoneCountryCode: matchedOption ? matchedOption.code : current.phoneCountryCode,
                    }));
                  }}
                  options={countryOptions.map((option) => ({ label: option.label, code: option.code }))}
                  placeholder="Country or dial code *"
                  exactMatchUpdates
                />

                <div className="grid gap-4 sm:grid-cols-[0.82fr_1.18fr]">
                  <InputField
                    name="phoneCountryCode"
                    value={waitlistForm.phoneCountryCode}
                    onChange={handleWaitlistChange}
                    autoComplete="tel-country-code"
                    placeholder="Dial code *"
                  />

                  <InputField
                    name="whatsapp"
                    value={waitlistForm.whatsapp}
                    onChange={handleWaitlistChange}
                    autoComplete="tel-national"
                    placeholder="Phone number *"
                  />
                </div>

                <SelectField
                  name="interest"
                  value={waitlistForm.interest}
                  onChange={handleWaitlistChange}
                >
                  <option value="">Interest *</option>
                  <option value="Praeliator VIS">Praeliator VIS</option>
                  <option value="Future releases">Future releases</option>
                  <option value="Collector interest">Collector interest</option>
                  <option value="General brand inquiry">General brand inquiry</option>
                </SelectField>

                <SelectField
                  name="timeline"
                  value={waitlistForm.timeline}
                  onChange={handleWaitlistChange}
                >
                  <option value="">Timeline *</option>
                  <option value="Ready now">Ready now</option>
                  <option value="Within 30 days">Within 30 days</option>
                  <option value="Within 3 months">Within 3 months</option>
                  <option value="Researching only">Researching only</option>
                </SelectField>

                <SelectField
                  name="contactPreference"
                  value={waitlistForm.contactPreference}
                  onChange={handleWaitlistChange}
                >
                  <option value="">Preferred contact method *</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Either">Either</option>
                </SelectField>

                <textarea
                  name="note"
                  value={waitlistForm.note}
                  onChange={handleWaitlistChange}
                  className="min-h-[130px] rounded-2xl border border-white/10 bg-[#0d0b0a] px-5 py-4 text-sm text-[#f4efe7] outline-none transition duration-300 placeholder:text-white/28 focus:border-[#705645] focus:bg-[#11100f]"
                  placeholder="Optional note"
                />

                <Button
                  type="submit"
                  disabled={waitlistState.loading}
                  className="h-14 rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {waitlistState.loading ? "Submitting..." : "Join Waitlist"}
                </Button>

                {waitlistState.success ? (
                  <div className="rounded-2xl border border-[#2f241d] bg-[#0d0b0a] px-5 py-4">
                    <p className="text-sm leading-6 text-[#d7c5ae]">
                      Inquiry received{waitlistState.reference ? ` · ${waitlistState.reference}` : ""}.
                    </p>
                    {waitlistState.serviceMessage ? (
                      <p className="mt-2 text-sm leading-6 text-white/55">{waitlistState.serviceMessage}</p>
                    ) : null}
                  </div>
                ) : null}

                {waitlistState.error ? (
                  <p className="text-sm leading-6 text-[#d99b8d]">{waitlistState.error}</p>
                ) : null}
              </form>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );

  const renderContactPage = () => (
    <section className="border-b border-white/10">
      <Container className="py-16 sm:py-20 lg:py-28">
        <SectionHeading
          eyebrow="Contact"
          title="Direct contact for private clients."
          description="WhatsApp remains the primary route for purchase inquiries."
        />

        <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
          <Reveal>
            <a
              href={whatsappGeneralLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 py-5 transition duration-500 hover:bg-white/[0.02] sm:py-6"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20">
                  <MessageCircle className="h-5 w-5 text-[#b9a18d]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium sm:text-base">WhatsApp</p>
                  <p className="text-sm text-white/45">
                    Preferred for private purchase inquiries
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/35" />
            </a>
          </Reveal>

          <Reveal delay={0.06}>
            <a
              href={emailLink}
              className="flex items-center justify-between gap-4 py-5 transition duration-500 hover:bg-white/[0.02] sm:py-6"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20">
                  <Mail className="h-5 w-5 text-[#b9a18d]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium sm:text-base">Email</p>
                  <p className="text-sm text-white/45">
                    
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/35" />
            </a>
          </Reveal>

          <Reveal delay={0.12}>
            <a
              href={instagramLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 py-5 transition duration-500 hover:bg-white/[0.02] sm:py-6"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/20">
                  <Instagram className="h-5 w-5 text-[#b9a18d]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium sm:text-base">Instagram</p>
                  <p className="text-sm text-white/45">
                    
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-white/35" />
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );

  const renderPage = () => {
    switch (route) {
      case "/praeliator-vis":
        return renderVisPage();
      case "/acquisition":
        return renderAcquisitionPage();
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
        <Container className="flex items-center justify-between py-3 sm:py-4">
          <button
            type="button"
            onClick={() => goTo("/")}
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
              <p className="truncate text-[10px] uppercase tracking-[0.34em] text-[#b9a18d] transition duration-500 group-hover:text-[#d7b797] sm:text-xs">
                Praeliator
              </p>
              <p className="mt-1 truncate text-[10px] uppercase tracking-[0.24em] text-white/42 sm:text-[11px]">
                {currentPageTitle}
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-7 text-sm text-white/66 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                className={`transition duration-500 hover:text-white ${route === item.path ? "text-white" : ""}`}
              >
                {item.label}
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
                Home
              </Button>
            ) : null}

            <Button
              asChild
              className="rounded-full bg-[#efe5d7] px-5 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)]"
            >
              <a href={currentPurchaseLink} target="_blank" rel="noreferrer">
                Private Inquiry
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
        </Container>

        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.55, ease: easeLuxury }}
              className="overflow-hidden border-t border-white/10 bg-[#0a0a0a] lg:hidden"
            >
              <Container className="grid gap-2 py-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => goTo(item.path)}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white/82 transition duration-500 hover:bg-white/10"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-white/35" />
                  </button>
                ))}

                {route !== "/" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goTo("/")}
                    className="mt-2 h-12 rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    Return Home
                  </Button>
                ) : null}
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.08),transparent_28%)]">
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
        <Container className="flex flex-col gap-5 py-8 text-sm text-white/42 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
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
        </Container>
      </footer>
    </div>
  );
}
