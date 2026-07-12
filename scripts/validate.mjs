#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SITE_URL = "https://mattian94.github.io/";
const SITE = new URL(SITE_URL);

const requiredFiles = [
  "index.html",
  "it/index.html",
  "404.html",
  "assets/styles.css",
  "assets/i18n.js",
  "assets/app.js",
  "assets/favicon.svg",
  "assets/og-card.png",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "sw.js",
  "site.webmanifest",
  "site-it.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "humans.txt",
  "llms.txt",
  "llms-full.txt",
  "hire-me.txt",
  ".nojekyll",
  ".well-known/security.txt",
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "package.json",
  "scripts/validate.mjs",
  "scripts/generate-localized-page.mjs",
  ".github/workflows/quality.yml",
  ".github/workflows/pages.yml"
];

const publicFiles = [
  "index.html",
  "it",
  "404.html",
  "assets",
  "sw.js",
  "site.webmanifest",
  "site-it.webmanifest",
  "robots.txt",
  "sitemap.xml",
  "humans.txt",
  "llms.txt",
  "llms-full.txt",
  "hire-me.txt",
  ".nojekyll",
  ".well-known/security.txt"
];

const errors = [];
const warnings = [];
const sectionResults = [];
const textCache = new Map();
const idCache = new Map();
let activeSection = "Validation";
let checkCount = 0;

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function absolute(relativePath) {
  return path.join(ROOT, ...relativePath.split("/"));
}

function formatBytes(bytes) {
  if (bytes < 1024) return String(bytes) + " B";
  return (bytes / 1024).toFixed(1) + " KiB";
}

function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
}

function check(condition, message) {
  checkCount += 1;
  if (!condition) errors.push("[" + activeSection + "] " + message);
  return condition;
}

function warn(condition, message) {
  if (!condition) warnings.push("[" + activeSection + "] " + message);
}

async function runSection(name, callback) {
  activeSection = name;
  const beforeChecks = checkCount;
  const beforeErrors = errors.length;
  try {
    await callback();
  } catch (error) {
    errors.push("[" + name + "] Unexpected validator error: " + error.message);
  }
  sectionResults.push({
    name,
    checks: checkCount - beforeChecks,
    passed: errors.length === beforeErrors
  });
}

async function fileInfo(relativePath) {
  try {
    return await stat(absolute(relativePath));
  } catch {
    return null;
  }
}

async function isFile(relativePath) {
  const info = await fileInfo(relativePath);
  return Boolean(info && info.isFile());
}

async function readText(relativePath) {
  if (!textCache.has(relativePath)) {
    textCache.set(relativePath, await readFile(absolute(relativePath), "utf8"));
  }
  return textCache.get(relativePath);
}

function tags(html, tagName) {
  return html.match(new RegExp("<" + tagName + "\\b[^>]*>", "gi")) || [];
}

function attribute(tag, name) {
  const expression = new RegExp(
    "\\b" + escapeRegExp(name) + "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))",
    "i"
  );
  const match = tag.match(expression);
  return match ? match[1] ?? match[2] ?? match[3] ?? "" : null;
}

