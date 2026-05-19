export type SiteRoute =
  | "/"
  | "/praeliator-vis"
  | "/object-record"
  | "/acquisition"
  | "/private-acquisition"
  | "/private-commission"
  | "/house-ledger"
  | "/waitlist"
  | "/contact"
  | "/faq"
  | "/privacy-notice"
  | "/sign-in"
  | "/sign-up"
  | "/magic-link"
  | "/verify-email"
  | "/forgot-password"
  | "/reset-password"
  | "/ownership-record"
  | "/oauth/consent";

export type SiteMetadata = {
  title: string;
  description: string;
  image: string;
  canonicalPath: string;
  robots?: string;
  keywords?: string[];
};

const siteOrigin = "https://praeliator.com";
const defaultImage = `${siteOrigin}/images/vis-glove-hero.jpg`;

const routeMetadata: Record<SiteRoute, SiteMetadata> = {
  "/": {
    title: "Praeliator | Luxury Boxing House",
    description:
      "Praeliator is a private boxing house where equipment, acquisition, and ownership are treated with the control and gravity of a recorded object.",
    image: `${siteOrigin}/images/homepage-cinematic-hero-poster.jpg`,
    canonicalPath: "/",
    keywords: ["praeliator", "luxury boxing gloves", "boxing as art"],
  },
  "/praeliator-vis": {
    title: "Praeliator VIS | Recorded Training Pair",
    description:
      "Praeliator VIS is the flagship recorded training pair: top-grain cowhide, restrained presentation, and controlled aftercare under the house.",
    image: `${siteOrigin}/images/vis-glove-hero.jpg`,
    canonicalPath: "/praeliator-vis",
    keywords: ["Praeliator VIS", "luxury boxing gloves", "training gloves"],
  },
  "/object-record": {
    title: "The Object Record | Praeliator",
    description:
      "The Praeliator object record explains VIS evidence, private acquisition, ownership continuity, controlled personalization, and future aftercare.",
    image: `${siteOrigin}/images/vis-packaging-presentation.jpg`,
    canonicalPath: "/object-record",
    keywords: ["Praeliator object record", "boxing as form", "personal monogram"],
  },
  "/acquisition": {
    title: "Private Acquisition | Praeliator",
    description:
      "Private acquisition begins by direct correspondence. Praeliator retains context before allocation, destination, and payment are issued under one controlled line.",
    image: `${siteOrigin}/images/vis-packaging-presentation.jpg`,
    canonicalPath: "/acquisition",
  },
  "/private-acquisition": {
    title: "Private Acquisition Session | Praeliator",
    description:
      "Issued private acquisition sessions are validated and completed inside a controlled Praeliator payment chamber.",
    image: defaultImage,
    canonicalPath: "/private-acquisition",
    robots: "noindex, nofollow",
  },
  "/private-commission": {
    title: "Private Commission | Praeliator",
    description:
      "Private Commission requests allow select Praeliator clients to enter a controlled review process for individually prepared glove sets.",
    image: `${siteOrigin}/images/vis-logo-construction-detail.jpg`,
    canonicalPath: "/private-commission",
    robots: "noindex, nofollow",
  },
  "/house-ledger": {
    title: "House Ledger | Praeliator",
    description:
      "Internal Praeliator house ledger for issued owner accounts.",
    image: defaultImage,
    canonicalPath: "/house-ledger",
    robots: "noindex, nofollow",
  },
  "/waitlist": {
    title: "Waitlist | Praeliator",
    description:
      "A quieter register for future allocation, collector interest, and continued private access under the Praeliator house.",
    image: `${siteOrigin}/images/vis-logo-construction-detail.jpg`,
    canonicalPath: "/waitlist",
  },
  "/contact": {
    title: "Contact | Praeliator",
    description:
      "Direct Praeliator correspondence for private inquiry, quieter follow-up, and controlled contact lines.",
    image: `${siteOrigin}/images/vis-packaging-presentation.jpg`,
    canonicalPath: "/contact",
  },
  "/faq": {
    title: "FAQ | Praeliator",
    description:
      "Practical guidance on acquisition, ownership, care, and private service under the Praeliator house.",
    image: `${siteOrigin}/images/vis-leather-material-closeup.jpg`,
    canonicalPath: "/faq",
  },
  "/privacy-notice": {
    title: "Privacy Notice | Praeliator",
    description:
      "Praeliator privacy notice covering inquiry, ownership, acquisition, analytics, and service-related data handling.",
    image: defaultImage,
    canonicalPath: "/privacy-notice",
  },
  "/sign-in": {
    title: "Sign In | Praeliator",
    description: "Sign in to the private Praeliator ownership layer.",
    image: defaultImage,
    canonicalPath: "/sign-in",
    robots: "noindex, nofollow",
  },
  "/sign-up": {
    title: "Create Account | Praeliator",
    description: "Create a Praeliator account for private ownership access.",
    image: defaultImage,
    canonicalPath: "/sign-up",
    robots: "noindex, nofollow",
  },
  "/magic-link": {
    title: "One-Time Code | Praeliator",
    description: "Passwordless Praeliator account access by one-time code.",
    image: defaultImage,
    canonicalPath: "/magic-link",
    robots: "noindex, nofollow",
  },
  "/verify-email": {
    title: "Verify Email | Praeliator",
    description: "Verify a Praeliator account email address.",
    image: defaultImage,
    canonicalPath: "/verify-email",
    robots: "noindex, nofollow",
  },
  "/forgot-password": {
    title: "Forgot Password | Praeliator",
    description: "Recover access to a Praeliator account.",
    image: defaultImage,
    canonicalPath: "/forgot-password",
    robots: "noindex, nofollow",
  },
  "/reset-password": {
    title: "Reset Password | Praeliator",
    description: "Reset the password for a Praeliator account.",
    image: defaultImage,
    canonicalPath: "/reset-password",
    robots: "noindex, nofollow",
  },
  "/ownership-record": {
    title: "Ownership Record | Praeliator",
    description: "Private ownership record for retained Praeliator pairs.",
    image: defaultImage,
    canonicalPath: "/ownership-record",
    robots: "noindex, nofollow",
  },
  "/oauth/consent": {
    title: "OAuth Consent | Praeliator",
    description: "Praeliator OAuth consent route.",
    image: defaultImage,
    canonicalPath: "/oauth/consent",
    robots: "noindex, nofollow",
  },
};

