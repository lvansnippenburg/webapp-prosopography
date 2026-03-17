/* =============================================================
   Person Records Application
   IndexedDB  ↔  Codeberg sync
   ============================================================= */

"use strict";

// ── Constants ──────────────────────────────────────────────────────

const DB_NAME = "PersonRecordsDB";
const DB_VERSION = 1;
const STORE_NAME = "persons";

// ── Column map (0-indexed) ─────────────────────────────────────────

const COLUMN_MAP = {
  0: "lastname", // special: variations in brackets
  1: "firstname", // special: variations in brackets
  2: "patronymic",
  3: "gender", // special: M unless cell contains F
  4: "city",
  5: "profession",
  6: "origin",
  7: "firstseen",
  8: "lastseen",
  9: "lasting",
  10: "mocosince",
  11: "religion",
  12: "yob", // year of birth
  13: "bornin",
  14: "yod", // year of death
  15: "diedin",
  16: "zotero", // special: array of objects
  17: "archief", // special: array of objects
  18: "notes",
};

// ── State ──────────────────────────────────────────────────────────

let db = null;
let allRecords = [];
let filteredRecords = []; // Current filtered/displayed records for export
let editingUUID = null;
let showDeleted = false;
let sortCol = "lastname";
let sortAsc = true;
let searchScopes = ["all"]; // Multiple scopes for search
let regexMode = false;
let advancedMode = false;
let searchHistory = [];
const MAX_SEARCH_HISTORY = 20;

// ── Relationship Network Configuration ────────────────────────────

const RELATIONSHIP_COLORS = {
  father: "#4A90E2",
  mother: "#E24A90",
  son: "#6AB7FF",
  daughter: "#FF6AB7",
  husband: "#2D5F8D",
  wife: "#8D2D5F",
  brother: "#5AA7D9",
  sister: "#D95AA7",
  associate: "#8E44AD",
  business: "#27AE60",
  friend: "#F39C12",
  neighbour: "#E67E22",
  other: "#95A5A6",
};

const RELATIONSHIP_GROUPS = {
  family: ["father", "mother", "son", "daughter", "husband", "wife", "brother", "sister"],
  other: ["associate", "business", "friend", "neighbour", "other"],
};

// ── Settings ───────────────────────────────────────────────────────

function loadSettings() {
  return {
    token: localStorage.getItem("cb_token") || "",
    owner: localStorage.getItem("cb_owner") || "",
    repo: localStorage.getItem("cb_repo") || "",
    branch: localStorage.getItem("cb_branch") || "main",
    lastSyncPush: localStorage.getItem("cb_lastSyncPush") || null,
    lastSyncPull: localStorage.getItem("cb_lastSyncPull") || null,
    guestMode: localStorage.getItem("cb_guestMode") === "true",
  };
}

function loadSHACache() {
  const cache = localStorage.getItem("cb_sha_cache");
  return cache ? JSON.parse(cache) : {};
}

function saveSHACache(cache) {
  localStorage.setItem("cb_sha_cache", JSON.stringify(cache));
}

function saveSettings(s) {
  localStorage.setItem("cb_token", s.token);
  localStorage.setItem("cb_owner", s.owner);
  localStorage.setItem("cb_repo", s.repo);
  localStorage.setItem("cb_branch", s.branch);
  if (s.lastSyncPush) localStorage.setItem("cb_lastSyncPush", s.lastSyncPush);
  if (s.lastSyncPull) localStorage.setItem("cb_lastSyncPull", s.lastSyncPull);
  localStorage.setItem("cb_guestMode", s.guestMode ? "true" : "false");
}

