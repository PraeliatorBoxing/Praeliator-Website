import type { VercelRequest, VercelResponse } from "@vercel/node";
import { promises as dns } from "node:dns";

function isValidEmailFormat(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function extractDomain(email: string) {
  return email.split("@")[1]?.trim().toLowerCase() || "";
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed.",
    });
  }

  try {
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email || !isValidEmailFormat(email)) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_EMAIL_FORMAT",
        error: "Enter a valid email address.",
      });
    }

    const domain = extractDomain(email);

    if (!domain) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_EMAIL_DOMAIN",
        error: "Enter a valid email address.",
      });
    }

    let mxRecords: Awaited<ReturnType<typeof dns.resolveMx>> = [];

    try {
      mxRecords = await dns.resolveMx(domain);
    } catch {
      mxRecords = [];
    }

    if (!mxRecords.length) {
      return res.status(400).json({
        ok: false,
        code: "EMAIL_DOMAIN_CANNOT_RECEIVE_MAIL",
        error: "Please enter a real email address.",
      });
    }

    const hasNullMx = mxRecords.some(
      (record) => record.exchange === "." || record.exchange === "",
    );

    if (hasNullMx) {
      return res.status(400).json({
        ok: false,
        code: "EMAIL_DOMAIN_DOES_NOT_ACCEPT_MAIL",
        error: "Please enter a real email address.",
      });
    }

    return res.status(200).json({
      ok: true,
      code: "EMAIL_DOMAIN_ACCEPTS_MAIL",
    });
  } catch {
    return res.status(500).json({
      ok: false,
      code: "EMAIL_VALIDATION_FAILED",
      error: "Unable to validate email right now.",
    });
  }
}
