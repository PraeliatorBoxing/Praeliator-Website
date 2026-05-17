import fs from "fs";
import path from "path";
import process from "process";
import {
  createPrivateAcquisitionSession,
  revokePrivateAcquisitionSession,
} from "../api/_lib/private-acquisition.js";

const workspaceRoot = process.cwd();

function loadLocalEnvFile(filename) {
  const absolutePath = path.join(workspaceRoot, filename);
  if (!fs.existsSync(absolutePath)) return;

  const contents = fs.readFileSync(absolutePath, "utf8");
  contents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key]) return;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
}

loadLocalEnvFile(".env");
loadLocalEnvFile(".env.local");

function printUsage() {
  console.log(`
Praeliator private acquisition session utility

Create:
  node scripts/private-acquisition-session.mjs create \\
    --product-name "Praeliator VIS" \\
    --client-name "Client Name" \\
    --client-email "client@example.com" \\
    --subtotal 6000 \\
    --shipping 0 \\
    --currency mxn \\
    --quantity 1 \\
    --shipping-country "Mexico" \\
    --shipping-region "Monterrey" \\
    --expires-in-hours 72 \\
    --created-by "Praeliator" \\
    --personal-monogram true \\
    --monogram-initials "PM" \\
    --monogram-placement "Leather case" \\
    --monogram-fee 1200 \\
    --spec "Format=16 oz lace-up" \\
    --spec "Material=Top-grain cowhide"

Revoke:
  node scripts/private-acquisition-session.mjs revoke --reference-code PRA-VIS-7K4M9Q --note "Manual revocation"
`);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }

    const key = value.slice(2);
    const nextValue = argv[index + 1];
    const resolvedValue =
      nextValue && !nextValue.startsWith("--") ? nextValue : "true";

    if (resolvedValue !== "true") {
      index += 1;
    }

    if (key in flags) {
      flags[key] = Array.isArray(flags[key])
        ? [...flags[key], resolvedValue]
        : [flags[key], resolvedValue];
    } else {
      flags[key] = resolvedValue;
    }
  }

  return { positional, flags };
}

function getFlag(flags, key, fallback = "") {
  const value = flags[key];
  if (Array.isArray(value)) return value[value.length - 1] || fallback;
  return value || fallback;
}

function getRepeatedFlag(flags, key) {
  const value = flags[key];
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getCurrencyExponent(currency) {
  const normalized = String(currency || "").trim().toLowerCase();
  if (normalized === "jpy") return 0;
  return 2;
}

function parseMajorAmount(value, currency) {
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

function formatMoney(minorAmount, currency) {
  const exponent = getCurrencyExponent(currency);
  const amount = minorAmount / 10 ** exponent;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "usd").toUpperCase(),
  }).format(amount);
}

function buildProductSnapshot(specFlags) {
  const specifications = specFlags
    .map((entry) => {
      const [label, ...rest] = String(entry).split("=");
      if (!label || !rest.length) return null;
      return {
        label: label.trim(),
        value: rest.join("=").trim(),
      };
    })
    .filter(Boolean);

  return specifications.length ? { specifications } : {};
}

function parseBooleanFlag(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "true", "yes", "on", "enabled"].includes(normalized);
}

function normalizeMonogramInitials(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

async function handleCreate(flags) {
  const currency = getFlag(flags, "currency", "mxn");
  const subtotalAmount = parseMajorAmount(getFlag(flags, "subtotal", "0"), currency);
  const shippingAmount = parseMajorAmount(getFlag(flags, "shipping", "0"), currency);
  const personalMonogramEnabled = parseBooleanFlag(getFlag(flags, "personal-monogram"));
  const monogramInitials = normalizeMonogramInitials(getFlag(flags, "monogram-initials"));
  const monogramPlacement = getFlag(flags, "monogram-placement", "Leather case");
  const monogramNote = getFlag(flags, "monogram-note");
  const monogramFeeAmount = personalMonogramEnabled
    ? parseMajorAmount(getFlag(flags, "monogram-fee", "0"), currency)
    : 0;
  const totalAmount = parseMajorAmount(
    getFlag(
      flags,
      "total",
      `${(subtotalAmount + shippingAmount + monogramFeeAmount) / 10 ** getCurrencyExponent(currency)}`,
    ),
    currency,
  );
  const quantity = Number(getFlag(flags, "quantity", "1"));
  const expiresInHours = Number(getFlag(flags, "expires-in-hours", "72"));
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  const productSnapshot = buildProductSnapshot(getRepeatedFlag(flags, "spec"));
  const personalMonogram = personalMonogramEnabled
    ? {
        enabled: true,
        initials: monogramInitials,
        placement: monogramPlacement,
        note: monogramNote || null,
        feeAmount: monogramFeeAmount,
        currency,
        finish: "Tonal deboss",
      }
    : {
        enabled: false,
      };

  if (personalMonogramEnabled && (monogramInitials.length < 1 || monogramInitials.length > 3)) {
    throw new Error("Personal Monogram initials must remain between one and three characters.");
  }

  const result = await createPrivateAcquisitionSession({
    clientName: getFlag(flags, "client-name"),
    clientEmail: getFlag(flags, "client-email"),
    clientPhone: getFlag(flags, "client-phone"),
    productName: getFlag(flags, "product-name"),
    productSnapshot,
    orderSnapshot: {
      issuedFollowing: "Direct correspondence",
      housePreparedAt: new Date().toISOString(),
      personalMonogram,
      priceLines: [
        {
          label: getFlag(flags, "product-name"),
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
                amount: monogramFeeAmount,
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
    shippingCountry: getFlag(flags, "shipping-country"),
    shippingRegion: getFlag(flags, "shipping-region"),
    note: getFlag(flags, "note"),
    createdBy: getFlag(flags, "created-by"),
    expiresAt,
  });

  console.log("");
  console.log("Private acquisition session issued");
  console.log("--------------------------------");
  console.log(`Reference code : ${result.referenceCode}`);
  console.log(`Private URL    : ${result.privateUrl}`);
  console.log(`Expires at     : ${result.expiresAt}`);
  console.log(`Product        : ${result.orderSummary.productName}`);
  console.log(`Quantity       : ${result.orderSummary.quantity}`);
  console.log(
    `Total          : ${formatMoney(result.orderSummary.totalAmount, result.orderSummary.currency)}`,
  );
  if (result.orderSummary.shippingCountry || result.orderSummary.shippingRegion) {
    console.log(
      `Destination    : ${[
        result.orderSummary.shippingRegion,
        result.orderSummary.shippingCountry,
      ]
        .filter(Boolean)
        .join(", ")}`,
    );
  }
  if (personalMonogramEnabled) {
    console.log(
      `Monogram       : ${monogramInitials} / ${monogramPlacement} / ${formatMoney(monogramFeeAmount, currency)}`,
    );
  }
  console.log("");
}

async function handleRevoke(flags) {
  const result = await revokePrivateAcquisitionSession({
    referenceCode: getFlag(flags, "reference-code"),
    note: getFlag(flags, "note"),
  });

  console.log("");
  console.log("Private acquisition session revoked");
  console.log("-----------------------------------");
  console.log(`Reference code : ${result.referenceCode}`);
  console.log(`Revoked at     : ${result.revokedAt}`);
  console.log("");
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const command = positional[0];

  if (!command || command === "--help" || command === "help") {
    printUsage();
    return;
  }

  if (command === "create") {
    await handleCreate(flags);
    return;
  }

  if (command === "revoke") {
    await handleRevoke(flags);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error("");
  console.error(error instanceof Error ? error.message : String(error));
  console.error("");
  process.exitCode = 1;
});