function updateSyncTimestamps() {
  const s = loadSettings();
  const lastPushEl = document.getElementById("last-push-time");
  const lastPullEl = document.getElementById("last-pull-time");

  if (lastPushEl) {
    lastPushEl.textContent = s.lastSyncPush ? new Date(s.lastSyncPush).toLocaleString() : "Never";
  }

  if (lastPullEl) {
    lastPullEl.textContent = s.lastSyncPull ? new Date(s.lastSyncPull).toLocaleString() : "Never";
  }
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
        <div style="font-weight:500;">${item.query}</div>
        <div style="font-size:10px;color:var(--mid-grey);">
          ${item.scopes.join(", ")} • ${new Date(item.timestamp).toLocaleDateString()}
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

// ── IndexedDB ──────────────────────────────────────────────────────

function openDatabase() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORE_NAME)) {
        const store = d.createObjectStore(STORE_NAME, { keyPath: "uuid" });
        store.createIndex("lastname", "lastname", { unique: false });
        store.createIndex("modifiedAt", "modifiedAt", { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGetAll() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet(uuid) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(uuid);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(record) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).put(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ── Parsing helpers ────────────────────────────────────────────────

/**
 * Parses "Name (var1, var2)" into { primary, variations[] }
 */
function parseNameWithVariations(raw) {
  if (!raw) return { primary: "", variations: [] };
  const str = String(raw).trim();
  const match = str.match(/^([^(]*)\(([^)]+)\)/);
  if (match) {
    const primary = match[1].trim();
    const variations = match[2]
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    return { primary, variations };
  }
  return { primary: str, variations: [] };
}

/**
 * Parses "ref1; ref2; ref3" into array of reference objects
 * Each ref object: { reference, year, remarks }
 */
function parseRefArray(raw) {
  if (!raw) return [];
  return String(raw)
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((ref) => ({ reference: ref, year: "", remarks: "" }));
}

// ── Import Excel ───────────────────────────────────────────────────

async function clearAllRecords() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function parseGender(raw) {
  if (!raw) return "M";
  const val = String(raw).trim().toUpperCase();
  return val.includes("F") ? "F" : "M";
}

async function importExcel(file, deleteExisting = false) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

        if (rows.length < 2) {
          reject(new Error("Sheet appears to be empty."));
          return;
        }

        // Optionally wipe existing records
        if (deleteExisting) await clearAllRecords();

        // First row = headers, skip it
        const dataRows = rows.slice(1);
        let imported = 0;

        for (const row of dataRows) {
          // Skip completely empty rows
          if (row.every((c) => c === "" || c == null)) continue;

          const lastnameData = parseNameWithVariations(row[0]);
          const firstnameData = parseNameWithVariations(row[1]);

          const record = {
            uuid: generateUUID(),
            createdAt: now(),
            modifiedAt: now(),
            deletedAt: null,

            // Col 0 — Lastname (with variations)
            lastname: lastnameData.primary,
            lastnameVariations: lastnameData.variations,

            // Col 1 — Firstname (with variations)
            firstname: firstnameData.primary,
            firstnameVariations: firstnameData.variations,

            // Col 2 — Patronymic
            patronymic: String(row[2] || "").trim(),

            // Col 3 — Gender: Male unless F present
            gender: parseGender(row[3]),

            // Col 4 — City
            city: String(row[4] || "").trim(),

            // Col 5 — Profession
            profession: String(row[5] || "").trim(),

            // Col 6 — Origin
            origin: String(row[6] || "").trim(),

            // Col 7 — First seen
            firstseen: String(row[7] || "").trim(),

            // Col 8 — Last seen
            lastseen: String(row[8] || "").trim(),

            // Col 9 — Lasting
            lasting: String(row[9] || "").trim(),

            // Col 10 — MoCO-A since
            mocosince: String(row[10] || "").trim(),

            // Col 11 — Religion
            religion: String(row[11] || "").trim(),

            // Col 12 — Year of birth
            yob: String(row[12] || "").trim(),

            // Col 13 — Born in
            bornin: String(row[13] || "").trim(),

            // Col 14 — Year of death
            yod: String(row[14] || "").trim(),

            // Col 15 — Died in
            diedin: String(row[15] || "").trim(),

            // Col 16 — Zotero (semicolon-separated refs)
            zotero: parseRefArray(row[16]),

            // Col 17 — Archief (semicolon-separated refs)
            archief: parseRefArray(row[17]),

            // Col 18 — Notes / Opmerkingen
            notes: String(row[18] || "").trim(),
          };

          await idbPut(record);
          imported++;
        }

        resolve(imported);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

// ── Export Functions ───────────────────────────────────────────────

function exportToExcel() {
  if (!filteredRecords.length) {
    notify("No records to export.", "warning");
    return;
  }

  // Prepare data for Excel export
  const excelData = filteredRecords.map((r) => {
    return {
      UUID: r.uuid || "",
      Lastname: r.lastname || "",
      "Lastname Variations": (r.lastnameVariations || []).join("; "),
      Firstname: r.firstname || "",
      "Firstname Variations": (r.firstnameVariations || []).join("; "),
      Patronymic: r.patronymic || "",
      Gender: r.gender || "",
      City: r.city || "",
      Profession: r.profession || "",
      Origin: r.origin || "",
      "First Seen": r.firstseen || "",
      "Last Seen": r.lastseen || "",
      "Moco Since": r.mocosince || "",
      Religion: r.religion || "",
      "Year of Birth": r.yob || "",
      "Born In": r.bornin || "",
      "Year of Death": r.yod || "",
      "Died In": r.diedin || "",
      Notes: r.notes || "",
      Relationships: (r.relationships || [])
        .map((rel) => `${rel.type}:${rel.personName}`)
        .join("; "),
      Zotero: (r.zotero || []).map((z) => `${z.key}=${z.value}`).join("; "),
      Archief: (r.archief || []).map((a) => `${a.key}=${a.value}`).join("; "),
      "Created At": r.createdAt || "",
      "Modified At": r.modifiedAt || "",
      "Deleted At": r.deletedAt || "",
    };
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  ws["!cols"] = [
    { wch: 36 }, // UUID
    { wch: 15 }, // Lastname
    { wch: 20 }, // Lastname Variations
    { wch: 15 }, // Firstname
    { wch: 20 }, // Firstname Variations
    { wch: 15 }, // Patronymic
    { wch: 8 }, // Gender
    { wch: 15 }, // City
    { wch: 20 }, // Profession
    { wch: 15 }, // Origin
    { wch: 12 }, // First Seen
    { wch: 12 }, // Last Seen
    { wch: 12 }, // Moco Since
    { wch: 15 }, // Religion
    { wch: 12 }, // Year of Birth
    { wch: 15 }, // Born In
    { wch: 12 }, // Year of Death
    { wch: 15 }, // Died In
    { wch: 30 }, // Notes
    { wch: 40 }, // Relationships
    { wch: 30 }, // Zotero
    { wch: 30 }, // Archief
    { wch: 20 }, // Created At
    { wch: 20 }, // Modified At
    { wch: 20 }, // Deleted At
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Persons");

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const filename = `livorno_prosopography_${timestamp}.xlsx`;

  // Download file
  XLSX.writeFile(wb, filename);
  notify(`Exported ${filteredRecords.length} records to ${filename}`, "success");
}

function exportToJSON() {
  if (!filteredRecords.length) {
    notify("No records to export.", "warning");
    return;
  }

  // Create JSON string with proper formatting
  const jsonData = JSON.stringify(filteredRecords, null, 2);

  // Create blob and download
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  a.download = `livorno_prosopography_${timestamp}.json`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  notify(`Exported ${filteredRecords.length} records to JSON`, "success");
}

// ── Codeberg API ───────────────────────────────────────────────────

async function pullFromGuestRepo() {
  const owner = "lvansnippenburg";
  const repo = "json_storage";
  const branch = "LivornoProsopography";

  showProgress("Guest Mode - Loading Data", "Fetching repository files...");

  try {
    // Get all JSON files from the public repository
    const res = await fetch(
      `https://codeberg.org/api/v1/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`,
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch repository: ${res.status}`);
    }

    const data = await res.json();
    const files = data.tree
      .filter((i) => i.type === "blob" && i.path.endsWith(".json"))
      .map((i) => i.path);

    if (!files.length) {
      hideProgress();
      notify("No data files found in guest repository.", "warning");
      return;
    }

    updateProgress(0, files.length, "Loading records...");

    // Clear existing data
    const allRecords = await idbGetAll();
    for (const record of allRecords) {
      await idbDelete(record.uuid);
    }

    let loaded = 0;
    for (let i = 0; i < files.length; i++) {
      const path = files[i];
      updateProgress(i + 1, files.length, `Loading ${path}...`);

      try {
        const fileRes = await fetch(
          `https://codeberg.org/api/v1/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        );

        if (!fileRes.ok) continue;

        const fileData = await fileRes.json();
        if (!fileData?.content) continue;

        const remote = decodeContent(fileData.content);

        // Only load non-deleted records
        if (!remote.deletedAt) {
          await idbPut(remote);
          loaded++;
        }
      } catch (err) {
        console.warn(`Failed to load ${path}:`, err);
      }
    }

    hideProgress();
    notify(`Guest mode: Loaded ${loaded} records from public repository.`, "success");
    await refreshRecords();
  } catch (err) {
    hideProgress();
    notify(`Failed to load guest data: ${err.message}`, "error");
  }
}

async function codebergRequest(method, endpoint, body = null) {
  const s = loadSettings();
  if (!s.token || !s.owner || !s.repo) throw new Error("Codeberg settings not configured.");
  const opts = {
    method,
    headers: {
      Authorization: `token ${s.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`https://codeberg.org/api/v1${endpoint}`, opts);
  if (res.status === 404) return null;
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Codeberg [${res.status}]: ${t}`);
  }
  return res.json();
}

function encodeContent(record) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(record, null, 2))));
}

function decodeContent(base64) {
  return JSON.parse(decodeURIComponent(escape(atob(base64.replace(/\n/g, "")))));
}

async function getAllRepoFiles() {
  const s = loadSettings();
  const res = await codebergRequest(
    "GET",
    `/repos/${s.owner}/${s.repo}/git/trees/${s.branch}?recursive=true`,
  );
  if (!res?.tree) return [];
  return res.tree.filter((i) => i.type === "blob" && i.path.endsWith(".json")).map((i) => i.path);
}

async function pushToCodeberg(fullSync = false) {
  const s = loadSettings();
  const records = await idbGetAll();
  if (!records.length) {
    notify("No local records to push.", "info");
    return;
  }

  // Filter records by timestamp if not doing full sync
  let recordsToCheck = records;
  if (!fullSync && s.lastSyncPush) {
    const lastSync = new Date(s.lastSyncPush);
    recordsToCheck = records.filter((r) => {
      const created = new Date(r.createdAt);
      const modified = new Date(r.modifiedAt);
      const deleted = r.deletedAt ? new Date(r.deletedAt) : null;
      return created > lastSync || modified > lastSync || (deleted && deleted > lastSync);
    });

    if (recordsToCheck.length === 0) {
      notify("No records have changed since last push.", "info");
      return;
    }
  }

  showProgress(
    fullSync ? "Full Sync - Pushing to Codeberg" : "Pushing to Codeberg",
    fullSync ? "Checking all records..." : `Pushing ${recordsToCheck.length} changed records...`,
  );

  const shaCache = loadSHACache();
  const recordsToPush = [];

  // For quick sync, use cached SHAs; for full sync, fetch from Codeberg
  if (fullSync) {
    // Full sync: check each record against Codeberg
    for (let i = 0; i < recordsToCheck.length; i++) {
      const record = recordsToCheck[i];
      updateProgress(i + 1, recordsToCheck.length, `Checking ${record.uuid.substring(0, 8)}...`);

      try {
        const endpoint = `/repos/${s.owner}/${s.repo}/contents/${record.uuid}.json`;
        const existing = await codebergRequest("GET", `${endpoint}?ref=${s.branch}`);

        if (existing) {
          const remote = decodeContent(existing.content);
          if (new Date(remote.modifiedAt) < new Date(record.modifiedAt)) {
            recordsToPush.push({ record, endpoint, sha: existing.sha, action: "update" });
          }
        } else {
          recordsToPush.push({ record, endpoint, sha: null, action: "create" });
        }
      } catch {
        // File doesn't exist, needs to be created
        const endpoint = `/repos/${s.owner}/${s.repo}/contents/${record.uuid}.json`;
        recordsToPush.push({ record, endpoint, sha: null, action: "create" });
      }
    }
  } else {
    // Quick sync: use cached SHAs, assume all filtered records need pushing
    for (const record of recordsToCheck) {
      const endpoint = `/repos/${s.owner}/${s.repo}/contents/${record.uuid}.json`;
      const cachedSHA = shaCache[record.uuid];
      recordsToPush.push({
        record,
        endpoint,
        sha: cachedSHA || null,
        action: cachedSHA ? "update" : "create",
      });
    }
  }

  if (recordsToPush.length === 0) {
    hideProgress();
    notify("All records are up to date. Nothing to push.", "info");
    return;
  }

  // Push records
  let pushed = 0;
  let errors = 0;

  for (let i = 0; i < recordsToPush.length; i++) {
    const { record, endpoint, sha, action } = recordsToPush[i];
    updateProgress(
      i + 1,
      recordsToPush.length,
      `${action === "create" ? "Creating" : "Updating"} ${record.uuid.substring(0, 8)}...`,
    );

    try {
      let result;
      if (action === "update" && sha) {
        result = await codebergRequest("PUT", endpoint, {
          message: `update: ${record.uuid}`,
          content: encodeContent(record),
          sha: sha,
          branch: s.branch,
        });
      } else {
        // For creates or updates without SHA, try PUT first with fetch of current SHA
        try {
          const existing = await codebergRequest("GET", `${endpoint}?ref=${s.branch}`);
          result = await codebergRequest("PUT", endpoint, {
            message: `update: ${record.uuid}`,
            content: encodeContent(record),
            sha: existing.sha,
            branch: s.branch,
          });
        } catch {
          // Doesn't exist, create it
          result = await codebergRequest("POST", endpoint, {
            message: `create: ${record.uuid}`,
            content: encodeContent(record),
            branch: s.branch,
          });
        }
      }

      // Cache the new SHA
      if (result?.content?.sha) {
        shaCache[record.uuid] = result.content.sha;
      }

      pushed++;
    } catch {
      errors++;
    }
  }

  // Save SHA cache and sync timestamp
  saveSHACache(shaCache);
  s.lastSyncPush = now();
  saveSettings(s);
  updateSyncTimestamps();

  hideProgress();
  const skipped = recordsToCheck.length - recordsToPush.length;
  notify(
    `Push done. Pushed: ${pushed}, Skipped: ${skipped}, Errors: ${errors}`,
    errors ? "error" : "success",
  );
}

async function pullFromCodeberg(fullSync = false) {
  const files = await getAllRepoFiles();
  if (!files.length) {
    notify("No files found in repository.", "info");
    return;
  }

  showProgress(
    fullSync ? "Full Sync - Pulling from Codeberg" : "Pulling from Codeberg",
    "Fetching remote records...",
  );

  const s = loadSettings();
  const shaCache = loadSHACache();
  let pulled = 0,
    skipped = 0,
    errors = 0;

  for (let i = 0; i < files.length; i++) {
    const path = files[i];
    updateProgress(i + 1, files.length, `Checking ${path.substring(0, 20)}...`);

    try {
      const fd = await codebergRequest(
        "GET",
        `/repos/${s.owner}/${s.repo}/contents/${path}?ref=${s.branch}`,
      );
      if (!fd?.content) continue;
      const remote = decodeContent(fd.content);

      // If not full sync and we have a last pull timestamp, skip old records
      if (!fullSync && s.lastSyncPull) {
        const lastSync = new Date(s.lastSyncPull);
        const remoteModified = new Date(remote.modifiedAt);
        if (remoteModified <= lastSync) {
          skipped++;
          continue;
        }
      }

      const local = await idbGet(remote.uuid);
      if (local && new Date(local.modifiedAt) >= new Date(remote.modifiedAt)) {
        skipped++;
        continue;
      }
      await idbPut(remote);

      // Cache the SHA
      if (fd.sha) {
        shaCache[remote.uuid] = fd.sha;
      }

      pulled++;
    } catch {
      errors++;
    }
  }

  // Save SHA cache and sync timestamp
  saveSHACache(shaCache);
  s.lastSyncPull = now();
  saveSettings(s);
  updateSyncTimestamps();

  hideProgress();
  notify(
    `Pull done. Pulled: ${pulled}, Skipped: ${skipped}, Errors: ${errors}`,
    errors ? "error" : "success",
  );
  await refreshRecords();
}

// ── Records display ────────────────────────────────────────────────

async function refreshRecords(query = "") {
  allRecords = await idbGetAll();
  let filtered = showDeleted ? allRecords : allRecords.filter((r) => !r.deletedAt);

  if (query.trim()) {
    // Add to search history
    addToSearchHistory(query, searchScopes);

    // Advanced query syntax: field:value AND/OR field:value
    if (advancedMode && (query.includes(" AND ") || query.includes(" OR "))) {
      filtered = filtered.filter((r) => evaluateAdvancedQuery(r, query));
    } else {
      // Standard search with multiple scopes and optional regex
      filtered = filtered.filter((r) => {
        // If "all" is in scopes, search all fields
        if (searchScopes.includes("all")) {
          return searchInRecord(r, query, [
            "lastname",
            "firstname",
            "patronymic",
            "origin",
            "city",
            "profession",
            "religion",
            "notes",
            "references",
            "relationships",
            "name",
          ]);
        }

        // Search only selected scopes (OR logic - match any scope)
        return searchScopes.some((scope) => searchInRecord(r, query, [scope]));
      });
    }
  }

  // Sort
  filtered.sort((a, b) => {
    const av = (a[sortCol] || "").toString().toLowerCase();
    const bv = (b[sortCol] || "").toString().toLowerCase();
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  renderStats(allRecords);
  filteredRecords = filtered; // Store filtered records globally for export
  renderTable(filtered);
}

function searchInRecord(record, query, scopes) {
  const q = regexMode ? query : query.toLowerCase();

  // Helper to test a value against query
  const matches = (value) => {
    if (!value) return false;
    const v = regexMode ? value : value.toLowerCase();
    if (regexMode) {
      try {
        return new RegExp(q, "i").test(v);
      } catch {
        return false; // Invalid regex
      }
    }
    return v.includes(q);
  };

  // Test each scope
  for (const scope of scopes) {
    switch (scope) {
      case "lastname":
        if (matches(record.lastname)) return true;
        if ((record.lastnameVariations || []).some((v) => matches(v))) return true;
        break;

      case "firstname":
        if (matches(record.firstname)) return true;
        if ((record.firstnameVariations || []).some((v) => matches(v))) return true;
        break;

      case "patronymic":
        if (matches(record.patronymic)) return true;
        break;

      case "name":
        const names = [
          record.lastname,
          record.firstname,
          record.patronymic,
          ...(record.lastnameVariations || []),
          ...(record.firstnameVariations || []),
        ];
        if (names.some((n) => matches(n || ""))) return true;
        break;

      case "origin":
        if (matches(record.origin)) return true;
        break;

      case "city":
        if (matches(record.city)) return true;
        break;

      case "profession":
        if (matches(record.profession)) return true;
        break;

      case "religion":
        if (matches(record.religion)) return true;
        break;

      case "notes":
        if (matches(record.notes)) return true;
        break;

      case "references":
        const refs = [...(record.zotero || []), ...(record.archief || [])];
        if (refs.some((ref) => matches(ref.reference))) return true;
        break;

      case "relationships":
        const rels = record.relationships || [];
        if (rels.some((rel) => matches(rel.personName) || matches(rel.type))) return true;
        break;

      case "timespan":
        // Support: year, year-year range, or year:value in advanced mode
        const timespanMatch = matchTimespan(record, q);
        if (timespanMatch) return true;
        break;
    }
  }

  return false;
}

function matchTimespan(record, query) {
  // Extract years from firstseen and lastseen fields
  const extractYear = (value) => {
    if (!value) return null;
    const match = value.match(/\b(\d{4})\b/);
    return match ? parseInt(match[1], 10) : null;
  };

  let firstseen = extractYear(record.firstseen);
  let lastseen = extractYear(record.lastseen);

  // Parse query - can be: "1650", "1650-1660", or text containing years
  const yearMatch = query.match(/\b(\d{4})\b/);
  const rangeMatch = query.match(/\b(\d{4})\s*-\s*(\d{4})\b/);

  if (rangeMatch) {
    // Query is a range: "1630-1680"
    const queryStart = parseInt(rangeMatch[1], 10);
    const queryEnd = parseInt(rangeMatch[2], 10);

    // If firstseen is missing, treat it as queryStart
    // If lastseen is missing, treat it as queryEnd
    const effectiveFirstseen = firstseen !== null ? firstseen : queryStart;
    const effectiveLastseen = lastseen !== null ? lastseen : queryEnd;

    // Person's timespan must fall within query range:
    // firstseen >= queryStart AND lastseen <= queryEnd
    return effectiveFirstseen >= queryStart && effectiveLastseen <= queryEnd;
  } else if (yearMatch) {
    // Query is a single year: "1650"
    const queryYear = parseInt(yearMatch[1], 10);

    // If both missing, use query year for both
    // If firstseen missing, use query year
    // If lastseen missing, use query year
    const effectiveFirstseen = firstseen !== null ? firstseen : queryYear;
    const effectiveLastseen = lastseen !== null ? lastseen : queryYear;

    // Check if query year is within person's timespan
    return queryYear >= effectiveFirstseen && queryYear <= effectiveLastseen;
  }

  // No year found in query, fall back to text matching
  return false;
}

function evaluateAdvancedQuery(record, query) {
  // Parse advanced query syntax: field:value AND/OR field:value
  // Split by AND/OR while preserving the operator
  const tokens = query.split(/\s+(AND|OR)\s+/i);
  const conditions = [];
  const operators = [];

  for (let i = 0; i < tokens.length; i++) {
    if (i % 2 === 0) {
      // Condition
      conditions.push(tokens[i].trim());
    } else {
      // Operator
      operators.push(tokens[i].toUpperCase());
    }
  }

  // Evaluate each condition
  const results = conditions.map((condition) => {
    const match = condition.match(/^(\w+):(.+)$/);
    if (!match) {
      // No field specified, search all
      return searchInRecord(record, condition, [
        "lastname",
        "firstname",
        "patronymic",
        "origin",
        "city",
        "profession",
        "religion",
        "timespan",
        "notes",
        "references",
        "relationships",
      ]);
    }

    const [, field, value] = match;
    return searchInRecord(record, value, [field.toLowerCase()]);
  });

  // Apply operators
  if (results.length === 1) return results[0];

  let result = results[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "AND") {
      result = result && results[i + 1];
    } else if (operators[i] === "OR") {
      result = result || results[i + 1];
    }
  }

  return result;
}

function updateScopeDisplay() {
  const display = document.getElementById("scope-display");
  if (searchScopes.includes("all")) {
    display.textContent = "All";
  } else if (searchScopes.length === 0) {
    display.textContent = "None";
  } else if (searchScopes.length === 1) {
    const labels = {
      name: "Name",
      lastname: "Lastname",
      firstname: "Firstname",
      patronymic: "Patronymic",
      origin: "Origin",
      city: "City",
      profession: "Profession",
      religion: "Religion",
      notes: "Notes",
      references: "Refs",
      relationships: "Rels",
      timespan: "Timespan",
    };
    display.textContent = labels[searchScopes[0]] || searchScopes[0];
  } else {
    display.textContent = `${searchScopes.length} fields`;
  }
}

function renderStats(records) {
  // Only count non-deleted records
  const active = records.filter((r) => !r.deletedAt);
  const total = active.length;
  const male = active.filter((r) => r.gender === "M").length;
  const female = active.filter((r) => r.gender === "F").length;

  // Count relationships
  let totalRelationships = 0;
  const relationshipTypeCounts = {};
  active.forEach((r) => {
    const rels = r.relationships || [];
    totalRelationships += rels.length;
    rels.forEach((rel) => {
      relationshipTypeCounts[rel.type] = (relationshipTypeCounts[rel.type] || 0) + 1;
    });
  });

  // Collect unique origins and their counts
  const originCounts = {};
  active.forEach((r) => {
    const origin = (r.origin || "").trim();
    if (origin) {
      originCounts[origin] = (originCounts[origin] || 0) + 1;
    }
  });

  // Collect unique religions and their counts
  const religionCounts = {};
  active.forEach((r) => {
    const religion = (r.religion || "").trim();
    if (religion) {
      religionCounts[religion] = (religionCounts[religion] || 0) + 1;
    }
  });

  // Sort origins and religions alphabetically
  const sortedOrigins = Object.keys(originCounts).sort();
  const sortedReligions = Object.keys(religionCounts).sort();

  // Update total/gender stats
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-male").textContent = male;
  document.getElementById("stat-female").textContent = female;

  // Update relationships stat (if element exists)
  const relStat = document.getElementById("stat-relationships");
  if (relStat) {
    relStat.textContent = totalRelationships;
    relStat.title = Object.entries(relationshipTypeCounts)
      .map(([type, count]) => `${type}: ${count}`)
      .join(", ");
  }

  // Dynamically populate origin stats
  const originContainer = document.getElementById("origin-stats-container");
  originContainer.innerHTML = "";
  sortedOrigins.forEach((origin) => {
    const card = document.createElement("div");
    card.className = "stat-card stat-card--clickable";
    card.innerHTML = `
      <span class="stat-value">${originCounts[origin]}</span>
      <span class="stat-label">${origin}</span>
    `;
    card.addEventListener("click", () => {
      const searchInput = document.getElementById("search-input");
      searchInput.value = origin;
      searchScopes = ["origin"];
      updateScopeDisplay();
      refreshRecords(origin);
    });
    originContainer.appendChild(card);
  });

  // Dynamically populate religion stats
  const religionContainer = document.getElementById("religion-stats-container");
  if (religionContainer) {
    religionContainer.innerHTML = "";
    sortedReligions.forEach((religion) => {
      const card = document.createElement("div");
      card.className = "stat-card stat-card--clickable";
      card.innerHTML = `
        <span class="stat-value">${religionCounts[religion]}</span>
        <span class="stat-label">${religion}</span>
      `;
      card.addEventListener("click", () => {
        const searchInput = document.getElementById("search-input");
        searchInput.value = religion;
        searchScopes = ["religion"];
        updateScopeDisplay();
        refreshRecords(religion);
      });
      religionContainer.appendChild(card);
    });
  }
}

function renderTable(records) {
  const tbody = document.getElementById("records-tbody");
  tbody.innerHTML = "";

  document.getElementById("records-count").textContent =
    `${records.length} record${records.length !== 1 ? "s" : ""}`;

  if (!records.length) {
    tbody.innerHTML =
      '<tr><td colspan="11" style="text-align:center;padding:30px;color:#999;">No records found</td></tr>';
    return;
  }

  records.forEach((r) => {
    const tr = document.createElement("tr");
    if (r.deletedAt) tr.classList.add("deleted-row");
    tr.dataset.uuid = r.uuid;

    const zoteroCount = (r.zotero || []).length;
    const archiefCount = (r.archief || []).length;
    const relationshipCount = (r.relationships || []).length;
    const lnVars = (r.lastnameVariations || [])
      .map((v) => `<span class="tag">${v}</span>`)
      .join("");
    const fnVars = (r.firstnameVariations || [])
      .map((v) => `<span class="tag">${v}</span>`)
      .join("");
    const genderLabel = r.gender === "F" ? "&#x2640;" : "&#x2642;";
    let cityLabel = "";
    if (r.city !== "Livorno") {
      cityLabel = "!";
    }

    const fullFirstname = [r.firstname || "", r.patronymic || ""].filter(Boolean).join(" ");

    tr.innerHTML = `
            <td>${r.lastname || ""}${lnVars}</td>
            <td>${fullFirstname}${fnVars}</td>
            <td>${genderLabel}</td>
            <td>${cityLabel}</td>
            <td>${r.profession || ""}</td>
            <td>${r.firstseen || ""}</td>
            <td>${r.lastseen || ""}</td>
            <td>${zoteroCount ? `<span class="tag">${zoteroCount}&nbsp;ref${zoteroCount > 1 ? "s" : ""}</span>` : ""}</td>
            <td>${archiefCount ? `<span class="tag">${archiefCount}&nbsp;ref${archiefCount > 1 ? "s" : ""}</span>` : ""}</td>
            <td>${relationshipCount ? `<span class="tag">${relationshipCount}&nbsp;rel${relationshipCount > 1 ? "s" : ""}</span>` : ""}</td>
            <td>
                <button class="btn-ghost btn-small btn-edit" data-uuid="${r.uuid}">&#x270E;</button>
            </td>
        `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openEditModal(btn.dataset.uuid);
    });
  });

  tbody.querySelectorAll("tr").forEach((tr) => {
    tr.addEventListener("click", () => {
      if (tr.dataset.uuid) openEditModal(tr.dataset.uuid);
    });
  });
}

// ── Lookup (fuzzy lastname search) ─────────────────────────────────

async function runLastnameLookup(query) {
  if (!query || query.length < 2) return [];
  const records = await idbGetAll();
  const matches = [];

  records.forEach((r) => {
    if (r.deletedAt) return;
    const names = [r.lastname, ...(r.lastnameVariations || [])];
    let matchType = null;

    for (const name of names) {
      if (!name) continue;
      const nl = name.toLowerCase();
      const ql = query.toLowerCase();
      if (nl === ql) {
        matchType = "exact";
        break;
      }
      if (nl.startsWith(ql)) {
        matchType = "prefix";
        break;
      }
      if (nl.includes(ql)) {
        matchType = "contains";
        break;
      }
      if (soundex(name) === soundex(query)) {
        matchType = "sounds like";
        break;
      }
      if (levenshtein(ql, nl) <= 2) {
        matchType = "similar";
        break;
      }
    }

    if (matchType) matches.push({ record: r, matchType });
  });

  // Sort: exact first, then prefix, then rest
  const order = { exact: 0, prefix: 1, contains: 2, "sounds like": 3, similar: 4 };
  matches.sort((a, b) => order[a.matchType] - order[b.matchType]);
  return matches;
}

function renderLookupDropdown(matches, dropdown) {
  dropdown.innerHTML = "";
  if (!matches.length) {
    dropdown.classList.add("hidden");
    return;
  }

  matches.slice(0, 12).forEach(({ record: r, matchType }) => {
    const div = document.createElement("div");
    div.className = "lookup-item";

    const details = [r.firstname, r.patronymic].filter(Boolean).join(" ");

    div.innerHTML = `
            <strong>${r.lastname}</strong>
            <span class="match-type">(${matchType})</span>
            <div class="person-details">
                ${details || "—"}
                ${r.lastnameVariations?.length ? " · vars: " + r.lastnameVariations.join(", ") : ""}
            </div>
        `;
    div.addEventListener("mousedown", (e) => {
      e.preventDefault();
      openEditModal(r.uuid);
      dropdown.classList.add("hidden");
    });
    dropdown.appendChild(div);
  });

  dropdown.classList.remove("hidden");
}

// ── Modal / Form ───────────────────────────────────────────────────

function makeVariationItem(value = "") {
  const div = document.createElement("div");
  div.className = "array-item";
  div.innerHTML = `
        <input type="text" class="variation-input" value="${value}" placeholder="Variation">
        <button class="btn-danger btn-small remove-item">✕</button>
    `;
  div.querySelector(".remove-item").addEventListener("click", () => div.remove());
  return div;
}

function makeRefItem(ref = {}) {
  const div = document.createElement("div");
  div.className = "array-item";
  div.innerHTML = `
        <div class="array-item-fields">
            <input type="text" class="ref-reference" value="${ref.reference || ""}" placeholder="Reference">
            <input type="text" class="ref-year"      value="${ref.year || ""}" placeholder="Year (optional)">
            <input type="text" class="ref-remarks"   value="${ref.remarks || ""}" placeholder="Remarks (optional)">
        </div>
        <button class="btn-danger btn-small remove-item" style="align-self:flex-start;">✕</button>
    `;
  div.querySelector(".remove-item").addEventListener("click", () => div.remove());
  return div;
}

function collectVariations(containerId) {
  return [...document.getElementById(containerId).querySelectorAll(".variation-input")]
    .map((i) => i.value.trim())
    .filter(Boolean);
}

function collectRefs(containerId) {
  return [...document.getElementById(containerId).querySelectorAll(".array-item")]
    .map((item) => ({
      reference: item.querySelector(".ref-reference")?.value.trim() || "",
      year: item.querySelector(".ref-year")?.value.trim() || "",
      remarks: item.querySelector(".ref-remarks")?.value.trim() || "",
    }))
    .filter((r) => r.reference);
}

function showPersonPicker() {
  return new Promise((resolve) => {
    const modal = document.getElementById("person-picker-modal");
    const searchInput = document.getElementById("person-picker-search");
    const resultsDiv = document.getElementById("person-picker-results");
    const closeBtn = document.getElementById("person-picker-close");

    // Clear previous state
    searchInput.value = "";
    resultsDiv.innerHTML = "";

    // Render all persons initially
    const renderResults = async (query = "") => {
      const records = await idbGetAll();
      const filtered = records
        .filter((r) => !r.deletedAt)
        .filter((r) => {
          if (!query) return true;
          const q = query.toLowerCase();
          return (
            r.lastname.toLowerCase().includes(q) ||
            r.firstname.toLowerCase().includes(q) ||
            (r.patronymic && r.patronymic.toLowerCase().includes(q))
          );
        })
        .sort((a, b) => a.lastname.localeCompare(b.lastname));

      resultsDiv.innerHTML = "";
      if (filtered.length === 0) {
        resultsDiv.innerHTML =
          '<p style="text-align:center;color:var(--mid-grey);padding:20px;">No persons found</p>';
        return;
      }

      filtered.forEach((r) => {
        const item = document.createElement("div");
        item.className = "person-picker-item";
        item.innerHTML = `
          <div style="font-weight:600;">${r.firstname} ${r.lastname}</div>
          <div style="font-size:11px;color:var(--mid-grey);">${r.patronymic || ""} ${r.yob ? `(${r.yob})` : ""} ${r.origin || ""}</div>
        `;
        item.addEventListener("click", () => {
          modal.classList.add("hidden");
          resolve({ uuid: r.uuid, name: `${r.firstname} ${r.lastname}` });
        });
        resultsDiv.appendChild(item);
      });
    };

    // Search on input
    let debounce;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => renderResults(e.target.value), 200);
    });

    // Close handlers
    const cancel = () => {
      modal.classList.add("hidden");
      resolve(null);
    };
    closeBtn.onclick = cancel;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cancel();
    });

    // Show modal and render initial results
    modal.classList.remove("hidden");
    renderResults();
    searchInput.focus();
  });
}

function makeRelationshipItem(rel = {}) {
  const div = document.createElement("div");
  div.className = "array-item";
  div.innerHTML = `
        <div class="array-item-fields">
            <input type="text" class="rel-person-name" value="${rel.personName || ""}" placeholder="Click to select person" readonly style="cursor:pointer;background:var(--ice-blue);">
            <input type="hidden" class="rel-person-uuid" value="${rel.personUuid || ""}">
            <select class="rel-type">
                <option value="father" ${rel.type === "father" ? "selected" : ""}>Father</option>
                <option value="mother" ${rel.type === "mother" ? "selected" : ""}>Mother</option>
                <option value="son" ${rel.type === "son" ? "selected" : ""}>Son</option>
                <option value="daughter" ${rel.type === "daughter" ? "selected" : ""}>Daughter</option>
                <option value="husband" ${rel.type === "husband" ? "selected" : ""}>Husband</option>
                <option value="wife" ${rel.type === "wife" ? "selected" : ""}>Wife</option>
                <option value="brother" ${rel.type === "brother" ? "selected" : ""}>Brother</option>
                <option value="sister" ${rel.type === "sister" ? "selected" : ""}>Sister</option>
                <option value="associate" ${rel.type === "associate" ? "selected" : ""}>Associate</option>
                <option value="business" ${rel.type === "business" ? "selected" : ""}>Business</option>
                <option value="friend" ${rel.type === "friend" ? "selected" : ""}>Friend</option>
                <option value="neighbour" ${rel.type === "neighbour" ? "selected" : ""}>Neighbour</option>
                <option value="other" ${rel.type === "other" ? "selected" : ""}>Other</option>
            </select>
        </div>
        <button class="btn-danger btn-small remove-item" style="align-self:flex-start;">✕</button>
    `;

  const nameInput = div.querySelector(".rel-person-name");
  const uuidInput = div.querySelector(".rel-person-uuid");

  // Click to open person picker
  nameInput.addEventListener("click", async () => {
    const selected = await showPersonPicker();
    if (selected) {
      nameInput.value = selected.name;
      uuidInput.value = selected.uuid;
    }
  });

  div.querySelector(".remove-item").addEventListener("click", () => div.remove());
  return div;
}

function collectRelationships(containerId) {
  return [...document.getElementById(containerId).querySelectorAll(".array-item")]
    .map((item) => ({
      personUuid: item.querySelector(".rel-person-uuid")?.value.trim() || "",
      personName: item.querySelector(".rel-person-name")?.value.trim() || "",
      type: item.querySelector(".rel-type")?.value || "other",
    }))
    .filter((r) => r.personUuid);
}

async function showRelationshipNetwork() {
  const modal = document.getElementById("relationship-network-modal");
  const content = document.getElementById("relationship-network-content");
  const legendItems = document.getElementById("legend-items");

  // Get all records
  const allRecords = await idbGetAll();
  const activeRecords = allRecords.filter((r) => !r.deletedAt);

  // Build network map: personUuid -> {person, relationships: [{type, toUuid, toName}]}
  const networkMap = new Map();

  // Get all relationship types (both family and other)
  const allRelTypes = [...RELATIONSHIP_GROUPS.family, ...RELATIONSHIP_GROUPS.other];

  activeRecords.forEach((person) => {
    const rels = person.relationships || [];
    const relevantRels = rels.filter((rel) => allRelTypes.includes(rel.type));

    if (relevantRels.length > 0) {
      if (!networkMap.has(person.uuid)) {
        networkMap.set(person.uuid, {
          person: person,
          relationships: [],
        });
      }

      relevantRels.forEach((rel) => {
        networkMap.get(person.uuid).relationships.push({
          type: rel.type,
          toUuid: rel.personUuid,
          toName: rel.personName,
        });
      });
    }
  });

  // Render legend with grouped sections
  legendItems.innerHTML = "";

  // Family Relations group
  const familyGroup = document.createElement("div");
  familyGroup.style.display = "flex";
  familyGroup.style.flexWrap = "wrap";
  familyGroup.style.gap = "12px";
  familyGroup.style.width = "100%";

  const familyLabel = document.createElement("div");
  familyLabel.style.fontWeight = "600";
  familyLabel.style.fontSize = "11px";
  familyLabel.style.width = "100%";
  familyLabel.style.marginBottom = "-4px";
  familyLabel.textContent = "Family Relations:";
  familyGroup.appendChild(familyLabel);

  RELATIONSHIP_GROUPS.family.forEach((type) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <div class="legend-color" style="background: ${RELATIONSHIP_COLORS[type]}"></div>
      <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
    `;
    familyGroup.appendChild(item);
  });

  legendItems.appendChild(familyGroup);

  // Other Relations group
  const otherGroup = document.createElement("div");
  otherGroup.style.display = "flex";
  otherGroup.style.flexWrap = "wrap";
  otherGroup.style.gap = "12px";
  otherGroup.style.width = "100%";
  otherGroup.style.marginTop = "12px";

  const otherLabel = document.createElement("div");
  otherLabel.style.fontWeight = "600";
  otherLabel.style.fontSize = "11px";
  otherLabel.style.width = "100%";
  otherLabel.style.marginBottom = "-4px";
  otherLabel.textContent = "Other Relations:";
  otherGroup.appendChild(otherLabel);

  RELATIONSHIP_GROUPS.other.forEach((type) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `
      <div class="legend-color" style="background: ${RELATIONSHIP_COLORS[type]}"></div>
      <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
    `;
    otherGroup.appendChild(item);
  });

  legendItems.appendChild(otherGroup);

  // Render network
  content.innerHTML = "";

  if (networkMap.size === 0) {
    content.innerHTML =
      '<p style="text-align:center;color:var(--mid-grey);padding:40px;">No relationships found</p>';
  } else {
    // Convert to array and sort by person name
    const networkArray = Array.from(networkMap.values());
    networkArray.sort((a, b) => {
      const nameA = `${a.person.firstname} ${a.person.lastname}`.toLowerCase();
      const nameB = `${b.person.firstname} ${b.person.lastname}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    networkArray.forEach(({ person, relationships }) => {
      const card = document.createElement("div");
      card.className = "network-person-card";
      card.dataset.uuid = person.uuid;

      // Apply opacity if city is not Livorno
      const isLivorno = person.city && person.city.toLowerCase().includes("livorno");
      if (!isLivorno) {
        card.style.opacity = "0.6";
      }

      // Group relationships by person to show multiple relationship types
      const relsByPerson = new Map();
      relationships.forEach((rel) => {
        if (!relsByPerson.has(rel.toUuid)) {
          relsByPerson.set(rel.toUuid, {
            name: rel.toName,
            types: [],
          });
        }
        relsByPerson.get(rel.toUuid).types.push(rel.type);
      });

      // Build relationship badges HTML
      let badgesHTML = "";
      relsByPerson.forEach(({ name, types }, uuid) => {
        types.forEach((type) => {
          const color = RELATIONSHIP_COLORS[type];
          badgesHTML += `<div class="network-rel-badge" style="background: ${color}">${type}: ${name}</div>`;
        });
      });

      card.innerHTML = `
        <div class="network-person-name">${person.firstname || ""} ${person.lastname || ""}</div>
        <div class="network-person-details">
          ${person.patronymic || ""} ${person.yob ? `(${person.yob})` : ""} ${person.origin || ""} ${person.city || ""}
        </div>
        <div class="network-relationships">
          ${badgesHTML}
        </div>
      `;

      // Click to open person
      card.addEventListener("click", async () => {
        modal.classList.add("hidden");
        await openEditModal(person.uuid);
      });

      content.appendChild(card);
    });
  }

  // Show modal
  modal.classList.remove("hidden");
}

function renderRelationshipGraph() {
  const svg = d3.select("#relationship-graph");
  const container = document.getElementById("relationship-graph-container");
  const width = container.clientWidth || 800;
  const height = 600;

  svg.attr("width", width).attr("height", height);
  svg.selectAll("*").remove(); // Clear previous graph

  // Create main container group for zoom/pan
  const g = svg.append("g");

  // Get all records
  idbGetAll().then((allRecords) => {
    const activeRecords = allRecords.filter((r) => !r.deletedAt);

    // Build nodes and links
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // Get all relationship types (both family and other)
    const allRelTypes = [...RELATIONSHIP_GROUPS.family, ...RELATIONSHIP_GROUPS.other];

    activeRecords.forEach((person) => {
      const rels = person.relationships || [];
      const relevantRels = rels.filter((rel) => allRelTypes.includes(rel.type));

      if (relevantRels.length > 0) {
        // Add source node if not exists
        if (!nodeMap.has(person.uuid)) {
          const isLivorno = person.city && person.city.toLowerCase().includes("livorno");
          const node = {
            id: person.uuid,
            name: `${person.firstname || ""} ${person.lastname || ""}`.trim(),
            details: `${person.patronymic || ""} ${person.yob ? `(${person.yob})` : ""}`.trim(),
            isLivorno: isLivorno,
          };
          nodes.push(node);
          nodeMap.set(person.uuid, node);
        }

        // Add links and target nodes
        relevantRels.forEach((rel) => {
          // Add target node if not exists
          if (!nodeMap.has(rel.personUuid)) {
            const targetNode = {
              id: rel.personUuid,
              name: rel.personName,
              details: "",
            };
            nodes.push(targetNode);
            nodeMap.set(rel.personUuid, targetNode);
          }

          // Add link
          links.push({
            source: person.uuid,
            target: rel.personUuid,
            type: rel.type,
            color: RELATIONSHIP_COLORS[rel.type],
          });
        });
      }
    });

    if (nodes.length === 0) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#999")
        .text("No relationships in this category");
      return;
    }

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(150),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create arrow markers for directed edges (in svg, not g)
    svg
      .append("defs")
      .selectAll("marker")
      .data(Object.keys(RELATIONSHIP_COLORS))
      .join("marker")
      .attr("id", (d) => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", (d) => RELATIONSHIP_COLORS[d])
      .attr("d", "M0,-5L10,0L0,5");

    // Create links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (d) => `url(#arrow-${d.type})`);

    // Create nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#5a9db5")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("opacity", (d) => (d.isLivorno ? 1 : 0.3))
      .style("cursor", "pointer");

    // Add labels to nodes
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 0)
      .attr("y", -25)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("fill", "#333")
      .attr("opacity", (d) => (d.isLivorno ? 1 : 0.3))
      .style("pointer-events", "none");

    // Add details to nodes
    node
      .append("text")
      .text((d) => d.details)
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#666")
      .attr("opacity", (d) => (d.isLivorno ? 1 : 0.3))
      .style("pointer-events", "none");

    // Add hover effects
    node
      .on("mouseover", function () {
        d3.select(this).select("circle").attr("r", 25).attr("fill", "#4a8da8");
      })
      .on("mouseout", function () {
        d3.select(this).select("circle").attr("r", 20).attr("fill", "#5a9db5");
      })
      .on("click", function (event, d) {
        document.getElementById("relationship-network-modal").classList.add("hidden");
        openEditModal(d.id);
      });

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Add zoom behavior
    const zoom = d3.zoom().scaleExtent([0.5, 3]).on("zoom", zoomed);

    svg.call(zoom);

    function zoomed(event) {
      g.attr("transform", event.transform);
    }
  });
}

function renderRelationshipSummary(record) {
  const container = document.getElementById("relationship-summary");
  if (!container) return;

  const rels = record.relationships || [];
  if (rels.length === 0) {
    container.innerHTML =
      '<p style="color:var(--mid-grey);font-size:12px;">No relationships defined</p>';
    return;
  }

  // Group by type
  const grouped = {};
  rels.forEach((rel) => {
    if (!grouped[rel.type]) grouped[rel.type] = [];
    grouped[rel.type].push(rel);
  });

  let html = '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
  for (const [type, persons] of Object.entries(grouped)) {
    persons.forEach((rel) => {
      html += `
        <div class="relationship-chip" data-uuid="${rel.personUuid}" style="cursor:pointer;">
          <span class="rel-type-badge">${type}</span>
          <span class="rel-person-name">${rel.personName}</span>
        </div>
      `;
    });
  }
  html += "</div>";
  container.innerHTML = html;

  // Add click handlers to open related person
  container.querySelectorAll(".relationship-chip").forEach((chip) => {
    chip.addEventListener("click", async (e) => {
      e.preventDefault();
      const uuid = chip.dataset.uuid;
      // Save current person first if modified
      document.getElementById("person-modal").classList.add("hidden");
      await openEditModal(uuid);
    });
  });
}

function getReciprocalRelationType(type) {
  const reciprocals = {
    father: "son",
    mother: "daughter",
    son: "father",
    daughter: "mother",
    husband: "wife",
    wife: "husband",
    brother: "brother",
    sister: "sister",
    friend: "friend",
    associate: "associate",
    business: "business",
    neighbour: "neighbour",
    other: "other",
  };
  return reciprocals[type] || "other";
}

async function updateBidirectionalRelationships(record, oldRelationships = []) {
  const newRels = record.relationships || [];
  const oldRels = oldRelationships || [];

  // Track which relationships to add/remove for each related person
  const updates = {};

  // Process removed relationships
  for (const oldRel of oldRels) {
    const found = newRels.find((r) => r.personUuid === oldRel.personUuid && r.type === oldRel.type);
    if (!found) {
      // Relationship was removed, remove reciprocal
      if (!updates[oldRel.personUuid]) updates[oldRel.personUuid] = { add: [], remove: [] };
      updates[oldRel.personUuid].remove.push({
        personUuid: record.uuid,
        personName: `${record.firstname} ${record.lastname}`,
        type: getReciprocalRelationType(oldRel.type),
      });
    }
  }

  // Process added/existing relationships
  for (const newRel of newRels) {
    const wasExisting = oldRels.find(
      (r) => r.personUuid === newRel.personUuid && r.type === newRel.type,
    );
    if (!wasExisting) {
      // New relationship, add reciprocal
      if (!updates[newRel.personUuid]) updates[newRel.personUuid] = { add: [], remove: [] };
      updates[newRel.personUuid].add.push({
        personUuid: record.uuid,
        personName: `${record.firstname} ${record.lastname}`,
        type: getReciprocalRelationType(newRel.type),
      });
    }
  }

  // Apply updates to related persons
  for (const [uuid, changes] of Object.entries(updates)) {
    const relatedPerson = await idbGet(uuid);
    if (!relatedPerson) continue;

    let rels = relatedPerson.relationships || [];

    // Remove relationships
    for (const toRemove of changes.remove) {
      rels = rels.filter(
        (r) => !(r.personUuid === toRemove.personUuid && r.type === toRemove.type),
      );
    }

    // Add relationships (avoid duplicates)
    for (const toAdd of changes.add) {
      const exists = rels.find((r) => r.personUuid === toAdd.personUuid && r.type === toAdd.type);
      if (!exists) {
        rels.push(toAdd);
      }
    }

    // Save updated related person
    relatedPerson.relationships = rels;
    relatedPerson.modifiedAt = now();
    await idbPut(relatedPerson);
  }
}

function validateRelationships(record) {
  const warnings = [];
  const rels = record.relationships || [];

  // Check for self-reference
  rels.forEach((rel) => {
    if (rel.personUuid === record.uuid) {
      warnings.push(`Warning: Person cannot have a relationship with themselves (${rel.type})`);
    }
  });

  // Check for duplicate relationships
  const seen = new Set();
  rels.forEach((rel) => {
    const key = `${rel.personUuid}:${rel.type}`;
    if (seen.has(key)) {
      warnings.push(`Warning: Duplicate ${rel.type} relationship with ${rel.personName}`);
    }
    seen.add(key);
  });

  return warnings;
}

async function openNewModal() {
  editingUUID = null;
  clearForm();
  document.getElementById("modal-title").textContent = "New Person";
  document.getElementById("btn-delete-person").classList.add("hidden");
  document.getElementById("btn-save-person").style.display = "block";
  document.getElementById("person-modal").classList.remove("hidden");

  // Re-enable all inputs for new modal
  const modal = document.getElementById("person-modal");
  modal.querySelectorAll("input, select, textarea").forEach((input) => {
    input.disabled = false;
  });
  modal.querySelectorAll(".btn-secondary, .remove-item").forEach((btn) => {
    btn.disabled = false;
    btn.style.opacity = "1";
  });
}

async function openEditModal(uuid) {
  const record = await idbGet(uuid);
  if (!record) return;
  editingUUID = uuid;

  const s = loadSettings();

  if (s.guestMode) {
    document.getElementById("modal-title").textContent = "View Person (Read-Only)";
    document.getElementById("btn-delete-person").classList.add("hidden");
    document.getElementById("btn-save-person").style.display = "none";
  } else {
    document.getElementById("modal-title").textContent = "Edit Person";
    document.getElementById("btn-delete-person").classList.remove("hidden");
    document.getElementById("btn-save-person").style.display = "block";
  }

  populateForm(record);
  document.getElementById("person-modal").classList.remove("hidden");

  const modal = document.getElementById("person-modal");

  // Make all inputs read-only in guest mode, or re-enable in user mode
  if (s.guestMode) {
    modal.querySelectorAll("input, select, textarea").forEach((input) => {
      input.disabled = true;
    });
    modal.querySelectorAll(".btn-secondary, .remove-item").forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = "0.5";
    });
  } else {
    modal.querySelectorAll("input, select, textarea").forEach((input) => {
      input.disabled = false;
    });
    modal.querySelectorAll(".btn-secondary, .remove-item").forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = "1";
    });
  }
}

function clearForm() {
  [
    "lastname",
    "firstname",
    "patronymic",
    "gender",
    "city",
    "profession",
    "origin",
    "firstseen",
    "lastseen",
    "lasting",
    "mocosince",
    "religion",
    "yob",
    "bornin",
    "yod",
    "diedin",
    "notes",
  ].forEach((f) => {
    const el = document.getElementById(`field-${f}`);
    if (el) el.value = "";
  });
  document.getElementById("lastname-variations-container").innerHTML = "";
  document.getElementById("firstname-variations-container").innerHTML = "";
  document.getElementById("zotero-container").innerHTML = "";
  document.getElementById("archief-container").innerHTML = "";
  document.getElementById("relationships-container").innerHTML = "";
}

function populateForm(r) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };
  set("field-lastname", r.lastname);
  set("field-firstname", r.firstname);
  set("field-patronymic", r.patronymic);
  set("field-gender", r.gender);
  set("field-city", r.city);
  set("field-profession", r.profession);
  set("field-origin", r.origin);
  set("field-firstseen", r.firstseen);
  set("field-lastseen", r.lastseen);
  // set("field-lasting", r.lasting);
  set("field-mocosince", r.mocosince);
  set("field-religion", r.religion);
  set("field-yob", r.yob);
  set("field-bornin", r.bornin);
  set("field-yod", r.yod);
  set("field-diedin", r.diedin);
  set("field-notes", r.notes);

  const lvc = document.getElementById("lastname-variations-container");
  lvc.innerHTML = "";
  (r.lastnameVariations || []).forEach((v) => lvc.appendChild(makeVariationItem(v)));

  const fvc = document.getElementById("firstname-variations-container");
  fvc.innerHTML = "";
  (r.firstnameVariations || []).forEach((v) => fvc.appendChild(makeVariationItem(v)));

  const zc = document.getElementById("zotero-container");
  zc.innerHTML = "";
  (r.zotero || []).forEach((ref) => zc.appendChild(makeRefItem(ref)));

  const ac = document.getElementById("archief-container");
  ac.innerHTML = "";
  (r.archief || []).forEach((ref) => ac.appendChild(makeRefItem(ref)));

  const rc = document.getElementById("relationships-container");
  rc.innerHTML = "";
  (r.relationships || []).forEach((rel) => rc.appendChild(makeRelationshipItem(rel)));

  // Add relationship summary display above the form
  renderRelationshipSummary(r);
}

