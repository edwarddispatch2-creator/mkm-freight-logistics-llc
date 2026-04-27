/**
 * build-standalone.mjs
 * Post-processes the Vite build output and produces a single self-contained HTML file.
 *
 * Steps:
 *  1. Read dist/index.html
 *  2. Inline all <link rel="stylesheet"> tags (embed CSS content into <style>)
 *  3. In CSS, replace all url() references to fonts/images with base64 data URIs
 *  4. Inline all <script src="..."> tags (embed JS content)
 *  5. In JS bundles, replace all asset path strings with base64 data URIs
 *  6. Patch JS bundle for hash-based routing (BrowserRouter → HashRouter equivalent)
 *  7. Convert HTML <img src="..."> and inline style background-image to base64 data URIs
 *  8. Inline favicon as base64
 *  9. Write dist-standalone/index.html and public/index.html
 *
 * Run: node scripts/build-standalone.mjs  (from src/frontend/ directory)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const PUBLIC = path.join(ROOT, "public");
const OUT_DIR = path.join(ROOT, "dist-standalone");

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch {
    return null;
  }
}

function toDataUri(buffer, mimeType) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

function mimeFromExt(ext) {
  const map = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".js": "text/javascript",
    ".css": "text/css",
  };
  return map[ext.toLowerCase()] || "application/octet-stream";
}

/**
 * Resolve an asset path (href/src) relative to the dist folder.
 * Handles both /assets/foo.png and ./assets/foo.png forms.
 */
function resolveAsset(assetRef, distDir, publicDir) {
  // Strip query strings / hashes
  const clean = assetRef.split("?")[0].split("#")[0];

  if (clean.startsWith("/")) {
    // Absolute path from site root — check dist first, then public
    const inDist = path.join(distDir, clean);
    if (fs.existsSync(inDist)) return inDist;
    const inPublic = path.join(publicDir, clean);
    if (fs.existsSync(inPublic)) return inPublic;
  } else if (clean.startsWith("./") || clean.startsWith("../")) {
    const inDist = path.resolve(distDir, clean);
    if (fs.existsSync(inDist)) return inDist;
  } else if (!clean.startsWith("data:") && !clean.startsWith("http")) {
    // Relative — could be in assets subfolder
    const inDist = path.join(distDir, clean);
    if (fs.existsSync(inDist)) return inDist;
    const inDistAssets = path.join(distDir, "assets", clean);
    if (fs.existsSync(inDistAssets)) return inDistAssets;
    const inPublic = path.join(publicDir, clean);
    if (fs.existsSync(inPublic)) return inPublic;
  }
  return null;
}

/**
 * Collect all asset files from dist/assets and public/assets directories
 * Returns array of { urlPath, fsPath, ext }
 */
function collectAllAssets(distDir, publicDir) {
  const assetPaths = [];
  const seen = new Set();

  function collectFromDir(dir, urlBase) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        collectFromDir(path.join(dir, entry.name), `${urlBase}/${entry.name}`);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (
          [
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".svg",
            ".webp",
            ".woff",
            ".woff2",
            ".ttf",
            ".otf",
            ".ico",
          ].includes(ext)
        ) {
          const urlPath = `${urlBase}/${entry.name}`;
          const fsPath = path.join(dir, entry.name);
          if (!seen.has(urlPath)) {
            seen.add(urlPath);
            assetPaths.push({ urlPath, fsPath, ext });
          }
        }
      }
    }
  }

  collectFromDir(path.join(distDir, "assets"), "/assets");
  collectFromDir(path.join(publicDir, "assets"), "/assets");

  // Sort longer paths first so more specific paths replace before shorter ones
  assetPaths.sort((a, b) => b.urlPath.length - a.urlPath.length);

  return assetPaths;
}

/**
 * Scan JS/CSS content for any occurrence of known asset paths
 * and replace them with base64 data URIs.
 * Handles both quoted strings and CSS url() patterns.
 */
