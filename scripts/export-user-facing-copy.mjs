import fs from "fs";
import path from "path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default ?? traverseModule;

const workspaceRoot = process.cwd();
const sourceFiles = [
  "src/index.tsx",
  "src/lib/site-locale.ts",
  "src/components/object-dossier-carousel.tsx",
  "src/lib/ownership-certificate-pdf.ts",
];

const outputPath = path.join(
  workspaceRoot,
  "docs",
  "user-facing-copy-inventory.md",
);

const technicalJsxAttributes = new Set([
  "className",
  "id",
  "src",
  "href",
  "target",
  "rel",
  "type",
  "name",
  "role",
  "autoComplete",
  "autoCapitalize",
  "inputMode",
  "maxLength",
  "minLength",
  "draggable",
  "referrerPolicy",
  "aria-controls",
  "aria-describedby",
  "aria-labelledby",
  "aria-hidden",
  "aria-modal",
  "aria-activedescendant",
  "aria-expanded",
  "aria-invalid",
  "aria-pressed",
]);

function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function looksLikeAssetOrRoute(value) {
  return (
    value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../") ||
    /^https?:\/\//i.test(value) ||
    /\.(png|jpe?g|svg|avif|mp4|woff2?|ico|css|ts|tsx|js|mjs)$/i.test(value)
  );
}

function looksLikeStyleValue(value) {
  return (
    value.includes("bg-[") ||
    value.includes("text-[") ||
    value.includes("border-[") ||
    value.includes("rounded-[") ||
    value.includes("shadow-[") ||
    value.includes("tracking-[") ||
    value.includes("linear-gradient(") ||
    value.includes("radial-gradient(") ||
    value.includes("rgba(") ||
    value.includes("h-[") ||
    value.includes("w-[") ||
    value.includes("py-") ||
    value.includes("px-") ||
    value.includes("sm:") ||
    value.includes("lg:") ||
    value.includes("xl:")
  );
}

function looksHumanReadable(value) {
  if (!value) return false;
  if (value.length < 2) return false;
  if (!/\p{L}/u.test(value)) return false;
  if (looksLikeAssetOrRoute(value)) return false;
  if (looksLikeStyleValue(value)) return false;
  if (value.startsWith("VITE_")) return false;
  if (value === "react" || value === "react-dom") return false;
  return true;
}

function shouldIgnoreStringLiteral(pathRef) {
  const parent = pathRef.parentPath;

  if (parent?.isImportDeclaration()) return true;

  if (parent?.isJSXAttribute()) {
    const attrName = parent.node.name?.name;
    if (typeof attrName === "string" && technicalJsxAttributes.has(attrName)) {
      return true;
    }
  }

  if (parent?.isObjectProperty()) {
    const key = parent.node.key;
    if (
      key &&
      ((key.type === "Identifier" &&
        ["src", "href", "video", "poster", "image", "path", "id", "ref_id", "type", "market", "ticker", "server", "uri"].includes(key.name)) ||
        (key.type === "StringLiteral" &&
          ["src", "href", "video", "poster", "image", "path", "id", "ref_id", "type", "market", "ticker", "server", "uri"].includes(key.value)))
    ) {
      return true;
    }
  }

  return false;
}

function reconstructTemplateLiteral(pathRef) {
  const parts = [];
  pathRef.node.quasis.forEach((quasi, index) => {
    parts.push(quasi.value.cooked ?? quasi.value.raw ?? "");
    if (index < pathRef.node.expressions.length) {
      parts.push("${…}");
    }
  });
  return normalizeText(parts.join(""));
}

function readEntries(filePath) {
  const absolutePath = path.join(workspaceRoot, filePath);
  const source = fs.readFileSync(absolutePath, "utf8");
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  const entries = [];

  function pushEntry(kind, line, rawText) {
    const text = normalizeText(rawText);
    if (!looksHumanReadable(text)) return;
    entries.push({ kind, line, text });
  }

  traverse(ast, {
    JSXText(pathRef) {
      pushEntry("JSX", pathRef.node.loc?.start.line ?? 0, pathRef.node.value);
    },
    StringLiteral(pathRef) {
      if (shouldIgnoreStringLiteral(pathRef)) return;
      pushEntry("String", pathRef.node.loc?.start.line ?? 0, pathRef.node.value);
    },
    TemplateLiteral(pathRef) {
      if (pathRef.parentPath?.isTaggedTemplateExpression()) return;
      const text = reconstructTemplateLiteral(pathRef);
      if (!text.includes("${…}") && pathRef.node.expressions.length === 0) return;
      pushEntry("Template", pathRef.node.loc?.start.line ?? 0, text);
    },
  });

  return entries.sort((left, right) => left.line - right.line);
}

const fileEntries = sourceFiles.map((filePath) => ({
  filePath,
  entries: readEntries(filePath),
}));

const totalEntries = fileEntries.reduce(
  (sum, fileGroup) => sum + fileGroup.entries.length,
  0,
);

const lines = [
  "# User-Facing Copy Inventory",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "Scope:",
  ...sourceFiles.map((filePath) => `- \`${filePath}\``),
  "",
  `Total extracted entries: ${totalEntries}`,
  "",
  "Notes:",
  "- This is a raw copy inventory extracted from the source files that render UI text or user-facing document text.",
  "- It includes visible page copy, selectable option labels, notices, prompts, PDF/export text, and some accessibility-adjacent strings.",
  "- It may still include a small amount of near-UI technical text if that text participates in the user experience.",
  "",
];

for (const fileGroup of fileEntries) {
  lines.push(`## ${fileGroup.filePath}`);
  lines.push("");

  if (!fileGroup.entries.length) {
    lines.push("- No entries extracted.");
    lines.push("");
    continue;
  }

  for (const entry of fileGroup.entries) {
    lines.push(`- L${entry.line} [${entry.kind}]: ${entry.text}`);
  }

  lines.push("");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, lines.join("\n"), "utf8");

console.log(`Wrote ${totalEntries} entries to ${outputPath}`);