async function savePerson() {
  const lastname = document.getElementById("field-lastname").value.trim();
  const firstname = document.getElementById("field-firstname").value.trim();
  if (!lastname) {
    notify("Lastname is required.", "error");
    return;
  }

  const isNew = !editingUUID;
  const ts = now();
  const existing = editingUUID ? await idbGet(editingUUID) : null;
  const oldRelationships = existing?.relationships || [];

  const record = {
    uuid: editingUUID || generateUUID(),
    createdAt: existing?.createdAt || ts,
    modifiedAt: ts,
    deletedAt: existing?.deletedAt || null,

    lastname,
    lastnameVariations: collectVariations("lastname-variations-container"),
    firstname,
    firstnameVariations: collectVariations("firstname-variations-container"),
    patronymic: document.getElementById("field-patronymic").value.trim(),
    gender: document.getElementById("field-gender").value,
    city: document.getElementById("field-city").value.trim(),
    profession: document.getElementById("field-profession").value.trim(),
    origin: document.getElementById("field-origin").value.trim(),
    firstseen: document.getElementById("field-firstseen").value.trim(),
    lastseen: document.getElementById("field-lastseen").value.trim(),
    // lasting: document.getElementById("field-lasting").value.trim(),
    mocosince: document.getElementById("field-mocosince").value.trim(),
    religion: document.getElementById("field-religion").value.trim(),
    yob: document.getElementById("field-yob").value.trim(),
    bornin: document.getElementById("field-bornin").value.trim(),
    yod: document.getElementById("field-yod").value.trim(),
    diedin: document.getElementById("field-diedin").value.trim(),
    notes: document.getElementById("field-notes").value.trim(),
    relationships: collectRelationships("relationships-container"),
    zotero: collectRefs("zotero-container"),
    archief: collectRefs("archief-container"),
  };

  // Validate relationships
  const warnings = validateRelationships(record);
  if (warnings.length > 0) {
    const proceed = await showDialog("Relationship Warnings", warnings.join("\n\n"), [
      { label: "Save Anyway", cls: "btn-primary", value: true },
      { label: "Go Back", cls: "btn-secondary", value: false },
    ]);
    if (!proceed) return;
  }

  // Update bidirectional relationships
  await updateBidirectionalRelationships(record, oldRelationships);

  await idbPut(record);
  document.getElementById("person-modal").classList.add("hidden");
  notify(isNew ? "Person created." : "Person updated.", "success");
  await refreshRecords(document.getElementById("search-input").value);
}

