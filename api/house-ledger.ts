import {
  createHouseLedgerResponse,
  getHouseLedgerState,
  HouseLedgerAccessError,
  isValidFulfillmentStatus,
  markHouseLedgerNotificationsRead,
  recordHouseLedgerDelivery,
  requireHouseLedgerOwner,
  updateHouseLedgerSaleStatus,
} from "./_lib/house-ledger.js";
import { createPrivateAcquisitionSession } from "./_lib/private-acquisition.js";

type ReadPayload = {
  action?: string;
  notificationId?: string | null;
};

type StatusPayload = {
  action?: string;
  saleId?: string;
  fulfillmentStatus?: string;
};

type DeliveryPayload = {
  action?: string;
  saleId?: string;
  deliveryReference?: string;
  deliveryNote?: string;
};

type IssueRequestBody = {
  action?: string;
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
  personalMonogramEnabled?: boolean | string;
  personalMonogramInitials?: string;
  personalMonogramPlacement?: string;
  personalMonogramNote?: string;
  personalMonogramFee?: string | number;
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

function parseBooleanFlag(value: unknown) {
  if (typeof value === "boolean") return value;
  const normalized = normalizeInlineText(value).toLowerCase();
  return ["1", "true", "yes", "on", "enabled"].includes(normalized);
}

function normalizeMonogramInitials(value: unknown) {
  return normalizeInlineText(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizeMonogramPlacement(value: unknown) {
  const placement = normalizeInlineText(value);
  return placement || "Leather case";
}

function buildPreparedNotice(input: {
  referenceCode: string;
  privateUrl: string;
  expiresAt: string;
  personalMonogram?: {
    enabled: boolean;
    initials?: string | null;
    placement?: string | null;
  };
}) {
  const monogramLine = input.personalMonogram?.enabled
    ? `\nPersonal Monogram: ${[
        input.personalMonogram.initials,
        input.personalMonogram.placement,
      ]
        .filter(Boolean)
        .join(" / ")}\n`
    : "";

  return `Your private Praeliator acquisition page has been issued.

Reference code: ${input.referenceCode}
Private acquisition link: ${input.privateUrl}
Valid until: ${formatDisplayDate(input.expiresAt)}${monogramLine}

Please open the link above, enter the issued reference code, complete the destination record, and confirm payment within the same page.

Once settlement is confirmed, the object line enters the house ledger. Delivery, ownership continuity, and future aftercare remain attached to that same record.

Should anything require further clarification, the house will continue directly.`;
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
  personalMonogram: {
    enabled: boolean;
    initials: string;
    placement: string;
    note: string;
    fee: string;
  };
}) {
  const specFlags = input.specificationEntries
    .map((entry) => ` --spec "${escapePowerShellString(entry)}"`)
    .join("");
  const monogramFlags = input.personalMonogram.enabled
    ? ` --personal-monogram true --monogram-initials "${escapePowerShellString(input.personalMonogram.initials)}" --monogram-placement "${escapePowerShellString(input.personalMonogram.placement)}" --monogram-fee ${input.personalMonogram.fee || "0"}${
        input.personalMonogram.note
          ? ` --monogram-note "${escapePowerShellString(input.personalMonogram.note)}"`
          : ""
      }`
    : "";

  return `$clientName = "${escapePowerShellString(input.clientName)}"
$clientEmail = "${escapePowerShellString(input.clientEmail)}"
$clientPhone = "${escapePowerShellString(input.clientPhone)}"
$country = "${escapePowerShellString(input.shippingCountry)}"
$region = "${escapePowerShellString(input.shippingRegion)}"

$output = npm run private-acquisition:create -- --product-name "${escapePowerShellString(input.productName)}" --client-name $clientName --client-email $clientEmail --client-phone $clientPhone --subtotal ${input.subtotal} --shipping ${input.shipping} --currency ${input.currency} --quantity ${input.quantity} --shipping-country $country --shipping-region $region --expires-in-hours ${input.expiresInHours} --created-by "${escapePowerShellString(input.createdBy)}"${specFlags}${monogramFlags}

$output

$reference = ($output | Select-String 'Reference code\\s*:\\s*(.+)$').Matches[0].Groups[1].Value.Trim()
$url = ($output | Select-String 'Private URL\\s*:\\s*(.+)$').Matches[0].Groups[1].Value.Trim()
$expires = ($output | Select-String 'Expires at\\s*:\\s*(.+)$').Matches[0].Groups[1].Value.Trim()

@"
Your private Praeliator acquisition page has been issued.

Reference code: $reference
Private acquisition link: $url
Valid until: $expires

Please open the link above, enter the issued reference code, complete the destination record, and confirm payment within the same page.

Once settlement is confirmed, the object line enters the house ledger. Delivery, ownership continuity, and future aftercare remain attached to that same record.

Should anything require further clarification, the house will continue directly.
"@`;
}

async function handleState(request: Request) {
  const owner = await requireHouseLedgerOwner(request);
  const state = await getHouseLedgerState();

  return createHouseLedgerResponse({
    success: true,
    owner,
    ...state,
  });
}

async function handleNotificationsRead(request: Request, body: ReadPayload) {
  await requireHouseLedgerOwner(request);
  const result = await markHouseLedgerNotificationsRead({
    notificationId: body.notificationId,
  });

  return createHouseLedgerResponse({
    success: true,
    ...result,
  });
}

async function handleSaleStatus(request: Request, body: StatusPayload) {
  await requireHouseLedgerOwner(request);
  const saleId = (body.saleId || "").trim();
  const fulfillmentStatus = (body.fulfillmentStatus || "").trim();

  if (!saleId || !isValidFulfillmentStatus(fulfillmentStatus)) {
    return createHouseLedgerResponse(
      {
        success: false,
        error: "A sale id and valid fulfillment status are required.",
      },
      400,
    );
  }

  const sale = await updateHouseLedgerSaleStatus({
    saleId,
    fulfillmentStatus,
  });

  return createHouseLedgerResponse({
    success: true,
    sale,
  });
}

async function handleRecordDelivery(request: Request, body: DeliveryPayload) {
  const owner = await requireHouseLedgerOwner(request);
  const saleId = normalizeInlineText(body.saleId);

  if (!saleId) {
    return createHouseLedgerResponse(
      {
        success: false,
        error: "A sale id is required before delivery can be recorded.",
      },
      400,
    );
  }

  const sale = await recordHouseLedgerDelivery({
    saleId,
    deliveryReference: body.deliveryReference,
    deliveryNote: body.deliveryNote,
    recordedBy: owner.email,
  });

  return createHouseLedgerResponse({
    success: true,
    sale,
  });
}

async function handleIssueAcquisition(request: Request, body: IssueRequestBody) {
  await requireHouseLedgerOwner(request);

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
  const personalMonogramEnabled = parseBooleanFlag(body.personalMonogramEnabled);
  const personalMonogramInitials = normalizeMonogramInitials(
    body.personalMonogramInitials,
  );
  const personalMonogramPlacement = normalizeMonogramPlacement(
    body.personalMonogramPlacement,
  );
  const personalMonogramNote = normalizeInlineText(body.personalMonogramNote);
  const personalMonogramFee = normalizeInlineText(body.personalMonogramFee);

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

  if (
    !Number.isFinite(expiresInHours) ||
    expiresInHours < 1 ||
    expiresInHours > 240
  ) {
    fieldErrors.expiresInHours = "Validity must remain between 1 and 240 hours.";
  }

  if (invalidEntries.length) {
    fieldErrors.specifications =
      "Use one specification per line in the form Label=Value.";
  }

  let subtotalAmount = 0;
  let shippingAmount = 0;
  let personalMonogramFeeAmount = 0;

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

  if (personalMonogramEnabled) {
    if (
      personalMonogramInitials.length < 1 ||
      personalMonogramInitials.length > 3
    ) {
      fieldErrors.personalMonogramInitials =
        "Personal Monogram initials must remain between one and three characters.";
    }

    try {
      personalMonogramFeeAmount = parseMajorAmount(
        personalMonogramFee || "0",
        currency,
      );
      if (personalMonogramFeeAmount < 0) {
        fieldErrors.personalMonogramFee =
          "Personal Monogram fee cannot be negative.";
      }
    } catch {
      fieldErrors.personalMonogramFee =
        "Enter a valid Personal Monogram fee amount.";
    }
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
  const totalAmount = subtotalAmount + shippingAmount + personalMonogramFeeAmount;
  const personalMonogram = personalMonogramEnabled
    ? {
        enabled: true,
        initials: personalMonogramInitials,
        placement: personalMonogramPlacement,
        note: personalMonogramNote || null,
        feeAmount: personalMonogramFeeAmount,
        currency,
        finish: "Tonal deboss",
      }
    : {
        enabled: false,
      };
  const result = await createPrivateAcquisitionSession({
    clientName,
    clientEmail,
    clientPhone: clientPhone || null,
    productName,
    productSnapshot,
    orderSnapshot: {
      issuedFollowing: "Direct correspondence",
      housePreparedAt: new Date().toISOString(),
      personalMonogram,
      priceLines: [
        {
          label: productName,
          amount: subtotalAmount,
        },
        {
          label: "Private allocation and fulfillment",
          amount: shippingAmount,
        },
        ...(personalMonogramEnabled
          ? [
              {
                label: "Personal Monogram",
                amount: personalMonogramFeeAmount,
              },
            ]
          : []),
      ],
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
      personalMonogram,
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
      personalMonogram: {
        enabled: personalMonogramEnabled,
        initials: personalMonogramInitials,
        placement: personalMonogramPlacement,
        note: personalMonogramNote,
        fee: personalMonogramFee || "0",
      },
    }),
  });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mode = normalizeInlineText(url.searchParams.get("mode")).toLowerCase();

    if (mode === "access") {
      await requireHouseLedgerOwner(request);
      return createHouseLedgerResponse({
        success: true,
        access: true,
      });
    }

    return await handleState(request);
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
        : "The house ledger could not be opened.";

    return createHouseLedgerResponse({ success: false, error: message }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as
      | ReadPayload
      | StatusPayload
      | DeliveryPayload
      | IssueRequestBody;
    const action = normalizeInlineText(body.action).toLowerCase();

    if (action === "notifications-read") {
      return await handleNotificationsRead(request, body as ReadPayload);
    }

    if (action === "sale-status") {
      return await handleSaleStatus(request, body as StatusPayload);
    }

    if (action === "record-delivery") {
      return await handleRecordDelivery(request, body as DeliveryPayload);
    }

    if (action === "issue-acquisition") {
      return await handleIssueAcquisition(request, body as IssueRequestBody);
    }

    return createHouseLedgerResponse(
      { success: false, error: "A valid house ledger action is required." },
      400,
    );
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
        : "The house ledger request could not be completed.";

    return createHouseLedgerResponse({ success: false, error: message }, 500);
  }
}
