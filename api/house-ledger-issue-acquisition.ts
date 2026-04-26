import {
  createHouseLedgerResponse,
  HouseLedgerAccessError,
  requireHouseLedgerOwner,
} from "./_lib/house-ledger.js";
import { createPrivateAcquisitionSession } from "./_lib/private-acquisition.js";

type IssueRequestBody = {
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  productName?: string;
  subtotal?: string | number;
  shipping?: string | number;
  currency?: string;
  quantity?: string | number;
  shippingCountry?: string;
  shippingRegion?: string;
  expiresInHours?: string | number;
  createdBy?: string;
  specifications?: string;
};

function normalizeInlineText(value: unknown) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapePowerShellString(value: string) {
  return value.replace(/"/g, '`"');
}

function getCurrencyExponent(currency: string) {
  return currency === "jpy" ? 0 : 2;
}

function parseMajorAmount(value: string, currency: string) {
  const normalized = String(value || "").trim();
  if (!normalized) return 0;

  const exponent = getCurrencyExponent(currency);
  const [wholePart, decimalPart = ""] = normalized.split(".");
  const safeWhole = wholePart.replace(/[^\d-]/g, "");
  const safeDecimal = decimalPart.replace(/[^\d]/g, "");

  const whole = Number(safeWhole || "0");
  const paddedDecimal = exponent
    ? (safeDecimal + "0".repeat(exponent)).slice(0, exponent)
    : "";
  const decimal = exponent ? Number(paddedDecimal || "0") : 0;

  if (!Number.isFinite(whole) || !Number.isFinite(decimal)) {
    throw new Error(`Invalid amount: ${value}`);
  }

  return whole * 10 ** exponent + decimal;
}

function formatDisplayDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function parseSpecifications(value: string) {
  const entries = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const invalidEntries = entries.filter((entry) => {
    const [label, ...rest] = entry.split("=");
    return !label.trim() || !rest.join("=").trim();
  });

  const specifications = entries
    .map((entry) => {
      const [label, ...rest] = entry.split("=");
      return {
        label: label.trim(),
        value: rest.join("=").trim(),
      };
    })
    .filter((entry) => entry.label && entry.value);

  return {
    entries,
    invalidEntries,
    productSnapshot: specifications.length ? { specifications } : {},
  };
}

function buildPreparedNotice(input: {
  referenceCode: string;
  privateUrl: string;
  expiresAt: string;
}) {
  return `Your private acquisition page has been prepared.

Reference code: ${input.referenceCode}
Private acquisition link: ${input.privateUrl}
Valid until: ${formatDisplayDate(input.expiresAt)}

Please open the link above, enter the issued reference code, complete the delivery details, and proceed to payment within the same page.

Should anything require further clarification, please let us know.`;
}

function buildPowerShellSnippet(input: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingCountry: string;
  shippingRegion: string;
  productName: string;
  subtotal: string;
  shipping: string;
  currency: string;
  quantity: number;
  expiresInHours: number;
  createdBy: string;
  specificationEntries: string[];
}) {
  const specFlags = input.specificationEntries
    .map((entry) => ` --spec "${escapePowerShellString(entry)}"`)
    .join("");

  return `$clientName = "${escapePowerShellString(input.clientName)}"
$clientEmail = "${escapePowerShellString(input.clientEmail)}"
$clientPhone = "${escapePowerShellString(input.clientPhone)}"
$country = "${escapePowerShellString(input.shippingCountry)}"
$region = "${escapePowerShellString(input.shippingRegion)}"

$output = npm run private-acquisition:create -- --product-name "${escapePowerShellString(input.productName)}" --client-name $clientName --client-email $clientEmail --client-phone $clientPhone --subtotal ${input.subtotal} --shipping ${input.shipping} --currency ${input.currency} --quantity ${input.quantity} --shipping-country $country --shipping-region $region --expires-in-hours ${input.expiresInHours} --created-by "${escapePowerShellString(input.createdBy)}"${specFlags}

$output

$reference = ($output | Select-String 'Reference code\\s*:\\s*(.+)$').Matches[0].Groups[1].Value.Trim()
$url = ($output | Select-String 'Private URL\\s*:\\s*(.+)$').Matches[0].Groups[1].Value.Trim()
$expires = ($output | Select-String 'Expires at\\s*:\\s*(.+)$').Matches[0].Groups[1].Value.Trim()

@"
Your private acquisition page has been prepared.

Reference code: $reference
Private acquisition link: $url
Valid until: $expires

Please open the link above, enter the issued reference code, complete the delivery details, and proceed to payment within the same page.

Should anything require further clarification, please let us know.
"@`;
}