async function deletePerson() {
  if (!editingUUID) return;
  const confirmed = await showDialog(
    "Delete Person",
    "Mark this record as deleted? It will be hidden but kept in the database.",
    [
      { label: "Cancel", cls: "btn-secondary", value: false },
      { label: "Mark as Deleted", cls: "btn-danger", value: true },
    ],
  );
  if (!confirmed) return;

  const record = await idbGet(editingUUID);
  if (!record) return;
  record.deletedAt = now();
  record.modifiedAt = now();
  await idbPut(record);
  document.getElementById("person-modal").classList.add("hidden");
  notify("Record marked as deleted.", "info");
  await refreshRecords(document.getElementById("search-input").value);
}

// ── Boot ───────────────────────────────────────────────────────────

async function boot() {
  db = await openDatabase();
  const records = await idbGetAll();

  // Load search history
  loadSearchHistory();

  // Populate settings UI
  let s = loadSettings();
  document.getElementById("setting-token").value = s.token;
  document.getElementById("setting-owner").value = s.owner;
  document.getElementById("setting-repo").value = s.repo;
  document.getElementById("setting-branch").value = s.branch;
  updateSyncTimestamps();

  // Update mode indicator
  const modeIndicator = document.getElementById("current-mode");
  if (modeIndicator) {
    modeIndicator.textContent = s.guestMode ? "Guest Mode (Read-Only)" : "User Mode";
    modeIndicator.style.color = s.guestMode ? "var(--mid-grey)" : "var(--dark-grey)";
  }

  // Check if user needs to select mode (first time or no mode set)
  if (!localStorage.getItem("cb_modeSelected")) {
    const modeChoice = await showDialog(
      "Welcome to Livorno Prosopography",
      "Please select how you want to use this application:",
      [
        { label: "Guest Mode (Read-Only)", cls: "btn-primary", value: "guest" },
        { label: "User Mode (Full Access)", cls: "btn-secondary", value: "user" },
      ],
    );

    if (modeChoice === "guest") {
      // Set guest mode
      s.guestMode = true;
      saveSettings(s);
      localStorage.setItem("cb_modeSelected", "true");

      // Load guest data
      await pullFromGuestRepo();

      // Disable sync buttons
      document.getElementById("btn-sync-push").disabled = true;
      document.getElementById("btn-sync-push").style.opacity = "0.5";
      document.getElementById("btn-sync-push").title = "Disabled in guest mode";
      document.getElementById("btn-sync-pull").disabled = true;
      document.getElementById("btn-sync-pull").style.opacity = "0.5";
      document.getElementById("btn-sync-pull").title = "Disabled in guest mode";
    } else {
      // Set user mode
      s.guestMode = false;
      saveSettings(s);
      localStorage.setItem("cb_modeSelected", "true");
    }
  }

  // Reload settings after mode selection
  s = loadSettings();

  // If in guest mode, disable sync buttons and modification features
  if (s.guestMode) {
    document.getElementById("btn-sync-push").disabled = true;
    document.getElementById("btn-sync-push").style.opacity = "0.5";
    document.getElementById("btn-sync-push").title = "Disabled in guest mode";
    document.getElementById("btn-sync-pull").disabled = true;
    document.getElementById("btn-sync-pull").style.opacity = "0.5";
    document.getElementById("btn-sync-pull").title = "Disabled in guest mode";

    // Disable import button
    document.getElementById("btn-import").disabled = true;
    document.getElementById("btn-import").style.opacity = "0.5";
    document.getElementById("btn-import").title = "Disabled in guest mode";

    // Make settings inputs read-only
    document.getElementById("setting-token").disabled = true;
    document.getElementById("setting-owner").disabled = true;
    document.getElementById("setting-repo").disabled = true;
    document.getElementById("setting-branch").disabled = true;

    // Hide New Person button
    document.getElementById("btn-new").style.display = "none";

    // Add guest mode indicator to header
    const header = document.querySelector("header h1");
    if (header && !header.textContent.includes("(Guest)")) {
      header.textContent += " (Guest Mode)";
    }
  } else {
    // User mode - normal flow
    // First-time import prompt or pull prompt
    if (records.length === 0) {
      const choice = await showDialog(
        "Welcome",
        "No local records found. Would you like to import from an Excel file or pull from Codeberg?",
        [
          { label: "Import Excel", cls: "btn-primary", value: "excel" },
          { label: "Pull from Codeberg", cls: "btn-secondary", value: "codeberg" },
          { label: "Start Empty", cls: "btn-ghost", value: "empty" },
        ],
      );
      if (choice === "excel") {
        document.getElementById("file-input").click();
      } else if (choice === "codeberg") {
        if (!s.token) {
          notify("Please configure Codeberg settings first.", "error");
        } else {
          await pullFromCodeberg();
        }
      }
    } else {
      // Ask about update from Codeberg
      if (s.token && s.owner && s.repo) {
        const doUpdate = await showDialog(
          "Sync with Codeberg",
          "Would you like to pull the latest updates from Codeberg?",
          [
            { label: "Yes, pull updates", cls: "btn-primary", value: true },
            { label: "No thanks", cls: "btn-secondary", value: false },
          ],
        );
        if (doUpdate) await pullFromCodeberg();
      }
    }
  }

  await refreshRecords();
  attachEventListeners();

  // Warn before closing (only in user mode)
  if (!s.guestMode) {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      e.returnValue = "Push changes to Codeberg before leaving?";
    });
  }
}

