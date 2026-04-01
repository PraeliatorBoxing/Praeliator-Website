import { promises as dns } from "node:dns";

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  setHeader: (name: string, value: string | string[]) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
  };
};

const EMAIL_MAX_TOTAL_LENGTH = 254;

const normalizeEmail = (value: string) =>
  value.replace(/\s+/g, "").trim().toLowerCase();

const getEmailFormatError = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return "Email is required.";
  if (normalizedEmail.length > EMAIL_MAX_TOTAL_LENGTH) {
    return `Email must be ${EMAIL_MAX_TOTAL_LENGTH} characters or fewer.`;
  }

  const parts = normalizedEmail.split("@");
  if (parts.length !== 2) return "Enter a valid email address.";

  const [localPart, domain] = parts;
  if (!localPart || !domain) return "Enter a valid email address.";
  if (localPart.length > 64) return "Enter a valid email address.";
  if (
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return "Enter a valid email address.";
  }
  if (
    domain.length > 253 ||
    domain.startsWith("-") ||
    domain.endsWith("-") ||
    domain.includes("..")
  ) {
    return "Enter a valid email address.";
  }

  const labels = domain.split(".");
  if (labels.length < 2) return "Enter a valid email address.";

  const invalidLabel = labels.some((label) => {
    if (!label || label.length > 63) return true;
    if (label.startsWith("-") || label.endsWith("-")) return true;
    return !/^[a-z0-9-]+$/i.test(label);
  });

  if (invalidLabel) return "Enter a valid email address.";

  const tld = labels[labels.length - 1];
  if (tld.length < 2 || !/[a-z]/i.test(tld)) return "Enter a valid email address.";

  return "";
};

const extractDomain = (email: string) => {
  const normalizedEmail = normalizeEmail(email);
  const atIndex = normalizedEmail.lastIndexOf("@");
  return atIndex >= 0 ? normalizedEmail.slice(atIndex + 1) : "";
};

const hasResults = (value: unknown) => Array.isArray(value) && value.length > 0;

const resolveSafely = async <T,>(resolver: () => Promise<T>) => {
  try {
    return await resolver();
  } catch {
    return null;
  }
};

const hasRoutableEmailDomain = async (domain: string) => {
  const [mx, ipv4, ipv6] = await Promise.all([
    resolveSafely(() => dns.resolveMx(domain)),
    resolveSafely(() => dns.resolve4(domain)),
    resolveSafely(() => dns.resolve6(domain)),
  ]);

  return {
    hasMx: hasResults(mx),
    hasA: hasResults(ipv4),
    hasAaaa: hasResults(ipv6),
  };
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  const body = (req.body ?? {}) as { email?: unknown };
  const email = typeof body.email === "string" ? body.email : "";
  const emailFormatError = getEmailFormatError(email);

  if (emailFormatError) {
    return res.status(422).json({
      success: false,
      error: emailFormatError,
      errorCode: "invalid_email_format",
    });
  }

  const domain = extractDomain(email);

  try {
    const checks = await hasRoutableEmailDomain(domain);

    if (!checks.hasMx && !checks.hasA && !checks.hasAaaa) {
      return res.status(422).json({
        success: false,
        error: "Please enter a real email domain before continuing.",
        errorCode: "invalid_email_domain",
      });
    }

    return res.status(200).json({
      success: true,
      domain,
      checks,
    });
  } catch {
    return res.status(503).json({
      success: false,
      error: "Email validation is temporarily unavailable. Please try again.",
      errorCode: "email_domain_check_unavailable",
    });
  }
}