function inlineAssetRefsInContent(content, distDir, publicDir) {
  const allAssets = collectAllAssets(distDir, publicDir);

  let result = content;
  for (const asset of allAssets) {
    const buf = readFileSafe(asset.fsPath);
    if (!buf) continue;

    const mime = mimeFromExt(asset.ext);
    const dataUri = toDataUri(buf, mime);

    // Try multiple patterns to catch all occurrences:

    // 1. Exact URL path as string literal (with or without quotes): "/assets/foo.png"
    const escapedPath = asset.urlPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Allow for forward-slash variations in the pattern
    const slashFlexible = escapedPath.replace(/\//g, "[\\\\/]");
    const reQuoted = new RegExp(`["']${slashFlexible}["']`, "g");
    result = result.replace(reQuoted, `"${dataUri}"`);

    // 2. url() in CSS without quotes: url(/assets/foo.png)
    const reCssUrl = new RegExp(`url\\(${slashFlexible}\\)`, "g");
    result = result.replace(reCssUrl, `url("${dataUri}")`);

    // 3. Also handle the path without leading slash in JS bundle (Vite sometimes strips it)
    const noLeadingSlash = asset.urlPath.slice(1); // "assets/foo.png"
    const escapedNoSlash = noLeadingSlash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const slashFlexibleNoSlash = escapedNoSlash.replace(/\//g, "[\\\\/]");
    const reNoSlash = new RegExp(`["']${slashFlexibleNoSlash}["']`, "g");
    result = result.replace(reNoSlash, `"${dataUri}"`);

    // 4. Check if the replacement happened (either quoted form changes length)
    const countBefore = (content.match(new RegExp(slashFlexible, "g")) || []).length;
    if (countBefore > 0) {
      console.log(`  ✓ Inlined asset in bundle: ${asset.urlPath} (${Math.round(buf.length / 1024)}KB)`);
    }
  }

  return result;
}

function inlineImages(html, distDir, publicDir) {
  // Replace src="..." for img tags
  return html.replace(/<img([^>]*)\ssrc="([^"]+)"([^>]*)>/gi, (match, pre, src, post) => {
    if (src.startsWith("data:")) return match;
    if (src.startsWith("http://") || src.startsWith("https://")) return match;
    const resolved = resolveAsset(src, distDir, publicDir);
    if (!resolved) {
      console.warn(`  ⚠ Image not found: ${src}`);
      return match;
    }
    const buf = readFileSafe(resolved);
    if (!buf) return match;
    const ext = path.extname(resolved);
    const dataUri = toDataUri(buf, mimeFromExt(ext));
    console.log(`  ✓ Inlined HTML image: ${src} (${Math.round(buf.length / 1024)}KB)`);
    return `<img${pre} src="${dataUri}"${post}>`;
  });
}

