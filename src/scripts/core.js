"use strict";

// ── Constants ──────────────────────────────────────────────────────
// ── Column map (0-indexed) ─────────────────────────────────────────

const COLUMN_MAP = {
  0: "lastname", // special: variations in brackets
  1: "firstname", // special: variations in brackets
  2: "patronymic", // can be a patronymic or a toponymic
  3: "gender", // M for male, F for Female, when missing M is assumed (sorry)
  4: "city", // the primary city of residene as assumed for the research.
  5: "profession",
  6: "origin",
  7: "firstseen",
  8: "lastseen",
  9: "lasting", // is lastseen - firstseen. A relic from excel days, no longer used
  10: "mocosince", // member of the Congregazione Olandese-Alemanna a.k.a. the nazione.
  11: "religion",
  12: "yob", // year of birth
  13: "bornin",
  14: "yod", // year of death
  15: "diedin",
  16: "zotero", // special: array of objects representing Zotero references
  17: "archief", // special: array of objects representing documents in the archives
  18: "notes", // anything goes.
};

// ── State ──────────────────────────────────────────────────────────

let allRecords = [];
let filteredRecords = []; // Current filtered/displayed records for export
let editingUUID = null;
let showDeleted = false;
let sortCol = "lastname";
let sortAsc = true;
let searchScopes = ["all"]; // Multiple scopes for search
let regexMode = false;
let advancedMode = false;
let exactMode = false; // Require a full (case-insensitive) match instead of "contains"
let graphLayoutMode = "force"; // "force" or "tree"
let networkGraphNodesSelection = null; // To store D3 node selection
let networkGraphLinkSelection = null;  // To store D3 link selection
let searchHistory = [];
const MAX_SEARCH_HISTORY = 20;
let activeRelationshipTypes = new Set(); // Tracks which relationship types are active in network view
let serverDataDir = "";

// Timespan slider state. from/to are the user's current selection (inclusive
// years); datasetMin/Max are the full extent found in the loaded records.
// from/to stay null until first computed in refreshRecords(), and afterwards
// persist across searches/refreshes until the user changes them — a search
// shouldn't silently reset an active timespan narrowing.
let timespanFrom = null;
let timespanTo = null;
let timespanDatasetMin = null;
let timespanDatasetMax = null;
let timespanWindowMode = false; // "Fixed window" mode: from/to move together
let timespanPlayInterval = null; // set while auto-advancing through time

// ── Entity Types ───────────────────────────────────────────────────

const ENTITY_TYPES = {
  person: "Person",
  association: "Association",
  institution: "Institution",
  company: "Company",
};

// ── Relationship Network Configuration ────────────────────────────

const RELATIONSHIP_COLORS = {
  married: "#4A6FA5",
  child: "#6AB7FF", // stored one-way on the offspring's record, pointing at the parent
  brother: "#5AA7D9",
  sister: "#D95AA7",
  sibling: "#5AA7D9", // Combined brother/sister for graph view
  associate: "#8E44AD",
  business: "#27AE60",
  friend: "#F39C12",
  neighbour: "#E67E22",
  member: "#16A085",
  employed: "#D35400",
  other: "#95A5A6",
};

const RELATIONSHIP_GROUPS = {
  family: ["married", "child", "brother", "sister"],
  organizational: ["member", "employed"],
  other: ["associate", "business", "friend", "neighbour", "other"],
};

// ── Settings ───────────────────────────────────────────────────────

const SERVER_URL_KEY = "server_url";
const LEGACY_SERVER_URL_KEY = "cb_server_url"; // relic from the Codeberg-sync era
const DEFAULT_SERVER_URL = "http://localhost:8081";

// One-time migration: copy the old key to the new one, then drop it.
function migrateServerUrlKey() {
  const legacy = localStorage.getItem(LEGACY_SERVER_URL_KEY);
  if (legacy !== null && localStorage.getItem(SERVER_URL_KEY) === null) {
    localStorage.setItem(SERVER_URL_KEY, legacy);
  }
  if (legacy !== null) localStorage.removeItem(LEGACY_SERVER_URL_KEY);
}

function loadSettings() {
  migrateServerUrlKey();
  return {
    serverUrl: localStorage.getItem(SERVER_URL_KEY) || DEFAULT_SERVER_URL,
  };
}

function saveSettings(s) {
  localStorage.setItem(SERVER_URL_KEY, s.serverUrl || DEFAULT_SERVER_URL);
}

// ── Search History ─────────────────────────────────────────────────

function loadSearchHistory() {
  const stored = localStorage.getItem("searchHistory");
  if (stored) {
    try {
      searchHistory = JSON.parse(stored);
    } catch {
      searchHistory = [];
    }
  }
}