// ── Event Listeners ────────────────────────────────────────────────

function attachEventListeners() {
  // Search
  let searchDebounce;
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => refreshRecords(e.target.value), 280);
  });

  // Search scope selector
  document.getElementById("btn-search-scope").addEventListener("click", () => {
    const modal = document.getElementById("search-scope-modal");

    // Populate checkboxes with current state
    const checkboxes = modal.querySelectorAll(".scope-checkbox");
    checkboxes.forEach((cb) => {
      cb.checked = searchScopes.includes(cb.value);
    });

    modal.classList.remove("hidden");
  });

  document.getElementById("btn-scope-cancel").addEventListener("click", () => {
    document.getElementById("search-scope-modal").classList.add("hidden");
  });

  document.getElementById("btn-scope-apply").addEventListener("click", () => {
    const modal = document.getElementById("search-scope-modal");
    const checkboxes = modal.querySelectorAll(".scope-checkbox:checked");
    searchScopes = Array.from(checkboxes).map((cb) => cb.value);

    if (searchScopes.length === 0) {
      searchScopes = ["all"];
    }

    updateScopeDisplay();
    modal.classList.add("hidden");
    refreshRecords(searchInput.value);
  });

  // Handle "All Fields" checkbox toggle
  document.getElementById("search-scope-modal").addEventListener("change", (e) => {
    if (e.target.classList.contains("scope-checkbox") && e.target.value === "all") {
      const checkboxes = document.querySelectorAll(".scope-checkbox");
      checkboxes.forEach((cb) => {
        if (cb.value !== "all") cb.checked = false;
      });
    } else if (e.target.classList.contains("scope-checkbox") && e.target.value !== "all") {
      const allCheckbox = document.querySelector('.scope-checkbox[value="all"]');
      if (allCheckbox) allCheckbox.checked = false;
    }
  });

  // Regex toggle
  document.getElementById("btn-toggle-regex").addEventListener("click", function () {
    regexMode = !regexMode;
    this.style.background = regexMode ? "var(--ice-blue-dark)" : "";
    this.style.color = regexMode ? "var(--white)" : "";
    refreshRecords(searchInput.value);
  });

  // Advanced query toggle
  document.getElementById("btn-toggle-advanced").addEventListener("click", function () {
    advancedMode = !advancedMode;
    this.style.background = advancedMode ? "var(--ice-blue-dark)" : "";
    this.style.color = advancedMode ? "var(--white)" : "";
    refreshRecords(searchInput.value);
  });

  // Search history
  document.getElementById("btn-search-history").addEventListener("click", () => {
    showSearchHistory();
  });

  // Close history dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const historyBtn = document.getElementById("btn-search-history");
    const historyDropdown = document.getElementById("search-history-dropdown");
    if (!historyBtn.contains(e.target) && !historyDropdown.contains(e.target)) {
      historyDropdown.classList.add("hidden");
    }
  });

  // Stat card filters
  document.getElementById("stat-card-total").addEventListener("click", () => {
    searchInput.value = "";
    searchScopes = ["all"];
    updateScopeDisplay();
    refreshRecords("");
  });

  document.getElementById("stat-card-male").addEventListener("click", () => {
    searchInput.value = "Male";
    searchScopes = ["all"];
    updateScopeDisplay();
    refreshRecords("Male");
  });

  document.getElementById("stat-card-female").addEventListener("click", () => {
    searchInput.value = "Female";
    searchScopes = ["all"];
    updateScopeDisplay();
    refreshRecords("Female");
  });

  // Relationship network modal
  document.getElementById("stat-card-relationships").addEventListener("click", () => {
    showRelationshipNetwork();
  });

  document.getElementById("relationship-network-close").addEventListener("click", () => {
    document.getElementById("relationship-network-modal").classList.add("hidden");
  });

  // View switcher for relationship network
  document.getElementById("btn-list-view").addEventListener("click", function () {
    document.getElementById("relationship-network-content").style.display = "block";
    document.getElementById("relationship-graph-container").style.display = "none";
    this.style.background = "var(--ice-blue-dark)";
    this.style.color = "var(--white)";
    document.getElementById("btn-graph-view").style.background = "";
    document.getElementById("btn-graph-view").style.color = "";
  });

  document.getElementById("btn-graph-view").addEventListener("click", function () {
    document.getElementById("relationship-network-content").style.display = "none";
    document.getElementById("relationship-graph-container").style.display = "block";
    this.style.background = "var(--ice-blue-dark)";
    document.getElementById("btn-graph-view").style.background = "var(--ice-blue-dark)";
    this.style.color = "var(--white)";
    document.getElementById("btn-list-view").style.background = "";
    document.getElementById("btn-list-view").style.color = "";

    renderRelationshipGraph();
  });

  // New person
  document.getElementById("btn-new").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot create new records in guest mode.", "warning");
      return;
    }
    openNewModal();
  });

  // Import Excel
  document.getElementById("btn-import").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot import data in guest mode.", "warning");
      return;
    }
    document.getElementById("file-input").click();
  });

  // Export
  document.getElementById("btn-export").addEventListener("click", async () => {
    const choice = await showDialog(
      "Export Data",
      `Export ${filteredRecords.length} currently displayed record${filteredRecords.length !== 1 ? "s" : ""} to:`,
      [
        { label: "Excel (.xlsx)", cls: "btn-primary", value: "excel" },
        { label: "JSON (.json)", cls: "btn-secondary", value: "json" },
        { label: "Cancel", cls: "btn-ghost", value: false },
      ],
    );

    if (choice === "excel") {
      exportToExcel();
    } else if (choice === "json") {
      exportToJSON();
    }
  });

  document.getElementById("file-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Ask whether to append or replace
    const choice = await showDialog(
      "Import Excel",
      "Do you want to add the imported records to the existing database, or delete all current records first?",
      [
        { label: "Append to existing", cls: "btn-secondary", value: "append" },
        { label: "Delete all & import", cls: "btn-danger", value: "replace" },
        { label: "Cancel", cls: "btn-ghost", value: "cancel" },
      ],
    );

    if (choice === "cancel") {
      e.target.value = "";
      return;
    }

    try {
      const deleteExisting = choice === "replace";
      const count = await importExcel(file, deleteExisting);
      notify(
        `${deleteExisting ? "Replaced all records. " : ""}Imported ${count} records.`,
        "success",
      );
      await refreshRecords();
    } catch (err) {
      notify(`Import failed: ${err.message}`, "error");
    }

    e.target.value = "";
  });

  // Show / hide deleted
  document.getElementById("btn-show-deleted").addEventListener("click", () => {
    showDeleted = !showDeleted;
    document.getElementById("btn-show-deleted").textContent = showDeleted
      ? "Hide Deleted"
      : "Show Deleted";
    refreshRecords(document.getElementById("search-input").value);
  });

  // Sort columns
  document.querySelectorAll("thead th[data-col]").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.dataset.col;
      if (sortCol === col) {
        sortAsc = !sortAsc;
      } else {
        sortCol = col;
        sortAsc = true;
      }
      refreshRecords(document.getElementById("search-input").value);
    });
  });

  // Codeberg sync
  document.getElementById("btn-sync-push").addEventListener("click", async () => {
    const s = loadSettings();

    // Check if guest mode
    if (s.guestMode) {
      notify("Sync is disabled in guest mode.", "warning");
      return;
    }

    const lastPush = s.lastSyncPush ? new Date(s.lastSyncPush).toLocaleString() : "Never";
    const message = s.lastSyncPush
      ? `Quick sync: only push records changed since ${lastPush}\n\nOr do a full sync to check all records?`
      : "No previous sync found. A full sync will be performed.";

    const choice = await showDialog("Push to Codeberg", message, [
      { label: "Quick Sync", cls: "btn-primary", value: "quick" },
      { label: "Full Sync", cls: "btn-secondary", value: "full" },
      { label: "Cancel", cls: "btn-ghost", value: false },
    ]);

    if (choice === "quick") await pushToCodeberg(false);
    else if (choice === "full") await pushToCodeberg(true);
  });

  document.getElementById("btn-sync-pull").addEventListener("click", async () => {
    const s = loadSettings();

    // Check if guest mode
    if (s.guestMode) {
      notify("Sync is disabled in guest mode.", "warning");
      return;
    }

    const lastPull = s.lastSyncPull ? new Date(s.lastSyncPull).toLocaleString() : "Never";
    const message = s.lastPull
      ? `Quick sync: only pull records changed since ${lastPull}\n\nOr do a full sync to check all records?`
      : "No previous sync found. A full sync will be performed.";

    const choice = await showDialog("Pull from Codeberg", message, [
      { label: "Quick Sync", cls: "btn-primary", value: "quick" },
      { label: "Full Sync", cls: "btn-secondary", value: "full" },
      { label: "Cancel", cls: "btn-ghost", value: "false" },
    ]);

    if (choice === "quick") await pullFromCodeberg(false);
    else if (choice === "full") await pullFromCodeberg(true);
  });

  // Settings
  document.getElementById("btn-settings-toggle").addEventListener("click", () => {
    const panel = document.getElementById("settings-panel");
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });

  document.getElementById("btn-save-settings").addEventListener("click", () => {
    const s = loadSettings();
    saveSettings({
      token: document.getElementById("setting-token").value.trim(),
      owner: document.getElementById("setting-owner").value.trim(),
      repo: document.getElementById("setting-repo").value.trim(),
      branch: document.getElementById("setting-branch").value.trim() || "main",
      guestMode: s.guestMode, // Preserve guest mode setting
    });
    notify("Settings saved.", "success");
    document.getElementById("settings-panel").style.display = "none";
  });

  document.getElementById("btn-switch-mode").addEventListener("click", async () => {
    const s = loadSettings();
    const currentMode = s.guestMode ? "Guest Mode" : "User Mode";
    const targetMode = s.guestMode ? "User Mode" : "Guest Mode";

    const confirm = await showDialog(
      "Switch Mode",
      `You are currently in ${currentMode}.\n\nSwitching to ${targetMode} will reload the application and may replace your local data.\n\nAre you sure you want to continue?`,
      [
        { label: "Yes, Switch Mode", cls: "btn-primary", value: true },
        { label: "Cancel", cls: "btn-ghost", value: false },
      ],
    );

    if (confirm) {
      // Clear mode selection flag to trigger mode selection dialog
      localStorage.removeItem("cb_modeSelected");
      // Reload the page
      window.location.reload();
    }
  });

  // Modal controls
  document.getElementById("modal-close-btn").addEventListener("click", () => {
    document.getElementById("person-modal").classList.add("hidden");
  });
  document.getElementById("btn-cancel-modal").addEventListener("click", () => {
    document.getElementById("person-modal").classList.add("hidden");
  });
  document.getElementById("btn-save-person").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot save changes in guest mode.", "warning");
      return;
    }
    savePerson();
  });
  document.getElementById("btn-delete-person").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot delete records in guest mode.", "warning");
      return;
    }
    deletePerson();
  });

  // Variation add buttons
  document.getElementById("add-lastname-variation").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot modify records in guest mode.", "warning");
      return;
    }
    document.getElementById("lastname-variations-container").appendChild(makeVariationItem());
  });
  document.getElementById("add-firstname-variation").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot modify records in guest mode.", "warning");
      return;
    }
    document.getElementById("firstname-variations-container").appendChild(makeVariationItem());
  });
  document.getElementById("add-zotero").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot modify records in guest mode.", "warning");
      return;
    }
    document.getElementById("zotero-container").appendChild(makeRefItem());
  });
  document.getElementById("add-archief").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot modify records in guest mode.", "warning");
      return;
    }
    document.getElementById("archief-container").appendChild(makeRefItem());
  });

  document.getElementById("add-relationship").addEventListener("click", () => {
    const s = loadSettings();
    if (s.guestMode) {
      notify("Cannot modify records in guest mode.", "warning");
      return;
    }
    document.getElementById("relationships-container").appendChild(makeRelationshipItem());
  });

  // Lastname fuzzy lookup
  const lastnameInput = document.getElementById("field-lastname");
  const lookupDropdown = document.getElementById("lastname-lookup");

  let lookupDebounce;
  lastnameInput.addEventListener("input", () => {
    clearTimeout(lookupDebounce);
    lookupDebounce = setTimeout(async () => {
      const matches = await runLastnameLookup(lastnameInput.value);
      renderLookupDropdown(matches, lookupDropdown);
    }, 300);
  });

  lastnameInput.addEventListener("blur", () => {
    setTimeout(() => lookupDropdown.classList.add("hidden"), 200);
  });

  lastnameInput.addEventListener("focus", async () => {
    if (lastnameInput.value.length >= 2) {
      const matches = await runLastnameLookup(lastnameInput.value);
      renderLookupDropdown(matches, lookupDropdown);
    }
  });
}

// ── Start ──────────────────────────────────────────────────────────
boot().catch((err) => {
  console.error("Boot error:", err);
  notify("Application failed to start: " + err.message, "error");
});
