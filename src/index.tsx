import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import {
  Check,
  ChevronRight,
  Instagram,
  Mail,
  MessageCircle,
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
const visPaddingLayers = [
  "Multi-foam",
  "EVA",
  "Natural latex",
  "Natural latex",
];
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
  { label: "Ownership", value: "Allocation, delivery, aftercare." },
];
const trustArchitecture = [
  { title: "Inquiry", text: "Private review and client reference." },
  { title: "Delivery", text: "Allocation, dispatch, confirmation." },
  { title: "Aftercare", text: "Maintenance and continued service." },
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
  material: {
    video: "/videos/home-material.mp4",
    poster: visImageSources.leather,
  },
  ownership: {
    video: "/videos/home-ownership.mp4",
    poster: visImageSources.packaging,
  },
  acquisition: {
    video: "/videos/home-acquisition.mp4",
    poster: homeImageSources.presentation,
  },
};
const visPageMedia = {
  heroVideo: homeCinematicMedia.vis.video,
  studyVideo: "/videos/vis-object-study.mp4",
  materialVideo: homeCinematicMedia.material.video,
  ownershipVideo: homeCinematicMedia.ownership.video,
};
const customVideoLoaderIcon = "/images/video-loader.svg";
const brandAssetPaths = {
  wordmark: "/logo-header.png",
  headerWordmark: "/wordmark-full.png",
  headerMonogramMark: "/monogram-mark.svg",
  headerLaurelMark: "/laurel-mark.svg",
  headerWordmarkPCrop: "/wordmark-p-crop.png",
  menuMiniLaurel: "/menu-mini-laurel.svg",
  monogram: {
    leftOuter: "/brand/monogram/leaf-left-outer.svg",
    leftUpper: "/brand/monogram/leaf-left-upper.svg",
    leftLower: "/brand/monogram/leaf-left-lower.svg",
    rightUpper: "/brand/monogram/leaf-right-upper.svg",
    rightLower: "/brand/monogram/leaf-right-lower.svg",
    rightOuter: "/brand/monogram/leaf-right-outer.svg",
    center: "/brand/monogram/leaf-center.svg",
  },
};
type MonogramMode = "closed" | "hover" | "open";
type HeaderBrandMode = "wordmark" | "assembly" | "monogram";
const monogramPieces = [
  {
    key: "left-outer",
    src: brandAssetPaths.monogram.leftOuter,
    size: 24,
    closed: { x: -14, y: 0, rotate: -28, scale: 0.94, opacity: 0.96 },
    hover: { x: -15, y: -1, rotate: -32, scale: 0.98, opacity: 1 },
    open: { x: -22, y: 1, rotate: -42, scale: 1.02, opacity: 1 },
  },
  {
    key: "left-upper",
    src: brandAssetPaths.monogram.leftUpper,
    size: 21,
    closed: { x: -7, y: -11, rotate: -12, scale: 0.94, opacity: 0.96 },
    hover: { x: -8, y: -12, rotate: -16, scale: 0.98, opacity: 1 },
    open: { x: -13, y: -17, rotate: -24, scale: 1.04, opacity: 1 },
  },
  {
    key: "left-lower",
    src: brandAssetPaths.monogram.leftLower,
    size: 22,
    closed: { x: -7, y: 11, rotate: -46, scale: 0.94, opacity: 0.96 },
    hover: { x: -8, y: 12, rotate: -50, scale: 0.98, opacity: 1 },
    open: { x: -14, y: 18, rotate: -64, scale: 1.04, opacity: 1 },
  },
  {
    key: "right-upper",
    src: brandAssetPaths.monogram.rightUpper,
    size: 21,
    closed: { x: 7, y: -11, rotate: 12, scale: 0.94, opacity: 0.96 },
    hover: { x: 8, y: -12, rotate: 16, scale: 0.98, opacity: 1 },
    open: { x: 13, y: -17, rotate: 24, scale: 1.04, opacity: 1 },
  },
  {
    key: "right-lower",
    src: brandAssetPaths.monogram.rightLower,
    size: 22,
    closed: { x: 7, y: 11, rotate: 46, scale: 0.94, opacity: 0.96 },
    hover: { x: 8, y: 12, rotate: 50, scale: 0.98, opacity: 1 },
    open: { x: 14, y: 18, rotate: 64, scale: 1.04, opacity: 1 },
  },
  {
    key: "right-outer",
    src: brandAssetPaths.monogram.rightOuter,
    size: 24,
    closed: { x: 14, y: 0, rotate: 28, scale: 0.94, opacity: 0.96 },
    hover: { x: 15, y: -1, rotate: 32, scale: 0.98, opacity: 1 },
    open: { x: 22, y: 1, rotate: 42, scale: 1.02, opacity: 1 },
  },
  {
    key: "center",
    src: brandAssetPaths.monogram.center,
    size: 12,
    closed: { x: 0, y: 0, rotate: 0, scale: 0.88, opacity: 0.9 },
    hover: { x: 0, y: 0, rotate: 0, scale: 0.96, opacity: 1 },
    open: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
  },
] as const;
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
  new Map(countryOptions.map((option) => [option.code, option])).values(),
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
type Route =
  | "/"
  | "/praeliator-vis"
  | "/acquisition"
  | "/waitlist"
  | "/contact";
type HeroAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};
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
const routeTitles: Record<Route, string> = {
  "/": "Home",
  "/praeliator-vis": "Praeliator VIS",
  "/acquisition": "Acquisition",
  "/waitlist": "Waitlist",
  "/contact": "Contact",
};
const routeMicroLabels: Record<Route, string> = {
  "/": "",
  "/praeliator-vis": "VIS",
  "/acquisition": "ACQUISITION",
  "/waitlist": "WAITLIST",
  "/contact": "CONTACT",
};
const navItems: Array<{ label: string; path: Route }> = [
  { label: "VIS", path: "/praeliator-vis" },
  { label: "Acquisition", path: "/acquisition" },
  { label: "Waitlist", path: "/waitlist" },
  { label: "Contact", path: "/contact" },
];
const pageHeroStats: Record<
  Exclude<Route, "/">,
  Array<{ label: string; value: string }>