function inlineStyleAttrBackgrounds(html, distDir, publicDir) {
  // Replace style="...background-image: url(/assets/...)..." inline styles
  return html.replace(/style="([^"]*url\([^)]+\)[^"]*)"/gi, (_match, styleContent) => {
    const replaced = styleContent.replace(/url\((['"]?)([^)'"]+)\1\)/g, (_m, _q, ref) => {
      if (ref.startsWith("data:")) return _m;
      if (ref.startsWith("http://") || ref.startsWith("https://")) return _m;
      const resolved = resolveAsset(ref, distDir, publicDir);
      if (!resolved) return _m;
      const buf = readFileSafe(resolved);
      if (!buf) return _m;
      const ext = path.extname(resolved);
      const dataUri = toDataUri(buf, mimeFromExt(ext));
      console.log(`  ✓ Inlined style attr background: ${ref} (${Math.round(buf.length / 1024)}KB)`);
      return `url("${dataUri}")`;
    });
    return `style="${replaced}"`;
  });
}

function inlineCssUrls(css, distDir, publicDir) {
  return css.replace(/url\((['"]?)([^)'"]+)\1\)/g, (_match, _quote, ref) => {
    if (ref.startsWith("data:")) return _match;
    if (ref.startsWith("http://") || ref.startsWith("https://")) return _match;
    const resolved = resolveAsset(ref, distDir, publicDir);
    if (!resolved) return _match;
    const buf = readFileSafe(resolved);
    if (!buf) return _match;
    const ext = path.extname(resolved);
    const dataUri = toDataUri(buf, mimeFromExt(ext));
    console.log(`  ✓ Inlined CSS asset: ${ref} (${Math.round(buf.length / 1024)}KB)`);
    return `url("${dataUri}")`;
  });
}

/**
 * Replace @import url("https://fonts.googleapis.com/...") in CSS with inline
 * @font-face declarations using locally available woff2 files.
 * This ensures fonts work offline without any CDN dependency.
 */
function replaceGoogleFontsWithLocal(css, publicDir) {
  // Map of font name fragments to local woff2 file names
  const fontMap = {
    "Playfair+Display": { name: "Playfair Display", file: "PlayfairDisplay.woff2" },
    "PlayfairDisplay": { name: "Playfair Display", file: "PlayfairDisplay.woff2" },
    "Plus+Jakarta+Sans": { name: "Plus Jakarta Sans", file: "PlusJakartaSans.woff2" },
    "PlusJakartaSans": { name: "Plus Jakarta Sans", file: "PlusJakartaSans.woff2" },
    "DM+Sans": { name: "DM Sans", file: "DMSans.woff2" },
    "DM+Serif+Display": { name: "DM Serif Display", file: "DMSerifDisplay.woff2" },
    "Figtree": { name: "Figtree", file: "Figtree.woff2" },
    "BricolageGrotesque": { name: "Bricolage Grotesque", file: "BricolageGrotesque.woff2" },
    "Fraunces": { name: "Fraunces", file: "Fraunces.woff2" },
    "Parisienne": { name: "Parisienne", file: "Parisienne.woff2" },
    "GeneralSans": { name: "General Sans", file: "GeneralSans.woff2" },
    "Satoshi": { name: "Satoshi", file: "Satoshi.woff2" },
  };

  let result = css;

  // Replace @import url("https://fonts.googleapis.com/...") lines
  result = result.replace(/@import\s+url\(["']https:\/\/fonts\.googleapis\.com[^"']*["']\);?/g, (match) => {
    console.log("  ✓ Found Google Fonts import, replacing with local @font-face...");

    // Determine which fonts are requested from this import URL
    const fontFaceDecls = [];
    for (const [key, info] of Object.entries(fontMap)) {
      if (match.includes(key)) {
        const fontPath = path.join(publicDir, "assets", "fonts", info.file);
        const buf = readFileSafe(fontPath);
        if (buf) {
          const dataUri = toDataUri(buf, "font/woff2");
          // Generate @font-face for common weights (browser will use closest available)
          fontFaceDecls.push(
            `@font-face {\n  font-family: '${info.name}';\n  font-style: normal;\n  font-weight: 100 900;\n  font-display: swap;\n  src: url('${dataUri}') format('woff2');\n}`,
          );
          console.log(`  ✓ Inlined font: ${info.name} (${Math.round(buf.length / 1024)}KB)`);
        } else {
          console.warn(`  ⚠ Local font file not found: ${fontPath}`);
        }
      }
    }

    return fontFaceDecls.join("\n") || "/* Google Fonts import removed for offline use */";
  });

  // Also remove any remaining @import url("https://fonts.googleapis...") that slipped through
  result = result.replace(/@import\s+url\(["']https:\/\/fonts\.[^"']*["']\);?/g, () => {
    console.log("  ✓ Removed remaining external font import");
    return "/* external font import removed for offline use */";
  });

  return result;
}

function inlineStylesheets(html, distDir, publicDir) {
  // Handle <link rel="stylesheet" href="..."> in any attribute order
  return html.replace(/<link([^>]*)>/gi, (match, attrs) => {
    if (!/rel=["']stylesheet["']/i.test(attrs)) return match;
    const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return match;
    const href = hrefMatch[1];
    if (href.startsWith("http://") || href.startsWith("https://")) return match;
    const resolved = resolveAsset(href, distDir, publicDir);
    if (!resolved) {
      console.warn(`  ⚠ Stylesheet not found: ${href}`);
      return match;
    }
    let css = fs.readFileSync(resolved, "utf-8");
    css = replaceGoogleFontsWithLocal(css, publicDir);
    css = inlineCssUrls(css, distDir, publicDir);
    console.log(`  ✓ Inlined stylesheet: ${href}`);
    return `<style>${css}</style>`;
  });
}

function inlineScripts(html, distDir, publicDir) {
  return html.replace(/<script([^>]*)\ssrc="([^"]+)"([^>]*)><\/script>/gi, (match, pre, src, post) => {
    if (src.startsWith("http://") || src.startsWith("https://")) return match;
    const resolved = resolveAsset(src, distDir, publicDir);
    if (!resolved) {
      console.warn(`  ⚠ Script not found: ${src}`);
      return match;
    }
    let js = fs.readFileSync(resolved, "utf-8");
    // Inline all asset refs inside the JS bundle
    console.log(`  ✓ Inlining asset refs in JS bundle: ${src}`);
    js = inlineAssetRefsInContent(js, distDir, publicDir);
    // Patch for hash-based routing in standalone mode
    js = patchForHashRouting(js);
    // Strip type="module" since it's now inline
    const attrs = (pre + post)
      .replace(/\s*type="module"/gi, "")
      .replace(/\s*crossorigin\b[^=]*/gi, "");
    console.log(`  ✓ Inlined script: ${src} (${Math.round(js.length / 1024)}KB)`);
    return `<script${attrs}>${js}</script>`;
  });
}

/**
 * Patch the JS bundle to use hash-based routing.
 * React Router v6 with createBrowserRouter uses the History API (pushState),
 * which doesn't work for file:// opened HTML files.
 * We patch this by replacing createBrowserRouter with createHashRouter.
 */
function patchForHashRouting(js) {
  let patched = js;
  let changes = 0;

  // Pattern 1: createBrowserRouter (React Router v6 standard)
  if (patched.includes("createBrowserRouter")) {
    patched = patched.replaceAll("createBrowserRouter", "createHashRouter");
    changes++;
    console.log("  ✓ Patched: createBrowserRouter → createHashRouter");
  }

  // Pattern 2: BrowserRouter component (React Router v6 component style)
  if (patched.includes("BrowserRouter")) {
    patched = patched.replaceAll("BrowserRouter", "HashRouter");
    changes++;
    console.log("  ✓ Patched: BrowserRouter → HashRouter");
  }

  // Pattern 3: history type "browser" in router options
  if (patched.includes('"browser"') && patched.includes("createRouter")) {
    patched = patched.replace(/"browser"/g, '"hash"');
    changes++;
    console.log('  ✓ Patched: router history type "browser" → "hash"');
  }

  // Pattern 4: window.history.pushState calls (fallback patch)
  // We add a navigation override script rather than patching bundle calls
  // This is handled via injected script below

  if (changes === 0) {
    console.log("  ℹ No routing patches needed (hash routing may already be in use)");
  }

  return patched;
}

function inlineFavicon(html, distDir, publicDir) {
  return html.replace(/<link([^>]*)\srel="icon"([^>]*)\shref="([^"]+)"([^>]*)>/gi, (match, pre1, pre2, href, post) => {
    if (href.startsWith("data:")) return match;
    const resolved = resolveAsset(href, distDir, publicDir);
    if (!resolved) return match;
    const buf = readFileSafe(resolved);
    if (!buf) return match;
    const ext = path.extname(resolved);
    const dataUri = toDataUri(buf, mimeFromExt(ext));
    console.log(`  ✓ Inlined favicon: ${href}`);
    return `<link${pre1} rel="icon"${pre2} href="${dataUri}"${post}>`;
  });
}

