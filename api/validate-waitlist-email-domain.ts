import { promises as dns } from "node:dns";

function isValidEmailFormat(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function extractDomain(email: string) {
  return email.split("@")[1]?.trim().toLowerCase() || "";
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return jsonResponse(
      {
        ok: false,
        error: "Method not allowed.",
      },
      405,
    );
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      email?: string;
    };
    const email = String(payload.email || "").trim().toLowerCase();

    if (!email || !isValidEmailFormat(email)) {
      return jsonResponse(
        {
          ok: false,
          code: "INVALID_EMAIL_FORMAT",
          error: "Enter a valid email address.",
        },
        400,
      );
    }

    const domain = extractDomain(email);

    if (!domain) {
      return jsonResponse(
        {
          ok: false,
          code: "INVALID_EMAIL_DOMAIN",
          error: "Enter a valid email address.",
        },
        400,
      );
    }

    let mxRecords: Awaited<ReturnType<typeof dns.resolveMx>> = [];

    try {
      mxRecords = await dns.resolveMx(domain);
    } catch {
      mxRecords = [];
    }

    if (!mxRecords.length) {
      return jsonResponse(
        {
          ok: false,
          code: "EMAIL_DOMAIN_CANNOT_RECEIVE_MAIL",
          error: "Please enter a real email address.",
        },
        400,
      );
    }

    const hasNullMx = mxRecords.some(
      (record) => record.exchange === "." || record.exchange === "",
    );

    if (hasNullMx) {
      return jsonResponse(
        {
          ok: false,
          code: "EMAIL_DOMAIN_DOES_NOT_ACCEPT_MAIL",
          error: "Please enter a real email address.",
        },
        400,
      );
    }

    return jsonResponse({
      ok: true,
      code: "EMAIL_DOMAIN_ACCEPTS_MAIL",
    });
  } catch {
    return jsonResponse(
      {
        ok: false,
        code: "EMAIL_VALIDATION_FAILED",
        error: "Unable to validate email right now.",
      },
      500,
    );
  }
}