> = {
  "/praeliator-vis": [
    { label: "Format", value: "16 oz lace-up" },
    { label: "Material", value: "Top-grain cowhide" },
    { label: "Use", value: "Training · Technical sparring" },
    { label: "Finish", value: "Soft satin" },
  ],
  "/acquisition": [
    { label: "Method", value: "Direct inquiry" },
    { label: "Review", value: "Qualified screening" },
    { label: "Record", value: "Client reference" },
    { label: "Continuation", value: "Delivery · aftercare" },
  ],
  "/waitlist": [
    { label: "Use", value: "Future access" },
    { label: "Return", value: "Client reference" },
    { label: "Review", value: "Private follow-up" },
    { label: "Route", value: "Waitlist · WhatsApp" },
  ],
  "/contact": [
    { label: "Primary", value: "WhatsApp" },
    { label: "Secondary", value: "Email" },
    { label: "Social", value: "Instagram" },
    { label: "Scope", value: "Private client communication" },
  ],
};
const acquisitionSteps = [
  {
    step: "01",
    title: "Inquiry",
    text: "The route begins through WhatsApp, email, or the intake form. There is no conventional checkout layer between the client and the brand.",
  },
  {
    step: "02",
    title: "Client record",
    text: "Each qualified inquiry becomes a persistent record with reference, route status, ownership context, and follow-up visibility.",
  },
  {
    step: "03",
    title: "Review and allocation",
    text: "Interest, timing, destination, and availability are clarified before dispatch. Control stays with the brand, not the cart.",
  },
  {
    step: "04",
    title: "Delivery and aftercare",
    text: "Dispatch, confirmation, maintenance, and future service continue under the same record after purchase.",
  },
];
const acquisitionPrinciples = [
  {
    title: "No cart layer",
    text: "The brand does not disappear behind a marketplace flow. The route stays direct from the beginning.",
  },
  {
    title: "Recorded continuity",
    text: "Inquiry, allocation, dispatch, and future service stay attached to the same client record.",
  },
  {
    title: "Controlled release",
    text: "Access remains qualified and paced. Availability is handled with intention rather than open inventory noise.",
  },
];
const acquisitionModeCards = [
  {
    title: "Immediate inquiry",
    text: "For clients ready to begin the acquisition route now through direct contact.",
    action: "Begin inquiry",
  },
  {
    title: "Quiet registration",
    text: "For clients who want future access, collector visibility, or a softer point of entry.",
    action: "Join waitlist",
  },
];
const acquisitionContrasts = [
  {
    title: "Conventional commerce",
    lines: [
      "Open inventory, visible quantity, and generic checkout sequencing.",
      "The brand disappears behind platform language and shipping logic.",
      "The object arrives disconnected from ownership history.",
    ],
  },
  {
    title: "Praeliator acquisition",
    lines: [
      "Inquiry remains direct and the route stays inside the brand voice.",
      "Allocation, dispatch, and continuity remain qualified rather than public.",
      "Ownership begins before delivery and continues after purchase.",
    ],
  },
];
const acquisitionStandards = [
  "No cart layer between the client and the brand.",
  "Qualified review before allocation continues.",
  "Dispatch, confirmation, and aftercare retained under one record.",
];
const contactChannels = [
  {
    step: "01",
    title: "WhatsApp",
    role: "Primary route",
    text: "The fastest path for private inquiry, immediate clarification, and continued contact once the route begins.",
  },
  {
    step: "02",
    title: "Email",
    role: "Secondary route",
    text: "A quieter path for slower communication when the inquiry does not need live back and forth.",
  },
  {
    step: "03",
    title: "Instagram",
    role: "Light contact",
    text: "Useful for presence, softer first contact, and brand visibility, but not the primary acquisition route.",
  },
];
const contactPrinciples = [
  {
    title: "No support-center tone",
    text: "The brand stays direct. Communication does not collapse into generic help-desk language.",
  },
  {
    title: "One voice",
    text: "Whether the route begins on WhatsApp, email, or Instagram, the tone remains calm, precise, and controlled.",
  },
  {
    title: "Visible hierarchy",
    text: "Not every channel carries the same weight. WhatsApp remains primary, while the others stay available with clear roles.",
  },
];
const contactStandards = [
  "WhatsApp remains the primary route for direct private inquiries.",
  "Email remains available when a slower and quieter exchange makes more sense.",
  "Instagram remains open for lighter contact, but does not replace the primary route.",
];
const contactContrasts = [
  {
    title: "Generic support",
    lines: [
      "Contact feels like a service queue rather than part of the brand.",
      "Every channel is treated as equal, so hierarchy disappears.",
      "Tone becomes functional, loud, or impersonal.",
    ],
  },
  {
    title: "Praeliator contact",
    lines: [
      "The brand stays visible through the communication route itself.",
      "Each channel has a distinct role, but the tone remains singular.",
      "Contact feels direct, private, and continuous with the object.",
    ],
  },
];
const contactEntryModes = [
  {
    title: "Immediate inquiry",
    text: "For clients ready to begin a direct conversation now through the primary route.",
    action: "Open WhatsApp",
  },
  {
    title: "Quiet registration",
    text: "For clients who want future access or a softer point of entry before direct continuation.",
    action: "Join waitlist",
  },
];
const visEditorialBlocks = [
  {
    title: "Material discipline",
    text: "The glove is built in top-grain cowhide with a restrained finish that reads deep black first and espresso second. It avoids the loud shine that makes luxury feel synthetic.",
  },
  {
    title: "Engineered structure",
    text: "The silhouette is meant to feel sculpted rather than swollen. Palm ventilation, an integrated grip bar, attached thumb, and the extended cuff all work inside the same visual system.",
  },
  {
    title: "Object quality",
    text: "Presentation was not treated like a separate afterthought. Packaging, ownership, and aftercare all continue the same tone as the glove itself.",
  },
];
const clubFooterColumns = [
  {
    title: "Explore",
    links: [
      { label: "VIS", route: "/praeliator-vis" as Route },
      { label: "Acquisition", route: "/acquisition" as Route },
      { label: "Waitlist", route: "/waitlist" as Route },
      { label: "Contact", route: "/contact" as Route },
    ],
  },
  {
    title: "Signals",
    notes: [
      "Private acquisition",
      "Controlled releases",
      "Ownership continuity",
      "Aftercare retention",
    ],
  },
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
const formFieldBaseClass =
  "browser-form-element min-h-[3.75rem] w-full rounded-[1.45rem] border px-5 text-[16px] text-[#f4efe7] outline-none transition-[border-color,background-color,box-shadow,transform] duration-300 placeholder:text-white/24 sm:text-sm";
const formPanelClass =
  "absolute left-0 right-0 top-[calc(100%+0.65rem)] z-30 overflow-hidden rounded-[1.45rem] border border-[#231d18] bg-[#0a0908]/98 shadow-[0_22px_58px_rgba(0,0,0,0.34)] backdrop-blur-xl";
const formOptionRowClass =
  "flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition duration-200";
const WAITLIST_FIELD_MAX_LENGTHS: Record<WaitlistFieldName, number> = {
  title: 32,
  fullName: 80,
  email: 254,
  phoneCountryCode: 5,
  whatsapp: 15,
  country: 80,
  interest: 64,
  timeline: 32,
  contactPreference: 32,
  note: 600,
};
const clampWaitlistFieldLength = (
  field: WaitlistFieldName,
  value: string,
) => value.slice(0, WAITLIST_FIELD_MAX_LENGTHS[field]);
const normalizeInlineText = (value: string) =>
  value.replace(/\s{2,}/g, " ").replace(/^\s+/g, "");
const normalizeFinalText = (value: string) => value.replace(/\s+/g, " ").trim();
const normalizeDialCode = (value: string) => {
  const digits = value.replace(/[^\d]/g, "").slice(0, 4);
  if (!digits && !value.includes("+")) return "";
  return `+${digits}`;
};
const normalizePhoneNumber = (value: string) =>
  value.replace(/[^\d]/g, "").slice(0, 15);
const normalizeEmailInline = (value: string) => value.replace(/\s+/g, "");
const normalizeEmailFinal = (value: string) =>
  value.replace(/\s+/g, "").trim().toLowerCase();
const normalizeWaitlistFieldValue = (
  field: WaitlistFieldName,
  value: string,
  stage: "change" | "blur" | "submit" = "change",
) => {
  let normalizedValue = value;
  if (field === "fullName") {
    normalizedValue =
      stage === "change"
        ? normalizeInlineText(value)
        : normalizeFinalText(value);
  } else if (field === "email") {
    normalizedValue =
      stage === "change"
        ? normalizeEmailInline(value)
        : normalizeEmailFinal(value);
  } else if (field === "phoneCountryCode") {
    normalizedValue = normalizeDialCode(value);
  } else if (field === "whatsapp") {
    normalizedValue = normalizePhoneNumber(value);
  } else if (field === "country") {
    normalizedValue =
      stage === "change"
        ? normalizeInlineText(value)
        : normalizeFinalText(value);
  } else if (field === "note") {
    normalizedValue =
      stage === "change" ? value.replace(/^\s+/g, "") : value.trim();
  } else {
    normalizedValue = stage === "change" ? value : value.trim();
  }
  return clampWaitlistFieldLength(field, normalizedValue);
};
const normalizeWaitlistForm = (form: typeof initialWaitlistForm) => ({
  title: normalizeWaitlistFieldValue("title", form.title, "submit"),
  fullName: normalizeWaitlistFieldValue("fullName", form.fullName, "submit"),
  email: normalizeWaitlistFieldValue("email", form.email, "submit"),
  phoneCountryCode: normalizeWaitlistFieldValue(
    "phoneCountryCode",
    form.phoneCountryCode,
    "submit",
  ),
  whatsapp: normalizeWaitlistFieldValue("whatsapp", form.whatsapp, "submit"),
  country: normalizeWaitlistFieldValue("country", form.country, "submit"),
  interest: normalizeWaitlistFieldValue("interest", form.interest, "submit"),
  timeline: normalizeWaitlistFieldValue("timeline", form.timeline, "submit"),
  contactPreference: normalizeWaitlistFieldValue(
    "contactPreference",
    form.contactPreference,
    "submit",
  ),
  note: normalizeWaitlistFieldValue("note", form.note, "submit"),
});
const getDialCodePhoneRule = (dialCode: string) => {
  const normalizedDialCode = normalizeDialCode(dialCode);
  const rules: Record<string, { min: number; max: number; message: string }> = {
    "+1": {
      min: 10,
      max: 10,
      message: "US and Canadian numbers should be 10 digits.",
    },
    "+33": { min: 9, max: 9, message: "French numbers should be 9 digits." },
    "+34": { min: 9, max: 9, message: "Spanish numbers should be 9 digits." },
    "+44": {
      min: 10,
      max: 11,
      message: "UK numbers are usually 10 to 11 digits.",
    },
    "+49": {
      min: 10,
      max: 13,
      message: "German numbers are usually 10 to 13 digits.",
    },
    "+52": {
      min: 10,
      max: 10,
      message: "Mexican numbers should be 10 digits.",
    },
    "+55": {
      min: 10,
      max: 11,
      message: "Brazilian numbers are usually 10 to 11 digits.",
    },
    "+61": {
      min: 9,
      max: 9,
      message: "Australian numbers should be 9 digits.",
    },
    "+81": {
      min: 10,
      max: 10,
      message: "Japanese mobile numbers are usually 10 digits.",
    },
    "+91": { min: 10, max: 10, message: "Indian numbers should be 10 digits." },
  };
  return (
    rules[normalizedDialCode] || {
      min: 7,
      max: 15,
      message: "Enter a valid phone number.",
    }
  );
};
const validateWaitlistForm = (
  form: typeof initialWaitlistForm,
): WaitlistErrors => {
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
  if (!normalizedForm.contactPreference)
    errors.contactPreference = "Select a preferred contact method.";
  return errors;
};
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
  if (active)
    return "border-[#6a5545] bg-[#100f0e] shadow-[0_16px_36px_rgba(0,0,0,0.2)]";
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
  return (
    <div
      className={`mx-auto w-full max-w-[96rem] px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
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
function MediaSurface({
  src,
  alt,
  className = "",
  priorityCopy,
  video,
  dim = "medium",
}: {
  src: string;
  alt: string;
  className?: string;
  priorityCopy?: React.ReactNode;
  video?: string;
  dim?: "light" | "medium" | "heavy";
}) {
  const overlayMap = {
    light: "bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.46))]",
    medium: "bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.62))]",
    heavy: "bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.78))]",
  };
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
      {video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={src}
          preload="metadata"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : null}
      <div className={`absolute inset-0 ${overlayMap[dim]}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,91,68,0.12),transparent_32%)]" />
      {priorityCopy ? (
        <div className="relative z-10 flex h-full items-end p-6 sm:p-8 lg:p-10">
          <div className="max-w-sm">{priorityCopy}</div>
        </div>
      ) : null}
    </div>
  );
}
function PageStatStrip({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <Reveal key={`${item.label}-${index}`} delay={0.12 + index * 0.04}>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              {item.label}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/78">{item.value}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
function PageHeroBanner({
  eyebrow,
  title,
  description,
  actions,
  media,
  stats,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions: HeroAction[];
  media?: {
    image: string;
    alt: string;
    video?: string;
    badge?: string;
    overlayTitle?: string;
    overlayText?: string;
  };
  stats: Array<{ label: string; value: string }>;
  note?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.12),transparent_34%)]" />
      <Container className="relative">
        <div className="rounded-[2.4rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(15,13,12,0.96),rgba(10,9,8,0.94))] p-5 shadow-[0_36px_120px_rgba(0,0,0,0.42)] sm:p-7 lg:p-8">
          <div
            className={`grid gap-8 lg:items-stretch lg:gap-8 ${
              media ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-1"
            }`}
          >
            <Reveal className="flex">
              <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:p-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                    {eyebrow}
                  </p>
                  <h1 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
                    {title}
                  </h1>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                    {description}
                  </p>
                  {note ? (
                    <p className="mt-6 max-w-xl text-[11px] uppercase tracking-[0.24em] text-white/34">
                      {note}
                    </p>
                  ) : null}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {actions.map((action) =>
                    action.href ? (
                      <Button
                        key={action.label}
                        asChild
                        variant={
                          action.variant === "secondary" ? "outline" : undefined
                        }
                        className={
                          action.variant === "secondary"
                            ? "rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                            : "rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
                        }
                      >
                        <a href={action.href} target="_blank" rel="noreferrer">
                          {action.label}
                        </a>
                      </Button>
                    ) : (
                      <Button
                        key={action.label}
                        type="button"
                        variant={
                          action.variant === "secondary" ? "outline" : undefined
                        }
                        onClick={action.onClick}
                        className={
                          action.variant === "secondary"
                            ? "rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                            : "rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
                        }
                      >
                        {action.label}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
            {media ? (
              <Reveal delay={0.08}>
                <MediaSurface
                  src={media.image}
                  alt={media.alt}
                  video={media.video}
                  className="min-h-[24rem] sm:min-h-[34rem] lg:min-h-[42rem]"
                  priorityCopy={
                    <>
                      {media.badge ? (
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px]">
                          {media.badge}
                        </p>
                      ) : null}
                      {media.overlayTitle ? (
                        <p className="mt-4 max-w-[12ch] text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7] sm:text-4xl">
                          {media.overlayTitle}
                        </p>
                      ) : null}
                      {media.overlayText ? (
                        <p className="mt-4 max-w-sm text-sm leading-7 text-white/74">
                          {media.overlayText}
                        </p>
                      ) : null}
                    </>
                  }
                />
              </Reveal>
            ) : null}
          </div>
          <div className="mt-5 sm:mt-6">
            <PageStatStrip items={stats} />
          </div>
        </div>
      </Container>
    </section>
  );
}
function EditorialBlock({
  eyebrow,
  title,
  text,
  media,
  reverse = false,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  media: {
    image: string;
    alt: string;
    video?: string;
    overlayTitle?: string;
    overlayText?: string;
  };
  reverse?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative py-8 sm:py-10 lg:py-12">
      <Container>
        <div
          className={`grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10 ${reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""}`}
        >
          <Reveal>
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,16,15,0.84),rgba(12,11,10,0.9))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                {eyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-4xl">
                {title}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                {text}
              </p>
              {children ? <div className="mt-7">{children}</div> : null}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <MediaSurface
              src={media.image}
              alt={media.alt}
              video={media.video}
              className="min-h-[20rem] sm:min-h-[30rem] lg:min-h-[36rem]"
              priorityCopy={
                media.overlayTitle || media.overlayText ? (
                  <>
                    {media.overlayTitle ? (
                      <p className="text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7] sm:text-4xl">
                        {media.overlayTitle}
                      </p>
                    ) : null}
                    {media.overlayText ? (
                      <p className="mt-4 max-w-sm text-sm leading-7 text-white/74">
                        {media.overlayText}
                      </p>
                    ) : null}
                  </>
                ) : undefined
              }
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
function ClubFooter({
  goTo,
  whatsappGeneralLink,
  instagramLink,
  emailLink,
}: {
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
}) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#060606_100%)] py-10 sm:py-12 lg:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.08),transparent_32%)]" />
      <Container className="relative">
        <div className="overflow-hidden rounded-[2.3rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,12,11,0.94),rgba(9,8,8,0.98))] shadow-[0_34px_120px_rgba(0,0,0,0.36)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-white/[0.08] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                Private client club
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-4xl">
                Praeliator Club
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                A quieter continuation of the brand: controlled access, direct
                contact, and ownership carried with continuity.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  className="rounded-full bg-[#efe5d7] px-6 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                >
                  <a
                    href={whatsappGeneralLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Private Inquiry
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo("/waitlist")}
                  className="rounded-full border-white/15 bg-transparent px-6 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                >
                  Join Waitlist
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Private acquisition",
                  "Controlled release rhythm",
                  "Ownership continuity",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.025] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-white/58"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-0 sm:grid-cols-2">
              {clubFooterColumns.map((column) => (
                <div
                  key={column.title}
                  className="border-b border-white/[0.08] p-6 last:border-b-0 sm:border-b-0 sm:first:border-r sm:p-8 lg:p-10"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    {column.title}
                  </p>
                  {"links" in column ? (
                    <div className="mt-6 space-y-4">
                      {column.links.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => goTo(item.route)}
                          className="group flex w-full items-center justify-between text-left text-sm text-white/78 transition duration-500 hover:text-white"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="h-4 w-4 text-white/28 transition duration-500 group-hover:translate-x-0.5 group-hover:text-white/58" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {column.notes.map((item) => (
                        <p key={item} className="text-sm text-white/58">
                          {item}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-white/[0.08] p-6 sm:col-span-2 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                      Direct contact
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/56">
                      WhatsApp remains primary. Email and Instagram stay
                      available for slower paths.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={instagramLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href={emailLink}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                    <a
                      href={whatsappGeneralLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function MobilePageHeroBanner({
  eyebrow,
  title,
  description,
  actions,
  media,
  stats,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions: HeroAction[];
  media?: {
    image: string;
    alt: string;
    video?: string;
    badge?: string;
    overlayTitle?: string;
    overlayText?: string;
  };
  stats?: Array<{ label: string; value: string }>;
  note?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-6 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.12),transparent_34%)]" />
      <Container className="relative">
        <div className="overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(15,13,12,0.96),rgba(10,9,8,0.94))] shadow-[0_30px_100px_rgba(0,0,0,0.36)]">
          {media ? (
            <MediaSurface
              src={media.image}
              alt={media.alt}
              video={media.video}
              className="min-h-[22rem] rounded-none border-0 shadow-none"
              dim="heavy"
              priorityCopy={
                media.overlayTitle || media.overlayText || media.badge ? (
                  <div className="max-w-[16rem]">
                    {media.badge ? (
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b]">
                        {media.badge}
                      </p>
                    ) : null}
                    {media.overlayTitle ? (
                      <p className="mt-4 text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7]">
                        {media.overlayTitle}
                      </p>
                    ) : null}
                    {media.overlayText ? (
                      <p className="mt-4 text-sm leading-7 text-white/72">
                        {media.overlayText}
                      </p>
                    ) : null}
                  </div>
                ) : undefined
              }
            />
          ) : null}
          <div className="p-5 sm:p-6">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d]">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-[12ch] text-[2.6rem] font-semibold leading-[0.9] tracking-[-0.065em] text-[#f4efe7]">
              {title}
            </h1>
            <p className="mt-5 max-w-[34rem] text-sm leading-7 text-white/60">
              {description}
            </p>
            {note ? (
              <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-white/34">
                {note}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-3">
              {actions.map((action) =>
                action.href ? (
                  <Button
                    key={action.label}
                    asChild
                    variant={action.variant === "secondary" ? "outline" : undefined}
                    className={
                      action.variant === "secondary"
                        ? "h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                        : "h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
                    }
                  >
                    <a href={action.href} target="_blank" rel="noreferrer">
                      {action.label}
                    </a>
                  </Button>
                ) : (
                  <Button
                    key={action.label}
                    type="button"
                    variant={action.variant === "secondary" ? "outline" : undefined}
                    onClick={action.onClick}
                    className={
                      action.variant === "secondary"
                        ? "h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                        : "h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
                    }
                  >
                    {action.label}
                  </Button>
                ),
              )}
            </div>
            {stats && stats.length ? (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {stats.map((item, index) => (
                  <Reveal key={`${item.label}-${index}`} delay={0.05 * index}>
                    <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/76">
                        {item.value}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function MobileSectionFrame({
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
    <section className="relative py-6">
      <Container>
        <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.9),rgba(10,10,9,0.94))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a18d]">
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7]">
            {title}
          </h2>
          {description ? (
            <p className="mt-5 text-sm leading-7 text-white/60">{description}</p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
      </Container>
    </section>
  );
}

function MobileHomeFooter({
  goTo,
  whatsappGeneralLink,
  instagramLink,
  emailLink,
}: {
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
}) {
  return (
    <section className="relative overflow-hidden pb-10 pt-6">
      <Container>
        <div className="rounded-[1.9rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,12,11,0.94),rgba(9,8,8,0.98))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
          <div className="text-center">
            <img
              src="/logo-header.png"
              alt="Praeliator"
              className="mx-auto h-12 w-auto object-contain opacity-95"
            />
            <p className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/46">
              Praeliator
            </p>
          </div>

          <div className="mt-8 grid gap-3">
            {[
              { label: "VIS", route: "/praeliator-vis" as Route },
              { label: "Acquisition", route: "/acquisition" as Route },
              { label: "Waitlist", route: "/waitlist" as Route },
              { label: "Contact", route: "/contact" as Route },
            ].map((item) => (
              <button
                key={item.route}
                type="button"
                onClick={() => goTo(item.route)}
                className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-sm text-white/80 transition duration-500 hover:border-white/16 hover:bg-white/[0.05]"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-white/30" />
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Direct contact
            </p>
            <p className="mt-3 text-sm leading-7 text-white/58">
              WhatsApp remains primary. Email and Instagram stay available for
              quieter paths.
            </p>
            <div className="mt-5 flex items-center justify-center gap-4">
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={emailLink}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={whatsappGeneralLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MobileHeader({
  route,
  pageMicroLabel,
  mobileMenuOpen,
  setMobileMenuOpen,
  brandMode,
  currentPurchaseLink,
  headerLogoBroken,
  onHeaderLogoError,
  goTo,
}: {
  route: Route;
  pageMicroLabel: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  brandMode: HeaderBrandMode;
  currentPurchaseLink: string;
  headerLogoBroken: boolean;
  onHeaderLogoError: () => void;
  goTo: (nextRoute: Route) => void;
}) {
  return (
    <motion.header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        animate={{
          backgroundColor: mobileMenuOpen ? "rgba(6,6,6,0.82)" : "rgba(6,6,6,0.38)",
          backdropFilter: mobileMenuOpen ? "blur(18px)" : "blur(14px)",
        }}
        transition={{ duration: 0.45, ease: easeLuxury }}
        className="border-b border-white/[0.06] bg-[linear-gradient(180deg,rgba(6,6,6,0.84),rgba(6,6,6,0.38),transparent)]"
      >
        <Container className="relative flex items-center justify-between py-4">
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/82 transition duration-500 hover:border-white/16 hover:bg-white/[0.05]"
          >
            <PraeliatorMenuWreathIcon
              open={mobileMenuOpen}
              className="h-[2.25rem] w-[2.25rem]"
            />
          </button>

          <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <HeaderBrandMark
              mode={brandMode}
              onClick={() => goTo("/")}
              assetsBroken={headerLogoBroken}
              onAssetError={onHeaderLogoError}
            />
          </div>

          <a
            href={currentPurchaseLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-full border border-white/10 bg-white/[0.03] px-3.5 text-[10px] uppercase tracking-[0.24em] text-white/78 transition duration-500 hover:border-white/16 hover:bg-white/[0.05] hover:text-white"
          >
            Inquiry
          </a>
        </Container>

        <AnimatePresence initial={false}>
          {route !== "/" && !mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: easeLuxury }}
              className="pb-3"
            >
              <Container className="flex justify-center">
                <p className="text-[9px] uppercase tracking-[0.34em] text-white/34">
                  {pageMicroLabel}
                </p>
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: easeLuxury }}
              className="overflow-hidden border-t border-white/[0.06]"
            >
              <Container className="pb-5 pt-4">
                <div className="grid gap-3">
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => goTo(item.path)}
                      className="group flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition duration-500 hover:border-white/16 hover:bg-white/[0.05]"
                    >
                      <div>
                        <p className="text-base uppercase tracking-[0.14em] text-white/88">
                          {item.label}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34">
                          {item.label === "VIS"
                            ? "Flagship"
                            : item.label === "Acquisition"
                              ? "Private route"
                              : item.label === "Waitlist"
                                ? "Future access"
                                : "Direct contact"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/28 transition duration-500 group-hover:translate-x-0.5 group-hover:text-white/58" />
                    </button>
                  ))}
                </div>
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}

function MobileClubFooter({
  goTo,
  whatsappGeneralLink,
  instagramLink,
  emailLink,
}: {
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
}) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[linear-gradient(180deg,#0b0b0b_0%,#060606_100%)] py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.08),transparent_34%)]" />
      <Container className="relative">
        <div className="rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,12,11,0.94),rgba(9,8,8,0.98))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.3)]">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d]">
            Private client club
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7]">
            Praeliator Club
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/60">
            Controlled access, direct contact, and ownership carried with
            continuity.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              asChild
              className="h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
            >
              <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                Private Inquiry
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/waitlist")}
              className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
            >
              Join Waitlist
            </Button>
          </div>

          <div className="mt-8 grid gap-3">
            {clubFooterColumns[0].links.map((item) => (
              <button
                key={item.route}
                type="button"
                onClick={() => goTo(item.route)}
                className="flex items-center justify-between rounded-[1.2rem] border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-sm text-white/80 transition duration-500 hover:border-white/16 hover:bg-white/[0.05]"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-white/30" />
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Signals
            </p>
            <div className="mt-4 grid gap-2">
              {clubFooterColumns[1].notes.map((item) => (
                <p key={item} className="text-sm text-white/58">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              Direct contact
            </p>
            <p className="mt-3 text-sm leading-7 text-white/58">
              WhatsApp remains primary. Email and Instagram stay available where
              appropriate.
            </p>
            <div className="mt-5 flex items-center gap-4">
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={emailLink}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href={whatsappGeneralLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/72 transition duration-500 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
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
  pattern,
}: {
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
  pattern?: string;
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
      pattern={pattern}
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
  maxLength,
}: {
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
  maxLength?: number;
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
      return (
        label.includes(normalizedQuery) || optionValue.includes(normalizedQuery)
      );
    });
  }, [options, query, searchable]);
  const activeOptionId =
    open && filteredOptions[highlightedIndex]
      ? `${name}-option-${highlightedIndex}`
      : undefined;
  const selectedIndex = Math.max(
    0,
    filteredOptions.findIndex((option) => option.value === value),
  );
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
    onChange({
      target: { name, value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>);
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
            <span
              id={labelId}
              className={`mb-1 block text-[10px] uppercase tracking-[0.22em] ${selectedOption || open ? "text-[#b9a18d]" : "text-white/30"}`}
            >
              {fieldLabel}
            </span>
          ) : null}
          <span
            className={`block truncate text-[16px] sm:text-sm ${selectedOption ? "text-[#f4efe7]" : "text-white/24"}`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 transition duration-300 ${open ? "rotate-[270deg] text-[#b9a18d]" : "rotate-90 text-white/34"}`}
        />
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
                <div className="px-4 py-4 text-sm text-white/42">
                  No matches found.
                </div>
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
                    <span
                      className={`truncate text-[15px] sm:text-sm ${isSelected ? "text-[#f4efe7]" : "text-white/72"}`}
                    >
                      {option.label}
                    </span>
                    {isSelected ? (
                      <Check className="h-4 w-4 shrink-0 text-[#b9a18d]" />
                    ) : null}
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
  onChange: (
    value: string,
    matchedOption?: { label: string; code: string },
  ) => void;
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
  const activeOptionId =
    open && filtered[highlightedIndex]
      ? `${name}-picker-option-${highlightedIndex}`
      : undefined;
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
    filtered.findIndex(
      (option) =>
        option.label.toLowerCase() === value.trim().toLowerCase() ||
        option.code.toLowerCase() === value.trim().toLowerCase(),
    ),
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
        <p
          id={labelId}
          className={`mb-2 text-[10px] uppercase tracking-[0.22em] ${value ? "text-[#b9a18d]" : "text-white/30"}`}
        >
          {fieldLabel}
        </p>
      ) : null}
      <ChevronRight
        className={`pointer-events-none absolute right-5 z-10 h-4 w-4 -translate-y-1/2 transition duration-300 ${open ? "top-[2.6rem] rotate-[270deg] text-[#b9a18d]" : "top-[2.6rem] rotate-90 text-white/34"}`}
      />
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
          const cleaned =
            inputMode === "tel"
              ? next.replace(/[^\d+]/g, "")
              : normalizeInlineText(next);
          const matchedOption = options.find(
            (option) =>
              option.label.toLowerCase() === cleaned.trim().toLowerCase() ||
              option.code.toLowerCase() === cleaned.trim().toLowerCase(),
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
        maxLength={maxLength}
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
                const isSelected =
                  option.label.toLowerCase() === value.trim().toLowerCase() ||
                  option.code.toLowerCase() === value.trim().toLowerCase();
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
                      <span className="block truncate text-[15px] text-[#f4efe7] sm:text-sm">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] text-[#b9a18d]">
                        {option.code}
                      </span>
                    </div>
                    {isSelected ? (
                      <Check className="h-4 w-4 shrink-0 text-[#b9a18d]" />
                    ) : null}
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
function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-[13px] leading-5 text-[#c98f82]">
      {message}
    </p>
  );
}
function FieldNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-[13px] leading-5 text-white/36">{children}</p>;
}
function CinematicScene({
  section,
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
  active: boolean;
}) {
  const inView = active;
  const [videoReady, setVideoReady] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const loaderTimerRef = useRef<number | null>(null);
  useEffect(() => {
    setVideoReady(false);
    setShowLoader(false);
    if (loaderTimerRef.current) {
      window.clearTimeout(loaderTimerRef.current);
    }
    loaderTimerRef.current = window.setTimeout(() => {
      setShowLoader(true);
    }, 220);
    return () => {
      if (loaderTimerRef.current) {
        window.clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
    };
  }, [section.video]);
  const markVideoReady = () => {
    setVideoReady(true);
    setShowLoader(false);
    if (loaderTimerRef.current) {
      window.clearTimeout(loaderTimerRef.current);
      loaderTimerRef.current = null;
    }
  };
  return (
    <section className="relative isolate h-dvh min-h-dvh supports-[height:100svh]:h-[100svh] supports-[height:100svh]:min-h-dvh supports-[height:100svh]:min-h-[100svh] overflow-hidden snap-start">
      <div className="absolute inset-0 overflow-hidden bg-[#050505]">
        <motion.div
          animate={{ scale: inView ? 1 : 1.02, opacity: 1 }}
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
            onCanPlay={markVideoReady}
            onLoadedData={markVideoReady}
            onPlaying={markVideoReady}
          >
            <source src={section.video} type="video/mp4" />
          </video>
        </motion.div>
        <AnimatePresence>
          {!videoReady && showLoader ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: easeLuxury }}
              className="absolute inset-0 z-[1] flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(8,8,8,0.16),rgba(4,4,4,0.48)_56%,rgba(4,4,4,0.78))]"
            >
              <div className="flex flex-col items-center gap-4">
                <img
                  src={customVideoLoaderIcon}
                  alt="Loading"
                  className="video-loader-logo h-14 w-14 object-contain sm:h-16 sm:w-16"
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
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
          transition={{
            duration: 0.85,
            delay: inView ? 0.28 : 0,
            ease: easeLuxury,
          }}
          className="mx-auto flex max-w-[92vw] flex-col items-center text-center"
        >
          <motion.p
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 22 }}
            transition={{
              duration: 0.8,
              delay: inView ? 0.34 : 0,
              ease: easeLuxury,
            }}
            className="max-w-[92vw] text-[clamp(2.4rem,7.4vw,6.6rem)] font-extralight uppercase leading-[0.92] tracking-[0.12em] text-white/96 sm:tracking-[0.14em]"
          >
            {section.word}
          </motion.p>
          {section.line ? (
            <motion.p
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
              transition={{
                duration: 0.78,
                delay: inView ? 0.48 : 0,
                ease: easeLuxury,
              }}
              className="mt-4 max-w-[28rem] text-[clamp(0.8rem,1.1vw,0.98rem)] leading-6 tracking-[0.1em] text-white/72 sm:leading-7"
            >
              {section.line}
            </motion.p>
          ) : null}
          <motion.div
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 14 }}
            transition={{
              duration: 0.76,
              delay: inView ? 0.62 : 0,
              ease: easeLuxury,
            }}
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
function ExploreFurtherScene({
  active,
  goTo,
}: {
  active: boolean;
  goTo: (nextRoute: Route) => void;
}) {
  const cards = [
    {
      key: "vis",
      title: "Discover VIS",
      text: "The flagship training glove.",
      image: visImageSources.hero,
      route: "/praeliator-vis" as Route,
    },
    {
      key: "acquisition",
      title: "Private Acquisition",
      text: "Handled directly, with control.",
      image: visImageSources.packaging,
      route: "/acquisition" as Route,
    },
    {
      key: "waitlist",
      title: "Join Waitlist",
      text: "Future access, recorded properly.",
      image: homeImageSources.presentation,
      route: "/waitlist" as Route,
    },
  ];
  return (
    <section className="relative isolate flex min-h-dvh supports-[height:100svh]:min-h-[100svh] items-center bg-[#111111] px-8 py-24 sm:px-12 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_38%)]" />
      <motion.div
        animate={{ opacity: active ? 1 : 0.4, y: active ? 0 : 20 }}
        transition={{ duration: 0.8, ease: easeLuxury }}
        className="relative z-10 mx-auto w-full max-w-[120rem]"
      >
        <div className="text-center">
          <p className="text-[clamp(1.25rem,2.8vw,2.4rem)] font-light uppercase tracking-[0.18em] text-white/92">
            Explore Further
          </p>
          <p className="mt-3 text-[clamp(0.8rem,1vw,1rem)] uppercase tracking-[0.14em] text-white/62">
            Continue your journey
          </p>
        </div>
        <div className="mt-16 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {cards.map((card, index) => (
            <motion.button
              key={card.key}
              type="button"
              onClick={() => goTo(card.route)}
              animate={{ opacity: active ? 1 : 0.52, y: active ? 0 : 18 }}
              transition={{
                duration: 0.8,
                delay: 0.12 + index * 0.08,
                ease: easeLuxury,
              }}
              className="group overflow-hidden border-l border-white/18 bg-transparent text-left"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-[#191919]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.22))]" />
              </div>
              <div className="px-7 py-7">
                <p className="text-[clamp(1rem,1.35vw,1.55rem)] uppercase tracking-[0.12em] text-white/92">
                  {card.title}
                </p>
                <p className="mt-4 max-w-[24rem] text-[clamp(0.88rem,0.95vw,1rem)] leading-7 text-white/68">
                  {card.text}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
function HomeFooterScene({
  goTo,
  whatsappGeneralLink,
  instagramLink,
  emailLink,
}: {
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
}) {
  return (
    <section className="relative isolate flex min-h-dvh supports-[height:100svh]:min-h-[100svh] items-center bg-[linear-gradient(180deg,#111111_0%,#0a0a0a_100%)] px-8 py-20 sm:px-12 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_34%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[120rem]">
        <div className="border-t border-white/18 pt-14">
          <div className="text-center">
            <img
              src="/logo-header.png"
              alt="Praeliator"
              className="mx-auto h-14 w-auto object-contain opacity-95"
            />
            <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-white/54">
              Praeliator
            </p>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => goTo("/praeliator-vis")}
                className="block text-left text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92 transition hover:text-white"
              >
                VIS
              </button>
              <button
                type="button"
                onClick={() => goTo("/acquisition")}
                className="block text-left text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92 transition hover:text-white"
              >
                Acquisition
              </button>
              <button
                type="button"
                onClick={() => goTo("/waitlist")}
                className="block text-left text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92 transition hover:text-white"
              >
                Waitlist
              </button>
            </div>
            <div className="space-y-5">
              <button
                type="button"
                onClick={() => goTo("/contact")}
                className="block text-left text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92 transition hover:text-white"
              >
                Contact
              </button>
              <a
                href={whatsappGeneralLink}
                target="_blank"
                rel="noreferrer"
                className="block text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92 transition hover:text-white"
              >
                Private Inquiry
              </a>
            </div>
            <div className="space-y-5">
              <p className="text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92">
                Presentation
              </p>
              <p className="text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92">
                Ownership
              </p>
            </div>
            <div className="space-y-5">
              <p className="text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92">
                Hand-assembled
              </p>
              <p className="text-[clamp(1rem,1.15vw,1.25rem)] uppercase tracking-[0.12em] text-white/92">
                Top-grain leather
              </p>
            </div>
            <div className="flex items-start justify-start gap-5 md:justify-end">
              <a
                href={instagramLink}
                target="_blank"
                rel="noreferrer"
                className="text-white/72 transition hover:text-white"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={emailLink}
                className="text-white/72 transition hover:text-white"
              >
                <Mail className="h-6 w-6" />
              </a>
              <a
                href={whatsappGeneralLink}
                target="_blank"
                rel="noreferrer"
                className="text-white/72 transition hover:text-white"
              >
                <MessageCircle className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function HomeTailScene({
  active,
  goTo,
  whatsappGeneralLink,
  instagramLink,
  emailLink,
  scrollContainerRef,
}: {
  active: boolean;
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="relative isolate h-dvh min-h-dvh supports-[height:100svh]:h-[100svh] supports-[height:100svh]:min-h-dvh supports-[height:100svh]:min-h-[100svh] bg-[linear-gradient(180deg,#121212_0%,#0a0a0a_100%)]">
      <div
        ref={scrollContainerRef}
        className="browser-scrollbar h-full overflow-y-auto overscroll-contain"
      >
        <ExploreFurtherScene active={active} goTo={goTo} />
        <HomeFooterScene
          goTo={goTo}
          whatsappGeneralLink={whatsappGeneralLink}
          instagramLink={instagramLink}
          emailLink={emailLink}
        />
      </div>
    </section>
  );
}

function PraeliatorMonogramIcon({
  open = false,
  className = "",
  iconToneClassName = "bg-[#d4b08b]",
  glow = true,
}: {
  open?: boolean;
  className?: string;
  iconToneClassName?: string;
  glow?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const mode: MonogramMode = open ? "open" : hovered ? "hover" : "closed";

  return (
    <motion.div
      className={`relative isolate ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
      animate={{
        scale: open ? 1.04 : hovered ? 1.02 : 1,
        rotate: open ? 0 : hovered ? -1.2 : 0,
        y: open ? 0 : hovered ? -0.5 : 0,
      }}
      transition={{ duration: 0.7, ease: easeLuxury }}
    >
      {glow ? (
        <motion.div
          className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#caa57f]/20 blur-xl"
          animate={{
            opacity: open ? 0.98 : hovered ? 0.78 : 0.44,
            scale: open ? 1.24 : hovered ? 1.08 : 0.9,
          }}
          transition={{ duration: 0.7, ease: easeLuxury }}
        />
      ) : null}

      <motion.div
        className="absolute left-1/2 top-1/2 h-[125%] w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
        animate={{
          opacity: open ? 0.9 : hovered ? 0.42 : 0.18,
          scale: open ? 1 : hovered ? 0.98 : 0.94,
        }}
        transition={{ duration: 0.7, ease: easeLuxury }}
      />

      <div className="relative h-full w-full">
        {monogramPieces.map((piece, index) => {
          const pose = piece[mode];

          return (
            <motion.span
              key={piece.key}
              className={`absolute left-1/2 top-1/2 block ${iconToneClassName}`}
              style={{
                width: piece.size,
                height: piece.size,
                WebkitMaskImage: `url(${piece.src})`,
                maskImage: `url(${piece.src})`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                transformOrigin: "center center",
                willChange: "transform, opacity",
                filter: "drop-shadow(0 0 12px rgba(212,176,139,0.08))",
              }}
              animate={{
                x: pose.x,
                y: pose.y,
                rotate: pose.rotate,
                scale: pose.scale,
                opacity: pose.opacity,
              }}
              transition={{
                duration: open ? 0.9 : 0.72,
                delay: index * 0.02,
                ease: easeLuxury,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function PraeliatorMenuWreathIcon({
  open = false,
  className = "",
}: {
  open?: boolean;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative isolate ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-hidden="true"
      animate={{
        scale: open ? 1.08 : hovered ? 1.04 : 1,
        y: open ? 0.2 : hovered ? -0.15 : 0,
        rotate: open ? 0 : hovered ? -0.35 : 0,
      }}
      transition={{ duration: 0.78, ease: easeLuxury }}
    >
      <motion.img
        src={brandAssetPaths.menuMiniLaurel}
        alt=""
        className="relative block h-full w-full select-none object-contain"
        draggable={false}
        animate={{
          opacity: open ? 1 : hovered ? 0.985 : 0.96,
          scale: open ? 1.06 : hovered ? 1.03 : 1,
          filter: open
            ? "drop-shadow(0 0 10px rgba(219,192,160,0.08))"
            : hovered
              ? "drop-shadow(0 0 8px rgba(219,192,160,0.05))"
              : "drop-shadow(0 0 6px rgba(219,192,160,0.02))",
        }}
        transition={{ duration: 0.78, ease: easeLuxury }}
      />
    </motion.div>
  );
}

function HeaderBrandMark({
  mode,
  onClick,
  assetsBroken,
  onAssetError,
}: {
  mode: HeaderBrandMode;
  onClick: () => void;
  assetsBroken: boolean;
  onAssetError: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isWordmarkMode = mode === "wordmark";
  const isAssemblyMode = mode === "assembly";
  const isMonogramMode = mode === "monogram";

  const wordmarkWrapperWidth = prefersReducedMotion
    ? isWordmarkMode
      ? "13.08rem"
      : "0rem"
    : isWordmarkMode
      ? "13.08rem"
      : "0rem";

  const wordmarkImageX = prefersReducedMotion
    ? "0rem"
    : isWordmarkMode
      ? "0rem"
      : "-0.52rem";

  if (assetsBroken) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.08, ease: easeLuxury }}
        className="absolute left-1/2 top-1/2 flex h-14 min-w-[3.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        aria-label="Praeliator home"
      >
        {isMonogramMode || isAssemblyMode ? (
          <img
            src={brandAssetPaths.headerMonogramMark}
            alt="Praeliator"
            className="h-10 w-10 object-contain"
            onError={onAssetError}
          />
        ) : (
          <img
            src={brandAssetPaths.wordmark}
            alt="Praeliator"
            className="h-9 w-auto object-contain opacity-92 sm:h-10"
            onError={onAssetError}
          />
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.08, ease: easeLuxury }}
      className="absolute left-1/2 top-1/2 flex h-14 min-w-[3.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      aria-label="Praeliator home"
    >
      <div className="relative flex h-12 min-w-[3.1rem] items-center justify-center">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          animate={{
            width: wordmarkWrapperWidth,
            opacity: isMonogramMode || isAssemblyMode ? 0 : 1,
            filter: isMonogramMode ? "blur(10px)" : isAssemblyMode ? "blur(0.4px)" : "blur(0px)",
          }}
          transition={{
            duration: prefersReducedMotion ? 0.42 : 1.56,
            ease: easeLuxury,
          }}
        >
          <motion.img
            src={brandAssetPaths.headerWordmark}
            alt=""
            draggable={false}
            onError={onAssetError}
            className="absolute left-0 top-1/2 block h-10 w-auto max-w-none -translate-y-1/2 select-none"
            style={{ width: "13.08rem" }}
            animate={{
              x: wordmarkImageX,
              opacity: isMonogramMode || isAssemblyMode ? 0 : 1,
              scale: isWordmarkMode ? 1 : 0.994,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.42 : 1.56,
              ease: easeLuxury,
            }}
          />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2"
          animate={{
            opacity: isWordmarkMode ? 0 : 1,
            scale: isAssemblyMode ? 1.018 : 1,
            filter: isWordmarkMode ? "blur(10px)" : "blur(0px)",
          }}
          transition={{
            duration: prefersReducedMotion ? 0.42 : 1.28,
            ease: easeLuxury,
          }}
        >
          <motion.img
            src={brandAssetPaths.headerMonogramMark}
            alt=""
            draggable={false}
            onError={onAssetError}
            className="absolute inset-0 block h-full w-full select-none object-contain"
            animate={{
              opacity: isWordmarkMode ? 0 : 1,
              scale: isAssemblyMode ? 1.008 : 1,
              y: isAssemblyMode ? -0.38 : 0,
              filter: isAssemblyMode
                ? "drop-shadow(0 0 10px rgba(244,193,46,0.08))"
                : "drop-shadow(0 0 8px rgba(244,193,46,0.06))",
            }}
            transition={{
              duration: prefersReducedMotion ? 0.38 : 1.12,
              delay: prefersReducedMotion ? 0 : isAssemblyMode ? 0.24 : 0,
              ease: easeLuxury,
            }}
          />

          <motion.img
            src={brandAssetPaths.headerLaurelMark}
            alt=""
            draggable={false}
            onError={onAssetError}
            className="absolute inset-0 block h-full w-full select-none object-contain"
            animate={{
              opacity: isWordmarkMode ? 0 : 1,
              y: isAssemblyMode ? -0.22 : 0,
              scale: isAssemblyMode ? 1.01 : 1,
              filter: isAssemblyMode
                ? "drop-shadow(0 0 10px rgba(244,193,46,0.08))"
                : "drop-shadow(0 0 8px rgba(244,193,46,0.06))",
            }}
            transition={{
              duration: prefersReducedMotion ? 0.4 : 1.32,
              delay: prefersReducedMotion ? 0 : isAssemblyMode ? 0.3 : 0,
              ease: easeLuxury,
            }}
          />
        </motion.div>
      </div>
    </motion.button>
  );
}

function FullScreenCinematicHomepage({
  sections,
  goTo,
  whatsappGeneralLink,
  instagramLink,
  emailLink,
  onActiveIndexChange,
}: {
  sections: Array<
    | {
        key: string;
        kind: "video";
        word: string;
        line?: string;
        cta: string;
        href?: string;
        action?: () => void;
        video: string;
        poster: string;
      }
    | { key: string; kind: "tail" }
  >;
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
  onActiveIndexChange?: (index: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [useStackedFlow, setUseStackedFlow] = useState(false);
  const unlockTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const tailScrollRef = useRef<HTMLDivElement | null>(null);
  const stackedSectionRefs = useRef<Array<HTMLElement | null>>([]);
  const tailIndex = sections.findIndex((section) => section.kind === "tail");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      const coarse =
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setUseStackedFlow(coarse || window.innerWidth < 1024);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  useEffect(() => {
    onActiveIndexChange?.(activeIndex);
  }, [activeIndex, onActiveIndexChange]);
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
    if (useStackedFlow) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [useStackedFlow]);
  useEffect(() => {
    if (tailIndex < 0) return;
    if (activeIndex !== tailIndex && tailScrollRef.current) {
      tailScrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [activeIndex, tailIndex]);
  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      const tailNode = tailScrollRef.current;
      const inTail = tailIndex >= 0 && activeIndex === tailIndex;
      if (inTail && tailNode) {
        const atTop = tailNode.scrollTop <= 2;
        const atBottom =
          tailNode.scrollTop + tailNode.clientHeight >=
          tailNode.scrollHeight - 2;
        if (event.deltaY > 0 && !atBottom) {
          return;
        }
        if (event.deltaY < 0 && !atTop) {
          return;
        }
        if (event.deltaY > 0 && atBottom) {
          return;
        }
      }
      event.preventDefault();
      if (isAnimating || Math.abs(event.deltaY) < 24) return;
      goToIndex(activeIndex + (event.deltaY > 0 ? 1 : -1));
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
        return;
      const tailNode = tailScrollRef.current;
      const inTail = tailIndex >= 0 && activeIndex === tailIndex;
      if (inTail && tailNode) {
        const atTop = tailNode.scrollTop <= 2;
        const atBottom =
          tailNode.scrollTop + tailNode.clientHeight >=
          tailNode.scrollHeight - 2;
        if (["ArrowDown", "PageDown", " "].includes(event.key) && !atBottom) {
          return;
        }
        if (["ArrowUp", "PageUp"].includes(event.key) && !atTop) {
          return;
        }
        if (event.key === "End") {
          return;
        }
      }
      if (isAnimating) {
        if (
          [
            "ArrowDown",
            "ArrowUp",
            "PageDown",
            "PageUp",
            "Home",
            "End",
            " ",
          ].includes(event.key)
        ) {
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
  }, [activeIndex, isAnimating, sections.length, tailIndex]);
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
    const tailNode = tailScrollRef.current;
    const inTail = tailIndex >= 0 && activeIndex === tailIndex;
    if (inTail && tailNode) {
      const atTop = tailNode.scrollTop <= 2;
      if (!(deltaY < 0 && atTop)) {
        return;
      }
    }
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
        transition={{ duration: 1.1, ease: easeLuxury }}
        className="will-change-transform"
      >
        {sections.map((section, index) => {
          if (section.kind === "video") {
            return (
              <CinematicScene
                key={section.key}
                section={section}
                active={index === activeIndex}
              />
            );
          }
          return (
            <HomeTailScene
              key={section.key}
              active={index === activeIndex}
              goTo={goTo}
              whatsappGeneralLink={whatsappGeneralLink}
              instagramLink={instagramLink}
              emailLink={emailLink}
              scrollContainerRef={tailScrollRef}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
function BrowserFormStyles() {
  return (
    <style>{`html, body, #root { background: #040404; min-height: 100%; } body { overscroll-behavior-y: none; } .browser-form-element { -webkit-appearance: none; -moz-appearance: none; appearance: none; color-scheme: dark; -webkit-tap-highlight-color: transparent; touch-action: manipulation; font-size: 16px; } @media (min-width: 640px) { .browser-form-element { font-size: 0.875rem; } } .browser-form-element:focus-visible, button[role='combobox']:focus-visible { box-shadow: 0 0 0 1px rgba(185, 161, 141, 0.32), 0 0 0 3px rgba(185, 161, 141, 0.06); } .browser-form-element:-webkit-autofill, .browser-form-element:-webkit-autofill:hover, .browser-form-element:-webkit-autofill:focus, .browser-form-element:-webkit-autofill:active { -webkit-text-fill-color: #f4efe7; caret-color: #f4efe7; box-shadow: 0 0 0 1000px #0c0b0a inset; -webkit-box-shadow: 0 0 0 1000px #0c0b0a inset; border-color: rgba(255, 255, 255, 0.08); transition: background-color 999999s ease-out 0s; } .browser-form-element::selection { background: rgba(239, 229, 215, 0.16); color: #f4efe7; } .browser-form-element::-webkit-calendar-picker-indicator { filter: invert(0.92) opacity(0.68); } .browser-form-element::-ms-reveal, .browser-form-element::-ms-clear, .browser-form-element::-webkit-contacts-auto-fill-button, .browser-form-element::-webkit-credentials-auto-fill-button { filter: invert(0.92) opacity(0.68); } .browser-form-element[type='number']::-webkit-outer-spin-button, .browser-form-element[type='number']::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; } .browser-form-element[type='number'] { -moz-appearance: textfield; } .browser-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(244, 239, 231, 0.14) #0a0908; } .browser-scrollbar::-webkit-scrollbar { width: 10px; } .browser-scrollbar::-webkit-scrollbar-track { background: #0a0908; } .browser-scrollbar::-webkit-scrollbar-thumb { background: rgba(244, 239, 231, 0.14); border-radius: 9999px; border: 2px solid #0a0908; } .browser-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(244, 239, 231, 0.22); } .browser-submit-spinner { width: 1rem; height: 1rem; border-radius: 9999px; border: 2px solid rgba(21, 18, 16, 0.22); border-top-color: #151210; animation: browser-spin 0.8s linear infinite; } .video-loader-logo { animation: praeliatorLoaderPulse 2.8s ease-in-out infinite; } @keyframes browser-spin { to { transform: rotate(360deg); } } @keyframes praeliatorLoaderPulse { 0% { opacity: 0.68; transform: scale(0.965); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.68; transform: scale(0.965); } }`}</style>
  );
}
export default function PraeliatorWebsite() {
  const whatsappBase = "https://wa.me/525540658550";
  const createWhatsAppLink = (message: string) =>
    `${whatsappBase}?text=${encodeURIComponent(message)}`;
  const whatsappGeneralLink = createWhatsAppLink(
    "Hello Praeliator, I would like to inquire about a private purchase.",
  );
  const whatsappVisLink = createWhatsAppLink(
    "Hello Praeliator, I would like to inquire about Praeliator VIS.",
  );
  const whatsappWaitlistFollowUpLink = createWhatsAppLink(
    "Hello Praeliator, I joined the waitlist and would like to follow up.",
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
  const [headerLogoBroken, setHeaderLogoBroken] = useState(false);
  const [homeSectionIndex, setHomeSectionIndex] = useState(0);
  const [secondaryPageHeaderLifted, setSecondaryPageHeaderLifted] =
    useState(false);
  const [waitlistForm, setWaitlistForm] = useState(initialWaitlistForm);
  const [waitlistErrors, setWaitlistErrors] = useState<WaitlistErrors>({});
  const [waitlistTouched, setWaitlistTouched] = useState<
    Partial<Record<WaitlistFieldName, boolean>>
  >({});
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
  const [waitlistStartedAt, setWaitlistStartedAt] = useState<number | null>(
    null,
  );
  const waitlistRequestControllerRef = useRef<AbortController | null>(null);

  const reduceMotion = useReducedMotion();
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
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
      window.dispatchEvent(
        new CustomEvent("praeliator:analytics", { detail: payload }),
      );
    },
    [route],
  );
  useEffect(() => {
    const storedCooldown =
      typeof window !== "undefined"
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
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const syncViewport = () => setIsDesktopViewport(mediaQuery.matches);
    syncViewport();
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);
      return () => mediaQuery.removeEventListener("change", syncViewport);
    }
    mediaQuery.addListener(syncViewport);
    return () => mediaQuery.removeListener(syncViewport);
  }, []);

  useEffect(() => {
    if (isDesktopViewport || !mobileMenuOpen) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isDesktopViewport, mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [route]);
  useEffect(() => {
    if (route !== "/") {
      setHomeSectionIndex(0);
    }
    setSecondaryPageHeaderLifted(false);
  }, [route]);
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
    if (reduceMotion || route === "/" || !isDesktopViewport) return;
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
  }, [isDesktopViewport, reduceMotion, route]);
  useEffect(() => {
    if (typeof window === "undefined" || route === "/" || !isDesktopViewport) {
      setSecondaryPageHeaderLifted(false);
      return;
    }
    if (mobileMenuOpen) {
      setSecondaryPageHeaderLifted(false);
      return;
    }
    let ticking = false;
    let lastY = window.scrollY;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        if (currentY <= 32) {
          setSecondaryPageHeaderLifted(false);
        } else if (delta > 6 && currentY > 96) {
          setSecondaryPageHeaderLifted(true);
        } else if (delta < -6) {
          setSecondaryPageHeaderLifted(false);
        }
        lastY = currentY;
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktopViewport, mobileMenuOpen, route]);
  const currentPurchaseLink = useMemo(() => {
    if (route === "/praeliator-vis") return whatsappVisLink;
    if (route === "/waitlist") return whatsappWaitlistFollowUpLink;
    return whatsappGeneralLink;
  }, [route]);
  const pageMicroLabel = route !== "/" ? routeMicroLabels[route] : "";
  const headerBrandMode: HeaderBrandMode =
    route !== "/"
      ? "monogram"
      : homeSectionIndex === 0
        ? "wordmark"
        : homeSectionIndex === 1
          ? "assembly"
          : "monogram";
  const mobileHeaderBrandMode: HeaderBrandMode =
    route === "/" ? "wordmark" : "monogram";
  const activeHeaderBrandMode: HeaderBrandMode = isDesktopViewport
    ? headerBrandMode
    : mobileHeaderBrandMode;
  const headerLifted =
    !mobileMenuOpen &&
    ((route === "/" && homeSectionIndex >= 3) ||
      (route !== "/" && secondaryPageHeaderLifted));
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
    waitlistCooldownUntil > Date.now()
      ? Math.ceil((waitlistCooldownUntil - Date.now()) / 1000)
      : 0;
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
    updater: (
      current: typeof initialWaitlistForm,
    ) => typeof initialWaitlistForm,
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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const field = event.target.name as WaitlistFieldName;
    const value = normalizeWaitlistFieldValue(
      field,
      event.target.value,
      "change",
    );
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
        trackWaitlistEvent("waitlist_field_invalid", {
          field,
          message: nextErrors[field],
        });
      }
      return normalized;
    });
  };
  const handleWaitlistSelectChange = (
    field: WaitlistFieldName,
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    markWaitlistFieldTouched(field);
    markWaitlistStarted(`select:${field}`);
    handleWaitlistChange(event);
  };
  const handleCountryChange = (
    value: string,
    matchedOption?: { label: string; code: string },
  ) => {
    markWaitlistStarted("field:country");
    updateWaitlistForm((current) => {
      const next = {
        ...current,
        country: normalizeWaitlistFieldValue("country", value, "change"),
        phoneCountryCode: matchedOption
          ? normalizeWaitlistFieldValue(
              "phoneCountryCode",
              matchedOption.code,
              "change",
            )
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
        country: normalizeWaitlistFieldValue(
          "country",
          current.country,
          "blur",
        ),
        phoneCountryCode: normalizeWaitlistFieldValue(
          "phoneCountryCode",
          current.phoneCountryCode,
          "blur",
        ),
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
  const handleWaitlistSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
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
      trackWaitlistEvent("waitlist_submit_blocked", {
        reason: "cooldown",
        seconds_remaining: cooldownSeconds,
      });
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
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      WAITLIST_REQUEST_TIMEOUT_MS,
    );
    const payload = {
      title: normalizedForm.title,
      fullName: normalizedForm.fullName,
      email: normalizedForm.email,
      phoneCountryCode: normalizedForm.phoneCountryCode,
      phoneNumber: normalizedForm.whatsapp,
      fullPhone:
        `${normalizedForm.phoneCountryCode} ${normalizedForm.whatsapp}`.trim(),
      country: normalizedForm.country,
      interest: normalizedForm.interest,
      timeline: normalizedForm.timeline,
      contactPreference: normalizedForm.contactPreference,
      note: normalizedForm.note,
      sourceRoute: route,
      clientTimestamp: new Date().toISOString(),
      viewport:
        typeof window !== "undefined"
          ? `${window.innerWidth}x${window.innerHeight}`
          : undefined,
      timezone:
        typeof window !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : undefined,
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
        window.localStorage.setItem(
          WAITLIST_COOLDOWN_KEY,
          String(nextCooldownUntil),
        );
      }
      setWaitlistCooldownUntil(nextCooldownUntil);
      const completionSeconds = waitlistStartedAt
        ? Math.max(1, Math.round((Date.now() - waitlistStartedAt) / 1000))
        : undefined;
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
        kind: "video" as const,
        word: "Praeliator",
        line: "Equipment for those who treat boxing as art.",
        cta: "Discover",
        action: () => goTo("/praeliator-vis"),
        video: homeCinematicMedia.hero.video,
        poster: homeCinematicMedia.hero.poster,
      },
      {
        key: "vis",
        kind: "video" as const,
        word: "VIS",
        line: "16 oz · Lace-up · Top-grain cowhide",
        cta: "Enter VIS",
        action: () => goTo("/praeliator-vis"),
        video: homeCinematicMedia.vis.video,
        poster: homeCinematicMedia.vis.poster,
      },
      {
        key: "acquisition",
        kind: "video" as const,
        word: "Acquisition",
        line: "Handled directly.",
        cta: "Private Inquiry",
        href: whatsappGeneralLink,
        video: homeCinematicMedia.acquisition.video,
        poster: homeCinematicMedia.acquisition.poster,
      },
      { key: "tail", kind: "tail" as const },
    ];
    return (
      <FullScreenCinematicHomepage
        sections={cinematicSections}
        goTo={goTo}
        whatsappGeneralLink={whatsappGeneralLink}
        instagramLink={instagramLink}
        emailLink={emailLink}
        onActiveIndexChange={setHomeSectionIndex}
      />
    );
  };
  const renderVisPage = () => (
    <>
      <section className="relative isolate min-h-dvh supports-[height:100svh]:min-h-[100svh] overflow-hidden bg-[#040404]">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 scale-[1.025] bg-cover bg-center"
            style={{ backgroundImage: `url(${visImageSources.hero})` }}
            aria-hidden="true"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={visImageSources.hero}
          >
            <source src={visPageMedia.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.28)_38%,rgba(0,0,0,0.62)_70%,rgba(0,0,0,0.9))]" />
          <div className="absolute inset-x-0 top-0 h-[30svh] bg-[linear-gradient(180deg,rgba(4,4,4,0.82),rgba(4,4,4,0.28),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-[40svh] bg-[linear-gradient(180deg,transparent,rgba(4,4,4,0.22),rgba(4,4,4,0.9))]" />
        </div>

        <Container className="relative flex min-h-dvh supports-[height:100svh]:min-h-[100svh] items-end pb-14 pt-28 sm:pb-18 sm:pt-32 lg:pb-24 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.08, ease: easeLuxury }}
            className="max-w-[56rem]"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#c7a98d] sm:text-xs">
              Praeliator VIS
            </p>
            <h1 className="mt-5 max-w-[11ch] text-[clamp(3.15rem,7.8vw,7.6rem)] font-semibold leading-[0.88] tracking-[-0.068em] text-[#f4efe7]">
              A training glove treated like an object study.
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/64 sm:text-base sm:leading-8 lg:max-w-3xl">
              VIS was resolved with the calm of a museum piece and the discipline of a
              serious training instrument. Surface, silhouette, structure, and ownership
              remain inside one controlled language.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.3em] text-white/34 sm:text-[11px]">
              <span>16 oz</span>
              <span>Lace-up only</span>
              <span>Top-grain cowhide</span>
              <span>Technical sparring</span>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-[#050505] py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.08),transparent_32%)]" />
        <Container className="relative">
          <Reveal className="mx-auto max-w-[56rem] text-center">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#b9a18d] sm:text-xs">
              Thesis
            </p>
            <h2 className="mt-6 text-[clamp(2.55rem,5.8vw,5.3rem)] font-semibold leading-[0.92] tracking-[-0.068em] text-[#f4efe7]">
              Luxury is not louder. It is more resolved.
            </h2>
            <p className="mx-auto mt-6 max-w-[38rem] text-sm leading-7 text-white/54 sm:text-base sm:leading-8">
              VIS does not rely on excess to look expensive. The authority of the object
              comes from proportion, restraint, and the feeling that every visible choice
              was made on purpose.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="relative -mt-2 py-6 sm:py-8 lg:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-8">
            <Reveal>
              <div className="h-full rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.88),rgba(9,9,8,0.94))] p-6 shadow-[0_34px_90px_rgba(0,0,0,0.3)] sm:p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                  Object study
                </p>
                <h2 className="mt-4 max-w-[11ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-[3.25rem]">
                  The silhouette is controlled before it is decorated.
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  VIS was shaped to feel engineered, not inflated. The taper into the wrist,
                  the authority of the cuff, the balance of the hand chamber, and the quiet
                  restraint of the surface all belong to the same decision-making system.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    {
                      title: "Silhouette",
                      text: "A training profile that reads deliberate before it reads aggressive.",
                    },
                    {
                      title: "Wrist transition",
                      text: "The glove narrows with intention before widening again at the cuff.",
                    },
                    {
                      title: "Visual restraint",
                      text: "Debossed branding and disciplined contrast keep the object quiet.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-5"
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        {item.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <MediaSurface
                src={visImageSources.hero}
                alt="Praeliator VIS silhouette study"
                video={visPageMedia.studyVideo}
                className="min-h-[24rem] sm:min-h-[30rem] lg:min-h-[40rem]"
                dim="light"
                priorityCopy={
                  <>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b]">
                      Museum view
                    </p>
                    <p className="mt-4 max-w-[11ch] text-3xl font-semibold leading-[0.92] tracking-[-0.055em] text-[#f4efe7] sm:text-5xl">
                      A controlled line for disciplined training.
                    </p>
                  </>
                }
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative -mt-1 py-6 sm:py-8 lg:py-10">
        <Container>
          <Reveal>
            <MediaSurface
              src={visImageSources.leather}
              alt="Praeliator VIS leather macro"
              video={visPageMedia.materialVideo}
              className="min-h-[24rem] sm:min-h-[28rem] lg:min-h-[34rem]"
              dim="light"
              priorityCopy={
                <div className="max-w-[34rem]">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px]">
                    Material
                  </p>
                  <p className="mt-4 text-[clamp(2.1rem,4.2vw,4rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-[#f4efe7]">
                    Top-grain cowhide. Soft satin finish.
                  </p>
                  <p className="mt-5 max-w-[30rem] text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                    The leather was chosen to read deep black first and espresso second.
                    It avoids the synthetic shine that makes luxury feel false.
                  </p>
                </div>
              }
            />
          </Reveal>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Surface",
                text: "Grain, seam, and edge remain visible enough to feel handmade, never noisy enough to feel busy.",
              },
              {
                title: "Tone",
                text: "VIS lives in a restrained black register with warmth underneath, not a flat synthetic black.",
              },
              {
                title: "Branding",
                text: "Debossed marks keep the glove inside the same visual language as the rest of Praeliator.",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={0.04 * index}>
                <div className="rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.88),rgba(10,10,9,0.94))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative -mt-1 py-6 sm:py-8 lg:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr] lg:items-start lg:gap-8">
            <Reveal>
              <div className="rounded-[2.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.9),rgba(9,9,8,0.95))] p-6 shadow-[0_34px_90px_rgba(0,0,0,0.3)] sm:p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                  Construction logic
                </p>
                <h2 className="mt-4 max-w-[10ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-[3.1rem]">
                  The glove had to feel technically serious without becoming visually loud.
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  VIS is not a museum object in the sense of fragility. It is a museum object
                  in the sense of resolution. Padding, palm ventilation, thumb attachment,
                  grip bar, and wrist control all belong to the same standard of discipline.
                </p>

                <div className="mt-8 rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                    Impact structure
                  </p>
                  <div className="mt-4 divide-y divide-white/10 border-t border-white/10">
                    {visPaddingLayers.map((layer, index) => (
                      <div
                        key={`${layer}-${index}`}
                        className="grid gap-2 py-4 sm:grid-cols-[86px_1fr] sm:items-center"
                      >
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/38 sm:text-[11px]">
                          Layer {index + 1}
                        </p>
                        <p className="text-sm leading-7 text-white/78 sm:text-[15px] sm:leading-8">
                          {layer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rounded-[2.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.88),rgba(10,10,9,0.94))] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.26)] sm:p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                  Object record
                </p>
                <div className="mt-6">
                  <DataList items={visSpecifications} compact />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-6">
            <MediaSurface
              src={visImageSources.plate}
              alt="Praeliator VIS branding detail"
              className="min-h-[16rem] sm:min-h-[20rem] lg:min-h-[24rem]"
              dim="light"
              priorityCopy={
                <div className="max-w-[18rem]">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b]">
                    Detail study
                  </p>
                  <p className="mt-4 text-2xl font-semibold leading-[0.94] tracking-[-0.05em] text-[#f4efe7] sm:text-3xl lg:text-[3rem]">
                    Debossed. Controlled. Quiet.
                  </p>
                </div>
              }
            />
          </Reveal>
        </Container>
      </section>

      <section className="relative -mt-1 py-6 sm:py-8 lg:py-10">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.9),rgba(9,9,8,0.95))] shadow-[0_32px_84px_rgba(0,0,0,0.28)]">
              <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
                <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                    Continuity
                  </p>
                  <h2 className="mt-4 max-w-[11ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-[3.15rem]">
                    Presentation, authenticity, and aftercare stay inside the same language.
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                    VIS should not stop feeling controlled once the glove leaves the image. The
                    rigid box, silk dust bag, authenticity record, ownership continuity, and
                    service route all belong to the same standard.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        Presentation
                      </p>
                      <div className="mt-4 space-y-3">
                        {visPackaging.map((item) => (
                          <p key={item} className="text-sm leading-7 text-white/60">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        Ownership
                      </p>
                      <div className="mt-4">
                        <DataList items={ownershipSignals} compact />
                      </div>
                    </div>
                  </div>
                </div>

                <MediaSurface
                  src={visImageSources.packaging}
                  alt="Praeliator VIS presentation"
                  video={visPageMedia.ownershipVideo}
                  className="min-h-[24rem] rounded-none border-0 shadow-none sm:min-h-[28rem] lg:min-h-full"
                  dim="light"
                  priorityCopy={
                    <>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px]">
                        Presentation and ownership
                      </p>
                      <p className="mt-4 max-w-[10ch] text-3xl font-semibold leading-[0.92] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-[3.1rem]">
                        The object extends beyond the glove.
                      </p>
                    </>
                  }
                />
              </div>

              <div className="border-t border-white/10 p-6 sm:p-8 lg:p-10">
                <div className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                    Aftercare
                  </p>
                  <div className="mt-4 grid gap-0 divide-y divide-white/10 border-t border-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:border-y lg:border-x-0">
                    {visService.map((item) => (
                      <div key={item} className="py-4 lg:px-5 lg:py-5">
                        <p className="text-sm leading-7 text-white/78 sm:text-[15px] sm:leading-8">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.08),transparent_34%)]" />
        <Container className="relative">
          <Reveal>
            <div className="rounded-[2.3rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,12,11,0.94),rgba(9,8,8,0.98))] p-7 shadow-[0_38px_120px_rgba(0,0,0,0.34)] sm:p-9 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                    Entry
                  </p>
                  <h2 className="mt-4 max-w-[10ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-5xl">
                    Acquisition continues directly.
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                    VIS is presented first as an object and acquired second as a route. The
                    final step should feel as disciplined as the glove itself.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-start lg:justify-end">
                  <Button
                    asChild
                    className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
                  >
                    <a href={whatsappVisLink} target="_blank" rel="noreferrer">
                      Private Inquiry
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
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );

const renderAcquisitionPage = () => (
  <>
    <section className="relative isolate min-h-dvh supports-[height:100svh]:min-h-[100svh] overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-center"
          style={{ backgroundImage: `url(${homeCinematicMedia.acquisition.poster})` }}
          aria-hidden="true"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={homeCinematicMedia.acquisition.poster}
        >
          <source src={homeCinematicMedia.acquisition.video} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),rgba(0,0,0,0.28)_40%,rgba(0,0,0,0.62)_72%,rgba(0,0,0,0.9))]" />
        <div className="absolute inset-x-0 top-0 h-[32svh] bg-[linear-gradient(180deg,rgba(4,4,4,0.84),rgba(4,4,4,0.34),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-[38svh] bg-[linear-gradient(180deg,transparent,rgba(4,4,4,0.18),rgba(4,4,4,0.84))]" />
      </div>

      <Container className="relative flex min-h-dvh supports-[height:100svh]:min-h-[100svh] items-end pb-14 pt-28 sm:pb-18 sm:pt-32 lg:pb-24 lg:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.05, ease: easeLuxury }}
          className="max-w-[56rem]"
        >
          <p className="text-[10px] uppercase tracking-[0.36em] text-[#c7a98d] sm:text-xs">
            Private acquisition
          </p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3.1rem,7.8vw,7.6rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#f4efe7]">
            Handled directly. Continued properly.
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/64 sm:text-base sm:leading-8 lg:max-w-3xl">
            Praeliator does not begin with open checkout. Inquiry, review, allocation,
            dispatch, and aftercare remain inside one controlled route so access feels
            continuous with the object itself.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

          <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.28em] text-white/36 sm:text-[11px]">
            <span>Inquiry</span>
            <span className="h-px w-5 bg-white/12" />
            <span>Review</span>
            <span className="h-px w-5 bg-white/12" />
            <span>Allocation</span>
            <span className="h-px w-5 bg-white/12" />
            <span>Delivery</span>
            <span className="h-px w-5 bg-white/12" />
            <span>Aftercare</span>
          </div>
        </motion.div>
      </Container>
    </section>

    <section className="relative py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.98fr_1.02fr] lg:items-end lg:gap-14">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#b9a18d] sm:text-xs">
              Acquisition principle
            </p>
            <h2 className="mt-5 max-w-[10ch] text-4xl font-semibold leading-[0.9] tracking-[-0.065em] sm:text-5xl lg:text-6xl">
              The route is part of the object.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              Luxury does not end at the glove. The way access is handled, the way timing is
              clarified, and the way ownership continues after delivery all carry the same
              tone as the product itself.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <MediaSurface
              src={visImageSources.packaging}
              alt="Praeliator acquisition packaging"
              video={homeCinematicMedia.ownership.video}
              className="min-h-[22rem] sm:min-h-[30rem] lg:min-h-[38rem]"
              dim="heavy"
              priorityCopy={
                <>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px]">
                    Controlled entry
                  </p>
                  <p className="mt-4 max-w-[12ch] text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7] sm:text-4xl">
                    Ownership begins before the glove arrives.
                  </p>
                </>
              }
            />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-lg leading-8 text-white/70 sm:text-xl sm:leading-9">
                Praeliator stays visible from first contact onward. There is no cart layer
                where the brand disappears, no open inventory theatre, and no generic
                checkout language replacing the tone of the object.
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {acquisitionPrinciples.map((item, index) => (
                <Reveal key={item.title} delay={0.1 + index * 0.05}>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#b9a18d]">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-white/58">{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-l border-white/10 pl-6 sm:pl-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                Standard
              </p>
              <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                {acquisitionStandards.map((item) => (
                  <div key={item} className="py-5">
                    <p className="max-w-md text-sm leading-7 text-white/64 sm:text-base sm:leading-8">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>

    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.08),transparent_34%)]" />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 self-start">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#b9a18d] sm:text-xs">
              The route
            </p>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-5xl">
              A direct procession, not a checkout flow.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              The sequence is quiet by design. Inquiry stays qualified, timing stays clear,
              and continuation stays attached to the same record from the beginning.
            </p>
          </Reveal>

          <div className="border-t border-white/10">
            {acquisitionSteps.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.08}>
                <div className="group relative overflow-hidden border-b border-white/10 py-10 sm:py-12 lg:py-14">
                  <div className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(180deg,rgba(185,161,141,0),rgba(185,161,141,0.26),rgba(185,161,141,0))]" />
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
                    <div className="max-w-2xl pl-5 sm:pl-7">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                        Stage {item.step}
                      </p>
                      <h3 className="mt-4 text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-[#f4efe7] sm:text-4xl">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                        {item.text}
                      </p>
                    </div>
                    <p className="text-[clamp(3.2rem,6.2vw,5.8rem)] font-semibold leading-none tracking-[-0.08em] text-white/[0.06] transition duration-700 group-hover:text-white/[0.12]">
                      {item.step}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>

    <section className="relative py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14">
          <Reveal delay={0.08} className="lg:order-2">
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#b9a18d] sm:text-xs">
              Why not a cart
            </p>
            <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-5xl">
              Open checkout would flatten the route.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
              The point is not artificial friction. The point is to protect tone,
              qualification, and continuity before and after purchase.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {acquisitionContrasts.map((column) => (
                <div key={column.title}>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-[#b9a18d]">
                    {column.title}
                  </p>
                  <div className="mt-4 space-y-4">
                    {column.lines.map((line) => (
                      <p key={line} className="text-sm leading-7 text-white/60">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:order-1">
            <MediaSurface
              src={visImageSources.hero}
              alt="Praeliator acquisition detail"
              className="min-h-[24rem] sm:min-h-[34rem] lg:min-h-[42rem]"
              dim="heavy"
              priorityCopy={
                <>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b] sm:text-[11px]">
                    Refusal
                  </p>
                  <p className="mt-4 max-w-[11ch] text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7] sm:text-4xl">
                    The brand does not disappear behind commerce language.
                  </p>
                </>
              }
            />
          </Reveal>
        </div>
      </Container>
    </section>

    <section className="relative py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="border-t border-white/10 pt-10 sm:pt-12 lg:pt-14">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#b9a18d] sm:text-xs">
                Entry
              </p>
              <h2 className="mt-5 max-w-[11ch] text-4xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-5xl">
                Immediate inquiry or quieter entry.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                Some clients want to begin contact immediately. Others want a softer point
                of entry into future releases. Both remain inside the same language and the
                same level of control.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  className="rounded-full bg-[#efe5d7] px-6 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                >
                  <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                    Begin Inquiry
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo("/waitlist")}
                  className="rounded-full border-white/15 bg-transparent px-6 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                >
                  Enter Waitlist
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="grid gap-6 sm:grid-cols-2">
                {acquisitionModeCards.map((item) => (
                  <div key={item.title} className="border-t border-white/10 pt-5">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                      {item.action}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#f4efe7]">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/62">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-white/10 pt-6">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                  Ownership signals
                </p>
                <div className="mt-4">
                  <DataList items={ownershipSignals} compact />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  </>
);

const renderWaitlistPage = () => (
    <>
      <PageHeroBanner
        eyebrow="Waitlist"
        title="A quieter route into future access."
        description="For future releases, collector interest, and private access. The waitlist exists for clients who want their interest recorded before direct continuation becomes necessary."
        note="Future releases · collector interest · private follow-up"
        actions={[
          {
            label: "Direct Inquiry",
            href: whatsappGeneralLink,
            variant: "primary",
          },
          {
            label: "Contact",
            onClick: () => goTo("/contact"),
            variant: "secondary",
          },
        ]}
        stats={pageHeroStats["/waitlist"]}
      />
      <section className="relative py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-start lg:gap-10">
            <Reveal>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,16,15,0.84),rgba(12,11,10,0.9))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
                <SectionHeading
                  eyebrow="Waitlist"
                  title="A quieter route into future access."
                  description="For future releases, collector interest, and private access."
                />
                <div className="mt-6 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  Client reference returned after submission.
                </div>
                <div className="mt-6 divide-y divide-white/10 border-t border-white/10">
                  {serviceStandards.map((item) => (
                    <div key={item} className="py-4">
                      <p className="text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid gap-4">
                  {[
                    {
                      title: "Review",
                      text: "Every qualified inquiry is reviewed before contact continues.",
                    },
                    {
                      title: "Reference",
                      text: "Your returned reference stays attached to the intake record.",
                    },
                    {
                      title: "Continuation",
                      text: "If timing matters, the route can continue directly on WhatsApp.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5"
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        {item.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/62">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    <a
                      href={whatsappGeneralLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackWaitlistEvent("waitlist_direct_inquiry_click", {
                          location: "sidebar",
                        })
                      }
                    >
                      Prefer direct inquiry instead
                    </a>
                  </Button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.96),rgba(11,10,9,0.98))] p-6 shadow-[0_34px_90px_rgba(0,0,0,0.34)] sm:p-8 lg:p-10">
                <form
                  className="grid gap-4 sm:gap-4 lg:gap-5"
                  onSubmit={handleWaitlistSubmit}
                  noValidate
                >
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor={WAITLIST_HONEYPOT_FIELD}>
                      Leave this field empty
                    </label>
                    <input
                      id={WAITLIST_HONEYPOT_FIELD}
                      name={WAITLIST_HONEYPOT_FIELD}
                      tabIndex={-1}
                      autoComplete="off"
                      value={waitlistHoneypot}
                      onChange={(event) =>
                        setWaitlistHoneypot(event.target.value)
                      }
                      className="browser-form-element h-0 w-0 opacity-0 pointer-events-none"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-[0.76fr_1.24fr] sm:items-start">
                    <div>
                      <SelectField
                        name="title"
                        value={waitlistForm.title}
                        onChange={(event) =>
                          handleWaitlistSelectChange("title", event)
                        }
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
                        maxLength={WAITLIST_FIELD_MAX_LENGTHS.fullName}
                        invalid={Boolean(getVisibleFieldError("fullName"))}
                        success={getFieldSuccess("fullName")}
                        describedBy={getFieldDescribedBy("fullName")}
                      />
                      <FieldError
                        id="fullName-error"
                        message={getVisibleFieldError("fullName")}
                      />
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
                      maxLength={WAITLIST_FIELD_MAX_LENGTHS.email}
                      invalid={Boolean(getVisibleFieldError("email"))}
                      success={getFieldSuccess("email")}
                      describedBy={getFieldDescribedBy("email")}
                    />
                    <FieldError
                      id="email-error"
                      message={getVisibleFieldError("email")}
                    />
                  </div>
                  <div>
                    <SearchPicker
                      name="country"
                      value={waitlistForm.country}
                      onChange={handleCountryChange}
                      onBlur={handleCountryBlur}
                      options={countryOptions.map((option) => ({
                        label: option.label,
                        code: option.code,
                      }))}
                      placeholder="Country or dial code *"
                      maxLength={WAITLIST_FIELD_MAX_LENGTHS.country}
                      exactMatchUpdates
                      fieldLabel="Country"
                      invalid={Boolean(getVisibleFieldError("country"))}
                      success={getFieldSuccess("country")}
                      describedBy={getFieldDescribedBy("country")}
                    />
                    <FieldError
                      id="country-error"
                      message={getVisibleFieldError("country")}
                    />
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
                        maxLength={WAITLIST_FIELD_MAX_LENGTHS.phoneCountryCode}
                        pattern="\+?[0-9]*"
                        placeholder="Dial code *"
                        invalid={Boolean(
                          getVisibleFieldError("phoneCountryCode"),
                        )}
                        success={getFieldSuccess("phoneCountryCode")}
                        describedBy={getFieldDescribedBy("phoneCountryCode")}
                      />
                      <FieldError
                        id="phoneCountryCode-error"
                        message={getVisibleFieldError("phoneCountryCode")}
                      />
                    </div>
                    <div>
                      <InputField
                        name="whatsapp"
                        value={waitlistForm.whatsapp}
                        onChange={handleWaitlistChange}
                        onBlur={() => handleWaitlistBlur("whatsapp")}
                        autoComplete="tel-national"
                        inputMode="tel"
                        maxLength={getDialCodePhoneRule(waitlistForm.phoneCountryCode).max}
                        pattern="[0-9]*"
                        placeholder="Phone number *"
                        invalid={Boolean(getVisibleFieldError("whatsapp"))}
                        success={getFieldSuccess("whatsapp")}
                        describedBy={getFieldDescribedBy("whatsapp")}
                      />
                      <FieldError
                        id="whatsapp-error"
                        message={getVisibleFieldError("whatsapp")}
                      />
                      {!getVisibleFieldError("whatsapp") ? (
                        <FieldNote>
                          Use the number where a private follow-up should
                          continue.
                        </FieldNote>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <SelectField
                      name="interest"
                      value={waitlistForm.interest}
                      onChange={(event) =>
                        handleWaitlistSelectChange("interest", event)
                      }
                      onBlur={() => handleWaitlistBlur("interest")}
                      placeholder="Interest *"
                      options={interestOptions}
                      invalid={Boolean(getVisibleFieldError("interest"))}
                      success={getFieldSuccess("interest")}
                      describedBy={getFieldDescribedBy("interest")}
                    />
                    <FieldError
                      id="interest-error"
                      message={getVisibleFieldError("interest")}
                    />
                  </div>
                  <div>
                    <SelectField
                      name="timeline"
                      value={waitlistForm.timeline}
                      onChange={(event) =>
                        handleWaitlistSelectChange("timeline", event)
                      }
                      onBlur={() => handleWaitlistBlur("timeline")}
                      placeholder="Timeline *"
                      options={timelineOptions}
                      invalid={Boolean(getVisibleFieldError("timeline"))}
                      success={getFieldSuccess("timeline")}
                      describedBy={getFieldDescribedBy("timeline")}
                    />
                    <FieldError
                      id="timeline-error"
                      message={getVisibleFieldError("timeline")}
                    />
                  </div>
                  <div>
                    <SelectField
                      name="contactPreference"
                      value={waitlistForm.contactPreference}
                      onChange={(event) =>
                        handleWaitlistSelectChange("contactPreference", event)
                      }
                      onBlur={() => handleWaitlistBlur("contactPreference")}
                      placeholder="Preferred contact method *"
                      options={contactPreferenceOptions}
                      invalid={Boolean(
                        getVisibleFieldError("contactPreference"),
                      )}
                      success={getFieldSuccess("contactPreference")}
                      describedBy={getFieldDescribedBy("contactPreference")}
                    />
                    <FieldError
                      id="contactPreference-error"
                      message={getVisibleFieldError("contactPreference")}
                    />
                  </div>
                  <div>
                    <textarea
                      name="note"
                      value={waitlistForm.note}
                      onChange={handleWaitlistChange}
                      onBlur={() => handleWaitlistBlur("note")}
                      rows={6}
                      maxLength={WAITLIST_FIELD_MAX_LENGTHS.note}
                      className={`${formFieldBaseClass} min-h-[10.5rem] resize-none px-5 py-4 align-top ${getFormFieldStateClasses({})}`}
                      placeholder="Optional note"
                    />
                    <FieldNote>
                      Any detail that affects timing, use, or preferred contact
                      can go here.
                    </FieldNote>
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={
                        waitlistState.loading ||
                        getWaitlistCooldownSeconds() > 0
                      }
                      className="h-[3.85rem] w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_16px_36px_rgba(239,229,215,0.2)] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span className="inline-flex items-center gap-3">
                        {waitlistState.loading ? (
                          <span
                            className="browser-submit-spinner"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span>
                          {waitlistState.loading
                            ? "Submitting..."
                            : getWaitlistCooldownSeconds() > 0
                              ? `Wait ${getWaitlistCooldownSeconds()}s`
                              : "Join Waitlist"}
                        </span>
                      </span>
                    </Button>
                    <FieldNote>
                      Private review typically continues within one business
                      day.
                    </FieldNote>
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
                          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                            Inquiry received
                          </p>
                          <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7] sm:text-lg">
                            {waitlistState.reference ||
                              "Client reference pending"}
                          </p>
                        </div>
                        <div className="space-y-4 px-5 py-5 sm:px-6">
                          <p className="text-sm leading-6 text-white/62">
                            {waitlistState.serviceMessage}
                          </p>
                          <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.018] p-4 text-sm leading-6 text-white/58">
                            Private review usually follows within one business
                            day. If timing matters, continue directly on
                            WhatsApp and include your reference.
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
                                onClick={() =>
                                  trackWaitlistEvent(
                                    "waitlist_success_whatsapp_click",
                                    {
                                      reference:
                                        waitlistState.reference || "pending",
                                    },
                                  )
                                }
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
                    <p
                      className="text-sm leading-6 text-[#d99b8d]"
                      aria-live="polite"
                    >
                      {waitlistState.error}
                    </p>
                  ) : null}
                </form>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
  const renderContactPage = () => (
    <>
      <section className="relative isolate min-h-dvh supports-[height:100svh]:min-h-[100svh] overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 scale-[1.03] bg-cover bg-center"
            style={{ backgroundImage: `url(${visImageSources.packaging})` }}
            aria-hidden="true"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={visImageSources.packaging}
          >
            <source src={homeCinematicMedia.ownership.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04),rgba(0,0,0,0.2)_38%,rgba(0,0,0,0.54)_68%,rgba(0,0,0,0.88))]" />
          <div className="absolute inset-x-0 top-0 h-[32svh] bg-[linear-gradient(180deg,rgba(4,4,4,0.84),rgba(4,4,4,0.34),transparent)]" />
          <div className="absolute inset-x-0 bottom-0 h-[36svh] bg-[linear-gradient(180deg,transparent,rgba(4,4,4,0.16),rgba(4,4,4,0.82))]" />
        </div>

        <Container className="relative flex min-h-dvh supports-[height:100svh]:min-h-[100svh] items-end pb-14 pt-28 sm:pb-18 sm:pt-32 lg:pb-24 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.02, ease: easeLuxury }}
            className="max-w-[54rem]"
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#c7a98d] sm:text-xs">
              Direct contact
            </p>
            <h1 className="mt-5 max-w-[10ch] text-[clamp(3rem,7.2vw,7rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#f4efe7]">
              Direct contact, kept simple.
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/64 sm:text-base sm:leading-8">
              WhatsApp remains primary for private inquiry. Email and Instagram stay
              available as quieter secondary paths.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
              >
                <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                  Private Inquiry
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

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.28em] text-white/36 sm:text-[11px]">
              <span>WhatsApp</span>
              <span className="h-px w-5 bg-white/12" />
              <span>Email</span>
              <span className="h-px w-5 bg-white/12" />
              <span>Instagram</span>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="relative py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-14">
            <Reveal>
              <div className="rounded-[2.2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(15,13,12,0.9),rgba(9,8,8,0.94))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                  Primary route
                </p>
                <h2 className="mt-5 max-w-[9ch] text-4xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-5xl">
                  WhatsApp remains first.
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  For private purchase inquiries and faster continuation, WhatsApp stays
                  primary. The route remains direct and the tone remains controlled.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    className="rounded-full bg-[#efe5d7] px-6 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                  >
                    <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                      Open WhatsApp
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goTo("/waitlist")}
                    className="rounded-full border-white/15 bg-transparent px-6 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    Quieter Entry
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="divide-y divide-white/10 border-t border-white/10">
                <div className="py-6 sm:py-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    Secondary
                  </p>
                  <div className="mt-4 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#f4efe7]">
                        Email
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                        Slower and quieter, but still appropriate when immediate back and
                        forth is not necessary.
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="shrink-0 rounded-full border-white/15 bg-transparent px-5 py-5 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                    >
                      <a href={emailLink}>Write email</a>
                    </Button>
                  </div>
                </div>

                <div className="py-6 sm:py-7">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    Secondary
                  </p>
                  <div className="mt-4 flex items-start justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#f4efe7]">
                        Instagram
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                        Available for lighter contact and brand presence, but not the main
                        purchase route.
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="shrink-0 rounded-full border-white/15 bg-transparent px-5 py-5 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                    >
                      <a href={instagramLink} target="_blank" rel="noreferrer">
                        Visit Instagram
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <p className="mt-8 max-w-lg text-sm leading-7 text-white/42 sm:text-base sm:leading-8">
                Qualified inquiries continue directly. Slower channels remain available
                where appropriate.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );


  const renderMobileHomePage = () => (
    <>
      <section className="relative overflow-hidden pb-6 pt-24">
        <Container>
          <div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(13,12,11,0.94),rgba(9,8,8,0.98))] shadow-[0_36px_110px_rgba(0,0,0,0.36)]">
            <MediaSurface
              src={homeCinematicMedia.hero.poster}
              alt="Praeliator hero"
              video={homeCinematicMedia.hero.video}
              className="min-h-[78svh] rounded-none border-0 shadow-none"
              dim="heavy"
              priorityCopy={
                <div className="max-w-[15rem]">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#d0b39b]">
                    Praeliator
                  </p>
                  <p className="mt-4 text-[2.9rem] font-semibold leading-[0.88] tracking-[-0.065em] text-[#f4efe7]">
                    Boxing, treated like an art form.
                  </p>
                  <p className="mt-5 text-sm leading-7 text-white/72">
                    Equipment for those who treat boxing as art.
                  </p>
                </div>
              }
            />
            <div className="p-5">
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => goTo("/praeliator-vis")}
                  className="h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
                >
                  Discover VIS
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                >
                  <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                    Private Inquiry
                  </a>
                </Button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Format", value: "16 oz · lace-up" },
                  { label: "Material", value: "Top-grain cowhide" },
                  { label: "Approach", value: "Quiet luxury" },
                  { label: "Route", value: "Direct acquisition" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/76">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative py-6">
        <Container>
          <div className="grid gap-4">
            <Reveal>
              <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.9),rgba(9,9,8,0.95))] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
                <MediaSurface
                  src={homeCinematicMedia.vis.poster}
                  alt="Praeliator VIS"
                  video={homeCinematicMedia.vis.video}
                  className="min-h-[18rem] rounded-none border-0 shadow-none"
                  dim="medium"
                />
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    VIS
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7]">
                    The flagship training glove.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    A 16 oz lace-up training glove in top-grain cowhide, built
                    for disciplined training and technical sparring.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={() => goTo("/praeliator-vis")}
                      className="h-[3.4rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
                    >
                      Enter VIS
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-[3.4rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
                    >
                      <a href={createWhatsAppLink("Hello Praeliator, I would like to inquire about Praeliator VIS.")} target="_blank" rel="noreferrer">
                        Inquire about VIS
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.9),rgba(9,9,8,0.95))] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
                <MediaSurface
                  src={homeCinematicMedia.material.poster}
                  alt="Praeliator material"
                  video={homeCinematicMedia.material.video}
                  className="min-h-[16rem] rounded-none border-0 shadow-none"
                  dim="light"
                  priorityCopy={
                    <div className="max-w-[14rem]">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b]">
                        Material
                      </p>
                      <p className="mt-4 text-2xl font-semibold leading-[0.95] tracking-[-0.05em] text-[#f4efe7]">
                        Top-grain leather. Soft satin finish.
                      </p>
                    </div>
                  }
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.9),rgba(9,9,8,0.95))] shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
                <MediaSurface
                  src={homeCinematicMedia.acquisition.poster}
                  alt="Praeliator acquisition"
                  video={homeCinematicMedia.acquisition.video}
                  className="min-h-[16rem] rounded-none border-0 shadow-none"
                  dim="heavy"
                />
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    Acquisition
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7]">
                    Handled directly.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    Inquiry, review, allocation, delivery, and aftercare stay
                    inside one controlled route.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Button
                      asChild
                      className="h-[3.4rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
                    >
                      <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                        Private Inquiry
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo("/acquisition")}
                      className="h-[3.4rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
                    >
                      View acquisition route
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <MobileSectionFrame
        eyebrow="Explore"
        title="Continue deeper into the brand."
        description="The same world, reorganized for phone without weakening the identity."
      >
        <div className="grid gap-3">
          {[
            {
              title: "Discover VIS",
              text: "The flagship training glove.",
              route: "/praeliator-vis" as Route,
              image: visImageSources.hero,
            },
            {
              title: "Private Acquisition",
              text: "Handled directly, with control.",
              route: "/acquisition" as Route,
              image: visImageSources.packaging,
            },
            {
              title: "Join Waitlist",
              text: "Future access, recorded properly.",
              route: "/waitlist" as Route,
              image: homeImageSources.presentation,
            },
          ].map((card) => (
            <button
              key={card.route}
              type="button"
              onClick={() => goTo(card.route)}
              className="group overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.03] text-left transition duration-500 hover:border-white/16 hover:bg-white/[0.05]"
            >
              <div
                className="h-36 bg-cover bg-center"
                style={{ backgroundImage: `url(${card.image})` }}
              />
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-base uppercase tracking-[0.12em] text-white/88">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/56">
                    {card.text}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/30 transition duration-500 group-hover:translate-x-0.5 group-hover:text-white/58" />
              </div>
            </button>
          ))}
        </div>
      </MobileSectionFrame>

      <MobileHomeFooter
        goTo={goTo}
        whatsappGeneralLink={whatsappGeneralLink}
        instagramLink={instagramLink}
        emailLink={emailLink}
      />
    </>
  );

  const renderMobileVisPage = () => (
    <>
      <MobilePageHeroBanner
        eyebrow="Praeliator VIS"
        title="A training glove treated like an object study."
        description="VIS was resolved with the calm of a museum piece and the discipline of a serious training instrument."
        note="16 oz · lace-up only · top-grain cowhide · technical sparring"
        actions={[
          { label: "Private Inquiry", href: whatsappVisLink, variant: "primary" },
          { label: "Join Waitlist", onClick: () => goTo("/waitlist"), variant: "secondary" },
        ]}
        media={{
          image: visImageSources.hero,
          alt: "Praeliator VIS hero",
          video: visPageMedia.heroVideo,
          badge: "Praeliator VIS",
          overlayTitle: "Controlled, quiet, technically serious.",
        }}
        stats={pageHeroStats["/praeliator-vis"]}
      />

      <MobileSectionFrame
        eyebrow="Thesis"
        title="Luxury is not louder. It is more resolved."
        description="VIS does not rely on excess to look expensive. The authority of the object comes from proportion, restraint, and the feeling that every visible choice was made on purpose."
      >
        <div className="grid gap-3">
          {visEditorialBlocks.map((item) => (
            <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </MobileSectionFrame>

      <section className="relative py-6">
        <Container>
          <div className="grid gap-4">
            <Reveal>
              <MediaSurface
                src={visImageSources.hero}
                alt="Praeliator VIS silhouette study"
                video={visPageMedia.studyVideo}
                className="min-h-[21rem]"
                dim="light"
                priorityCopy={
                  <div className="max-w-[15rem]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#d0b39b]">
                      Object study
                    </p>
                    <p className="mt-4 text-3xl font-semibold leading-[0.92] tracking-[-0.055em] text-[#f4efe7]">
                      The silhouette is controlled before it is decorated.
                    </p>
                  </div>
                }
              />
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.9),rgba(9,9,8,0.95))] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
                <div className="grid gap-3">
                  {[
                    {
                      title: "Silhouette",
                      text: "A training profile that reads deliberate before it reads aggressive.",
                    },
                    {
                      title: "Wrist transition",
                      text: "The glove narrows with intention before widening again at the cuff.",
                    },
                    {
                      title: "Visual restraint",
                      text: "Debossed branding and disciplined contrast keep the object quiet.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        {item.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <MobileSectionFrame
        eyebrow="Material"
        title="Top-grain cowhide. Soft satin finish."
        description="The leather was chosen to read deep black first and espresso second. It avoids the synthetic shine that makes luxury feel false."
      >
        <MediaSurface
          src={visImageSources.leather}
          alt="Praeliator VIS leather macro"
          video={visPageMedia.materialVideo}
          className="min-h-[18rem]"
          dim="light"
        />
        <div className="mt-4 grid gap-3">
          {[
            {
              title: "Surface",
              text: "Grain, seam, and edge remain visible enough to feel handmade, never noisy enough to feel busy.",
            },
            {
              title: "Tone",
              text: "VIS lives in a restrained black register with warmth underneath, not a flat synthetic black.",
            },
            {
              title: "Branding",
              text: "Debossed marks keep the glove inside the same visual language as the rest of Praeliator.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Construction logic"
        title="Technically serious without becoming visually loud."
        description="Padding, palm ventilation, thumb attachment, grip bar, and wrist control all belong to the same standard of discipline."
      >
        <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
            Impact structure
          </p>
          <div className="mt-4 divide-y divide-white/10 border-t border-white/10">
            {visPaddingLayers.map((layer, index) => (
              <div
                key={`${layer}-${index}`}
                className="grid gap-2 py-4 sm:grid-cols-[86px_1fr] sm:items-center"
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/38 sm:text-[11px]">
                  Layer {index + 1}
                </p>
                <p className="text-sm leading-7 text-white/78 sm:text-[15px] sm:leading-8">
                  {layer}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
            Object record
          </p>
          <div className="mt-4">
            <DataList items={visSpecifications} compact />
          </div>
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Continuity"
        title="The object extends beyond the glove."
        description="Presentation, authenticity, and aftercare stay inside the same language."
      >
        <MediaSurface
          src={visImageSources.packaging}
          alt="Praeliator VIS presentation"
          video={visPageMedia.ownershipVideo}
          className="min-h-[18rem]"
          dim="light"
        />
        <div className="mt-4 grid gap-4">
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
              Presentation
            </p>
            <div className="mt-4 space-y-3">
              {visPackaging.map((item) => (
                <p key={item} className="text-sm leading-7 text-white/60">
                  {item}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
              Ownership
            </p>
            <div className="mt-4">
              <DataList items={ownershipSignals} compact />
            </div>
          </div>
          <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
              Aftercare
            </p>
            <div className="mt-4 grid gap-3">
              {visService.map((item) => (
                <p key={item} className="text-sm leading-7 text-white/78">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Entry"
        title="Acquisition continues directly."
        description="VIS is presented first as an object and acquired second as a route."
      >
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
          >
            <a href={whatsappVisLink} target="_blank" rel="noreferrer">
              Private Inquiry
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo("/waitlist")}
            className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
          >
            Join Waitlist
          </Button>
        </div>
      </MobileSectionFrame>
    </>
  );

  const renderMobileAcquisitionPage = () => (
    <>
      <MobilePageHeroBanner
        eyebrow="Private acquisition"
        title="Handled directly. Continued properly."
        description="Inquiry, review, allocation, dispatch, and aftercare remain inside one controlled route."
        actions={[
          { label: "Begin Inquiry", href: whatsappGeneralLink, variant: "primary" },
          { label: "Join Waitlist", onClick: () => goTo("/waitlist"), variant: "secondary" },
        ]}
        media={{
          image: homeCinematicMedia.acquisition.poster,
          alt: "Praeliator acquisition hero",
          video: homeCinematicMedia.acquisition.video,
          badge: "Private acquisition",
          overlayTitle: "The route is part of the object.",
        }}
        stats={pageHeroStats["/acquisition"]}
      />

      <MobileSectionFrame
        eyebrow="Acquisition principle"
        title="The route is part of the object."
        description="Luxury does not end at the glove. The way access is handled and the way ownership continues after delivery all carry the same tone as the product itself."
      >
        <div className="grid gap-3">
          {acquisitionPrinciples.map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
            Standard
          </p>
          <div className="mt-4 divide-y divide-white/10 border-t border-white/10">
            {acquisitionStandards.map((item) => (
              <div key={item} className="py-4">
                <p className="text-sm leading-7 text-white/64">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="The route"
        title="A direct procession, not a checkout flow."
        description="The sequence is quiet by design. Inquiry stays qualified, timing stays clear, and continuation stays attached to the same record from the beginning."
      >
        <div className="grid gap-3">
          {acquisitionSteps.map((item) => (
            <div key={item.step} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    Stage {item.step}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold leading-[0.94] tracking-[-0.045em] text-[#f4efe7]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-3xl font-semibold leading-none tracking-[-0.08em] text-white/[0.08]">
                  {item.step}
                </p>
              </div>
              <p className="mt-4 text-sm leading-7 text-white/62">{item.text}</p>
            </div>
          ))}
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Why not a cart"
        title="Open checkout would flatten the route."
        description="The point is not artificial friction. The point is to protect tone, qualification, and continuity before and after purchase."
      >
        <div className="grid gap-4">
          {acquisitionContrasts.map((column) => (
            <div key={column.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {column.title}
              </p>
              <div className="mt-4 space-y-3">
                {column.lines.map((line) => (
                  <p key={line} className="text-sm leading-7 text-white/60">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Entry"
        title="Immediate inquiry or quieter entry."
        description="Some clients want to begin contact immediately. Others want a softer point of entry into future releases."
      >
        <div className="grid gap-3">
          {acquisitionModeCards.map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {item.action}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#f4efe7]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Button
            asChild
            className="h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
          >
            <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
              Begin Inquiry
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo("/waitlist")}
            className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
          >
            Enter Waitlist
          </Button>
        </div>
      </MobileSectionFrame>
    </>
  );

  const renderMobileWaitlistPage = () => (
    <>
      <MobilePageHeroBanner
        eyebrow="Waitlist"
        title="A quieter route into future access."
        description="For future releases, collector interest, and private access. The waitlist exists for clients who want their interest recorded before direct continuation becomes necessary."
        note="Future releases · collector interest · private follow-up"
        actions={[
          { label: "Direct Inquiry", href: whatsappGeneralLink, variant: "primary" },
          { label: "Contact", onClick: () => goTo("/contact"), variant: "secondary" },
        ]}
        stats={pageHeroStats["/waitlist"]}
      />

      <MobileSectionFrame
        eyebrow="Waitlist"
        title="Client reference returned after submission."
        description="Every qualified inquiry is reviewed before contact continues."
      >
        <div className="grid gap-3">
          {[
            {
              title: "Review",
              text: "Every qualified inquiry is reviewed before contact continues.",
            },
            {
              title: "Reference",
              text: "Your returned reference stays attached to the intake record.",
            },
            {
              title: "Continuation",
              text: "If timing matters, the route can continue directly on WhatsApp.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/62">{item.text}</p>
            </div>
          ))}
        </div>
      </MobileSectionFrame>

      <section className="relative py-6">
        <Container>
          <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.96),rgba(11,10,9,0.98))] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.3)]">
            <form className="grid gap-4" onSubmit={handleWaitlistSubmit} noValidate>
              <div className="hidden" aria-hidden="true">
                <label htmlFor={WAITLIST_HONEYPOT_FIELD}>Leave this field empty</label>
                <input
                  id={WAITLIST_HONEYPOT_FIELD}
                  name={WAITLIST_HONEYPOT_FIELD}
                  tabIndex={-1}
                  autoComplete="off"
                  value={waitlistHoneypot}
                  onChange={(event) => setWaitlistHoneypot(event.target.value)}
                  className="browser-form-element pointer-events-none h-0 w-0 opacity-0"
                />
              </div>

              <SelectField
                name="title"
                value={waitlistForm.title}
                onChange={(event) => handleWaitlistSelectChange("title", event)}
                onBlur={() => handleWaitlistBlur("title")}
                placeholder="Title"
                searchable
                searchPlaceholder="Search title"
                fieldLabel="Honorific"
                success={getFieldSuccess("title")}
                describedBy={getFieldDescribedBy("title")}
              />

              <div>
                <InputField
                  name="fullName"
                  value={waitlistForm.fullName}
                  onChange={handleWaitlistChange}
                  onBlur={() => handleWaitlistBlur("fullName")}
                  autoComplete="name"
                  placeholder="Full name *"
                  maxLength={WAITLIST_FIELD_MAX_LENGTHS.fullName}
                  invalid={Boolean(getVisibleFieldError("fullName"))}
                  success={getFieldSuccess("fullName")}
                  describedBy={getFieldDescribedBy("fullName")}
                />
                <FieldError id="fullName-error" message={getVisibleFieldError("fullName")} />
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
                  maxLength={WAITLIST_FIELD_MAX_LENGTHS.email}
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
                  options={countryOptions.map((option) => ({
                    label: option.label,
                    code: option.code,
                  }))}
                  placeholder="Country or dial code *"
                  maxLength={WAITLIST_FIELD_MAX_LENGTHS.country}
                  exactMatchUpdates
                  fieldLabel="Country"
                  invalid={Boolean(getVisibleFieldError("country"))}
                  success={getFieldSuccess("country")}
                  describedBy={getFieldDescribedBy("country")}
                />
                <FieldError id="country-error" message={getVisibleFieldError("country")} />
              </div>

              <div className="grid gap-4">
                <div>
                  <InputField
                    name="phoneCountryCode"
                    value={waitlistForm.phoneCountryCode}
                    onChange={handleWaitlistChange}
                    onBlur={() => handleWaitlistBlur("phoneCountryCode")}
                    autoComplete="tel-country-code"
                    inputMode="tel"
                    maxLength={WAITLIST_FIELD_MAX_LENGTHS.phoneCountryCode}
                    pattern="\+?[0-9]*"
                    placeholder="Dial code *"
                    invalid={Boolean(getVisibleFieldError("phoneCountryCode"))}
                    success={getFieldSuccess("phoneCountryCode")}
                    describedBy={getFieldDescribedBy("phoneCountryCode")}
                  />
                  <FieldError
                    id="phoneCountryCode-error"
                    message={getVisibleFieldError("phoneCountryCode")}
                  />
                </div>
                <div>
                  <InputField
                    name="whatsapp"
                    value={waitlistForm.whatsapp}
                    onChange={handleWaitlistChange}
                    onBlur={() => handleWaitlistBlur("whatsapp")}
                    autoComplete="tel-national"
                    inputMode="tel"
                    maxLength={getDialCodePhoneRule(waitlistForm.phoneCountryCode).max}
                    pattern="[0-9]*"
                    placeholder="Phone number *"
                    invalid={Boolean(getVisibleFieldError("whatsapp"))}
                    success={getFieldSuccess("whatsapp")}
                    describedBy={getFieldDescribedBy("whatsapp")}
                  />
                  <FieldError id="whatsapp-error" message={getVisibleFieldError("whatsapp")} />
                  {!getVisibleFieldError("whatsapp") ? (
                    <FieldNote>
                      Use the number where a private follow-up should continue.
                    </FieldNote>
                  ) : null}
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
                  onChange={(event) =>
                    handleWaitlistSelectChange("contactPreference", event)
                  }
                  onBlur={() => handleWaitlistBlur("contactPreference")}
                  placeholder="Preferred contact method *"
                  options={contactPreferenceOptions}
                  invalid={Boolean(getVisibleFieldError("contactPreference"))}
                  success={getFieldSuccess("contactPreference")}
                  describedBy={getFieldDescribedBy("contactPreference")}
                />
                <FieldError
                  id="contactPreference-error"
                  message={getVisibleFieldError("contactPreference")}
                />
              </div>

              <div>
                <textarea
                  name="note"
                  value={waitlistForm.note}
                  onChange={handleWaitlistChange}
                  onBlur={() => handleWaitlistBlur("note")}
                  rows={6}
                  maxLength={WAITLIST_FIELD_MAX_LENGTHS.note}
                  className={`${formFieldBaseClass} min-h-[10.5rem] resize-none px-5 py-4 align-top ${getFormFieldStateClasses({})}`}
                  placeholder="Optional note"
                />
                <FieldNote>
                  Any detail that affects timing, use, or preferred contact can go here.
                </FieldNote>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={waitlistState.loading || getWaitlistCooldownSeconds() > 0}
                  className="h-[3.85rem] w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.16)] transition duration-500 hover:bg-[#e4d7c7] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="inline-flex items-center gap-3">
                    {waitlistState.loading ? (
                      <span className="browser-submit-spinner" aria-hidden="true" />
                    ) : null}
                    <span>
                      {waitlistState.loading
                        ? "Submitting..."
                        : getWaitlistCooldownSeconds() > 0
                          ? `Wait ${getWaitlistCooldownSeconds()}s`
                          : "Join Waitlist"}
                    </span>
                  </span>
                </Button>
                <FieldNote>
                  Private review typically continues within one business day.
                </FieldNote>
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
                    <div className="border-b border-white/[0.08] px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Inquiry received
                      </p>
                      <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7]">
                        {waitlistState.reference || "Client reference pending"}
                      </p>
                    </div>
                    <div className="space-y-4 px-5 py-5">
                      <p className="text-sm leading-6 text-white/62">
                        {waitlistState.serviceMessage}
                      </p>
                      <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.018] p-4 text-sm leading-6 text-white/58">
                        Private review usually follows within one business day.
                        If timing matters, continue directly on WhatsApp and
                        include your reference.
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          asChild
                          className="rounded-full bg-[#efe5d7] px-5 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
                        >
                          <a
                            href={whatsappWaitlistFollowUpLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() =>
                              trackWaitlistEvent(
                                "waitlist_success_whatsapp_click",
                                {
                                  reference: waitlistState.reference || "pending",
                                },
                              )
                            }
                          >
                            Continue on WhatsApp
                          </a>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => goTo("/")}
                          className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                        >
                          Return Home
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {waitlistState.error ? (
                <p className="text-sm leading-6 text-[#d99b8d]" aria-live="polite">
                  {waitlistState.error}
                </p>
              ) : null}
            </form>
          </div>
        </Container>
      </section>
    </>
  );

  const renderMobileContactPage = () => (
    <>
      <MobilePageHeroBanner
        eyebrow="Direct contact"
        title="Direct contact, kept simple."
        description="WhatsApp remains primary for private inquiry. Email and Instagram stay available as quieter secondary paths."
        actions={[
          { label: "Private Inquiry", href: whatsappGeneralLink, variant: "primary" },
          { label: "Join Waitlist", onClick: () => goTo("/waitlist"), variant: "secondary" },
        ]}
        media={{
          image: visImageSources.packaging,
          alt: "Praeliator contact hero",
          video: homeCinematicMedia.ownership.video,
          badge: "Direct contact",
          overlayTitle: "One voice, across every channel.",
        }}
        stats={pageHeroStats["/contact"]}
      />

      <MobileSectionFrame
        eyebrow="Primary route"
        title="WhatsApp remains first."
        description="For private purchase inquiries and faster continuation, WhatsApp stays primary."
      >
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
          >
            <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
              Open WhatsApp
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo("/waitlist")}
            className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
          >
            Quieter Entry
          </Button>
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Channels"
        title="Secondary paths stay available."
        description="Email stays useful for slower exchanges. Instagram stays useful for presence and softer first contact."
      >
        <div className="grid gap-3">
          {contactChannels.map((channel) => (
            <div key={channel.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {channel.role}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#f4efe7]">
                {channel.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/60">{channel.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-3">
          {contactPrinciples.map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Direct links"
        title="Choose the route that fits the timing."
        description="Qualified inquiries continue directly. Slower channels remain available where appropriate."
      >
        <div className="grid gap-3">
          <Button
            asChild
            className="h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
          >
            <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
          >
            <a href={emailLink}>Email</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
          >
            <a href={instagramLink} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </Button>
        </div>
      </MobileSectionFrame>
    </>
  );

  const renderMobilePage = () => {
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
    <div className="min-h-screen bg-[#070707] text-[#f4efe7]">
      <BrowserFormStyles />

      {isDesktopViewport ? (
        <motion.header
          className={`fixed inset-x-0 top-0 z-50 ${headerLifted ? "pointer-events-none" : ""}`}
          animate={{
            y: headerLifted ? "-118%" : "0%",
            opacity: headerLifted ? 0 : 1,
          }}
          transition={{ duration: 1.05, ease: easeLuxury }}
        >
          <motion.div
            animate={{
              backgroundColor: mobileMenuOpen
                ? "rgba(5,5,5,0.46)"
                : "rgba(5,5,5,0)",
              backdropFilter: mobileMenuOpen ? "blur(18px)" : "blur(0px)",
            }}
            transition={{ duration: 0.55, ease: easeLuxury }}
            className="overflow-hidden bg-[linear-gradient(180deg,rgba(5,5,5,0.78),rgba(5,5,5,0.24),transparent)]"
          >
            <Container className="relative flex items-center justify-between py-5 sm:py-6">
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeLuxury }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="group inline-flex h-12 w-12 items-center justify-center bg-transparent text-white/82 transition duration-500 hover:-translate-y-0.5 hover:text-white"
              >
                <motion.span
                  animate={{
                    scale: mobileMenuOpen ? 1.06 : 1,
                    y: mobileMenuOpen ? 0.5 : 0,
                  }}
                  transition={{ duration: 0.75, ease: easeLuxury }}
                  className="flex items-center justify-center"
                >
                  <PraeliatorMenuWreathIcon
                    open={mobileMenuOpen}
                    className="h-[2.9rem] w-[2.9rem]"
                  />
                </motion.span>
                <span className="sr-only">
                  {mobileMenuOpen ? "Close menu" : "Open menu"}
                </span>
              </motion.button>

              <HeaderBrandMark
                mode={headerBrandMode}
                onClick={() => goTo("/")}
                assetsBroken={headerLogoBroken}
                onAssetError={() => setHeaderLogoBroken(true)}
              />

              <motion.a
                href={currentPurchaseLink}
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

            <AnimatePresence initial={false}>
              {route !== "/" && !mobileMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.75, ease: easeLuxury }}
                  className="pointer-events-none pb-3 sm:pb-4"
                >
                  <Container className="flex justify-center">
                    <p className="text-[9px] uppercase tracking-[0.34em] text-white/38 sm:text-[10px]">
                      {pageMicroLabel}
                    </p>
                  </Container>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: easeLuxury }}
                  className="overflow-hidden"
                >
                  <Container className="pb-8 pt-2 sm:pb-10 sm:pt-3 lg:pb-12">
                    <div className="border-t border-white/[0.08] pt-6 sm:pt-8">
                      <div className="grid gap-0 lg:grid-cols-2 lg:gap-x-10">
                        {navItems.map((item, index) => (
                          <motion.button
                            key={item.path}
                            type="button"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.045,
                              ease: easeLuxury,
                            }}
                            onClick={() => goTo(item.path)}
                            className="group flex items-end justify-between gap-6 border-b border-white/[0.08] py-6 text-left transition duration-500 hover:border-white/[0.18] sm:py-7 lg:py-8"
                          >
                            <div className="min-w-0">
                              <p className="text-[clamp(1.15rem,2vw,2rem)] uppercase tracking-[0.1em] text-white/90 transition duration-500 group-hover:text-white">
                                {item.label}
                              </p>
                              <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-white/34 transition duration-500 group-hover:text-[#b9a18d]">
                                {item.label === "VIS"
                                  ? "Flagship"
                                  : item.label === "Acquisition"
                                    ? "Private route"
                                    : item.label === "Waitlist"
                                      ? "Future access"
                                      : "Direct contact"}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 shrink-0 text-white/24 transition duration-500 group-hover:translate-x-0.5 group-hover:text-white/56" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </Container>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.header>
      ) : (
        <MobileHeader
          route={route}
          pageMicroLabel={pageMicroLabel}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          brandMode={activeHeaderBrandMode}
          currentPurchaseLink={currentPurchaseLink}
          headerLogoBroken={headerLogoBroken}
          onHeaderLogoError={() => setHeaderLogoBroken(true)}
          goTo={goTo}
        />
      )}

      <main
        className={
          route === "/"
            ? "overflow-x-hidden bg-[#040404]"
            : "overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.1),transparent_24%),linear-gradient(180deg,#090909_0%,#070707_100%)]"
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${isDesktopViewport ? "desktop" : "mobile"}-${route}`}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {isDesktopViewport ? renderPage() : renderMobilePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {route === "/" ? null : isDesktopViewport ? (
        <ClubFooter
          goTo={goTo}
          whatsappGeneralLink={whatsappGeneralLink}
          instagramLink={instagramLink}
          emailLink={emailLink}
        />
      ) : (
        <MobileClubFooter
          goTo={goTo}
          whatsappGeneralLink={whatsappGeneralLink}
          instagramLink={instagramLink}
          emailLink={emailLink}
        />
      )}
    </div>
  );
}
