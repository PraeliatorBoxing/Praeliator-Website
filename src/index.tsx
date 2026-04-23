/// <reference types="vite/client" />
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-700.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./components/ui/button";
import { ObjectDossierCarousel } from "./components/object-dossier-carousel";
import { downloadOwnershipCertificatePdf } from "./lib/ownership-certificate-pdf";
import {
  getInitialSiteLocale,
  getSiteCopy,
  SITE_LOCALE_STORAGE_KEY,
  type SiteLocale,
  siteLocaleOptions,
} from "./lib/site-locale";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import Lenis from "lenis";
import { createClient, type Session } from "@supabase/supabase-js";
import {
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Instagram,
  Mail,
  MessageCircle,
} from "lucide-react";
import { PrivateAcquisitionRoute } from "./components/private-acquisition-route";
const visSpecifications = [
  { label: "Object class", value: "Recorded training pair" },
  { label: "Allocation amount", value: "$6,000 MXN" },
  { label: "Issued format", value: "16 oz lace-up" },
  { label: "Closure doctrine", value: "Lace-up only" },
  { label: "Intended use", value: "Training · technical sparring" },
  { label: "Outer material", value: "Top-grain cowhide leather" },
  { label: "Leather thickness", value: "0.9-1.0 mm" },
  { label: "Lining", value: "4-way stretch lining" },
  { label: "Palm", value: "Ventilated palm panel · Integrated grip bar" },
  { label: "Thumb", value: "Attached thumb" },
  { label: "Wrist architecture", value: "Extended lace-up cuff" },
  { label: "Assembly record", value: "Hand-assembled in Pakistan" },
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
    label: "Construction evidence",
    value:
      "Top-grain cowhide, balanced structure, ventilated palm, extended lace-up cuff.",
  },
  {
    label: "Presentation evidence",
    value:
      "Rigid box, silk dust bag, silk wrapping, authenticity card, care card.",
  },
  { label: "Custody evidence", value: "Allocation, delivery, aftercare, and future service retained under one line." },
];
const trustArchitecture = [
  { title: "Correspondence", text: "Private review begins before allocation is prepared." },
  { title: "Placement", text: "Dispatch, destination, and confirmation stay under house control." },
  { title: "Conservation", text: "Aftercare remains attached to the same object record." },
];
const ownershipSignals = [
  { label: "Placement", value: "Held under the client record." },
  { label: "Authenticity", value: "Linked to the object line." },
  { label: "Provenance", value: "Tracked through dispatch and receipt." },
  { label: "Conservation", value: "Retained under ownership history." },
];
const serviceStandards = [
  "Interest enters a retained client reference rather than a disposable funnel.",
  "Follow-up stays direct, private, and connected to future custody.",
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
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;
const brandAssetPaths = {
  wordmark: "/logo-header.png",
  ownershipFaviconMark: "/ownership-favicon-mark.png",
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
  { code: "+262", label: "RÃ©union" },
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
const initialAcquisitionIntakeForm = {
  title: "",
  fullName: "",
  email: "",
  phoneCountryCode: "+52",
  whatsapp: "",
  country: "Mexico",
  interest: "Praeliator VIS",
  timeline: "",
  contactPreference: "",
  collectorIntent: "",
  purchasePurpose: "",
  destinationRegion: "",
  note: "",
};
const initialAcquisitionWhatsAppForm = {
  title: "",
  fullName: "",
  interest: "",
};
const initialTransferReviewDraft: OwnershipTransferReviewDraft = {
  nextCustodianName: "",
  nextCustodianEmail: "",
  intendedTiming: "",
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
  { value: "SeÃ±or", label: "SeÃ±or" },
  { value: "SeÃ±ora", label: "SeÃ±ora" },
  { value: "SeÃ±orita", label: "SeÃ±orita" },
  { value: "å…ˆç”Ÿ", label: "å…ˆç”Ÿ" },
  { value: "å¥³å£«", label: "å¥³å£«" },
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
const acquisitionTitleOptions = titleOptions;
const acquisitionCollectorIntentOptions = [
  { value: "Immediate private acquisition", label: "Immediate acquisition" },
  { value: "Collector placement consideration", label: "Collector placement" },
  { value: "Regional allocation inquiry", label: "Regional allocation" },
  { value: "Future house relationship", label: "Future relationship" },
];
const acquisitionPurposeOptions = [
  { value: "Personal rotation", label: "Personal rotation" },
  { value: "Collector archive", label: "Collector archive" },
  { value: "Gift with continuity", label: "Gift with continuity" },
  { value: "Private training use", label: "Private training use" },
];
type WaitlistFieldName = keyof typeof initialWaitlistForm;
type WaitlistErrors = Partial<Record<WaitlistFieldName, string>>;
type AcquisitionIntakeFieldName = keyof typeof initialAcquisitionIntakeForm;
type AcquisitionIntakeErrors = Partial<
  Record<AcquisitionIntakeFieldName, string>
>;
type AcquisitionWhatsAppFieldName = keyof typeof initialAcquisitionWhatsAppForm;
type AcquisitionWhatsAppErrors = Partial<
  Record<AcquisitionWhatsAppFieldName, string>
>;
type Route =
  | "/"
  | "/praeliator-vis"
  | "/acquisition"
  | "/private-acquisition"
  | "/waitlist"
  | "/contact"
  | "/sign-in"
  | "/sign-up"
  | "/magic-link"
  | "/verify-email"
  | "/forgot-password"
  | "/reset-password"
  | "/ownership-record"
  | "/oauth/consent";
type HeroAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};
type AuthNoticeTone = "success" | "error" | "info";
type AuthNotice = {
  tone: AuthNoticeTone;
  title: string;
  body: string;
};

type RegisteredOwnershipPair = {
  id: string;
  model: string;
  serial: string;
  claimCodeLast4: string;
  deliveryConfirmedAt: string;
  registeredAt: string;
  legacyRefreshEligibleOn: string;
  legacyRefreshEligible: boolean;
  legacyRefreshRequestId?: string | null;
  legacyRefreshRequestStatus?: string | null;
  legacyRefreshRequestedAt?: string | null;
  legacyRefreshNote?: string | null;
};
type OwnershipTransferReviewDraft = {
  nextCustodianName: string;
  nextCustodianEmail: string;
  intendedTiming: string;
  note: string;
};
const PENDING_OTP_SESSION_KEY = "praeliator_pending_otp";
const AUTH_RESEND_SESSION_KEY = "praeliator_auth_resend";
const OAUTH_CONSENT_RETURN_KEY = "praeliator_oauth_return_to";
const WAITLIST_COOLDOWN_MS = 45_000;
const WAITLIST_REQUEST_TIMEOUT_MS = 12_000;
const WAITLIST_COOLDOWN_KEY = "praeliator_waitlist_cooldown_until";
const AUTH_RESEND_COOLDOWN_MS = 60_000;
const WAITLIST_ANALYTICS_EVENT = "praeliator_waitlist_event";
const WAITLIST_HONEYPOT_FIELD = "companyWebsite";
type AuthResendFlow = "sign-up" | "one-time-code" | "forgot-password";
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
const acquisitionRequiredFields: AcquisitionIntakeFieldName[] = [
  "fullName",
  "email",
  "phoneCountryCode",
  "whatsapp",
  "country",
  "interest",
  "timeline",
  "contactPreference",
  "collectorIntent",
  "purchasePurpose",
];
const acquisitionWhatsAppRequiredFields: AcquisitionWhatsAppFieldName[] = [
  "title",
  "fullName",
  "interest",
];
const routeTitles: Record<Route, string> = {
  "/": "Home",
  "/praeliator-vis": "Praeliator VIS",
  "/acquisition": "Acquisition",
  "/private-acquisition": "Private Acquisition",
  "/waitlist": "Waitlist",
  "/contact": "Contact",
  "/sign-in": "Sign In",
  "/sign-up": "Create Account",
  "/magic-link": "One-Time Code",
  "/verify-email": "Verify Email",
  "/forgot-password": "Forgot Password",
  "/reset-password": "Reset Password",
  "/ownership-record": "Ownership Record",
  "/oauth/consent": "OAuth Consent",
};
const routeMicroLabels: Record<Route, string> = {
  "/": "",
  "/praeliator-vis": "VIS",
  "/acquisition": "ACQUISITION",
  "/private-acquisition": "PRIVATE",
  "/waitlist": "WAITLIST",
  "/contact": "CONTACT",
  "/sign-in": "ACCESS",
  "/sign-up": "ACCESS",
  "/magic-link": "ACCESS",
  "/verify-email": "ACCESS",
  "/forgot-password": "ACCESS",
  "/reset-password": "ACCESS",
  "/ownership-record": "OWNERSHIP",
  "/oauth/consent": "ACCESS",
};
const navItems: Array<{ label: string; path: Route }> = [
  { label: "VIS", path: "/praeliator-vis" },
  { label: "Acquisition", path: "/acquisition" },
  { label: "Waitlist", path: "/waitlist" },
  { label: "Contact", path: "/contact" },
];
const pageHeroStats: Record<
  "/praeliator-vis" | "/acquisition" | "/waitlist" | "/contact",
  Array<{ label: string; value: string }>
> = {
  "/praeliator-vis": [
    { label: "Object", value: "Recorded training pair" },
    { label: "Material evidence", value: "Top-grain cowhide" },
    { label: "Use doctrine", value: "Technical sparring" },
    { label: "Record", value: "Serial · card · custody" },
  ],
  "/acquisition": [
    { label: "Method", value: "Private placement" },
    { label: "Review", value: "Qualified correspondence" },
    { label: "Record", value: "Issued reference" },
    { label: "Continuity", value: "Custody · conservation" },
  ],
  "/waitlist": [
    { label: "Register", value: "Future allocation" },
    { label: "Return", value: "Client reference" },
    { label: "Review", value: "House follow-up" },
    { label: "Route", value: "Quiet correspondence" },
  ],
  "/contact": [
    { label: "Primary line", value: "WhatsApp" },
    { label: "House mail", value: "Email" },
    { label: "Public signal", value: "Instagram" },
    { label: "Scope", value: "Private correspondence" },
  ],
};
const acquisitionSteps = [
  {
    step: "01",
    title: "Correspondence",
    text: "The route begins through direct house communication. There is no public purchase surface between the client and the object.",
  },
  {
    step: "02",
    title: "Object line",
    text: "Each qualified inquiry becomes a retained reference with route status, allocation context, and future custody visibility.",
  },
  {
    step: "03",
    title: "Placement review",
    text: "Interest, timing, destination, and availability are clarified before dispatch. Control stays with the house, not a cart.",
  },
  {
    step: "04",
    title: "Custody and conservation",
    text: "Dispatch, confirmation, maintenance, and future service continue under the same object record after acquisition.",
  },
];
const acquisitionPrinciples = [
  {
    title: "No public sale layer",
    text: "The brand does not disappear behind marketplace sequence. The route stays direct from the first exchange.",
  },
  {
    title: "Recorded continuity",
    text: "Correspondence, allocation, dispatch, and future service stay attached to the same object line.",
  },
  {
    title: "Controlled release",
    text: "Access remains qualified and paced. Availability is handled as placement rather than open inventory noise.",
  },
];
const acquisitionModeCards = [
  {
    title: "Direct placement",
    text: "For clients ready to begin private correspondence toward a prepared allocation.",
    action: "Begin correspondence",
  },
  {
    title: "Future register",
    text: "For clients who want future access, collector visibility, or a quieter point of entry.",
    action: "Enter the register",
  },
];
const acquisitionContrasts = [
  {
    title: "Conventional commerce",
    lines: [
      "Open inventory, visible quantity, and public purchase sequencing.",
      "The brand disappears behind platform language and fulfillment logic.",
      "The object arrives without provenance or future custody.",
    ],
  },
  {
    title: "Praeliator acquisition",
    lines: [
      "Correspondence remains direct and the route stays inside the house voice.",
      "Allocation, dispatch, and continuity remain qualified rather than public.",
      "Ownership begins before delivery and continues after acquisition.",
    ],
  },
];
const acquisitionStandards = [
  "No public cart layer between the client and the house.",
  "Qualified review precedes any prepared allocation.",
  "Dispatch, confirmation, and conservation remain under one object line.",
];
const contactChannels = [
  {
    step: "01",
    title: "WhatsApp",
    role: "Primary correspondence",
    text: "The fastest path for private inquiry, immediate clarification, and continued house contact once the route begins.",
  },
  {
    step: "02",
    title: "Email",
    role: "House mail",
    text: "A quieter path for slower communication when correspondence should read more formal and archival.",
  },
  {
    step: "03",
    title: "Instagram",
    role: "Public signal",
    text: "Useful for presence, softer first contact, and brand visibility, but not the primary acquisition line.",
  },
];
const contactPrinciples = [
  {
    title: "No support-center tone",
    text: "The house stays direct. Communication does not collapse into generic help-desk language.",
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
  "Email remains available when a slower and more formal exchange makes more sense.",
  "Instagram remains open for lighter contact, but does not replace the acquisition line.",
];
const contactContrasts = [
  {
    title: "Generic contact",
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
    title: "Direct correspondence",
    text: "For clients ready to begin a private conversation now through the primary house line.",
    action: "Open WhatsApp",
  },
  {
    title: "Future register",
    text: "For clients who want future access or a quieter point of entry before direct continuation.",
    action: "Enter register",
  },
];
const houseArchivePillars = [
  {
    title: "Object authority",
    text: "VIS is treated less like product inventory and more like a resolved training object with a documented standard.",
  },
  {
    title: "Private acquisition",
    text: "Inquiry, review, allocation, and delivery stay under direct house control instead of open commerce logic.",
  },
  {
    title: "Recorded custody",
    text: "Registration, age, service maturity, and future review remain attached to one continuous ownership line.",
  },
  {
    title: "House memory",
    text: "Aftercare is treated as continuation and retention, not generic support once the object has been delivered.",
  },
];
const houseLetterExcerpts = [
  {
    title: "Letter I",
    eyebrow: "House letter",
    body:
      "Praeliator is not trying to look like sports equipment refined by fashion. It is trying to behave like a house that understands the object before it understands the sale.",
    signature: "Praeliator / House note",
  },
  {
    title: "Letter II",
    eyebrow: "Collector note",
    body:
      "The point of the Ownership Record is not storage of data. It is proof that custody, maturity, and aftercare still belong to the same authored system after acquisition.",
    signature: "Private correspondence",
  },
];
const visDossierEntries = [
  {
    label: "Study",
    value: "VIS is resolved as a training object with the calm of an archival piece.",
  },
  {
    label: "Custody",
    value: "Authenticity, presentation, and future aftercare continue under one ownership language.",
  },
  {
    label: "Maturity",
    value: "Legacy Refresh belongs to age and continuity, not a generic service menu.",
  },
];
const visAuthorityStatements = [
  "The silhouette is engineered to read controlled before it reads aggressive.",
  "Materials were chosen to avoid synthetic shine and preserve quiet authority.",
  "Packaging and documentation extend the object system beyond the glove itself.",
  "Aftercare is treated as continuity, not a detached support feature.",
];
const visArchiveSlides = [
  {
    eyebrow: "Silhouette register",
    title: "The line reads resolved before it reads forceful.",
    body: "VIS gains authority through silhouette control rather than exaggeration. The wrist transition, hand chamber, and cuff all belong to one restrained profile.",
    image: visImageSources.hero,
    alt: "Praeliator VIS silhouette study",
    notes: [
      { label: "Profile", value: "Balanced volume with a disciplined taper into the wrist." },
      { label: "Cuff", value: "An extended lace-up cuff that anchors the object visually." },
      { label: "Read", value: "Controlled first, technical second, luxurious throughout." },
    ],
  },
  {
    eyebrow: "Material plate",
    title: "Surface depth matters more than shine.",
    body: "The leather was chosen to feel warm, quiet, and resolved under light. It avoids the synthetic gloss that makes premium sports equipment feel generic.",
    image: visImageSources.leather,
    alt: "Praeliator VIS leather macro",
    notes: [
      { label: "Leather", value: "Top-grain cowhide chosen for depth rather than flash." },
      { label: "Finish", value: "Soft satin with espresso warmth beneath the black." },
      { label: "Tone", value: "Quiet authority instead of coated brightness." },
    ],
  },
  {
    eyebrow: "Construction plate",
    title: "Technical decisions stay inside the same visual language.",
    body: "Palm ventilation, grip bar, thumb attachment, and layered impact structure are treated as part of the object's discipline, not as noisy feature marketing.",
    image: visImageSources.plate,
    alt: "Praeliator VIS logo and construction detail",
    notes: [
      { label: "Padding", value: "A layered stack that reads stable, not swollen." },
      { label: "Palm", value: "Ventilation integrated without breaking the silhouette." },
      { label: "Discipline", value: "Technical seriousness without visual clutter." },
    ],
  },
  {
    eyebrow: "Custody plate",
    title: "Presentation and aftercare extend the object system.",
    body: "Packaging, authenticity, ownership continuity, and future Legacy Refresh are not accessories to the glove. They are part of the full Praeliator object.",
    image: visImageSources.packaging,
    alt: "Praeliator VIS packaging and ownership continuity",
    notes: [
      { label: "Presentation", value: "Rigid box, silk dust bag, and authored documentation." },
      { label: "Custody", value: "Ownership is retained rather than left behind after dispatch." },
      { label: "Aftercare", value: "Legacy Refresh remains tied to maturity and continuity." },
    ],
  },
];
const objectDoctrinePlates = [
  {
    title: "Provenance before possession",
    text: "The pair should be understood before it is acquired: material, silhouette, issue route, and future custody all matter.",
  },
  {
    title: "Materials as evidence",
    text: "Leather, lining, padding, cuff, and presentation are not feature copy. They are the visible proof of the object standard.",
  },
  {
    title: "Conservation after use",
    text: "A Praeliator pair is allowed to age, but never to become anonymous. Service exists to retain continuity.",
  },
  {
    title: "House memory",
    text: "Registration, delivery age, service review, and transfer logic turn ownership into an ongoing record.",
  },
];
const serialPhilosophyMarks = [
  {
    label: "Serial",
    value: "The object receives an identity that can be retained beyond the first owner.",
  },
  {
    label: "Claim code",
    value: "The one-time code turns possession into recorded custody.",
  },
  {
    label: "Certificate",
    value: "The card and digital record agree on the same house line.",
  },
  {
    label: "Delivery date",
    value: "Service maturity follows the recorded delivery date, not the day someone finds the page.",
  },
];
const conservationDoctrine = [
  {
    title: "Clean",
    text: "Surface care preserves the leather without erasing the marks of proper use.",
  },
  {
    title: "Condition",
    text: "The object is reviewed as a retained pair, not as a generic repair item.",
  },
  {
    title: "Refresh",
    text: "Legacy Refresh opens only when the recorded age and service posture justify review.",
  },
];
const certificatePreviewFields = [
  { label: "House line", value: "Ownership Record" },
  { label: "Object identity", value: "Serial · model · issue" },
  { label: "Continuity", value: "Delivery · eligibility · service" },
];
const acquisitionPlacementSignals = [
  {
    title: "Collector intent",
    text: "The route can account for collecting, rotation, long-term use, and future custody rather than forcing every client into one checkout pattern.",
  },
  {
    title: "Regional handling",
    text: "Timing, dispatch route, and destination are considered before allocation is confirmed.",
  },
  {
    title: "Continuity after delivery",
    text: "The acquisition route is designed to feed directly into ownership record and future service rather than ending at dispatch.",
  },
];
const acquisitionConciergeNotes = [
  { label: "Placement", value: "Qualified review before allocation" },
  { label: "Reference", value: "Client line retained after inquiry" },
  { label: "Dispatch", value: "Destination and timing clarified directly" },
  { label: "Aftercare", value: "Ownership remains active after delivery" },
];
const waitlistCollectorSignals = [
  {
    title: "Release signals",
    text: "The waitlist is meant to keep future access orderly when a client is not yet entering direct acquisition.",
  },
  {
    title: "Collector memory",
    text: "Collector interest, timeline, and route preference are remembered as part of the intake line rather than discarded after form submission.",
  },
  {
    title: "House correspondence",
    text: "Follow-up should feel like private correspondence from the house, not automated campaign mail.",
  },
];
const contactResponseStandards = [
  {
    title: "Tone",
    text: "Every reply should sound exact, private, and restrained rather than like a support desk.",
  },
  {
    title: "Hierarchy",
    text: "WhatsApp remains first for active acquisition, while email and Instagram stay quieter secondary routes.",
  },
  {
    title: "Continuation",
    text: "The house should remain visible through the channel itself, not disappear behind generic service language.",
  },
];
const ownershipTransferReviewStandards = [
  "The house reviews continuity before a retained pair changes custody.",
  "Transfer timing, next custodian, and object condition should be stated clearly.",
  "The request begins as review, not automatic reassignment.",
];
const ownershipServiceLedgerLabels = [
  "Registration entered",
  "Delivery age retained",
  "Legacy Refresh state held under record",
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
  "absolute left-0 right-0 top-[calc(100%+0.65rem)] z-30 overflow-hidden rounded-[1.25rem] border border-[#231d18] bg-[#0a0908]/98 shadow-[0_22px_58px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:rounded-[1.45rem]";
const formOptionRowClass =
  "flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition duration-200";
const archiveAuthInputClass =
  "browser-form-element min-h-[3.55rem] w-full rounded-[1.35rem] border border-[#d2c1ab] bg-[rgba(255,250,244,0.86)] px-5 text-[16px] text-[#231b15] shadow-[inset_0_1px_0_rgba(255,255,255,0.56)] outline-none transition-[border-color,background-color,box-shadow,transform] duration-300 placeholder:text-[#8d755c]/68 focus:border-[#a27f59] focus:bg-[#fffaf4] sm:text-sm";
const archiveAuthInputMutedClass = `${archiveAuthInputClass} opacity-80`;
const ownershipLightInputClass =
  "browser-form-element ownership-light-input min-h-[3.55rem] w-full rounded-[1.45rem] border border-[#cdb698] bg-[#fffaf4] px-5 text-[16px] text-[#241b15] caret-[#241b15] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] outline-none transition-[border-color,background-color,box-shadow,transform] duration-300 placeholder:text-[#9a846d] focus:border-[#9c7851] focus:bg-[#fffdf8] focus:text-[#201712] [color-scheme:light] sm:text-sm";
const ownershipLightTextareaClass = `${ownershipLightInputClass} min-h-[12rem] resize-none py-4`;
const archiveAuthPrimaryButtonClass =
  "rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_16px_36px_rgba(45,31,20,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410] disabled:pointer-events-none disabled:opacity-60";
const archiveAuthSecondaryButtonClass =
  "rounded-full border border-[#cdbca7] bg-[rgba(251,245,236,0.78)] px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-60";
const archiveAuthInlineCopyClass = "pt-2 text-sm leading-7 text-[#6a5848]";
const archiveAuthInlineLinkClass =
  "ml-2 text-[#231b15] transition hover:text-[#6f5339]";
const archiveAuthNoticeSurfaceClass =
  "rounded-[1.5rem] border border-[#d8c9b5] bg-[#fbf6ef]/88 p-5";
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
  if (field === "fullName")
    return stage === "change"
      ? normalizeInlineText(value)
      : normalizeFinalText(value);
  if (field === "email")
    return stage === "change"
      ? normalizeEmailInline(value)
      : normalizeEmailFinal(value);
  if (field === "phoneCountryCode") return normalizeDialCode(value);
  if (field === "whatsapp") return normalizePhoneNumber(value);
  if (field === "country")
    return stage === "change"
      ? normalizeInlineText(value)
      : normalizeFinalText(value);
  if (field === "note")
    return stage === "change" ? value.replace(/^\s+/g, "") : value.trim();
  return stage === "change" ? value : value.trim();
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
const normalizeAcquisitionFieldValue = (
  field: AcquisitionIntakeFieldName,
  value: string,
  stage: "change" | "blur" | "submit" = "change",
) => {
  if (field in initialWaitlistForm) {
    return normalizeWaitlistFieldValue(
      field as WaitlistFieldName,
      value,
      stage,
    );
  }
  if (field === "destinationRegion") {
    return stage === "change"
      ? normalizeInlineText(value)
      : normalizeFinalText(value);
  }
  return stage === "change"
    ? value.replace(/^\s+/g, "")
    : value.trim();
};
const normalizeAcquisitionForm = (
  form: typeof initialAcquisitionIntakeForm,
) => ({
  title: normalizeAcquisitionFieldValue("title", form.title, "submit"),
  fullName: normalizeAcquisitionFieldValue("fullName", form.fullName, "submit"),
  email: normalizeAcquisitionFieldValue("email", form.email, "submit"),
  phoneCountryCode: normalizeAcquisitionFieldValue(
    "phoneCountryCode",
    form.phoneCountryCode,
    "submit",
  ),
  whatsapp: normalizeAcquisitionFieldValue("whatsapp", form.whatsapp, "submit"),
  country: normalizeAcquisitionFieldValue("country", form.country, "submit"),
  interest: normalizeAcquisitionFieldValue("interest", form.interest, "submit"),
  timeline: normalizeAcquisitionFieldValue("timeline", form.timeline, "submit"),
  contactPreference: normalizeAcquisitionFieldValue(
    "contactPreference",
    form.contactPreference,
    "submit",
  ),
  collectorIntent: normalizeAcquisitionFieldValue(
    "collectorIntent",
    form.collectorIntent,
    "submit",
  ),
  purchasePurpose: normalizeAcquisitionFieldValue(
    "purchasePurpose",
    form.purchasePurpose,
    "submit",
  ),
  destinationRegion: normalizeAcquisitionFieldValue(
    "destinationRegion",
    form.destinationRegion,
    "submit",
  ),
  note: normalizeAcquisitionFieldValue("note", form.note, "submit"),
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
const validateAcquisitionForm = (
  form: typeof initialAcquisitionIntakeForm,
): AcquisitionIntakeErrors => {
  const normalizedForm = normalizeAcquisitionForm(form);
  const baseErrors = validateWaitlistForm({
    title: normalizedForm.title,
    fullName: normalizedForm.fullName,
    email: normalizedForm.email,
    phoneCountryCode: normalizedForm.phoneCountryCode,
    whatsapp: normalizedForm.whatsapp,
    country: normalizedForm.country,
    interest: normalizedForm.interest,
    timeline: normalizedForm.timeline,
    contactPreference: normalizedForm.contactPreference,
    note: normalizedForm.note,
  });
  const errors: AcquisitionIntakeErrors = { ...baseErrors };

  if (!normalizedForm.collectorIntent) {
    errors.collectorIntent = "Select the collector posture for this inquiry.";
  }
  if (!normalizedForm.purchasePurpose) {
    errors.purchasePurpose = "Select how the pair is meant to be placed.";
  }

  return errors;
};
const validateAcquisitionWhatsAppForm = (
  form: typeof initialAcquisitionWhatsAppForm,
): AcquisitionWhatsAppErrors => {
  const errors: AcquisitionWhatsAppErrors = {};
  const normalizedName = normalizeWaitlistFieldValue(
    "fullName",
    form.fullName,
    "submit",
  );

  if (!form.title.trim()) {
    errors.title = "Select a title.";
  }
  if (!normalizedName) {
    errors.fullName = "Full name is required.";
  } else if (normalizedName.length < 2) {
    errors.fullName = "Enter a valid full name.";
  }
  if (!form.interest.trim()) {
    errors.interest = "Select an interest.";
  }

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

function getReadableErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  if (typeof error === "string" && error.trim()) {
    return error;
  }
  if (error && typeof error === "object") {
    const message =
      "message" in error && typeof error.message === "string"
        ? error.message
        : "error" in error && typeof error.error === "string"
          ? error.error
          : null;
    if (message?.trim()) {
      return message;
    }
  }
  return fallback;
}

function formatOwnershipDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getPairAgeDescriptor(deliveryConfirmedAt: string) {
  const deliveryDate = new Date(deliveryConfirmedAt);
  if (Number.isNaN(deliveryDate.getTime())) {
    return {
      label: "Age pending",
      detail: "The recorded delivery date has not been confirmed yet.",
    };
  }

  const diffMs = Math.max(Date.now() - deliveryDate.getTime(), 0);
  const day = 1000 * 60 * 60 * 24;
  const month = 30;
  const year = 365;
  const diffDays = Math.floor(diffMs / day);

  if (diffDays >= year) {
    const years = Math.floor(diffDays / year);
    const remainingMonths = Math.floor((diffDays % year) / month);
    return {
      label: `${years} year${years === 1 ? "" : "s"}${remainingMonths ? ` ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}` : ""}`,
      detail: "Measured from the recorded delivery date retained under the house.",
    };
  }

  if (diffDays >= month) {
    const months = Math.floor(diffDays / month);
    return {
      label: `${months} month${months === 1 ? "" : "s"}`,
      detail: "Measured from the recorded delivery date retained under the house.",
    };
  }

  return {
    label: `${Math.max(diffDays, 1)} day${diffDays === 1 ? "" : "s"}`,
    detail: "Measured from the recorded delivery date retained under the house.",
  };
}

function getLegacyRefreshEligibleOn(deliveryConfirmedAt: string) {
  const baseDate = new Date(deliveryConfirmedAt);
  if (Number.isNaN(baseDate.getTime())) return new Date().toISOString();
  const eligibleDate = new Date(baseDate);
  eligibleDate.setUTCDate(eligibleDate.getUTCDate() + 365);
  return eligibleDate.toISOString();
}

function formatLegacyRefreshStatus(status?: string | null) {
  switch (status) {
    case "pending_review":
      return "Application received";
    case "under_review":
      return "Under private review";
    case "approved":
      return "Approved for intake";
    case "declined":
      return "Declined";
    case "completed":
      return "Completed";
    case "withdrawn":
      return "Withdrawn";
    default:
      return "No application";
  }
}

function getLegacyRefreshStatusClasses(status?: string | null) {
  switch (status) {
    case "pending_review":
      return "border-[#594726] bg-[#17120b] text-[#d8b87a]";
    case "under_review":
      return "border-[#355067] bg-[#0b131a] text-[#96b7d2]";
    case "approved":
      return "border-[#335238] bg-[#0d1710] text-[#96c09f]";
    case "declined":
      return "border-[#65413a] bg-[#160e0d] text-[#d49b90]";
    case "completed":
      return "border-[#394f33] bg-[#10160e] text-[#a7c593]";
    case "withdrawn":
      return "border-[#4b4540] bg-[#141210] text-[#b7ada4]";
    default:
      return "border-white/10 bg-white/[0.03] text-white/60";
  }
}

function getLegacyRefreshRecordState(pair: RegisteredOwnershipPair) {
  if (pair.legacyRefreshRequestStatus) {
    return {
      label: formatLegacyRefreshStatus(pair.legacyRefreshRequestStatus),
      detail: pair.legacyRefreshRequestedAt
        ? `Entered the house review on ${formatOwnershipDate(pair.legacyRefreshRequestedAt)}.`
        : "Entered the house review under this record.",
      toneClassName: getLegacyRefreshStatusClasses(pair.legacyRefreshRequestStatus),
      emphasis: "review",
    };
  }

  if (pair.legacyRefreshEligible) {
    return {
      label: "Eligible now",
      detail: "Legacy Refresh is now available under the house rules for this pair.",
      toneClassName: "border-[#355238] bg-[#0d1710] text-[#96c09f]",
      emphasis: "open",
    };
  }

  return {
    label: `Eligible on ${formatOwnershipDate(pair.legacyRefreshEligibleOn)}`,
    detail: "Legacy Refresh opens from the recorded delivery date, never the registration date.",
    toneClassName: "border-[#4f443a] bg-[#15120f] text-[#d7c0a0]",
    emphasis: "sealed",
  };
}

function formatClaimSeal(claimCodeLast4: string) {
  return claimCodeLast4 ? `****${claimCodeLast4}` : "Seal pending";
}

type OwnershipEditionTheme = {
  title: string;
  subtitle: string;
  surfaceClassName: string;
  accentBarClassName: string;
  tabClassName: string;
  metaClassName: string;
  panelClassName: string;
  lineClassName: string;
  buttonClassName: string;
};

const ownershipEditionThemes: OwnershipEditionTheme[] = [
  {
    title: "Nocturne Ledger",
    subtitle: "Espresso spine / first-house register",
    surfaceClassName:
      "border-[#d5c3ac] bg-[radial-gradient(circle_at_top_left,rgba(91,63,42,0.14),transparent_34%),linear-gradient(180deg,rgba(251,246,239,0.99),rgba(236,226,213,0.96))]",
    accentBarClassName: "bg-[linear-gradient(180deg,#2d1f17,#7c6046)]",
    tabClassName:
      "border-[#bea485] bg-[#f5e7d5] text-[#745539] shadow-[0_8px_18px_rgba(70,46,27,0.08)]",
    metaClassName: "text-[#7f6248]",
    panelClassName:
      "border-[#dac8b1] bg-[linear-gradient(180deg,rgba(245,236,225,0.96),rgba(238,226,212,0.98))]",
    lineClassName:
      "bg-[linear-gradient(90deg,rgba(166,134,101,0),rgba(166,134,101,0.95),rgba(166,134,101,0))]",
    buttonClassName:
      "bg-[#231b15] text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.18)] hover:bg-[#17110d]",
  },
  {
    title: "Stone Archive",
    subtitle: "Warm parchment / pale-stone custody",
    surfaceClassName:
      "border-[#d8cbbc] bg-[radial-gradient(circle_at_top_left,rgba(126,113,90,0.13),transparent_34%),linear-gradient(180deg,rgba(253,249,243,0.99),rgba(240,234,224,0.97))]",
    accentBarClassName: "bg-[linear-gradient(180deg,#6d6356,#c6b39b)]",
    tabClassName:
      "border-[#c8baa7] bg-[#f6efe4] text-[#746351] shadow-[0_8px_18px_rgba(82,68,54,0.06)]",
    metaClassName: "text-[#766858]",
    panelClassName:
      "border-[#ddd3c5] bg-[linear-gradient(180deg,rgba(248,242,233,0.96),rgba(241,234,224,0.98))]",
    lineClassName:
      "bg-[linear-gradient(90deg,rgba(153,137,117,0),rgba(153,137,117,0.9),rgba(153,137,117,0))]",
    buttonClassName:
      "bg-[#2f271f] text-[#f6eee3] shadow-[0_14px_36px_rgba(47,39,31,0.16)] hover:bg-[#221c16]",
  },
  {
    title: "Aureate Seal",
    subtitle: "Gold-warmed edge / ceremonial custody",
    surfaceClassName:
      "border-[#d8c5a7] bg-[radial-gradient(circle_at_top_left,rgba(192,148,79,0.18),transparent_34%),linear-gradient(180deg,rgba(253,248,240,0.99),rgba(239,228,211,0.96))]",
    accentBarClassName: "bg-[linear-gradient(180deg,#886339,#d8b27a)]",
    tabClassName:
      "border-[#cfb285] bg-[#f6ead9] text-[#8b6537] shadow-[0_8px_18px_rgba(108,74,30,0.08)]",
    metaClassName: "text-[#876746]",
    panelClassName:
      "border-[#dfcfb8] bg-[linear-gradient(180deg,rgba(248,239,225,0.96),rgba(241,229,210,0.98))]",
    lineClassName:
      "bg-[linear-gradient(90deg,rgba(185,144,84,0),rgba(185,144,84,0.9),rgba(185,144,84,0))]",
    buttonClassName:
      "bg-[#302117] text-[#f6eee3] shadow-[0_14px_36px_rgba(48,33,23,0.16)] hover:bg-[#21160f]",
  },
  {
    title: "Ivory Dossier",
    subtitle: "Quiet folio / retained with restraint",
    surfaceClassName:
      "border-[#d7cfc2] bg-[radial-gradient(circle_at_top_left,rgba(194,178,156,0.13),transparent_34%),linear-gradient(180deg,rgba(254,251,246,0.99),rgba(242,236,228,0.97))]",
    accentBarClassName: "bg-[linear-gradient(180deg,#8e7a64,#dfcfbf)]",
    tabClassName:
      "border-[#d2c5b4] bg-[#faf4eb] text-[#7b6957] shadow-[0_8px_18px_rgba(94,78,61,0.06)]",
    metaClassName: "text-[#776958]",
    panelClassName:
      "border-[#e1d7cb] bg-[linear-gradient(180deg,rgba(250,245,237,0.96),rgba(242,235,226,0.98))]",
    lineClassName:
      "bg-[linear-gradient(90deg,rgba(156,138,119,0),rgba(156,138,119,0.88),rgba(156,138,119,0))]",
    buttonClassName:
      "bg-[#342a22] text-[#f6eee3] shadow-[0_14px_36px_rgba(52,42,34,0.16)] hover:bg-[#261e18]",
  },
];

function getOwnershipEditionTheme(
  serial: string,
  index: number,
): OwnershipEditionTheme {
  const seed = serial
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), index);
  return ownershipEditionThemes[seed % ownershipEditionThemes.length];
}

function getOwnershipDisplayName(session: Session | null) {
  const metadataName = session?.user.user_metadata?.full_name;
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  const email = session?.user.email ?? "";
  if (!email) return "Private client";

  const localPart = email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (!localPart) return email;

  return localPart
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getOwnershipRecordReference(userId: string) {
  const normalized = userId.replace(/[^a-z0-9]/gi, "").toUpperCase();
  const leading = normalized.slice(0, 4) || "PRAE";
  const trailing = normalized.slice(-4) || "0001";
  return `OR-${leading}-${trailing}`;
}

function getOwnershipIssuedAt(
  session: Session | null,
  pairs: RegisteredOwnershipPair[],
) {
  const candidates = [
    session?.user.created_at ?? null,
    ...pairs.map((pair) => pair.registeredAt),
    ...pairs.map((pair) => pair.deliveryConfirmedAt),
  ].filter((value): value is string => Boolean(value));

  const validDates = candidates
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime());

  return validDates[0]?.toISOString() ?? null;
}

function getOwnershipServiceLedger(pair: RegisteredOwnershipPair) {
  const recordState = getLegacyRefreshRecordState(pair);

  return [
    {
      label: ownershipServiceLedgerLabels[0],
      date: formatOwnershipDate(pair.registeredAt),
      detail: "The pair was admitted into the Ownership Record under the current client line.",
    },
    {
      label: ownershipServiceLedgerLabels[1],
      date: formatOwnershipDate(pair.deliveryConfirmedAt),
      detail: "Every maturity decision continues from the delivery date retained by the house.",
    },
    {
      label: ownershipServiceLedgerLabels[2],
      date: pair.legacyRefreshRequestStatus
        ? formatOwnershipDate(
            pair.legacyRefreshRequestedAt ?? pair.legacyRefreshEligibleOn,
          )
        : formatOwnershipDate(pair.legacyRefreshEligibleOn),
      detail: recordState.detail,
    },
  ];
}

function getOwnershipHouseCorrespondence({
  clientName,
  latestPair,
  nextPair,
  activeReviewCount,
}: {
  clientName: string;
  latestPair: RegisteredOwnershipPair | null;
  nextPair: RegisteredOwnershipPair | null;
  activeReviewCount: number;
}) {
  const latestPairAge = latestPair
    ? getPairAgeDescriptor(latestPair.deliveryConfirmedAt)
    : null;
  const latestPairState = latestPair
    ? getLegacyRefreshRecordState(latestPair)
    : null;

  return [
    latestPair
      ? {
          eyebrow: "House correspondence / retention",
          title: `${latestPair.serial} has been retained under ${clientName}.`,
          body: `The pair entered the record on ${formatOwnershipDate(
            latestPair.registeredAt,
          )} and continues to mature from the delivery date held by the house. Current age posture: ${latestPairAge?.label}.`,
          signature: "Praeliator / ownership register",
        }
      : {
          eyebrow: "House correspondence / threshold",
          title: "The archive is ready for its first retained pair.",
          body: "Once a real pair enters the Ownership Record, the house begins holding continuity, maturity, and future service against that object rather than leaving ownership in the browser.",
          signature: "Praeliator / ownership register",
        },
    nextPair
      ? {
          eyebrow: "House correspondence / invitation",
          title: `${nextPair.serial} opens toward Legacy Refresh on ${formatOwnershipDate(
            nextPair.legacyRefreshEligibleOn,
          )}.`,
          body: "Legacy Refresh remains governed by maturity, not by the existence of a form. The next invitation appears only when the recorded delivery line has ripened enough under the house rules.",
          signature: "Praeliator / service chamber",
        }
      : {
          eyebrow: "House correspondence / review line",
          title:
            activeReviewCount > 0
              ? `${activeReviewCount} pair${
                  activeReviewCount === 1 ? "" : "s"
                } currently remain under private review.`
              : "No retained pair is under private review right now.",
          body:
            activeReviewCount > 0
              ? "Applications already under review continue through the house without reopening the route as a generic service queue."
              : latestPairState?.detail ||
                "The next correspondence will emerge from retention, maturity, or a future service invitation.",
          signature: "Praeliator / continuity office",
        },
  ];
}

function buildOwnershipCertificateMarkup({
  clientName,
  clientEmail,
  recordReference,
  issuedAt,
  pair,
}: {
  clientName: string;
  clientEmail: string | null;
  recordReference: string;
  issuedAt: string | null;
  pair: RegisteredOwnershipPair | null;
}) {
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  const pairAge = pair ? getPairAgeDescriptor(pair.deliveryConfirmedAt) : null;
  const refreshState = pair ? getLegacyRefreshRecordState(pair) : null;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Praeliator Ownership Record</title>
    <style>
      :root {
        color-scheme: light;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: "Times New Roman", Georgia, serif;
        background:
          radial-gradient(circle at top right, rgba(201, 171, 129, 0.16), transparent 28%),
          linear-gradient(180deg, #f5ecdf 0%, #eadbc7 100%);
        color: #231b15;
      }
      .sheet {
        width: min(980px, calc(100vw - 48px));
        margin: 24px auto;
        border: 1px solid #d3c0a7;
        border-radius: 28px;
        overflow: hidden;
        background:
          linear-gradient(180deg, rgba(252, 247, 241, 0.99), rgba(238, 228, 214, 0.97));
        box-shadow: 0 30px 90px rgba(77, 53, 30, 0.18);
      }
      .rail {
        height: 10px;
        background: linear-gradient(90deg, #86613d, #d5b382);
      }
      .topline {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: space-between;
        padding: 18px 32px;
        border-bottom: 1px solid #d8c9b5;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        font-size: 10px;
        color: #8d755c;
      }
      .content {
        padding: 36px 32px 32px;
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.26em;
        font-size: 11px;
        color: #9f7d58;
      }
      h1 {
        margin: 18px 0 0;
        max-width: 11ch;
        font-size: 64px;
        line-height: 0.84;
        letter-spacing: -0.06em;
        font-weight: 600;
      }
      .lede {
        max-width: 760px;
        margin: 18px 0 0;
        font-size: 16px;
        line-height: 1.9;
        color: #55473b;
      }
      .grid {
        display: grid;
        gap: 18px;
        margin-top: 28px;
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .card {
        border: 1px solid #d8c9b5;
        border-radius: 18px;
        background: rgba(251, 246, 239, 0.94);
        padding: 18px;
      }
      .label {
        text-transform: uppercase;
        letter-spacing: 0.18em;
        font-size: 10px;
        color: #8d755c;
      }
      .value {
        margin-top: 10px;
        font-size: 18px;
        line-height: 1.6;
        color: #231b15;
      }
      .footer {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        justify-content: space-between;
        margin-top: 28px;
        padding-top: 22px;
        border-top: 1px solid #d8c9b5;
      }
      .signature {
        max-width: 420px;
      }
      .signature p {
        margin: 0;
        font-size: 14px;
        line-height: 1.8;
        color: #5b4c40;
      }
      .signature strong {
        display: block;
        margin-top: 14px;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: -0.03em;
        color: #231b15;
      }
      @media print {
        body {
          background: #f5ecdf;
        }
        .sheet {
          width: auto;
          margin: 0;
          box-shadow: none;
        }
      }
    </style>
  </head>
  <body>
    <article class="sheet">
      <div class="rail"></div>
      <div class="topline">
        <span>Praeliator / Ownership Record</span>
        <span>${recordReference}</span>
        <span>Issued ${formatOwnershipDate(issuedAt ?? new Date().toISOString())}</span>
      </div>
      <div class="content">
        <p class="eyebrow">Private certificate of custody</p>
        <h1>Recorded under the house.</h1>
        <p class="lede">
          This document confirms that the pair and its continuity remain attached to the Ownership Record under the Praeliator house line.
        </p>
        <div class="grid">
          <section class="card">
            <p class="label">Client line</p>
            <p class="value">${escapeHtml(clientName)}</p>
          </section>
          <section class="card">
            <p class="label">Client address</p>
            <p class="value">${escapeHtml(clientEmail ?? "Private line retained")}</p>
          </section>
          <section class="card">
            <p class="label">House reference</p>
            <p class="value">${escapeHtml(recordReference)}</p>
          </section>
          <section class="card">
            <p class="label">Retained pair</p>
            <p class="value">${escapeHtml(pair?.serial ?? "Awaiting first retained pair")}</p>
          </section>
          <section class="card">
            <p class="label">Recorded delivery</p>
            <p class="value">${escapeHtml(pair ? formatOwnershipDate(pair.deliveryConfirmedAt) : "Pending record")}</p>
          </section>
          <section class="card">
            <p class="label">Legacy Refresh posture</p>
            <p class="value">${escapeHtml(refreshState?.label ?? "No retained pair under review")}</p>
          </section>
          <section class="card">
            <p class="label">Pair age</p>
            <p class="value">${escapeHtml(pairAge?.label ?? "Age pending")}</p>
          </section>
          <section class="card">
            <p class="label">Claim seal</p>
            <p class="value">${escapeHtml(pair ? formatClaimSeal(pair.claimCodeLast4) : "Seal pending")}</p>
          </section>
          <section class="card">
            <p class="label">Next service threshold</p>
            <p class="value">${escapeHtml(pair ? formatOwnershipDate(pair.legacyRefreshEligibleOn) : "Pending first retention")}</p>
          </section>
        </div>
        <div class="footer">
          <div class="signature">
            <p>
              The object remains recorded with continuity of delivery age, service eligibility, and future review under the same private line.
            </p>
            <strong>Praeliator / House archive</strong>
          </div>
          <div class="signature">
            <p>
              Print or save this certificate as PDF to retain an offline copy of the record at its present state.
            </p>
          </div>
        </div>
      </div>
    </article>
  </body>
</html>`;
}

function OwnershipWatermark({
  className = "",
  opacityClassName = "opacity-[0.07]",
}: {
  className?: string;
  opacityClassName?: string;
}) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <img
        src={brandAssetPaths.headerMonogramMark}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`h-full w-full object-contain mix-blend-multiply ${opacityClassName}`}
      />
    </div>
  );
}

function OwnershipChamberSequence({
  markers,
}: {
  markers: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-3">
      {markers.map((marker, index) => (
        <div
          key={marker.label}
          className="grid gap-3 rounded-[1rem] border border-[#ddd0be] bg-[#f8f1e7] p-3 sm:grid-cols-[auto_1fr]"
        >
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cfbda6] bg-[#fbf6ef] text-[10px] uppercase tracking-[0.18em] text-[#9f7d58]">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#9f7d58]">
              {marker.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#433429]">
              {marker.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OwnershipContinuityTimeline({
  steps,
}: {
  steps: Array<{ step: string; title: string; text: string }>;
}) {
  return (
    <div className="relative grid gap-4">
      <div className="pointer-events-none absolute bottom-4 left-[1.2rem] top-4 w-px bg-[linear-gradient(180deg,rgba(206,188,166,0),rgba(206,188,166,0.95)_14%,rgba(206,188,166,0.95)_86%,rgba(206,188,166,0))]" />
      {steps.map((step) => (
        <div
          key={step.step}
          className="relative grid gap-4 rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4 pl-14"
        >
          <div className="absolute left-[0.65rem] top-4 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#cfbda6] bg-[#f4eadc] text-[10px] uppercase tracking-[0.18em] text-[#9f7d58]">
            {step.step}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#9f7d58]">
              {step.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#433429]">{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function OwnershipServiceLedger({
  pair,
}: {
  pair: RegisteredOwnershipPair;
}) {
  const ledgerEntries = getOwnershipServiceLedger(pair);

  return (
    <div className="rounded-[1.15rem] border border-[#ddd0be] bg-[#fbf6ef]/86 p-4">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
        Service ledger
      </p>
      <div className="mt-4 grid gap-3">
        {ledgerEntries.map((entry) => (
          <div
            key={entry.label}
            className="rounded-[1rem] border border-[#e1d5c6] bg-white/50 p-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
                {entry.label}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#a18467]">
                {entry.date}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#433429]">
              {entry.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OwnershipPairFolio({
  pair,
  index,
  onEnterLegacyRefresh,
  onOpenTransferReview,
  onExportCertificate,
}: {
  pair: RegisteredOwnershipPair;
  index: number;
  onEnterLegacyRefresh: (pair: RegisteredOwnershipPair) => void;
  onOpenTransferReview: (pair: RegisteredOwnershipPair) => void;
  onExportCertificate: (pair: RegisteredOwnershipPair) => void;
}) {
  const editionTheme = getOwnershipEditionTheme(pair.serial, index);
  const hasActiveRequest = Boolean(
    pair.legacyRefreshRequestStatus &&
      !["declined", "withdrawn", "completed"].includes(
        pair.legacyRefreshRequestStatus,
      ),
  );
  const recordState = getLegacyRefreshRecordState(pair);
  const pairAge = getPairAgeDescriptor(pair.deliveryConfirmedAt);
  const serviceSummary = pair.legacyRefreshRequestStatus
    ? `${formatLegacyRefreshStatus(pair.legacyRefreshRequestStatus)}${pair.legacyRefreshRequestedAt ? ` · Requested ${formatOwnershipDate(pair.legacyRefreshRequestedAt)}` : ""}`
    : pair.legacyRefreshEligible
      ? "The invitation may now proceed into private review."
      : `Chamber opens ${formatOwnershipDate(pair.legacyRefreshEligibleOn)}.`;
  const recordLabel = `House mark ${String(index + 1).padStart(2, "0")}`;

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      transition={{ duration: 0.34, ease: easeLuxury }}
      className={`ownership-grain ownership-hairline group relative overflow-hidden rounded-[2rem] border p-5 shadow-[0_18px_42px_rgba(77,53,30,0.08)] sm:p-6 ${editionTheme.surfaceClassName}`}
    >
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-[0.55rem] ${editionTheme.accentBarClassName}`}
      />
      <OwnershipWatermark
        className="right-[-1.5rem] top-[-1.75rem] h-36 w-36 sm:h-44 sm:w-44"
        opacityClassName="opacity-[0.055]"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[40%] bg-[linear-gradient(180deg,rgba(252,247,241,0.72),rgba(244,235,223,0.96))] lg:block" />
      <div
        className={`pointer-events-none absolute inset-x-[8%] top-0 h-px ${editionTheme.lineClassName}`}
      />

      <div className="relative grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <div>
          <div className="flex flex-col gap-4 border-b border-[#dacbb8]/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div
                className={`inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] ${editionTheme.tabClassName}`}
              >
                {editionTheme.title}
              </div>
              <p
                className={`mt-4 text-[10px] uppercase tracking-[0.24em] ${editionTheme.metaClassName}`}
              >
                {recordLabel}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[#7e6751]">
                {pair.model}
              </p>
              <p className="ownership-display mt-4 text-[2.45rem] font-semibold leading-[0.86] tracking-[-0.055em] text-[#231b15]">
                {pair.serial}
              </p>
              <p
                className={`mt-3 text-[11px] uppercase tracking-[0.22em] ${editionTheme.metaClassName}`}
              >
                {editionTheme.subtitle}
              </p>
            </div>
            <div
              className={`inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] ${recordState.toneClassName}`}
            >
              {recordState.label}
            </div>
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#433429]">
            Registered on {formatOwnershipDate(pair.registeredAt)}. Delivery was
            recorded on {formatOwnershipDate(pair.deliveryConfirmedAt)}. {pairAge.detail}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1rem] border border-[#ddd0be] bg-[#fbf6ef]/88 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
                Recorded delivery
              </p>
              <p className="mt-2 text-sm leading-6 text-[#231b15]">
                {formatOwnershipDate(pair.deliveryConfirmedAt)}
              </p>
            </div>
            <div className="rounded-[1rem] border border-[#ddd0be] bg-[#fbf6ef]/88 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
                Pair age
              </p>
              <p className="mt-2 text-sm leading-6 text-[#231b15]">
                {pairAge.label}
              </p>
            </div>
            <div className="rounded-[1rem] border border-[#ddd0be] bg-[#fbf6ef]/88 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
                Claim seal
              </p>
              <p className="mt-2 text-sm leading-6 text-[#231b15]">
                {formatClaimSeal(pair.claimCodeLast4)}
              </p>
            </div>
            <div className="rounded-[1rem] border border-[#ddd0be] bg-[#fbf6ef]/88 p-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
                Eligible on
              </p>
              <p className="mt-2 text-sm leading-6 text-[#231b15]">
                {formatOwnershipDate(pair.legacyRefreshEligibleOn)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div
            className={`rounded-[1.35rem] border p-4 shadow-[0_10px_22px_rgba(77,53,30,0.05)] sm:p-5 ${editionTheme.panelClassName}`}
          >
            <div className="flex flex-col gap-4 border-b border-[#d7c8b5]/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#9f7d58]">
                  Legacy Refresh invitation
                </p>
                <p className="mt-3 text-sm leading-7 text-[#433429]">
                  {pair.legacyRefreshEligible
                    ? "This pair has crossed its recorded threshold. The next step is invitation and private review, never open booking."
                    : "The invitation remains sealed until the recorded maturity date is reached under the house rules."}
                </p>
              </div>

              <div className="text-[11px] uppercase tracking-[0.18em] text-[#7d6a59]">
                {serviceSummary}
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.15rem] border border-[#ddd0be] bg-[#fbf6ef]/86 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
                  Record note
                </p>
                <p className="mt-3 text-sm leading-7 text-[#433429]">
                  {recordState.detail}
                </p>
              </div>
              <div className="rounded-[1.15rem] border border-[#ddd0be] bg-[#fbf6ef]/86 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#8d755c]">
                  Edition note
                </p>
                <p className="mt-3 text-sm leading-7 text-[#433429]">
                  {editionTheme.subtitle}. The house keeps each line distinct so
                  repeated folios still feel singular in the archive.
                </p>
              </div>
              <OwnershipServiceLedger pair={pair} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6a59]">
              Invitation state: {serviceSummary}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              {pair.legacyRefreshEligible && !hasActiveRequest ? (
                <Button
                  type="button"
                  onClick={() => onEnterLegacyRefresh(pair)}
                  className={`rounded-full px-7 py-6 text-sm transition duration-500 hover:-translate-y-0.5 ${editionTheme.buttonClassName}`}
                >
                  Open Legacy Refresh Invitation
                </Button>
              ) : pair.legacyRefreshEligible ? (
                <div
                  className={`inline-flex rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.22em] ${getLegacyRefreshStatusClasses(pair.legacyRefreshRequestStatus)}`}
                >
                  {formatLegacyRefreshStatus(pair.legacyRefreshRequestStatus)}
                </div>
              ) : (
                <div className="inline-flex rounded-full border border-[#cdbca7] bg-[#fbf6ef] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#7d6753]">
                  Opens {formatOwnershipDate(pair.legacyRefreshEligibleOn)}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onExportCertificate(pair)}
                className="rounded-full border-[#cdbca7] bg-transparent px-5 py-5 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7]"
              >
                Export Certificate
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenTransferReview(pair)}
                className="rounded-full border-[#cdbca7] bg-transparent px-5 py-5 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7]"
              >
                Review Transfer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LegacyRefreshChamberDialog({
  pair,
  note,
  error,
  submitting,
  onNoteChange,
  onClose,
  onSubmit,
}: {
  pair: RegisteredOwnershipPair;
  note: string;
  error: string | null;
  submitting: boolean;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [stage, setStage] = useState<"invitation" | "review">("invitation");
  const recordState = getLegacyRefreshRecordState(pair);
  const pairAge = getPairAgeDescriptor(pair.deliveryConfirmedAt);
  const editionTheme = getOwnershipEditionTheme(pair.serial, 0);

  useEffect(() => {
    setStage("invitation");
  }, [pair.id]);

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, submitting]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[180] bg-[radial-gradient(circle_at_top,rgba(214,186,149,0.2),transparent_28%),rgba(26,18,12,0.72)] backdrop-blur-[16px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26, ease: easeLuxury }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.995 }}
        transition={{ duration: 0.34, ease: easeLuxury }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`legacy-refresh-title-${pair.id}`}
        className={`ownership-grain relative h-[100svh] w-screen overflow-hidden rounded-none border-0 text-[#231b15] shadow-[0_44px_140px_rgba(53,34,20,0.24)] ${editionTheme.surfaceClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-[0.7rem] ${editionTheme.accentBarClassName}`}
        />
        <OwnershipWatermark
          className="right-[-2.5rem] top-[-2.5rem] h-44 w-44 sm:h-56 sm:w-56"
          opacityClassName="opacity-[0.055]"
        />
        <div className="relative flex h-full min-h-0 flex-col">
          <div className="relative z-10 border-b border-[#d9c7b0] bg-[rgba(250,244,236,0.9)] px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#8f6e4c]">
                  Legacy Refresh chamber
                </p>
                <p className="mt-2 text-sm leading-6 text-[#3f3126]">
                  Full review environment for {pair.serial}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full border border-[#ccb89d] bg-[#fff8ef] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[#3f3126] transition duration-300 hover:border-[#b69b7d] hover:bg-[#f8eee1] disabled:pointer-events-none disabled:opacity-60"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto overscroll-contain lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative border-b border-[#d8c9b5] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
              Legacy Refresh invitation
            </p>
            <div
              className={`mt-4 inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] ${editionTheme.tabClassName}`}
            >
              {editionTheme.title}
            </div>
            <h3
              id={`legacy-refresh-title-${pair.id}`}
              className="ownership-display mt-4 text-[2.95rem] font-semibold leading-[0.82] tracking-[-0.055em] text-[#231b15]"
            >
              {pair.serial}
            </h3>
            <div
              className={`mt-5 inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] ${recordState.toneClassName}`}
            >
              {recordState.label}
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#433429]">
              A Legacy Refresh opening is an invitation to consideration, not an
              instant booking. The house reviews condition, age, timing, and
              continuity before intake is confirmed.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                  Pair age
                </p>
                <p className="mt-3 text-sm leading-7 text-[#231b15]">
                  {pairAge.label}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                  Delivery recorded
                </p>
                <p className="mt-3 text-sm leading-7 text-[#231b15]">
                  {formatOwnershipDate(pair.deliveryConfirmedAt)}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                  Chamber opened
                </p>
                <p className="mt-3 text-sm leading-7 text-[#231b15]">
                  {formatOwnershipDate(pair.legacyRefreshEligibleOn)}
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {stage === "invitation" ? (
                <motion.div
                  key="invitation"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: easeLuxury }}
                  className="grid gap-5"
                >
                  <div className="rounded-[1.7rem] border border-[#dbcab5] bg-[linear-gradient(180deg,rgba(251,245,238,0.98),rgba(242,232,219,0.98))] p-6 text-center shadow-[0_18px_44px_rgba(77,53,30,0.08)] sm:p-8">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#d4c19f] bg-[radial-gradient(circle_at_top,rgba(255,252,245,0.95),rgba(240,229,214,0.96))] shadow-[0_14px_34px_rgba(77,53,30,0.08)]">
                      <img
                        src={brandAssetPaths.ownershipFaviconMark}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        className="h-12 w-12 object-contain opacity-90"
                      />
                    </div>
                    <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-[#9f7d58]">
                      Private opening
                    </p>
                    <h4 className="ownership-display mt-4 text-[2.35rem] font-semibold leading-[0.86] tracking-[-0.05em] text-[#231b15]">
                      Legacy Refresh is now willing to hear this pair.
                    </h4>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#433429]">
                      Proceed only if the pair is ready to be considered under the
                      house line. What follows is a request for review, not a
                      transaction.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        label: "01",
                        title: "Invitation",
                        text: "The pair has crossed its recorded threshold and the chamber may now open.",
                      },
                      {
                        label: "02",
                        title: "Private review",
                        text: "Condition, timing, and continuity are considered before intake is accepted.",
                      },
                      {
                        label: "03",
                        title: "House return",
                        text: "If approved, the work remains tied to the same Ownership Record throughout.",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.3rem] border border-[#dbcab5] bg-[#fbf6ef] p-4"
                      >
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#9f7d58]">
                          {item.label}
                        </p>
                        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#7d6a59]">
                          {item.title}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#433429]">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button
                      type="button"
                      onClick={() => setStage("review")}
                      className={`rounded-full px-7 py-6 text-sm transition duration-500 hover:-translate-y-0.5 ${editionTheme.buttonClassName}`}
                    >
                      Continue into Private Review
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={submitting}
                      className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-60"
                    >
                      Return to Record
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="review"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: easeLuxury }}
                  className="grid gap-4"
                  onSubmit={onSubmit}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#9f7d58]">
                        Private review statement
                      </p>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-[#433429]">
                        Use the note only for meaningful context: current
                        condition, travel history, desired timing, or anything
                        the house should understand before review begins.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStage("invitation")}
                      className="text-[11px] uppercase tracking-[0.22em] text-[#5f4a39] transition hover:text-[#231b15]"
                    >
                      Invitation
                    </button>
                  </div>

                  <div className="rounded-[1.35rem] border border-[#dbcab5] bg-[#fbf6ef] p-5">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#9f7d58]">
                      What the house considers
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#433429]">
                      The record, current condition, intended timing, and the
                      continuity of the pair under the house line.
                    </p>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                      Context for review
                    </span>
                    <textarea
                      name="legacyRefreshNote"
                      value={note}
                      onChange={(event) =>
                        onNoteChange(event.target.value.slice(0, 500))
                      }
                      className={ownershipLightTextareaClass}
                      placeholder="Condition, timing, or context for private review."
                      maxLength={500}
                    />
                  </label>

                  <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[#7d6a59]">
                    <span>{note.length}/500</span>
                    <span>House review</span>
                  </div>

                  <div className="rounded-[1.25rem] border border-[#d7c8b5] bg-[linear-gradient(180deg,rgba(248,240,228,0.96),rgba(241,230,216,0.98))] p-4">
                    <p className="text-sm leading-7 text-[#433429]">
                      Submission enters private review under the same Ownership
                      Record. Approval, decline, and completion remain visible on
                      this pair's line.
                    </p>
                  </div>

                  {error ? (
                    <p className="text-sm leading-6 text-[#a25d50]">{error}</p>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className={`rounded-full px-7 py-6 text-sm transition duration-500 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 ${editionTheme.buttonClassName}`}
                    >
                      {submitting
                        ? "Entering private review..."
                        : "Enter Private Review"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={submitting}
                      className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-60"
                    >
                      Close chamber
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function TransferReviewChamberDialog({
  pair,
  draft,
  error,
  submitting,
  onDraftChange,
  onClose,
  onSubmit,
}: {
  pair: RegisteredOwnershipPair;
  draft: OwnershipTransferReviewDraft;
  error: string | null;
  submitting: boolean;
  onDraftChange: (
    field: keyof OwnershipTransferReviewDraft,
    value: string,
  ) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const editionTheme = getOwnershipEditionTheme(pair.serial, 1);
  const pairAge = getPairAgeDescriptor(pair.deliveryConfirmedAt);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[160] flex items-end justify-center bg-[rgba(29,21,15,0.42)] px-3 pb-3 pt-12 backdrop-blur-[10px] sm:items-center sm:px-6 sm:py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26, ease: easeLuxury }}
      onClick={() => {
        if (submitting) return;
        onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.985 }}
        transition={{ duration: 0.34, ease: easeLuxury }}
        className={`ownership-grain relative max-h-[calc(100svh-1.5rem)] w-full max-w-[72rem] overflow-hidden rounded-[2rem] border text-[#231b15] shadow-[0_44px_140px_rgba(53,34,20,0.24)] sm:max-h-[calc(100svh-3rem)] sm:rounded-[2.2rem] ${editionTheme.surfaceClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 w-[0.65rem] ${editionTheme.accentBarClassName}`}
        />
        <OwnershipWatermark
          className="right-[-2.25rem] top-[-2.25rem] h-44 w-44 sm:h-56 sm:w-56"
          opacityClassName="opacity-[0.05]"
        />
        <div className="grid max-h-[calc(100svh-1.5rem)] gap-0 overflow-y-auto overscroll-contain sm:max-h-[calc(100svh-3rem)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative border-b border-[#d8c9b5] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
              Transfer review chamber
            </p>
            <div
              className={`mt-4 inline-flex rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] ${editionTheme.tabClassName}`}
            >
              Continuity review
            </div>
            <h3 className="ownership-display mt-4 text-[2.9rem] font-semibold leading-[0.82] tracking-[-0.055em] text-[#231b15]">
              {pair.serial}
            </h3>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#55473b]">
              A retained pair does not change custody automatically. The house
              reviews continuity, timing, and the identity of the next line
              before a transfer is acknowledged.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                  Pair age
                </p>
                <p className="mt-3 text-sm leading-7 text-[#231b15]">
                  {pairAge.label}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                  Delivery recorded
                </p>
                <p className="mt-3 text-sm leading-7 text-[#231b15]">
                  {formatOwnershipDate(pair.deliveryConfirmedAt)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {ownershipTransferReviewStandards.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                    Review {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#5b4c40]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form
            className="relative grid gap-4 p-6 sm:p-8"
            onSubmit={onSubmit}
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9f7d58]">
                Private review letter
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#5b4c40]">
                This submission enters a structured transfer-review brief into
                the private record so the continuity request remains authored,
                retained, and reviewable under the house.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                  Next custodian
                </span>
                <input
                  type="text"
                  value={draft.nextCustodianName}
                  onChange={(event) =>
                    onDraftChange("nextCustodianName", event.target.value)
                  }
                      className={ownershipLightInputClass}
                  placeholder="Full name"
                  autoComplete="name"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                  Next custodian email
                </span>
                <input
                  type="email"
                  value={draft.nextCustodianEmail}
                  onChange={(event) =>
                    onDraftChange("nextCustodianEmail", event.target.value)
                  }
                      className={ownershipLightInputClass}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                Intended timing
              </span>
              <input
                type="text"
                value={draft.intendedTiming}
                onChange={(event) =>
                  onDraftChange("intendedTiming", event.target.value)
                }
                className={ownershipLightInputClass}
                placeholder="Within 30 days / after review / future only"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                Continuity note
              </span>
              <textarea
                value={draft.note}
                onChange={(event) =>
                  onDraftChange("note", event.target.value.slice(0, 500))
                }
                className={`${ownershipLightTextareaClass} min-h-[10rem]`}
                placeholder="Object condition, provenance, or any continuity detail the house should review."
                maxLength={500}
              />
            </label>

            <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-[#7d6a59]">
              <span>{draft.note.length}/500</span>
              <span>Prepared for house review</span>
            </div>

            <div className="rounded-[1.35rem] border border-[#dbcab5] bg-[linear-gradient(180deg,rgba(248,240,228,0.96),rgba(241,230,216,0.98))] p-4">
              <p className="text-sm leading-7 text-[#5b4c40]">
                Submission creates a real house review record. The request is
                logged under a reference before continuation ever reaches direct
                correspondence.
              </p>
            </div>

            {error ? (
              <p className="text-sm leading-6 text-[#a25d50]">{error}</p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                type="submit"
                disabled={submitting}
                className={`rounded-full px-7 py-6 text-sm transition duration-500 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60 ${editionTheme.buttonClassName}`}
              >
                {submitting ? "Entering review..." : "Enter Transfer Review"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
                className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-60"
              >
                Return to Record
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function mapOwnershipRow(
  row: {
    id: string;
    model: string | null;
    serial: string;
    claim_code_last4: string | null;
    delivery_confirmed_at: string;
    current_owner_claimed_at: string | null;
  },
  request?: {
    id: string;
    status: string | null;
    requested_at: string;
    note: string | null;
  } | null,
): RegisteredOwnershipPair {
  const legacyRefreshEligibleOn = getLegacyRefreshEligibleOn(row.delivery_confirmed_at);
  return {
    id: row.id,
    model: row.model || "Praeliator VIS",
    serial: row.serial,
    claimCodeLast4: row.claim_code_last4 || "",
    deliveryConfirmedAt: row.delivery_confirmed_at,
    registeredAt: row.current_owner_claimed_at || row.delivery_confirmed_at,
    legacyRefreshEligibleOn,
    legacyRefreshEligible: Date.now() >= new Date(legacyRefreshEligibleOn).getTime(),
    legacyRefreshRequestId: request?.id ?? null,
    legacyRefreshRequestStatus: request?.status ?? null,
    legacyRefreshRequestedAt: request?.requested_at ?? null,
    legacyRefreshNote: request?.note ?? null,
  };
}
function normalizePath(pathname: string): Route {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (
    clean === "/" ||
    clean === "/praeliator-vis" ||
    clean === "/acquisition" ||
    clean === "/private-acquisition" ||
    clean === "/waitlist" ||
    clean === "/contact" ||
    clean === "/sign-in" ||
    clean === "/sign-up" ||
    clean === "/magic-link" ||
    clean === "/verify-email" ||
    clean === "/forgot-password" ||
    clean === "/reset-password" ||
    clean === "/ownership-record" ||
    clean === "/oauth/consent"
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

function HouseLetterCard({
  eyebrow,
  title,
  body,
  signature,
  className = "",
}: {
  eyebrow: string;
  title: string;
  body: string;
  signature: string;
  className?: string;
}) {
  return (
    <div
      className={`ownership-grain relative overflow-hidden rounded-[1.8rem] border border-[#d8c9b5] bg-[linear-gradient(180deg,rgba(251,246,239,0.98),rgba(238,228,214,0.96))] p-6 text-[#231b15] shadow-[0_20px_48px_rgba(77,53,30,0.1)] sm:p-7 ${className}`}
    >
      <OwnershipWatermark
        className="right-[-1.5rem] top-[-1.5rem] h-28 w-28 sm:h-36 sm:w-36"
        opacityClassName="opacity-[0.04]"
      />
      <div className="relative">
        <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7d58]">
          {eyebrow}
        </p>
        <h3 className="ownership-display mt-4 max-w-[12ch] text-[2.4rem] font-semibold leading-[0.86] tracking-[-0.05em] text-[#231b15] sm:text-[2.9rem]">
          {title}
        </h3>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#433429] sm:text-base sm:leading-8">
          {body}
        </p>
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#7d6753]">
          {signature}
        </p>
      </div>
    </div>
  );
}
function videoPathToAnimatedImagePath(video?: string) {
  if (!video) return undefined;
  return video.replace(/\.mp4(\?.*)?$/i, ".avif$1");
}
function getVideoFallbackImage(video?: string, fallback?: string) {
  return videoPathToAnimatedImagePath(video) ?? fallback;
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
  const [usePhoneAnimatedImage, setUsePhoneAnimatedImage] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px) and (pointer: coarse)");
    const update = () => setUsePhoneAnimatedImage(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.("change", update);
    return () => mediaQuery.removeEventListener?.("change", update);
  }, []);
  const animatedImage = videoPathToAnimatedImagePath(video);
  const shouldUseAnimatedImage = Boolean(usePhoneAnimatedImage && animatedImage);
  const fallbackImage = getVideoFallbackImage(video, src);
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#11100f] shadow-[0_32px_90px_rgba(0,0,0,0.38)] ${className}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${fallbackImage})` }}
        aria-label={alt}
        role="img"
      />
      {shouldUseAnimatedImage ? (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={animatedImage}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={fallbackImage}
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
  privateInquiryLabel,
  waitlistLabel,
  navLinks,
}: {
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
  privateInquiryLabel: string;
  waitlistLabel: string;
  navLinks: Array<{ label: string; path: Route }>;
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
                    {privateInquiryLabel}
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goTo("/waitlist")}
                  className="rounded-full border-white/15 bg-transparent px-6 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                >
                  {waitlistLabel}
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
                      {(column.title === "Explore" ? navLinks : column.links).map((item) => (
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

function MobileHeroMediaBackdrop({
  media,
}: {
  media: {
    image: string;
    alt: string;
    video?: string;
  };
}) {
  const [usePhoneAnimatedImage, setUsePhoneAnimatedImage] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px) and (pointer: coarse)");
    const update = () => setUsePhoneAnimatedImage(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.("change", update);
    return () => mediaQuery.removeEventListener?.("change", update);
  }, []);

  const animatedImage = videoPathToAnimatedImagePath(media.video);
  const shouldUseAnimatedImage = Boolean(usePhoneAnimatedImage && animatedImage);
  const fallbackImage = getVideoFallbackImage(media.video, media.image);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050505]">
      <div
        className="absolute inset-0 scale-[1.035] bg-cover bg-center"
        style={{ backgroundImage: `url(${fallbackImage})` }}
        aria-label={media.alt}
        role="img"
      />
      {shouldUseAnimatedImage ? (
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={animatedImage}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      ) : media.video ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={fallbackImage}
          preload="metadata"
        >
          <source src={media.video} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.28)_38%,rgba(0,0,0,0.72)_78%,rgba(0,0,0,0.9))]" />
      <div className="absolute inset-x-0 top-0 h-[42svh] bg-[linear-gradient(180deg,rgba(3,3,3,0.88),rgba(3,3,3,0.34),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-[58svh] bg-[linear-gradient(180deg,transparent,rgba(3,3,3,0.28),rgba(3,3,3,0.94))]" />
    </div>
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
  const actionButtons = (
    <div className="mt-7 flex flex-col gap-3">
      {actions.map((action) =>
        action.href ? (
          <Button
            key={action.label}
            asChild
            variant={action.variant === "secondary" ? "outline" : undefined}
            className={
              action.variant === "secondary"
                ? "h-[3.85rem] rounded-full border-white/14 bg-white/[0.025] px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                : "h-[3.85rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_16px_42px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
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
                ? "h-[3.85rem] rounded-full border-white/14 bg-white/[0.025] px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                : "h-[3.85rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_16px_42px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
            }
          >
            {action.label}
          </Button>
        ),
      )}
    </div>
  );

  const statRail = stats && stats.length ? (
    <div className="-mx-6 mt-7 flex gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {stats.map((item, index) => (
        <Reveal key={`${item.label}-${index}`} delay={0.05 * index}>
          <div className="min-w-[10.8rem] rounded-[1.35rem] border border-white/[0.09] bg-white/[0.025] p-4 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
              {item.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/78">
              {item.value}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  ) : null;

  if (media) {
    return (
      <section className="relative isolate min-h-[92svh] overflow-hidden bg-[#050505]">
        <MobileHeroMediaBackdrop media={media} />
        <Container className="relative z-10 flex min-h-[92svh] items-end pb-7 pt-[6.4rem]">
          <Reveal className="w-full">
            <div className="max-w-[21rem]">
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#d0b39b]">
                {media.badge || eyebrow}
              </p>
              {media.overlayTitle ? (
                <p className="mt-4 max-w-[15rem] text-[0.78rem] uppercase leading-5 tracking-[0.24em] text-white/54">
                  {media.overlayTitle}
                </p>
              ) : null}
              <h1 className="ownership-display mt-5 max-w-[10.5ch] text-[3.45rem] font-semibold leading-[0.78] tracking-[-0.075em] text-[#f4efe7]">
                {title}
              </h1>
              <p className="mt-6 max-w-[20rem] text-[0.98rem] leading-7 text-white/74">
                {description}
              </p>
              {note ? (
                <p className="mt-5 max-w-[18rem] text-[10px] uppercase leading-5 tracking-[0.24em] text-white/44">
                  {note}
                </p>
              ) : null}
            </div>
            {actionButtons}
            {statRail}
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden pb-8 pt-[6.2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(188,151,122,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(77,52,32,0.18),transparent_42%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(0,0,0,0.82),rgba(0,0,0,0.18),transparent)]" />
      <Container className="relative">
        <div className="border-y border-white/[0.11] py-8">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#b9a18d]">
            {eyebrow}
          </p>
          <h1 className="ownership-display mt-4 max-w-[10.8ch] text-[3.15rem] font-semibold leading-[0.8] tracking-[-0.072em] text-[#f4efe7]">
            {title}
          </h1>
          <p className="mt-5 max-w-[34rem] text-[0.98rem] leading-7 text-white/70">
            {description}
          </p>
          {note ? (
            <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-white/44">
              {note}
            </p>
          ) : null}
          {actionButtons}
          {statRail}
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
    <section className="relative py-8">
      <Container>
        <div className="relative border-y border-white/[0.11] py-7">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(214,186,149,0.62),transparent)]" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-[#b9a18d]">
              {eyebrow}
            </p>
            <h2 className="ownership-display mt-4 max-w-[11.5ch] text-[2.75rem] font-semibold leading-[0.84] tracking-[-0.065em] text-[#f4efe7]">
              {title}
            </h2>
            {description ? (
              <p className="mt-5 text-[0.96rem] leading-7 text-white/68">{description}</p>
            ) : null}
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MobileEditorialLedger({
  items,
  numbered = false,
}: {
  items: Array<{ title: string; text: string }>;
  numbered?: boolean;
}) {
  return (
    <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {items.map((item, index) => (
        <Reveal key={`${item.title}-${index}`} delay={0.035 * index}>
          <div className="py-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
              {numbered ? `${String(index + 1).padStart(2, "0")} / ` : ""}
              {item.title}
            </p>
            <p className="mt-3 text-[0.95rem] leading-7 text-white/68">
              {item.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
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
    <section className="relative overflow-hidden pb-10 pt-7">
      <Container>
        <div className="rounded-[2.1rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(14,12,11,0.9),rgba(6,6,6,0.98))] p-6 shadow-[0_34px_100px_rgba(0,0,0,0.36)]">
          <div className="text-center">
            <img
              src="/logo-header.png"
              alt="Praeliator"
              className="mx-auto h-14 w-auto object-contain opacity-95"
            />
            <p className="mt-4 text-[10px] uppercase tracking-[0.32em] text-[#b9a18d]">
              House route
            </p>
            <p className="ownership-display mx-auto mt-3 max-w-[11ch] text-[2.35rem] font-semibold leading-[0.86] tracking-[-0.06em] text-[#f4efe7]">
              The object continues here.
            </p>
          </div>

          <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
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
                className="flex w-full items-center justify-between py-4 text-left text-sm uppercase tracking-[0.14em] text-white/82 transition duration-500 hover:text-white"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-white/30" />
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.45rem] border border-white/[0.08] bg-white/[0.025] p-5">
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

function OtpCodeField({
  value,
  onChange,
  length = 6,
  disabled = false,
  tone = "midnight",
}: {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  disabled?: boolean;
  tone?: "midnight" | "archive";
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [focused, setFocused] = useState(false);
  const normalized = value.replace(/\D/g, "").slice(0, length);
  const activeIndex = Math.min(normalized.length, length - 1);
  const archiveTone = tone === "archive";

  return (
    <div className="grid gap-3">
      <div
        onClick={() => inputRef.current?.focus()}
        className="relative cursor-text"
      >
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={length}
          disabled={disabled}
          value={normalized}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, length))}
          className="absolute inset-0 h-full w-full opacity-0"
          aria-label="One-time code"
        />
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {Array.from({ length }).map((_, index) => {
            const isActive = focused && index === activeIndex;
            const hasValue = Boolean(normalized[index]);
            return (
              <div
                key={index}
                className={`flex h-[4.4rem] items-center justify-center rounded-[0.95rem] border text-center font-[Arial,Helvetica,sans-serif] text-[1.45rem] font-semibold tracking-[0.08em] transition duration-300 sm:h-[4.9rem] sm:text-[1.7rem] ${
                  hasValue
                    ? archiveTone
                      ? "border-[#cdbca7] bg-[#fffaf4] text-[#231b15] shadow-[0_10px_26px_rgba(77,53,30,0.08)]"
                      : "border-[#d9cbbb] bg-[#0d0c0b] text-[#f4efe7] shadow-[0_10px_26px_rgba(0,0,0,0.16)]"
                    : isActive
                      ? archiveTone
                        ? "border-[#a27f59] bg-[#fffaf4] text-[#231b15] shadow-[0_0_0_1px_rgba(162,127,89,0.12),0_12px_28px_rgba(77,53,30,0.1)]"
                        : "border-[#efe5d7] bg-[#0f0e0d] text-[#f4efe7] shadow-[0_0_0_1px_rgba(239,229,215,0.16),0_12px_28px_rgba(0,0,0,0.18)]"
                      : archiveTone
                        ? "border-[#d7c8b5] bg-[#f7f1e8] text-[#b39c83]"
                        : "border-white/[0.08] bg-[#090909] text-white/28"
                }`}
              >
                {normalized[index] || ""}
              </div>
            );
          })}
        </div>
      </div>
      <p
        className={`text-[11px] uppercase tracking-[0.16em] ${
          archiveTone ? "text-[#7a6756]" : "text-white/34"
        }`}
      >
        Enter one digit at a time. Paste also works.
      </p>
    </div>
  );
}

function OAuthConsentRoute({
  authInitialized,
  authSession,
  goTo,
}: {
  authInitialized: boolean;
  authSession: Session | null;
  goTo: (nextRoute: Route) => void;
}) {
  const [authorizationId, setAuthorizationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [notice, setNotice] = useState<AuthNotice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const current = `${window.location.pathname}${window.location.search}`;
    window.sessionStorage.setItem(OAUTH_CONSENT_RETURN_KEY, current);
    const params = new URLSearchParams(window.location.search);
    setAuthorizationId(params.get("authorization_id") || "");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadAuthorization = async () => {
      if (!authInitialized) return;
      if (!authorizationId) {
        setNotice({
          tone: "error",
          title: "Authorization unavailable",
          body: "The authorization request is missing its identifier. Return to the requesting application and begin again.",
        });
        return;
      }
      if (!authSession) {
        setNotice({
          tone: "info",
          title: "Sign in required",
          body: "This authorization request can only be reviewed after you sign in under the house.",
        });
        return;
      }
      const oauthApi = (supabase?.auth as any)?.oauth;
      if (!supabase || !oauthApi?.getAuthorizationDetails) {
        setNotice({
          tone: "error",
          title: "OAuth consent is not configured",
          body: "Enable the OAuth server methods in Supabase before this consent route can continue.",
        });
        return;
      }

      setLoading(true);
      setNotice(null);
      try {
        const { data, error } = await oauthApi.getAuthorizationDetails(authorizationId);
        if (error) {
          setNotice({
            tone: "error",
            title: "Authorization unavailable",
            body: error.message,
          });
          return;
        }
        if (!cancelled) setDetails(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadAuthorization();
    return () => {
      cancelled = true;
    };
  }, [authInitialized, authSession, authorizationId]);

  const scopes: string[] = String(details?.scope || "")
    .split(/\s+/)
    .map((scope: string) => scope.trim())
    .filter(Boolean);

  const requestedAppName =
    details?.client?.client_name ||
    details?.client?.name ||
    details?.client_name ||
    details?.name ||
    "Connected application";

  const requestedRedirectUri =
    details?.client?.redirect_uris?.[0] ||
    details?.redirect_uri ||
    details?.client?.redirect_uri ||
    null;

  const handleDecision = async (decision: "approve" | "deny") => {
    const oauthApi = (supabase?.auth as any)?.oauth;
    if (!supabase || !oauthApi || !authorizationId) return;
    setLoading(true);
    setNotice(null);
    try {
      const action = decision === "approve" ? oauthApi.approveAuthorization : oauthApi.denyAuthorization;
      const { data, error } = await action(authorizationId);
      if (error) {
        setNotice({
          tone: "error",
          title: decision === "approve" ? "Approval unavailable" : "Authorization could not be denied",
          body: error.message,
        });
        return;
      }
      if (typeof window !== "undefined" && data?.redirect_to) {
        window.sessionStorage.removeItem(OAUTH_CONSENT_RETURN_KEY);
        window.location.assign(data.redirect_to);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.12),transparent_34%)]" />
      <Container className="relative">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <Reveal className="flex">
            <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,13,12,0.96),rgba(10,9,8,0.94))] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.38)] sm:p-8 lg:p-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">OAuth</p>
                <h1 className="mt-5 text-4xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-5xl">Review authorization request.</h1>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  This route reviews what a connected application is requesting from your Praeliator identity before access is granted or denied.
                </p>
              </div>
              <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">Authorization path</p>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  Configured at <span className="text-white/82">/oauth/consent</span>. Supabase redirects third-party apps here with an <span className="text-white/82">authorization_id</span> so consent can be reviewed inside the house.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,16,15,0.84),rgba(12,11,10,0.9))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
              {notice ? (
                <div className="mb-5">
                  <AuthStatusNotice notice={notice} />
                </div>
              ) : null}

              {!authSession ? (
                <div className="grid gap-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">Private access required</p>
                    <p className="mt-3 text-sm leading-7 text-white/62">
                      Sign in before reviewing this authorization request. Once the session is active, return here and the consent details will load.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                    <Button
                      type="button"
                      onClick={() => goTo("/sign-in")}
                      className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                    >
                      {copy.signIn}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo("/sign-up")}
                      className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                    >
                      {ownershipCopy.createAccount}
                    </Button>
                  </div>
                </div>
              ) : loading ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3">
                    <div className="browser-submit-spinner" />
                    <p className="text-sm leading-7 text-white/68">The authorization request is being reviewed now.</p>
                  </div>
                </div>
              ) : details ? (
                <div className="grid gap-5">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">Requesting application</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#f4efe7]">{requestedAppName}</h2>
                    {requestedRedirectUri ? (
                      <p className="mt-4 break-all text-sm leading-7 text-white/56">{requestedRedirectUri}</p>
                    ) : null}
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">Requested access</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {scopes.length > 0 ? scopes.map((scope) => (
                        <span
                          key={scope}
                          className="rounded-full border border-white/12 bg-[#0d0c0b] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#efe2d1]"
                        >
                          {scope}
                        </span>
                      )) : (
                        <span className="text-sm leading-7 text-white/56">No scopes were provided by the requesting application.</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                    <Button
                      type="button"
                      disabled={loading}
                      onClick={() => void handleDecision("approve")}
                      className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] disabled:pointer-events-none disabled:opacity-60"
                    >
                      Approve Access
                    </Button>
                    <Button
                      type="button"
                      disabled={loading}
                      variant="outline"
                      onClick={() => void handleDecision("deny")}
                      className="rounded-full border-[#805148] bg-transparent px-7 py-6 text-sm text-[#ebc2b8] transition duration-500 hover:-translate-y-0.5 hover:border-[#9b6358] hover:bg-[#160f0e] disabled:pointer-events-none disabled:opacity-60"
                    >
                      Deny Access
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </Reveal>
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
  authPrimaryRoute,
  authPrimaryLabel,
  locale,
  onLocaleChange,
  languageLabel,
  menuLabel,
  menuItems,
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
  authPrimaryRoute: Route;
  authPrimaryLabel: string;
  locale: SiteLocale;
  onLocaleChange: (locale: SiteLocale) => void;
  languageLabel: string;
  menuLabel: string;
  menuItems: Array<{ label: string; path: Route; meta: string }>;
}) {
  return (
    <motion.header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        animate={{
          backgroundColor: mobileMenuOpen ? "rgba(6,6,6,0.9)" : "rgba(6,6,6,0.18)",
          backdropFilter: mobileMenuOpen ? "blur(20px)" : "blur(10px)",
          borderColor: mobileMenuOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.035)",
        }}
        transition={{ duration: 0.45, ease: easeLuxury }}
        className="border-b border-transparent bg-[linear-gradient(180deg,rgba(5,5,5,0.72),rgba(5,5,5,0.2),transparent)]"
      >
        <Container className="relative flex items-center justify-between py-3.5 md:py-5">
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="group inline-flex min-h-[3.1rem] w-12 flex-col items-center justify-center gap-[0.1rem] bg-transparent text-white/82 transition duration-300 hover:text-white md:min-h-[3.7rem] md:w-16"
          >
            <PraeliatorMenuWreathIcon
              open={mobileMenuOpen}
              className="h-[2.05rem] w-[2.05rem] md:h-[2.55rem] md:w-[2.55rem]"
            />
            <span className="text-[7px] uppercase tracking-[0.25em] text-white/56 transition duration-300 group-hover:text-white/76 md:text-[9px]">
              {menuLabel}
            </span>
          </button>

          <div className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <HeaderBrandMark
              mode={brandMode}
              onClick={() => goTo("/")}
              assetsBroken={headerLogoBroken}
              onAssetError={onHeaderLogoError}
            />
          </div>

          <LanguageSwitcher
            locale={locale}
            onChange={onLocaleChange}
            label={languageLabel}
            compact
            subtle
          />
        </Container>

        <AnimatePresence initial={false}>
          {route !== "/" && !mobileMenuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: easeLuxury }}
              className="pb-2.5 md:pb-4"
            >
              <Container className="flex justify-center">
                <p className="text-[8px] uppercase tracking-[0.34em] text-white/40 md:text-[10px]">
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
              <Container className="pb-6 pt-4 md:pb-8 md:pt-6">
                <div className="grid gap-2.5 md:grid-cols-2">
                  {menuItems.map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => goTo(item.path)}
                      className="group flex items-center justify-between rounded-[1.2rem] border border-white/[0.08] bg-white/[0.025] px-4 py-4 text-left transition duration-500 hover:border-white/16 hover:bg-white/[0.05] md:min-h-[5.5rem] md:px-5"
                    >
                      <div>
                        <p className="text-[0.96rem] uppercase tracking-[0.16em] text-white/90 md:text-[1.05rem]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/34 md:text-[11px]">
                          {item.meta}
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
  privateInquiryLabel,
  waitlistLabel,
  navLinks,
}: {
  goTo: (nextRoute: Route) => void;
  whatsappGeneralLink: string;
  instagramLink: string;
  emailLink: string;
  privateInquiryLabel: string;
  waitlistLabel: string;
  navLinks: Array<{ label: string; path: Route }>;
}) {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[linear-gradient(180deg,#0b0b0b_0%,#050505_100%)] py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.08),transparent_34%)]" />
      <Container className="relative">
        <div className="rounded-[2.15rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(14,12,11,0.9),rgba(6,6,6,0.98))] p-6 shadow-[0_34px_100px_rgba(0,0,0,0.36)]">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d]">
            House register
          </p>
          <h2 className="ownership-display mt-4 max-w-[11ch] text-[2.55rem] font-semibold leading-[0.84] tracking-[-0.065em] text-[#f4efe7]">
            Continue through the proper route.
          </h2>
          <p className="mt-5 text-[0.96rem] leading-7 text-white/66">
            Controlled access, direct contact, and ownership carried with
            continuity.
          </p>

          <div className="mt-7 flex flex-col gap-3">
            <Button
              asChild
              className="h-[3.85rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_16px_42px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
            >
              <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                {privateInquiryLabel}
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/waitlist")}
              className="h-[3.85rem] rounded-full border-white/14 bg-white/[0.025] px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
            >
              {waitlistLabel}
            </Button>
          </div>

          <div className="mt-8 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {navLinks.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                className="flex w-full items-center justify-between py-4 text-left text-sm uppercase tracking-[0.14em] text-white/82 transition duration-500 hover:text-white"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-white/30" />
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.45rem] border border-white/[0.08] bg-white/[0.025] p-5">
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

          <div className="mt-8 rounded-[1.45rem] border border-white/[0.08] bg-white/[0.025] p-5">
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
function PasswordField({
  id,
  name,
  value,
  onChange,
  autoComplete,
  placeholder,
  describedBy,
  className,
}: {
  id?: string;
  name?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  placeholder?: string;
  describedBy?: string;
  className: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        className={`${className} pr-16`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-3 inline-flex items-center justify-center rounded-full px-3 text-[#6a5848] transition duration-300 hover:text-[#231b15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b89268]/35"
      >
        {visible ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
function LanguageSwitcher({
  locale,
  onChange,
  label,
  compact = false,
  subtle = false,
}: {
  locale: SiteLocale;
  onChange: (locale: SiteLocale) => void;
  label: string;
  compact?: boolean;
  subtle?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const currentOption =
    siteLocaleOptions.find((option) => option.value === locale) ??
    siteLocaleOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex items-center transition duration-300 hover:text-white ${
          subtle
            ? compact
              ? "h-8 gap-0 px-1 text-[10px] uppercase tracking-[0.28em] text-white/46"
              : "h-8 gap-0 px-1 text-[10px] uppercase tracking-[0.32em] text-white/44"
            : `rounded-full border border-white/12 bg-white/[0.04] text-white/78 hover:border-white/18 hover:bg-white/[0.08] ${
                compact
                  ? "h-10 gap-2 px-3 text-[11px] uppercase tracking-[0.24em]"
                  : "h-10 gap-2 px-4 text-[10px] uppercase tracking-[0.26em]"
              }`
        }`}
        aria-label={label}
        aria-expanded={open}
      >
        <span>{currentOption.shortLabel}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: easeLuxury }}
            className="absolute right-0 top-[calc(100%+0.65rem)] z-[90] min-w-[11rem] overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0b0a09]/96 p-1 shadow-[0_24px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl"
          >
            {siteLocaleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-[0.95rem] px-3 py-2.5 text-left text-sm transition duration-200 ${
                  option.value === locale
                    ? "bg-white/[0.08] text-white"
                    : "text-white/72 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span>{option.label}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/34">
                  {option.shortLabel}
                </span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
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
                  className={`${formFieldBaseClass} min-h-[3.15rem] rounded-[1.05rem] border-white/[0.08] bg-[#100f0e] px-4 text-[16px] placeholder:text-white/22 focus:border-[#6a5545] sm:text-sm`}
                />
              </div>
            ) : null}
            <div
              id={listboxId}
              className="browser-scrollbar max-h-[min(16rem,42svh)] overflow-y-auto overscroll-contain py-2 sm:max-h-[min(18rem,45vh)]"
              role="listbox"
              aria-labelledby={labelId}
              data-native-cursor="true"
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
                    data-native-cursor="true"
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
              data-native-cursor="true"
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
                    data-native-cursor="true"
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
  const [usePhoneAnimatedImage, setUsePhoneAnimatedImage] = useState(false);
  const loaderTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 767px) and (pointer: coarse)");
    const update = () => setUsePhoneAnimatedImage(mediaQuery.matches);
    update();
    mediaQuery.addEventListener?.("change", update);
    return () => mediaQuery.removeEventListener?.("change", update);
  }, []);
  const animatedImage = videoPathToAnimatedImagePath(section.video);
  const shouldUseAnimatedImage = Boolean(usePhoneAnimatedImage && animatedImage);
  const fallbackImage = getVideoFallbackImage(section.video, section.poster);
  useEffect(() => {
    setVideoReady(shouldUseAnimatedImage);
    setShowLoader(false);
    if (loaderTimerRef.current) {
      window.clearTimeout(loaderTimerRef.current);
      loaderTimerRef.current = null;
    }
    if (shouldUseAnimatedImage) return;
    loaderTimerRef.current = window.setTimeout(() => {
      setShowLoader(true);
    }, 220);
    return () => {
      if (loaderTimerRef.current) {
        window.clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = null;
      }
    };
  }, [section.video, shouldUseAnimatedImage]);
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
            style={{ backgroundImage: `url(${fallbackImage})` }}
            aria-hidden="true"
          />
          {shouldUseAnimatedImage ? (
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={animatedImage}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          ) : (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={fallbackImage}
              onCanPlay={markVideoReady}
              onLoadedData={markVideoReady}
              onPlaying={markVideoReady}
            >
              <source src={section.video} type="video/mp4" />
            </video>
          )}
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
            className="max-w-[92vw] text-[clamp(2.85rem,13.5vw,6.6rem)] font-extralight uppercase leading-[0.9] tracking-[0.075em] text-white/96 sm:tracking-[0.14em]"
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
              className="mt-5 max-w-[22rem] text-[0.92rem] leading-7 tracking-[0.08em] text-white/74 sm:max-w-[28rem] sm:text-[clamp(0.8rem,1.1vw,0.98rem)] sm:tracking-[0.1em]"
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
            className="mt-9"
          >
            {section.href ? (
              <Button
                asChild
                className="min-h-[3.65rem] rounded-full bg-[#efe5d7] px-8 text-[11px] uppercase tracking-[0.24em] text-[#151210] shadow-[0_16px_40px_rgba(239,229,215,0.22)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_22px_54px_rgba(239,229,215,0.28)]"
              >
                <a href={section.href} target="_blank" rel="noreferrer">
                  {section.cta}
                </a>
              </Button>
            ) : section.action ? (
              <Button
                type="button"
                onClick={section.action}
                className="min-h-[3.65rem] rounded-full bg-[#efe5d7] px-8 text-[11px] uppercase tracking-[0.24em] text-[#151210] shadow-[0_16px_40px_rgba(239,229,215,0.22)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_22px_54px_rgba(239,229,215,0.28)]"
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
    <section className="relative isolate bg-[linear-gradient(180deg,#15110d_0%,#0f0d0b_100%)] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,171,129,0.11),transparent_34%)]" />
      <motion.div
        animate={{ opacity: active ? 1 : 0.4, y: active ? 0 : 20 }}
        transition={{ duration: 0.8, ease: easeLuxury }}
        className="relative z-10 mx-auto w-full max-w-[120rem]"
      >
        <div className="mx-auto max-w-[64rem] text-center">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[#c7a97e] sm:text-xs">
            House continuation
          </p>
          <h2 className="ownership-display mt-5 text-[clamp(3rem,6vw,5.4rem)] font-semibold leading-[0.84] tracking-[-0.06em] text-[#f4efe7]">
            The house continues after the opening sequence.
          </h2>
          <p className="mx-auto mt-6 max-w-[42rem] text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
            The first three chambers stay cinematic and untouched. Beyond them,
            the site should begin to prove that Praeliator is a house with
            object authority, private acquisition, recorded custody, and memory.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-4 lg:gap-5">
          {houseArchivePillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              animate={{ opacity: active ? 1 : 0.52, y: active ? 0 : 18 }}
              transition={{
                duration: 0.8,
                delay: 0.08 + index * 0.05,
                ease: easeLuxury,
              }}
              className="rounded-[1.55rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,15,13,0.88),rgba(12,10,9,0.94))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.18)]"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#c7a97e]">
                {pillar.title}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/60">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ opacity: active ? 1 : 0.52, y: active ? 0 : 18 }}
          transition={{ duration: 0.8, delay: 0.26, ease: easeLuxury }}
          className="mt-16 overflow-hidden rounded-[2.1rem] border border-white/10 bg-[linear-gradient(135deg,rgba(22,18,14,0.92),rgba(10,9,8,0.96))] shadow-[0_30px_90px_rgba(0,0,0,0.26)]"
        >
          <div className="grid gap-0 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-white/10 p-6 sm:p-8 lg:p-10 xl:border-b-0 xl:border-r">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#c7a97e]">
                Object doctrine
              </p>
              <h3 className="ownership-display mt-5 max-w-[10ch] text-[clamp(2.6rem,5vw,4.7rem)] font-semibold leading-[0.84] tracking-[-0.06em] text-[#f4efe7]">
                The glove is issued into memory.
              </h3>
              <p className="mt-6 max-w-xl text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
                The site should make the object feel authored before it asks for
                interest: provenance, material evidence, registration, service
                maturity, and future conservation all belong to one house system.
              </p>
            </div>
            <div className="grid gap-0 divide-y divide-white/10 p-6 sm:p-8 lg:p-10">
              {objectDoctrinePlates.map((plate) => (
                <div key={plate.title} className="py-5 first:pt-0 last:pb-0">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#c7a97e]">
                    {plate.title}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/62">
                    {plate.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3 lg:gap-6">
          {cards.map((card, index) => (
            <motion.button
              key={card.key}
              type="button"
              onClick={() => goTo(card.route)}
              animate={{ opacity: active ? 1 : 0.52, y: active ? 0 : 18 }}
              transition={{
                duration: 0.8,
                delay: 0.18 + index * 0.08,
                ease: easeLuxury,
              }}
              className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,13,12,0.88),rgba(11,10,9,0.92))] text-left shadow-[0_24px_70px_rgba(0,0,0,0.2)]"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-[#191919]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.36))]" />
              </div>
              <div className="px-7 py-7">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#c7a97e]">
                  Continue
                </p>
                <p className="mt-4 text-[clamp(1rem,1.35vw,1.55rem)] uppercase tracking-[0.12em] text-white/92">
                  {card.title}
                </p>
                <p className="mt-4 max-w-[24rem] text-[clamp(0.88rem,0.95vw,1rem)] leading-7 text-white/68">
                  {card.text}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {houseLetterExcerpts.map((letter, index) => (
            <motion.div
              key={letter.title}
              animate={{ opacity: active ? 1 : 0.5, y: active ? 0 : 18 }}
              transition={{
                duration: 0.8,
                delay: 0.34 + index * 0.08,
                ease: easeLuxury,
              }}
            >
              <HouseLetterCard
                eyebrow={letter.eyebrow}
                title={letter.title}
                body={letter.body}
                signature={letter.signature}
              />
            </motion.div>
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
  const tailIndex = sections.findIndex((section) => section.kind === "tail");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => {
      const isPhone =
        window.matchMedia("(max-width: 767px)").matches &&
        (window.matchMedia("(pointer: coarse)").matches ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0);
      setUseStackedFlow(isPhone);
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
  if (useStackedFlow) {
    return (
      <div className="relative bg-[#040404]">
        {sections.map((section) => {
          if (section.kind === "video") {
            return (
              <CinematicScene
                key={section.key}
                section={section}
                active={true}
              />
            );
          }
          return (
            <HomeTailScene
              key={section.key}
              active={true}
              goTo={goTo}
              whatsappGeneralLink={whatsappGeneralLink}
              instagramLink={instagramLink}
              emailLink={emailLink}
              scrollContainerRef={null}
            />
          );
        })}
      </div>
    );
  }

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

function AuthStatusNotice({
  notice,
}: {
  notice: AuthNotice;
}) {
  const palette =
    notice.tone === "success"
      ? {
          border: "border-[#5f6b52]",
          background: "bg-[#10140d]",
          title: "text-[#dbe7c7]",
          body: "text-[#b6c49e]",
        }
      : notice.tone === "error"
        ? {
            border: "border-[#805148]",
            background: "bg-[#150f0e]",
            title: "text-[#ebc2b8]",
            body: "text-[#c9988d]",
          }
        : {
            border: "border-[#5c4c3d]",
            background: "bg-[#120f0c]",
            title: "text-[#efe2d1]",
            body: "text-[#c9b49d]",
          };

  return (
    <div
      className={`rounded-[1.5rem] border ${palette.border} ${palette.background} p-4 sm:p-5`}
    >
      <p className={`text-[11px] uppercase tracking-[0.22em] ${palette.title}`}>
        {notice.title}
      </p>
      <p className={`mt-3 text-sm leading-7 ${palette.body}`}>{notice.body}</p>
    </div>
  );
}

type LuxuryCursorVariant = "default" | "button" | "hidden";

type LuxuryCursorFrame = {
  width: number;
  height: number;
  radius: number;
  centerX: number;
  centerY: number;
};

const defaultLuxuryCursorFrame: LuxuryCursorFrame = {
  width: 88,
  height: 40,
  radius: 999,
  centerX: -160,
  centerY: -160,
};

function LuxuryCursor({ enabled }: { enabled: boolean }) {
  const pointerX = useMotionValue(-160);
  const pointerY = useMotionValue(-160);
  const shellX = useSpring(pointerX, {
    stiffness: 520,
    damping: 34,
    mass: 0.22,
  });
  const shellY = useSpring(pointerY, {
    stiffness: 520,
    damping: 34,
    mass: 0.22,
  });
  const haloX = useSpring(pointerX, {
    stiffness: 260,
    damping: 28,
    mass: 0.42,
  });
  const haloY = useSpring(pointerY, {
    stiffness: 260,
    damping: 28,
    mass: 0.42,
  });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [variant, setVariant] = useState<LuxuryCursorVariant>("default");
  const [buttonFrame, setButtonFrame] = useState<LuxuryCursorFrame>(
    defaultLuxuryCursorFrame,
  );
  const visibleRef = useRef(false);
  const variantRef = useRef<LuxuryCursorVariant>("default");
  const buttonFrameRef = useRef<LuxuryCursorFrame>(defaultLuxuryCursorFrame);
  const activeInteractiveElementRef = useRef<HTMLElement | null>(null);
  const lastPointerPositionRef = useRef({ x: -160, y: -160 });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      visibleRef.current = false;
      variantRef.current = "hidden";
      activeInteractiveElementRef.current = null;
      buttonFrameRef.current = defaultLuxuryCursorFrame;
      lastPointerPositionRef.current = { x: -160, y: -160 };
      setVisible(false);
      setPressed(false);
      setVariant("hidden");
      setButtonFrame(defaultLuxuryCursorFrame);
      return;
    }

    const interactiveSelector = [
      "button",
      "a[href]",
      "[role='button']",
      "summary",
      "label[for]",
      "[data-cursor='button']",
    ].join(", ");
    const textSelector = [
      "input",
      "textarea",
      "select",
      "[contenteditable='true']",
      "[contenteditable='']",
      "[contenteditable='plaintext-only']",
    ].join(", ");
    const syncVisible = (nextVisible: boolean) => {
      if (visibleRef.current === nextVisible) return;
      visibleRef.current = nextVisible;
      setVisible(nextVisible);
    };

    const syncVariant = (nextVariant: LuxuryCursorVariant) => {
      if (variantRef.current === nextVariant) return;
      variantRef.current = nextVariant;
      setVariant(nextVariant);
    };

    const syncButtonFrame = (nextFrame: LuxuryCursorFrame) => {
      const current = buttonFrameRef.current;
      const matches =
        Math.abs(current.width - nextFrame.width) < 0.5 &&
        Math.abs(current.height - nextFrame.height) < 0.5 &&
        Math.abs(current.radius - nextFrame.radius) < 0.5 &&
        Math.abs(current.centerX - nextFrame.centerX) < 0.5 &&
        Math.abs(current.centerY - nextFrame.centerY) < 0.5;
      if (matches) return;
      buttonFrameRef.current = nextFrame;
      setButtonFrame(nextFrame);
    };

    const resolveVariant = (target: EventTarget | null): LuxuryCursorVariant => {
      if (!(target instanceof Element)) return "default";
      if (target.closest(textSelector)) return "hidden";
      if (target.closest("[data-native-cursor='true']")) return "default";
      if (target.closest(interactiveSelector)) return "button";
      return "default";
    };

    const resolveInteractiveElement = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      if (target.closest("[data-native-cursor='true']")) return null;
      return target.closest(interactiveSelector) as HTMLElement | null;
    };

    const updateInteractiveFrame = (
      _element: HTMLElement | null,
      pointer?: { x: number; y: number },
    ) => {
      const pointerSource = pointer ?? lastPointerPositionRef.current;
      activeInteractiveElementRef.current = null;
      pointerX.set(pointerSource.x);
      pointerY.set(pointerSource.y);
      return true;
    };

    const refreshInteractiveFrame = () => {};

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      const nextVariant = resolveVariant(event.target);
      syncVariant(nextVariant);
      lastPointerPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (nextVariant === "button") {
        const interactiveElement = resolveInteractiveElement(event.target);
        if (
          updateInteractiveFrame(interactiveElement, {
            x: event.clientX,
            y: event.clientY,
          })
        ) {
          syncVisible(true);
          return;
        }
      }

      activeInteractiveElementRef.current = null;
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      syncVisible(nextVariant !== "hidden");
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      const nextVariant = resolveVariant(event.target);
      syncVariant(nextVariant);

      if (nextVariant === "button") {
        const interactiveElement = resolveInteractiveElement(event.target);
        syncVisible(
          updateInteractiveFrame(interactiveElement, {
            x: event.clientX,
            y: event.clientY,
          }),
        );
        return;
      }

      activeInteractiveElementRef.current = null;
      syncVisible(nextVariant !== "hidden");
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      setPressed(true);
      syncVariant(resolveVariant(event.target));
      lastPointerPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      if (resolveVariant(event.target) === "button") {
        updateInteractiveFrame(resolveInteractiveElement(event.target), {
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      setPressed(false);
      const nextVariant = resolveVariant(event.target);
      syncVariant(nextVariant);
      lastPointerPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      if (nextVariant === "button") {
        updateInteractiveFrame(resolveInteractiveElement(event.target), {
          x: event.clientX,
          y: event.clientY,
        });
      }
    };

    const hideCursor = () => {
      activeInteractiveElementRef.current = null;
      syncVisible(false);
      setPressed(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") hideCursor();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("resize", refreshInteractiveFrame, { passive: true });
    window.addEventListener("scroll", refreshInteractiveFrame, {
      passive: true,
      capture: true,
    });
    window.addEventListener("blur", hideCursor);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.documentElement.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", refreshInteractiveFrame);
      window.removeEventListener("scroll", refreshInteractiveFrame, true);
      window.removeEventListener("blur", hideCursor);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
    };
  }, [enabled, pointerX, pointerY]);

  if (!enabled) return null;

  const isButtonVariant = variant === "button";
  const isHidden = !visible || variant === "hidden";
  const shellWidth = isButtonVariant ? 34 : 26;
  const shellHeight = isButtonVariant ? 34 : 26;
  const shellRadius = 999;
  const haloWidth = isButtonVariant ? 72 : 58;
  const haloHeight = isButtonVariant ? 72 : 58;
  const haloRadius = 999;
  const centerGlyphWidth = 5.5;
  const centerGlyphHeight = 5.5;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[140]"
        style={{ x: haloX, y: haloY }}
        animate={{
          opacity: isHidden ? 0 : isButtonVariant ? 0.46 : 0.34,
          scale: isHidden ? 0.76 : pressed ? 0.9 : isButtonVariant ? 1.02 : 1,
        }}
        transition={{ duration: 0.26, ease: easeLuxury }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 blur-[18px]"
          animate={{
            width: haloWidth,
            height: haloHeight,
            borderRadius: haloRadius,
            background:
              isButtonVariant
                ? "radial-gradient(circle, rgba(214,186,149,0.16) 0%, rgba(214,186,149,0.04) 48%, rgba(214,186,149,0) 78%)"
                : "radial-gradient(circle, rgba(239,229,215,0.12) 0%, rgba(214,186,149,0.03) 48%, rgba(214,186,149,0) 76%)",
          }}
          transition={{ duration: 0.36, ease: easeLuxury }}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[150]"
        style={{ x: shellX, y: shellY }}
        animate={{
          opacity: isHidden ? 0 : 1,
          scale: isHidden ? 0.8 : pressed ? 0.9 : isButtonVariant ? 1.04 : 1,
        }}
        transition={{ duration: 0.24, ease: easeLuxury }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 overflow-hidden border"
          animate={{
            width: shellWidth,
            height: shellHeight,
            borderRadius: shellRadius,
            backgroundColor: isButtonVariant
              ? "rgba(245, 239, 231, 0.06)"
              : "rgba(245, 239, 231, 0.035)",
            borderColor: isButtonVariant
              ? "rgba(216, 186, 149, 0.38)"
              : "rgba(216, 186, 149, 0.26)",
            boxShadow: isButtonVariant
              ? "0 10px 24px rgba(40, 25, 11, 0.12), 0 0 0 1px rgba(255,255,255,0.035) inset"
              : "0 8px 18px rgba(40, 25, 11, 0.08), 0 0 0 1px rgba(255,255,255,0.025) inset",
          }}
          transition={{ duration: 0.3, ease: easeLuxury }}
        >
          <motion.div
            className="absolute inset-[1px] rounded-[inherit]"
            animate={{
              background: isButtonVariant
                ? "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03))"
                : "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
              opacity: isButtonVariant ? 0.92 : 0.72,
            }}
            transition={{ duration: 0.3, ease: easeLuxury }}
          />
          <motion.div
            className="absolute inset-x-[18%] top-0 h-px"
            animate={{
              opacity: isButtonVariant ? 0.52 : 0.28,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.92), rgba(255,255,255,0))",
            }}
            transition={{ duration: 0.24, ease: easeLuxury }}
          />
          <motion.span
            className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2"
            animate={{
              width: centerGlyphWidth,
              height: centerGlyphHeight,
              borderRadius: 999,
              backgroundColor: isButtonVariant
                ? "rgba(244, 239, 231, 0.9)"
                : "rgba(244, 239, 231, 0.82)",
              boxShadow: isButtonVariant
                ? "0 0 12px rgba(244, 239, 231, 0.22)"
                : "0 0 10px rgba(244, 239, 231, 0.16)",
            }}
            transition={{ duration: 0.28, ease: easeLuxury }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}

function BrowserFormStyles() {
  return (
    <style>{`
      html, body, #root { background: #040404; min-height: 100%; }
      body { overscroll-behavior-y: none; }
      @media (max-width: 767px) {
        body {
          overscroll-behavior-y: auto;
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
        }
        button,
        a,
        input,
        select,
        textarea {
          -webkit-tap-highlight-color: transparent;
        }
      }
      .ownership-display {
        font-family: "Cormorant Garamond", "Iowan Old Style", "Palatino Linotype", "Book Antiqua", serif;
        font-feature-settings: "liga" 1, "dlig" 1, "case" 1;
      }
      .ownership-kicker {
        letter-spacing: 0.28em;
      }
      .ownership-grain::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
          radial-gradient(circle at 20% 20%, rgba(95, 66, 36, 0.045) 0.6px, transparent 0.8px),
          radial-gradient(circle at 80% 40%, rgba(95, 66, 36, 0.03) 0.6px, transparent 0.8px),
          linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0));
        background-size: 16px 16px, 22px 22px, 100% 100%;
        opacity: 0.28;
        mix-blend-mode: multiply;
        pointer-events: none;
      }
      .ownership-hairline {
        position: relative;
      }
      .ownership-hairline::after {
        content: "";
        position: absolute;
        left: 8%;
        right: 8%;
        top: 0;
        height: 1px;
        background: linear-gradient(90deg, rgba(191,161,124,0), rgba(191,161,124,0.88), rgba(191,161,124,0));
        pointer-events: none;
      }
      html.praeliator-luxury-cursor,
      html.praeliator-luxury-cursor body,
      html.praeliator-luxury-cursor body * {
        cursor: none !important;
      }
      html.praeliator-luxury-cursor input,
      html.praeliator-luxury-cursor textarea,
      html.praeliator-luxury-cursor select,
      html.praeliator-luxury-cursor [contenteditable='true'],
      html.praeliator-luxury-cursor [contenteditable=''],
      html.praeliator-luxury-cursor [contenteditable='plaintext-only'] {
        cursor: text !important;
      }
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
        .browser-form-element { font-size: 0.875rem; }
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
      .ownership-light-input:-webkit-autofill,
      .ownership-light-input:-webkit-autofill:hover,
      .ownership-light-input:-webkit-autofill:focus,
      .ownership-light-input:-webkit-autofill:active {
        -webkit-text-fill-color: #241b15;
        caret-color: #241b15;
        box-shadow: 0 0 0 1000px #fffaf4 inset;
        -webkit-box-shadow: 0 0 0 1000px #fffaf4 inset;
        border-color: #cdb698;
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
      .browser-form-element[type='number'] { -moz-appearance: textfield; }
      .browser-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(244, 239, 231, 0.14) #0a0908;
      }
      .browser-scrollbar::-webkit-scrollbar { width: 10px; }
      .browser-scrollbar::-webkit-scrollbar-track { background: #0a0908; }
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
      .video-loader-logo { animation: praeliatorLoaderPulse 2.8s ease-in-out infinite; }
      @keyframes browser-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes praeliatorLoaderPulse {
        0% { opacity: 0.68; transform: scale(0.965); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0.68; transform: scale(0.965); }
      }
    `}</style>
  );
}
export default function PraeliatorWebsite() {
  const getViewportMode = React.useCallback((): "mobile" | "tablet" | "desktop" => {
    if (typeof window === "undefined") return "desktop";

    const width = window.innerWidth;
    const shortestSide = Math.min(window.innerWidth, window.innerHeight);
    const coarsePointer =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches;
    const isIPadLikeDevice =
      /iPad/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (shortestSide < 768) return "mobile";
    if (width >= 1024 && !coarsePointer && !isIPadLikeDevice) return "desktop";
    return "tablet";
  }, []);

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
  const houseEmailLink = "mailto:house@praeliator.com?subject=Praeliator%20Inquiry";
  const careEmailLink = "mailto:care@praeliator.com?subject=Praeliator%20Care";
  const studioEmailLink = "mailto:studio@praeliator.com?subject=Praeliator%20Studio";
  const emailLink = houseEmailLink;
  const contactEmailDirectory = [
    {
      label: "House",
      address: "house@praeliator.com",
      href: houseEmailLink,
      note: "Primary private correspondence and slower direct inquiry.",
    },
    {
      label: "Care",
      address: "care@praeliator.com",
      href: careEmailLink,
      note: "Aftercare, service continuity, and ownership-related follow-up.",
    },
    {
      label: "Studio",
      address: "studio@praeliator.com",
      href: studioEmailLink,
      note: "Editorial, creative, and studio-facing correspondence.",
    },
  ] as const;
  const instagramLink = "https://instagram.com/praeliatorboxing";
  const waitlistEndpoint = "/api/private-client-intake";
  const acquisitionIntakeEndpoint = "/api/private-acquisition-intake";
  const transferReviewEndpoint = "/api/ownership-transfer-review";
  const [route, setRoute] = useState<Route>(() => {
    if (typeof window === "undefined") return "/";
    return normalizePath(window.location.pathname);
  });
  const [locale, setLocale] = useState<SiteLocale>(() => getInitialSiteLocale());
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
  const [acquisitionForm, setAcquisitionForm] = useState(
    initialAcquisitionIntakeForm,
  );
  const [acquisitionErrors, setAcquisitionErrors] =
    useState<AcquisitionIntakeErrors>({});
  const [acquisitionState, setAcquisitionState] = useState({
    loading: false,
    success: false,
    error: "",
    reference: "",
    serviceMessage: "",
  });
  const [acquisitionWhatsAppForm, setAcquisitionWhatsAppForm] = useState(
    initialAcquisitionWhatsAppForm,
  );
  const [acquisitionWhatsAppErrors, setAcquisitionWhatsAppErrors] =
    useState<AcquisitionWhatsAppErrors>({});
  const [acquisitionWhatsAppState, setAcquisitionWhatsAppState] = useState({
    loading: false,
    success: false,
    error: "",
    reference: "",
    serviceMessage: "",
  });
  const [acquisitionWhatsAppTouched, setAcquisitionWhatsAppTouched] = useState<
    Partial<Record<AcquisitionWhatsAppFieldName, boolean>>
  >({});
  const [waitlistHoneypot, setWaitlistHoneypot] = useState("");
  const [acquisitionHoneypot, setAcquisitionHoneypot] = useState("");
  const [waitlistCooldownUntil, setWaitlistCooldownUntil] = useState(0);
  const [waitlistStarted, setWaitlistStarted] = useState(false);
  const [waitlistStartedAt, setWaitlistStartedAt] = useState<number | null>(
    null,
  );
  const waitlistRequestControllerRef = useRef<AbortController | null>(null);
  const acquisitionRequestControllerRef = useRef<AbortController | null>(null);
  const acquisitionWhatsAppRequestControllerRef =
    useRef<AbortController | null>(null);
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(!supabase);
  const [authLoading, setAuthLoading] = useState(false);
  const [authNotice, setAuthNotice] = useState<AuthNotice | null>(null);
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [phoneAccessForm, setPhoneAccessForm] = useState({ phone: "" });
  const [resetPasswordForm, setResetPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [otpVerification, setOtpVerification] = useState<{
    identity: string;
    token: string;
    flow: "sign-up" | "one-time-code" | "phone";
    channel: "email" | "phone";
    active: boolean;
  }>({
    identity: "",
    token: "",
    flow: "sign-up",
    channel: "email",
    active: false,
  });
  const [verifyEmailState, setVerifyEmailState] = useState<{
    status: "idle" | "pending" | "success" | "error";
    title: string;
    body: string;
    ctaLabel?: string;
    ctaRoute?: Route;
  }>({
    status: "idle",
    title: "Enter your verification code",
    body: "Verification codes issued by the house are entered here before access continues.",
  });
  const [authResendState, setAuthResendState] = useState<{
    flow: AuthResendFlow | null;
    identity: string;
    availableAt: number;
  }>({
    flow: null,
    identity: "",
    availableAt: 0,
  });
  const [authResendNow, setAuthResendNow] = useState(() => Date.now());
  const [ownershipPairs, setOwnershipPairs] = useState<RegisteredOwnershipPair[]>([]);
  const [pairRegistrationForm, setPairRegistrationForm] = useState({
    serial: "",
    claimCode: "",
  });
  const [pairRegistrationError, setPairRegistrationError] = useState<string | null>(null);
  const [legacyRefreshDraftPairId, setLegacyRefreshDraftPairId] = useState<string | null>(null);
  const [legacyRefreshNote, setLegacyRefreshNote] = useState("");
  const [legacyRefreshError, setLegacyRefreshError] = useState<string | null>(null);
  const [legacyRefreshSubmitting, setLegacyRefreshSubmitting] = useState(false);
  const [transferReviewDraftPairId, setTransferReviewDraftPairId] = useState<string | null>(null);
  const [transferReviewDraft, setTransferReviewDraft] = useState<OwnershipTransferReviewDraft>(initialTransferReviewDraft);
  const [transferReviewError, setTransferReviewError] = useState<string | null>(null);
  const [transferReviewSubmitting, setTransferReviewSubmitting] = useState(false);
  const [ownershipLoading, setOwnershipLoading] = useState(false);
  const [ownershipInitialized, setOwnershipInitialized] = useState(false);

  const reduceMotion = useReducedMotion();
  const [viewportMode, setViewportMode] = useState<
    "mobile" | "tablet" | "desktop"
  >(() => getViewportMode());
  const isDesktopViewport = viewportMode === "desktop";
  const isTabletViewport = viewportMode === "tablet";
  const usesDesktopSurfaceLayout = viewportMode !== "mobile";
  const [luxuryCursorEnabled, setLuxuryCursorEnabled] = useState(false);
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
      acquisitionRequestControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncViewport = () => setViewportMode(getViewportMode());
    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    window.addEventListener("orientationchange", syncViewport);
    return () => {
      window.removeEventListener("resize", syncViewport);
      window.removeEventListener("orientationchange", syncViewport);
    };
  }, [getViewportMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const syncLuxuryCursor = () => {
      const enabled = isDesktopViewport && !reduceMotion && pointerQuery.matches;
      setLuxuryCursorEnabled(enabled);
      document.documentElement.classList.toggle(
        "praeliator-luxury-cursor",
        enabled,
      );
      document.body.classList.toggle("praeliator-luxury-cursor", enabled);
    };

    syncLuxuryCursor();

    if (typeof pointerQuery.addEventListener === "function") {
      pointerQuery.addEventListener("change", syncLuxuryCursor);
      return () => {
        pointerQuery.removeEventListener("change", syncLuxuryCursor);
        document.documentElement.classList.remove("praeliator-luxury-cursor");
        document.body.classList.remove("praeliator-luxury-cursor");
      };
    }

    pointerQuery.addListener(syncLuxuryCursor);
    return () => {
      pointerQuery.removeListener(syncLuxuryCursor);
      document.documentElement.classList.remove("praeliator-luxury-cursor");
      document.body.classList.remove("praeliator-luxury-cursor");
    };
  }, [isDesktopViewport, reduceMotion]);

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
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(AUTH_RESEND_SESSION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        flow?: AuthResendFlow;
        identity?: string;
        availableAt?: number;
      };
      if (
        !parsed.identity ||
        (parsed.flow !== "sign-up" &&
          parsed.flow !== "one-time-code" &&
          parsed.flow !== "forgot-password") ||
        typeof parsed.availableAt !== "number" ||
        parsed.availableAt <= Date.now()
      ) {
        window.sessionStorage.removeItem(AUTH_RESEND_SESSION_KEY);
        return;
      }
      setAuthResendState({
        flow: parsed.flow,
        identity: parsed.identity,
        availableAt: parsed.availableAt,
      });
      setAuthResendNow(Date.now());
    } catch {
      window.sessionStorage.removeItem(AUTH_RESEND_SESSION_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!authResendState.flow || !authResendState.identity || !authResendState.availableAt) {
      window.sessionStorage.removeItem(AUTH_RESEND_SESSION_KEY);
      return;
    }
    if (authResendState.availableAt <= Date.now()) {
      setAuthResendState({
        flow: null,
        identity: "",
        availableAt: 0,
      });
      window.sessionStorage.removeItem(AUTH_RESEND_SESSION_KEY);
      return;
    }
    window.sessionStorage.setItem(
      AUTH_RESEND_SESSION_KEY,
      JSON.stringify(authResendState),
    );
    setAuthResendNow(Date.now());
    const timer = window.setInterval(() => {
      const now = Date.now();
      setAuthResendNow(now);
      if (authResendState.availableAt <= now) {
        setAuthResendState({
          flow: null,
          identity: "",
          availableAt: 0,
        });
        window.sessionStorage.removeItem(AUTH_RESEND_SESSION_KEY);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [authResendState]);
  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthSession(data.session ?? null);
      setAuthInitialized(true);
    });

    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthSession(session ?? null);
      },
    );

    return () => {
      mounted = false;
      authSubscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const tokenHash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type");
    const code = url.searchParams.get("code");
    if (!code && !(tokenHash && type)) return;

    let cancelled = false;

    const clearAuthSearch = (nextRoute: Route) => {
      const redirectUrl = new URL(window.location.href);
      redirectUrl.pathname = nextRoute;
      redirectUrl.search = "";
      redirectUrl.hash = "";
      window.history.replaceState({}, "", redirectUrl.toString());
      setRoute(nextRoute);
      setMobileMenuOpen(false);
    };

    const finishAuthRedirect = (nextRoute: Route, notice?: AuthNotice) => {
      clearAuthSearch(nextRoute);
      if (notice) setAuthNotice(notice);
    };

    const finishVerificationPage = (payload: {
      status: "pending" | "success" | "error";
      title: string;
      body: string;
      ctaLabel?: string;
      ctaRoute?: Route;
    }) => {
      clearAuthSearch("/verify-email");
      setVerifyEmailState(payload);
    };

    const handleAuthRedirect = async () => {
      setAuthLoading(true);
      if (route === "/verify-email") {
        setVerifyEmailState({
          status: "pending",
          title: "Verifying access",
          body: "The house is reviewing the link before access continues.",
        });
      }
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (cancelled) return;
          if (error) {
            if (route === "/verify-email") {
              finishVerificationPage({
                status: "error",
                title: "Authentication unavailable",
                body: error.message,
                ctaLabel: "Return to Sign In",
                ctaRoute: "/sign-in",
              });
            } else {
              finishAuthRedirect("/sign-in", {
                tone: "error",
                title: "Authentication could not be completed",
                body: error.message,
              });
            }
            return;
          }
          if (route === "/verify-email") {
            finishVerificationPage({
              status: "success",
              title: "Access confirmed",
              body: "Your verification has been accepted. You may continue into the house.",
              ctaLabel: "Enter Ownership Record",
              ctaRoute: "/ownership-record",
            });
          } else {
            finishAuthRedirect("/ownership-record", {
              tone: "success",
              title: "Authentication complete",
              body: "Your account session is now active.",
            });
          }
          return;
        }

        if (tokenHash && type) {
          const normalizedType = type === "magiclink" ? "magiclink" : type === "recovery" ? "recovery" : "email";
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: normalizedType as any,
          });
          if (cancelled) return;
          if (error) {
            if (route === "/verify-email") {
              finishVerificationPage({
                status: "error",
                title: normalizedType === "magiclink" ? "Access unavailable" : "Verification unavailable",
                body: error.message,
                ctaLabel: "Return to Sign In",
                ctaRoute: "/sign-in",
              });
            } else {
              finishAuthRedirect(normalizedType === "recovery" ? "/forgot-password" : "/sign-in", {
                tone: "error",
                title: "Verification could not be completed",
                body: error.message,
              });
            }
            return;
          }

          if (normalizedType === "recovery") {
            finishAuthRedirect("/reset-password", {
              tone: "info",
              title: "Reset link confirmed",
              body: "You may now set a new password for your account.",
            });
            return;
          }

          const { data } = await supabase.auth.getSession();
          const hasSession = Boolean(data.session);

          if (route === "/verify-email") {
            finishVerificationPage({
              status: "success",
              title: normalizedType === "magiclink" ? "Access confirmed" : "Email confirmed",
              body:
                normalizedType === "magiclink"
                  ? "Your verification has been accepted. You may continue into the house."
                  : "Your email has been verified under the house. You may now continue into Praeliator.",
              ctaLabel: hasSession ? "Enter Ownership Record" : "Continue to Sign In",
              ctaRoute: hasSession ? "/ownership-record" : "/sign-in",
            });
            return;
          }

          finishAuthRedirect(hasSession ? "/ownership-record" : "/sign-in", {
            tone: "success",
            title: normalizedType === "magiclink" ? "Access confirmed" : "Email confirmed",
            body:
              normalizedType === "magiclink"
                ? "Your verification has been accepted and the session is ready."
                : "Your account is now verified and ready to sign in.",
          });
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };

    void handleAuthRedirect();

    return () => {
      cancelled = true;
    };
  }, [route]);

  useEffect(() => {
    if (typeof window === "undefined" || route !== "/verify-email") return;
    if (verifyEmailState.status === "pending") return;
    const raw = window.sessionStorage.getItem(PENDING_OTP_SESSION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        identity?: string;
        flow?: "sign-up" | "one-time-code" | "phone";
        channel?: "email" | "phone";
      };
      if (
        !parsed.identity ||
        (parsed.flow !== "sign-up" && parsed.flow !== "one-time-code" && parsed.flow !== "phone") ||
        (parsed.channel !== "email" && parsed.channel !== "phone")
      ) {
        return;
      }
      setOtpVerification((current) =>
        current.active && current.identity === parsed.identity && current.flow === parsed.flow && current.channel === parsed.channel
          ? current
          : {
              identity: parsed.identity,
              token: "",
              flow: parsed.flow,
              channel: parsed.channel,
              active: true,
            },
      );
      setVerifyEmailState((current) =>
        current.status === "success"
          ? current
          : {
              status: "idle",
              title:
                parsed.flow === "sign-up"
                  ? "Enter your confirmation code"
                  : parsed.flow === "phone"
                    ? "Enter your phone verification code"
                    : "Enter your one-time sign-in code",
              body:
                parsed.flow === "sign-up"
                  ? `We sent a six-digit confirmation code to ${parsed.identity}. Enter it below to complete your Praeliator account setup.`
                  : parsed.flow === "phone"
                    ? `We sent a six-digit verification code to ${parsed.identity}. Enter it below to continue into the house.`
                    : `We sent a six-digit sign-in code to ${parsed.identity}. Enter it below to continue into the house.`,
            },
      );
    } catch {
      window.sessionStorage.removeItem(PENDING_OTP_SESSION_KEY);
    }
  }, [route, verifyEmailState.status]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const loadOwnershipPairs = React.useCallback(async () => {
    if (!supabase || !authSession) {
      setOwnershipPairs([]);
      setOwnershipInitialized(Boolean(!authSession));
      return;
    }

    setOwnershipLoading(true);
    try {
      const { data, error } = await supabase
        .from("pair_registry")
        .select("id, model, serial, claim_code_last4, delivery_confirmed_at, current_owner_claimed_at")
        .order("current_owner_claimed_at", { ascending: false });

      if (error) {
        setAuthNotice({
          tone: "error",
          title: "Ownership Record unavailable",
          body: error.message,
        });
        setOwnershipPairs([]);
        return;
      }

      const { data: refreshRows, error: refreshError } = await supabase
        .from("legacy_refresh_requests")
        .select("id, pair_id, status, requested_at, note")
        .order("requested_at", { ascending: false });

      if (refreshError) {
        setAuthNotice({
          tone: "error",
          title: "Legacy Refresh unavailable",
          body: refreshError.message,
        });
      }

      const latestRequestByPair = new Map<string, { id: string; status: string | null; requested_at: string; note: string | null }>();
      (refreshRows || []).forEach((row: any) => {
        if (!latestRequestByPair.has(row.pair_id)) {
          latestRequestByPair.set(row.pair_id, row);
        }
      });

      setOwnershipPairs((data || []).map((row: any) => mapOwnershipRow(row, latestRequestByPair.get(row.id) || null)));
    } finally {
      setOwnershipLoading(false);
      setOwnershipInitialized(true);
    }
  }, [authSession]);

  useEffect(() => {
    if (!authSession) {
      setOwnershipPairs([]);
      setOwnershipInitialized(true);
      setPairRegistrationForm({ serial: "", claimCode: "" });
      setPairRegistrationError(null);
      setLegacyRefreshDraftPairId(null);
      setLegacyRefreshNote("");
      setLegacyRefreshError(null);
      setTransferReviewDraftPairId(null);
      setTransferReviewDraft(initialTransferReviewDraft);
      setTransferReviewError(null);
      return;
    }
    void loadOwnershipPairs();
  }, [authSession, loadOwnershipPairs]);

  const authPrimaryRoute: Route = authSession ? "/ownership-record" : "/sign-in";
  const copy = useMemo(() => getSiteCopy(locale), [locale]);
  const authCopy = copy.auth;
  const acquisitionCopy = copy.acquisition;
  const waitlistCopy = copy.waitlist;
  const contactCopy = copy.contact;
  const ownershipCopy = copy.ownership;
  const localizedRouteTitles = copy.routeTitles as Record<Route, string>;
  const localizedRouteMicroLabels = copy.routeMicroLabels as Record<Route, string>;
  const localizedInterestOptions = useMemo(
    () =>
      interestOptions.map((option) => ({
        ...option,
        label: copy.optionLabels.interests[option.value] ?? option.label,
      })),
    [copy],
  );
  const localizedTimelineOptions = useMemo(
    () =>
      timelineOptions.map((option) => ({
        ...option,
        label: copy.optionLabels.timelines[option.value] ?? option.label,
      })),
    [copy],
  );
  const localizedContactPreferenceOptions = useMemo(
    () =>
      contactPreferenceOptions.map((option) => ({
        ...option,
        label:
          copy.optionLabels.contactPreferences[option.value] ?? option.label,
      })),
    [copy],
  );
  const localizedNavItems = useMemo(
    () => [
      {
        label: copy.nav.vis,
        path: "/praeliator-vis" as Route,
        meta: copy.navMeta.vis,
      },
      {
        label: copy.nav.acquisition,
        path: "/acquisition" as Route,
        meta: copy.navMeta.acquisition,
      },
      {
        label: copy.nav.waitlist,
        path: "/waitlist" as Route,
        meta: copy.navMeta.waitlist,
      },
      {
        label: copy.nav.contact,
        path: "/contact" as Route,
        meta: copy.navMeta.contact,
      },
    ],
    [copy],
  );
  const authPrimaryLabel =
    authSession ? copy.ownershipRecord : copy.signIn;
  const headerMenuItems = useMemo(
    () => [
      {
        label: authPrimaryLabel,
        path: authPrimaryRoute,
        meta: authSession
          ? copy.navMeta.ownershipRecord
          : copy.navMeta.signIn,
      },
      ...localizedNavItems,
    ],
    [authPrimaryLabel, authPrimaryRoute, authSession, copy, localizedNavItems],
  );
  const currentPurchaseLink = useMemo(() => {
    if (route === "/praeliator-vis") return whatsappVisLink;
    if (route === "/waitlist") return whatsappWaitlistFollowUpLink;
    return whatsappGeneralLink;
  }, [route]);
  const pageMicroLabel = route !== "/" ? localizedRouteMicroLabels[route] : "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SITE_LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    document.title = `${localizedRouteTitles[route]} | Praeliator`;
  }, [localizedRouteTitles, route]);

  useEffect(() => {
    if (reduceMotion || route === "/" || !isDesktopViewport) return;
    const editorialSmoothScrollRoutes = new Set<Route>([
      "/praeliator-vis",
      "/acquisition",
      "/contact",
    ]);
    if (!editorialSmoothScrollRoutes.has(route)) return;
    const isTouchDevice =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);
    if (isTouchDevice) return;
    const lenis = new Lenis({
      duration: 0.72,
      smoothWheel: true,
      wheelMultiplier: 1.04,
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
  const activeHeaderBrandMode: HeaderBrandMode = usesDesktopSurfaceLayout
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
  const replaceRoute = (nextRoute: Route) => {
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", nextRoute);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    setRoute(nextRoute);
    setMobileMenuOpen(false);
  };

  const createAuthRedirectUrl = (nextRoute: Route) => {
    if (typeof window === "undefined") return nextRoute;
    return new URL(nextRoute, window.location.origin).toString();
  };

  const normalizeAuthResendIdentity = (
    identity: string,
    channel: "email" | "phone" = "email",
  ) =>
    channel === "phone"
      ? normalizeAuthPhone(identity)
      : identity.trim().toLowerCase();

  const startAuthResendCooldown = (
    flow: AuthResendFlow,
    identity: string,
    channel: "email" | "phone" = "email",
  ) => {
    const normalizedIdentity = normalizeAuthResendIdentity(identity, channel);
    setAuthResendNow(Date.now());
    setAuthResendState({
      flow,
      identity: normalizedIdentity,
      availableAt: Date.now() + AUTH_RESEND_COOLDOWN_MS,
    });
  };

  const getAuthResendState = (
    flow: AuthResendFlow,
    identity: string,
    channel: "email" | "phone" = "email",
  ) => {
    const normalizedIdentity = normalizeAuthResendIdentity(identity, channel);
    const isMatch =
      authResendState.flow === flow &&
      authResendState.identity === normalizedIdentity &&
      authResendState.availableAt > authResendNow;
    const secondsRemaining = isMatch
      ? Math.max(
          0,
          Math.ceil((authResendState.availableAt - authResendNow) / 1000),
        )
      : 0;
    return {
      isCoolingDown: isMatch,
      secondsRemaining,
    };
  };

  const formatAuthResendCountdown = (secondsRemaining: number) => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const normalizeAuthPhone = (value: string) => {
    const cleaned = value.trim().replace(/[^\d+]/g, "");
    if (!cleaned) return "";
    if (cleaned.startsWith("+")) {
      return `+${cleaned.slice(1).replace(/\D/g, "")}`;
    }
    return `+${cleaned.replace(/\D/g, "")}`;
  };

  const socialRedirectRoute: Route = "/sign-in";

  const clearPendingOtp = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(PENDING_OTP_SESSION_KEY);
    }
    setOtpVerification({
      identity: "",
      token: "",
      flow: "sign-up",
      channel: "email",
      active: false,
    });
  };

  const beginOtpVerification = (
    identity: string,
    flow: "sign-up" | "one-time-code" | "phone",
    channel: "email" | "phone" = "email",
  ) => {
    const normalizedIdentity =
      channel === "email"
        ? identity.trim().toLowerCase()
        : normalizeAuthPhone(identity);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        PENDING_OTP_SESSION_KEY,
        JSON.stringify({ identity: normalizedIdentity, flow, channel }),
      );
    }
    if (flow === "sign-up" || flow === "one-time-code") {
      startAuthResendCooldown(flow, normalizedIdentity, channel);
    }
    setOtpVerification({
      identity: normalizedIdentity,
      token: "",
      flow,
      channel,
      active: true,
    });
    setVerifyEmailState({
      status: "idle",
      title:
        flow === "sign-up"
          ? "Enter your confirmation code"
          : flow === "phone"
            ? "Enter your phone verification code"
            : "Enter your one-time sign-in code",
      body:
        flow === "sign-up"
          ? `We sent a six-digit confirmation code to ${normalizedIdentity}. Enter it below to complete your Praeliator account setup.`
          : flow === "phone"
            ? `We sent a six-digit verification code to ${normalizedIdentity}. Enter it below to continue into the house.`
            : `We sent a six-digit sign-in code to ${normalizedIdentity}. Enter it below to continue into the house.`,
    });
    replaceRoute("/verify-email");
  };

  const getFriendlyAuthNotice = (
    message: string,
    fallbackTitle: string,
  ): AuthNotice => {
    const normalized = message.toLowerCase();
    if (normalized.includes("email rate limit exceeded")) {
      return {
        tone: "error",
        title: "Too many email requests",
        body: "Supabase has temporarily blocked another authentication email because the project hit the current sending limit. Wait a bit before requesting another code or confirmation email.",
      };
    }
    if (normalized.includes("sms") && normalized.includes("provider") && normalized.includes("not configured")) {
      return {
        tone: "error",
        title: fallbackTitle,
        body: "Phone sign-in is enabled in the interface, but Supabase still needs an SMS provider in the dashboard before codes can be delivered.",
      };
    }
    if (normalized.includes("unsupported provider") || normalized.includes("provider is not enabled")) {
      return {
        tone: "error",
        title: fallbackTitle,
        body: "That sign-in provider is not enabled in Supabase yet. Finish the provider setup in the dashboard and try again.",
      };
    }
    if (
      normalized.includes("security purposes") ||
      normalized.includes("60 seconds") ||
      normalized.includes("rate limit")
    ) {
      return {
        tone: "error",
        title: fallbackTitle,
        body: "Another code was requested too recently. Wait a moment before trying again.",
      };
    }
    return {
      tone: "error",
      title: fallbackTitle,
      body: message,
    };
  };

  const requireSupabase = () => {
    if (supabase) return supabase;
    setAuthNotice({
      tone: "error",
      title: "Authentication is not configured",
      body: "Add your Supabase URL and anon key to enable account access.",
    });
    return null;
  };

  const authRoutes = new Set<Route>(["/sign-in", "/sign-up", "/magic-link", "/verify-email", "/forgot-password", "/reset-password", "/oauth/consent"]);
  const hidesGlobalChrome = route === "/private-acquisition";
  const routeUsesFooter =
    !authRoutes.has(route) &&
    route !== "/ownership-record" &&
    route !== "/private-acquisition";

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client) return;
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const { error } = await client.auth.signInWithPassword({
        email: signInForm.email.trim().toLowerCase(),
        password: signInForm.password,
      });
      if (error) {
        setAuthNotice({
          tone: "error",
          title: "Sign in unavailable",
          body: error.message,
        });
        return;
      }
      setAuthNotice({
        tone: "success",
        title: "Signed in",
        body: "Your Ownership Record is now available.",
      });
      goTo("/ownership-record");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client) return;
    if (!signUpForm.fullName.trim()) {
      setAuthNotice({
        tone: "error",
        title: "Full name required",
        body: "Enter the client name to continue with account creation.",
      });
      return;
    }
    if (!signUpForm.email.trim()) {
      setAuthNotice({
        tone: "error",
        title: "Email required",
        body: "Enter an email address to create the account.",
      });
      return;
    }
    if (signUpForm.password.length < 8) {
      setAuthNotice({
        tone: "error",
        title: "Password too short",
        body: "Use a password with at least 8 characters.",
      });
      return;
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setAuthNotice({
        tone: "error",
        title: "Passwords do not match",
        body: "The password confirmation must match before the account can be created.",
      });
      return;
    }

    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const normalizedEmail = signUpForm.email.trim().toLowerCase();
      const { data, error } = await client.auth.signUp({
        email: normalizedEmail,
        password: signUpForm.password,
        options: {
          data: { full_name: signUpForm.fullName.trim() },
        },
      });
      if (error) {
        setAuthNotice(getFriendlyAuthNotice(error.message, "Account could not be created"));
        return;
      }
      if (data.session) {
        clearPendingOtp();
        setAuthNotice({
          tone: "success",
          title: "Account created",
          body: "Your account is active and your Ownership Record is ready.",
        });
        goTo("/ownership-record");
        return;
      }
      beginOtpVerification(normalizedEmail, "sign-up");
      setAuthNotice({
        tone: "info",
        title: "Check your email",
        body: "We sent a six-digit confirmation code to complete your Praeliator account setup.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyEmailCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client) return;
    if (!otpVerification.identity) {
      setVerifyEmailState({
        status: "error",
        title: "Verification unavailable",
        body: "Request a fresh code before continuing.",
        ctaLabel: "Return to Sign In",
        ctaRoute: "/sign-in",
      });
      return;
    }
    if (otpVerification.token.trim().length !== 6) {
      setVerifyEmailState({
        status: "error",
        title:
          otpVerification.flow === "sign-up"
            ? "Confirmation code required"
            : otpVerification.flow === "phone"
              ? "Phone code required"
              : "Sign-in code required",
        body: "Enter the full six-digit code before continuing.",
      });
      return;
    }
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const params = otpVerification.channel === "phone"
        ? {
            phone: otpVerification.identity,
            token: otpVerification.token.trim(),
            type: "sms" as const,
          }
        : {
            email: otpVerification.identity,
            token: otpVerification.token.trim(),
            type: "email" as const,
          };
      const { data, error } = await client.auth.verifyOtp(params as any);
      if (error) {
        const nextNotice = getFriendlyAuthNotice(
          error.message,
          otpVerification.flow === "sign-up"
            ? "Confirmation unavailable"
            : otpVerification.flow === "phone"
              ? "Phone verification unavailable"
              : "One-time code unavailable",
        );
        setVerifyEmailState({
          status: "error",
          title: nextNotice.title,
          body: nextNotice.body,
        });
        return;
      }
      clearPendingOtp();
      const hasSession = Boolean(data.session);
      setVerifyEmailState({
        status: "success",
        title:
          otpVerification.flow === "sign-up"
            ? "Email confirmed"
            : otpVerification.flow === "phone"
              ? "Phone confirmed"
              : "Access confirmed",
        body:
          otpVerification.flow === "sign-up"
            ? "Your email is now verified under the house. You may continue into Praeliator."
            : otpVerification.flow === "phone"
              ? "Your phone verification code has been accepted. You may continue into the house."
              : "Your one-time sign-in code has been accepted. You may continue into the house.",
        ctaLabel: hasSession ? "Enter Ownership Record" : "Continue to Sign In",
        ctaRoute: hasSession ? "/ownership-record" : "/sign-in",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client) return;
    if (!forgotPasswordEmail.trim()) {
      setAuthNotice({
        tone: "error",
        title: "Email required",
        body: "Enter the email address tied to the account to continue.",
      });
      return;
    }
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const { error } = await client.auth.resetPasswordForEmail(
        forgotPasswordEmail.trim().toLowerCase(),
        {
          redirectTo: createAuthRedirectUrl("/reset-password"),
        },
      );
      if (error) {
        setAuthNotice(getFriendlyAuthNotice(error.message, "Reset email unavailable"));
        return;
      }
      startAuthResendCooldown(
        "forgot-password",
        forgotPasswordEmail.trim().toLowerCase(),
      );
      setAuthNotice({
        tone: "success",
        title: "Reset email sent",
        body: "Check your inbox to continue resetting the account password.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client) return;
    if (!magicLinkEmail.trim()) {
      setAuthNotice({
        tone: "error",
        title: "Email required",
        body: "Enter the account email to request a one-time sign-in code.",
      });
      return;
    }
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const normalizedEmail = magicLinkEmail.trim().toLowerCase();
      const { error } = await client.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: false,
        },
      });
      if (error) {
        setAuthNotice(getFriendlyAuthNotice(error.message, "One-time code unavailable"));
        return;
      }
      beginOtpVerification(normalizedEmail, "one-time-code");
      setAuthNotice({
        tone: "success",
        title: "Code sent",
        body: "If this address already belongs to an account, a six-digit one-time code is now in the inbox.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendVerificationCode = async () => {
    const client = requireSupabase();
    if (!client || !otpVerification.identity) return;
    if (otpVerification.channel !== "email") return;
    const resendState =
      otpVerification.flow === "sign-up" || otpVerification.flow === "one-time-code"
        ? getAuthResendState(otpVerification.flow, otpVerification.identity)
        : { isCoolingDown: false };
    if (resendState.isCoolingDown) return;

    setAuthLoading(true);
    setAuthNotice(null);
    try {
      let error: { message: string } | null = null;
      if (otpVerification.flow === "sign-up") {
        const result = await client.auth.resend({
          type: "signup",
          email: otpVerification.identity,
        });
        error = result.error;
      } else if (otpVerification.flow === "one-time-code") {
        const result = await client.auth.signInWithOtp({
          email: otpVerification.identity,
          options: {
            shouldCreateUser: false,
          },
        });
        error = result.error;
      } else {
        return;
      }

      if (error) {
        const notice = getFriendlyAuthNotice(
          error.message,
          otpVerification.flow === "sign-up"
            ? "Confirmation unavailable"
            : "One-time code unavailable",
        );
        setAuthNotice(notice);
        return;
      }

      startAuthResendCooldown(otpVerification.flow, otpVerification.identity);
      setVerifyEmailState({
        status: "idle",
        title:
          otpVerification.flow === "sign-up"
            ? "Enter your confirmation code"
            : "Enter your one-time sign-in code",
        body:
          otpVerification.flow === "sign-up"
            ? `A fresh six-digit confirmation code has been issued to ${otpVerification.identity}. Enter it below to complete your Praeliator account setup.`
            : `A fresh six-digit sign-in code has been issued to ${otpVerification.identity}. Enter it below to continue into the house.`,
      });
      setAuthNotice({
        tone: "success",
        title:
          otpVerification.flow === "sign-up"
            ? "Confirmation code reissued"
            : "One-time code reissued",
        body: "Another code has been issued. You may request a further resend after one minute.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResendForgotPassword = async () => {
    const client = requireSupabase();
    if (!client) return;
    const normalizedEmail = forgotPasswordEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setAuthNotice({
        tone: "error",
        title: "Email required",
        body: "Enter the account email before requesting another reset message.",
      });
      return;
    }
    const resendState = getAuthResendState("forgot-password", normalizedEmail);
    if (resendState.isCoolingDown) return;

    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const { error } = await client.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: createAuthRedirectUrl("/reset-password"),
      });
      if (error) {
        setAuthNotice(getFriendlyAuthNotice(error.message, "Reset email unavailable"));
        return;
      }
      startAuthResendCooldown("forgot-password", normalizedEmail);
      setAuthNotice({
        tone: "success",
        title: "Reset email sent again",
        body: "A fresh recovery message has been issued. Another resend becomes available after one minute.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePhoneAccess = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client) return;
    const normalizedPhone = normalizeAuthPhone(phoneAccessForm.phone);
    if (!normalizedPhone || normalizedPhone.length < 8) {
      setAuthNotice({
        tone: "error",
        title: "Phone number required",
        body: "Enter a full phone number in international format, including the + and country code.",
      });
      return;
    }
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const { error } = await client.auth.signInWithOtp({
        phone: normalizedPhone,
      });
      if (error) {
        setAuthNotice(getFriendlyAuthNotice(error.message, "Phone sign-in unavailable"));
        return;
      }
      beginOtpVerification(normalizedPhone, "phone", "phone");
      setAuthNotice({
        tone: "success",
        title: "Code sent",
        body: "A six-digit verification code was sent to your phone number.",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client) return;
    if (!authSession) {
      setAuthNotice({
        tone: "error",
        title: "Recovery session unavailable",
        body: "Open the reset link from your email again before setting a new password.",
      });
      return;
    }
    if (resetPasswordForm.password.length < 8) {
      setAuthNotice({
        tone: "error",
        title: "Password too short",
        body: "Use a password with at least 8 characters.",
      });
      return;
    }
    if (resetPasswordForm.password !== resetPasswordForm.confirmPassword) {
      setAuthNotice({
        tone: "error",
        title: "Passwords do not match",
        body: "The password confirmation must match before continuing.",
      });
      return;
    }
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const { error } = await client.auth.updateUser({
        password: resetPasswordForm.password,
      });
      if (error) {
        setAuthNotice({
          tone: "error",
          title: "Password could not be updated",
          body: error.message,
        });
        return;
      }
      setAuthNotice({
        tone: "success",
        title: "Password updated",
        body: "Your account password has been updated successfully.",
      });
      goTo("/ownership-record");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const client = requireSupabase();
    if (!client) return;
    setAuthLoading(true);
    try {
      await client.auth.signOut();
      setAuthNotice({
        tone: "info",
        title: "Signed out",
        body: "The current client session has been closed.",
      });
      goTo("/");
    } finally {
      setAuthLoading(false);
    }
  };

  const getWaitlistCooldownSeconds = () =>
    waitlistCooldownUntil > Date.now()
      ? Math.ceil((waitlistCooldownUntil - Date.now()) / 1000)
      : 0;
  const verifyResendState =
    otpVerification.channel === "email" &&
    (otpVerification.flow === "sign-up" ||
      otpVerification.flow === "one-time-code")
      ? getAuthResendState(otpVerification.flow, otpVerification.identity)
      : { isCoolingDown: false, secondsRemaining: 0 };
  const forgotPasswordResendState = getAuthResendState(
    "forgot-password",
    forgotPasswordEmail,
  );
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
  const handleAcquisitionFieldChange = React.useCallback(
    (field: AcquisitionIntakeFieldName, value: string) => {
      const normalizedValue = normalizeAcquisitionFieldValue(field, value, "change");
      setAcquisitionForm((current) => ({
        ...current,
        [field]: normalizedValue,
      }));
      if (acquisitionErrors[field]) {
        setAcquisitionErrors((current) => ({
          ...current,
          [field]: undefined,
        }));
      }
      if (acquisitionState.success || acquisitionState.error) {
        setAcquisitionState((current) => ({
          ...current,
          success: false,
          error: "",
          reference: "",
          serviceMessage: "",
        }));
      }
    },
    [acquisitionErrors, acquisitionState.error, acquisitionState.success],
  );
  const handleAcquisitionSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (acquisitionHoneypot.trim()) {
      setAcquisitionState({
        loading: false,
        success: false,
        error: "Submission could not be completed.",
        reference: "",
        serviceMessage: "",
      });
      return;
    }

    const normalizedForm = normalizeAcquisitionForm(acquisitionForm);
    setAcquisitionForm(normalizedForm);
    const nextErrors = validateAcquisitionForm(normalizedForm);
    setAcquisitionErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setAcquisitionState({
        loading: false,
        success: false,
        error: "Please correct the highlighted fields.",
        reference: "",
        serviceMessage: "",
      });
      return;
    }

    setAcquisitionState({
      loading: true,
      success: false,
      error: "",
      reference: "",
      serviceMessage: "",
    });

    const controller = new AbortController();
    acquisitionRequestControllerRef.current?.abort();
    acquisitionRequestControllerRef.current = controller;
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
      collectorIntent: normalizedForm.collectorIntent,
      purchasePurpose: normalizedForm.purchasePurpose,
      destinationRegion:
        normalizedForm.destinationRegion || normalizedForm.country,
      note: normalizedForm.note,
      sourceRoute: route,
      clientTimestamp: new Date().toISOString(),
      timezone:
        typeof window !== "undefined"
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : undefined,
    };

    try {
      const response = await fetch(acquisitionIntakeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Praeliator-Intake": "acquisition",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Submission failed.");
      }

      setAcquisitionState({
        loading: false,
        success: true,
        error: "",
        reference: result.reference || "",
        serviceMessage:
          result.serviceMessage ||
          "A private placement response follows after review.",
      });
      setAcquisitionForm(initialAcquisitionIntakeForm);
      setAcquisitionErrors({});
      setAcquisitionHoneypot("");
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "Request timed out. Please try again or continue directly on WhatsApp."
          : error instanceof Error
            ? error.message
            : "Submission failed. Please continue directly with Praeliator.";
      setAcquisitionState({
        loading: false,
        success: false,
        error: message,
        reference: "",
        serviceMessage: "",
      });
    } finally {
      window.clearTimeout(timeoutId);
      acquisitionRequestControllerRef.current = null;
    }
  };
  const markAcquisitionWhatsAppFieldTouched = (
    field: AcquisitionWhatsAppFieldName,
  ) => {
    setAcquisitionWhatsAppTouched((current) => ({
      ...current,
      [field]: true,
    }));
  };
  const markAcquisitionWhatsAppFieldsTouched = (
    fields: AcquisitionWhatsAppFieldName[],
  ) => {
    setAcquisitionWhatsAppTouched((current) => ({
      ...current,
      ...Object.fromEntries(fields.map((field) => [field, true])),
    }));
  };
  const getVisibleAcquisitionWhatsAppError = (
    field: AcquisitionWhatsAppFieldName,
  ) => (acquisitionWhatsAppTouched[field] ? acquisitionWhatsAppErrors[field] : undefined);
  const getAcquisitionWhatsAppSuccess = (field: AcquisitionWhatsAppFieldName) => {
    if (!acquisitionWhatsAppTouched[field]) return false;
    if (acquisitionWhatsAppErrors[field]) return false;
    const value = acquisitionWhatsAppForm[field];
    return typeof value === "string" ? value.trim().length > 0 : false;
  };
  const handleAcquisitionWhatsAppChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const field = event.target.name as AcquisitionWhatsAppFieldName;
    const nextValue =
      field === "fullName"
        ? normalizeWaitlistFieldValue("fullName", event.target.value, "change")
        : event.target.value;
    setAcquisitionWhatsAppForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
    if (acquisitionWhatsAppState.success || acquisitionWhatsAppState.error) {
      setAcquisitionWhatsAppState({
        loading: false,
        success: false,
        error: "",
        reference: "",
        serviceMessage: "",
      });
    }
    if (Object.keys(acquisitionWhatsAppTouched).length > 0) {
      setAcquisitionWhatsAppErrors(
        validateAcquisitionWhatsAppForm({
          ...acquisitionWhatsAppForm,
          [field]: nextValue,
        }),
      );
    }
  };
  const handleAcquisitionWhatsAppBlur = (field: AcquisitionWhatsAppFieldName) => {
    markAcquisitionWhatsAppFieldTouched(field);
    const normalizedForm = {
      ...acquisitionWhatsAppForm,
      fullName:
        field === "fullName"
          ? normalizeWaitlistFieldValue(
              "fullName",
              acquisitionWhatsAppForm.fullName,
              "blur",
            )
          : acquisitionWhatsAppForm.fullName,
    };
    if (field === "fullName") {
      setAcquisitionWhatsAppForm(normalizedForm);
    }
    setAcquisitionWhatsAppErrors(validateAcquisitionWhatsAppForm(normalizedForm));
  };
  const handleAcquisitionWhatsAppSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const normalizedForm = {
      ...acquisitionWhatsAppForm,
      fullName: normalizeWaitlistFieldValue(
        "fullName",
        acquisitionWhatsAppForm.fullName,
        "submit",
      ),
    };
    setAcquisitionWhatsAppForm(normalizedForm);
    const nextErrors = validateAcquisitionWhatsAppForm(normalizedForm);
    setAcquisitionWhatsAppErrors(nextErrors);
    markAcquisitionWhatsAppFieldsTouched(acquisitionWhatsAppRequiredFields);

    if (Object.keys(nextErrors).length > 0) {
      setAcquisitionWhatsAppState({
        loading: false,
        success: false,
        error: "Please correct the highlighted fields.",
        reference: "",
        serviceMessage: "",
      });
      return;
    }

    setAcquisitionWhatsAppState({
      loading: true,
      success: false,
      error: "",
      reference: "",
      serviceMessage: "",
    });

    const controller = new AbortController();
    acquisitionWhatsAppRequestControllerRef.current?.abort();
    acquisitionWhatsAppRequestControllerRef.current = controller;
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      WAITLIST_REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch(acquisitionIntakeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Praeliator-Intake": "acquisition-brief",
        },
        body: JSON.stringify({
          briefMode: true,
          title: normalizedForm.title,
          fullName: normalizedForm.fullName,
          interest: normalizedForm.interest,
          sourceRoute: route,
          destinationNumber: `+${whatsappBase.replace(/[^\d]/g, "")}`,
        }),
        signal: controller.signal,
      });
      const result = await response
        .json()
        .catch(() => ({ success: false, error: "The brief could not be retained." }));

      if (!response.ok || !result?.success) {
        throw new Error(
          getReadableErrorMessage(
            result?.error,
            "The brief could not be retained.",
          ),
        );
      }

      setAcquisitionWhatsAppState({
        loading: false,
        success: true,
        error: "",
        reference: result.reference || "",
        serviceMessage:
          result.serviceMessage ||
          "The brief has been retained under the house record.",
      });
      setAcquisitionWhatsAppForm(initialAcquisitionWhatsAppForm);
      setAcquisitionWhatsAppErrors({});
      setAcquisitionWhatsAppTouched({});

      const message = [
        "Hello Praeliator, I would like to begin a private acquisition inquiry.",
        result.reference ? `Reference: ${result.reference}.` : null,
      ]
        .filter(Boolean)
        .join("\n\n");
      const whatsappLink = createWhatsAppLink(message);

      if (typeof window !== "undefined") {
        window.location.assign(whatsappLink);
      }
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "The brief took too long to retain. You can still continue directly on WhatsApp."
          : getReadableErrorMessage(
              error,
              "The brief could not be retained. You can still continue directly on WhatsApp.",
            );
      setAcquisitionWhatsAppState({
        loading: false,
        success: false,
        error: message,
        reference: "",
        serviceMessage: "",
      });
    } finally {
      window.clearTimeout(timeoutId);
      acquisitionWhatsAppRequestControllerRef.current = null;
    }
  };
  const renderHomePage = () => {
    const cinematicSections = [
      {
        key: "hero",
        kind: "video" as const,
        word: "Praeliator",
        line: copy.home.heroLine,
        cta: copy.home.heroCta,
        action: () => goTo("/praeliator-vis"),
        video: homeCinematicMedia.hero.video,
        poster: homeCinematicMedia.hero.poster,
      },
      {
        key: "vis",
        kind: "video" as const,
        word: "VIS",
        line: copy.home.visLine,
        cta: copy.home.visCta,
        action: () => goTo("/praeliator-vis"),
        video: homeCinematicMedia.vis.video,
        poster: homeCinematicMedia.vis.poster,
      },
      {
        key: "acquisition",
        kind: "video" as const,
        word: copy.home.acquisitionWord,
        line: copy.home.acquisitionLine,
        cta: copy.home.acquisitionCta,
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
            style={{ backgroundImage: `url(${getVideoFallbackImage(visPageMedia.heroVideo, visImageSources.hero)})` }}
            aria-hidden="true"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={getVideoFallbackImage(visPageMedia.heroVideo, visImageSources.hero)}
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
                  {copy.privateInquiry}
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/waitlist")}
                className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                {waitlistCopy.joinWaitlist}
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

      <section className="relative py-8 sm:py-10 lg:py-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-start lg:gap-8">
            <Reveal>
              <HouseLetterCard
                eyebrow="Object dossier"
                title="VIS should feel recorded before it feels merchandised."
                body="The glove is strongest when the site treats it like an authored object: something with construction evidence, custody language, and future continuity already built into its presentation."
                signature="Praeliator / Object note"
              />
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,14,13,0.9),rgba(10,9,8,0.95))] p-6 shadow-[0_26px_70px_rgba(0,0,0,0.24)] sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                      Dossier
                    </p>
                    <div className="mt-5">
                      <DataList items={visDossierEntries} compact />
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                      House authority
                    </p>
                    <div className="mt-5 space-y-4">
                      {visAuthorityStatements.map((statement) => (
                        <p
                          key={statement}
                          className="border-b border-white/8 pb-4 text-sm leading-7 text-white/62 last:border-b-0 last:pb-0"
                        >
                          {statement}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative py-8 sm:py-10 lg:py-12">
        <Container>
          <Reveal>
            <div className="mb-8 max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                Archive strip
              </p>
              <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-[3.1rem]">
                A slower dossier for the parts that justify the object.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                VIS is strongest when the page lingers on proportion, material,
                construction, and continuity long enough for the logic of the
                object to feel inevitable.
              </p>
            </div>
            <ObjectDossierCarousel slides={visArchiveSlides} />
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden py-8 sm:py-10 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(188,151,122,0.08),transparent_30%)]" />
        <Container className="relative">
          <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch lg:gap-8">
            <Reveal>
              <div className="h-full rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,14,12,0.92),rgba(9,8,8,0.97))] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                  House numbering
                </p>
                <h2 className="mt-4 max-w-[10ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-[3.25rem]">
                  A pair should be identifiable beyond the first moment of ownership.
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  Serial, claim code, delivery date, and certificate are not
                  decorative paperwork. They are the object identity system that
                  lets VIS continue as a recorded pair instead of becoming
                  anonymous equipment.
                </p>

                <div className="mt-8 rounded-[1.45rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    Certificate preview
                  </p>
                  <div className="mt-4">
                    <DataList items={certificatePreviewFields} compact />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="grid h-full gap-4 sm:grid-cols-2">
                {serialPhilosophyMarks.map((mark, index) => (
                  <motion.div
                    key={mark.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 0.72,
                      delay: index * 0.045,
                      ease: easeLuxury,
                    }}
                    className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.88),rgba(10,9,8,0.95))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)] sm:p-6"
                  >
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                      {mark.label}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-white/62">
                      {mark.value}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative py-8 sm:py-10 lg:py-14">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(238,226,210,0.96),rgba(196,178,154,0.92))] text-[#231b15] shadow-[0_34px_100px_rgba(0,0,0,0.24)]">
              <div className="grid gap-0 lg:grid-cols-[0.94fr_1.06fr]">
                <div className="border-b border-[#c9b59c] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#8f6e4d] sm:text-xs">
                    Conservation doctrine
                  </p>
                  <h2 className="ownership-display mt-4 max-w-[10ch] text-[3rem] font-semibold leading-[0.82] tracking-[-0.06em] text-[#231b15] sm:text-[4.4rem]">
                    Use is not the end of the object.
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-[#4d3e32] sm:text-base sm:leading-8">
                    Legacy Refresh is not a public service menu. It is a future
                    review ritual for a retained pair whose age, condition, and
                    continuity still belong to the house.
                  </p>
                </div>
                <div className="grid gap-0 divide-y divide-[#c9b59c] p-6 sm:p-8 lg:p-10">
                  {conservationDoctrine.map((item) => (
                    <div key={item.title} className="py-5 first:pt-0 last:pb-0">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#8f6e4d]">
                        {item.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#4d3e32]">
                        {item.text}
                      </p>
                    </div>
                  ))}
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
                      {copy.privateInquiry}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goTo("/waitlist")}
                    className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    {waitlistCopy.joinWaitlist}
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );

const renderAcquisitionPageLegacy = () => {
  const acquisitionFollowUpLink = acquisitionState.reference
    ? createWhatsAppLink(
        `Hello Praeliator, I would like to continue my private acquisition inquiry. Reference: ${acquisitionState.reference}.`,
      )
    : whatsappGeneralLink;

  return (
    <>
    <section className="relative isolate min-h-dvh supports-[height:100svh]:min-h-[100svh] overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-center"
          style={{ backgroundImage: `url(${getVideoFallbackImage(homeCinematicMedia.acquisition.video, homeCinematicMedia.acquisition.poster)})` }}
          aria-hidden="true"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={getVideoFallbackImage(homeCinematicMedia.acquisition.video, homeCinematicMedia.acquisition.poster)}
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
        <div className="grid gap-10 xl:grid-cols-[0.94fr_1.06fr] xl:gap-14">
          <Reveal>
            <HouseLetterCard
              eyebrow="House letter / placement"
              title="Placement should feel considered before it feels available."
              body="Praeliator handles acquisition like placement into a private line, not as open product traffic. Timing, region, and collector intent are clarified early so continuation stays controlled from the first exchange."
              signature="Praeliator / acquisition desk"
              className="h-full"
            />
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={0.05}>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,15,14,0.92),rgba(11,10,9,0.96))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                  Placement signals
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {acquisitionPlacementSignals.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4"
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
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.94),rgba(10,9,8,0.96))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.22)] sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                  Concierge handling
                </p>
                <div className="mt-5">
                  <DataList items={acquisitionConciergeNotes} compact />
                </div>
              </div>
            </Reveal>
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

      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.08),transparent_32%)]" />
        <Container className="relative">
          <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr] xl:items-start xl:gap-10">
            <Reveal>
              <div className="grid gap-5">
                <HouseLetterCard
                  eyebrow="Concierge intake / house placement"
                  title="State the line clearly, and the house can handle the route properly."
                  body="The strongest acquisition routes are not rushed. They clarify collector posture, intended use, region, and timing early so placement feels considered before it feels available."
                  signature="Praeliator / acquisition desk"
                />

                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,15,14,0.94),rgba(10,9,8,0.98))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    Placement desk
                  </p>
                  <div className="mt-5">
                    <DataList
                      items={[
                        {
                          label: "Intent",
                          value:
                            "Collector posture and intended use are clarified before allocation continues.",
                        },
                        {
                          label: "Region",
                          value:
                            "Destination, delivery rhythm, and handling route are retained in the same record.",
                        },
                        {
                          label: "Continuation",
                          value:
                            "The inquiry is authored to flow toward ownership and future aftercare rather than ending at dispatch.",
                        },
                      ]}
                      compact
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rounded-[2.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.96),rgba(10,9,8,0.99))] p-6 shadow-[0_34px_100px_rgba(0,0,0,0.32)] sm:p-8 lg:p-10">
                <div className="max-w-3xl">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a18d]">
                    Concierge dossier
                  </p>
                  <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.9] tracking-[-0.06em] text-[#f4efe7] sm:text-5xl">
                    Enter the route with more precision.
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                    This intake does not replace direct contact. It prepares it.
                    The house receives the acquisition line with better context,
                    stronger continuity, and a reference already in place.
                  </p>
                </div>

                <form
                  className="mt-8 grid gap-4 sm:gap-5"
                  onSubmit={handleAcquisitionSubmit}
                  noValidate
                >
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="acquisitionCompanyWebsite">
                      Leave this field empty
                    </label>
                    <input
                      id="acquisitionCompanyWebsite"
                      name="acquisitionCompanyWebsite"
                      tabIndex={-1}
                      autoComplete="off"
                      value={acquisitionHoneypot}
                      onChange={(event) => setAcquisitionHoneypot(event.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Full name
                      </span>
                      <input
                        type="text"
                        autoComplete="name"
                        value={acquisitionForm.fullName}
                        onChange={(event) =>
                          handleAcquisitionFieldChange("fullName", event.target.value)
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.fullName),
                        })}`}
                        placeholder="Client name"
                      />
                      {acquisitionErrors.fullName ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.fullName}
                        </p>
                      ) : null}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Email
                      </span>
                      <input
                        type="email"
                        autoComplete="email"
                        value={acquisitionForm.email}
                        onChange={(event) =>
                          handleAcquisitionFieldChange("email", event.target.value)
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.email),
                        })}`}
                        placeholder="name@example.com"
                      />
                      {acquisitionErrors.email ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.email}
                        </p>
                      ) : null}
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Dial code
                      </span>
                      <input
                        type="tel"
                        autoComplete="tel-country-code"
                        value={acquisitionForm.phoneCountryCode}
                        onChange={(event) =>
                          handleAcquisitionFieldChange(
                            "phoneCountryCode",
                            event.target.value,
                          )
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.phoneCountryCode),
                        })}`}
                        placeholder="+52"
                      />
                      {acquisitionErrors.phoneCountryCode ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.phoneCountryCode}
                        </p>
                      ) : null}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Phone / WhatsApp
                      </span>
                      <input
                        type="tel"
                        autoComplete="tel-national"
                        inputMode="tel"
                        value={acquisitionForm.whatsapp}
                        onChange={(event) =>
                          handleAcquisitionFieldChange("whatsapp", event.target.value)
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.whatsapp),
                        })}`}
                        placeholder="Phone number"
                      />
                      {acquisitionErrors.whatsapp ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.whatsapp}
                        </p>
                      ) : null}
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Country
                      </span>
                      <input
                        type="text"
                        autoComplete="country-name"
                        value={acquisitionForm.country}
                        onChange={(event) =>
                          handleAcquisitionFieldChange("country", event.target.value)
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.country),
                        })}`}
                        placeholder="Country"
                      />
                      {acquisitionErrors.country ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.country}
                        </p>
                      ) : null}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Destination region
                      </span>
                      <input
                        type="text"
                        autoComplete="address-level1"
                        value={acquisitionForm.destinationRegion}
                        onChange={(event) =>
                          handleAcquisitionFieldChange(
                            "destinationRegion",
                            event.target.value,
                          )
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] ${getFormFieldStateClasses({})}`}
                        placeholder="City / region / destination if relevant"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Interest
                      </span>
                      <select
                        value={acquisitionForm.interest}
                        onChange={(event) =>
                          handleAcquisitionFieldChange("interest", event.target.value)
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] appearance-none ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.interest),
                        })}`}
                      >
                        <option value="">Select interest</option>
                        {interestOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {acquisitionErrors.interest ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.interest}
                        </p>
                      ) : null}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Timing
                      </span>
                      <select
                        value={acquisitionForm.timeline}
                        onChange={(event) =>
                          handleAcquisitionFieldChange("timeline", event.target.value)
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] appearance-none ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.timeline),
                        })}`}
                      >
                        <option value="">Select timing</option>
                        {timelineOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {acquisitionErrors.timeline ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.timeline}
                        </p>
                      ) : null}
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Collector intent
                      </span>
                      <select
                        value={acquisitionForm.collectorIntent}
                        onChange={(event) =>
                          handleAcquisitionFieldChange(
                            "collectorIntent",
                            event.target.value,
                          )
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] appearance-none ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.collectorIntent),
                        })}`}
                      >
                        <option value="">Select intent</option>
                        {acquisitionCollectorIntentOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {acquisitionErrors.collectorIntent ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.collectorIntent}
                        </p>
                      ) : null}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Placement purpose
                      </span>
                      <select
                        value={acquisitionForm.purchasePurpose}
                        onChange={(event) =>
                          handleAcquisitionFieldChange(
                            "purchasePurpose",
                            event.target.value,
                          )
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] appearance-none ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.purchasePurpose),
                        })}`}
                      >
                        <option value="">Select purpose</option>
                        {acquisitionPurposeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {acquisitionErrors.purchasePurpose ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.purchasePurpose}
                        </p>
                      ) : null}
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        Preferred contact
                      </span>
                      <select
                        value={acquisitionForm.contactPreference}
                        onChange={(event) =>
                          handleAcquisitionFieldChange(
                            "contactPreference",
                            event.target.value,
                          )
                        }
                        className={`${formFieldBaseClass} min-h-[3.55rem] appearance-none ${getFormFieldStateClasses({
                          invalid: Boolean(acquisitionErrors.contactPreference),
                        })}`}
                      >
                        <option value="">Select route</option>
                        {contactPreferenceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {acquisitionErrors.contactPreference ? (
                        <p className="text-sm leading-6 text-[#d99b8d]">
                          {acquisitionErrors.contactPreference}
                        </p>
                      ) : null}
                    </label>
                  </div>

                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">
                      House note
                    </span>
                    <textarea
                      rows={6}
                      value={acquisitionForm.note}
                      onChange={(event) =>
                        handleAcquisitionFieldChange("note", event.target.value)
                      }
                      className={`${formFieldBaseClass} min-h-[10rem] resize-none py-4 ${getFormFieldStateClasses({})}`}
                      placeholder="Condition of interest, destination considerations, collector context, or anything the house should understand before direct continuation."
                    />
                  </label>

                  <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/58">
                    Qualified inquiries receive a reference first. The direct
                    conversation can then continue with context already held
                    under the house.
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button
                      type="submit"
                      disabled={acquisitionState.loading}
                      className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] disabled:pointer-events-none disabled:opacity-60"
                    >
                      {acquisitionState.loading
                        ? "Submitting dossier..."
                        : "Submit Concierge Intake"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAcquisitionForm(initialAcquisitionIntakeForm);
                        setAcquisitionErrors({});
                        setAcquisitionState({
                          loading: false,
                          success: false,
                          error: "",
                          reference: "",
                          serviceMessage: "",
                        });
                      }}
                      className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                    >
                      Clear
                    </Button>
                  </div>

                  <AnimatePresence>
                    {acquisitionState.success ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.24, ease: easeLuxury }}
                        className="overflow-hidden rounded-[1.6rem] border border-[#2b211b] bg-[#0d0b0a] shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
                      >
                        <div className="border-b border-white/[0.08] px-5 py-4">
                          <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                            Placement reference
                          </p>
                          <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7]">
                            {acquisitionState.reference || "Reference pending"}
                          </p>
                        </div>
                        <div className="space-y-4 px-5 py-5">
                          <p className="text-sm leading-6 text-white/62">
                            {acquisitionState.serviceMessage}
                          </p>
                          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Button
                              asChild
                              className="rounded-full bg-[#efe5d7] px-5 text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
                            >
                              <a
                                href={acquisitionFollowUpLink}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Continue on WhatsApp
                              </a>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => goTo("/ownership-record")}
                              className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                            >
                              Ownership Record
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {acquisitionState.error ? (
                    <p className="text-sm leading-6 text-[#d99b8d]">
                      {acquisitionState.error}
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
};

const renderAcquisitionPage = () => (
  <>
    <section className="relative isolate min-h-dvh supports-[height:100svh]:min-h-[100svh] overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-center"
          style={{
            backgroundImage: `url(${getVideoFallbackImage(
              homeCinematicMedia.acquisition.video,
              homeCinematicMedia.acquisition.poster,
            )})`,
          }}
          aria-hidden="true"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={getVideoFallbackImage(
            homeCinematicMedia.acquisition.video,
            homeCinematicMedia.acquisition.poster,
          )}
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
            {localizedRouteTitles["/acquisition"]}
          </p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3.1rem,7.8vw,7.6rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#f4efe7]">
            {acquisitionCopy.heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/64 sm:text-base sm:leading-8 lg:max-w-3xl">
            {acquisitionCopy.heroDescription}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
            >
              <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                {acquisitionCopy.openWhatsapp}
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/waitlist")}
              className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
            >
              {acquisitionCopy.joinWaitlist}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>

    <section className="relative py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-10">
          <Reveal>
            <div className="grid gap-5">
              <HouseLetterCard
                eyebrow={acquisitionCopy.openWhatsapp}
                title="The strongest acquisition route is still a direct conversation."
                body="There is no need for a long intake chamber here. State your title, name, and interest, then continue immediately on WhatsApp with the message already prepared."
                signature="Praeliator / direct line"
              />

              <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,15,14,0.92),rgba(10,9,8,0.98))] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#b9a18d]">
                  What happens
                </p>
                <div className="mt-5 grid gap-4">
                  {[
                    "Complete the short brief below.",
                    "Select Send Text.",
                    "WhatsApp opens with your details already written into the message.",
                    "Edit anything you want, then send directly.",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-[1.15rem] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#b9a18d]">
                        Step {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/62">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-[2.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,16,15,0.92),rgba(11,10,9,0.98))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a18d]">
                  {acquisitionCopy.briefEyebrow}
                </p>
                <h2 className="mt-4 max-w-[12ch] text-4xl font-semibold leading-[0.9] tracking-[-0.06em] text-[#f4efe7] sm:text-5xl">
                  {acquisitionCopy.briefTitle}
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  {acquisitionCopy.briefDescription}
                </p>

              <form
                id="acquisition-whatsapp-brief"
                className="mt-8 grid gap-4"
                onSubmit={handleAcquisitionWhatsAppSubmit}
                noValidate
              >
                <div>
                  <SelectField
                    name="title"
                    value={acquisitionWhatsAppForm.title}
                    onChange={handleAcquisitionWhatsAppChange}
                    onBlur={() => handleAcquisitionWhatsAppBlur("title")}
                    placeholder={acquisitionCopy.titlePlaceholder}
                    options={acquisitionTitleOptions}
                    searchable
                    searchPlaceholder={acquisitionCopy.titleSearch}
                    fieldLabel={acquisitionCopy.titleLabel}
                    invalid={Boolean(getVisibleAcquisitionWhatsAppError("title"))}
                    success={getAcquisitionWhatsAppSuccess("title")}
                  />
                  <FieldError message={getVisibleAcquisitionWhatsAppError("title")} />
                </div>

                <div>
                  <InputField
                    name="fullName"
                    value={acquisitionWhatsAppForm.fullName}
                    onChange={handleAcquisitionWhatsAppChange}
                    onBlur={() => handleAcquisitionWhatsAppBlur("fullName")}
                    autoComplete="name"
                    autoCapitalize="words"
                    placeholder={acquisitionCopy.namePlaceholder}
                    invalid={Boolean(getVisibleAcquisitionWhatsAppError("fullName"))}
                    success={getAcquisitionWhatsAppSuccess("fullName")}
                  />
                  <FieldError message={getVisibleAcquisitionWhatsAppError("fullName")} />
                </div>

                <div>
                  <SelectField
                    name="interest"
                    value={acquisitionWhatsAppForm.interest}
                    onChange={handleAcquisitionWhatsAppChange}
                    onBlur={() => handleAcquisitionWhatsAppBlur("interest")}
                    placeholder={acquisitionCopy.interestPlaceholder}
                    options={localizedInterestOptions}
                    invalid={Boolean(getVisibleAcquisitionWhatsAppError("interest"))}
                    success={getAcquisitionWhatsAppSuccess("interest")}
                  />
                  <FieldError message={getVisibleAcquisitionWhatsAppError("interest")} />
                  {!getVisibleAcquisitionWhatsAppError("interest") ? (
                    <FieldNote>
                      {acquisitionCopy.briefSupport}
                    </FieldNote>
                  ) : null}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={acquisitionWhatsAppState.loading}
                    className="h-[3.85rem] w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                  >
                    {acquisitionWhatsAppState.loading
                      ? acquisitionCopy.retainingBrief
                      : acquisitionCopy.retainBrief}
                  </Button>
                </div>

                <AnimatePresence>
                  {acquisitionWhatsAppState.success ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.22, ease: easeLuxury }}
                      className="overflow-hidden rounded-[1.6rem] border border-[#2b211b] bg-[#0d0b0a] shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
                    >
                      <div className="border-b border-white/[0.08] px-5 py-4">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                          {acquisitionCopy.briefRetained}
                        </p>
                        <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7]">
                          {acquisitionWhatsAppState.reference ||
                            acquisitionCopy.referencePending}
                        </p>
                      </div>
                      <div className="space-y-4 px-5 py-5">
                        <p className="text-sm leading-6 text-white/62">
                          {acquisitionWhatsAppState.serviceMessage}
                        </p>
                        <div className="rounded-[1.25rem] border border-white/[0.08] bg-white/[0.018] p-4 text-sm leading-6 text-white/58">
                          {acquisitionCopy.briefRetainedBody}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {acquisitionWhatsAppState.error ? (
                  <div className="rounded-[1.35rem] border border-[#65413a] bg-[#160e0d] p-4 text-sm leading-6 text-[#f0c1b8]">
                    {acquisitionWhatsAppState.error}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.assign(whatsappGeneralLink);
                      }
                    }}
                    className="rounded-full border-white/15 bg-transparent px-6 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    {acquisitionCopy.openWithoutBrief}
                  </Button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>

    <section className="relative overflow-hidden py-10 sm:py-12 lg:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(188,151,122,0.08),transparent_30%)]" />
      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10">
          <Reveal>
            <HouseLetterCard
              eyebrow="Private placement"
              title="Acquisition should feel like allocation, not checkout."
              body="The short WhatsApp brief is only the threshold. After correspondence, a private issued session can carry the prepared allocation, reference, destination record, and payment chamber without ever becoming public ecommerce."
              signature="Praeliator / allocation note"
              className="h-full"
            />
          </Reveal>

          <div className="grid gap-5">
            <Reveal delay={0.05}>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.94),rgba(10,9,8,0.97))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                  Placement sequence
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {acquisitionSteps.map((item) => (
                    <div
                      key={item.step}
                      className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        {item.step} / {item.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/62">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.92),rgba(9,8,8,0.96))] p-6 shadow-[0_24px_72px_rgba(0,0,0,0.2)] sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                  House conditions
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {acquisitionPrinciples.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
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
        eyebrow={localizedRouteTitles["/waitlist"]}
        title={waitlistCopy.heroTitle}
        description={waitlistCopy.heroDescription}
        note={waitlistCopy.heroNote}
        actions={[
          {
            label: waitlistCopy.directInquiry,
            href: whatsappGeneralLink,
            variant: "primary",
          },
          {
            label: waitlistCopy.contact,
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
                  eyebrow={localizedRouteTitles["/waitlist"]}
                  title={waitlistCopy.heroTitle}
                  description={waitlistCopy.heroDescription}
                />
                <div className="mt-6 text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  {waitlistCopy.introTitle}
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
                      title: waitlistCopy.review,
                      text: waitlistCopy.reviewText,
                    },
                    {
                      title: waitlistCopy.reference,
                      text: waitlistCopy.referenceText,
                    },
                    {
                      title: waitlistCopy.continuation,
                      text: waitlistCopy.continuationText,
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
                      {waitlistCopy.directInquiry}
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
                        placeholder={waitlistCopy.titlePlaceholder}
                        searchable
                        searchPlaceholder={waitlistCopy.titleSearch}
                        fieldLabel={waitlistCopy.titleLabel}
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
                        placeholder={waitlistCopy.fullNamePlaceholder}
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
                      placeholder={waitlistCopy.emailPlaceholder}
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
                      placeholder={waitlistCopy.countryPlaceholder}
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
                        maxLength={5}
                        placeholder={waitlistCopy.dialCodePlaceholder}
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
                        maxLength={15}
                        placeholder={waitlistCopy.phonePlaceholder}
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
                          {waitlistCopy.phoneSupport}
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
                      placeholder={waitlistCopy.interestPlaceholder}
                      options={localizedInterestOptions}
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
                      placeholder={waitlistCopy.timelinePlaceholder}
                      options={localizedTimelineOptions}
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
                      placeholder={waitlistCopy.contactPlaceholder}
                      options={localizedContactPreferenceOptions}
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
                      className={`${formFieldBaseClass} min-h-[10.5rem] resize-none px-5 py-4 align-top ${getFormFieldStateClasses({})}`}
                      placeholder={waitlistCopy.notePlaceholder}
                    />
                    <FieldNote>
                      {waitlistCopy.noteSupport}
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
                            ? waitlistCopy.submitting
                            : getWaitlistCooldownSeconds() > 0
                              ? `${waitlistCopy.waitPrefix} ${getWaitlistCooldownSeconds()}s`
                              : waitlistCopy.joinWaitlist}
                        </span>
                      </span>
                    </Button>
                    <FieldNote>
                      {waitlistCopy.reviewTiming}
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
                            {waitlistCopy.inquiryReceived}
                          </p>
                          <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7] sm:text-lg">
                            {waitlistState.reference ||
                              waitlistCopy.referencePending}
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
                                {waitlistCopy.continueWhatsapp}
                              </a>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => goTo("/")}
                              className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                            >
                              {waitlistCopy.returnHome}
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

      <section className="relative py-8 sm:py-10 lg:py-14">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-[2.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(16,14,13,0.94),rgba(10,9,8,0.98))] shadow-[0_30px_90px_rgba(0,0,0,0.26)]">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a18d]">
                    Future allocation register
                  </p>
                  <h2 className="mt-4 max-w-[11ch] text-3xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#f4efe7] sm:text-4xl lg:text-[3.1rem]">
                    Interest should have a place before inventory exists.
                  </h2>
                  <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                    The waitlist is not a marketing list. It is the quiet
                    register for future issue, collector posture, and timing
                    before direct correspondence becomes necessary.
                  </p>
                </div>
                <div className="grid gap-0 divide-y divide-white/10 p-6 sm:p-8 lg:p-10">
                  {waitlistCollectorSignals.map((item) => (
                    <div key={item.title} className="py-5 first:pt-0 last:pb-0">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        {item.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/62">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="relative py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid gap-10 xl:grid-cols-[0.96fr_1.04fr] xl:gap-14">
            <Reveal>
              <HouseLetterCard
                eyebrow="House letter / collector line"
                title="Interest can be retained before it needs to be answered."
                body="The waitlist is not a promotional funnel. It is a quieter register for future access, collector posture, and timing before a more direct continuation becomes necessary."
                signature="Praeliator / collector register"
                className="h-full"
              />
            </Reveal>

            <div className="grid gap-5">
              <Reveal delay={0.05}>
                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.94),rgba(10,9,8,0.97))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    Collector signals
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {waitlistCollectorSignals.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4"
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
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,13,12,0.92),rgba(9,8,8,0.96))] p-6 shadow-[0_24px_72px_rgba(0,0,0,0.2)] sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    Returned under reference
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
                    Once submitted, the inquiry is retained under a client
                    reference rather than disappearing into a generic mailing
                    list. That reference becomes the quiet line for future
                    continuation.
                  </p>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        Future release posture
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/60">
                        The waitlist remains appropriate for future access,
                        collector visibility, or quiet intent before immediate
                        inquiry becomes necessary.
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        Direct continuation
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/60">
                        When timing matters, the route may still continue
                        directly on WhatsApp without losing the recorded
                        reference.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
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
            style={{ backgroundImage: `url(${getVideoFallbackImage(homeCinematicMedia.ownership.video, visImageSources.packaging)})` }}
            aria-hidden="true"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={getVideoFallbackImage(homeCinematicMedia.ownership.video, visImageSources.packaging)}
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
              {localizedRouteTitles["/contact"]}
            </p>
            <h1 className="mt-5 max-w-[10ch] text-[clamp(3rem,7.2vw,7rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#f4efe7]">
              {contactCopy.heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-sm leading-7 text-white/64 sm:text-base sm:leading-8">
              {contactCopy.heroDescription}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] hover:shadow-[0_20px_46px_rgba(239,229,215,0.24)]"
              >
                <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                  {contactCopy.primaryCta}
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/waitlist")}
                className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
              >
                {contactCopy.secondaryCta}
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
                  {contactCopy.primaryCta}
                </p>
                <h2 className="mt-5 max-w-[9ch] text-4xl font-semibold leading-[0.9] tracking-[-0.06em] sm:text-5xl">
                  {contactCopy.primaryTitle}
                </h2>
                <p className="mt-6 max-w-xl text-sm leading-7 text-white/60 sm:text-base sm:leading-8">
                  {contactCopy.primaryDescription}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    className="rounded-full bg-[#efe5d7] px-6 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                  >
                    <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                      {contactCopy.openWhatsapp}
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goTo("/waitlist")}
                    className="rounded-full border-white/15 bg-transparent px-6 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
                  >
                    {contactCopy.quieterEntry}
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
                    House mailboxes
                  </p>
                  <div className="mt-4 grid gap-3">
                    {contactEmailDirectory.map((entry) => (
                      <a
                        key={entry.address}
                        href={entry.href}
                        className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 transition duration-500 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.05]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                              {entry.label}
                            </p>
                            <p className="mt-3 text-base text-[#f4efe7]">
                              {entry.address}
                            </p>
                            <p className="mt-2 max-w-md text-sm leading-7 text-white/56">
                              {entry.note}
                            </p>
                          </div>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-white/32">
                            Write
                          </span>
                        </div>
                      </a>
                    ))}
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

      <section className="relative py-8 sm:py-10 lg:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
            <Reveal>
              <HouseLetterCard
                eyebrow="House correspondence"
                title="Contact is part of the object route."
                body="A serious pair should not move through generic support language. Each channel has a role, and each role keeps the same quiet authority as the object itself."
                signature="Praeliator / correspondence note"
                className="h-full"
              />
            </Reveal>

            <Reveal delay={0.06}>
              <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.94),rgba(10,9,8,0.97))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                  Correspondence hierarchy
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {contactChannels.map((channel) => (
                    <div
                      key={channel.title}
                      className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                        {channel.role}
                      </p>
                      <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#f4efe7]">
                        {channel.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/62">
                        {channel.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="relative py-16 sm:py-18 lg:py-22">
        <Container>
          <div className="grid gap-10 xl:grid-cols-[0.94fr_1.06fr] xl:gap-14">
            <Reveal>
              <HouseLetterCard
                eyebrow="House letter / response"
                title="Even direct contact should still feel like the house."
                body="The route matters as much as the channel. Whether inquiry begins on WhatsApp, email, or Instagram, the response should remain calm, exact, and private rather than collapsing into customer-support language."
                signature="Praeliator / direct correspondence"
                className="h-full"
              />
            </Reveal>

            <div className="grid gap-5">
              <Reveal delay={0.05}>
                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,14,13,0.94),rgba(10,9,8,0.96))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    Response standards
                  </p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {contactResponseStandards.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[1.3rem] border border-white/10 bg-white/[0.03] p-4"
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
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(13,12,11,0.92),rgba(8,8,7,0.96))] p-6 shadow-[0_24px_72px_rgba(0,0,0,0.2)] sm:p-8">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#b9a18d]">
                    Channel posture
                  </p>
                  <div className="mt-5 divide-y divide-white/10 border-t border-white/10">
                    {contactStandards.map((item) => (
                      <div key={item} className="py-4">
                        <p className="text-sm leading-7 text-white/62">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );

  const renderMobileHomePage = () => (
    <>
      <section className="relative overflow-hidden pb-7 pt-[5.85rem]">
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(0,0,0,0.82),rgba(0,0,0,0.18),transparent)]" />
        <Container>
          <div className="overflow-hidden rounded-[2.35rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(13,12,11,0.88),rgba(7,7,6,0.98))] shadow-[0_36px_120px_rgba(0,0,0,0.42)]">
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
                  <p className="ownership-display mt-4 text-[3.1rem] font-semibold leading-[0.82] tracking-[-0.07em] text-[#f4efe7]">
                    Boxing, treated like an art form.
                  </p>
                  <p className="mt-5 text-[0.96rem] leading-7 text-white/74">
                    {copy.home.heroLine}
                  </p>
                </div>
              }
            />
            <div className="p-6">
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  onClick={() => goTo("/praeliator-vis")}
                  className="h-[3.85rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210] shadow-[0_16px_42px_rgba(239,229,215,0.18)] transition duration-500 hover:bg-[#e4d7c7]"
                >
                  {copy.home.visCta}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-[3.85rem] rounded-full border-white/14 bg-white/[0.025] px-6 text-sm text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                >
                  <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                    {copy.privateInquiry}
                  </a>
                </Button>
              </div>
              <div className="-mx-6 mt-7 flex gap-3 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {[
                  { label: "Format", value: "16 oz · lace-up" },
                  { label: "Material", value: "Top-grain cowhide" },
                  { label: "Approach", value: "Quiet luxury" },
                  { label: "Route", value: "Direct acquisition" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="min-w-[10.5rem] rounded-[1.3rem] border border-white/[0.09] bg-white/[0.025] p-4"
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

      <section className="relative py-7">
        <Container>
          <div className="grid gap-4">
            <Reveal>
              <div className="overflow-hidden rounded-[2.05rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(14,13,12,0.86),rgba(7,7,6,0.97))] shadow-[0_28px_88px_rgba(0,0,0,0.32)]">
                <MediaSurface
                  src={homeCinematicMedia.vis.poster}
                  alt="Praeliator VIS"
                  video={homeCinematicMedia.vis.video}
                  className="min-h-[18rem] rounded-none border-0 shadow-none"
                  dim="medium"
                />
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    VIS
                  </p>
                  <h2 className="ownership-display mt-3 text-[2.45rem] font-semibold leading-[0.86] tracking-[-0.06em] text-[#f4efe7]">
                    The flagship training glove.
                  </h2>
                  <p className="mt-4 text-[0.96rem] leading-7 text-white/66">
                    A 16 oz lace-up training glove in top-grain cowhide, built
                    for disciplined training and technical sparring.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={() => goTo("/praeliator-vis")}
                      className="h-[3.75rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
                    >
                      Enter VIS
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-[3.75rem] rounded-full border-white/14 bg-white/[0.025] px-6 text-sm text-[#f4efe7]"
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
              <div className="overflow-hidden rounded-[2.05rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(14,13,12,0.86),rgba(7,7,6,0.97))] shadow-[0_28px_88px_rgba(0,0,0,0.32)]">
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
                      <p className="ownership-display mt-4 text-[2.2rem] font-semibold leading-[0.88] tracking-[-0.06em] text-[#f4efe7]">
                        Top-grain leather. Soft satin finish.
                      </p>
                    </div>
                  }
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[2.05rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(14,13,12,0.86),rgba(7,7,6,0.97))] shadow-[0_28px_88px_rgba(0,0,0,0.32)]">
                <MediaSurface
                  src={homeCinematicMedia.acquisition.poster}
                  alt="Praeliator acquisition"
                  video={homeCinematicMedia.acquisition.video}
                  className="min-h-[16rem] rounded-none border-0 shadow-none"
                  dim="heavy"
                />
                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    {copy.home.acquisitionWord}
                  </p>
                  <h2 className="ownership-display mt-3 text-[2.45rem] font-semibold leading-[0.86] tracking-[-0.06em] text-[#f4efe7]">
                    {copy.home.acquisitionLine}
                  </h2>
                  <p className="mt-4 text-[0.96rem] leading-7 text-white/66">
                    Inquiry, review, allocation, delivery, and aftercare stay
                    inside one controlled route.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Button
                      asChild
                      className="h-[3.75rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
                    >
                      <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
                        {copy.privateInquiry}
                      </a>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo("/acquisition")}
                      className="h-[3.75rem] rounded-full border-white/14 bg-white/[0.025] px-6 text-sm text-[#f4efe7]"
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
          {
            label: copy.privateInquiry,
            href: whatsappVisLink,
            variant: "primary",
          },
          {
            label: waitlistCopy.joinWaitlist,
            onClick: () => goTo("/waitlist"),
            variant: "secondary",
          },
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
        <MobileEditorialLedger items={visEditorialBlocks} />
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
              <MobileEditorialLedger
                items={[
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
                ]}
              />
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
        <div className="mt-4">
          <MobileEditorialLedger
            items={[
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
            ]}
          />
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
        eyebrow="House numbering"
        title="Serial, claim code, and delivery date become object identity."
        description="The pair is not only received. It is recorded, attached to a client line, and made eligible for future service by its real delivery age."
      >
        <MobileEditorialLedger
          items={serialPhilosophyMarks.map((mark) => ({
            title: mark.label,
            text: mark.value,
          }))}
        />
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Conservation"
        title="Use is not the end of the object."
        description="Legacy Refresh is a future review ritual for a retained pair, not a public service menu."
      >
        <MobileEditorialLedger items={conservationDoctrine} />
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
              {copy.privateInquiry}
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo("/waitlist")}
            className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
          >
            {waitlistCopy.joinWaitlist}
          </Button>
        </div>
      </MobileSectionFrame>
    </>
  );

  const renderMobileAcquisitionPage = () => (
    <>
      <MobilePageHeroBanner
        eyebrow={localizedRouteTitles["/acquisition"]}
        title={acquisitionCopy.heroTitle}
        description={acquisitionCopy.heroDescription}
        actions={[
          {
            label: acquisitionCopy.openWhatsapp,
            href: whatsappGeneralLink,
            variant: "primary",
          },
          {
            label: acquisitionCopy.joinWaitlist,
            onClick: () => goTo("/waitlist"),
            variant: "secondary",
          },
        ]}
        media={{
          image: homeCinematicMedia.acquisition.poster,
          alt: "Praeliator acquisition hero",
          video: homeCinematicMedia.acquisition.video,
          badge: localizedRouteTitles["/acquisition"],
          overlayTitle: "The route should feel direct, not procedural.",
        }}
        stats={[
          { label: "Primary route", value: "WhatsApp" },
          { label: "Brief", value: "Title · name · interest" },
          { label: "Record", value: "Privately retained" },
          { label: "Tone", value: "Quiet handoff" },
        ]}
      />

      <MobileSectionFrame
        eyebrow="Acquisition route"
        title="Short, direct, and properly retained."
        description="This page should not feel like a lead form. It exists only to let the house retain context before the direct conversation continues."
      >
        <MobileEditorialLedger
          items={[
            {
              title: "Private first",
              text: "The house can retain the brief before WhatsApp opens, so the client does not need to introduce themselves in the message thread.",
            },
            {
              title: "Direct second",
              text: "WhatsApp remains the real acquisition route. The brief exists only to support that handoff, never to replace it.",
            },
            {
              title: "Quiet tone",
              text: "Only a minimal title, name, and interest are requested. Nothing here should feel like a normal intake funnel.",
            },
          ]}
        />
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Private placement"
        title="Allocation, not checkout."
        description="Correspondence can become a private issued session with a reference, destination record, and on-site payment chamber without becoming public ecommerce."
      >
        <MobileEditorialLedger
          numbered
          items={acquisitionSteps.map((item) => ({
            title: item.title,
            text: item.text,
          }))}
        />
      </MobileSectionFrame>

      <section className="relative py-7">
        <Container>
          <div className="rounded-[2.05rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(17,16,15,0.88),rgba(7,7,6,0.98))] p-6 shadow-[0_30px_96px_rgba(0,0,0,0.34)]">
            <div className="pointer-events-none mx-auto mb-6 h-px w-2/3 bg-[linear-gradient(90deg,transparent,rgba(214,186,149,0.58),transparent)]" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#b9a18d]">
              {acquisitionCopy.briefEyebrow}
            </p>
            <h2 className="ownership-display mt-4 max-w-[11.5ch] text-[2.85rem] font-semibold leading-[0.82] tracking-[-0.065em] text-[#f4efe7]">
              {acquisitionCopy.briefTitle}
            </h2>
            <p className="mt-5 text-[0.96rem] leading-7 text-white/68">
              {acquisitionCopy.briefDescription}
            </p>

            <div className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {[
                "The house retains the brief privately.",
                "WhatsApp then opens with a quieter reference.",
                "The direct conversation stays primary from there.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="py-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#b9a18d]">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <form
              id="acquisition-whatsapp-brief-mobile"
              className="mt-6 grid gap-4"
              onSubmit={handleAcquisitionWhatsAppSubmit}
              noValidate
            >
              <div>
                <SelectField
                  name="title"
                  value={acquisitionWhatsAppForm.title}
                  onChange={handleAcquisitionWhatsAppChange}
                  onBlur={() => handleAcquisitionWhatsAppBlur("title")}
                  placeholder={acquisitionCopy.titlePlaceholder}
                  options={acquisitionTitleOptions}
                  searchable
                  searchPlaceholder={acquisitionCopy.titleSearch}
                  fieldLabel={acquisitionCopy.titleLabel}
                  invalid={Boolean(
                    getVisibleAcquisitionWhatsAppError("title"),
                  )}
                  success={getAcquisitionWhatsAppSuccess("title")}
                />
                <FieldError
                  message={getVisibleAcquisitionWhatsAppError("title")}
                />
              </div>

              <div>
                <InputField
                  name="fullName"
                  value={acquisitionWhatsAppForm.fullName}
                  onChange={handleAcquisitionWhatsAppChange}
                  onBlur={() => handleAcquisitionWhatsAppBlur("fullName")}
                  autoComplete="name"
                  autoCapitalize="words"
                  placeholder={acquisitionCopy.namePlaceholder}
                  invalid={Boolean(
                    getVisibleAcquisitionWhatsAppError("fullName"),
                  )}
                  success={getAcquisitionWhatsAppSuccess("fullName")}
                />
                <FieldError
                  message={getVisibleAcquisitionWhatsAppError("fullName")}
                />
              </div>

              <div>
                <SelectField
                  name="interest"
                  value={acquisitionWhatsAppForm.interest}
                  onChange={handleAcquisitionWhatsAppChange}
                  onBlur={() => handleAcquisitionWhatsAppBlur("interest")}
                  placeholder={acquisitionCopy.interestPlaceholder}
                  options={localizedInterestOptions}
                  invalid={Boolean(
                    getVisibleAcquisitionWhatsAppError("interest"),
                  )}
                  success={getAcquisitionWhatsAppSuccess("interest")}
                />
                <FieldError
                  message={getVisibleAcquisitionWhatsAppError("interest")}
                />
                {!getVisibleAcquisitionWhatsAppError("interest") ? (
                  <FieldNote>
                    {acquisitionCopy.briefSupport}
                  </FieldNote>
                ) : null}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={acquisitionWhatsAppState.loading}
                  className="h-[3.85rem] w-full rounded-full bg-[#efe5d7] text-[#151210] shadow-[0_12px_28px_rgba(239,229,215,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7]"
                >
                  {acquisitionWhatsAppState.loading
                    ? acquisitionCopy.retainingBrief
                    : acquisitionCopy.retainBrief}
                </Button>
              </div>

              <AnimatePresence>
                {acquisitionWhatsAppState.success ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease: easeLuxury }}
                    className="overflow-hidden rounded-[1.5rem] border border-[#2b211b] bg-[#0d0b0a] shadow-[0_20px_48px_rgba(0,0,0,0.22)]"
                  >
                    <div className="border-b border-white/[0.08] px-5 py-4">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                        {acquisitionCopy.briefRetained}
                      </p>
                      <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7]">
                        {acquisitionWhatsAppState.reference ||
                          acquisitionCopy.referencePending}
                      </p>
                    </div>
                    <div className="space-y-4 px-5 py-5">
                      <p className="text-sm leading-6 text-white/62">
                        {acquisitionWhatsAppState.serviceMessage}
                      </p>
                      <div className="rounded-[1.2rem] border border-white/[0.08] bg-white/[0.018] p-4 text-sm leading-6 text-white/58">
                        {acquisitionCopy.briefRetainedBody}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {acquisitionWhatsAppState.error ? (
                <div className="rounded-[1.35rem] border border-[#65413a] bg-[#160e0d] p-4 text-sm leading-6 text-[#f0c1b8]">
                  {acquisitionWhatsAppState.error}
                </div>
              ) : null}

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.assign(whatsappGeneralLink);
                  }
                }}
                className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
              >
                {acquisitionCopy.openWithoutBrief}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );

  const renderMobileWaitlistPage = () => (
    <>
      <MobilePageHeroBanner
        eyebrow={localizedRouteTitles["/waitlist"]}
        title={waitlistCopy.heroTitle}
        description={waitlistCopy.heroDescription}
        note={waitlistCopy.heroNote}
        actions={[
          {
            label: waitlistCopy.directInquiry,
            href: whatsappGeneralLink,
            variant: "primary",
          },
          {
            label: waitlistCopy.contact,
            onClick: () => goTo("/contact"),
            variant: "secondary",
          },
        ]}
        stats={pageHeroStats["/waitlist"]}
      />

      <MobileSectionFrame
        eyebrow={localizedRouteTitles["/waitlist"]}
        title={waitlistCopy.introTitle}
        description={waitlistCopy.introDescription}
      >
        <MobileEditorialLedger
          items={[
            {
              title: waitlistCopy.review,
              text: waitlistCopy.reviewText,
            },
            {
              title: waitlistCopy.reference,
              text: waitlistCopy.referenceText,
            },
            {
              title: waitlistCopy.continuation,
              text: waitlistCopy.continuationText,
            },
          ]}
        />
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="Future allocation register"
        title="Interest should have a place before inventory exists."
        description="The waitlist is a quiet register for future issue, collector posture, and timing before direct correspondence becomes necessary."
      >
        <MobileEditorialLedger items={waitlistCollectorSignals} />
      </MobileSectionFrame>

      <section className="relative py-7">
        <Container>
          <div className="rounded-[2.05rem] border border-white/[0.075] bg-[linear-gradient(180deg,rgba(15,14,13,0.9),rgba(7,7,6,0.98))] p-6 shadow-[0_30px_96px_rgba(0,0,0,0.34)]">
            <div className="pointer-events-none mx-auto mb-6 h-px w-2/3 bg-[linear-gradient(90deg,transparent,rgba(214,186,149,0.58),transparent)]" />
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
                placeholder={waitlistCopy.titlePlaceholder}
                options={titleOptions}
                searchable
                searchPlaceholder={waitlistCopy.titleSearch}
                fieldLabel={waitlistCopy.titleLabel}
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
                  placeholder={waitlistCopy.fullNamePlaceholder}
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
                  placeholder={waitlistCopy.emailPlaceholder}
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
                  placeholder={waitlistCopy.countryPlaceholder}
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
                    maxLength={5}
                    placeholder={waitlistCopy.dialCodePlaceholder}
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
                    maxLength={15}
                    placeholder={waitlistCopy.phonePlaceholder}
                    invalid={Boolean(getVisibleFieldError("whatsapp"))}
                    success={getFieldSuccess("whatsapp")}
                    describedBy={getFieldDescribedBy("whatsapp")}
                  />
                  <FieldError id="whatsapp-error" message={getVisibleFieldError("whatsapp")} />
                  {!getVisibleFieldError("whatsapp") ? (
                    <FieldNote>
                      {waitlistCopy.phoneSupport}
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
                  placeholder={waitlistCopy.interestPlaceholder}
                  options={localizedInterestOptions}
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
                  placeholder={waitlistCopy.timelinePlaceholder}
                  options={localizedTimelineOptions}
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
                  placeholder={waitlistCopy.contactPlaceholder}
                  options={localizedContactPreferenceOptions}
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
                  className={`${formFieldBaseClass} min-h-[10.5rem] resize-none px-5 py-4 align-top ${getFormFieldStateClasses({})}`}
                  placeholder={waitlistCopy.notePlaceholder}
                />
                <FieldNote>
                  {waitlistCopy.noteSupport}
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
                        ? waitlistCopy.submitting
                        : getWaitlistCooldownSeconds() > 0
                          ? `${waitlistCopy.waitPrefix} ${getWaitlistCooldownSeconds()}s`
                          : waitlistCopy.joinWaitlist}
                    </span>
                  </span>
                </Button>
                <FieldNote>
                  {waitlistCopy.reviewTiming}
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
                        {waitlistCopy.inquiryReceived}
                      </p>
                      <p className="mt-3 rounded-[1rem] border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-base font-medium tracking-[0.08em] text-[#f4efe7]">
                        {waitlistState.reference || waitlistCopy.referencePending}
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
                            {waitlistCopy.continueWhatsapp}
                          </a>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => goTo("/")}
                          className="rounded-full border-white/15 bg-transparent px-5 text-[#f4efe7] transition duration-500 hover:border-white/20 hover:bg-white/5"
                        >
                          {waitlistCopy.returnHome}
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
        eyebrow={localizedRouteTitles["/contact"]}
        title={contactCopy.heroTitle}
        description={contactCopy.heroDescription}
        actions={[
          { label: contactCopy.primaryCta, href: whatsappGeneralLink, variant: "primary" },
          { label: contactCopy.secondaryCta, onClick: () => goTo("/waitlist"), variant: "secondary" },
        ]}
        media={{
          image: visImageSources.packaging,
          alt: "Praeliator contact hero",
          video: homeCinematicMedia.ownership.video,
          badge: localizedRouteTitles["/contact"],
          overlayTitle: "One voice, across every channel.",
        }}
        stats={pageHeroStats["/contact"]}
      />

      <MobileSectionFrame
        eyebrow={contactCopy.primaryCta}
        title={contactCopy.primaryTitle}
        description={contactCopy.primaryDescription}
      >
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="h-[3.6rem] rounded-full bg-[#efe5d7] px-6 text-sm text-[#151210]"
          >
            <a href={whatsappGeneralLink} target="_blank" rel="noreferrer">
              {contactCopy.openWhatsapp}
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => goTo("/waitlist")}
            className="h-[3.6rem] rounded-full border-white/15 bg-transparent px-6 text-sm text-[#f4efe7]"
          >
            {contactCopy.quieterEntry}
          </Button>
        </div>
      </MobileSectionFrame>

      <MobileSectionFrame
        eyebrow="House correspondence"
        title="Contact is part of the object route."
        description="Email stays useful for slower exchanges. Instagram stays useful for presence, while WhatsApp remains the acquisition line."
      >
        <MobileEditorialLedger
          items={[
            ...contactChannels.map((channel) => ({
              title: `${channel.role} / ${channel.title}`,
              text: channel.text,
            })),
            ...contactPrinciples,
          ]}
        />
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
        <div className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {contactEmailDirectory.map((entry) => (
            <a
              key={entry.address}
              href={entry.href}
              className="block py-5 transition duration-500 hover:text-white"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#b9a18d]">
                {entry.label}
              </p>
              <p className="mt-3 text-sm text-[#f4efe7]">{entry.address}</p>
              <p className="mt-2 text-sm leading-7 text-white/56">{entry.note}</p>
            </a>
          ))}
        </div>
      </MobileSectionFrame>
    </>
  );

  const renderAuthShell = ({
    eyebrow,
    title,
    description,
    form,
    asideTitle,
    asideText,
    shellTone = "midnight",
    shellNote,
  }: {
    eyebrow: string;
    title: string;
    description: string;
    form: React.ReactNode;
    asideTitle: string;
    asideText: string;
    shellTone?: "midnight" | "archive";
    shellNote?: string;
  }) => {
    const archiveTone = shellTone === "archive";
    const sectionBackground = archiveTone
      ? "bg-[radial-gradient(circle_at_top,rgba(214,186,149,0.12),transparent_30%),linear-gradient(180deg,#e8dccd_0%,#d9cab8_56%,#cbbba8_100%)] text-[#231b15]"
      : "bg-[radial-gradient(circle_at_top,rgba(188,151,122,0.12),transparent_34%)]";
    const introPanel = archiveTone
      ? "border-[#c6b39b] bg-[linear-gradient(180deg,rgba(247,241,232,0.98),rgba(234,225,214,0.96))] text-[#231b15] shadow-[0_28px_80px_rgba(77,53,30,0.18)]"
      : "border-white/10 bg-[linear-gradient(180deg,rgba(15,13,12,0.96),rgba(10,9,8,0.94))] text-[#f4efe7] shadow-[0_32px_90px_rgba(0,0,0,0.38)]";
    const asidePanel = archiveTone
      ? "border-[#d5c7b4] bg-[#f7f1e8]/88"
      : "border-white/10 bg-white/[0.025]";
    const formPanel = archiveTone
      ? "border-[#cdbca7] bg-[linear-gradient(180deg,rgba(249,243,235,0.98),rgba(236,227,214,0.97))] text-[#231b15] shadow-[0_28px_80px_rgba(77,53,30,0.18)]"
      : "border-white/10 bg-[linear-gradient(180deg,rgba(17,16,15,0.84),rgba(12,11,10,0.9))] text-[#f4efe7] shadow-[0_30px_80px_rgba(0,0,0,0.28)]";
    const bodyText = archiveTone ? "text-[#45382d]" : "text-white/60";
    const noteText = archiveTone ? "text-[#655242]" : "text-white/42";
    const titleClass = archiveTone
      ? "ownership-display mt-4 text-[clamp(2.55rem,10vw,4.9rem)] font-semibold leading-[0.82] tracking-[-0.055em]"
      : "mt-5 text-[clamp(2.5rem,9vw,3rem)] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-5xl";

    return (
    <section className="relative min-h-[100svh] overflow-hidden pb-8 pt-[5.85rem] sm:pb-12 sm:pt-32 lg:pb-16 lg:pt-36">
      <div className={`absolute inset-0 ${sectionBackground}`} />
      <Container className="relative">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-[0.88fr_1.12fr] md:items-stretch">
          <Reveal className="flex">
            <div className={`relative flex h-full overflow-hidden rounded-[1.85rem] border p-5 sm:rounded-[2rem] sm:p-8 lg:p-10 ${introPanel}`}>
              {archiveTone ? (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,186,149,0.2),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0))]" />
                  <OwnershipWatermark
                    className="right-[-2rem] top-[-1.5rem] h-32 w-32 sm:h-40 sm:w-40"
                    opacityClassName="opacity-[0.055]"
                  />
                </>
              ) : null}
              <div className="relative flex h-full w-full flex-col justify-between">
                <div>
                  <p className="ownership-kicker text-[10px] uppercase tracking-[0.32em] text-[#b9a18d] sm:text-xs">
                    {eyebrow}
                  </p>
                  <h1 className={titleClass}>
                    {title}
                  </h1>
                  <p className={`mt-5 max-w-xl text-[0.96rem] leading-7 sm:mt-6 sm:text-base sm:leading-8 ${bodyText}`}>
                    {description}
                  </p>
                  {shellNote ? (
                    <p className={`mt-6 max-w-xl text-[11px] uppercase tracking-[0.24em] ${noteText}`}>
                      {shellNote}
                    </p>
                  ) : null}
                </div>
                <div className={`mt-7 rounded-[1.45rem] border p-4 sm:mt-8 sm:rounded-[1.6rem] sm:p-5 ${asidePanel}`}>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#b9a18d]">
                    {asideTitle}
                  </p>
                  <p className={`mt-3 text-sm leading-7 ${bodyText}`}>{asideText}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className={`relative overflow-hidden rounded-[1.85rem] border p-5 sm:rounded-[2rem] sm:p-8 lg:p-10 ${formPanel}`}>
              {archiveTone ? (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))]" />
                  <OwnershipWatermark
                    className="bottom-[-2rem] right-[-2rem] h-28 w-28 sm:h-36 sm:w-36"
                    opacityClassName="opacity-[0.045]"
                  />
                </>
              ) : null}
              <div className="relative">
                {authNotice ? (
                  <div className="mb-5">
                    <AuthStatusNotice notice={authNotice} />
                  </div>
                ) : null}
                {form}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
    );
  };
  const renderSignInPage = () =>
    renderAuthShell({
      eyebrow: localizedRouteMicroLabels["/sign-in"],
      title: authCopy.signInTitle,
      description: authCopy.signInDescription,
      asideTitle: authCopy.signInAsideTitle,
      asideText: authCopy.signInAsideText,
      shellTone: "archive",
      shellNote: "Private access / ownership continuity / house memory",
      form: (
        <form className="grid gap-4" onSubmit={handleSignIn}>
          <label className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.email}</span>
            <input
              id="sign-in-email"
              name="email"
              type="email"
              autoComplete="username"
              value={signInForm.email}
              onChange={(event) =>
                setSignInForm((current) => ({ ...current, email: event.target.value }))
              }
              className={archiveAuthInputClass}
              placeholder={authCopy.emailPlaceholder}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.password}</span>
            <PasswordField
              id="sign-in-password"
              name="password"
              autoComplete="current-password"
              value={signInForm.password}
              onChange={(event) =>
                setSignInForm((current) => ({ ...current, password: event.target.value }))
              }
              className={archiveAuthInputClass}
              placeholder={authCopy.currentPasswordPlaceholder}
            />
          </label>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              disabled={authLoading || !authInitialized}
              className={archiveAuthPrimaryButtonClass}
            >
              {authLoading ? authCopy.signInSubmitting : authCopy.signInSubmit}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/forgot-password")}
              className={archiveAuthSecondaryButtonClass}
            >
              {authCopy.forgotPassword}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/magic-link")}
              className={archiveAuthSecondaryButtonClass}
            >
              {authCopy.oneTimeCode}
            </Button>
          </div>
          <div className={archiveAuthInlineCopyClass}>
            {authCopy.noAccountYet}
            <button
              type="button"
              onClick={() => goTo("/sign-up")}
              className={archiveAuthInlineLinkClass}
            >
              {authCopy.createOne}
            </button>
          </div>
        </form>
      ),
    });

  const renderSignUpPage = () =>
    renderAuthShell({
      eyebrow: localizedRouteMicroLabels["/sign-up"],
      title: authCopy.signUpTitle,
      description: authCopy.signUpDescription,
      asideTitle: authCopy.signUpAsideTitle,
      asideText: authCopy.signUpAsideText,
      shellTone: "archive",
      shellNote: "Private access / ownership continuity / house memory",
      form: (
        <form className="grid gap-4" onSubmit={handleSignUp}>
          <label className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.fullName}</span>
            <input
              id="sign-up-full-name"
              name="name"
              type="text"
              autoComplete="name"
              autoCapitalize="words"
              value={signUpForm.fullName}
              onChange={(event) =>
                setSignUpForm((current) => ({ ...current, fullName: event.target.value }))
              }
              className={archiveAuthInputClass}
              placeholder={authCopy.fullNamePlaceholder}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.email}</span>
            <input
              id="sign-up-email"
              name="email"
              type="email"
              autoComplete="email"
              value={signUpForm.email}
              onChange={(event) =>
                setSignUpForm((current) => ({ ...current, email: event.target.value }))
              }
              className={archiveAuthInputClass}
              placeholder={authCopy.emailPlaceholder}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.password}</span>
              <PasswordField
                id="sign-up-password"
                name="new-password"
                autoComplete="new-password"
                value={signUpForm.password}
                onChange={(event) =>
                  setSignUpForm((current) => ({ ...current, password: event.target.value }))
                }
                className={archiveAuthInputClass}
                placeholder={authCopy.minimumPasswordPlaceholder}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.confirmPassword}</span>
              <PasswordField
                id="sign-up-confirm-password"
                name="confirm-password"
                autoComplete="new-password"
                value={signUpForm.confirmPassword}
                onChange={(event) =>
                  setSignUpForm((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                className={archiveAuthInputClass}
                placeholder={authCopy.repeatPasswordPlaceholder}
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              disabled={authLoading}
              className={archiveAuthPrimaryButtonClass}
            >
              {authLoading ? authCopy.signUpSubmitting : authCopy.signUpSubmit}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/sign-in")}
              className={archiveAuthSecondaryButtonClass}
            >
              {authCopy.returnToSignIn}
            </Button>
          </div>
          <div className={archiveAuthInlineCopyClass}>
            {authCopy.alreadyUnderHouse}
            <button
              type="button"
              onClick={() => goTo("/magic-link")}
              className={archiveAuthInlineLinkClass}
            >
              {authCopy.useOneTimeCode}
            </button>
          </div>
        </form>
      ),
    });

  const renderMagicLinkPage = () =>
    renderAuthShell({
      eyebrow: localizedRouteMicroLabels["/magic-link"],
      title: authCopy.magicTitle,
      description: authCopy.magicDescription,
      asideTitle: authCopy.magicAsideTitle,
      asideText: authCopy.magicAsideText,
      shellTone: "archive",
      shellNote: "One-time code / private access / restrained entry",
      form: (
        <form className="grid gap-4" onSubmit={handleMagicLink}>
          <label className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.email}</span>
            <input
              id="one-time-code-email"
              name="email"
              type="email"
              autoComplete="username"
              value={magicLinkEmail}
              onChange={(event) => setMagicLinkEmail(event.target.value)}
              className={archiveAuthInputClass}
              placeholder={authCopy.emailPlaceholder}
            />
          </label>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              disabled={authLoading}
              className={archiveAuthPrimaryButtonClass}
            >
              {authLoading ? authCopy.magicSubmitting : authCopy.magicSubmit}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/sign-in")}
              className={archiveAuthSecondaryButtonClass}
            >
              {authCopy.returnToSignIn}
            </Button>
          </div>
        </form>
      ),
    });

  const renderPhoneAccessPage = () =>
    renderAuthShell({
      eyebrow: "Access",
      title: "Request a phone verification code.",
      description:
        "Phone access sends a six-digit SMS code to the number you enter here. This route can be used for sign-in or first access, depending on how phone auth is configured in Supabase.",
      asideTitle: "Phone verification",
      asideText:
        "Use full international formatting, including the + and country code. Supabase must have a supported SMS provider configured before this route can deliver codes.",
      form: (
        <form className="grid gap-4" onSubmit={handlePhoneAccess}>
          <label className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">Phone</span>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={phoneAccessForm.phone}
              onChange={(event) =>
                setPhoneAccessForm({ phone: event.target.value })
              }
              className={`${formFieldBaseClass} min-h-[3.4rem]`}
              placeholder="+52 55 1234 5678"
            />
          </label>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              disabled={authLoading}
              className="rounded-full bg-[#efe5d7] px-7 py-6 text-sm text-[#151210] shadow-[0_14px_36px_rgba(239,229,215,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#e4d7c7] disabled:pointer-events-none disabled:opacity-60"
            >
              {authLoading ? "Sending code..." : "Send Phone Code"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/sign-in")}
              className="rounded-full border-white/15 bg-transparent px-7 py-6 text-sm text-[#f4efe7] transition duration-500 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5"
            >
              Return to Sign In
            </Button>
          </div>
        </form>
      ),
    });

  const renderVerifyEmailPage = () =>
    renderAuthShell({
      eyebrow: "Verification",
      title: verifyEmailState.status === "pending" ? "Verifying under the house." : verifyEmailState.title,
      description: verifyEmailState.body,
      asideTitle:
        otpVerification.flow === "phone"
          ? "Phone verification"
          : otpVerification.flow === "one-time-code"
            ? "One-time code"
            : "Private confirmation",
      asideText:
        otpVerification.active
          ? otpVerification.flow === "sign-up"
            ? "Enter the six-digit confirmation code sent to your email to complete account creation under the house."
            : "Enter the six-digit sign-in code sent to your email to continue into Praeliator without a password."
          : "Email confirmations and secure account recovery continue through this dedicated Praeliator route.",
      shellTone: "archive",
      shellNote: "Verification / controlled entry / private identity",
      form: otpVerification.active && verifyEmailState.status !== "pending" ? (
        <div className="grid gap-4">
          <div className={archiveAuthNoticeSurfaceClass}>
            <AuthStatusNotice
              notice={{
                tone:
                  verifyEmailState.status === "error"
                    ? "error"
                    : verifyEmailState.status === "success"
                      ? "success"
                      : "info",
                title: verifyEmailState.title,
                body: verifyEmailState.body,
              }}
            />
          </div>
          {verifyEmailState.status !== "success" ? (
            <form className="grid gap-4" onSubmit={handleVerifyEmailCode}>
              <label className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{otpVerification.channel === "phone" ? "Phone" : "Email"}</span>
                <input
                  type={otpVerification.channel === "phone" ? "tel" : "email"}
                  value={otpVerification.identity}
                  readOnly
                  className={archiveAuthInputMutedClass}
                />
              </label>
              <div className="grid gap-2">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">Six-digit code</span>
                <OtpCodeField
                  value={otpVerification.token}
                  onChange={(next) =>
                    setOtpVerification((current) => ({
                      ...current,
                      token: next,
                    }))
                  }
                  disabled={authLoading}
                  tone="archive"
                />
              </div>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
                <Button
                  type="submit"
                  disabled={authLoading}
                  className={archiveAuthPrimaryButtonClass}
                >
                  {authLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    clearPendingOtp();
                    goTo("/sign-in");
                  }}
                  className={archiveAuthSecondaryButtonClass}
                >
                  Return to Sign In
                </Button>
              </div>
              {otpVerification.channel === "email" &&
              (otpVerification.flow === "sign-up" ||
                otpVerification.flow === "one-time-code") ? (
                <div className="rounded-[1.35rem] border border-[#d8c9b5] bg-[#fbf6ef]/72 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid gap-2">
                      <p className="text-sm leading-6 text-[#5f4f42]">
                        If the code has not arrived, another may be issued after one minute.
                      </p>
                      {verifyResendState.isCoolingDown ? (
                        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#8b735b]">
                          <span>Available again in</span>
                          <span className="inline-flex rounded-full border border-[#cfb99b] bg-[#f7efe4] px-3 py-1 text-[#5f4f42]">
                            {formatAuthResendCountdown(verifyResendState.secondsRemaining)}
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        void handleResendVerificationCode();
                      }}
                      disabled={authLoading || verifyResendState.isCoolingDown}
                      className="inline-flex items-center justify-center rounded-full border border-[#bfa486] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#5f4f42] transition duration-300 hover:border-[#9e7d5a] hover:text-[#2f241d] disabled:cursor-not-allowed disabled:border-[#d7c7b4] disabled:text-[#a3917f]"
                    >
                      {authLoading
                        ? "Sending..."
                        : verifyResendState.isCoolingDown
                          ? "Resend sealed"
                          : "Resend code"}
                    </button>
                  </div>
                </div>
              ) : null}
            </form>
          ) : (
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
              {verifyEmailState.ctaRoute && verifyEmailState.ctaLabel ? (
                <Button
                  type="button"
                  onClick={() => goTo(verifyEmailState.ctaRoute!)}
                  className={archiveAuthPrimaryButtonClass}
                >
                  {verifyEmailState.ctaLabel}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                onClick={() => goTo("/sign-in")}
                className={archiveAuthSecondaryButtonClass}
              >
                Return to Sign In
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          <div className={archiveAuthNoticeSurfaceClass}>
            {verifyEmailState.status === "pending" ? (
              <div className="flex items-center gap-3">
                <div className="browser-submit-spinner" />
                <p className="text-sm leading-7 text-[#5f4f42]">The link is being reviewed now.</p>
              </div>
            ) : (
              <AuthStatusNotice
                notice={{
                  tone: verifyEmailState.status === "error" ? "error" : verifyEmailState.status === "success" ? "success" : "info",
                  title: verifyEmailState.title,
                  body: verifyEmailState.body,
                }}
              />
            )}
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            {verifyEmailState.ctaRoute && verifyEmailState.ctaLabel ? (
              <Button
                type="button"
                onClick={() => goTo(verifyEmailState.ctaRoute!)}
                className={archiveAuthPrimaryButtonClass}
              >
                {verifyEmailState.ctaLabel}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/sign-in")}
              className={archiveAuthSecondaryButtonClass}
            >
              Return to Sign In
            </Button>
          </div>
        </div>
      ),
    });

  const renderOAuthConsentPage = () => (
    <OAuthConsentRoute
      authInitialized={authInitialized}
      authSession={authSession}
      goTo={goTo}
    />
  );

  const renderForgotPasswordPage = () =>
    renderAuthShell({
      eyebrow: localizedRouteMicroLabels["/forgot-password"],
      title: authCopy.forgotTitle,
      description: authCopy.forgotDescription,
      asideTitle: authCopy.forgotAsideTitle,
      asideText: authCopy.forgotAsideText,
      shellTone: "archive",
      shellNote: "Recovery / account continuity / private access",
      form: (
        <form className="grid gap-4" onSubmit={handleForgotPassword}>
          <label className="grid gap-2">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.email}</span>
            <input
              id="forgot-password-email"
              name="email"
              type="email"
              autoComplete="email"
              value={forgotPasswordEmail}
              onChange={(event) => setForgotPasswordEmail(event.target.value)}
              className={archiveAuthInputClass}
              placeholder={authCopy.emailPlaceholder}
            />
          </label>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              disabled={authLoading}
              className={archiveAuthPrimaryButtonClass}
            >
              {authLoading ? authCopy.forgotSubmitting : authCopy.forgotSubmit}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/sign-in")}
              className={archiveAuthSecondaryButtonClass}
            >
              {authCopy.returnToSignIn}
            </Button>
          </div>
          {authResendState.flow === "forgot-password" &&
          authResendState.identity === forgotPasswordEmail.trim().toLowerCase() ? (
            <div className="rounded-[1.35rem] border border-[#d8c9b5] bg-[#fbf6ef]/72 px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-2">
                  <p className="text-sm leading-6 text-[#5f4f42]">
                    The recovery route can be issued again after one minute.
                  </p>
                  {forgotPasswordResendState.isCoolingDown ? (
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#8b735b]">
                      <span>Available again in</span>
                      <span className="inline-flex rounded-full border border-[#cfb99b] bg-[#f7efe4] px-3 py-1 text-[#5f4f42]">
                        {formatAuthResendCountdown(forgotPasswordResendState.secondsRemaining)}
                      </span>
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void handleResendForgotPassword();
                  }}
                  disabled={authLoading || forgotPasswordResendState.isCoolingDown}
                  className="inline-flex items-center justify-center rounded-full border border-[#bfa486] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#5f4f42] transition duration-300 hover:border-[#9e7d5a] hover:text-[#2f241d] disabled:cursor-not-allowed disabled:border-[#d7c7b4] disabled:text-[#a3917f]"
                >
                  {authLoading
                    ? "Sending..."
                    : forgotPasswordResendState.isCoolingDown
                      ? "Resend sealed"
                      : "Resend reset email"}
                </button>
              </div>
            </div>
          ) : null}
        </form>
      ),
    });

  const renderResetPasswordPage = () =>
    renderAuthShell({
      eyebrow: localizedRouteMicroLabels["/reset-password"],
      title: authCopy.resetTitle,
      description: authCopy.resetDescription,
      asideTitle: authCopy.resetAsideTitle,
      asideText:
        authSession
          ? "The recovery session is active. Set the new password to continue."
          : "Open the reset email again if the recovery session is no longer active.",
      shellTone: "archive",
      shellNote: "Recovery / account continuity / private access",
      form: (
        <form className="grid gap-4" onSubmit={handleResetPassword}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.newPassword}</span>
              <PasswordField
                autoComplete="new-password"
                value={resetPasswordForm.password}
                onChange={(event) =>
                  setResetPasswordForm((current) => ({ ...current, password: event.target.value }))
                }
                className={archiveAuthInputClass}
                placeholder={authCopy.minimumPasswordPlaceholder}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-[11px] uppercase tracking-[0.24em] text-[#b9a18d]">{authCopy.confirmPassword}</span>
              <PasswordField
                autoComplete="new-password"
                value={resetPasswordForm.confirmPassword}
                onChange={(event) =>
                  setResetPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                }
                className={archiveAuthInputClass}
                placeholder={authCopy.repeatPasswordPlaceholder}
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap">
            <Button
              type="submit"
              disabled={authLoading || !authSession}
              className={archiveAuthPrimaryButtonClass}
            >
              {authLoading ? authCopy.resetSubmitting : authCopy.resetSubmit}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo("/sign-in")}
              className={archiveAuthSecondaryButtonClass}
            >
              {authCopy.returnToSignIn}
            </Button>
          </div>
        </form>
      ),
    });

  const handleRegisterPair = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client || !authSession) return;

    const serial = pairRegistrationForm.serial.trim().toUpperCase();
    const claimCode = pairRegistrationForm.claimCode.trim().toUpperCase();

    if (!serial || serial.length < 6) {
      setPairRegistrationError("Enter a valid serial number.");
      return;
    }

    if (!claimCode || claimCode.length < 6) {
      setPairRegistrationError("Enter the claim code from the authenticity card.");
      return;
    }

    setPairRegistrationError(null);
    setAuthLoading(true);
    setAuthNotice(null);
    try {
      const { error } = await client.rpc("claim_pair", {
        p_serial: serial,
        p_claim_code: claimCode,
      });

      if (error) {
        const normalized = error.message.toLowerCase();
        if (normalized.includes("already registered under this account")) {
          setPairRegistrationError("That serial is already registered under this account.");
        } else if (normalized.includes("already attached to another ownership record")) {
          setPairRegistrationError("This pair is already attached to another Ownership Record.");
        } else if (normalized.includes("claim code") || normalized.includes("not recognized")) {
          setPairRegistrationError("The claim code was not recognized for that serial.");
        } else if (normalized.includes("not found")) {
          setPairRegistrationError("That serial was not found in the house record.");
        } else {
          setPairRegistrationError(error.message);
        }
        return;
      }

      await loadOwnershipPairs();
      setPairRegistrationForm({ serial: "", claimCode: "" });
      setAuthNotice({
        tone: "success",
        title: "Pair registered",
        body: `Serial ${serial} has been attached to this Ownership Record.`,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleApplyLegacyRefresh = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const client = requireSupabase();
    if (!client || !authSession || !legacyRefreshDraftPairId) return;

    setLegacyRefreshError(null);
    setLegacyRefreshSubmitting(true);
    setAuthNotice(null);
    try {
      const { error } = await client.rpc("apply_legacy_refresh", {
        p_pair_id: legacyRefreshDraftPairId,
        p_note: legacyRefreshNote.trim() || null,
      });

      if (error) {
        const normalized = error.message.toLowerCase();
        if (normalized.includes("not yet eligible")) {
          setLegacyRefreshError("Legacy Refresh is still sealed for this pair. The ritual opens only after the recorded eligibility date.");
        } else if (normalized.includes("already has an active legacy refresh request")) {
          setLegacyRefreshError("A Legacy Refresh request is already active for this pair.");
        } else if (normalized.includes("not attached to this ownership record")) {
          setLegacyRefreshError("This pair is not attached to the current Ownership Record.");
        } else {
          setLegacyRefreshError(error.message);
        }
        return;
      }

      await loadOwnershipPairs();
      setLegacyRefreshDraftPairId(null);
      setLegacyRefreshNote("");
      setAuthNotice({
        tone: "success",
        title: "Legacy Refresh requested",
        body: "The application has entered private review under the house record.",
      });
    } finally {
      setLegacyRefreshSubmitting(false);
    }
  };

  const handleTransferReviewDraftChange = React.useCallback(
    (field: keyof OwnershipTransferReviewDraft, value: string) => {
      setTransferReviewDraft((current) => ({
        ...current,
        [field]: value,
      }));
    },
    [],
  );

  const handleExportOwnershipCertificate = React.useCallback(
    async (pair: RegisteredOwnershipPair | null) => {
      if (typeof window === "undefined" || !authSession) return;

      const activePair = pair ?? ownershipPairs[0] ?? null;
      const pairAge = activePair
        ? getPairAgeDescriptor(activePair.deliveryConfirmedAt)
        : {
            label: "Awaiting retained pair",
            detail:
              "The certificate will fill with maturity details once the first pair enters record.",
          };
      const serviceState = activePair
        ? getLegacyRefreshRecordState(activePair)
        : {
            label: "Record ready",
            detail:
              "The house reference is active and waiting for its first retained pair.",
          };

      try {
        await downloadOwnershipCertificatePdf({
          clientName: getOwnershipDisplayName(authSession),
          clientEmail: authSession.user.email ?? null,
          recordReference: getOwnershipRecordReference(authSession.user.id),
          issuedAtLabel: formatOwnershipDate(
            getOwnershipIssuedAt(authSession, ownershipPairs) ??
              authSession.user.created_at,
          ),
          pair: activePair
            ? {
                model: activePair.model,
                serial: activePair.serial,
                claimCodeLast4: activePair.claimCodeLast4,
                deliveryConfirmedAtLabel: formatOwnershipDate(
                  activePair.deliveryConfirmedAt,
                ),
                registeredAtLabel: formatOwnershipDate(activePair.registeredAt),
                eligibleOnLabel: formatOwnershipDate(
                  activePair.legacyRefreshEligibleOn,
                ),
              }
            : null,
          pairAgeLabel: pairAge.label,
          pairAgeDetail: pairAge.detail,
          serviceStateLabel: serviceState.label,
          serviceStateDetail: serviceState.detail,
          logoPath: brandAssetPaths.ownershipFaviconMark,
        });
        setAuthNotice({
          tone: "success",
          title: "Certificate prepared",
          body: activePair
            ? `A true PDF certificate for ${activePair.serial} has been prepared under the house record.`
            : "A true PDF certificate for the current Ownership Record has been prepared.",
        });
      } catch (error) {
        setAuthNotice({
          tone: "error",
          title: "Certificate unavailable",
          body:
            error instanceof Error
              ? error.message
              : "The certificate could not be prepared right now.",
        });
      }
    },
    [authSession, ownershipPairs],
  );

  const handleSubmitTransferReview = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (typeof window === "undefined" || !authSession || !transferReviewDraftPairId) {
      return;
    }

    const pair =
      ownershipPairs.find((item) => item.id === transferReviewDraftPairId) ?? null;
    if (!pair) return;

    const nextCustodianName = transferReviewDraft.nextCustodianName.trim();
    const nextCustodianEmail = transferReviewDraft.nextCustodianEmail.trim();
    const intendedTiming = transferReviewDraft.intendedTiming.trim();
    const note = transferReviewDraft.note.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nextCustodianName) {
      setTransferReviewError("State the intended next custodian before review can begin.");
      return;
    }

    if (!intendedTiming) {
      setTransferReviewError("State the intended transfer timing for the house review.");
      return;
    }

    if (nextCustodianEmail && !emailPattern.test(nextCustodianEmail)) {
      setTransferReviewError("Enter a valid next-custodian email address or leave it blank.");
      return;
    }

    setTransferReviewError(null);
    setTransferReviewSubmitting(true);

    try {
      const response = await fetch(transferReviewEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Praeliator-Intake": "transfer-review",
        },
        body: JSON.stringify({
          currentOwnerName: getOwnershipDisplayName(authSession),
          currentOwnerEmail: authSession.user.email ?? "",
          recordReference: getOwnershipRecordReference(authSession.user.id),
          pairId: pair.id,
          pairSerial: pair.serial,
          deliveryConfirmedAt: pair.deliveryConfirmedAt,
          nextCustodianName,
          nextCustodianEmail,
          intendedTiming,
          note,
          sourceRoute: route,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Transfer review failed.");
      }

      setTransferReviewDraftPairId(null);
      setTransferReviewDraft(initialTransferReviewDraft);
      setAuthNotice({
        tone: "success",
        title: "Transfer review entered",
        body: result.reference
          ? `${pair.serial} has entered private review under reference ${result.reference}.`
          : `The transfer review for ${pair.serial} has entered private record.`,
      });
    } catch (error) {
      setTransferReviewError(
        error instanceof Error
          ? error.message
          : "Transfer review could not be entered right now.",
      );
    } finally {
      setTransferReviewSubmitting(false);
    }
  };

  const legacyRefreshDraftPair =
    ownershipPairs.find((pair) => pair.id === legacyRefreshDraftPairId) ?? null;
  const transferReviewDraftPair =
    ownershipPairs.find((pair) => pair.id === transferReviewDraftPairId) ?? null;
  const ownershipEligibleNowCount = ownershipPairs.filter(
    (pair) => pair.legacyRefreshEligible,
  ).length;
  const ownershipActiveReviewCount = ownershipPairs.filter((pair) => {
    if (!pair.legacyRefreshRequestStatus) return false;
    return !["declined", "withdrawn", "completed"].includes(
      pair.legacyRefreshRequestStatus,
    );
  }).length;
  const ownershipCompletedRefreshCount = ownershipPairs.filter(
    (pair) => pair.legacyRefreshRequestStatus === "completed",
  ).length;
  const nextLegacyRefreshPair =
    ownershipPairs
      .filter((pair) => !pair.legacyRefreshEligible)
      .sort(
        (left, right) =>
          new Date(left.legacyRefreshEligibleOn).getTime() -
          new Date(right.legacyRefreshEligibleOn).getTime(),
      )[0] ?? null;
  const ownershipChamberMarkers = [
    {
      label: "Threshold",
      value: "Identity confirmed under the house record.",
    },
    {
      label: "Registration",
      value: "Serial and claim code admit the pair into custody.",
    },
    {
      label: "Continuity",
      value: "Age, review, and return remain attached to one line.",
    },
  ];
  const ownershipContinuitySteps = [
    {
      step: "01",
      title: "Registration",
      text: "The pair enters by serial and claim code, not by a disposable browser state.",
    },
    {
      step: "02",
      title: "Maturation",
      text: "Legacy Refresh follows recorded delivery age, preserving the authority of the house timeline.",
    },
    {
      step: "03",
      title: "Private review",
      text: "A request is received, considered, and retained under the same record rather than handled as generic support.",
    },
    {
      step: "04",
      title: "Return under record",
      text: "The pair returns to the same ownership line it came from, keeping continuity visible and intact.",
    },
  ];

  const renderOwnershipRecordPage = () => {
    const ownershipClientName = getOwnershipDisplayName(authSession);
    const ownershipRecordReference = authSession
      ? getOwnershipRecordReference(authSession.user.id)
      : "OR-PRAE-0001";
    const ownershipIssuedAt = getOwnershipIssuedAt(authSession, ownershipPairs);
    const latestRetainedPair =
      [...ownershipPairs].sort(
        (left, right) =>
          new Date(right.registeredAt).getTime() -
          new Date(left.registeredAt).getTime(),
      )[0] ?? null;
    const ownershipInvitationLine = ownershipEligibleNowCount
      ? `${ownershipEligibleNowCount} retained pair${ownershipEligibleNowCount === 1 ? "" : "s"} may now proceed into Legacy Refresh.`
      : nextLegacyRefreshPair
        ? `${nextLegacyRefreshPair.serial} reaches eligibility on ${formatOwnershipDate(nextLegacyRefreshPair.legacyRefreshEligibleOn)}.`
        : ownershipPairs.length
          ? "Every retained pair has already crossed its Legacy Refresh threshold."
          : "The house is waiting for its first retained pair.";
    const ownershipReviewLine = ownershipActiveReviewCount
      ? `${ownershipActiveReviewCount} pair${ownershipActiveReviewCount === 1 ? "" : "s"} currently remain under private review.`
      : "No pair is under private review at this moment.";
    const ownershipCorrespondenceEntries = getOwnershipHouseCorrespondence({
      clientName: ownershipClientName,
      latestPair: latestRetainedPair,
      nextPair: nextLegacyRefreshPair,
      activeReviewCount: ownershipActiveReviewCount,
    });

    if (!authInitialized) {
      return (
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,171,129,0.18),transparent_32%),linear-gradient(180deg,#f3eadf_0%,#e8dac7_58%,#15100c_100%)] pt-28 sm:pt-32 lg:pt-36">
          <Container className="relative pb-12 sm:pb-14 lg:pb-16">
            <div className="ownership-grain relative overflow-hidden rounded-[2.4rem] border border-[#d5c3ab] bg-[linear-gradient(180deg,rgba(252,247,241,0.99),rgba(238,228,214,0.97))] p-6 text-[#231b15] shadow-[0_30px_90px_rgba(77,53,30,0.16)] sm:p-8">
              <OwnershipWatermark
                className="right-[-2rem] top-[-2rem] h-40 w-40 sm:h-48 sm:w-48"
                opacityClassName="opacity-[0.05]"
              />
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                Ownership Record
              </p>
              <h1 className="ownership-display mt-4 max-w-[12ch] text-[3.25rem] font-semibold leading-[0.82] tracking-[-0.055em] text-[#231b15] sm:text-[4rem]">
                Preparing the private archive.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#433429]">
                The current client line is being restored now. Registered pairs,
                delivery age, and Legacy Refresh continuity will appear here once
                the session has been confirmed.
              </p>
            </div>
          </Container>
        </section>
      );
    }

    if (!authSession) {
      return (
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,171,129,0.2),transparent_32%),linear-gradient(180deg,#f3eadf_0%,#e8dac7_58%,#15100c_100%)] pt-28 sm:pt-32 lg:pt-36">
          <Container className="relative pb-12 sm:pb-14 lg:pb-16">
            {authNotice ? (
              <div className="mb-5 max-w-2xl">
                <AuthStatusNotice notice={authNotice} />
              </div>
            ) : null}
            <div className="ownership-grain relative overflow-hidden rounded-[2.6rem] border border-[#d4c2aa] bg-[linear-gradient(180deg,rgba(252,247,241,0.99),rgba(238,228,214,0.97))] text-[#231b15] shadow-[0_34px_100px_rgba(77,53,30,0.18)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[0.65rem] bg-[linear-gradient(180deg,#8d6741,#d8ba8a)]" />
              <OwnershipWatermark
                className="right-[-2.25rem] top-[-2.25rem] h-44 w-44 sm:h-56 sm:w-56"
                opacityClassName="opacity-[0.05]"
              />
              <div className="relative border-b border-[#d8c9b5] px-6 py-4 sm:px-8">
                <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.24em] text-[#8d755c] sm:flex-row sm:items-center sm:justify-between">
                  <span>Ownership Record / Access chamber</span>
                  <span>Private client line required</span>
                  <span>House memory begins after verification</span>
                </div>
              </div>
              <div className="relative grid gap-0 xl:grid-cols-[1.02fr_0.98fr]">
                <div className="border-b border-[#d8c9b5] p-6 sm:p-8 xl:border-b-0 xl:border-r xl:p-10">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                    Threshold chamber
                  </p>
                  <h1 className="ownership-display mt-5 max-w-[12ch] text-[3.35rem] font-semibold leading-[0.8] tracking-[-0.055em] text-[#231b15] sm:text-[4.4rem]">
                    This archive opens only under a verified client line.
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#433429]">
                    Sign in or create an account to enter the Ownership Record.
                    Once authenticated, registration, delivery age, and Legacy
                    Refresh continuity all remain under the same private line.
                  </p>
                  <div className="mt-8 max-w-2xl">
                    <OwnershipChamberSequence markers={ownershipChamberMarkers} />
                  </div>
                </div>
                <div className="p-6 sm:p-8 xl:p-10">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                    Access routes
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#433429]">
                    The private layer begins as a controlled threshold: identity
                    first, then ownership continuity, then service.
                  </p>
                  <div className="mt-6 grid gap-3">
                    <div className="rounded-[1.25rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Authentication
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#5b4c40]">
                        Email sign-in, account creation, verification, password
                        reset, and one-time access codes remain under the house.
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Ownership continuity
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#5b4c40]">
                        Pair registration, maturity, and future service all sit
                        behind this access line.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button
                      type="button"
                      onClick={() => goTo("/sign-in")}
                      className="rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410]"
                    >
                      {copy.signIn}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo("/sign-up")}
                      className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7]"
                    >
                      {ownershipCopy.createAccount}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      );
    }

    return (
      <>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,171,129,0.24),transparent_34%),linear-gradient(180deg,#f3eadf_0%,#eadccc_54%,#140f0b_100%)] pt-28 sm:pt-32 lg:pt-36">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,rgba(20,15,11,0),rgba(20,15,11,0.96))]" />
          <Container className="relative pb-12 sm:pb-14 lg:pb-16">
            {authNotice ? (
              <div className="mb-5 max-w-2xl">
                <AuthStatusNotice notice={authNotice} />
              </div>
            ) : null}

            <div className="ownership-grain relative overflow-hidden rounded-[2.75rem] border border-[#d4c2aa] bg-[linear-gradient(180deg,rgba(252,247,241,0.995),rgba(237,227,214,0.975))] text-[#231b15] shadow-[0_38px_120px_rgba(77,53,30,0.18)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[0.7rem] bg-[linear-gradient(180deg,#8a633e,#d8ba8a)]" />
              <OwnershipWatermark
                className="right-[-2.25rem] top-[-2.5rem] h-48 w-48 sm:h-60 sm:w-60"
                opacityClassName="opacity-[0.05]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,186,149,0.14),transparent_36%)]" />
              <div className="relative border-b border-[#d8c9b5] px-6 py-4 sm:px-8">
                <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.24em] text-[#8d755c] sm:flex-row sm:items-center sm:justify-between">
                  <span>Ownership Record / House archive</span>
                  <span>{ownershipRecordReference}</span>
                  <span>
                    Issued{" "}
                    {formatOwnershipDate(
                      ownershipIssuedAt ?? authSession.user.created_at,
                    )}
                  </span>
                </div>
              </div>

              <div className="relative grid gap-0 xl:grid-cols-[0.78fr_1.16fr_0.9fr]">
                <div className="border-b border-[#d8c9b5] p-6 sm:p-8 xl:border-b-0 xl:border-r">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                    Client line
                  </p>
                  <h2 className="ownership-display mt-5 max-w-[10ch] text-[3rem] font-semibold leading-[0.82] tracking-[-0.055em] text-[#231b15] sm:text-[3.6rem]">
                    {ownershipClientName}
                  </h2>
                  <p className="mt-4 break-all text-sm leading-7 text-[#5b4c40]">
                    {authSession.user.email ?? "Current client"}
                  </p>

                  <div className="mt-8 grid gap-4 border-t border-[#d8c9b5] pt-5">
                    <div className="grid gap-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        House reference
                      </p>
                      <p className="text-sm leading-7 text-[#231b15]">
                        {ownershipRecordReference}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Line issued
                      </p>
                      <p className="text-sm leading-7 text-[#231b15]">
                        {formatOwnershipDate(
                          ownershipIssuedAt ?? authSession.user.created_at,
                        )}
                      </p>
                    </div>
                    <div className="grid gap-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Latest retention
                      </p>
                      <p className="text-sm leading-7 text-[#231b15]">
                        {latestRetainedPair
                          ? `${latestRetainedPair.serial} / ${formatOwnershipDate(latestRetainedPair.registeredAt)}`
                          : "Awaiting first retained pair"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#d8c9b5] p-6 sm:p-8 xl:border-b-0 xl:border-r lg:p-10">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                    Record of Ownership
                  </p>
                  <h1 className="ownership-display mt-5 max-w-[12ch] text-[3.6rem] font-semibold leading-[0.78] tracking-[-0.06em] text-[#231b15] sm:text-[4.85rem]">
                    A private certificate of custody, continuity, and service.
                  </h1>
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-[#433429] sm:text-base sm:leading-8">
                    The Ownership Record is not an account center. It is the
                    authored register where pairs are retained under the house,
                    aged from recorded delivery, and advanced into Legacy Refresh
                    only when the object itself has matured.
                  </p>

                  <div className="mt-8 grid gap-0 border-y border-[#d8c9b5] sm:grid-cols-3">
                    <div className="border-b border-[#d8c9b5] px-0 py-4 sm:border-b-0 sm:border-r sm:px-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Retained pairs
                      </p>
                      <p className="mt-3 text-[2.75rem] font-semibold leading-none tracking-[-0.06em] text-[#231b15]">
                        {ownershipPairs.length}
                      </p>
                    </div>
                    <div className="border-b border-[#d8c9b5] px-0 py-4 sm:border-b-0 sm:border-r sm:px-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Eligible now
                      </p>
                      <p className="mt-3 text-[2.75rem] font-semibold leading-none tracking-[-0.06em] text-[#231b15]">
                        {ownershipEligibleNowCount}
                      </p>
                    </div>
                    <div className="px-0 py-4 sm:px-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Completed refreshes
                      </p>
                      <p className="mt-3 text-[2.75rem] font-semibold leading-none tracking-[-0.06em] text-[#231b15]">
                        {ownershipCompletedRefreshCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                    Current posture
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#433429]">
                    {ownershipInvitationLine}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#433429]">
                    {ownershipReviewLine}
                  </p>

                  <div className="mt-6">
                    <OwnershipChamberSequence markers={ownershipChamberMarkers} />
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={() =>
                        handleExportOwnershipCertificate(latestRetainedPair)
                      }
                      className="rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410]"
                    >
                      {ownershipCopy.exportCertificate}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (!latestRetainedPair) return;
                        setTransferReviewDraftPairId(latestRetainedPair.id);
                        setTransferReviewDraft(initialTransferReviewDraft);
                        setTransferReviewError(null);
                      }}
                      disabled={!latestRetainedPair}
                      className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-50"
                    >
                      {ownershipCopy.reviewTransfer}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSignOut}
                      className="rounded-full bg-[#201914] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.14)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#18120f] disabled:pointer-events-none disabled:opacity-60"
                      disabled={authLoading}
                    >
                      {authLoading
                        ? ownershipCopy.signingOut
                        : ownershipCopy.signOut}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="relative grid gap-0 border-t border-[#d8c9b5] xl:grid-cols-[1.18fr_0.82fr]">
                <form
                  className="border-b border-[#d8c9b5] p-6 sm:p-8 xl:border-b-0 xl:border-r lg:p-10"
                  onSubmit={handleRegisterPair}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                        Registration chamber
                      </p>
                      <h3 className="ownership-display mt-4 max-w-[12ch] text-[2.8rem] font-semibold leading-[0.82] tracking-[-0.05em] text-[#231b15] sm:text-[3.5rem]">
                        Registration is the first ceremonial act.
                      </h3>
                    </div>
                  </div>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[#433429]">
                    Serial and claim code admit a real pair into custody. Once
                    entered, the object keeps its recorded delivery date, service
                    maturity, and future review under this same line.
                  </p>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                        {ownershipCopy.serialNumber}
                      </span>
                      <input
                        type="text"
                        name="pairSerial"
                        value={pairRegistrationForm.serial}
                        onChange={(event) =>
                          setPairRegistrationForm((current) => ({
                            ...current,
                            serial: event.target.value
                              .replace(/[^a-zA-Z0-9-]/g, "")
                              .toUpperCase(),
                          }))
                        }
                        className={ownershipLightInputClass}
                        placeholder="PR-VIS-000001"
                        autoCapitalize="characters"
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                        {ownershipCopy.claimCode}
                      </span>
                      <input
                        type="text"
                        name="pairClaimCode"
                        value={pairRegistrationForm.claimCode}
                        onChange={(event) =>
                          setPairRegistrationForm((current) => ({
                            ...current,
                            claimCode: event.target.value
                              .replace(/[^a-zA-Z0-9]/g, "")
                              .toUpperCase(),
                          }))
                        }
                        className={ownershipLightInputClass}
                        placeholder="A1B2C3D4"
                        autoCapitalize="characters"
                      />
                    </label>
                  </div>

                  <div className="mt-5 rounded-[1.35rem] border border-[#dbcab5] bg-[#f8f1e7] px-4 py-4 text-sm leading-7 text-[#433429]">
                    A claim code is consumed once. The pair then continues under
                    custody, recorded age, and future service review rather than
                    anonymous product ownership.
                  </div>

                  {pairRegistrationError ? (
                    <p className="mt-4 text-sm leading-6 text-[#a25d50]">
                      {pairRegistrationError}
                    </p>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button
                      type="submit"
                      disabled={authLoading || ownershipLoading}
                      className="rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_16px_40px_rgba(35,27,21,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410] disabled:pointer-events-none disabled:opacity-60"
                    >
                      {authLoading
                        ? "Registering pair..."
                        : ownershipCopy.registerPair}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setPairRegistrationForm({ serial: "", claimCode: "" })
                      }
                      disabled={authLoading || ownershipLoading}
                      className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-60"
                    >
                      Clear
                    </Button>
                  </div>
                </form>

                <div className="p-6 sm:p-8 lg:p-10">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                    House cadence
                  </p>
                  <h3 className="ownership-display mt-4 max-w-[12ch] text-[2.4rem] font-semibold leading-[0.84] tracking-[-0.05em] text-[#231b15] sm:text-[3rem]">
                    The record decides when the next invitation opens.
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-[#433429]">
                    Legacy Refresh never opens because a form exists. It opens
                    because the retained pair has reached the date the house
                    recorded for it.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-[1.25rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Next invitation
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#433429]">
                        {nextLegacyRefreshPair
                          ? `${nextLegacyRefreshPair.serial} opens on ${formatOwnershipDate(nextLegacyRefreshPair.legacyRefreshEligibleOn)}.`
                          : ownershipPairs.length
                            ? "Every retained pair has already crossed its Legacy Refresh threshold."
                            : "The first invitation appears only after the first retained pair is recorded."}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        Latest retention
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#433429]">
                        {latestRetainedPair
                          ? `${latestRetainedPair.serial} entered the record on ${formatOwnershipDate(latestRetainedPair.registeredAt)}.`
                          : "No pair has yet been retained under this line."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-10 sm:py-12 lg:py-14">
          <Container>
            <div className="grid gap-10 xl:grid-cols-[1.12fr_0.88fr]">
              <div>
                <div className="border-b border-white/10 pb-6">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#c7a97e]">
                    Ownership chamber
                  </p>
                  <h2 className="ownership-display mt-4 max-w-[13ch] text-[3rem] font-semibold leading-[0.86] tracking-[-0.055em] text-[#f3e8d8] sm:text-[3.85rem]">
                    Every retained pair should feel singular in the archive.
                  </h2>
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-white/78">
                    The folios below are object records: dated from delivery,
                    held under custody, and advanced into service only when the
                    pair has earned that progression under the house rules.
                  </p>
                </div>

                {ownershipPairs.length ? (
                  <div className="mt-6 grid gap-5">
                    {ownershipPairs.map((pair, index) => (
                      <OwnershipPairFolio
                        key={pair.id}
                        pair={pair}
                        index={index}
                        onEnterLegacyRefresh={(selectedPair) => {
                          setLegacyRefreshDraftPairId(selectedPair.id);
                          setLegacyRefreshNote(
                            selectedPair.legacyRefreshNote || "",
                          );
                          setLegacyRefreshError(null);
                        }}
                        onOpenTransferReview={(selectedPair) => {
                          setTransferReviewDraftPairId(selectedPair.id);
                          setTransferReviewDraft(initialTransferReviewDraft);
                          setTransferReviewError(null);
                        }}
                        onExportCertificate={handleExportOwnershipCertificate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="ownership-grain mt-6 overflow-hidden rounded-[2rem] border border-[#d6c7b3] bg-[linear-gradient(180deg,rgba(251,246,239,0.98),rgba(236,226,214,0.96))] p-6 text-[#231b15] shadow-[0_24px_60px_rgba(77,53,30,0.12)] sm:p-7">
                    <p className="text-[11px] uppercase tracking-[0.26em] text-[#9f7d58]">
                      Ownership chamber
                    </p>
                    <h3 className="ownership-display mt-4 max-w-[12ch] text-[2.5rem] font-semibold leading-[0.84] tracking-[-0.05em] text-[#231b15] sm:text-[3rem]">
                      No pair is under record yet.
                    </h3>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-[#433429]">
                      Registration is still the first step. Once a real pair is
                      retained, the archive begins to show age, eligibility, and
                      future continuity.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-5">
                <div className="ownership-grain relative overflow-hidden rounded-[1.9rem] border border-[#cebca6] bg-[linear-gradient(180deg,rgba(247,240,232,0.98),rgba(233,223,210,0.96))] p-6 text-[#231b15] shadow-[0_24px_60px_rgba(77,53,30,0.14)] sm:p-7">
                  <OwnershipWatermark
                    className="right-[-1.5rem] top-[-1.5rem] h-32 w-32 sm:h-40 sm:w-40"
                    opacityClassName="opacity-[0.045]"
                  />
                  <div className="relative">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                      Continuity chamber
                    </p>
                    <div className="mt-5">
                      <OwnershipContinuityTimeline
                        steps={ownershipContinuitySteps}
                      />
                    </div>
                  </div>
                </div>

                <div className="ownership-grain relative overflow-hidden rounded-[1.9rem] border border-[#cebca6] bg-[linear-gradient(180deg,rgba(251,246,239,0.98),rgba(236,226,214,0.96))] p-6 text-[#231b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)] sm:p-7">
                  <OwnershipWatermark
                    className="bottom-[-1.75rem] right-[-1.75rem] h-28 w-28 sm:h-36 sm:w-36"
                    opacityClassName="opacity-[0.04]"
                  />
                  <div className="relative">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                      Certificate chamber
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#433429]">
                      Export a house-grade PDF certificate whenever the current
                      line needs an offline record of custody, delivery age, and
                      present service posture.
                    </p>

                    <div className="mt-5 grid gap-3">
                      <div className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                          House reference
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#231b15]">
                          {ownershipRecordReference}
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                          Current certificate pair
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#231b15]">
                          {latestRetainedPair
                            ? latestRetainedPair.serial
                            : "The first certificate will appear after the first retained pair."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <Button
                        type="button"
                        onClick={() =>
                          handleExportOwnershipCertificate(latestRetainedPair)
                        }
                        className="rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410]"
                      >
                        Export Current Certificate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="ownership-grain relative overflow-hidden rounded-[1.9rem] border border-[#cebca6] bg-[linear-gradient(180deg,rgba(247,240,232,0.98),rgba(233,223,210,0.96))] p-6 text-[#231b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)] sm:p-7">
                  <div className="relative">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                      Transfer review
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#433429]">
                      When custody is meant to continue under another client
                      line, the house reviews the transition before the record
                      is allowed to move.
                    </p>

                    <div className="mt-5 grid gap-3">
                      {ownershipTransferReviewStandards.map((item) => (
                        <div
                          key={item}
                          className="rounded-[1.2rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4"
                        >
                          <p className="text-sm leading-7 text-[#433429]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (!latestRetainedPair) return;
                          setTransferReviewDraftPairId(latestRetainedPair.id);
                          setTransferReviewDraft(initialTransferReviewDraft);
                          setTransferReviewError(null);
                        }}
                        disabled={!latestRetainedPair}
                        className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-50"
                      >
                        {latestRetainedPair
                          ? `Open Review For ${latestRetainedPair.serial}`
                          : "Awaiting first retained pair"}
                      </Button>
                    </div>
                  </div>
                </div>

                {latestRetainedPair ? (
                  <div className="ownership-grain relative overflow-hidden rounded-[1.9rem] border border-[#cebca6] bg-[linear-gradient(180deg,rgba(251,246,239,0.98),rgba(236,226,214,0.96))] p-6 text-[#231b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)] sm:p-7">
                    <div className="relative">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                        Current ledger
                      </p>
                      <p className="mt-4 text-sm leading-7 text-[#433429]">
                        The latest retained pair remains visible as a living
                        sequence of registration, age, and service posture.
                      </p>
                      <div className="mt-5">
                        <OwnershipServiceLedger pair={latestRetainedPair} />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-6 sm:py-8 lg:py-10">
          <Container>
            <div className="border-b border-white/10 pb-6">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c7a97e]">
                House correspondence
              </p>
              <h2 className="ownership-display mt-4 max-w-[12ch] text-[2.7rem] font-semibold leading-[0.86] tracking-[-0.055em] text-[#f3e8d8] sm:text-[3.4rem]">
                The archive should speak back.
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/78">
                Ownership feels deeper when the record produces correspondence:
                retention, invitation, review, and continuity framed as house
                memory rather than as software state.
              </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {ownershipCorrespondenceEntries.map((entry, index) => (
                <Reveal key={entry.title} delay={0.04 * index}>
                  <HouseLetterCard
                    eyebrow={entry.eyebrow}
                    title={entry.title}
                    body={entry.body}
                    signature={entry.signature}
                    className="h-full"
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <AnimatePresence>
          {legacyRefreshDraftPair ? (
            <LegacyRefreshChamberDialog
              pair={legacyRefreshDraftPair}
              note={legacyRefreshNote}
              error={legacyRefreshError}
              submitting={legacyRefreshSubmitting}
              onNoteChange={setLegacyRefreshNote}
              onClose={() => {
                setLegacyRefreshDraftPairId(null);
                setLegacyRefreshNote("");
                setLegacyRefreshError(null);
              }}
              onSubmit={handleApplyLegacyRefresh}
            />
          ) : null}
          {transferReviewDraftPair ? (
            <TransferReviewChamberDialog
              pair={transferReviewDraftPair}
              draft={transferReviewDraft}
              error={transferReviewError}
              submitting={transferReviewSubmitting}
              onDraftChange={handleTransferReviewDraftChange}
              onClose={() => {
                setTransferReviewDraftPairId(null);
                setTransferReviewDraft(initialTransferReviewDraft);
                setTransferReviewError(null);
              }}
              onSubmit={handleSubmitTransferReview}
            />
          ) : null}
        </AnimatePresence>
      </>
    );
  };

  const renderMobileOwnershipRecordPage = () => {
    const ownershipClientName = getOwnershipDisplayName(authSession);
    const ownershipRecordReference = authSession
      ? getOwnershipRecordReference(authSession.user.id)
      : "OR-PRAE-0001";
    const ownershipIssuedAt = getOwnershipIssuedAt(authSession, ownershipPairs);
    const latestRetainedPair =
      [...ownershipPairs].sort(
        (left, right) =>
          new Date(right.registeredAt).getTime() -
          new Date(left.registeredAt).getTime(),
      )[0] ?? null;
    const ownershipInvitationLine = ownershipEligibleNowCount
      ? `${ownershipEligibleNowCount} retained pair${ownershipEligibleNowCount === 1 ? "" : "s"} may now proceed into Legacy Refresh.`
      : nextLegacyRefreshPair
        ? `${nextLegacyRefreshPair.serial} reaches eligibility on ${formatOwnershipDate(nextLegacyRefreshPair.legacyRefreshEligibleOn)}.`
        : ownershipPairs.length
          ? "Every retained pair has already crossed its Legacy Refresh threshold."
          : "The house is waiting for its first retained pair.";
    const ownershipReviewLine = ownershipActiveReviewCount
      ? `${ownershipActiveReviewCount} pair${ownershipActiveReviewCount === 1 ? "" : "s"} currently remain under private review.`
      : "No pair is under private review at this moment.";
    const ownershipCorrespondenceEntries = getOwnershipHouseCorrespondence({
      clientName: ownershipClientName,
      latestPair: latestRetainedPair,
      nextPair: nextLegacyRefreshPair,
      activeReviewCount: ownershipActiveReviewCount,
    });

    if (!authInitialized) {
      return (
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,171,129,0.18),transparent_34%),linear-gradient(180deg,#f3eadf_0%,#e8dac7_58%,#15100c_100%)] pt-[5.85rem]">
          <Container className="relative pb-6">
            <div className="ownership-grain relative overflow-hidden rounded-[2rem] border border-[#d5c3ab] bg-[linear-gradient(180deg,rgba(252,247,241,0.99),rgba(238,228,214,0.97))] p-5 text-[#231b15] shadow-[0_30px_90px_rgba(77,53,30,0.16)]">
              <OwnershipWatermark
                className="right-[-1.75rem] top-[-1.75rem] h-36 w-36"
                opacityClassName="opacity-[0.05]"
              />
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#9f7d58]">
                Ownership Record
              </p>
              <h1 className="ownership-display mt-4 max-w-[10ch] text-[2.8rem] font-semibold leading-[0.82] tracking-[-0.055em] text-[#231b15]">
                Preparing the private archive.
              </h1>
              <p className="mt-5 text-sm leading-7 text-[#433429]">
                The current client line is being restored now. Registered pairs,
                delivery age, and Legacy Refresh continuity will appear here once
                the session has been confirmed.
              </p>
            </div>
          </Container>
        </section>
      );
    }

    if (!authSession) {
      return (
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,171,129,0.2),transparent_34%),linear-gradient(180deg,#f3eadf_0%,#e8dac7_58%,#15100c_100%)] pt-[5.85rem]">
          <Container className="relative pb-6">
            {authNotice ? (
              <div className="mb-4">
                <AuthStatusNotice notice={authNotice} />
              </div>
            ) : null}
            <div className="ownership-grain relative overflow-hidden rounded-[2rem] border border-[#d4c2aa] bg-[linear-gradient(180deg,rgba(252,247,241,0.99),rgba(238,228,214,0.97))] text-[#231b15] shadow-[0_34px_100px_rgba(77,53,30,0.18)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[0.55rem] bg-[linear-gradient(180deg,#8d6741,#d8ba8a)]" />
              <OwnershipWatermark
                className="right-[-1.5rem] top-[-1.5rem] h-36 w-36"
                opacityClassName="opacity-[0.05]"
              />
              <div className="relative p-5">
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#9f7d58]">
                  Threshold chamber
                </p>
                <h1 className="ownership-display mt-4 max-w-[9ch] text-[2.85rem] font-semibold leading-[0.8] tracking-[-0.055em] text-[#231b15]">
                  This archive opens only under a verified client line.
                </h1>
                <p className="mt-5 text-sm leading-7 text-[#433429]">
                  Sign in or create an account to enter the Ownership Record.
                  Once authenticated, registration, delivery age, and Legacy
                  Refresh continuity all remain under the same private line.
                </p>

                <div className="mt-6">
                  <OwnershipChamberSequence markers={ownershipChamberMarkers} />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={() => goTo("/sign-in")}
                    className="rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410]"
                  >
                    {copy.signIn}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goTo("/sign-up")}
                    className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7]"
                  >
                      {ownershipCopy.createAccount}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
      );
    }

    return (
      <>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(201,171,129,0.24),transparent_34%),linear-gradient(180deg,#f3eadf_0%,#eadccc_54%,#140f0b_100%)] pt-[5.85rem]">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(20,15,11,0),rgba(20,15,11,0.96))]" />
          <Container className="relative pb-6">
            {authNotice ? (
              <div className="mb-4">
                <AuthStatusNotice notice={authNotice} />
              </div>
            ) : null}

            <div className="ownership-grain relative overflow-hidden rounded-[2.15rem] border border-[#d4c2aa] bg-[linear-gradient(180deg,rgba(252,247,241,0.995),rgba(237,227,214,0.975))] text-[#231b15] shadow-[0_34px_110px_rgba(77,53,30,0.18)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[0.55rem] bg-[linear-gradient(180deg,#8a633e,#d8ba8a)]" />
              <OwnershipWatermark
                className="right-[-1.75rem] top-[-1.75rem] h-40 w-40"
                opacityClassName="opacity-[0.05]"
              />
              <div className="relative p-5">
                <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.22em] text-[#8d755c]">
                  <span>Ownership Record / House archive</span>
                  <span>{ownershipRecordReference}</span>
                  <span>
                    Issued{" "}
                    {formatOwnershipDate(
                      ownershipIssuedAt ?? authSession.user.created_at,
                    )}
                  </span>
                </div>

                <div className="mt-6 border-t border-[#d8c9b5] pt-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7d58]">
                    Client line
                  </p>
                  <h1 className="ownership-display mt-4 max-w-[10ch] text-[3rem] font-semibold leading-[0.8] tracking-[-0.06em] text-[#231b15]">
                    {ownershipClientName}
                  </h1>
                  <p className="mt-3 break-all text-sm leading-7 text-[#433429]">
                    {authSession.user.email ?? "Current client"}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#d8c9b5] pt-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7d58]">
                    Record of Ownership
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#433429]">
                    A private certificate of custody, continuity, and service.
                    Registered pairs remain tied to recorded delivery age and
                    advance into Legacy Refresh only when the object itself has
                    matured.
                  </p>
                </div>

                <div className="-mx-5 mt-6 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {[
                    { label: "Retained pairs", value: ownershipPairs.length },
                    { label: "Eligible now", value: ownershipEligibleNowCount },
                    { label: "Active review", value: ownershipActiveReviewCount },
                    {
                      label: "Completed refreshes",
                      value: ownershipCompletedRefreshCount,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="min-w-[9.4rem] rounded-[1.15rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4"
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                        {item.label}
                      </p>
                      <p className="mt-3 text-[2.25rem] font-semibold leading-none tracking-[-0.06em] text-[#231b15]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-[1.15rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                      Current posture
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#433429]">
                      {ownershipInvitationLine}
                    </p>
                  </div>
                  <div className="rounded-[1.15rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8d755c]">
                      Review posture
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#433429]">
                      {ownershipReviewLine}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <OwnershipChamberSequence markers={ownershipChamberMarkers} />
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={() =>
                      handleExportOwnershipCertificate(latestRetainedPair)
                    }
                    className="rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410]"
                  >
                    {ownershipCopy.exportCertificate}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!latestRetainedPair) return;
                      setTransferReviewDraftPairId(latestRetainedPair.id);
                      setTransferReviewDraft(initialTransferReviewDraft);
                      setTransferReviewError(null);
                    }}
                    disabled={!latestRetainedPair}
                    className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-50"
                  >
                    {ownershipCopy.reviewTransfer}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSignOut}
                    className="rounded-full bg-[#201914] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.14)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#18120f] disabled:pointer-events-none disabled:opacity-60"
                    disabled={authLoading}
                  >
                    {authLoading
                      ? ownershipCopy.signingOut
                      : ownershipCopy.signOut}
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-4">
          <Container>
            <div className="grid gap-4">
              <div className="ownership-grain relative overflow-hidden rounded-[1.8rem] border border-[#cebca6] bg-[linear-gradient(180deg,rgba(251,246,239,0.98),rgba(236,226,214,0.96))] p-5 text-[#231b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)]">
                <OwnershipWatermark
                  className="bottom-[-1.25rem] right-[-1.25rem] h-24 w-24"
                  opacityClassName="opacity-[0.04]"
                />
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7d58]">
                  Registration chamber
                </p>
                <h2 className="ownership-display mt-4 max-w-[10ch] text-[2.5rem] font-semibold leading-[0.84] tracking-[-0.05em] text-[#231b15]">
                  Register a pair under the house.
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#433429]">
                  Serial and claim code admit a real pair into custody. Once
                  entered, the object keeps its recorded delivery date, service
                  maturity, and future review under this same line.
                </p>

                <form className="mt-6 grid gap-4" onSubmit={handleRegisterPair}>
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                      {ownershipCopy.serialNumber}
                    </span>
                    <input
                      type="text"
                      name="pairSerial"
                      value={pairRegistrationForm.serial}
                      onChange={(event) =>
                        setPairRegistrationForm((current) => ({
                          ...current,
                          serial: event.target.value
                            .replace(/[^a-zA-Z0-9-]/g, "")
                            .toUpperCase(),
                        }))
                      }
                      className={ownershipLightInputClass}
                      placeholder="PR-VIS-000001"
                      autoCapitalize="characters"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#9f7d58]">
                      {ownershipCopy.claimCode}
                    </span>
                    <input
                      type="text"
                      name="pairClaimCode"
                      value={pairRegistrationForm.claimCode}
                      onChange={(event) =>
                        setPairRegistrationForm((current) => ({
                          ...current,
                          claimCode: event.target.value
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .toUpperCase(),
                        }))
                      }
                      className={ownershipLightInputClass}
                      placeholder="A1B2C3D4"
                      autoCapitalize="characters"
                    />
                  </label>

                  <div className="rounded-[1.15rem] border border-[#d8c9b5] bg-[#fbf6ef] p-4 text-sm leading-7 text-[#433429]">
                    The first claim is treated as an ownership act. Once the
                    pair is sealed under the record, future movement belongs to
                    release or review, not another open claim.
                  </div>

                  {pairRegistrationError ? (
                    <p className="text-sm leading-6 text-[#a25d50]">
                      {pairRegistrationError}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={authLoading || ownershipLoading}
                      className="rounded-full bg-[#231b15] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#1a1410] disabled:pointer-events-none disabled:opacity-60"
                    >
                      {authLoading
                        ? "Attaching pair..."
                        : ownershipCopy.registerPair}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setPairRegistrationForm({ serial: "", claimCode: "" })
                      }
                      disabled={authLoading || ownershipLoading}
                      className="rounded-full border-[#cdbca7] bg-transparent px-7 py-6 text-sm text-[#3f3126] transition duration-500 hover:-translate-y-0.5 hover:border-[#b69b7d] hover:bg-[#f8f1e7] disabled:pointer-events-none disabled:opacity-50"
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </div>

              <div className="ownership-grain relative overflow-hidden rounded-[1.8rem] border border-[#cebca6] bg-[linear-gradient(180deg,rgba(247,240,232,0.98),rgba(233,223,210,0.96))] p-5 text-[#231b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)]">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7d58]">
                  Continuity chamber
                </p>
                <p className="mt-4 text-sm leading-7 text-[#433429]">
                  Registration, maturation, private review, and return should
                  read as one continuous house logic.
                </p>
                <div className="mt-5">
                  <OwnershipContinuityTimeline steps={ownershipContinuitySteps} />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="relative py-4">
          <Container>
            <div className="border-b border-white/10 pb-5">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c7a97e]">
                Retained pairs
              </p>
              <h2 className="ownership-display mt-4 max-w-[10ch] text-[2.6rem] font-semibold leading-[0.84] tracking-[-0.055em] text-[#f3e8d8]">
                The archive should feel singular, even in sequence.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/78">
                Each retained pair holds identity, age, and service posture in a
                single authored folio.
              </p>
            </div>

            {ownershipPairs.length ? (
              <div className="mt-5 grid gap-4">
                {ownershipPairs.map((pair, index) => (
                  <OwnershipPairFolio
                    key={pair.id}
                    pair={pair}
                    index={index}
                    onEnterLegacyRefresh={(selectedPair) => {
                      setLegacyRefreshDraftPairId(selectedPair.id);
                      setLegacyRefreshNote(selectedPair.legacyRefreshNote || "");
                      setLegacyRefreshError(null);
                    }}
                    onOpenTransferReview={(selectedPair) => {
                      setTransferReviewDraftPairId(selectedPair.id);
                      setTransferReviewDraft(initialTransferReviewDraft);
                      setTransferReviewError(null);
                    }}
                    onExportCertificate={handleExportOwnershipCertificate}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.45rem] border border-dashed border-[#2a241f] bg-[linear-gradient(180deg,rgba(16,13,11,0.88),rgba(10,9,8,0.82))] p-5 text-sm leading-7 text-white/54">
                No pair is under the record yet. The first act is registration;
                the service chamber appears only after a real pair is attached.
              </div>
            )}
          </Container>
        </section>

        <section className="relative py-4 pb-8">
          <Container>
            <div className="grid gap-4">
              {latestRetainedPair ? (
                <div className="ownership-grain relative overflow-hidden rounded-[1.8rem] border border-[#cebca6] bg-[linear-gradient(180deg,rgba(251,246,239,0.98),rgba(236,226,214,0.96))] p-5 text-[#231b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)]">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#9f7d58]">
                    Current ledger
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[#433429]">
                    The latest retained pair remains visible as a living sequence
                    of registration, age, and service posture.
                  </p>
                  <div className="mt-5">
                    <OwnershipServiceLedger pair={latestRetainedPair} />
                  </div>
                </div>
              ) : null}

              <div className="border-b border-white/10 pb-5 pt-2">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#c7a97e]">
                  House correspondence
                </p>
                <h2 className="ownership-display mt-4 max-w-[10ch] text-[2.45rem] font-semibold leading-[0.86] tracking-[-0.055em] text-[#f3e8d8]">
                  The archive should speak back.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/78">
                  Ownership deepens when the record produces correspondence:
                  retention, invitation, review, and continuity framed as house
                  memory rather than software state.
                </p>
              </div>

              <div className="grid gap-4">
                {ownershipCorrespondenceEntries.map((entry, index) => (
                  <Reveal key={entry.title} delay={0.04 * index}>
                    <HouseLetterCard
                      eyebrow={entry.eyebrow}
                      title={entry.title}
                      body={entry.body}
                      signature={entry.signature}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <AnimatePresence>
          {legacyRefreshDraftPair ? (
            <LegacyRefreshChamberDialog
              pair={legacyRefreshDraftPair}
              note={legacyRefreshNote}
              error={legacyRefreshError}
              submitting={legacyRefreshSubmitting}
              onNoteChange={setLegacyRefreshNote}
              onClose={() => {
                setLegacyRefreshDraftPairId(null);
                setLegacyRefreshNote("");
                setLegacyRefreshError(null);
              }}
              onSubmit={handleApplyLegacyRefresh}
            />
          ) : null}
          {transferReviewDraftPair ? (
            <TransferReviewChamberDialog
              pair={transferReviewDraftPair}
              draft={transferReviewDraft}
              error={transferReviewError}
              submitting={transferReviewSubmitting}
              onDraftChange={handleTransferReviewDraftChange}
              onClose={() => {
                setTransferReviewDraftPairId(null);
                setTransferReviewDraft(initialTransferReviewDraft);
                setTransferReviewError(null);
              }}
              onSubmit={handleSubmitTransferReview}
            />
          ) : null}
        </AnimatePresence>
      </>
    );
  };

  const renderMobilePage = () => {
    switch (route) {
      case "/praeliator-vis":
        return renderMobileVisPage();
      case "/acquisition":
        return renderMobileAcquisitionPage();
      case "/private-acquisition":
        return (
          <PrivateAcquisitionRoute
            wordmarkSrc={brandAssetPaths.headerWordmark}
            onReturnHome={() => goTo("/")}
            locale={locale}
            onLocaleChange={setLocale}
            languageLabel={copy.languageLabel}
          />
        );
      case "/waitlist":
        return renderMobileWaitlistPage();
      case "/contact":
        return renderMobileContactPage();
      case "/sign-in":
        return renderSignInPage();
      case "/sign-up":
        return renderSignUpPage();
      case "/magic-link":
        return renderMagicLinkPage();
      case "/verify-email":
        return renderVerifyEmailPage();
      case "/forgot-password":
        return renderForgotPasswordPage();
      case "/reset-password":
        return renderResetPasswordPage();
      case "/ownership-record":
        return renderMobileOwnershipRecordPage();
      case "/oauth/consent":
        return renderOAuthConsentPage();
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
      case "/private-acquisition":
        return (
          <PrivateAcquisitionRoute
            wordmarkSrc={brandAssetPaths.headerWordmark}
            onReturnHome={() => goTo("/")}
            locale={locale}
            onLocaleChange={setLocale}
            languageLabel={copy.languageLabel}
          />
        );
      case "/waitlist":
        return renderWaitlistPage();
      case "/contact":
        return renderContactPage();
      case "/sign-in":
        return renderSignInPage();
      case "/sign-up":
        return renderSignUpPage();
      case "/magic-link":
        return renderMagicLinkPage();
      case "/verify-email":
        return renderVerifyEmailPage();
      case "/forgot-password":
        return renderForgotPasswordPage();
      case "/reset-password":
        return renderResetPasswordPage();
      case "/ownership-record":
        return renderOwnershipRecordPage();
      case "/oauth/consent":
        return renderOAuthConsentPage();
      default:
        return renderHomePage();
    }
  };
  return (
    <div className="min-h-screen bg-[#070707] text-[#f4efe7]">
      <BrowserFormStyles />
      <LuxuryCursor enabled={luxuryCursorEnabled} />

      {!hidesGlobalChrome && isDesktopViewport ? (
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
            className="overflow-visible bg-[linear-gradient(180deg,rgba(5,5,5,0.78),rgba(5,5,5,0.24),transparent)]"
          >
            <Container className="relative flex items-center justify-between py-5 sm:py-6">
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeLuxury }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileMenuOpen((current) => !current)}
                className="group inline-flex min-h-[3.7rem] w-16 flex-col items-center justify-center gap-[0.18rem] bg-transparent text-white/82 transition duration-500 hover:-translate-y-0.5 hover:text-white"
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
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/52 transition duration-300 group-hover:text-white/76">
                  {copy.menuLabel}
                </span>
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

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.16, ease: easeLuxury }}
                className="flex items-center gap-4"
              >
                <button
                  type="button"
                  onClick={() => goTo(authPrimaryRoute)}
                  className="text-[11px] uppercase tracking-[0.34em] text-white/74 transition duration-500 hover:text-white"
                >
                  {authPrimaryLabel}
                </button>
                <a
                  href={currentPurchaseLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] uppercase tracking-[0.34em] text-white/74 transition duration-500 hover:text-white"
                >
                  {copy.privateInquiry}
                </a>
                <LanguageSwitcher
                  locale={locale}
                  onChange={setLocale}
                  label={copy.languageLabel}
                  subtle
                />
              </motion.div>
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
                        {headerMenuItems.map((item, index) => (
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
                                {item.meta}
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
      ) : !hidesGlobalChrome ? (
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
          authPrimaryRoute={authPrimaryRoute}
          authPrimaryLabel={authPrimaryLabel}
          locale={locale}
          onLocaleChange={setLocale}
          languageLabel={copy.languageLabel}
          menuLabel={copy.menuLabel}
          menuItems={headerMenuItems}
        />
      ) : null}

      <main
        className={
          route === "/private-acquisition"
            ? "overflow-x-hidden bg-[#090806]"
            : route === "/"
            ? "overflow-x-hidden bg-[#040404]"
            : "overflow-x-hidden bg-[radial-gradient(circle_at_top,rgba(120,91,68,0.1),transparent_24%),linear-gradient(180deg,#090909_0%,#070707_100%)]"
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewportMode}-${route}`}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {usesDesktopSurfaceLayout ? renderPage() : renderMobilePage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {route === "/" || !routeUsesFooter ? null : usesDesktopSurfaceLayout ? (
        <ClubFooter
          goTo={goTo}
          whatsappGeneralLink={whatsappGeneralLink}
          instagramLink={instagramLink}
          emailLink={emailLink}
          privateInquiryLabel={copy.privateInquiry}
          waitlistLabel={waitlistCopy.joinWaitlist}
          navLinks={localizedNavItems.map(({ label, path }) => ({ label, path }))}
        />
      ) : (
        <MobileClubFooter
          goTo={goTo}
          whatsappGeneralLink={whatsappGeneralLink}
          instagramLink={instagramLink}
          emailLink={emailLink}
          privateInquiryLabel={copy.privateInquiry}
          waitlistLabel={waitlistCopy.joinWaitlist}
          navLinks={localizedNavItems.map(({ label, path }) => ({ label, path }))}
        />
      )}
    </div>
  );
}
