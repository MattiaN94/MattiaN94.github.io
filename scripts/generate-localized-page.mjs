#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SOURCE_PATH = path.join(ROOT, "index.html");
const CATALOG_PATH = path.join(ROOT, "assets", "i18n.js");
const OUTPUT_PATH = path.join(ROOT, "it", "index.html");
const CHECK_MODE = process.argv.includes("--check");

function extractObjectLiteral(source, assignmentPrefix) {
  const assignment = source.indexOf(assignmentPrefix);
  if (assignment < 0) throw new Error("Italian catalog assignment was not found");
  const start = source.indexOf("{", assignment + assignmentPrefix.length);
  if (start < 0) throw new Error("Italian catalog opening brace was not found");

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
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error("Italian catalog closing brace was not found");
}

function decodeHtml(value) {
  return String(value)
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&times;/gi, "×");
}

function encodeText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function encodeAttribute(value) {
  return encodeText(value).replace(/"/g, "&quot;");
}

function translateTextSegment(segment, catalog) {
  const leading = segment.match(/^\s*/)?.[0] || "";
  const trailing = segment.match(/\s*$/)?.[0] || "";
  const core = segment.slice(leading.length, segment.length - trailing.length || undefined);
  if (!core) return segment;
  const decoded = decodeHtml(core);
  if (!Object.prototype.hasOwnProperty.call(catalog, decoded)) return segment;
  return leading + encodeText(catalog[decoded]) + trailing;
}

function translateAttributes(tag, catalog) {
  return tag.replace(/\b(aria-label|placeholder|title|alt)="([^"]*)"/gi, (match, name, rawValue) => {
    const decoded = decodeHtml(rawValue);
    if (!Object.prototype.hasOwnProperty.call(catalog, decoded)) return match;
    return `${name}="${encodeAttribute(catalog[decoded])}"`;
  });
}

function setMeta(html, key, value, content) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(`<meta(?=[^>]*\\b${key}="${escapedValue}")[^>]*>`, "i");
  return html.replace(expression, (tag) => {
    const encoded = encodeAttribute(content);
    return /\bcontent="[^"]*"/i.test(tag)
      ? tag.replace(/\bcontent="[^"]*"/i, `content="${encoded}"`)
      : tag.replace(/\s*\/?>(\s*)$/, ` content="${encoded}">$1`);
  });
}

function localizeStructuredData(html) {
  return html.replace(/<script\b([^>]*)type="application\/ld\+json"([^>]*)>([\s\S]*?)<\/script>/gi, (match, before, after, json) => {
    try {
      const data = JSON.parse(json);
      if (data["@type"] === "WebSite") {
        data.description = "Portfolio su prodotti AI, semplificazione dei workflow e sistemi di conoscenza.";
        data.inLanguage = ["en", "it"];
      }
      if (data["@type"] === "ProfilePage") {
        data["@id"] = "https://mattian94.github.io/it/#profile";
        data.url = "https://mattian94.github.io/it/";
        data.name = "Mattia Necchio — AI Product & Workflow Designer";
      }
      if (data["@type"] === "Person") {
        data.jobTitle = "AI Product & Workflow Designer";
        if (data.homeLocation) data.homeLocation.name = "Padova, Italia";
        if (data.alumniOf) data.alumniOf.name = "Università di Padova";
      }
      return `<script${before}type="application/ld+json"${after}>\n${JSON.stringify(data, null, 2)}\n  </script>`;
    } catch {
      return match;
    }
  });
}

async function renderItalianPage() {
  const [sourceHtml, catalogSource] = await Promise.all([
    readFile(SOURCE_PATH, "utf8"),
    readFile(CATALOG_PATH, "utf8")
  ]);
  const catalogLiteral = extractObjectLiteral(catalogSource, "const IT = Object.freeze(");
  const catalog = vm.runInNewContext(`(${catalogLiteral})`, Object.create(null), { timeout: 1000 });

  let html = sourceHtml
    .replace(/<html\b([^>]*)\blang="en"/i, '<html$1lang="it"')
    .replace(/(<link\b[^>]*\brel="canonical"[^>]*\bhref=")[^"]*(")/i, '$1https://mattian94.github.io/it/$2')
    .replace(/(<link\b[^>]*\bhreflang="it"[^>]*\bhref=")[^"]*(")/i, '$1https://mattian94.github.io/it/$2')
    .replace(/\b(href|src)="assets\//gi, '$1="/assets/')
    .replace(/href="site\.webmanifest\?v=6"/i, 'href="/site-it.webmanifest?v=6"')
    .replace(/href="(humans\.txt|llms\.txt|llms-full\.txt)"/gi, 'href="/$1"');

  const protectedBlocks = [];
  html = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (block) => {
    const token = `\uE000PROTECTED_${protectedBlocks.length}\uE001`;
    protectedBlocks.push(block);
    return token;
  });

  html = html
    .split(/(<[^>]+>)/g)
    .map((part) => part.startsWith("<") ? translateAttributes(part, catalog) : translateTextSegment(part, catalog))
    .join("");

  protectedBlocks.forEach((block, index) => {
    html = html.replace(`\uE000PROTECTED_${index}\uE001`, block);
  });

  html = html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, "<title>Product designer AI e workflow | Mattia Necchio</title>");
  html = html
    .replace(/(<button\b[^>]*\bid="languageToggle"[^>]*\baria-label=")[^"]*("[^>]*>)[\s\S]*?(<\/button>)/i, '$1Passa all’inglese$2EN$3')
    .replace(/(<button\b[^>]*\bid="mobileLanguageToggle"[^>]*\baria-label=")[^"]*("[^>]*>)[\s\S]*?(<\/button>)/i, '$1Passa all’inglese$2English$3');
  html = setMeta(html, "name", "description", "Mattia Necchio progetta prodotti AI utili per workflow complessi: ricerca, valutazione, sistemi multi-interfaccia, reporting e revisione umana.");
  html = setMeta(html, "property", "og:locale", "it_IT");
  html = setMeta(html, "property", "og:locale:alternate", "en_US");
  html = setMeta(html, "property", "og:title", "Product designer AI e workflow | Mattia Necchio");
  html = setMeta(html, "property", "og:description", "Prodotti AI utili per workflow complessi, con regole chiare, controlli pratici e giudizio umano.");
  html = setMeta(html, "property", "og:url", "https://mattian94.github.io/it/");
  html = setMeta(html, "property", "og:image:alt", "Mattia Necchio, AI Product e Workflow Designer — dal lavoro complesso a sistemi utili");
  html = setMeta(html, "name", "twitter:title", "Product designer AI e workflow | Mattia Necchio");
  html = setMeta(html, "name", "twitter:description", "Prodotti AI utili per workflow complessi, dalla prima mappa al prototipo testato.");
  html = localizeStructuredData(html);
  html = html.replace(
    /^<!doctype html>/i,
    "<!doctype html>\n<!-- Generated from index.html and assets/i18n.js by scripts/generate-localized-page.mjs. -->"
  );
  return html.endsWith("\n") ? html : html + "\n";
}

const rendered = await renderItalianPage();
if (CHECK_MODE) {
  let committed = "";
  try { committed = await readFile(OUTPUT_PATH, "utf8"); } catch { /* Report the missing file below. */ }
  if (committed !== rendered) {
    console.error("it/index.html is missing or stale. Run: npm run generate:it");
    process.exitCode = 1;
  } else {
    console.log("Italian page is in sync.");
  }
} else {
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, rendered, "utf8");
  console.log("Generated it/index.html");
}
