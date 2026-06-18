import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const seoPath = path.join(rootDir, "src", "lib", "site-seo.ts");
const sitemapPath = path.join(rootDir, "public", "sitemap.xml");
const siteOrigin = "https://praeliator.com";

function extractRouteBlocks(source) {
  const routeMetadataStart = source.indexOf("const routeMetadata");
  const routeMetadataEnd = source.indexOf("export function getSiteMetadata");

  if (routeMetadataStart === -1 || routeMetadataEnd === -1) {
    throw new Error("Unable to find route metadata in site-seo.ts.");
  }

  const metadataSource = source.slice(routeMetadataStart, routeMetadataEnd);
  const routeBlocks = [];
  const routePattern = /^\s+"([^"]+)":\s+\{([\s\S]*?)^\s+\},/gm;
  let match;

  while ((match = routePattern.exec(metadataSource))) {
    routeBlocks.push({
      route: match[1],
      body: match[2],
    });
  }

  return routeBlocks;
}

function extractStringProperty(body, propertyName) {
  const match = body.match(new RegExp(`${propertyName}:\\s+"([^"]+)"`));
  return match?.[1] || "";
}

function buildSitemapXml(routes) {
  const urls = routes
    .map((route) => {
      const loc = route === "/" ? siteOrigin : `${siteOrigin}${route}`;
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const source = await readFile(seoPath, "utf8");
const routes = extractRouteBlocks(source)
  .filter(({ body }) => !extractStringProperty(body, "robots").includes("noindex"))
  .map(({ body, route }) => extractStringProperty(body, "canonicalPath") || route);

await writeFile(sitemapPath, buildSitemapXml(routes), "utf8");
