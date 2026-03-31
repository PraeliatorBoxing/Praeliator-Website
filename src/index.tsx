
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
  Check,
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

const homeCinematicMedia = {
  hero: { video: "/videos/home-hero.mp4", poster: homeImageSources.hero },
  vis: { video: "/videos/home-vis.mp4", poster: visImageSources.hero },
  material: { video: "/videos/home-material.mp4", poster: visImageSources.leather },
  ownership: { video: "/videos/home-ownership.mp4", poster: visImageSources.packaging },
  acquisition: { video: "/videos/home-acquisition.mp4", poster: homeImageSources.presentation },
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

const titleOptions = [
  { value: "Mr.", label: "Mr." },
  { value: "Mrs.", label: "Mrs." },
  { value: "Ms.", label: "Ms." },
  { value: "Miss", label: "Miss" },
  { value: "Mx.", label: "Mx." },
  { value: "Dr.", label: "Dr." },
  { value: "Prof.", label: "Prof." },
  { value: "Sir", label: "Sir" },
  { value: "Dame", label: "Dame" },
  { value: "Lord", label: "Lord" },
  { value: "Lady", label: "Lady" },
  { value: "Prince", label: "Prince" },
  { value: "Princess", label: "Princess" },
  { value: "Sheikh", label: "Sheikh" },
  { value: "Sheikha", label: "Sheikha" },
  { value: "H.E.", label: "H.E." },
  { value: "H.E. Dr.", label: "H.E. Dr." },
  { value: "H.E. Mr.", label: "H.E. Mr." },
  { value: "H.E. Mrs.", label: "H.E. Mrs." },
  { value: "H.H.", label: "H.H." },
  { value: "H.H. Prince", label: "H.H. Prince" },
  { value: "H.H. Sheikh", label: "H.H. Sheikh" },
  { value: "H.H. Sheikha", label: "H.H. Sheikha" },
  { value: "H.R.H.", label: "H.R.H." },
  { value: "H.R.H. Prince", label: "H.R.H. Prince" },
  { value: "H.R.H. Princess", label: "H.R.H. Princess" },
  { value: "Esq.", label: "Esq." },
  { value: "Captain", label: "Captain" },
  { value: "Chief", label: "Chief" },
  { value: "Dato", label: "Dato" },
  { value: "Dato Sri", label: "Dato Sri" },
  { value: "Datin", label: "Datin" },
  { value: "Datin Sri", label: "Datin Sri" },
  { value: "Puan Sri", label: "Puan Sri" },
  { value: "Tan Sri", label: "Tan Sri" },
  { value: "Reverend", label: "Reverend" },
  { value: "Herr", label: "Herr" },
  { value: "Frau", label: "Frau" },
  { value: "Mdm.", label: "Mdm." },
  { value: "Monsieur", label: "Monsieur" },
  { value: "Madame", label: "Madame" },
  { value: "Señor", label: "Señor" },
  { value: "Señora", label: "Señora" },
  { value: "Señorita", label: "Señorita" },
  { value: "先生", label: "先生" },
  { value: "女士", label: "女士" },
];

const interestOptions = [
  { value: "Praeliator VIS", label: "Praeliator VIS" },
  { value: "Future releases", label: "Future releases" },
  { value: "Collector interest", label: "Collector interest" },
  { value: "General brand inquiry", label: "General brand inquiry" },
];

const timelineOptions = [
  { value: "Ready now", label: "Ready now" },
  { value: "Within 30 days", label: "Within 30 days" },
  { value: "Within 3 months", label: "Within 3 months" },
  { value: "Researching only", label: "Researching only" },
];

const contactPreferenceOptions = [
  { value: "Phone", label: "Phone" },
  { value: "Email", label: "Email" },
  { value: "Either", label: "Either" },
];

type WaitlistFieldName = keyof typeof initialWaitlistForm;
type WaitlistErrors = Partial<Record<WaitlistFieldName, string>>;

const WAITLIST_COOLDOWN_MS = 45_000;
const WAITLIST_REQUEST_TIMEOUT_MS = 12_000;
const WAITLIST_COOLDOWN_KEY = "praeliator_waitlist_cooldown_until";
const WAITLIST_ANALYTICS_EVENT = "praeliator_waitlist_event";
const WAITLIST_HONEYPOT_FIELD = "companyWebsite";

const waitlistRequiredFields: WaitlistFieldName[] = [
  "fullName",
  "email",
  "phoneCountryCode",
  "whatsapp",
  "country",
  "interest",
  "timeline",
  "contactPreference",
];

const normalizeInlineText = (value: string) => value.replace(/\s{2,}/g, " ").replace(/^\s+/g, "");
const normalizeFinalText = (value: string) => value.replace(/\s+/g, " ").trim();
const normalizeDialCode = (value: string) => {
  const digits = value.replace(/[^\d]/g, "").slice(0, 4);
  if (!digits && !value.includes("+")) return "";
  return `+${digits}`;
};
const normalizePhoneNumber = (value: string) => value.replace(/[^\d]/g, "").slice(0, 15);
const normalizeEmailInline = (value: string) => value.replace(/\s+/g, "");
const normalizeEmailFinal = (value: string) => value.replace(/\s+/g, "").trim().toLowerCase();

const normalizeWaitlistFieldValue = (
  field: WaitlistFieldName,
  value: string,
  stage: "change" | "blur" | "submit" = "change"
) => {
  if (field === "fullName") return stage === "change" ? normalizeInlineText(value) : normalizeFinalText(value);
  if (field === "email") return stage === "change" ? normalizeEmailInline(value) : normalizeEmailFinal(value);
  if (field === "phoneCountryCode") return normalizeDialCode(value);
  if (field === "whatsapp") return normalizePhoneNumber(value);
  if (field === "country") return stage === "change" ? normalizeInlineText(value) : normalizeFinalText(value);
  if (field === "note") return stage === "change" ? value.replace(/^\s+/g, "") : value.trim();
  return stage === "change" ? value : value.trim();
};

const normalizeWaitlistForm = (form: typeof initialWaitlistForm) => ({
  title: normalizeWaitlistFieldValue("title", form.title, "submit"),
  fullName: normalizeWaitlistFieldValue("fullName", form.fullName, "submit"),
  email: normalizeWaitlistFieldValue("email", form.email, "submit"),
  phoneCountryCode: normalizeWaitlistFieldValue("phoneCountryCode", form.phoneCountryCode, "submit"),
  whatsapp: normalizeWaitlistFieldValue("whatsapp", form.whatsapp, "submit"),
  country: normalizeWaitlistFieldValue("country", form.country, "submit"),
  interest: normalizeWaitlistFieldValue("interest", form.interest, "submit"),
  timeline: normalizeWaitlistFieldValue("timeline", form.timeline, "submit"),
  contactPreference: normalizeWaitlistFieldValue("contactPreference", form.contactPreference, "submit"),
  note: normalizeWaitlistFieldValue("note", form.note, "submit"),
});

const getDialCodePhoneRule = (dialCode: string) => {
  const normalizedDialCode = normalizeDialCode(dialCode);
  const rules: Record<string, { min: number; max: number; message: string }> = {
    "+1": { min: 10, max: 10, message: "US and Canadian numbers should be 10 digits." },
    "+33": { min: 9, max: 9, message: "French numbers should be 9 digits." },
    "+34": { min: 9, max: 9, message: "Spanish numbers should be 9 digits." },
    "+44": { min: 10, max: 11, message: "UK numbers are usually 10 to 11 digits." },
    "+49": { min: 10, max: 13, message: "German numbers are usually 10 to 13 digits." },
    "+52": { min: 10, max: 10, message: "Mexican numbers should be 10 digits." },
    "+55": { min: 10, max: 11, message: "Brazilian numbers are usually 10 to 11 digits." },
    "+61": { min: 9, max: 9, message: "Australian numbers should be 9 digits." },
    "+81": { min: 10, max: 10, message: "Japanese mobile numbers are usually 10 digits." },
    "+91": { min: 10, max: 10, message: "Indian numbers should be 10 digits." },
  };

  return rules[normalizedDialCode] || { min: 7, max: 15, message: "Enter a valid phone number." };
};

const validateWaitlistForm = (form: typeof initialWaitlistForm): WaitlistErrors => {
  const normalizedForm = normalizeWaitlistForm(form);
  const errors: WaitlistErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRule = getDialCodePhoneRule(normalizedForm.phoneCountryCode);

  if (!normalizedForm.fullName) {
    errors.fullName = "Full name is required.";
  } else if (normalizedForm.fullName.length < 2) {
    errors.fullName = "Enter a valid full name.";
  }

  if (!normalizedForm.email) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(normalizedForm.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!normalizedForm.country) {
    errors.country = "Country is required.";
  }

  if (!normalizedForm.phoneCountryCode) {
    errors.phoneCountryCode = "Dial code is required.";
  } else if (!/^\+\d{1,4}$/.test(normalizedForm.phoneCountryCode)) {
    errors.phoneCountryCode = "Enter a valid dial code.";
  }

  if (!normalizedForm.whatsapp) {
    errors.whatsapp = "Phone number is required.";
  } else if (
    normalizedForm.whatsapp.length < phoneRule.min ||
    normalizedForm.whatsapp.length > phoneRule.max
  ) {
    errors.whatsapp = phoneRule.message;
  }

  if (!normalizedForm.interest) errors.interest = "Select an interest.";
  if (!normalizedForm.timeline) errors.timeline = "Select a timeline.";
  if (!normalizedForm.contactPreference) errors.contactPreference = "Select a preferred contact method.";

  return errors;
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

const formFieldBaseClass = "browser-form-element min-h-[3.75rem] w-full rounded-[1.45rem] border px-5 text-[16px] text-[#f4efe7] outline-none transition-[border-color,background-color,box-shadow,transform] duration-300 placeholder:text-white/24 sm:text-sm";
const formPanelClass = "absolute left-0 right-0 top-[calc(100%+0.65rem)] z-30 overflow-hidden rounded-[1.45rem] border border-[#231d18] bg-[#0a0908]/98 shadow-[0_22px_58px_rgba(0,0,0,0.34)] backdrop-blur-xl";
const formOptionRowClass = "flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition duration-200";

function getFormFieldStateClasses({
  invalid = false,
  success = false,
  active = false,
}: {
  invalid?: boolean;
  success?: boolean;
  active?: boolean;
}) {
  if (invalid) return "border-[#805148] bg-[#120f0e] focus:border-[#b06d61]";
  if (success) return "border-[#7d6753] bg-[#100e0c] focus:border-[#b9a18d]";
  if (active) return "border-[#6a5545] bg-[#100f0e] shadow-[0_16px_36px_rgba(0,0,0,0.2)]";
  return "border-white/[0.08] bg-[#0c0b0a] hover:border-white/[0.12] focus:border-[#6a5545]";
}

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
  onBlur,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  autoCapitalize,
  invalid = false,
  success = false,
  describedBy,
  maxLength,
}: {
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoCapitalize?: string;
  invalid?: boolean;
  success?: boolean;
  describedBy?: string;
  maxLength?: number;
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      autoComplete={autoComplete}
      inputMode={inputMode}
      autoCapitalize={autoCapitalize}
      maxLength={maxLength}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className={`${formFieldBaseClass} ${getFormFieldStateClasses({ invalid, success })}`}
      placeholder={placeholder}
    />
  );
}

