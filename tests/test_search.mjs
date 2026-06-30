// Pin the client-side fuzzy-search helpers (soundex, levenshtein) against the
// same cases.json table the Python tests use, so the duplicated JS and Python
// implementations cannot silently drift apart.
//
// The app is split into plain browser scripts (not modules) that share one
// global scope and call boot() on load while touching the DOM. We concatenate
// them in load order (as the browser would share their global scope) and
// evaluate inside a vm sandbox with permissive stubs for the browser globals,
// then reach in for the two pure functions.
//
// Run: node tests/test_search.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";
import assert from "node:assert/strict";

const here = path.dirname(fileURLToPath(import.meta.url));
const scriptsDir = path.join(here, "..", "src", "scripts");
// Same order as the <script> tags in index.html; boot.js last.
const SCRIPT_ORDER = ["core.js", "data.js", "records.js", "modal.js", "visualize.js", "boot.js"];
const appSrc = SCRIPT_ORDER.map((f) => readFileSync(path.join(scriptsDir, f), "utf8")).join("\n");
const cases = JSON.parse(readFileSync(path.join(here, "cases.json"), "utf8"));

// A Proxy that absorbs any property access, assignment, call, or iteration —
// enough to let boot() run to completion without a real DOM.
function makeStub() {
  const target = function () { return stub; };
  const stub = new Proxy(target, {
    get(_t, prop) {
      if (prop === Symbol.toPrimitive) return () => "";
      if (prop === Symbol.iterator) return function* () {};
      if (prop === "then") return undefined; // never look thenable
      return stub;
    },
    set: () => true,
    apply: () => stub,
  });
  return stub;
}
const stub = makeStub();

const sandbox = {
  document: stub,
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  crypto: { getRandomValues: (a) => a },
  navigator: {},
  console,
  URLSearchParams,
  setTimeout: () => 0,
  clearTimeout: () => {},
  location: { search: "", protocol: "http:", hostname: "localhost" },
  fetch: () =>
    Promise.resolve({
      ok: false,
      status: 0,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(""),
    }),
};
sandbox.window = sandbox;
sandbox.self = sandbox;

vm.createContext(sandbox);
// Swallow the async rejection from boot() running without a real server/DOM.
process.on("unhandledRejection", () => {});
vm.runInContext(appSrc, sandbox, { filename: "app.js" });

let failures = 0;
for (const [value, expected] of cases.soundex) {
  try {
    assert.equal(sandbox.soundex(value), expected, `soundex(${JSON.stringify(value)})`);
  } catch (e) {
    failures++;
    console.error("FAIL:", e.message);
  }
}
for (const [a, b, expected] of cases.levenshtein) {
  try {
    assert.equal(sandbox.levenshtein(a, b), expected, `levenshtein(${JSON.stringify(a)}, ${JSON.stringify(b)})`);
  } catch (e) {
    failures++;
    console.error("FAIL:", e.message);
  }
}

const total = cases.soundex.length + cases.levenshtein.length;
if (failures) {
  console.error(`\n${failures}/${total} JS search-helper checks failed.`);
  process.exit(1);
}
console.log(`All ${total} JS search-helper checks passed.`);