export async function POST(request: Request) {
  try {
    await requireHouseLedgerOwner(request);

    const body = (await request.json()) as IssueRequestBody;
    const clientName = normalizeInlineText(body.clientName);
    const clientEmail = normalizeInlineText(body.clientEmail).toLowerCase();
    const clientPhone = normalizeInlineText(body.clientPhone);
    const productName = normalizeInlineText(body.productName);
    const shippingCountry = normalizeInlineText(body.shippingCountry);
    const shippingRegion = normalizeInlineText(body.shippingRegion);
    const currency = normalizeInlineText(body.currency).toLowerCase() || "mxn";
    const createdBy = normalizeInlineText(body.createdBy) || "Praeliator";
    const subtotal = normalizeInlineText(body.subtotal);
    const shipping = normalizeInlineText(body.shipping);
    const quantity = Number(body.quantity || 1);
    const expiresInHours = Number(body.expiresInHours || 72);
    const specificationInput = String(body.specifications || "");
    const { entries: specificationEntries, invalidEntries, productSnapshot } =
      parseSpecifications(specificationInput);

    const fieldErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!clientName || clientName.length < 2) {
      fieldErrors.clientName =
        "Enter the client name to be retained under this issued record.";
    }

    if (!clientEmail || !emailPattern.test(clientEmail)) {
      fieldErrors.clientEmail =
        "Enter a valid client email before the private page is issued.";
    }

    if (clientPhone && clientPhone.replace(/[^\d]/g, "").length < 6) {
      fieldErrors.clientPhone =
        "Use a fuller phone number or leave the field empty.";
    }

    if (!productName) {
      fieldErrors.productName = "Enter the product name for this acquisition.";
    }

    if (!shippingCountry) {
      fieldErrors.shippingCountry = "Enter the destination country.";
    }

    if (!shippingRegion) {
      fieldErrors.shippingRegion = "Enter the destination region.";
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      fieldErrors.quantity = "Quantity must be a whole number greater than zero.";
    }

    if (!Number.isFinite(expiresInHours) || expiresInHours < 1 || expiresInHours > 240) {
      fieldErrors.expiresInHours =
        "Validity must remain between 1 and 240 hours.";
    }

    if (invalidEntries.length) {
      fieldErrors.specifications =
        "Use one specification per line in the form Label=Value.";
    }

    let subtotalAmount = 0;
    let shippingAmount = 0;

    try {
      subtotalAmount = parseMajorAmount(subtotal || "0", currency);
    } catch {
      fieldErrors.subtotal = "Enter a valid subtotal amount.";
    }

    try {
      shippingAmount = parseMajorAmount(shipping || "0", currency);
    } catch {
      fieldErrors.shipping = "Enter a valid shipping amount.";
    }

    if (Object.keys(fieldErrors).length) {
      return createHouseLedgerResponse(
        {
          success: false,
          error: "The issue record is incomplete.",
          fieldErrors,
        },
        422,
      );
    }

    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    const totalAmount = subtotalAmount + shippingAmount;
    const result = await createPrivateAcquisitionSession({
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      productName,
      productSnapshot,
      orderSnapshot: {
        issuedFollowing: "Direct correspondence",
        housePreparedAt: new Date().toISOString(),
      },
      quantity,
      currency,
      subtotalAmount,
      shippingAmount,
      totalAmount,
      shippingCountry,
      shippingRegion,
      createdBy,
      expiresAt,
    });

    return createHouseLedgerResponse({
      success: true,
      issuance: {
        referenceCode: result.referenceCode,
        privateUrl: result.privateUrl,
        expiresAt: result.expiresAt,
        orderSummary: result.orderSummary,
      },
      preparedNotice: buildPreparedNotice({
        referenceCode: result.referenceCode,
        privateUrl: result.privateUrl,
        expiresAt: result.expiresAt,
      }),
      powerShellSnippet: buildPowerShellSnippet({
        clientName,
        clientEmail,
        clientPhone,
        shippingCountry,
        shippingRegion,
        productName,
        subtotal: subtotal || "0",
        shipping: shipping || "0",
        currency,
        quantity,
        expiresInHours,
        createdBy,
        specificationEntries,
      }),
    });
  } catch (error) {
    if (error instanceof HouseLedgerAccessError) {
      return createHouseLedgerResponse(
        { success: false, error: error.message },
        error.status,
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "The private acquisition page could not be issued.";

    return createHouseLedgerResponse({ success: false, error: message }, 500);
  }
}