function SelectField({
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  searchable = false,
  searchPlaceholder = "Search",
  fieldLabel,
  invalid = false,
  success = false,
  describedBy,
}: {
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onBlur?: () => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  fieldLabel?: string;
  invalid?: boolean;
  success?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = `${name}-listbox`;
  const labelId = fieldLabel ? `${name}-label` : undefined;
  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) => {
      const label = option.label.toLowerCase();
      const optionValue = option.value.toLowerCase();
      return label.includes(normalizedQuery) || optionValue.includes(normalizedQuery);
    });
  }, [options, query, searchable]);

  const activeOptionId = open && filteredOptions[highlightedIndex] ? `${name}-option-${highlightedIndex}` : undefined;
  const selectedIndex = Math.max(0, filteredOptions.findIndex((option) => option.value === value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        if (open) onBlur?.();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  useEffect(() => {
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex, open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    if (searchable) {
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [open, searchable]);

  const commitValue = (nextValue: string) => {
    onChange({ target: { name, value: nextValue } } as React.ChangeEvent<HTMLSelectElement>);
    onBlur?.();
    setOpen(false);
    setQuery("");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const moveHighlight = (direction: 1 | -1) => {
    if (!filteredOptions.length) return;
    setHighlightedIndex((current) => {
      const nextIndex = current + direction;
      if (nextIndex < 0) return filteredOptions.length - 1;
      if (nextIndex >= filteredOptions.length) return 0;
      return nextIndex;
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      moveHighlight(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      moveHighlight(-1);
      return;
    }

    if (event.key === "Home" && open) {
      event.preventDefault();
      setHighlightedIndex(0);
      return;
    }

    if (event.key === "End" && open) {
      event.preventDefault();
      setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const highlighted = filteredOptions[highlightedIndex];
      if (highlighted) commitValue(highlighted.value);
      return;
    }

    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
        onBlur?.();
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      }
      return;
    }

    if (event.key === "Tab" && open) {
      setOpen(false);
      onBlur?.();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-labelledby={labelId}
        aria-activedescendant={activeOptionId}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className={`group flex min-h-[3.75rem] w-full items-center justify-between gap-4 rounded-[1.45rem] border px-5 py-3 text-left outline-none transition-[border-color,background-color,box-shadow,transform] duration-300 ${getFormFieldStateClasses({ invalid, success, active: open })}`}
      >
        <span className="min-w-0 flex-1">
          {fieldLabel ? (
            <span id={labelId} className={`mb-1 block text-[10px] uppercase tracking-[0.22em] ${selectedOption || open ? "text-[#b9a18d]" : "text-white/30"}`}>
              {fieldLabel}
            </span>
          ) : null}
          <span className={`block truncate text-[16px] sm:text-sm ${selectedOption ? "text-[#f4efe7]" : "text-white/24"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronRight className={`h-4 w-4 shrink-0 transition duration-300 ${open ? "rotate-[270deg] text-[#b9a18d]" : "rotate-90 text-white/34"}`} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: easeLuxury }}
            className={formPanelClass}
          >
            {searchable ? (
              <div className="border-b border-white/[0.08] p-3">
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className={`${formFieldBaseClass} min-h-[3rem] rounded-[1.05rem] border-white/[0.08] bg-[#100f0e] px-4 text-[16px] placeholder:text-white/22 focus:border-[#6a5545] sm:text-sm`}
                />
              </div>
            ) : null}
            <div
              id={listboxId}
              className="browser-scrollbar max-h-[min(18rem,45vh)] overflow-y-auto overscroll-contain py-2 sm:max-h-72"
              role="listbox"
              aria-labelledby={labelId}
              onWheelCapture={(event) => {
                event.stopPropagation();
              }}
              onTouchMoveCapture={(event) => {
                event.stopPropagation();
              }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-4 text-sm text-white/42">No matches found.</div>
              ) : null}
              {filteredOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    id={`${name}-option-${index}`}
                    key={`${name}-${option.value || option.label}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => commitValue(option.value)}
                    className={`${formOptionRowClass} ${isHighlighted ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"}`}
                  >
                    <span className={`truncate text-[15px] sm:text-sm ${isSelected ? "text-[#f4efe7]" : "text-white/72"}`}>{option.label}</span>
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-[#b9a18d]" /> : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function SearchPicker({
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  exactMatchUpdates,
  inputMode,
  fieldLabel,
  invalid = false,
  success = false,
  describedBy,
}: {
  name: string;
  onChange: (value: string, matchedOption?: { label: string; code: string }) => void;
  onBlur?: () => void;
  options: Array<{ label: string; code: string }>;
  value: string;
  placeholder: string;
  exactMatchUpdates?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  fieldLabel?: string;
  invalid?: boolean;
  success?: boolean;
  describedBy?: string;
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxId = `${name}-picker-listbox`;
  const labelId = fieldLabel ? `${name}-picker-label` : undefined;

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return options.slice(0, 16);

    return options
      .filter((option) => {
        const label = option.label.toLowerCase();
        const code = option.code.toLowerCase();
        return label.includes(query) || code.includes(query);
      })
      .slice(0, 16);
  }, [options, value]);

  const activeOptionId = open && filtered[highlightedIndex] ? `${name}-picker-option-${highlightedIndex}` : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        if (open) onBlur?.();
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onBlur]);

  const selectedIndex = Math.max(
    0,
    filtered.findIndex((option) => option.label.toLowerCase() === value.trim().toLowerCase() || option.code.toLowerCase() === value.trim().toLowerCase())
  );

  useEffect(() => {
    setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex, open]);

  const commitSelection = (option: { label: string; code: string }) => {
    onChange(inputMode === "tel" ? option.code : option.label, option);
    onBlur?.();
    setOpen(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const moveHighlight = (direction: 1 | -1) => {
    if (!filtered.length) return;
    setHighlightedIndex((current) => {
      const nextIndex = current + direction;
      if (nextIndex < 0) return filtered.length - 1;
      if (nextIndex >= filtered.length) return 0;
      return nextIndex;
    });
  };

  return (
    <div ref={wrapperRef} className="relative">
      {fieldLabel ? (
        <p id={labelId} className={`mb-2 text-[10px] uppercase tracking-[0.22em] ${value ? "text-[#b9a18d]" : "text-white/30"}`}>
          {fieldLabel}
        </p>
      ) : null}
      <ChevronRight className={`pointer-events-none absolute right-5 z-10 h-4 w-4 -translate-y-1/2 transition duration-300 ${open ? "top-[2.6rem] rotate-[270deg] text-[#b9a18d]" : "top-[2.6rem] rotate-90 text-white/34"}`} />
      <input
        ref={inputRef}
        value={value}
        role="combobox"
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        aria-labelledby={labelId}
        aria-activedescendant={activeOptionId}
        onChange={(event) => {
          const next = event.target.value;
          const cleaned = inputMode === "tel" ? next.replace(/[^\d+]/g, "") : normalizeInlineText(next);
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
        onBlur={() => {
          window.setTimeout(() => {
            if (!wrapperRef.current?.contains(document.activeElement)) {
              onBlur?.();
            }
          }, 0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) {
              setOpen(true);
              return;
            }
            moveHighlight(1);
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) {
              setOpen(true);
              return;
            }
            moveHighlight(-1);
            return;
          }

          if (event.key === "Home" && open) {
            event.preventDefault();
            setHighlightedIndex(0);
            return;
          }

          if (event.key === "End" && open) {
            event.preventDefault();
            setHighlightedIndex(Math.max(0, filtered.length - 1));
            return;
          }

          if (event.key === "Enter" && open) {
            event.preventDefault();
            const highlighted = filtered[highlightedIndex];
            if (highlighted) commitSelection(highlighted);
            return;
          }

          if (event.key === "Escape" && open) {
            event.preventDefault();
            setOpen(false);
            onBlur?.();
            return;
          }

          if (event.key === "Tab" && open) {
            setOpen(false);
            onBlur?.();
          }
        }}
        inputMode={inputMode}
        className={`${formFieldBaseClass} pr-12 ${getFormFieldStateClasses({ invalid, success, active: open })}`}
        placeholder={placeholder}
      />

      <AnimatePresence>
        {open && filtered.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.2, ease: easeLuxury }}
            className={formPanelClass}
          >
            <div
              id={listboxId}
              className="browser-scrollbar max-h-[min(18rem,45vh)] overflow-y-auto overscroll-contain py-2 sm:max-h-72"
              role="listbox"
              aria-labelledby={labelId}
              onWheelCapture={(event) => {
                event.stopPropagation();
              }}
              onTouchMoveCapture={(event) => {
                event.stopPropagation();
              }}
            >
              {filtered.map((option, index) => {
                const isSelected = option.label.toLowerCase() === value.trim().toLowerCase() || option.code.toLowerCase() === value.trim().toLowerCase();
                const isHighlighted = index === highlightedIndex;

                return (
                  <button
                    id={`${name}-picker-option-${index}`}
                    key={`${option.code}-${option.label}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => commitSelection(option)}
                    className={`${formOptionRowClass} ${isHighlighted ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"}`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] text-[#f4efe7] sm:text-sm">{option.label}</span>
                      <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-[#b9a18d]">{option.code}</span>
                    </div>
                    {isSelected ? <Check className="h-4 w-4 shrink-0 text-[#b9a18d]" /> : null}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FieldError({
  id,
  message,
}: {
  id?: string;
  message?: string;
}) {
  if (!message) return null;

  return <p id={id} className="mt-2 text-[13px] leading-5 text-[#c98f82]">{message}</p>;
}

function FieldNote({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="mt-2 text-[13px] leading-5 text-white/36">{children}</p>;
}

function CinematicScene({
  section,
  index,
  active,
}: {
  section: {
    key: string;
    word: string;
    line?: string;
    cta: string;
    href?: string;
    action?: () => void;
    video: string;
    poster: string;
  };
  index: number;
  active: boolean;
}) {
  const inView = active;

  return (
    <section
      className="relative isolate h-[100svh] min-h-[100svh] overflow-hidden snap-start"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: inView ? 1 : 1.03, opacity: 1 }}
          transition={{ duration: 1.35, ease: easeLuxury }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 scale-[1.02] bg-cover bg-center"
            style={{ backgroundImage: `url(${section.poster})` }}
            aria-hidden="true"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={section.poster}
          >
            <source src={section.video} type="video/mp4" />
          </video>
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.52)_74%,rgba(0,0,0,0.78))]" />
        <div className="absolute inset-x-0 top-0 h-[30svh] bg-[linear-gradient(180deg,rgba(4,4,4,0.82),rgba(4,4,4,0.28),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[34svh] bg-[linear-gradient(180deg,transparent,rgba(4,4,4,0.18),rgba(4,4,4,0.78))]" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-6 pt-20 sm:px-10 sm:pt-24 lg:px-16 lg:pt-28">
        <motion.div
          animate={{
            opacity: inView ? 1 : 0,
            y: inView ? 0 : 42,
            filter: inView ? "blur(0px)" : "blur(12px)",
          }}
          transition={{ duration: 0.85, delay: inView ? 0.28 : 0, ease: easeLuxury }}
          className="mx-auto flex max-w-[92vw] flex-col items-center text-center"
        >
          <motion.p
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 22 }}
            transition={{ duration: 0.8, delay: inView ? 0.34 : 0, ease: easeLuxury }}
            className="max-w-[92vw] text-[clamp(2.4rem,7.4vw,6.6rem)] font-extralight uppercase leading-[0.92] tracking-[0.12em] text-white/96 sm:tracking-[0.14em]"
          >
            {section.word}
          </motion.p>

          {section.line ? (
            <motion.p
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
              transition={{ duration: 0.78, delay: inView ? 0.48 : 0, ease: easeLuxury }}
              className="mt-4 max-w-[28rem] text-[clamp(0.8rem,1.1vw,0.98rem)] leading-6 tracking-[0.1em] text-white/72 sm:leading-7"
            >
              {section.line}
            </motion.p>
          ) : null}

          <motion.div
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 14 }}
            transition={{ duration: 0.76, delay: inView ? 0.62 : 0, ease: easeLuxury }}
            className="mt-8"
          >
            {section.href ? (
              <Button
                asChild
                className="rounded-full bg-[#efe5d7] px-8 py-5 text-[11px] uppercase tracking-[0.24em] text-[#151210] shadow-[0_16px_40px_rgba(239,229,215,0.22)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_22px_54px_rgba(239,229,215,0.28)]"
              >
                <a href={section.href} target="_blank" rel="noreferrer">
                  {section.cta}
                </a>
              </Button>
            ) : section.action ? (
              <Button
                type="button"
                onClick={section.action}
                className="rounded-full bg-[#efe5d7] px-8 py-5 text-[11px] uppercase tracking-[0.24em] text-[#151210] shadow-[0_16px_40px_rgba(239,229,215,0.22)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_22px_54px_rgba(239,229,215,0.28)]"
              >
                {section.cta}
              </Button>
            ) : null}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FullScreenCinematicHomepage({
  sections,
}: {
  sections: Array<{
    key: string;
    word: string;
    line?: string;
    cta: string;
    href?: string;
    action?: () => void;
    video: string;
    poster: string;
  }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const unlockTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const goToIndex = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(sections.length - 1, nextIndex));
    if (clamped === activeIndex || isAnimating) return;

    setIsAnimating(true);
    setActiveIndex(clamped);

    if (unlockTimerRef.current) {
      window.clearTimeout(unlockTimerRef.current);
    }

    unlockTimerRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      unlockTimerRef.current = null;
    }, 950);
  };

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (isAnimating || Math.abs(event.deltaY) < 24) return;
      goToIndex(activeIndex + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (isAnimating) {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
          event.preventDefault();
        }
        return;
      }

      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goToIndex(activeIndex + 1);
      } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goToIndex(activeIndex - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToIndex(sections.length - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, isAnimating, sections.length]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const startY = touchStartYRef.current;
    const endY = event.changedTouches[0]?.clientY ?? null;
    touchStartYRef.current = null;

    if (startY === null || endY === null || isAnimating) return;

    const deltaY = startY - endY;
    if (Math.abs(deltaY) < 42) return;
    goToIndex(activeIndex + (deltaY > 0 ? 1 : -1));
  };

  return (
    <div
      className="relative h-[100svh] overflow-hidden bg-[#040404]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        animate={{ y: `-${activeIndex * 100}svh` }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="will-change-transform"
      >
        {sections.map((section, index) => (
          <CinematicScene
            key={section.key}
            section={section}
            index={index}
            active={index === activeIndex}
          />
        ))}
      </motion.div>
    </div>
  );
}

function BrowserFormStyles() {
  return (
    <style>{`
      .browser-form-element {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        color-scheme: dark;
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
        font-size: 16px;
      }

      @media (min-width: 640px) {
        .browser-form-element {
          font-size: 0.875rem;
        }
      }

      .browser-form-element:focus-visible,
      button[role='combobox']:focus-visible {
        box-shadow: 0 0 0 1px rgba(185, 161, 141, 0.32), 0 0 0 3px rgba(185, 161, 141, 0.06);
      }

      .browser-form-element:-webkit-autofill,
      .browser-form-element:-webkit-autofill:hover,
      .browser-form-element:-webkit-autofill:focus,
      .browser-form-element:-webkit-autofill:active {
        -webkit-text-fill-color: #f4efe7;
        caret-color: #f4efe7;
        box-shadow: 0 0 0 1000px #0c0b0a inset;
        -webkit-box-shadow: 0 0 0 1000px #0c0b0a inset;
        border-color: rgba(255, 255, 255, 0.08);
        transition: background-color 999999s ease-out 0s;
      }

      .browser-form-element::selection {
        background: rgba(239, 229, 215, 0.16);
        color: #f4efe7;
      }

      .browser-form-element::-webkit-calendar-picker-indicator {
        filter: invert(0.92) opacity(0.68);
      }

      .browser-form-element::-ms-reveal,
      .browser-form-element::-ms-clear,
      .browser-form-element::-webkit-contacts-auto-fill-button,
      .browser-form-element::-webkit-credentials-auto-fill-button {
        filter: invert(0.92) opacity(0.68);
      }

      .browser-form-element[type='number']::-webkit-outer-spin-button,
      .browser-form-element[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .browser-form-element[type='number'] {
        -moz-appearance: textfield;
      }

      .browser-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(244, 239, 231, 0.14) #0a0908;
      }

      .browser-scrollbar::-webkit-scrollbar {
        width: 10px;
      }

      .browser-scrollbar::-webkit-scrollbar-track {
        background: #0a0908;
      }

      .browser-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(244, 239, 231, 0.14);
        border-radius: 9999px;
        border: 2px solid #0a0908;
      }

      .browser-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(244, 239, 231, 0.22);
      }

      .browser-submit-spinner {
        width: 1rem;
        height: 1rem;
        border-radius: 9999px;
        border: 2px solid rgba(21, 18, 16, 0.22);
        border-top-color: #151210;
        animation: browser-spin 0.8s linear infinite;
      }

      @keyframes browser-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
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
  const [waitlistErrors, setWaitlistErrors] = useState<WaitlistErrors>({});
  const [waitlistTouched, setWaitlistTouched] = useState<Partial<Record<WaitlistFieldName, boolean>>>({});
  const [waitlistState, setWaitlistState] = useState({
    loading: false,
    success: false,
    error: "",
    reference: "",
    serviceMessage: "",
  });
  const [waitlistHoneypot, setWaitlistHoneypot] = useState("");
  const [waitlistCooldownUntil, setWaitlistCooldownUntil] = useState(0);
  const [waitlistStarted, setWaitlistStarted] = useState(false);
  const [waitlistStartedAt, setWaitlistStartedAt] = useState<number | null>(null);
  const waitlistRequestControllerRef = useRef<AbortController | null>(null);

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

  const trackWaitlistEvent = React.useCallback(
    (name: string, detail: Record<string, unknown> = {}) => {
      if (typeof window === "undefined") return;

      const payload = {
        event: WAITLIST_ANALYTICS_EVENT,
        event_name: name,
        route,
        timestamp: Date.now(),
        ...detail,
      };

      const analyticsWindow = window as Window & {
        dataLayer?: Array<Record<string, unknown>>;
      };

      analyticsWindow.dataLayer?.push(payload);
      window.dispatchEvent(new CustomEvent("praeliator:analytics", { detail: payload }));
    },
    [route]
  );

  useEffect(() => {
    const storedCooldown = typeof window !== "undefined"
      ? Number(window.localStorage.getItem(WAITLIST_COOLDOWN_KEY) || "0")
      : 0;

    if (storedCooldown > Date.now()) {
      setWaitlistCooldownUntil(storedCooldown);
    }

    return () => {
      waitlistRequestControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (route !== "/waitlist") return;
    trackWaitlistEvent("waitlist_view");
  }, [route, trackWaitlistEvent]);

  useEffect(() => {
    if (!waitlistCooldownUntil) return;
    if (waitlistCooldownUntil <= Date.now()) {
      setWaitlistCooldownUntil(0);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(WAITLIST_COOLDOWN_KEY);
      }
      return;
    }

    const timer = window.setInterval(() => {
      if (waitlistCooldownUntil <= Date.now()) {
        setWaitlistCooldownUntil(0);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(WAITLIST_COOLDOWN_KEY);
        }
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [waitlistCooldownUntil]);

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

  const getWaitlistCooldownSeconds = () =>
    waitlistCooldownUntil > Date.now() ? Math.ceil((waitlistCooldownUntil - Date.now()) / 1000) : 0;

  const markWaitlistStarted = (source: string) => {
    if (waitlistStarted) return;
    const startedAt = Date.now();
    setWaitlistStarted(true);
    setWaitlistStartedAt(startedAt);
    trackWaitlistEvent("waitlist_started", { source });
  };

  const markWaitlistFieldTouched = (field: WaitlistFieldName) => {
    setWaitlistTouched((current) => ({ ...current, [field]: true }));
  };

  const markWaitlistFieldsTouched = (fields: WaitlistFieldName[]) => {
    setWaitlistTouched((current) => ({
      ...current,
      ...Object.fromEntries(fields.map((field) => [field, true])),
    }));
  };

  const getVisibleFieldError = (field: WaitlistFieldName) =>
    waitlistTouched[field] ? waitlistErrors[field] : undefined;

  const getFieldDescribedBy = (field: WaitlistFieldName) =>
    getVisibleFieldError(field) ? `${field}-error` : undefined;

  const getFieldSuccess = (field: WaitlistFieldName) => {
    if (!waitlistTouched[field]) return false;
    if (waitlistErrors[field]) return false;
    const value = waitlistForm[field];
    return typeof value === "string" ? value.trim().length > 0 : false;
  };

  const updateWaitlistForm = (
    updater: (current: typeof initialWaitlistForm) => typeof initialWaitlistForm
  ) => {
    setWaitlistForm((current) => {
      const next = updater(current);

      if (waitlistState.success || waitlistState.error) {
        setWaitlistState((state) => ({
          ...state,
          success: false,
          error: "",
          reference: "",
          serviceMessage: "",
        }));
      }

      if (Object.keys(waitlistTouched).length > 0) {
        setWaitlistErrors(validateWaitlistForm(next));
      }

      return next;
    });
  };

  const handleWaitlistChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const field = event.target.name as WaitlistFieldName;
    const value = normalizeWaitlistFieldValue(field, event.target.value, "change");
    markWaitlistStarted(`field:${field}`);
    updateWaitlistForm((current) => ({ ...current, [field]: value }));
  };

  const handleWaitlistBlur = (field: WaitlistFieldName) => {
    markWaitlistFieldTouched(field);
    updateWaitlistForm((current) => {
      const normalized = {
        ...current,
        [field]: normalizeWaitlistFieldValue(field, current[field], "blur"),
      };
      const nextErrors = validateWaitlistForm(normalized);
      setWaitlistErrors(nextErrors);
      if (nextErrors[field]) {
        trackWaitlistEvent("waitlist_field_invalid", { field, message: nextErrors[field] });
      }
      return normalized;
    });
  };

  const handleWaitlistSelectChange = (
    field: WaitlistFieldName,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    markWaitlistFieldTouched(field);
    markWaitlistStarted(`select:${field}`);
    handleWaitlistChange(event);
  };

  const handleCountryChange = (value: string, matchedOption?: { label: string; code: string }) => {
    markWaitlistStarted("field:country");
    updateWaitlistForm((current) => {
      const next = {
        ...current,
        country: normalizeWaitlistFieldValue("country", value, "change"),
        phoneCountryCode: matchedOption
          ? normalizeWaitlistFieldValue("phoneCountryCode", matchedOption.code, "change")
          : current.phoneCountryCode,
      };

      if (waitlistTouched.country || waitlistTouched.phoneCountryCode) {
        setWaitlistErrors(validateWaitlistForm(next));
      }

      return next;
    });
  };

  const handleCountryBlur = () => {
    markWaitlistFieldsTouched(["country", "phoneCountryCode"]);
    updateWaitlistForm((current) => {
      const normalized = {
        ...current,
        country: normalizeWaitlistFieldValue("country", current.country, "blur"),
        phoneCountryCode: normalizeWaitlistFieldValue("phoneCountryCode", current.phoneCountryCode, "blur"),
      };
      const nextErrors = validateWaitlistForm(normalized);
      setWaitlistErrors(nextErrors);
      if (nextErrors.country || nextErrors.phoneCountryCode) {
        trackWaitlistEvent("waitlist_field_invalid", {
          field: nextErrors.country ? "country" : "phoneCountryCode",
          message: nextErrors.country || nextErrors.phoneCountryCode,
        });
      }
      return normalized;
    });
  };

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    markWaitlistStarted("submit");

    const cooldownSeconds = getWaitlistCooldownSeconds();
    if (cooldownSeconds > 0) {
      setWaitlistState({
        loading: false,
        success: false,
        error: `Please wait ${cooldownSeconds}s before submitting again.`,
        reference: "",
        serviceMessage: "",
      });
      trackWaitlistEvent("waitlist_submit_blocked", { reason: "cooldown", seconds_remaining: cooldownSeconds });
      return;
    }

    if (waitlistHoneypot.trim()) {
      setWaitlistState({
        loading: false,
        success: false,
        error: "Submission could not be completed.",
        reference: "",
        serviceMessage: "",
      });
      trackWaitlistEvent("waitlist_submit_blocked", { reason: "honeypot" });
      return;
    }

    const normalizedForm = normalizeWaitlistForm(waitlistForm);
    const nextErrors = validateWaitlistForm(normalizedForm);

    setWaitlistForm(normalizedForm);
    setWaitlistErrors(nextErrors);
    markWaitlistFieldsTouched(waitlistRequiredFields);

    if (Object.keys(nextErrors).length > 0) {
      setWaitlistState({
        loading: false,
        success: false,
        error: "Please correct the highlighted fields.",
        reference: "",
        serviceMessage: "",
      });
      trackWaitlistEvent("waitlist_submit_invalid", {
        fields: Object.keys(nextErrors),
      });
      return;
    }

    setWaitlistState({
      loading: true,
      success: false,
      error: "",
      reference: "",
      serviceMessage: "",
    });

    trackWaitlistEvent("waitlist_submit_attempt", {
      interest: normalizedForm.interest,
      timeline: normalizedForm.timeline,
      contactPreference: normalizedForm.contactPreference,
    });

    const controller = new AbortController();
    waitlistRequestControllerRef.current?.abort();
    waitlistRequestControllerRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), WAITLIST_REQUEST_TIMEOUT_MS);

    const payload = {
      title: normalizedForm.title,
      fullName: normalizedForm.fullName,
      email: normalizedForm.email,
      phoneCountryCode: normalizedForm.phoneCountryCode,
      phoneNumber: normalizedForm.whatsapp,
      fullPhone: `${normalizedForm.phoneCountryCode} ${normalizedForm.whatsapp}`.trim(),
      country: normalizedForm.country,
      interest: normalizedForm.interest,
      timeline: normalizedForm.timeline,
      contactPreference: normalizedForm.contactPreference,
      note: normalizedForm.note,
      sourceRoute: route,
      clientTimestamp: new Date().toISOString(),
      viewport: typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : undefined,
      timezone: typeof window !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined,
    };

    try {
      const response = await fetch(waitlistEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Praeliator-Intake": "waitlist",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Submission failed.");
      }

      const nextCooldownUntil = Date.now() + WAITLIST_COOLDOWN_MS;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(WAITLIST_COOLDOWN_KEY, String(nextCooldownUntil));
      }
      setWaitlistCooldownUntil(nextCooldownUntil);

      const completionSeconds = waitlistStartedAt ? Math.max(1, Math.round((Date.now() - waitlistStartedAt) / 1000)) : undefined;

      setWaitlistState({
        loading: false,
        success: true,
        error: "",
        reference: result.reference || "",
        serviceMessage:
          result.serviceMessage ||
          "A private reply will follow after review. Qualified inquiries continue directly with reference in place.",
      });
      setWaitlistForm(initialWaitlistForm);
      setWaitlistErrors({});
      setWaitlistTouched({});
      setWaitlistHoneypot("");
      setWaitlistStarted(false);
      setWaitlistStartedAt(null);
      trackWaitlistEvent("waitlist_submit_success", {
        reference: result.reference || "pending",
        completion_seconds: completionSeconds,
      });
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "Request timed out. Please try again or continue on WhatsApp."
          : error instanceof Error
            ? error.message
            : "Submission failed. Please try again or contact Praeliator directly by WhatsApp.";

      setWaitlistState({
        loading: false,
        success: false,
        error: message,
        reference: "",
        serviceMessage: "",
      });
      trackWaitlistEvent("waitlist_submit_failure", { message });
    } finally {
      window.clearTimeout(timeoutId);
      waitlistRequestControllerRef.current = null;
    }
  };

  const renderHomePage = () => {
    const cinematicSections = [
      {
        key: "hero",
        word: "Praeliator",
        line: "Equipment for those who treat boxing as art.",
        cta: "Discover",
        action: () => goTo("/praeliator-vis"),
        video: homeCinematicMedia.hero.video,
        poster: homeCinematicMedia.hero.poster,
      },
      {
        key: "vis",
        word: "VIS",
        line: "16 oz · Lace-up · Top-grain cowhide",
        cta: "Enter VIS",
        action: () => goTo("/praeliator-vis"),
        video: homeCinematicMedia.vis.video,
        poster: homeCinematicMedia.vis.poster,
      },
      {
        key: "material",
        word: "Material",
        line: "Soft satin finish.",
        cta: "Construction",
        action: () => goTo("/praeliator-vis"),
        video: homeCinematicMedia.material.video,
        poster: homeCinematicMedia.material.poster,
      },
      {
        key: "ownership",
        word: "Ownership",
        line: "From presentation to aftercare.",
        cta: "Experience",
        action: () => goTo("/acquisition"),
        video: homeCinematicMedia.ownership.video,
        poster: homeCinematicMedia.ownership.poster,
      },
      {
        key: "acquisition",
        word: "Acquisition",
        line: "Handled directly.",
        cta: "Private Inquiry",
        href: whatsappGeneralLink,
        video: homeCinematicMedia.acquisition.video,
        poster: homeCinematicMedia.acquisition.poster,
      },
    ];

    return <FullScreenCinematicHomepage sections={cinematicSections} />;
  };

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
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start lg:gap-12">
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

            <div className="mt-6 rounded-[1.65rem] border border-white/[0.08] bg-[#0d0b0a] p-5 shadow-[0_18px_42px_rgba(0,0,0,0.16)]">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">What happens next</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Review", text: "Every qualified inquiry is reviewed before contact continues." },
                  { title: "Reference", text: "Your returned reference stays attached to the intake record." },
                  { title: "Continuation", text: "If needed, the route continues directly through WhatsApp." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-white/64">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                <a
                  href={whatsappGeneralLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWaitlistEvent("waitlist_direct_inquiry_click", { location: "sidebar" })}
                >
                  Prefer direct inquiry instead
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[2rem] border border-white/10 bg-[#11100f] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
              <form className="grid gap-4 sm:gap-4 lg:gap-5" onSubmit={handleWaitlistSubmit} noValidate>
                <div className="hidden" aria-hidden="true">
                  <label htmlFor={WAITLIST_HONEYPOT_FIELD}>Leave this field empty</label>
                  <input
                    id={WAITLIST_HONEYPOT_FIELD}
                    name={WAITLIST_HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                    value={waitlistHoneypot}
                    onChange={(event) => setWaitlistHoneypot(event.target.value)}
                    className="browser-form-element h-0 w-0 opacity-0 pointer-events-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-[0.76fr_1.24fr] sm:items-start">
                  <div>
                    <SelectField
                      name="title"
                      value={waitlistForm.title}
                      onChange={(event) => handleWaitlistSelectChange("title", event)}
                      onBlur={() => handleWaitlistBlur("title")}
                      placeholder="Title"
                      searchable
                      searchPlaceholder="Search title"
                      fieldLabel="Honorific"
                      options={titleOptions}
                      success={getFieldSuccess("title")}
                      describedBy={getFieldDescribedBy("title")}
                    />
                  </div>

                  <div>
                    <InputField
                      name="fullName"
                      value={waitlistForm.fullName}
                      onChange={handleWaitlistChange}
                      onBlur={() => handleWaitlistBlur("fullName")}
                      autoComplete="name"
                      placeholder="Full name *"
                      invalid={Boolean(getVisibleFieldError("fullName"))}
                      success={getFieldSuccess("fullName")}
                      describedBy={getFieldDescribedBy("fullName")}
                    />
                    <FieldError id="fullName-error" message={getVisibleFieldError("fullName")} />
                  </div>
                </div>

                <div>
                  <InputField
                    name="email"
                    type="email"
                    value={waitlistForm.email}
                    onChange={handleWaitlistChange}
                    onBlur={() => handleWaitlistBlur("email")}
                    autoComplete="email"
                    autoCapitalize="none"
                    placeholder="Email address *"
                    invalid={Boolean(getVisibleFieldError("email"))}
                    success={getFieldSuccess("email")}
                    describedBy={getFieldDescribedBy("email")}
                  />
                  <FieldError id="email-error" message={getVisibleFieldError("email")} />
                </div>

                <div>
                  <SearchPicker
                    name="country"
                    value={waitlistForm.country}
                    onChange={handleCountryChange}
                    onBlur={handleCountryBlur}
                    options={countryOptions.map((option) => ({ label: option.label, code: option.code }))}
                    placeholder="Country or dial code *"
                    exactMatchUpdates
                    fieldLabel="Country"
                    invalid={Boolean(getVisibleFieldError("country"))}
                    success={getFieldSuccess("country")}
                    describedBy={getFieldDescribedBy("country")}
                  />
                  <FieldError id="country-error" message={getVisibleFieldError("country")} />
                </div>

                <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr] sm:items-start">
                  <div>
                    <InputField
                      name="phoneCountryCode"
                      value={waitlistForm.phoneCountryCode}
                      onChange={handleWaitlistChange}
                      onBlur={() => handleWaitlistBlur("phoneCountryCode")}
                      autoComplete="tel-country-code"
                      inputMode="tel"
                      maxLength={5}
                      placeholder="Dial code *"
                      invalid={Boolean(getVisibleFieldError("phoneCountryCode"))}
                      success={getFieldSuccess("phoneCountryCode")}
                      describedBy={getFieldDescribedBy("phoneCountryCode")}
                    />
                    <FieldError id="phoneCountryCode-error" message={getVisibleFieldError("phoneCountryCode")} />
                  </div>

                  <div>
                    <InputField
                      name="whatsapp"
                      value={waitlistForm.whatsapp}
                      onChange={handleWaitlistChange}
                      onBlur={() => handleWaitlistBlur("whatsapp")}
                      autoComplete="tel-national"
                      inputMode="tel"
                      maxLength={15}
                      placeholder="Phone number *"
                      invalid={Boolean(getVisibleFieldError("whatsapp"))}
                      success={getFieldSuccess("whatsapp")}
                      describedBy={getFieldDescribedBy("whatsapp")}
                    />
                    <FieldError id="whatsapp-error" message={getVisibleFieldError("whatsapp")} />
                    {!getVisibleFieldError("whatsapp") ? <FieldNote>Use the number where a private follow-up should continue.</FieldNote> : null}
                  </div>
                </div>

                <div>
                  <SelectField
                    name="interest"
                    value={waitlistForm.interest}
                    onChange={(event) => handleWaitlistSelectChange("interest", event)}
                    onBlur={() => handleWaitlistBlur("interest")}
                    placeholder="Interest *"
                    options={interestOptions}
                    invalid={Boolean(getVisibleFieldError("interest"))}
                    success={getFieldSuccess("interest")}
                    describedBy={getFieldDescribedBy("interest")}
                  />
                  <FieldError id="interest-error" message={getVisibleFieldError("interest")} />
                </div>

                <div>
                  <SelectField
                    name="timeline"
                    value={waitlistForm.timeline}
                    onChange={(event) => handleWaitlistSelectChange("timeline", event)}
                    onBlur={() => handleWaitlistBlur("timeline")}
                    placeholder="Timeline *"
                    options={timelineOptions}
                    invalid={Boolean(getVisibleFieldError("timeline"))}
                    success={getFieldSuccess("timeline")}
                    describedBy={getFieldDescribedBy("timeline")}
                  />
                  <FieldError id="timeline-error" message={getVisibleFieldError("timeline")} />
                </div>

                <div>
                  <SelectField
                    name="contactPreference"
                    value={waitlistForm.contactPreference}
                    onChange={(event) => handleWaitlistSelectChange("contactPreference", event)}
                    onBlur={() => handleWaitlistBlur("contactPreference")}
                    placeholder="Preferred contact method *"
                    options={contactPreferenceOptions}
                    invalid={Boolean(getVisibleFieldError("contactPreference"))}
                    success={getFieldSuccess("contactPreference")}
                    describedBy={getFieldDescribedBy("contactPreference")}
                  />
                  <FieldError id="contactPreference-error" message={getVisibleFieldError("contactPreference")} />
                </div>

                <div>
                  <textarea
                    name="note"
                    value={waitlistForm.note}
                    onChange={handleWaitlistChange}
                    onBlur={() => handleWaitlistBlur("note")}
                    rows={6}
                    className={`${formFieldBaseClass} min-h-[10.5rem] resize-none px-5 py-4 align-top ${getFormFieldStateClasses({})}`}
                    placeholder="Optional note"
                  />
                  <FieldNote>Any detail that affects timing, use, or preferred contact can go here.</FieldNote>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={waitlistState.loading || getWaitlistCooldownSeconds() > 0}
                    className="h-[3.85rem] w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_16px_36px_rgba(239,229,215,0.2)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="inline-flex items-center gap-3">
                      {waitlistState.loading ? <span className="browser-submit-spinner" aria-hidden="true" /> : null}
                      <span>
                        {waitlistState.loading
                          ? "Submitting..."
                          : getWaitlistCooldownSeconds() > 0
                            ? `Wait ${getWaitlistCooldownSeconds()}s`
                            : "Join Waitlist"}
                      </span>
                    </span>
                  </Button>
                  <FieldNote>Private review typically continues within one business day.</FieldNote>
                </div>

                <AnimatePresence>
                  {waitlistState.success ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.22, ease: easeLuxury }}
                      className="overflow-hidden rounded-[1.6rem] border border-[#2b211b] bg-[#0d0b0a] shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
                      aria-live="polite"
                    >
                      <div className="border-b border-white/[0.08] px-5 py-4 sm:px-6">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">Inquiry received</p>
                        <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7] sm:text-lg">
                          {waitlistState.reference || "Client reference pending"}
                        </p>
                      </div>
                      <div className="space-y-4 px-5 py-5 sm:px-6">
                        <p className="text-sm leading-6 text-white/62">{waitlistState.serviceMessage}</p>
                        <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.018] p-4 text-sm leading-6 text-white/58">
                          Private review usually follows within one business day. If timing matters, continue directly on WhatsApp and include your reference.
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <Button
                            asChild
                            className="rounded-full bg-[#efe5d7] px-5 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                          >
                            <a
                              href={whatsappWaitlistFollowUpLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => trackWaitlistEvent("waitlist_success_whatsapp_click", { reference: waitlistState.reference || "pending" })}
                            >
                              Continue on WhatsApp
                            </a>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => goTo("/")}
                            className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                          >
                            Return Home
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {waitlistState.error ? (
                  <p className="text-sm leading-6 text-[#d99b8d]" aria-live="polite">{waitlistState.error}</p>
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
      <BrowserFormStyles />
      <header
        className={route === "/"
          ? "fixed inset-x-0 top-0 z-50 bg-[linear-gradient(180deg,rgba(5,5,5,0.74),rgba(5,5,5,0.2),transparent)]"
          : "sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/92 backdrop-blur-xl"}
      >
        {route === "/" ? (
          <>
            <Container className="relative flex items-center justify-between py-5 sm:py-6">
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeLuxury }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.34em] text-white/74 transition duration-500 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span>Menu</span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => goTo("/")}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease: easeLuxury }}
                className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <img
                  src="/logo-header.png"
                  alt="Praeliator"
                  className="h-9 w-auto object-contain opacity-92 sm:h-10"
                />
              </motion.button>

              <motion.a
                href={whatsappGeneralLink}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.16, ease: easeLuxury }}
                className="text-[11px] uppercase tracking-[0.34em] text-white/74 transition duration-500 hover:text-white"
              >
                Private Inquiry
              </motion.a>
            </Container>

            <AnimatePresence>
              {mobileMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.55, ease: easeLuxury }}
                  className="border-t border-white/[0.08] bg-[linear-gradient(180deg,rgba(7,7,7,0.92),rgba(7,7,7,0.8))] backdrop-blur-2xl"
                >
                  <Container className="py-6 sm:py-8 lg:py-10">
                    <div className="grid gap-1 sm:gap-2 lg:grid-cols-2 xl:grid-cols-4">
                      {navItems.map((item, index) => (
                        <motion.button
                          key={item.path}
                          type="button"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.45, delay: index * 0.04, ease: easeLuxury }}
                          onClick={() => goTo(item.path)}
                          className="group flex items-center justify-between border-b border-white/[0.08] py-4 text-left text-base tracking-[0.08em] text-white/82 transition duration-500 hover:text-white sm:text-lg"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="h-4 w-4 text-white/28 transition duration-500 group-hover:translate-x-1 group-hover:text-white/56" />
                        </motion.button>
                      ))}
                    </div>
                  </Container>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : (
          <>
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
          </>
        )}
      </header>

      <main className={route === "/" ? "overflow-x-hidden bg-[#040404]" : "overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.08),transparent_28%)]"}>
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
