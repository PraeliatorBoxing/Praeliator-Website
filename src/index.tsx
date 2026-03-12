import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  MessageCircle,
  ShieldCheck,
  Crown,
  ChevronRight,
  Medal,
  Gem,
  Package,
  Mail,
  Instagram,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

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
};

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
  { code: "+93", label: "Afghanistan" },
  { code: "+355", label: "Albania" },
  { code: "+213", label: "Algeria" },
  { code: "+376", label: "Andorra" },
  { code: "+244", label: "Angola" },
  { code: "+54", label: "Argentina" },
  { code: "+374", label: "Armenia" },
  { code: "+61", label: "Australia" },
  { code: "+43", label: "Austria" },
  { code: "+994", label: "Azerbaijan" },
  { code: "+973", label: "Bahrain" },
  { code: "+880", label: "Bangladesh" },
  { code: "+375", label: "Belarus" },
  { code: "+32", label: "Belgium" },
  { code: "+501", label: "Belize" },
  { code: "+229", label: "Benin" },
  { code: "+591", label: "Bolivia" },
  { code: "+387", label: "Bosnia and Herzegovina" },
  { code: "+267", label: "Botswana" },
  { code: "+55", label: "Brazil" },
  { code: "+359", label: "Bulgaria" },
  { code: "+226", label: "Burkina Faso" },
  { code: "+257", label: "Burundi" },
  { code: "+855", label: "Cambodia" },
  { code: "+237", label: "Cameroon" },
  { code: "+1", label: "Canada" },
  { code: "+238", label: "Cape Verde" },
  { code: "+236", label: "Central African Republic" },
  { code: "+235", label: "Chad" },
  { code: "+56", label: "Chile" },
  { code: "+86", label: "China" },
  { code: "+57", label: "Colombia" },
  { code: "+269", label: "Comoros" },
  { code: "+242", label: "Congo" },
  { code: "+506", label: "Costa Rica" },
  { code: "+385", label: "Croatia" },
  { code: "+53", label: "Cuba" },
  { code: "+357", label: "Cyprus" },
  { code: "+420", label: "Czech Republic" },
  { code: "+45", label: "Denmark" },
  { code: "+253", label: "Djibouti" },
  { code: "+1-809", label: "Dominican Republic" },
  { code: "+593", label: "Ecuador" },
  { code: "+20", label: "Egypt" },
  { code: "+503", label: "El Salvador" },
  { code: "+372", label: "Estonia" },
  { code: "+251", label: "Ethiopia" },
  { code: "+358", label: "Finland" },
  { code: "+33", label: "France" },
  { code: "+995", label: "Georgia" },
  { code: "+49", label: "Germany" },
  { code: "+233", label: "Ghana" },
  { code: "+30", label: "Greece" },
  { code: "+502", label: "Guatemala" },
  { code: "+224", label: "Guinea" },
  { code: "+509", label: "Haiti" },
  { code: "+504", label: "Honduras" },
  { code: "+36", label: "Hungary" },
  { code: "+354", label: "Iceland" },
  { code: "+91", label: "India" },
  { code: "+62", label: "Indonesia" },
  { code: "+98", label: "Iran" },
  { code: "+964", label: "Iraq" },
  { code: "+353", label: "Ireland" },
  { code: "+972", label: "Israel" },
  { code: "+39", label: "Italy" },
  { code: "+225", label: "Ivory Coast" },
  { code: "+81", label: "Japan" },
  { code: "+962", label: "Jordan" },
  { code: "+7", label: "Kazakhstan" },
  { code: "+254", label: "Kenya" },
  { code: "+965", label: "Kuwait" },
  { code: "+996", label: "Kyrgyzstan" },
  { code: "+856", label: "Laos" },
  { code: "+371", label: "Latvia" },
  { code: "+961", label: "Lebanon" },
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
  { code: "+52", label: "Mexico" },
  { code: "+373", label: "Moldova" },
  { code: "+377", label: "Monaco" },
  { code: "+976", label: "Mongolia" },
  { code: "+382", label: "Montenegro" },
  { code: "+212", label: "Morocco" },
  { code: "+258", label: "Mozambique" },
  { code: "+95", label: "Myanmar" },
  { code: "+264", label: "Namibia" },
  { code: "+977", label: "Nepal" },
  { code: "+31", label: "Netherlands" },
  { code: "+64", label: "New Zealand" },
  { code: "+505", label: "Nicaragua" },
  { code: "+227", label: "Niger" },
  { code: "+234", label: "Nigeria" },
  { code: "+47", label: "Norway" },
  { code: "+968", label: "Oman" },
  { code: "+92", label: "Pakistan" },
  { code: "+507", label: "Panama" },
  { code: "+595", label: "Paraguay" },
  { code: "+51", label: "Peru" },
  { code: "+63", label: "Philippines" },
  { code: "+48", label: "Poland" },
  { code: "+351", label: "Portugal" },
  { code: "+974", label: "Qatar" },
  { code: "+40", label: "Romania" },
  { code: "+7", label: "Russia" },
  { code: "+250", label: "Rwanda" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+221", label: "Senegal" },
  { code: "+381", label: "Serbia" },
  { code: "+65", label: "Singapore" },
  { code: "+421", label: "Slovakia" },
  { code: "+386", label: "Slovenia" },
  { code: "+27", label: "South Africa" },
  { code: "+82", label: "South Korea" },
  { code: "+34", label: "Spain" },
  { code: "+94", label: "Sri Lanka" },
  { code: "+249", label: "Sudan" },
  { code: "+46", label: "Sweden" },
  { code: "+41", label: "Switzerland" },
  { code: "+963", label: "Syria" },
  { code: "+886", label: "Taiwan" },
  { code: "+992", label: "Tajikistan" },
  { code: "+255", label: "Tanzania" },
  { code: "+66", label: "Thailand" },
  { code: "+216", label: "Tunisia" },
  { code: "+90", label: "Turkey" },
  { code: "+993", label: "Turkmenistan" },
  { code: "+256", label: "Uganda" },
  { code: "+380", label: "Ukraine" },
  { code: "+971", label: "United Arab Emirates" },
  { code: "+44", label: "United Kingdom" },
  { code: "+1", label: "United States" },
  { code: "+598", label: "Uruguay" },
  { code: "+998", label: "Uzbekistan" },
  { code: "+58", label: "Venezuela" },
  { code: "+84", label: "Vietnam" },
  { code: "+967", label: "Yemen" },
  { code: "+260", label: "Zambia" },
  { code: "+263", label: "Zimbabwe" },
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
  "/waitlist": "Waitlist",
  "/contact": "Contact",
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
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24 xl:py-28">
      <div className="max-w-3xl">
        <div className="mb-6 h-px w-16 bg-[linear-gradient(90deg,rgba(185,161,141,0.85),rgba(185,161,141,0))] sm:mb-8 sm:w-20" />
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d] sm:text-xs sm:tracking-[0.35em]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:mt-4 sm:text-4xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:mt-6 sm:text-base sm:leading-8">
          {description}
        </p>
      </div>
      <div className="mt-10 sm:mt-12">{children}</div>
    </section>
  );
}