/**
 * Inject a hash-routing compatibility script before </head>.
 * Handles navigation for file:// opened HTML without a server.
 */
function injectHashRoutingScript(html) {
  const script = `
<script>
  // Standalone offline compatibility: ensure hash-based navigation
  // If the app somehow uses pushState, redirect to hash equivalent
  (function() {
    var _pushState = history.pushState.bind(history);
    history.pushState = function(state, title, url) {
      if (url && !url.startsWith('#') && !url.startsWith('http') && url !== '/') {
        window.location.hash = url;
        return;
      }
      _pushState(state, title, url);
    };
    // On load, if there's a path but no hash, convert to hash
    if (window.location.pathname !== '/' && !window.location.hash) {
      window.location.hash = window.location.pathname;
    }
  })();
</script>`;
  return html.replace("</head>", `${script}\n</head>`);
}

/**
 * Verify the output has no unresolved /assets/ paths remaining.
 */
function verifyNoUnresolvedAssets(html) {
  const matches = html.match(/["'(]\/assets\/[^"')]+["')]/g) || [];
  // Filter out data: URIs that happened to match (shouldn't happen, but be safe)
  const unresolved = matches.filter(m => !m.includes("data:"));
  if (unresolved.length > 0) {
    console.warn(`\n  ⚠ WARNING: ${unresolved.length} unresolved /assets/ paths remain:`);
    for (const m of unresolved.slice(0, 10)) console.warn(`    ${m}`);
    if (unresolved.length > 10) {
      console.warn(`    ... and ${unresolved.length - 10} more`);
    }
  } else {
    console.log("  ✓ No unresolved /assets/ paths — all assets are inlined");
  }
}