function decodeHtml(value) {
  return String(value)
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function metaContent(html, key, value) {
  for (const tag of tags(html, "meta")) {
    const actual = attribute(tag, key);
    if (actual && actual.toLowerCase() === value.toLowerCase()) {
      return decodeHtml(attribute(tag, "content") || "");
    }
  }
  return "";
}

function linkHref(html, relValue) {
  for (const tag of tags(html, "link")) {
    const rel = (attribute(tag, "rel") || "").toLowerCase().split(/\s+/);
    if (rel.includes(relValue.toLowerCase())) {
      return decodeHtml(attribute(tag, "href") || "");
    }
  }
  return "";
}

function alternateHref(html, language) {
  for (const tag of tags(html, "link")) {
    const rel = (attribute(tag, "rel") || "").toLowerCase().split(/\s+/);
    if (rel.includes("alternate") && (attribute(tag, "hreflang") || "").toLowerCase() === language.toLowerCase()) {
      return decodeHtml(attribute(tag, "href") || "");
    }
  }
  return "";
}

function documentTitle(html) {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(match[1].replace(/<[^>]+>/g, "").trim()) : "";
}

function collectIds(html) {
  const ids = [];
  const expression = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
  let match;
  while ((match = expression.exec(html))) ids.push(match[1] || match[2]);
  return ids;
}

async function idsFor(relativePath) {
  if (!idCache.has(relativePath)) {
    idCache.set(relativePath, new Set(collectIds(await readText(relativePath))));
  }
  return idCache.get(relativePath);
}

async function walk(relativeDirectory = "") {
  const entries = await readdir(absolute(relativeDirectory), { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    if ([".git", "node_modules", "_site"].includes(entry.name)) continue;
    const relativePath = toPosix(path.join(relativeDirectory, entry.name));
    if (entry.isDirectory()) output.push(...await walk(relativePath));
    if (entry.isFile()) output.push(relativePath);
  }
  return output;
}

async function checkLocalReference(rawValue, sourceRelativePath, kind) {
  if (rawValue === null || rawValue === undefined) return;
  const raw = decodeHtml(String(rawValue).trim());
  if (!raw) return;

  if (/^javascript:/i.test(raw)) {
    check(false, sourceRelativePath + " contains an unsafe javascript URL: " + raw);
    return;
  }

  if (/^(?:mailto|tel|data|blob):/i.test(raw)) return;

  let pathname;
  let fragment = "";

  if (/^https?:\/\//i.test(raw)) {
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      check(false, sourceRelativePath + " contains a malformed URL: " + raw);
      return;
    }
    if (parsed.hostname.toLowerCase() !== SITE.hostname.toLowerCase()) return;
    check(parsed.origin === SITE.origin, sourceRelativePath + " must use canonical HTTPS origin: " + raw);
    pathname = parsed.pathname;
    fragment = parsed.hash.slice(1);
  } else {
    const hashIndex = raw.indexOf("#");
    const queryIndex = raw.indexOf("?");
    const endOfPathCandidates = [hashIndex, queryIndex].filter((index) => index >= 0);
    const endOfPath = endOfPathCandidates.length ? Math.min(...endOfPathCandidates) : raw.length;
    pathname = raw.slice(0, endOfPath);
    fragment = hashIndex >= 0 ? raw.slice(hashIndex + 1) : "";
  }

  let targetRelativePath;
  if (!pathname && fragment) {
    targetRelativePath = sourceRelativePath;
  } else if (pathname.startsWith("/")) {
    targetRelativePath = pathname.slice(1);
  } else {
    targetRelativePath = path.posix.join(path.posix.dirname(sourceRelativePath), pathname);
  }

  try {
    targetRelativePath = decodeURIComponent(targetRelativePath);
    fragment = decodeURIComponent(fragment);
  } catch {
    check(false, sourceRelativePath + " contains invalid URL encoding: " + raw);
    return;
  }

  targetRelativePath = path.posix.normalize(targetRelativePath || "");
  if (targetRelativePath === ".") targetRelativePath = "";
  if (!targetRelativePath || targetRelativePath.endsWith("/")) {
    targetRelativePath += "index.html";
  }

  if (targetRelativePath.startsWith("../") || path.posix.isAbsolute(targetRelativePath)) {
    check(false, sourceRelativePath + " references a path outside the site: " + raw);
    return;
  }

  const targetExists = await isFile(targetRelativePath);
  check(targetExists, sourceRelativePath + " references missing local " + kind + ": " + raw);

  if (targetExists && fragment && targetRelativePath.toLowerCase().endsWith(".html")) {
    const targetIds = await idsFor(targetRelativePath);
    check(
      targetIds.has(fragment),
      sourceRelativePath + " references missing anchor #" + fragment + " in " + targetRelativePath
    );
  }
}

async function checkCssReferences(css, sourceRelativePath) {
  const expression = /url\(\s*(?:(["'])(.*?)\1|([^)\s]+))\s*\)/gi;
  let match;
  while ((match = expression.exec(css))) {
    await checkLocalReference(match[2] || match[3], sourceRelativePath, "CSS asset");
  }
}

function jsonLdBlocks(html) {
  const blocks = [];
  const expression = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = expression.exec(html))) {
    if ((attribute(match[1], "type") || "").toLowerCase() === "application/ld+json") {
      blocks.push(match[2].trim());
    }
  }
  return blocks;
}

function collectJsonObjects(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectJsonObjects(item, output);
  } else if (value && typeof value === "object") {
    output.push(value);
    for (const item of Object.values(value)) collectJsonObjects(item, output);
  }
  return output;
}

function extractAssignedLiteral(source, assignmentPrefix, openingCharacter, closingCharacter) {
  const assignment = source.indexOf(assignmentPrefix);
  if (assignment < 0) return null;
  const start = source.indexOf(openingCharacter, assignment + assignmentPrefix.length);
  if (start < 0) return null;
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (["'", '"', "`"].includes(character)) {
      quote = character;
      continue;
    }
    if (character === openingCharacter) depth += 1;
    if (character === closingCharacter) {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  return null;
}

function evaluateLiteral(source, label) {
  try {
    return vm.runInNewContext("(" + source + ")", Object.create(null), { timeout: 1000 });
  } catch (error) {
    check(false, "Could not parse " + label + ": " + error.message);
    return null;
  }
}

function collectStrings(value, output = []) {
  if (typeof value === "string") output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, output));
  return output;
}

function hasType(entity, type) {
  const value = entity && entity["@type"];
  return Array.isArray(value) ? value.includes(type) : value === type;
}

function pngDimensions(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== signature) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

await runSection("Required files", async () => {
  for (const relativePath of requiredFiles) {
    check(await isFile(relativePath), "Missing required file: " + relativePath);
  }
});

await runSection("Metadata and canonical URLs", async () => {
  const html = await readText("index.html");
  const italianHtml = await readText("it/index.html");
  const errorHtml = await readText("404.html");
  const title = documentTitle(html);
  const description = metaContent(html, "name", "description");
  const robots = metaContent(html, "name", "robots");

  check(/^<!doctype html>/i.test(html.trimStart()), "index.html must start with an HTML5 doctype");
  check(/<html\b[^>]*\blang\s*=\s*["']en["']/i.test(html), "index.html must declare lang=\"en\"");
  check(/<meta\b[^>]*charset\s*=\s*["']?utf-8/i.test(html), "index.html must declare UTF-8");
  check(metaContent(html, "name", "viewport").includes("width=device-width"), "Viewport metadata is missing or incomplete");
  check(title.length >= 30 && title.length <= 60, "Title must be between 30 and 60 characters; found " + title.length);
  check(description.length >= 120 && description.length <= 170, "Description must be between 120 and 170 characters; found " + description.length);
  check(Boolean(metaContent(html, "name", "author")), "Author metadata is required");
  check(/\bindex\b/i.test(robots) && /\bfollow\b/i.test(robots), "Home robots metadata must allow index and follow");
  check(linkHref(html, "canonical") === SITE_URL, "Canonical URL must be exactly " + SITE_URL);
  check(alternateHref(html, "en") === SITE_URL, "English hreflang must self-reference the canonical URL");
  check(alternateHref(html, "it") === SITE_URL + "it/", "Italian hreflang must reference the localized URL");
  check(alternateHref(html, "x-default") === SITE_URL, "x-default hreflang must reference the English fallback");
  check(/^site\.webmanifest(?:\?v=\d+)?$/.test(linkHref(html, "manifest") || ""), "Home must reference site.webmanifest, optionally with a numeric cache version");
  check(Boolean(linkHref(html, "icon")), "Home must reference a favicon");

  const italianTitle = documentTitle(italianHtml);
  const italianDescription = metaContent(italianHtml, "name", "description");
  check(/<html\b[^>]*\blang\s*=\s*["']it["']/i.test(italianHtml), "Italian page must declare lang=\"it\"");
  check(linkHref(italianHtml, "canonical") === SITE_URL + "it/", "Italian canonical URL must self-reference /it/");
  check(alternateHref(italianHtml, "en") === SITE_URL, "Italian page must link back to the English alternate");
  check(alternateHref(italianHtml, "it") === SITE_URL + "it/", "Italian hreflang must self-reference /it/");
  check(alternateHref(italianHtml, "x-default") === SITE_URL, "Italian x-default must reference the English fallback");
  check(/^\/site-it\.webmanifest(?:\?v=\d+)?$/.test(linkHref(italianHtml, "manifest") || ""), "Italian page must reference site-it.webmanifest");
  check(italianTitle.length >= 30 && italianTitle.length <= 60, "Italian title must be between 30 and 60 characters; found " + italianTitle.length);
  check(italianDescription.length >= 120 && italianDescription.length <= 170, "Italian description must be between 120 and 170 characters; found " + italianDescription.length);
  check(metaContent(italianHtml, "property", "og:locale") === "it_IT", "Italian Open Graph locale must be it_IT");
  check(metaContent(italianHtml, "property", "og:url") === SITE_URL + "it/", "Italian Open Graph URL must equal its canonical URL");
  check(Boolean(metaContent(italianHtml, "property", "og:image:alt")), "Italian Open Graph image alt text is required");

  check(metaContent(html, "property", "og:type") === "profile", "Open Graph type must be profile");
  check(Boolean(metaContent(html, "property", "og:title")), "Open Graph title is required");
  check(Boolean(metaContent(html, "property", "og:description")), "Open Graph description is required");
  check(metaContent(html, "property", "og:url") === SITE_URL, "Open Graph URL must equal the canonical URL");
  check(/^https:\/\/mattian94\.github\.io\/assets\/og-card\.png(?:\?v=\d+)?$/.test(metaContent(html, "property", "og:image")), "Open Graph image must use the canonical absolute URL, optionally with a numeric cache version");
  check(metaContent(html, "property", "og:image:width") === "1200", "Open Graph image width must be 1200");
  check(metaContent(html, "property", "og:image:height") === "630", "Open Graph image height must be 630");
  check(Boolean(metaContent(html, "property", "og:image:alt")), "Open Graph image alt text is required");

  check(metaContent(html, "name", "twitter:card") === "summary_large_image", "Twitter card must be summary_large_image");
  check(Boolean(metaContent(html, "name", "twitter:title")), "Twitter title is required");
  check(Boolean(metaContent(html, "name", "twitter:description")), "Twitter description is required");
  check(/^https:\/\/mattian94\.github\.io\/assets\/og-card\.png(?:\?v=\d+)?$/.test(metaContent(html, "name", "twitter:image")), "Twitter image must use the canonical absolute URL, optionally with a numeric cache version");

  check(/\bnoindex\b/i.test(metaContent(errorHtml, "name", "robots")), "404.html must declare noindex");
  check(documentTitle(errorHtml).length > 0, "404.html must include a title");

  const manifest = JSON.parse(await readText("site.webmanifest"));
  check(manifest.id === "/", "Manifest id must be /");
  check(manifest.start_url === "/", "Manifest start_url must be /");
  check(manifest.scope === "/", "Manifest scope must be /");
  check(manifest.lang === "en", "Manifest language must be en");
  check(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "Manifest must include 192px and 512px icons");

  const italianManifest = JSON.parse(await readText("site-it.webmanifest"));
  check(italianManifest.id === "/", "Both language manifests must identify the same PWA");
  check(italianManifest.start_url === "/it/", "Italian manifest start_url must open /it/");
  check(italianManifest.scope === "/", "Italian manifest scope must be /");
  check(italianManifest.lang === "it", "Italian manifest language must be it");
  check(Array.isArray(italianManifest.icons) && italianManifest.icons.length >= 2, "Italian manifest must include 192px and 512px icons");

  const robotsText = await readText("robots.txt");
  check(
    robotsText.includes("Sitemap: " + SITE_URL + "sitemap.xml"),
    "robots.txt must reference the canonical sitemap"
  );

  const sitemap = await readText("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => match[1].trim());
  check(JSON.stringify(locations) === JSON.stringify([SITE_URL, SITE_URL + "it/"]), "sitemap.xml must include exactly the English and Italian canonical URLs");
  for (const location of locations) {
    check(location.startsWith(SITE_URL), "Sitemap URL must use the canonical origin: " + location);
  }

  const securityText = await readText(".well-known/security.txt");
  check(
    securityText.includes("Canonical: " + SITE_URL + ".well-known/security.txt"),
    "security.txt must declare its canonical URL"
  );
  const expiryMatch = securityText.match(/^Expires:\s*(.+)$/im);
  check(Boolean(expiryMatch), "security.txt must include an Expires field");
  if (expiryMatch) {
    const expiry = Date.parse(expiryMatch[1].trim());
    check(Number.isFinite(expiry) && expiry > Date.now(), "security.txt expiry must be a valid future date");
  }
});

await runSection("Structured data", async () => {
  const html = await readText("index.html");
  const blocks = jsonLdBlocks(html);
  check(blocks.length > 0, "index.html must include JSON-LD");

  const documents = [];
  for (const block of blocks) {
    try {
      documents.push(JSON.parse(block));
      check(true, "JSON-LD parsed");
    } catch (error) {
      check(false, "JSON-LD is not valid JSON: " + error.message);
    }
  }

  const entities = documents.flatMap((document) => collectJsonObjects(document));
  for (const type of ["WebSite", "ProfilePage", "Person"]) {
    check(entities.some((entity) => hasType(entity, type)), "JSON-LD must include a " + type + " entity");
  }

  for (const document of documents) {
    check(
      document["@context"] === "https://schema.org",
      "Each top-level JSON-LD document must use https://schema.org"
    );
  }

  const profile = entities.find((entity) => hasType(entity, "ProfilePage"));
  const person = entities.find((entity) => hasType(entity, "Person"));
  if (profile) check(profile.url === SITE_URL, "ProfilePage URL must equal the canonical URL");
  if (person) {
    check(person.url === SITE_URL, "Person URL must equal the canonical URL");
    check(person.name === "Mattia Necchio", "Person name must be Mattia Necchio");
    check(
      Array.isArray(person.sameAs) &&
        person.sameAs.some((url) => /linkedin\.com\/in\/mattia-necchio\/?$/i.test(url)) &&
        person.sameAs.some((url) => /github\.com\/MattiaN94\/?$/i.test(url)),
      "Person sameAs must include LinkedIn and GitHub"
    );
  }

  const italianBlocks = jsonLdBlocks(await readText("it/index.html"));
  const italianDocuments = [];
  for (const block of italianBlocks) {
    try {
      italianDocuments.push(JSON.parse(block));
      check(true, "Italian JSON-LD parsed");
    } catch (error) {
      check(false, "Italian JSON-LD is not valid JSON: " + error.message);
    }
  }
  const italianEntities = italianDocuments.flatMap((document) => collectJsonObjects(document));
  for (const type of ["WebSite", "ProfilePage", "Person"]) {
    check(italianEntities.some((entity) => hasType(entity, type)), "Italian JSON-LD must include a " + type + " entity");
  }
  const italianProfile = italianEntities.find((entity) => hasType(entity, "ProfilePage"));
  if (italianProfile) check(italianProfile.url === SITE_URL + "it/", "Italian ProfilePage URL must equal its canonical URL");
});

await runSection("Local links and assets", async () => {
  for (const relativePath of ["index.html", "it/index.html", "404.html"]) {
    const html = await readText(relativePath);
    const referenceAttributes = [
      ["a", "href", "link"],
      ["link", "href", "asset"],
      ["script", "src", "script"],
      ["img", "src", "image"],
      ["source", "src", "media"],
      ["video", "poster", "poster"],
      ["iframe", "src", "frame"],
      ["form", "action", "form action"]
    ];

    for (const [tagName, attributeName, kind] of referenceAttributes) {
      for (const tag of tags(html, tagName)) {
        await checkLocalReference(attribute(tag, attributeName), relativePath, kind);
      }
    }

    for (const tag of html.match(/<[a-z][^>]*>/gi) || []) {
      const srcset = attribute(tag, "srcset");
      if (!srcset) continue;
      for (const candidate of srcset.split(",")) {
        await checkLocalReference(candidate.trim().split(/\s+/)[0], relativePath, "responsive image");
      }
    }

    for (const key of ["og:image", "twitter:image"]) {
      const value = key.startsWith("og:")
        ? metaContent(html, "property", key)
        : metaContent(html, "name", key);
      await checkLocalReference(value, relativePath, "social image");
    }

    const styleExpression = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleExpression.exec(html))) {
      await checkCssReferences(styleMatch[1], relativePath);
    }
  }

  await checkCssReferences(await readText("assets/styles.css"), "assets/styles.css");

  if (await isFile("sw.js")) {
    const serviceWorker = await readText("sw.js");
    const appScript = await readText("assets/app.js");
    check(
      /navigator\.serviceWorker\.register\(\s*["']\/sw\.js["']\s*\)/.test(appScript),
      "assets/app.js must register /sw.js from every locale route"
    );
    const assetList = serviceWorker.match(/\bCORE_ASSETS\s*=\s*\[([\s\S]*?)\]/);
    check(Boolean(assetList), "sw.js must declare a CORE_ASSETS array");
    if (assetList) {
      const quotedValue = /(["'])(.*?)\1/g;
      let assetMatch;
      while ((assetMatch = quotedValue.exec(assetList[1]))) {
        await checkLocalReference(assetMatch[2], "sw.js", "precache asset");
      }
    }
  }

  for (const manifestPath of ["site.webmanifest", "site-it.webmanifest"]) {
    const manifest = JSON.parse(await readText(manifestPath));
    for (const icon of manifest.icons || []) {
      await checkLocalReference(icon.src, manifestPath, "manifest icon");
    }
    for (const shortcut of manifest.shortcuts || []) {
      await checkLocalReference(shortcut.url, manifestPath, "manifest shortcut");
    }
    for (const key of ["id", "start_url", "scope"]) {
      await checkLocalReference(manifest[key], manifestPath, "manifest URL");
    }
  }

  const sitemap = await readText("sitemap.xml");
  for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)) {
    await checkLocalReference(match[1].trim(), "sitemap.xml", "sitemap URL");
  }

  const robots = await readText("robots.txt");
  for (const match of robots.matchAll(/^Sitemap:\s*(\S+)/gim)) {
    await checkLocalReference(match[1], "robots.txt", "sitemap");
  }

  for (const relativePath of ["humans.txt", "hire-me.txt", "llms.txt", "llms-full.txt", ".well-known/security.txt"]) {
    const text = await readText(relativePath);
    const urls = text.match(/https:\/\/mattian94\.github\.io\/[^\s<>"')\]]*/gi) || [];
    for (const url of urls) {
      await checkLocalReference(url.replace(/[.,;:]$/, ""), relativePath, "canonical URL");
    }
  }

  for (const relativePath of ["README.md", "SECURITY.md"]) {
    const markdown = await readText(relativePath);
    const expression = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^)]*)?\)/g;
    let match;
    while ((match = expression.exec(markdown))) {
      await checkLocalReference(match[1], relativePath, "Markdown link");
    }
  }
});

await runSection("Accessibility semantics", async () => {
  for (const relativePath of ["index.html", "it/index.html", "404.html"]) {
    const html = await readText(relativePath);
    const ids = collectIds(html);
    const idSet = new Set(ids);

    check(/<html\b[^>]*\blang\s*=\s*["'][a-z]{2}(?:-[A-Z]{2})?["']/i.test(html), relativePath + " must declare a language");
    check(tags(html, "h1").length === 1, relativePath + " must contain exactly one h1");
    check(tags(html, "main").length === 1, relativePath + " must contain exactly one main landmark");
    check(ids.length === idSet.size, relativePath + " contains duplicate IDs");

    const skipLink = tags(html, "a").find((tag) =>
      (attribute(tag, "class") || "").split(/\s+/).includes("skip-link")
    );
    check(Boolean(skipLink), relativePath + " must include a skip link");
    if (skipLink) {
      const target = (attribute(skipLink, "href") || "").replace(/^#/, "");
      check(idSet.has(target), relativePath + " skip link target does not exist");
    }

    const untypedButtons = tags(html, "button").filter((button) => !attribute(button, "type"));
    check(
      untypedButtons.length === 0,
      relativePath + " contains " + untypedButtons.length + " button(s) without an explicit type"
    );

    for (const image of tags(html, "img")) {
      check(attribute(image, "alt") !== null, relativePath + " contains an image without alt text");
    }

    for (const frame of tags(html, "iframe")) {
      check(Boolean(attribute(frame, "title")), relativePath + " contains an iframe without a title");
    }

    for (const anchor of tags(html, "a")) {
      const href = attribute(anchor, "href") || "";
      check(!/^javascript:/i.test(href), relativePath + " contains a javascript link");
      if ((attribute(anchor, "target") || "").toLowerCase() === "_blank") {
        const rel = (attribute(anchor, "rel") || "").toLowerCase().split(/\s+/);
        check(rel.includes("noopener") && rel.includes("noreferrer"), relativePath + " target=_blank link must use noopener noreferrer");
      }
    }

    for (const dialog of tags(html, "dialog")) {
      check(
        Boolean(attribute(dialog, "aria-label") || attribute(dialog, "aria-labelledby")),
        relativePath + " contains an unnamed dialog"
      );
    }

    const ariaReferenceExpression = /\baria-(?:labelledby|describedby|controls|owns)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi;
    let ariaMatch;
    while ((ariaMatch = ariaReferenceExpression.exec(html))) {
      for (const reference of (ariaMatch[1] || ariaMatch[2]).trim().split(/\s+/)) {
        check(idSet.has(reference), relativePath + " ARIA reference does not exist: " + reference);
      }
    }

    const controlExpression = /<(input|select|textarea)\b[^>]*>/gi;
    let controlMatch;
    while ((controlMatch = controlExpression.exec(html))) {
      const control = controlMatch[0];
      if ((attribute(control, "type") || "").toLowerCase() === "hidden") continue;
      const id = attribute(control, "id");
      const before = html.slice(0, controlMatch.index);
      const nestedLabel = before.lastIndexOf("<label") > before.lastIndexOf("</label>");
      const explicitLabel = id
        ? new RegExp("<label\\b[^>]*\\bfor\\s*=\\s*[\"']" + escapeRegExp(id) + "[\"']", "i").test(html)
        : false;
      const ariaLabel = Boolean(attribute(control, "aria-label") || attribute(control, "aria-labelledby"));
      check(nestedLabel || explicitLabel || ariaLabel, relativePath + " contains an unlabelled form control");
    }

    check(!/<[^>]+\son[a-z]+\s*=/i.test(html), relativePath + " must not use inline event-handler attributes");
  }
});

await runSection("Secrets and unfinished content", async () => {
  const allFiles = await walk();
  const textExtensions = new Set([
    ".css", ".html", ".js", ".json", ".md", ".mjs", ".txt", ".webmanifest", ".xml", ".yaml", ".yml"
  ]);
  const textBasenames = new Set([".gitignore", "LICENSE"]);

  const secretPatterns = [
    ["private key", /-----BEGIN\s+(?:RSA\s+|EC\s+|OPENSSH\s+|PGP\s+)?PRIVATE KEY-----/],
    ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
    ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
    ["OpenAI API key", /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/],
    ["Google API key", /\bAIza[0-9A-Za-z_-]{30,}\b/],
    ["Slack token", /\bxox[baprs]-[0-9A-Za-z-]{20,}\b/],
    ["Stripe live key", /\b(?:sk|rk)_live_[0-9A-Za-z]{20,}\b/],
    ["assigned credential", /\b(?:api[_-]?key|access[_-]?token|secret|password)\s*[:=]\s*["'][A-Za-z0-9_./+=-]{16,}["']/i]
  ];

  const unfinishedMarker = ["TO", "DO"].join("");
  const fixMarker = ["FIX", "ME"].join("");
  const loremMarker = ["lorem", " ipsum"].join("");
  const placeholderPatterns = [
    ["unfinished marker", new RegExp("\\b(?:" + unfinishedMarker + "|" + fixMarker + "|TBD|XXX)\\b", "i")],
    ["placeholder copy", new RegExp("\\b(?:" + loremMarker + "|change[-_ ]?me|replace[-_ ]?me)\\b", "i")],
    ["sample domain", /https?:\/\/(?:www\.)?example\.(?:com|org|net)\b/i]
  ];

  for (const relativePath of allFiles) {
    const extension = path.extname(relativePath).toLowerCase();
    if (!textExtensions.has(extension) && !textBasenames.has(path.basename(relativePath))) continue;
    const text = await readText(relativePath);

    check(!/[\u202A-\u202E\u2066-\u2069]/.test(text), relativePath + " contains bidirectional control characters");
    check(!text.includes("\u0000"), relativePath + " contains a null byte");

    for (const [name, pattern] of secretPatterns) {
      check(!pattern.test(text), relativePath + " appears to contain a " + name);
    }

    if (relativePath !== "scripts/validate.mjs") {
      for (const [name, pattern] of placeholderPatterns) {
        check(!pattern.test(text), relativePath + " appears to contain " + name);
      }
    }
  }
});

await runSection("Performance budgets", async () => {
  const budgets = new Map([
    ["index.html", 80 * 1024],
    ["it/index.html", 80 * 1024],
    ["404.html", 40 * 1024],
    ["assets/styles.css", 90 * 1024],
    ["assets/i18n.js", 96 * 1024],
    ["assets/app.js", 80 * 1024],
    ["sw.js", 12 * 1024],
    ["assets/favicon.svg", 32 * 1024],
    ["assets/icon-192.png", 100 * 1024],
    ["assets/icon-512.png", 300 * 1024],
    ["assets/og-card.png", 750 * 1024]
  ]);

  for (const [relativePath, budget] of budgets) {
    const info = await fileInfo(relativePath);
    if (!info || !info.isFile()) continue;
    check(
      info.size <= budget,
      relativePath + " exceeds its " + formatBytes(budget) + " budget at " + formatBytes(info.size)
    );
    warn(
      info.size <= budget * 0.8,
      relativePath + " uses more than 80% of its budget (" + formatBytes(info.size) + ")"
    );
  }

  let publicBytes = 0;
  for (const entry of publicFiles) {
    const info = await fileInfo(entry);
    if (!info) continue;
    if (info.isFile()) publicBytes += info.size;
    if (info.isDirectory()) {
      for (const relativePath of await walk(entry)) {
        const childInfo = await fileInfo(relativePath);
        if (childInfo && childInfo.isFile()) publicBytes += childInfo.size;
      }
    }
  }
  check(publicBytes <= 2 * 1024 * 1024, "Public site exceeds the 2 MiB total budget at " + formatBytes(publicBytes));

  const expectedPngs = [
    ["assets/og-card.png", 1200, 630],
    ["assets/icon-192.png", 192, 192],
    ["assets/icon-512.png", 512, 512]
  ];
  for (const [relativePath, width, height] of expectedPngs) {
    if (!await isFile(relativePath)) continue;
    const dimensions = pngDimensions(await readFile(absolute(relativePath)));
    check(Boolean(dimensions), relativePath + " must be a valid PNG");
    if (dimensions) {
      check(
        dimensions.width === width && dimensions.height === height,
        relativePath + " must be " + width + "x" + height + " but is " + dimensions.width + "x" + dimensions.height
      );
    }
  }

  if (await isFile("assets/favicon.svg")) {
    const favicon = await readText("assets/favicon.svg");
    check(/<svg\b/i.test(favicon) && /\bviewBox\s*=/i.test(favicon), "favicon.svg must be a valid scalable SVG");
    check(!/<script\b/i.test(favicon), "favicon.svg must not contain scripts");
  }
});

await runSection("Palette and case-study guardrails", async () => {
  const paletteSources = [
    "index.html",
    "it/index.html",
    "404.html",
    "assets/styles.css",
    "assets/favicon.svg",
    "scripts/generate_social_assets.py"
  ];
  const paletteBundle = (await Promise.all(paletteSources.map(readText))).join("\n");
  const isGreenDominant = ([red, green, blue]) => green >= 170 && green - red >= 35 && green - blue >= 60;
  const greenHexValues = [...paletteBundle.matchAll(/#([0-9a-f]{6})\b/gi)]
    .map((match) => [1, 3, 5].map((offset) => Number.parseInt(match[1].slice(offset - 1, offset + 1), 16)))
    .filter(isGreenDominant);
  const greenRgbValues = [...paletteBundle.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi)]
    .map((match) => match.slice(1, 4).map(Number))
    .filter(isGreenDominant);
  check(greenHexValues.length === 0, "Public palette must not contain green-dominant hex colours");
  check(greenRgbValues.length === 0, "Public palette must not contain green-dominant RGB colours");

  const html = await readText("index.html");
  const expectedCaseIds = ["research", "evaluation", "platform", "reporting", "measurement", "orchestration", "control"];
  const cardIds = [...html.matchAll(/\bid="case-([a-z-]+)"/g)].map((match) => match[1]);
  const actionIds = [...html.matchAll(/\bdata-case="([a-z-]+)"/g)].map((match) => match[1]);
  check(JSON.stringify(cardIds) === JSON.stringify(expectedCaseIds), "Public case-card IDs must match the approved generic set");
  check(JSON.stringify(actionIds) === JSON.stringify(expectedCaseIds), "Public case actions must match the approved generic set");
});

await runSection("Bilingual interface and product UX", async () => {
  const html = await readText("index.html");
  const italianHtml = await readText("it/index.html");
  const errorHtml = await readText("404.html");
  const app = await readText("assets/app.js");
  const i18n = await readText("assets/i18n.js");
  const styles = await readText("assets/styles.css");
  const serviceWorker = await readText("sw.js");
  const catalogLiteral = extractAssignedLiteral(i18n, "const IT = Object.freeze(", "{", "}");
  check(Boolean(catalogLiteral), "Italian catalog must be a static object literal");
  const italianCatalog = catalogLiteral ? evaluateLiteral(catalogLiteral, "Italian catalog") : null;

  check(html.includes('id="languageToggle"') && html.includes('id="mobileLanguageToggle"'), "Home must expose desktop and mobile language controls");
  check(errorHtml.includes('id="languageToggle"'), "404 must expose a language control");
  check(html.includes('assets/i18n.js?v=5') && italianHtml.includes('/assets/i18n.js?v=5') && errorHtml.includes('/assets/i18n.js?v=5'), "Every interface must load the v5 language runtime");
  check(i18n.includes("const STORAGE_KEY = 'mn-language'"), "Language preference must persist locally");
  check(i18n.includes("document.documentElement.lang = language"), "Language runtime must update the document language");
  check(i18n.includes("site-it.webmanifest?v=5"), "Italian UI must select the Italian manifest");
  check(i18n.includes("https://mattian94.github.io/it/"), "Italian runtime metadata must use the published /it/ URL");
  check(i18n.includes("const pathLanguage") && i18n.includes("url.pathname = nextLanguage === 'it' ? '/it/' : '/'"), "Language runtime must treat /it/ as the authoritative locale route");
  check(i18n.includes("const italianErrorRoute") && i18n.includes("url.pathname.replace(/^\\/it"), "English toggle must escape Italian 404 paths");
  check(i18n.includes("url.searchParams.set('lang', 'it')") && i18n.includes("url.searchParams.delete('lang')"), "404 and legacy links must retain query-language compatibility");
  check(i18n.includes("portfolio:languagechange") && app.includes("portfolio:languagechange"), "Dynamic UI must respond to language changes");
  check(italianHtml.includes("Generated from index.html and assets/i18n.js"), "Italian page must identify its deterministic source");
  check(italianHtml.includes('aria-label="Passa all’inglese">EN</button>'), "Prerendered Italian page must expose a correct English switch");
  check(JSON.stringify(collectIds(italianHtml)) === JSON.stringify(collectIds(html)), "English and Italian pages must expose the same ID contract");
  for (const untranslated of [
    "I turn complex work into",
    "System patterns from real work.",
    "Build a workflow blueprint.",
    "Choose the least complex intervention that meets the need.",
    "Skills demonstrated"
  ]) {
    check(!italianHtml.includes(untranslated), "Prerendered Italian page still contains English interface copy: " + untranslated);
  }

  if (italianCatalog) {
    const keyLiterals = [...catalogLiteral.matchAll(/^\s*('(?:\\.|[^'\\])*')\s*:/gm)];
    const catalogKeys = keyLiterals.map((match) => evaluateLiteral(match[1], "Italian catalog key"));
    check(new Set(catalogKeys).size === catalogKeys.length, "Italian catalog must not contain duplicate source keys");

    const dynamicStrings = [];
    const caseLiteral = extractAssignedLiteral(app, "const caseData =", "{", "}");
    check(Boolean(caseLiteral), "Could not locate case-study data");
    const caseContent = caseLiteral ? evaluateLiteral(caseLiteral, "case-study data") : null;
    if (caseContent) collectStrings(caseContent, dynamicStrings);

    const blueprintLiteral = extractAssignedLiteral(app, "const scenarioBlueprints =", "{", "}");
    check(Boolean(blueprintLiteral), "Could not locate workflow blueprint data");
    const blueprintContent = blueprintLiteral ? evaluateLiteral(blueprintLiteral, "workflow blueprint data") : null;
    if (blueprintContent) {
      for (const plan of Object.values(blueprintContent)) {
        dynamicStrings.push(plan.before, plan.logic, ...(plan.gates || []));
        for (const step of plan.steps || []) dynamicStrings.push(step[0], step[1]);
      }
    }

    const commandsLiteral = extractAssignedLiteral(app, "const commands =", "[", "]");
    check(Boolean(commandsLiteral), "Could not locate command definitions");
    if (commandsLiteral) {
      const propertyPattern = /\b(?:title|detail|keywords)\s*:\s*('(?:\\.|[^'\\])*')/g;
      for (const match of commandsLiteral.matchAll(propertyPattern)) {
        const value = evaluateLiteral(match[1], "command copy");
        if (typeof value === "string") dynamicStrings.push(value);
      }
    }

    for (const sourceCode of [app, errorHtml]) {
      const directTranslationPattern = /\b(?:tr|translate|showToast)\(\s*('(?:\\.|[^'\\])*')/g;
      for (const match of sourceCode.matchAll(directTranslationPattern)) {
        const value = evaluateLiteral(match[1], "direct translated copy");
        if (typeof value === "string") dynamicStrings.push(value);
      }
    }

    const profileMatch = app.match(/\bconst\s+profileSummary\s*=\s*('(?:\\.|[^'\\])*')/);
    check(Boolean(profileMatch), "Could not locate the short profile summary");
    if (profileMatch) dynamicStrings.push(evaluateLiteral(profileMatch[1], "short profile summary"));

    for (const source of [...new Set(dynamicStrings)]) {
      check(
        Object.prototype.hasOwnProperty.call(italianCatalog, source),
        "Italian catalog is missing dynamic copy: " + source
      );
    }

    for (const [source, translated] of Object.entries(italianCatalog)) {
      const sourceTokens = [...source.matchAll(/\{([a-z]+)\}/gi)].map((match) => match[1]).sort();
      const translatedTokens = [...String(translated).matchAll(/\{([a-z]+)\}/gi)].map((match) => match[1]).sort();
      check(
        JSON.stringify(sourceTokens) === JSON.stringify(translatedTokens),
        "Italian translation must preserve placeholders for: " + source
      );
    }
  }

  const ladderLevels = [...html.matchAll(/<section class="solution-ladder[\s\S]*?<\/section>/g)]
    .flatMap((match) => [...match[0].matchAll(/<li>/g)]);
  check(html.includes('id="solution-ladder-title"'), "Solution Ladder must be present and labelled");
  check(ladderLevels.length === 6, "Solution Ladder must contain exactly six intervention levels");
  for (const label of ["Simplify", "Structure", "Automate", "Assist", "Orchestrate", "Productise"]) {
    check(html.includes("<strong>" + label + "</strong>"), "Solution Ladder is missing level: " + label);
    check(i18n.includes("'" + label + "':"), "Italian catalog is missing Solution Ladder level: " + label);
  }

  check(html.includes('id="caseCounter"') && html.includes('id="caseCounterStatus"'), "Mobile system carousel must expose visual and live counters");
  check(app.includes("nearestCarouselCase") && app.includes("interfaceCopy.casePosition"), "Mobile system counter logic is missing");
  check(app.includes("if (!compactViewport.matches) return;\n      const card"), "System counter announcements must remain mobile-only");
  check(styles.includes(".case-carousel-meta") && styles.includes(".case-counter"), "Mobile system counter styling is missing");
  for (const animation of ["orbit-turn", "trace-packet", "source-chip-in", "reveal-in"]) {
    check(styles.includes("@keyframes " + animation), "Restored interface animation is missing: " + animation);
  }
  check(styles.includes("@media (prefers-reduced-motion: reduce)"), "Animations must retain a reduced-motion fallback");

  check(html.includes('role="combobox"') && html.includes('aria-autocomplete="list"'), "Evidence search must use combobox semantics");
  check(html.includes('id="commandStatus"') && html.includes('id="commandEmpty"'), "Evidence search must expose result status and empty state");
  check(app.includes("aria-activedescendant") && app.includes("commandResultCount"), "Evidence search keyboard and announcement logic is incomplete");
  check(app.includes("Skills demonstrated") && !app.includes("My contribution"), "Case summaries must use the generic Skills demonstrated label");

  check(/^const CACHE_NAME = 'mn-portfolio-v5';/m.test(serviceWorker), "Service worker cache must use v5");
  for (const asset of ["/it/index.html", "/assets/i18n.js?v=5", "/site-it.webmanifest?v=5"]) {
    check(serviceWorker.includes("'" + asset + "'"), "Service worker must precache " + asset);
  }
  check(serviceWorker.includes("url.pathname.startsWith('/it/')") && serviceWorker.includes("'/it/index.html'"), "Offline navigation must use the Italian fallback for /it/ paths");
  check(serviceWorker.includes("event.waitUntil(refresh.catch"), "Background cache refresh must extend the service-worker event lifetime");
  check(!/[?]v=4\b|mn-portfolio-v4\b/.test([html, errorHtml, serviceWorker].join("\n")), "Public entry points must not retain v4 cache references");
});

await runSection("Repository configuration", async () => {
  const packageJson = JSON.parse(await readText("package.json"));
  check(packageJson.private === true, "package.json must remain private");
  check(packageJson.type === "module", "package.json must use ES modules");
  check(packageJson.scripts && packageJson.scripts["generate:it"] === "node scripts/generate-localized-page.mjs", "package.json Italian generation script is incorrect");
  check(packageJson.scripts && packageJson.scripts.validate === "npm run check:it && node scripts/validate.mjs", "package.json validate script must include the Italian anti-drift check");
  check(!packageJson.dependencies || Object.keys(packageJson.dependencies).length === 0, "Runtime dependencies are not allowed");
  check(!packageJson.devDependencies || Object.keys(packageJson.devDependencies).length === 0, "Development dependencies are not required");
  check(packageJson.homepage === SITE_URL, "package.json homepage must equal the canonical site URL");

  const readme = await readText("README.md");
  check(readme.includes(SITE_URL), "README.md must link to the live site");
  check(readme.includes("npm run validate"), "README.md must document the validator");

  const license = await readText("LICENSE");
  check(license.startsWith("MIT License"), "LICENSE must be the MIT License");
  check(license.includes("Mattia Necchio"), "LICENSE must name Mattia Necchio");

  const security = await readText("SECURITY.md");
  check(security.includes("/security/advisories/new"), "SECURITY.md must point to private vulnerability reporting");

  const quality = await readText(".github/workflows/quality.yml");
  check(quality.includes("actions/checkout@v6"), "quality.yml must use actions/checkout@v6");
  check(quality.includes("actions/setup-node@v6"), "quality.yml must use actions/setup-node@v6");
  check(quality.includes("npm run validate"), "quality.yml must run the validator");
  check(/\bpull_request\s*:/m.test(quality), "quality.yml must run for pull requests");

  const pages = await readText(".github/workflows/pages.yml");
  check(pages.includes("actions/configure-pages@v5"), "pages.yml must configure GitHub Pages");
  check(pages.includes("actions/upload-artifact@v4"), "pages.yml must upload the prepared Pages artifact");
  check(pages.includes("actions/deploy-pages@v4"), "pages.yml must deploy through GitHub Pages");
  check(pages.includes("sw.js"), "pages.yml must stage the service worker");
  check(pages.includes("site-it.webmanifest"), "pages.yml must stage the Italian manifest");
  check(pages.includes("cp it/index.html _site/it/index.html"), "pages.yml must stage the prerendered Italian page");
  check(pages.includes("artifact.tar") && pages.includes("name: github-pages"), "pages.yml must create the Pages artifact format");
  check(pages.includes("cp .nojekyll") && pages.includes("cp .well-known/security.txt"), "pages.yml must stage .nojekyll and .well-known/security.txt");
  check(/--directory\s+_site/.test(pages) && !pages.includes('--exclude=".[^/]*"'), "pages.yml must archive hidden standards files from _site");
  check(pages.includes("npm run validate"), "pages.yml must validate before deployment");
  check(/\bpages:\s*write\b/.test(pages), "pages.yml must grant pages: write");
  check(/\bid-token:\s*write\b/.test(pages), "pages.yml must grant id-token: write");
});

const uniqueErrors = [...new Set(errors)];
const uniqueWarnings = [...new Set(warnings)];

console.log("Portfolio quality gate");
console.log("======================");
for (const result of sectionResults) {
  console.log((result.passed ? "✓" : "✗") + " " + result.name + " (" + result.checks + " checks)");
}

if (uniqueWarnings.length) {
  console.log("\nWarnings:");
  for (const message of uniqueWarnings) console.log("! " + message);
}

if (uniqueErrors.length) {
  console.error("\nValidation failed with " + uniqueErrors.length + " error(s):");
  for (const message of uniqueErrors) console.error("- " + message);
  process.exitCode = 1;
} else {
  console.log("\nAll " + checkCount + " deterministic checks passed.");
}