function LuxuryImagePanel({
  src,
  eyebrow,
  title,
  description,
  heightClass = "min-h-[28rem]",
  onClick,
}: {
  src: string;
  eyebrow: string;
  title: string;
  description?: string;
  heightClass?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#11100f] text-left shadow-[0_24px_70px_rgba(0,0,0,0.34)] transition duration-500 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_34px_100px_rgba(0,0,0,0.46)] sm:rounded-[2rem] ${heightClass}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.02]"
        style={{ backgroundImage: `url(${src})` }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,8,0.42)_0%,rgba(8,8,8,0.16)_26%,rgba(8,8,8,0.38)_56%,rgba(8,8,8,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.16),transparent_38%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-8 md:p-10">
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px] sm:tracking-[0.30em]">
              {eyebrow}
            </p>

            <h3 className="mt-3 max-w-[14rem] text-xl font-semibold leading-[1.02] tracking-[-0.045em] text-[#f4efe7] sm:mt-5 sm:max-w-[20rem] sm:text-2xl md:text-[2.8rem]">
              {title}
            </h3>
          </div>

          <span className="rounded-full border border-white/12 bg-black/20 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white/55 transition duration-300 group-hover:border-white/18 group-hover:text-white/72 sm:px-3 sm:text-[10px] sm:tracking-[0.24em]">
            Enter
          </span>
        </div>

        <div className="max-w-xs sm:max-w-sm">
          {description ? (
            <p className="text-xs leading-6 text-white/72 sm:text-sm sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </button>
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

  const currentPageTitle = useMemo(() => routeTitles[route], [route]);

  const goTo = (nextRoute: Route) => {
    if (typeof window !== "undefined") {
      const current = normalizePath(window.location.pathname);
      if (current !== nextRoute) {
        window.history.pushState({}, "", nextRoute);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.24),transparent_35%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[40%] bg-[radial-gradient(circle_at_center,rgba(120,91,68,0.12),transparent_70%)] lg:block" />

        <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8 lg:py-36 xl:gap-20 xl:py-40">
          <div className="relative z-10 flex max-w-[36rem] flex-col justify-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[#b9a18d] sm:mb-6 sm:text-xs sm:tracking-[0.38em]">
              Luxury Boxing House
            </p>

            <h1 className="max-w-[34rem] text-4xl font-semibold leading-[0.92] tracking-[-0.05em] sm:text-5xl md:text-7xl xl:text-[5.15rem]">
              Praeliator VIS.
              <span className="block text-white/72">Built with restraint.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:mt-8 sm:text-base sm:leading-8 md:text-lg">
              Black satin leather. Espresso undertone. Direct acquisition. A training
              glove presented with control, discipline, and a more private route into
              the brand.
            </p>

            <div className="mt-8 grid gap-3 sm:mt-12 sm:flex sm:flex-wrap sm:gap-4">
              <Button
                type="button"
                onClick={() => goTo("/praeliator-vis")}
                className="w-full rounded-full border border-[#5b4638]/45 bg-[#151210] px-6 py-5 text-sm text-[#f4efe7] shadow-[0_10px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.03)] transition duration-300 hover:-translate-y-0.5 hover:border-[#7a5d49]/65 hover:bg-[#1b1614] hover:shadow-[0_16px_34px_rgba(0,0,0,0.34)] sm:w-auto sm:py-6"
              >
                View VIS
              </Button>

              <Button
                asChild
                className="w-full rounded-full bg-[#efe5d7] px-6 py-5 text-sm text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto sm:py-6"
              >
                <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Private Inquiry
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <LuxuryImagePanel
              src={visImageSources.hero}
              eyebrow="Praeliator VIS"
              title="Direct acquisition."
              description="Flagship access through private client service."
              heightClass="min-h-[24rem] sm:min-h-[30rem] lg:min-h-[44rem]"
              onClick={() => goTo("/praeliator-vis")}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0c0b]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[11px] uppercase tracking-[0.20em] text-white/45 sm:gap-x-20 sm:gap-y-5 sm:text-sm sm:tracking-[0.28em]">
            {audience.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-24 xl:py-32">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <div className="group flex flex-col justify-between rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_30px_96px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8 lg:rounded-[2.4rem] lg:p-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.3em]">
                Flagship
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:mt-5 sm:text-4xl md:text-5xl">
                The house begins with VIS.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 sm:mt-6 sm:text-base sm:leading-8">
                One glove. One expression. One measured entry into Praeliator.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:flex sm:flex-wrap sm:gap-4 lg:mt-14">
              <Button
                type="button"
                onClick={() => goTo("/praeliator-vis")}
                className="w-full rounded-full border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0f0c0b_100%)] px-6 py-5 text-sm text-[#f4efe7] shadow-[0_12px_28px_rgba(0,0,0,0.30)] transition duration-300 hover:-translate-y-0.5 hover:border-[#6b5344]/65 hover:bg-[linear-gradient(180deg,#1b1614_0%,#120f0d_100%)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.36)] sm:w-auto sm:py-6"
              >
                View VIS
              </Button>

              <Button
                asChild
                className="w-full rounded-full bg-[#efe5d7] px-6 py-5 text-sm text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto sm:py-6"
              >
                <a href={whatsappVisLink} target="_blank" rel="noreferrer">
                  Request Acquisition
                </a>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:gap-8">
            <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
                Acquisition
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
                Direct, controlled, personal.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/62 sm:mt-5 sm:leading-8">
                No open-cart checkout. No noisy retail flow. Praeliator is acquired
                through direct conversation.
              </p>

              <div className="mt-6 sm:mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo("/acquisition")}
                  className="w-full rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
                >
                  Explore Acquisition
                </Button>
              </div>
            </div>

            <div className="group rounded-[1.5rem] border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0d0b0a_100%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:border-[#6b5344]/65 hover:shadow-[0_30px_96px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
                Presentation
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
                The object extends beyond the glove.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/62 sm:mt-5 sm:leading-8">
                Rigid box. Silk dust bag. Wrapping paper. Authenticity card. Care
                card. Legacy Refresh after the first year.
              </p>

              <div className="mt-6 sm:mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo("/trust")}
                  className="w-full rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
                >
                  View Trust Layer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#080808_100%)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 xl:py-20">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.34em]">
              Private Access
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] sm:mt-4 sm:text-3xl md:text-4xl">
              Request acquisition or enter the waitlist.
            </h2>
          </div>

          <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/waitlist")}
              className="w-full rounded-full border-white/15 bg-transparent px-6 py-5 text-sm text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto sm:py-6"
            >
              Join Waitlist
            </Button>

            <Button
              asChild
              className="w-full rounded-full bg-[#efe5d7] px-6 py-5 text-sm text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto sm:py-6"
            >
              <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                Private Inquiry
              </a>
            </Button>
          </div>
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
        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Process
          </p>
          <div className="mt-5 grid gap-4 sm:mt-6">
            {[
              ["01", "Inquiry", "The client enters through WhatsApp or email rather than conventional checkout."],
              ["02", "Qualification", "Praeliator confirms intent, product interest, and the correct route for the client."],
              ["03", "Confirmation", "Availability, delivery scope, and next steps are clarified directly."],
              ["04", "Acquisition", "Purchase is completed through private client communication rather than a mass-market transaction flow."],
            ].map(([step, title, text]) => (
              <div
                key={step}
                className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem] sm:p-5"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.22em]">
                  {step}
                </p>
                <h3 className="mt-2 text-lg font-semibold sm:text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="group rounded-[1.5rem] border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0d0b0a_100%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:border-[#6b5344]/65 hover:shadow-[0_30px_96px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Frequently Asked
          </p>
          <div className="mt-5 grid gap-4 sm:mt-6">
            {[
              ["How do I buy?", "Through direct inquiry, not open checkout."],
              ["Is VIS always available?", "Availability is confirmed directly through client service."],
              ["What is included?", "Presentation box, silk dust bag, silk wrapping paper, authenticity card, and care card."],
              ["Is there aftercare?", "Yes. Praeliator Legacy Refresh is available after the first year."],
              ["Do you ship internationally?", "Shipping scope is confirmed during inquiry based on destination."],
            ].map(([q, a]) => (
              <div
                key={q}
                className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.07] sm:rounded-[1.5rem] sm:p-5"
              >
                <h3 className="text-base font-medium sm:text-lg">{q}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
            <Button
              asChild
              className="w-full rounded-full bg-[#efe5d7] px-6 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto"
            >
              <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                Private Purchase Inquiry
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/contact")}
              className="w-full rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
            >
              Contact Page
            </Button>
          </div>
        </div>
      </div>
    </SectionFrame>
  );

  const renderCollectionPage = () => (
    <SectionFrame
      eyebrow="Collection"
      title="The collection deserves its own frame."
      description="This page presents Praeliator products as selective acquisitions rather than standard ecommerce listings."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.name}
            className="rounded-[1.5rem] border-white/10 bg-[#11100f] text-[#f4efe7] shadow-xl shadow-black/20 sm:rounded-[2rem]"
          >
            <CardContent className="flex h-full flex-col p-5 sm:p-7">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
                      {product.category}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                      {product.name}
                    </h3>
                  </div>
                  <Package className="mt-1 h-5 w-5 text-white/40" />
                </div>

                <p className="mt-5 text-sm leading-7 text-white/65">
                  {product.description}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/45">
                  {product.longDescription}
                </p>
              </div>

              <div className="mt-auto pt-8">
                <div className="space-y-2 border-t border-white/10 pt-5">
                  <p className="text-lg font-medium">{product.price}</p>
                  <p className="text-sm text-white/50">{product.note}</p>
                </div>

                <div className="mt-7 grid gap-3">
                  <Button
                    asChild
                    className="w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)]"
                  >
                    <a
                      href={product.name === "Praeliator VIS" ? whatsappVisLink : whatsappCollectorLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Request Acquisition
                    </a>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      goTo(product.name === "Praeliator VIS" ? "/praeliator-vis" : "/waitlist")
                    }
                    className="w-full rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    {product.name === "Praeliator VIS" ? "Open VIS Page" : "Join Waitlist Page"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );

  const renderVisPage = () => (
    <SectionFrame
      eyebrow="Praeliator VIS"
      title="A flagship training glove shaped by restraint, structure, and intent."
      description="Praeliator VIS is built for disciplined training and technical sparring. It is presented as a luxury acquisition: materially specific, visually controlled, and service-backed."
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8 md:p-10">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Flagship Product
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:mt-4 sm:text-4xl md:text-5xl">
            Praeliator VIS
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:mt-6 sm:text-base sm:leading-8">
            A 16 oz lace-up training glove built in top-grain cowhide leather with a
            soft satin finish and a restrained two-tone character. Deep black remains
            the primary visual read, while a minimal espresso tone reveals itself
            depending on light direction.
          </p>
          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem] sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.22em]">
                Use
              </p>
              <p className="mt-3 text-base font-medium sm:text-lg">
                Training · Technical sparring
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem] sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.22em]">
                Position
              </p>
              <p className="mt-3 text-base font-medium sm:text-lg">
                Luxury training instrument
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
            <Button
              asChild
              className="w-full rounded-full bg-[#efe5d7] px-6 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto"
            >
              <a href={whatsappVisLink} target="_blank" rel="noreferrer">
                Private Purchase Inquiry
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/waitlist")}
              className="w-full rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
            >
              Join Waitlist
            </Button>
          </div>
        </div>

        <div className="group rounded-[1.5rem] border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0d0b0a_100%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:border-[#6b5344]/65 hover:shadow-[0_30px_96px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8 md:p-10">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Visual Identity
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
            Minimal branding. Controlled presence.
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/65 sm:mt-5 sm:leading-8">
            External branding is deliberately restrained. The primary visible marking is a debossed PRAELIATOR logo on the wrist strap plate. The leather finish is soft satin rather than gloss, and the black surface carries a subtle espresso reveal under changing light.
          </p>
          <div className="mt-6 space-y-4 sm:mt-8">
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.07] sm:rounded-[1.5rem] sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.22em]">
                Primary tone
              </p>
              <p className="mt-2 text-base font-medium sm:text-lg">Deep black</p>
            </div>
            <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.07] sm:rounded-[1.5rem] sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.22em]">
                Secondary tone
              </p>
              <p className="mt-2 text-base font-medium sm:text-lg">Espresso brown</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <LuxuryImagePanel
          src={visImageSources.hero}
          eyebrow="Praeliator VIS"
          title="The silhouette carries the house."
          description="Black remains dominant. Espresso appears only when light breaks across the leather."
          heightClass="min-h-[22rem] sm:min-h-[28rem] lg:min-h-[42rem]"
        />

        <div className="grid gap-6 lg:gap-8">
          <LuxuryImagePanel
            src={visImageSources.leather}
            eyebrow="Leather Finish"
            title="Soft satin. Quiet depth."
            description="Top-grain cowhide with a restrained two-tone response under shifting light."
            heightClass="min-h-[12rem] sm:min-h-[12.5rem]"
          />

          <LuxuryImagePanel
            src={visImageSources.plate}
            eyebrow="Wrist Plate"
            title="Debossed, not announced."
            description="Branding remains controlled and deliberate."
            heightClass="min-h-[12rem] sm:min-h-[12.5rem]"
          />

          <LuxuryImagePanel
            src={visImageSources.packaging}
            eyebrow="Presentation"
            title="Presented as acquisition, not shipment."
            description="Rigid box, silk dust bag, wrapping paper, authenticity card, and care card."
            heightClass="min-h-[12rem] sm:min-h-[12.5rem]"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Specifications
          </p>
          <div className="mt-5 grid gap-4 sm:mt-6">
            {visSpecifications.map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-white/40 sm:text-sm sm:tracking-[0.16em]">
                  {item.label}
                </p>
                <p className="text-sm text-white/80 sm:text-right">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Padding System
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
            Four-layer impact structure
          </h3>
          <div className="mt-5 grid gap-4 sm:mt-6">
            {visPaddingLayers.map((layer, index) => (
              <div
                key={`${layer}-${index}`}
                className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem] sm:p-5"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/45 sm:text-[11px] sm:tracking-[0.22em]">
                  Layer {index + 1}
                </p>
                <p className="mt-2 text-base font-medium sm:text-lg">{layer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Packaging
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
            Presented as acquisition, not shipment.
          </h3>
          <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2">
            {visPackaging.map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem] sm:p-5"
              >
                <p className="text-sm leading-7 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Aftercare
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
            Praeliator Legacy Refresh
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/65 sm:mt-5 sm:leading-8">
            Available after the first year, this service extends the life and finish of the glove through maintenance rather than replacement culture.
          </p>
          <div className="mt-5 grid gap-4 sm:mt-6">
            {visService.map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem] sm:p-5"
              >
                <p className="text-sm leading-7 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );

  const renderTrustPage = () => (
    <SectionFrame
      eyebrow="Trust"
      title="Credibility built into the brand architecture."
      description="Praeliator should not rely on hype to feel legitimate. This page communicates material seriousness, construction clarity, aftercare, and the logic behind the private client model."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Construction Integrity
          </p>
          <div className="mt-5 grid gap-4 sm:mt-6">
            {[
              ["Top-grain cowhide leather", "Built in top-grain cowhide with a 0.9–1.0 mm leather thickness for a controlled, premium surface."],
              ["Four-layer impact structure", "Multi-foam, EVA, and dual natural latex layers define the internal protection system."],
              ["4-way stretch lining", "The internal lining is chosen to support comfort, fit response, and sustained use in training."],
              ["Extended lace-up cuff", "The cuff and wrist structure are built to reinforce support rather than rely on superficial bulk."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[1.25rem] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.04] sm:rounded-[1.5rem] sm:p-5"
              >
                <h3 className="text-base font-medium sm:text-lg">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="group rounded-[1.5rem] border border-[#5b4638]/45 bg-[linear-gradient(180deg,#171311_0%,#0d0b0a_100%)] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-0.5 hover:border-[#6b5344]/65 hover:shadow-[0_30px_96px_rgba(0,0,0,0.4)] sm:rounded-[2rem] sm:p-8">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
            Brand Assurance
          </p>
          <div className="mt-5 grid gap-4 sm:mt-6">
            {[
              ["Hand-assembled", "Each pair is hand-assembled rather than presented as anonymous mass production."],
              ["Made in Pakistan", "The manufacturing origin is stated directly rather than hidden behind vague brand language."],
              ["Authenticity card included", "Presentation includes an authenticity card to reinforce legitimacy and ownership."],
              ["Legacy Refresh service", "Praeliator supports long-term care through leather cleaning, conditioning, and lace replacement after year one."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition duration-300 hover:border-white/15 hover:bg-white/[0.07] sm:rounded-[1.5rem] sm:p-5"
              >
                <h3 className="text-base font-medium sm:text-lg">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1fr_1fr_1fr] lg:gap-8">
        {[
          {
            title: "Authenticity",
            text: "Trust improves when the brand is specific about what the client receives: presentation box, dust bag, wrapping paper, authenticity card, and care card.",
          },
          {
            title: "Aftercare",
            text: "A glove positioned as luxury should not end at delivery. Refresh service strengthens continuity and stewardship.",
          },
          {
            title: "Private Client Logic",
            text: "The inquiry-led model is not there to create friction. It exists to preserve control, clarity, and a more tailored acquisition process.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8"
          >
            <p className="text-[10px] uppercase tracking-[0.20em] text-[#b9a18d] sm:text-xs sm:tracking-[0.24em]">
              Trust Signal
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-2xl">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/65 sm:leading-8">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:mt-8 sm:rounded-[2rem] sm:p-8 md:p-10">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d] sm:text-xs sm:tracking-[0.28em]">
          Why this matters
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:mt-4 sm:text-3xl">
          Luxury without proof is decoration.
        </h3>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-white/65 sm:mt-5 sm:leading-8">
          Praeliator gains credibility when it speaks in specifics: material, thickness, assembly, structure, service, and presentation. Trust architecture is not filler. It is the layer that makes the brand feel deliberate rather than theatrical.
        </p>
        <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:gap-4">
          <Button
            asChild
            className="w-full rounded-full bg-[#efe5d7] px-6 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:w-auto"
          >
            <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
              Discuss Acquisition
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo("/praeliator-vis")}
            className="w-full rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 sm:w-auto"
          >
            View VIS
          </Button>
        </div>
      </div>
    </SectionFrame>
  );

  const renderExperiencePage = () => (
    <SectionFrame
      eyebrow="Experience"
      title="Why the Praeliator journey is intentionally slower."
      description="This page explains the brand model: less transactional, more selective, more personal."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="group rounded-[1.5rem] border border-white/10 bg-[#12100f] p-5 shadow-[0_16px_44px_rgba(0,0,0,0.24)] transition duration-300 hover:-translate-y-0.5 hover:border-[#5b4638]/55 hover:shadow-[0_24px_68px_rgba(0,0,0,0.34)] sm:rounded-[2rem] sm:p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#5b4638] bg-[#171311] sm:h-12 sm:w-12 sm:rounded-2xl">
                <Icon className="h-5 w-5 text-[#b9a18d]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] sm:mt-5 sm:text-xl">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{pillar.text}</p>
            </div>
          );
        })}
      </div>
    </SectionFrame>
  );

  const renderClientsPage = () => (
    <SectionFrame
      eyebrow="Clients"
      title="Built for serious fighters and serious buyers."
      description="This page isolates the intended audience so the brand feels exact rather than generic."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {audience.map((item) => (
          <div
            key={item}
            className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8"
          >
            <p className="text-xs uppercase tracking-[0.20em] text-[#b9a18d] sm:text-sm sm:tracking-[0.24em]">
              Praeliator Client
            </p>
            <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              {item}
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/65">
              A dedicated audience category within the Praeliator ecosystem, presented
              with sharper focus and stronger positioning.
            </p>
          </div>
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
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div>
          <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8">
            <h3 className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
              Why a waitlist matters
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/65 sm:mt-5 sm:leading-8">
              A luxury brand should not feel endlessly available. A dedicated waitlist page strengthens demand, selectivity, and restraint.
            </p>
          </div>
        </div>

        <div className="group rounded-[1.5rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)] sm:rounded-[2rem] sm:p-8 md:p-10">
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
              className="h-14 w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] disabled:cursor-not-allowed disabled:opacity-70"
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

            <p className="text-xs leading-6 text-white/35">
              Name, email, and phone fields are configured for autofill-friendly
              behavior on compatible Apple devices and browsers.
            </p>
            <p className="text-xs leading-6 text-white/35">
              The form now qualifies lead quality before the first reply by capturing buyer profile, purchase timing, and training context.
            </p>
            <p className="text-xs leading-6 text-white/35">
              This waitlist is wired to send submissions to your email. The first
              live submission may require confirmation from a verification email sent
              to praeliatorboxing@gmail.com.
            </p>
          </form>
        </div>
      </div>
    </SectionFrame>
  );

  const renderContactPage = () => (
    <SectionFrame
      eyebrow="Contact"
      title="Direct channels for private client communication."
      description="This page centralizes the channels that matter: WhatsApp, email, and Instagram."
    >
      <div className="grid gap-4">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07] hover:shadow-[0_22px_58px_rgba(0,0,0,0.26)] sm:rounded-[1.75rem] sm:p-5"
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
          className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07] hover:shadow-[0_22px_58px_rgba(0,0,0,0.26)] sm:rounded-[1.75rem] sm:p-5"
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
          className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07] hover:shadow-[0_22px_58px_rgba(0,0,0,0.26)] sm:rounded-[1.75rem] sm:p-5"
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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <button
            type="button"
            onClick={() => goTo("/")}
            className="flex min-w-0 items-center gap-3 text-left"
          >
            <div className="h-8 w-8 shrink-0 rounded-full border border-[#5b4638] bg-[#151210] sm:h-9 sm:w-9" />
            <div className="min-w-0">
              <p className="truncate text-[10px] uppercase tracking-[0.28em] text-[#b9a18d] sm:text-xs sm:tracking-[0.35em]">
                Praeliator
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.20em] text-white/45 sm:text-[11px] sm:tracking-[0.28em]">
                {currentPageTitle}
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex xl:gap-8">
            <button type="button" onClick={() => goTo("/collection")} className="transition hover:text-white">Collection</button>
            <button type="button" onClick={() => goTo("/praeliator-vis")} className="transition hover:text-white">VIS</button>
            <button type="button" onClick={() => goTo("/acquisition")} className="transition hover:text-white">Acquisition</button>
            <button type="button" onClick={() => goTo("/trust")} className="transition hover:text-white">Trust</button>
            <button type="button" onClick={() => goTo("/experience")} className="transition hover:text-white">Experience</button>
            <button type="button" onClick={() => goTo("/clients")} className="transition hover:text-white">Clients</button>
            <button type="button" onClick={() => goTo("/waitlist")} className="transition hover:text-white">Waitlist</button>
            <button type="button" onClick={() => goTo("/contact")} className="transition hover:text-white">Contact</button>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {route !== "/" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/")}
                className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/waitlist")}
                className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                Join Waitlist
              </Button>
            )}
            <Button
              asChild
              className="rounded-full bg-[#efe5d7] px-5 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)]"
            >
              <a href={currentPurchaseLink} target="_blank" rel="noreferrer">
                Private Purchase
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              className="rounded-full bg-[#efe5d7] px-3 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)] sm:px-5"
            >
              <a href={currentPurchaseLink} target="_blank" rel="noreferrer">
                Buy
              </a>
            </Button>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-white/10 bg-[#0a0a0a] lg:hidden">
            <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
              {[
                ["Collection", "/collection"],
                ["VIS", "/praeliator-vis"],
                ["Acquisition", "/acquisition"],
                ["Trust", "/trust"],
                ["Experience", "/experience"],
                ["Clients", "/clients"],
                ["Waitlist", "/waitlist"],
                ["Contact", "/contact"],
              ].map(([label, path]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => goTo(path as Route)}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm text-white/80 transition hover:bg-white/10"
                >
                  <span>{label}</span>
                  <ChevronRight className="h-4 w-4 text-white/35" />
                </button>
              ))}
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo(route !== "/" ? "/" : "/waitlist")}
                  className="h-12 rounded-full border-white/15 bg-transparent text-[#f4efe7] transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                >
                  {route !== "/" ? "Return Home" : "Join Waitlist"}
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_18px_38px_rgba(239,229,215,0.24)]"
                >
                  <a href={currentPurchaseLink} target="_blank" rel="noreferrer">
                    Private Purchase
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.08),transparent_30%)]">
        {renderPage()}
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
            <button type="button" onClick={() => goTo("/collection")} className="transition hover:text-white">Collection</button>
            <button type="button" onClick={() => goTo("/praeliator-vis")} className="transition hover:text-white">VIS</button>
            <button type="button" onClick={() => goTo("/acquisition")} className="transition hover:text-white">Acquisition</button>
            <button type="button" onClick={() => goTo("/trust")} className="transition hover:text-white">Trust</button>
            <button type="button" onClick={() => goTo("/waitlist")} className="transition hover:text-white">Waitlist</button>
            <button type="button" onClick={() => goTo("/contact")} className="transition hover:text-white">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}