async function main() {
  const indexPath = path.join(DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("❌  dist/index.html not found. Run pnpm build first.");
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    console.log("📁  Created output directory: dist-standalone/");
  }

  console.log("\n🔧  Building standalone HTML (index.html)...\n");

  let html = fs.readFileSync(indexPath, "utf-8");

  console.log("📦  Inlining stylesheets...");
  html = inlineStylesheets(html, DIST, PUBLIC);

  console.log("\n📜  Inlining scripts (with asset embedding)...");
  html = inlineScripts(html, DIST, PUBLIC);

  console.log("\n🖼   Inlining HTML images...");
  html = inlineImages(html, DIST, PUBLIC);

  console.log("\n🎨  Inlining inline style backgrounds...");
  html = inlineStyleAttrBackgrounds(html, DIST, PUBLIC);

  console.log("\n🔗  Inlining favicon...");
  html = inlineFavicon(html, DIST, PUBLIC);

  console.log("\n⚡  Injecting hash-routing compatibility...");
  html = injectHashRoutingScript(html);

  // Update title tag
  html = html.replace(
    /<title>[^<]*<\/title>/,
    "<title>MKM Freight Logistics LLC \u2014 DOT Compliance &amp; Safety Support</title>",
  );

  console.log("\n🔍  Verifying no unresolved asset paths...");
  verifyNoUnresolvedAssets(html);

  // Write to dist-standalone/index.html
  const outPath = path.join(OUT_DIR, "index.html");
  fs.writeFileSync(outPath, html, "utf-8");

  // Also copy to public/index.html so it is served as the root file on next deploy
  const publicOutPath = path.join(PUBLIC, "index.html");
  fs.copyFileSync(outPath, publicOutPath);

  const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
  const sizeMB = Math.round((sizeKB / 1024) * 10) / 10;
  console.log("\n✅  Standalone file written to:");
  console.log(`    ${outPath}`);
  console.log(`    ${publicOutPath} (also copied to public/index.html for next deploy)`);
  console.log(`    Size: ${sizeKB} KB (${sizeMB} MB)`);
  console.log("\n💡  To use offline: open index.html in any modern browser.");
  console.log("    To deploy on Netlify: drag & drop the single index.html file.\n");
}

main().catch((err) => {
  console.error("❌  Build failed:", err);
  process.exit(1);
});