export function getSiteMetadata(route: SiteRoute): SiteMetadata {
  return routeMetadata[route] ?? routeMetadata["/"];
}

export function getCanonicalUrl(path: string) {
  if (!path || path === "/") return siteOrigin;
  return `${siteOrigin}${path}`;
}

export function getSiteSchema(route: SiteRoute) {
  const metadata = getSiteMetadata(route);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Praeliator",
    url: siteOrigin,
    logo: `${siteOrigin}/praeliator-gold-monogram-logo.png`,
    sameAs: ["https://www.instagram.com/praeliator"],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Praeliator",
    url: siteOrigin,
    inLanguage: ["en", "es", "ja", "fr"],
  };

  const schemas: Array<Record<string, unknown>> = [organization, website];

  if (route === "/praeliator-vis") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Praeliator VIS",
      image: [metadata.image],
      description: metadata.description,
      brand: {
        "@type": "Brand",
        name: "Praeliator",
      },
      material: "Top-grain cowhide leather",
      category: "Training boxing gloves",
      offers: {
        "@type": "Offer",
        priceCurrency: "MXN",
        price: "6000",
        availability: "https://schema.org/LimitedAvailability",
        url: getCanonicalUrl(metadata.canonicalPath),
      },
    });
  }

  if (route === "/object-record") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Object Record",
      description: metadata.description,
      image: metadata.image,
      author: {
        "@type": "Organization",
        name: "Praeliator",
      },
      publisher: {
        "@type": "Organization",
        name: "Praeliator",
        logo: {
          "@type": "ImageObject",
          url: `${siteOrigin}/praeliator-gold-monogram-logo.png`,
        },
      },
      mainEntityOfPage: getCanonicalUrl(metadata.canonicalPath),
    });
  }

  if (route === "/faq") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does acquisition begin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Praeliator acquisition begins by direct correspondence rather than public checkout. Qualified interest continues through a private route under the house.",
          },
        },
        {
          "@type": "Question",
          name: "Is Praeliator VIS publicly available for instant purchase?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. VIS is not presented as a public cart product. Allocation, review, and issued payment access remain controlled privately.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Ownership Record?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Ownership Record is the private client layer where registered pairs, delivery age, and future Legacy Refresh eligibility remain attached to the same retained line.",
          },
        },
      ],
    });
  }

  return schemas;
}