function saveSearchHistory() {
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function addToSearchHistory(query, scopes) {
  if (!query.trim()) return;

  // Remove duplicate if exists
  searchHistory = searchHistory.filter(
    (item) => !(item.query === query && JSON.stringify(item.scopes) === JSON.stringify(scopes)),
  );

  // Add to front
  searchHistory.unshift({
    query,
    scopes: [...scopes],
    timestamp: new Date().toISOString(),
  });

  // Limit size
  if (searchHistory.length > MAX_SEARCH_HISTORY) {
    searchHistory = searchHistory.slice(0, MAX_SEARCH_HISTORY);
  }

  saveSearchHistory();
}

function showSearchHistory() {
  const dropdown = document.getElementById("search-history-dropdown");
  const searchInput = document.getElementById("search-input");

  if (searchHistory.length === 0) {
    dropdown.innerHTML =
      '<div style="padding:12px;color:var(--mid-grey);font-size:12px;">No search history</div>';
  } else {
    dropdown.innerHTML = "";
    searchHistory.forEach((item) => {
      const div = document.createElement("div");
      div.className = "lookup-item";
      div.innerHTML = `
        <div style="font-weight:500;">${escapeHtml(item.query)}</div>
        <div style="font-size:10px;color:var(--mid-grey);">
          ${escapeHtml(item.scopes.join(", "))} • ${new Date(item.timestamp).toLocaleDateString()}
        </div>
      `;
      div.addEventListener("click", () => {
        searchInput.value = item.query;
        searchScopes = [...item.scopes];
        updateScopeDisplay();
        dropdown.classList.add("hidden");
        refreshRecords(item.query);
      });
      dropdown.appendChild(div);
    });
  }

  // Position dropdown
  const rect = searchInput.getBoundingClientRect();
  dropdown.style.position = "absolute";
  dropdown.style.top = `${rect.bottom}px`;
  dropdown.style.left = `${rect.left}px`;
  dropdown.style.width = `${rect.width}px`;
  dropdown.classList.remove("hidden");
}

// ── Utilities ──────────────────────────────────────────────────────

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

function now() {
  return new Date().toISOString();
}

// Escape a string for safe interpolation into innerHTML. Record fields are
// free text (and can be bulk-imported from Excel), so any value rendered as
// HTML must pass through this to prevent stored XSS.
function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function notify(msg, type = "info", duration = 3500) {
  const el = document.getElementById("notification");
  el.textContent = msg;
  el.className = `notif-${type}`;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, duration);
}

function showDialog(title, message, buttons) {
  return new Promise((resolve) => {
    document.getElementById("dialog-title").textContent = title;
    document.getElementById("dialog-message").textContent = message;
    const btnsEl = document.getElementById("dialog-buttons");
    btnsEl.innerHTML = "";
    buttons.forEach((b) => {
      const btn = document.createElement("button");
      btn.textContent = b.label;
      btn.className = b.cls || "btn-secondary";
      btn.onclick = () => {
        document.getElementById("dialog-overlay").classList.add("hidden");
        resolve(b.value);
      };
      btnsEl.appendChild(btn);
    });
    document.getElementById("dialog-overlay").classList.remove("hidden");
  });
}

function showProgress(title, message) {
  document.getElementById("progress-title").textContent = title;
  document.getElementById("progress-message").textContent = message;
  document.getElementById("progress-details").textContent = "";
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("progress-overlay").classList.remove("hidden");
}

function updateProgress(current, total, details = "") {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("progress-message").textContent = `Processing ${current} of ${total}`;
  document.getElementById("progress-details").textContent = details;
}

function hideProgress() {
  document.getElementById("progress-overlay").classList.add("hidden");
}

// ── Soundex ────────────────────────────────────────────────────────

function soundex(str) {
  if (!str) return "";
  str = str.toUpperCase().replace(/[^A-Z]/g, "");
  if (!str) return "";
  const map = {
    B: 1,
    F: 1,
    P: 1,
    V: 1,
    C: 2,
    G: 2,
    J: 2,
    K: 2,
    Q: 2,
    S: 2,
    X: 2,
    Z: 2,
    D: 3,
    T: 3,
    L: 4,
    M: 5,
    N: 5,
    R: 6,
  };
  let code = str[0];
  let prev = map[str[0]] || 0;
  for (let i = 1; i < str.length && code.length < 4; i++) {
    const cur = map[str[i]];
    if (cur && cur !== prev) {
      code += cur;
    }
    prev = cur || 0;
  }
  return code.padEnd(4, "0");
}

function fuzzyMatch(query, target) {
  if (!query || !target) return false;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  // Soundex match
  if (soundex(query) === soundex(target)) return true;
  // Levenshtein distance ≤ 2 for strings of length ≥ 4
  if (q.length >= 3 && levenshtein(q, t) <= 2) return true;
  return false;
}

// Fuzzy search on name fields only (lastname, firstname, patronymic + variations)
// Used as default basic search when no search modes are active
function fuzzyNameSearch(record, query) {
  if (!query || query.length < 2) return false;

  const names = [
    record.lastname,
    record.firstname,
    record.patronymic,
    ...(record.lastnameVariations || []),
    ...(record.firstnameVariations || []),
  ];

  const ql = query.toLowerCase();

  for (const name of names) {
    if (!name) continue;
    const nl = name.toLowerCase();

    // Exact match
    if (nl === ql) return true;
    // Prefix match
    if (nl.startsWith(ql)) return true;
    // Contains match
    if (nl.includes(ql)) return true;
    // Soundex match
    if (soundex(name) === soundex(query)) return true;
    // Levenshtein distance ≤ 2 for queries of length ≥ 3
    if (ql.length >= 3 && levenshtein(ql, nl) <= 2) return true;
  }

  return false;
}

function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}


