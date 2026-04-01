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

type DnsAnswer = {
  data?: string;
  type?: number;
};

type DnsJsonResponse = {
  Status?: number;
  Answer?: DnsAnswer[];
};

const EMAIL_MAX_TOTAL_LENGTH = 254;
const DNS_HEADERS = {
  Accept: "application/dns-json",
};

const normalizeEmail = (value: string) => value.replace(/\s+/g, "").trim().toLowerCase();

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
  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
    return "Enter a valid email address.";
  }
  if (domain.length > 253 || domain.startsWith("-") || domain.endsWith("-") || domain.includes("..")) {
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

const queryDns = async (name: string, type: "MX" | "A" | "AAAA") => {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
  const response = await fetch(url, { headers: DNS_HEADERS });
  if (!response.ok) {
    throw new Error(`DNS lookup failed for ${type}.`);
  }
  return (await response.json()) as DnsJsonResponse;
};

const hasAnswerType = (
  response: DnsJsonResponse,
  expectedType: number,
) => Array.isArray(response.Answer) && response.Answer.some((answer) => answer.type === expectedType && Boolean(answer.data));

const hasRoutableEmailDomain = async (domain: string) => {
  const [mx, a, aaaa] = await Promise.all([
    queryDns(domain, "MX"),
    queryDns(domain, "A"),
    queryDns(domain, "AAAA"),
  ]);

  return {
    hasMx: hasAnswerType(mx, 15),
    hasA: hasAnswerType(a, 1),
    hasAaaa: hasAnswerType(aaaa, 28),
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
    const result = await hasRoutableEmailDomain(domain);
    if (!result.hasMx && !result.hasA && !result.hasAaaa) {
      return res.status(422).json({
        success: false,
        error: "Please enter a real email domain before continuing.",
        errorCode: "invalid_email_domain",
      });
    }

    return res.status(200).json({
      success: true,
      domain,
      checks: result,
    });
  } catch {
    return res.status(503).json({
      success: false,
      error: "Email validation is temporarily unavailable. Please try again.",
      errorCode: "email_domain_check_unavailable",
    });
  }
}
