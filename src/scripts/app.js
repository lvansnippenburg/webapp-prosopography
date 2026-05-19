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
let searchHistory = [];
const MAX_SEARCH_HISTORY = 20;
let activeRelationshipTypes = new Set(); // Tracks which relationship types are active in network view
let serverDataDir = "";

// ── Entity Types ───────────────────────────────────────────────────

const ENTITY_TYPES = {
  person: "Person",
  association: "Association",
  institution: "Institution",
  company: "Company",
};

// ── Relationship Network Configuration ────────────────────────────

const RELATIONSHIP_COLORS = {
  father: "#4A90E2",
  mother: "#E24A90",
  son: "#6AB7FF",
  daughter: "#FF6AB7",
  child: "#6AB7FF", // Combined son/daughter for graph view
  husband: "#2D5F8D",
  wife: "#8D2D5F",
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
  family: ["father", "mother", "son", "daughter", "husband", "wife", "brother", "sister"],
  organizational: ["member", "employed"],
  other: ["associate", "business", "friend", "neighbour", "other"],
};

// ── Settings ───────────────────────────────────────────────────────

function loadSettings() {
  return {
    serverUrl: localStorage.getItem("cb_server_url") || "http://localhost:8081",
  };
}

function saveSettings(s) {
  localStorage.setItem("cb_server_url", s.serverUrl || "http://localhost:8081");
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


// ── Server API ─────────────────────────────────────────────────────

function getServerUrl() {
  return (localStorage.getItem("cb_server_url") || "http://localhost:8081").replace(/\/$/, "");
}

async function apiRequest(method, path, body = null) {
  const opts = { method, headers: {} };
  if (body !== null) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${getServerUrl()}${path}`, opts);
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Server [${res.status}]: ${text}`);
  }
  return res.json();
}

async function apiGetAll() {
  return apiRequest("GET", "/api/records");
}

async function apiGet(uuid) {
  return apiRequest("GET", `/api/records/${uuid}`);
}

async function apiPut(record) {
  return apiRequest("PUT", `/api/records/${record.uuid}`, record);
}

async function apiSoftDelete(uuid) {
  return apiRequest("DELETE", `/api/records/${uuid}`);
}

// Server-side fuzzy name lookup. Returns [{uuid, name, matchType}] sorted by match quality.
async function apiLookup(query) {
  if (!query || query.length < 2) return [];
  return apiRequest("GET", `/api/lookup?q=${encodeURIComponent(query)}`).catch(() => []);
}

async function testServerConnection(url) {
  try {
    const base = (url || getServerUrl()).replace(/\/$/, "");
    const res = await fetch(`${base}/api/records`, { method: "GET", signal: AbortSignal.timeout(4000) });
    return res.ok;
  } catch {
    return false;
  }
}

function updateServerStatus(state) {
  const el = document.getElementById("server-status");
  if (!el) return;
  const labels = { online: "● Server", offline: "● Server", connecting: "◌ Server" };
  const colors = { online: "var(--green, #27ae60)", offline: "var(--red, #e74c3c)", connecting: "var(--mid-grey)" };
  el.textContent = labels[state] || "● Server";
  el.style.color = colors[state] || "var(--mid-grey)";
  el.title = state === "online" ? `Connected to ${getServerUrl()}` : state === "offline" ? `Cannot reach ${getServerUrl()}` : "Connecting...";
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


function parseGender(raw) {
  if (!raw) return "M";
  const val = String(raw).trim().toUpperCase();
  return val.includes("F") ? "F" : "M";
}

async function importExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];

        // Try to read as JSON (with headers) first
        const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (jsonData.length > 0 && jsonData[0].UUID) {
          // This is an exported format with headers
          let imported = 0;
          let updated = 0;

          for (const row of jsonData) {
            // Skip empty rows
            if (!row.Lastname && !row.Firstname) continue;

            const uuid = row.UUID && row.UUID.trim() ? row.UUID.trim() : generateUUID();
            const existing = await apiGet(uuid);
            const isUpdate = !!existing;

            // Parse variations from semicolon-separated strings
            const lastnameVariations = row["Lastname Variations"]
              ? String(row["Lastname Variations"])
                .split(";")
                .map((v) => v.trim())
                .filter(Boolean)
              : [];
            const firstnameVariations = row["Firstname Variations"]
              ? String(row["Firstname Variations"])
                .split(";")
                .map((v) => v.trim())
                .filter(Boolean)
              : [];

            // Parse relationships
            const relationships = row.Relationships
              ? String(row.Relationships)
                .split(";")
                .map((r) => {
                  const parts = r.trim().split(":");
                  if (parts.length === 2) {
                    return {
                      type: parts[0].trim(),
                      personName: parts[1].trim(),
                      personUuid: "", // Will need to be resolved later
                    };
                  }
                  return null;
                })
                .filter(Boolean)
              : [];

            // Parse zotero and archief references
            const zotero = row.Zotero
              ? String(row.Zotero)
                .split(";")
                .map((ref) => ({
                  reference: ref.trim(),
                  year: "",
                  remarks: "",
                }))
                .filter((r) => r.reference)
              : [];

            const archief = row.Archief
              ? String(row.Archief)
                .split(";")
                .map((ref) => ({
                  reference: ref.trim(),
                  year: "",
                  remarks: "",
                }))
                .filter((r) => r.reference)
              : [];

            const record = {
              uuid: uuid,
              createdAt: existing?.createdAt || row["Created At"] || now(),
              modifiedAt: now(),
              deletedAt: row["Deleted At"] || null,

              entityType: String(row["Entity Type"] || "person")
                .trim()
                .toLowerCase(),
              lastname: String(row.Lastname || "").trim(),
              lastnameVariations: lastnameVariations,
              firstname: String(row.Firstname || "").trim(),
              firstnameVariations: firstnameVariations,
              patronymic: String(row.Patronymic || "").trim(),
              gender: String(row.Gender || "M").trim(),
              city: String(row.City || "").trim(),
              profession: String(row.Profession || "").trim(),
              origin: String(row.Origin || "").trim(),
              firstseen: String(row["First Seen"] || "").trim(),
              lastseen: String(row["Last Seen"] || "").trim(),
              mocosince: String(row["Moco Since"] || "").trim(),
              religion: String(row.Religion || "").trim(),
              yob: String(row["Year of Birth"] || "").trim(),
              bornin: String(row["Born In"] || "").trim(),
              yod: String(row["Year of Death"] || "").trim(),
              diedin: String(row["Died In"] || "").trim(),
              notes: String(row.Notes || "").trim(),
              relationships: relationships,
              zotero: zotero,
              archief: archief,
            };

            await apiPut(record);
            if (isUpdate) {
              updated++;
            } else {
              imported++;
            }
          }

          resolve({ imported, updated, total: imported + updated });
        } else {
          // Original format (no headers, positional columns)
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

          if (rows.length < 2) {
            reject(new Error("Sheet appears to be empty."));
            return;
          }

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

              entityType: "person", // Default for original format
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

            await apiPut(record);
            imported++;
          }

          resolve({ imported, updated: 0, total: imported });
        }
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
      "Entity Type": r.entityType || "person",
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
      Zotero: (r.zotero || []).map((z) => z.reference).join("; "),
      Archief: (r.archief || []).map((a) => a.reference).join("; "),
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
    { wch: 15 }, // Entity Type
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

// ── Records display ────────────────────────────────────────────────

async function refreshRecords(query = "") {
  try {
    allRecords = await apiGetAll();
  } catch (err) {
    notify(`Failed to load records from server: ${err.message}`, "error");
    allRecords = [];
  }
  let filtered = showDeleted ? allRecords : allRecords.filter((r) => !r.deletedAt);

  if (query.trim()) {
    // Add to search history
    addToSearchHistory(query, searchScopes);

    // Check if any search mode is active
    const hasActiveMode = regexMode || advancedMode || !searchScopes.includes("all");

    // Advanced query syntax: field:value AND/OR field:value
    // Also handle single field:value queries in advanced mode
    if (
      advancedMode &&
      (query.includes(" AND ") || query.includes(" OR ") || query.includes(":"))
    ) {
      filtered = filtered.filter((r) => evaluateAdvancedQuery(r, query));
    } else if (!hasActiveMode) {
      // Default basic search: fuzzy name search only (like lastname lookup)
      filtered = filtered.filter((r) => fuzzyNameSearch(r, query));
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
            "entityType",
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

      case "entityType":
        if (matches(record.entityType || "person")) return true;
        break;

      case "gender":
        if (matches(record.gender)) return true;
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
    const match = value.match(/(\d{4})/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Check if fields are truly blank (empty or whitespace only)
  const firstseenBlank = !record.firstseen || !record.firstseen.trim();
  const lastseenBlank = !record.lastseen || !record.lastseen.trim();

  // If both fields are blank, exclude from results
  if (firstseenBlank && lastseenBlank) {
    return false;
  }

  let firstseen = extractYear(record.firstseen);
  let lastseen = extractYear(record.lastseen);

  // If neither field has an extractable year (but fields aren't blank), exclude
  // This handles cases where fields have text but no valid year
  if (firstseen === null && lastseen === null) {
    return false;
  }

  // Parse query - can be: "1650", "1650-1660", or text containing years
  const yearMatch = query.match(/\b(\d{4})\b/);
  const rangeMatch = query.match(/\b(\d{4})\s*-\s*(\d{4})\b/);

  if (rangeMatch) {
    // Query is a range: "1630-1650"
    const queryStart = parseInt(rangeMatch[1], 10);
    const queryEnd = parseInt(rangeMatch[2], 10);

    if (firstseen !== null && lastseen !== null) {
      // Both dates available: person's timespan must fall within query range
      return firstseen >= queryStart && lastseen <= queryEnd;
    } else if (firstseen !== null) {
      // Only firstseen available: check if it falls within query range
      return firstseen >= queryStart && firstseen <= queryEnd;
    } else if (lastseen !== null) {
      // Only lastseen available: check if it falls within query range
      return lastseen >= queryStart && lastseen <= queryEnd;
    }
    return false;
  } else if (yearMatch) {
    // Query is a single year: "1650"
    const queryYear = parseInt(yearMatch[1], 10);

    if (firstseen !== null && lastseen !== null) {
      // Both dates available: check if query year is within person's timespan
      return queryYear >= firstseen && queryYear <= lastseen;
    } else if (firstseen !== null) {
      // Only firstseen available: check if it matches or is before query year
      return firstseen <= queryYear;
    } else if (lastseen !== null) {
      // Only lastseen available: check if it matches or is after query year
      return lastseen >= queryYear;
    }
    return false;
  }

  // No year found in query, fall back to text matching
  return false;
}

function evaluateAdvancedQuery(record, query) {
  // Parse advanced query syntax: field:value AND/OR field:!value
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
    const match = condition.match(/^(\w+):(!?)(.+)$/);
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

    const [, field, negation, value] = match;
    const result = searchInRecord(record, value, [field.toLowerCase()]);

    // Apply negation if present
    return negation === "!" ? !result : result;
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
  const scopeBtn = document.getElementById("btn-search-scope");

  if (searchScopes.includes("all")) {
    display.textContent = "All";
    scopeBtn.classList.remove("active");
  } else if (searchScopes.length === 0) {
    display.textContent = "None";
    scopeBtn.classList.remove("active");
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
    scopeBtn.classList.add("active");
  } else {
    display.textContent = `${searchScopes.length} fields`;
    scopeBtn.classList.add("active");
  }
  updateSearchPlaceholder();
}

function updateSearchPlaceholder() {
  const input = document.getElementById("search-input");
  const hasActiveMode = regexMode || advancedMode || !searchScopes.includes("all");

  if (advancedMode) {
    input.placeholder = "e.g. lastname:Smith AND city:Livorno";
  } else if (regexMode) {
    if (searchScopes.includes("all")) {
      input.placeholder = "Regex pattern (all fields)...";
    } else if (searchScopes.length === 1) {
      input.placeholder = `Regex pattern (${searchScopes[0]})...`;
    } else {
      input.placeholder = `Regex pattern (${searchScopes.length} fields)...`;
    }
  } else if (!searchScopes.includes("all")) {
    // Scope selected but no regex/advanced
    if (searchScopes.length === 1) {
      const examples = {
        name: "e.g. Giovanni, Berg",
        lastname: "e.g. Berg, Smith",
        firstname: "e.g. Giovanni, Maria",
        patronymic: "e.g. di Pietro",
        origin: "e.g. Dutch, Portuguese",
        city: "e.g. Amsterdam, Venice",
        profession: "e.g. merchant, broker",
        religion: "e.g. Jewish, Catholic",
        notes: "Search in notes...",
        references: "Search in references...",
        relationships: "e.g. father, member",
        timespan: "e.g. 1650 or 1630-1680",
      };
      input.placeholder = examples[searchScopes[0]] || `Search ${searchScopes[0]}...`;
    } else {
      input.placeholder = `Search ${searchScopes.length} fields...`;
    }
  } else {
    // Default: fuzzy name search
    input.placeholder = "Search names (fuzzy match, sounds like)...";
  }
}

function renderStats(records) {
  // Only count non-deleted records
  const active = records.filter((r) => !r.deletedAt);
  const total = active.length;

  // Count entity types
  const persons = active.filter((r) => (r.entityType || "person") === "person").length;
  const associations = active.filter((r) => r.entityType === "association").length;
  const institutions = active.filter((r) => r.entityType === "institution").length;
  const companies = active.filter((r) => r.entityType === "company").length;

  // Count gender (for persons only)
  const male = active.filter(
    (r) => (r.entityType || "person") === "person" && r.gender === "M",
  ).length;
  const female = active.filter(
    (r) => (r.entityType || "person") === "person" && r.gender === "F",
  ).length;

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

  // Update total stats
  document.getElementById("stat-total").textContent = total;

  // Update entity type stats
  document.getElementById("stat-persons").textContent = persons;
  document.getElementById("stat-associations").textContent = associations;
  document.getElementById("stat-institutions").textContent = institutions;
  document.getElementById("stat-companies").textContent = companies;

  // Update gender stats (persons only)
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
    // Entity type indicator
    let entityIcon = "";
    if (r.entityType === "association") entityIcon = "🏛&nbsp;";
    else if (r.entityType === "institution") entityIcon = "🏢&nbsp;";
    else if (r.entityType === "company") entityIcon = "🏭&nbsp;";
    else if (r.gender === "F") entityIcon = "🚺&nbsp;";
    else entityIcon = "🚹&nbsp;";

    const genderLabel = r.gender === "F" ? "&#x2640;" : "&#x2642;";

    let cityLabel = "";
    if (r.city !== "Livorno") {
      cityLabel = "!";
    }

    const fullFirstname = [r.firstname || "", r.patronymic || ""].filter(Boolean).join(" ");

    tr.innerHTML = `
            <td>${entityIcon}${cityLabel}</td>
            <td>${r.lastname || ""}${lnVars}</td>
            <td>${fullFirstname}${fnVars}</td>
            <td>${r.profession || ""}</td>
            <td>${r.firstseen || ""}</td>
            <td>${r.lastseen || ""}</td>
            <td style="white-space:nowrap">
            ${zoteroCount ? `<span class="tag">${zoteroCount}&nbsp;ref${zoteroCount > 1 ? "s" : ""}</span>` : ""}
            ${archiefCount ? `<span class="tag">${archiefCount}&nbsp;source${archiefCount > 1 ? "s" : ""}</span>` : ""}
            ${relationshipCount ? `<span class="tag">${relationshipCount}&nbsp;rel${relationshipCount > 1 ? "s" : ""}</span>` : ""}
            </td>
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
  const records = await apiGetAll().catch(() => []);
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

function resolveRefLink(value) {
  if (!value) return null;
  if (value.startsWith("https://")) return { url: value };
  if (/^[^/]+\/[^/]+\/[^/]+\/[^/]+\.pdf$/i.test(value)) {
    // const filePath = serverDataDir ? `${serverDataDir}/${value}` : `/${value}`;
    const filePath = `${value}`;
    return { url: `${location.protocol}//${location.hostname}:8080/?file=${encodeURIComponent(filePath)}` };
  }
  return null;
}

function makeRefItem(ref = {}) {
  const div = document.createElement("div");
  div.className = "array-item";
  div.innerHTML = `
        <div class="array-item-fields">
            <input type="text" class="ref-reference" value="${(ref.reference || "").replace(/"/g, "&quot;")}" placeholder="Reference">
            <input type="text" class="ref-year"      value="${(ref.year || "").replace(/"/g, "&quot;")}" placeholder="Year (optional)">
            <input type="text" class="ref-remarks"   value="${(ref.remarks || "").replace(/"/g, "&quot;")}" placeholder="Remarks (optional)">
        </div>
        <button class="btn-small ref-open-link" title="Open reference" style="display:none;align-self:flex-start;padding:4px 7px;line-height:1;">&#8599;</button>
        <button class="btn-danger btn-small remove-item" style="align-self:flex-start;">✕</button>
    `;
  const refInput = div.querySelector(".ref-reference");
  const openBtn = div.querySelector(".ref-open-link");
  function updateOpenBtn() {
    const link = resolveRefLink(refInput.value.trim());
    openBtn.style.display = link ? "" : "none";
    openBtn.onclick = link ? () => window.open(link.url, "_blank") : null;
  }
  refInput.addEventListener("input", updateOpenBtn);
  updateOpenBtn();
  div.querySelector(".remove-item").addEventListener("click", () => {
    const val = refInput.value.trim();
    if (!val || confirm(`Remove this reference?\n\n"${val}"`)) div.remove();
  });
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
      const records = await apiGetAll().catch(() => []);
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

        // Entity type indicator
        let entityIcon = "";
        if (r.entityType === "association") entityIcon = "🏛 ";
        else if (r.entityType === "institution") entityIcon = "🏢 ";
        else if (r.entityType === "company") entityIcon = "🏭 ";

        const entityTypeLabel =
          r.entityType && r.entityType !== "person" ? ` [${r.entityType}]` : "";

        item.innerHTML = `
          <div style="font-weight:600;">${entityIcon}${r.firstname} ${r.lastname}${entityTypeLabel}</div>
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
                <option value="member" ${rel.type === "member" ? "selected" : ""}>Member of</option>
                <option value="employed" ${rel.type === "employed" ? "selected" : ""}>Employed by</option>
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

  // Initialize active relationship types if empty (default: all active)
  if (activeRelationshipTypes.size === 0) {
    const allRelTypes = [
      ...RELATIONSHIP_GROUPS.family,
      ...RELATIONSHIP_GROUPS.organizational,
      ...RELATIONSHIP_GROUPS.other,
    ];
    allRelTypes.forEach((type) => activeRelationshipTypes.add(type));
  }

  // Use currently filtered records from the view
  const activeRecords =
    filteredRecords.length > 0
      ? filteredRecords
      : await apiGetAll().then((records) => records.filter((r) => !r.deletedAt)).catch(() => []);

  // Update entity count display
  const entityCountEl = document.getElementById("network-entity-count");
  if (entityCountEl) {
    entityCountEl.textContent = `(${activeRecords.length} ${activeRecords.length === 1 ? "entity" : "entities"})`;
  }

  // Build network map: personUuid -> {person, relationships: [{type, toUuid, toName}]}
  const networkMap = new Map();

  // Get all relationship types (family, organizational, and other)
  const allRelTypes = [
    ...RELATIONSHIP_GROUPS.family,
    ...RELATIONSHIP_GROUPS.organizational,
    ...RELATIONSHIP_GROUPS.other,
  ];

  activeRecords.forEach((person) => {
    const rels = person.relationships || [];
    // Filter by active relationship types
    const relevantRels = rels.filter(
      (rel) => allRelTypes.includes(rel.type) && activeRelationshipTypes.has(rel.type),
    );

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

  // Helper function to create legend items with click handlers
  const createLegendItem = (type) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.style.cursor = "pointer";
    item.style.userSelect = "none";
    item.dataset.relationType = type;

    const isActive = activeRelationshipTypes.has(type);
    item.style.opacity = isActive ? "1" : "0.6";
    item.title = isActive
      ? `Click to hide ${type} relationships`
      : `Click to show ${type} relationships`;

    item.innerHTML = `
      <div class="legend-color" style="background: ${RELATIONSHIP_COLORS[type]}"></div>
      <span>${type.charAt(0).toUpperCase() + type.slice(1)}</span>
    `;

    // Click handler to toggle filter
    item.addEventListener("click", () => {
      if (activeRelationshipTypes.has(type)) {
        activeRelationshipTypes.delete(type);
      } else {
        activeRelationshipTypes.add(type);
      }

      // Re-render the network with new filters
      showRelationshipNetwork();

      // If graph view is active, re-render the graph too
      const graphContainer = document.getElementById("relationship-graph-container");
      if (graphContainer.style.display !== "none") {
        renderRelationshipGraph();
      }
    });

    return item;
  };

  // Render legend with grouped sections
  legendItems.innerHTML = "";

  const filterHint = document.createElement("div");
  filterHint.style.cssText = "font-size:10px; color:var(--mid-grey); margin-bottom:2px";
  filterHint.textContent = "click chips to filter";
  legendItems.appendChild(filterHint);

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
    familyGroup.appendChild(createLegendItem(type));
  });

  legendItems.appendChild(familyGroup);

  // Organizational Relations group
  const orgGroup = document.createElement("div");
  orgGroup.style.display = "flex";
  orgGroup.style.flexWrap = "wrap";
  orgGroup.style.gap = "12px";
  orgGroup.style.width = "100%";
  orgGroup.style.marginTop = "12px";

  const orgLabel = document.createElement("div");
  orgLabel.style.fontWeight = "600";
  orgLabel.style.fontSize = "11px";
  orgLabel.style.width = "100%";
  orgLabel.style.marginBottom = "-4px";
  orgLabel.textContent = "Organizational Relations:";
  orgGroup.appendChild(orgLabel);

  RELATIONSHIP_GROUPS.organizational.forEach((type) => {
    orgGroup.appendChild(createLegendItem(type));
  });

  legendItems.appendChild(orgGroup);

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
    otherGroup.appendChild(createLegendItem(type));
  });

  legendItems.appendChild(otherGroup);

  // Filter button toggles legend items
  const btnLegendFilter = document.getElementById("btn-legend-filter");
  if (btnLegendFilter && !btnLegendFilter._hasToggleListener) {
    btnLegendFilter._hasToggleListener = true;
    btnLegendFilter.addEventListener("click", () => {
      const sidebar = btnLegendFilter.closest(".network-sidebar");
      const open = legendItems.style.display === "none";
      legendItems.style.display = open ? "flex" : "none";
      btnLegendFilter.style.background = open ? "var(--ice-blue-dark)" : "";
      btnLegendFilter.style.color = open ? "var(--white)" : "";
      sidebar.classList.toggle("legend-open", open);
    });
  }

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

function saveGraphAsPNG() {
  const svg = document.getElementById("relationship-graph");
  const container = document.getElementById("relationship-graph-container");

  // Get the SVG dimensions
  const width = svg.getAttribute("width") || container.clientWidth || 800;
  const height = svg.getAttribute("height") || container.clientHeight || 600;

  // Clone the SVG to avoid modifying the original
  const svgClone = svg.cloneNode(true);

  // Add white background
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", "100%");
  background.setAttribute("height", "100%");
  background.setAttribute("fill", "white");
  svgClone.insertBefore(background, svgClone.firstChild);

  // Serialize the SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);

  // Create a canvas
  const canvas = document.createElement("canvas");
  canvas.width = parseInt(width);
  canvas.height = parseInt(height);
  const ctx = canvas.getContext("2d");

  // Create an image from the SVG
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    // Draw white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the SVG
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Convert to PNG and download
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `relationship-network-${new Date().toISOString().split("T")[0]}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    notify("Graph saved as PNG", "success");
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    notify("Failed to save graph as PNG", "error");
  };

  img.src = url;
}

function renderRelationshipGraph() {
  const svg = d3.select("#relationship-graph");
  const container = document.getElementById("relationship-graph-container");
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 600;

  svg.attr("width", width).attr("height", height);
  svg.selectAll("*").remove(); // Clear previous graph

  // Create main container group for zoom/pan
  const g = svg.append("g");

  // Use currently filtered records from the view, but also get all records for lookups
  Promise.all([
    Promise.resolve(
      filteredRecords.length > 0
        ? filteredRecords
        : apiGetAll().then((records) => records.filter((r) => !r.deletedAt)).catch(() => []),
    ),
    apiGetAll().catch(() => []),
  ]).then(([activeRecords, allRecords]) => {
    // Create a lookup map for all records by UUID
    const recordLookup = new Map();
    allRecords.forEach((r) => recordLookup.set(r.uuid, r));

    // Build nodes and links
    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    // Get all relationship types (family, organizational, and other)
    const allRelTypes = [
      ...RELATIONSHIP_GROUPS.family,
      ...RELATIONSHIP_GROUPS.organizational,
      ...RELATIONSHIP_GROUPS.other,
    ];

    activeRecords.forEach((person) => {
      const rels = person.relationships || [];
      // Filter by active relationship types
      const relevantRels = rels.filter(
        (rel) => allRelTypes.includes(rel.type) && activeRelationshipTypes.has(rel.type),
      );

      if (relevantRels.length > 0) {
        // Add source node if not exists
        if (!nodeMap.has(person.uuid)) {
          const isLivorno = person.city && person.city.toLowerCase().includes("livorno");
          const node = {
            id: person.uuid,
            name: `${person.firstname || ""} ${person.lastname || ""}`.trim(),
            details: `${person.patronymic || ""} ${person.yob ? `(${person.yob})` : ""}`.trim(),
            isLivorno: isLivorno,
            gender: person.gender,
            entityType: person.entityType || "person",
          };
          nodes.push(node);
          nodeMap.set(person.uuid, node);
        }

        // Check if person has parent relationships (for sibling filtering)
        const hasParents = rels.some((rel) => rel.type === "father" || rel.type === "mother");

        // Add links and target nodes
        relevantRels.forEach((rel) => {
          // Skip brother/sister if person has parent relationships
          if ((rel.type === "brother" || rel.type === "sister") && hasParents) {
            return;
          }

          // Add target node if not exists
          if (!nodeMap.has(rel.personUuid)) {
            // Look up the original record to get city information
            const relatedRecord = recordLookup.get(rel.personUuid);
            const relatedIsLivorno =
              relatedRecord?.city && relatedRecord.city.toLowerCase().includes("livorno");
            const targetNode = {
              id: rel.personUuid,
              name: rel.personName,
              details: relatedRecord
                ? `${relatedRecord.patronymic || ""} ${relatedRecord.yob ? `(${relatedRecord.yob})` : ""}`.trim()
                : "",
              isLivorno: relatedIsLivorno,
              gender: relatedRecord?.gender,
              entityType: relatedRecord?.entityType || "person",
            };
            nodes.push(targetNode);
            nodeMap.set(rel.personUuid, targetNode);
          }

          // Simplify relationship types for graph display
          let graphType = rel.type;
          if (rel.type === "son" || rel.type === "daughter") {
            graphType = "child";
          } else if (rel.type === "brother" || rel.type === "sister") {
            graphType = "sibling";
          }

          // Add link
          links.push({
            source: person.uuid,
            target: rel.personUuid,
            type: graphType,
            color: RELATIONSHIP_COLORS[graphType],
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

    // Helper function to get node color based on entity type and gender
    const getNodeColor = (d) => {
      const entityType = d.entityType || "person";
      if (
        entityType === "association" ||
        entityType === "institution" ||
        entityType === "company"
      ) {
        return "#e8913a"; // Orange for organizations
      }
      // Person - check gender
      if (d.gender === "F") {
        return "#d87093"; // Pink for women
      }
      return "#5a9db5"; // Blue for men (default)
    };

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 20)
      .attr("fill", (d) => getNodeColor(d))
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

    // Helper function to get hover color based on entity type and gender
    const getNodeHoverColor = (d) => {
      const entityType = d.entityType || "person";
      if (
        entityType === "association" ||
        entityType === "institution" ||
        entityType === "company"
      ) {
        return "#c97a2e"; // Darker orange for organizations
      }
      if (d.gender === "F") {
        return "#c06080"; // Darker pink for women
      }
      return "#4a8da8"; // Darker blue for men (default)
    };

    // Add hover effects
    node
      .on("mouseover", function (event, d) {
        d3.select(this).select("circle").attr("r", 25).attr("fill", getNodeHoverColor(d));
      })
      .on("mouseout", function (event, d) {
        d3.select(this).select("circle").attr("r", 20).attr("fill", getNodeColor(d));
      })
      .on("click", function (event, d) {
        // Only handle click if not dragging
        if (isDragging) {
          isDragging = false;
          return;
        }
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

    // Track if dragging occurred to prevent click after drag
    let isDragging = false;

    // Drag functions
    function dragstarted(event) {
      isDragging = false;
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      isDragging = true;
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
    // One-way relationships have no reciprocal
    member: null,
    employed: null,
  };
  return reciprocals[type] !== undefined ? reciprocals[type] : "other";
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
      // Relationship was removed, remove reciprocal (if bidirectional)
      const reciprocalType = getReciprocalRelationType(oldRel.type);
      if (reciprocalType !== null) {
        if (!updates[oldRel.personUuid]) updates[oldRel.personUuid] = { add: [], remove: [] };
        updates[oldRel.personUuid].remove.push({
          personUuid: record.uuid,
          personName: `${record.firstname} ${record.lastname}`,
          type: reciprocalType,
        });
      }
    }
  }

  // Process added/existing relationships
  for (const newRel of newRels) {
    const wasExisting = oldRels.find(
      (r) => r.personUuid === newRel.personUuid && r.type === newRel.type,
    );
    if (!wasExisting) {
      // New relationship, add reciprocal (if bidirectional)
      const reciprocalType = getReciprocalRelationType(newRel.type);
      if (reciprocalType !== null) {
        if (!updates[newRel.personUuid]) updates[newRel.personUuid] = { add: [], remove: [] };
        updates[newRel.personUuid].add.push({
          personUuid: record.uuid,
          personName: `${record.firstname} ${record.lastname}`,
          type: reciprocalType,
        });
      }
    }
  }

  // Apply updates to related persons
  for (const [uuid, changes] of Object.entries(updates)) {
    const relatedPerson = await apiGet(uuid);
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
    await apiPut(relatedPerson);
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
  document.getElementById("modal-title").textContent = "New Entity";
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
  const record = await apiGet(uuid);
  if (!record) return;
  editingUUID = uuid;

  const s = loadSettings();

  const entityTypeLabel = ENTITY_TYPES[record.entityType || "person"];

  document.getElementById("modal-title").textContent = `Edit ${entityTypeLabel}`;
  document.getElementById("btn-delete-person").classList.remove("hidden");
  document.getElementById("btn-save-person").style.display = "block";

  populateForm(record);
  document.getElementById("person-modal").classList.remove("hidden");

  const modal = document.getElementById("person-modal");

  modal.querySelectorAll("input, select, textarea").forEach((input) => {
    input.disabled = false;
  });
  modal.querySelectorAll(".btn-secondary, .remove-item").forEach((btn) => {
    btn.disabled = false;
    btn.style.opacity = "1";
  });
}

function clearForm() {
  [
    "entity-type",
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
  set("field-entity-type", r.entityType || "person");
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

  // Update form labels based on entity type
  updateFieldLabelsForEntityType(r.entityType || "person");

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

function updateFieldLabelsForEntityType(entityType) {
  const lastnameLabel = document.querySelector('label[for="field-lastname"]');
  const firstnameLabel = document.querySelector('label[for="field-firstname"]');
  const genderField = document.getElementById("field-gender").parentElement;

  if (entityType === "person") {
    if (lastnameLabel) lastnameLabel.textContent = "Lastname";
    if (firstnameLabel) firstnameLabel.textContent = "Firstname";
    genderField.style.display = "block";
  } else {
    if (lastnameLabel) lastnameLabel.textContent = "Name";
    if (firstnameLabel) firstnameLabel.textContent = "Firstname (optional)";
    genderField.style.display = "none";
  }
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
  const existing = editingUUID ? await apiGet(editingUUID) : null;
  const oldRelationships = existing?.relationships || [];

  const record = {
    uuid: editingUUID || generateUUID(),
    createdAt: existing?.createdAt || ts,
    modifiedAt: ts,
    deletedAt: existing?.deletedAt || null,

    entityType: document.getElementById("field-entity-type").value,
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

  await apiPut(record);
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

  await apiSoftDelete(editingUUID);
  document.getElementById("person-modal").classList.add("hidden");
  notify("Record marked as deleted.", "info");
  await refreshRecords(document.getElementById("search-input").value);
}

// ── Boot ───────────────────────────────────────────────────────────

async function boot() {
  loadSearchHistory();

  // Populate settings UI
  const s = loadSettings();
  document.getElementById("setting-server-url").value = s.serverUrl;

  // Test server connection
  updateServerStatus("connecting");
  const connected = await testServerConnection(s.serverUrl);
  if (connected) {
    updateServerStatus("online");
    try {
      const cfg = await apiRequest("GET", "/api/config");
      if (cfg?.dataDir) serverDataDir = cfg.dataDir;
    } catch { }
  } else {
    updateServerStatus("offline");
    notify(
      `Cannot connect to server at ${s.serverUrl}. Open Settings to change the server URL.`,
      "error",
      8000,
    );
  }

  await refreshRecords();
  attachEventListeners();
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
    this.classList.toggle("active", regexMode);
    updateSearchPlaceholder();
    refreshRecords(searchInput.value);
  });

  // Advanced query toggle
  document.getElementById("btn-toggle-advanced").addEventListener("click", function () {
    advancedMode = !advancedMode;
    this.classList.toggle("active", advancedMode);
    updateSearchPlaceholder();
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

  document.getElementById("stat-card-persons").addEventListener("click", () => {
    searchInput.value = "person";
    searchScopes = ["entityType"];
    updateScopeDisplay();
    refreshRecords("person");
  });

  document.getElementById("stat-card-associations").addEventListener("click", () => {
    searchInput.value = "association";
    searchScopes = ["entityType"];
    updateScopeDisplay();
    refreshRecords("association");
  });

  document.getElementById("stat-card-institutions").addEventListener("click", () => {
    searchInput.value = "institution";
    searchScopes = ["entityType"];
    updateScopeDisplay();
    refreshRecords("institution");
  });

  document.getElementById("stat-card-companies").addEventListener("click", () => {
    searchInput.value = "company";
    searchScopes = ["entityType"];
    updateScopeDisplay();
    refreshRecords("company");
  });

  document.getElementById("stat-card-male").addEventListener("click", () => {
    searchInput.value = "M";
    searchScopes = ["gender"];
    updateScopeDisplay();
    refreshRecords("M");
  });

  document.getElementById("stat-card-female").addEventListener("click", () => {
    searchInput.value = "F";
    searchScopes = ["gender"];
    updateScopeDisplay();
    refreshRecords("F");
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
    document.getElementById("btn-save-graph-png").style.display = "none";
    this.style.background = "var(--ice-blue-dark)";
    this.style.color = "var(--white)";
    document.getElementById("btn-graph-view").style.background = "";
    document.getElementById("btn-graph-view").style.color = "";
  });

  document.getElementById("btn-graph-view").addEventListener("click", function () {
    document.getElementById("relationship-network-content").style.display = "none";
    document.getElementById("relationship-graph-container").style.display = "flex";
    document.getElementById("btn-save-graph-png").style.display = "";
    this.style.background = "var(--ice-blue-dark)";
    this.style.color = "var(--white)";
    document.getElementById("btn-list-view").style.background = "";
    document.getElementById("btn-list-view").style.color = "";

    renderRelationshipGraph();
  });

  // Save graph as PNG
  document.getElementById("btn-save-graph-png").addEventListener("click", () => {
    saveGraphAsPNG();
  });

  // New person
  document.getElementById("btn-new").addEventListener("click", () => {
    openNewModal();
  });

  // Import Excel
  document.getElementById("btn-import").addEventListener("click", () => {
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

    try {
      const result = await importExcel(file);

      // Handle both old format (number) and new format (object)
      if (typeof result === "number") {
        notify(`Imported ${result} records.`, "success");
      } else {
        const { imported, updated, total } = result;
        const message = updated > 0
          ? `Imported ${imported} new record${imported !== 1 ? "s" : ""}, updated ${updated} existing record${updated !== 1 ? "s" : ""}.`
          : `Imported ${total} record${total !== 1 ? "s" : ""}.`;
        notify(message, "success");
      }

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


  // Settings
  document.getElementById("btn-settings-toggle").addEventListener("click", () => {
    const panel = document.getElementById("settings-panel");
    panel.style.display = panel.style.display === "block" ? "none" : "block";
  });

  document.getElementById("btn-save-settings").addEventListener("click", () => {
    const s = loadSettings();
    saveSettings({
      serverUrl: document.getElementById("setting-server-url").value.trim() || "http://localhost:8081",
    });
    notify("Settings saved.", "success");
    document.getElementById("settings-panel").style.display = "none";
    // Re-test connection with new URL
    updateServerStatus("connecting");
    testServerConnection(getServerUrl()).then((ok) => {
      updateServerStatus(ok ? "online" : "offline");
      if (ok) refreshRecords(document.getElementById("search-input").value);
      else notify(`Cannot connect to ${getServerUrl()}`, "error");
    });
  });

  document.getElementById("btn-test-connection").addEventListener("click", async () => {
    const url = document.getElementById("setting-server-url").value.trim() || getServerUrl();
    const btn = document.getElementById("btn-test-connection");
    btn.disabled = true;
    btn.textContent = "Testing...";
    const ok = await testServerConnection(url);
    btn.disabled = false;
    btn.textContent = "Test";
    if (ok) {
      notify(`Connected to ${url}`, "success");
    } else {
      notify(`Cannot reach ${url}`, "error");
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
    savePerson();
  });
  document.getElementById("btn-delete-person").addEventListener("click", () => {
    deletePerson();
  });

  // Variation add buttons
  document.getElementById("add-lastname-variation").addEventListener("click", () => {
    document.getElementById("lastname-variations-container").appendChild(makeVariationItem());
  });
  document.getElementById("add-firstname-variation").addEventListener("click", () => {
    document.getElementById("firstname-variations-container").appendChild(makeVariationItem());
  });
  document.getElementById("add-zotero").addEventListener("click", () => {
    document.getElementById("zotero-container").appendChild(makeRefItem());
  });
  document.getElementById("add-archief").addEventListener("click", () => {
    document.getElementById("archief-container").appendChild(makeRefItem());
  });

  document.getElementById("add-relationship").addEventListener("click", () => {
    document.getElementById("relationships-container").appendChild(makeRelationshipItem());
  });

  // Entity type change handler
  document.getElementById("field-entity-type").addEventListener("change", (e) => {
    updateFieldLabelsForEntityType(e.target.value);
  });

  // Simple markdown to HTML converter
  function markdownToHtml(markdown) {
    let html = markdown;

    // Escape HTML entities first
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Code blocks (must be before other replacements)
    html = html.replace(/```([^`]*?)```/gs, function (match, code) {
      return "<pre><code>" + code.trim() + "</code></pre>";
    });

    // Headers with ID generation for anchor links
    html = html.replace(/^### (.*$)/gim, function (match, text) {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return '<h3 id="' + id + '">' + text + "</h3>";
    });
    html = html.replace(/^## (.*$)/gim, function (match, text) {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return '<h2 id="' + id + '">' + text + "</h2>";
    });
    html = html.replace(/^# (.*$)/gim, function (match, text) {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      return '<h1 id="' + id + '">' + text + "</h1>";
    });

    // Tables
    const lines = html.split("\n");
    let inTable = false;
    let tableHtml = "";
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1];

      // Detect table header
      if (line.includes("|") && nextLine && nextLine.match(/^\|?[\s\-:|]+\|?$/)) {
        inTable = true;
        tableHtml = "<table><thead><tr>";
        const headers = line
          .split("|")
          .map((h) => h.trim())
          .filter((h) => h);
        headers.forEach((h) => {
          tableHtml += "<th>" + h + "</th>";
        });
        tableHtml += "</tr></thead><tbody>";
        i++; // Skip separator line
        continue;
      }

      // Table content rows
      if (inTable && line.includes("|")) {
        tableHtml += "<tr>";
        const cells = line
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c);
        cells.forEach((c) => {
          tableHtml += "<td>" + c + "</td>";
        });
        tableHtml += "</tr>";
      } else if (inTable) {
        // End of table
        tableHtml += "</tbody></table>";
        processedLines.push(tableHtml);
        tableHtml = "";
        inTable = false;
        processedLines.push(line);
      } else {
        processedLines.push(line);
      }
    }

    // Close table if still open
    if (inTable) {
      tableHtml += "</tbody></table>";
      processedLines.push(tableHtml);
    }

    html = processedLines.join("\n");

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Links - distinguish between internal anchors and external links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, text, url) {
      // Internal anchor links (start with #)
      if (url.startsWith("#")) {
        return '<a href="' + url + '">' + text + "</a>";
      }
      // External links
      return '<a href="' + url + '" target="_blank">' + text + "</a>";
    });

    // Unordered lists
    const listLines = html.split("\n");
    let inUl = false;
    const finalLines = [];

    for (let i = 0; i < listLines.length; i++) {
      const line = listLines[i];
      if (line.match(/^[\-\*] (.+)$/)) {
        if (!inUl) {
          finalLines.push("<ul>");
          inUl = true;
        }
        finalLines.push(line.replace(/^[\-\*] (.+)$/, "<li>$1</li>"));
      } else if (line.match(/^\d+\. (.+)$/)) {
        if (inUl) {
          finalLines.push("</ul>");
          inUl = false;
        }
        finalLines.push(line.replace(/^\d+\. (.+)$/, "<li>$1</li>"));
      } else {
        if (inUl) {
          finalLines.push("</ul>");
          inUl = false;
        }
        finalLines.push(line);
      }
    }

    if (inUl) {
      finalLines.push("</ul>");
    }

    html = finalLines.join("\n");

    // Horizontal rules
    html = html.replace(/^---$/gim, "<hr>");

    // Paragraphs
    html = html.replace(/\n\n+/g, "</p><p>");
    const paragraphLines = html.split("\n");
    const withParagraphs = [];

    for (const line of paragraphLines) {
      if (
        line &&
        !line.match(/^<(h\d|ul|ol|li|pre|hr|table|\/)/i) &&
        !line.match(/^<\/(h\d|ul|ol|pre|table)>/i)
      ) {
        withParagraphs.push("<p>" + line + "</p>");
      } else {
        withParagraphs.push(line);
      }
    }

    html = withParagraphs.join("\n");

    // Clean up
    html = html.replace(/<p><\/p>/g, "");
    html = html.replace(/<p>(<[hut])/g, "$1");
    html = html.replace(/(<\/[hut][^>]*>)<\/p>/g, "$1");

    return html;
  }

  // Help button
  document.getElementById("btn-help").addEventListener("click", async () => {
    const modal = document.getElementById("help-modal");
    const content = document.getElementById("help-content");

    modal.classList.remove("hidden");

    try {
      const response = await fetch("help.md");
      if (!response.ok) throw new Error("Failed to load help.md");

      const markdown = await response.text();

      // Simple markdown to HTML conversion
      const html = markdownToHtml(markdown);
      content.innerHTML = html;

      // Add click handler for internal anchor links
      content.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          const targetId = this.getAttribute("href").substring(1);
          const targetElement = content.querySelector("#" + targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });
    } catch (err) {
      content.innerHTML = `<p style="color: var(--mid-grey); text-align: center;">Error loading documentation: ${err.message}</p>`;
    }
  });

  document.getElementById("help-close").addEventListener("click", () => {
    document.getElementById("help-modal").classList.add("hidden");
  });

  // License button
  document.getElementById("btn-stop-server").addEventListener("click", async () => {
    const choice = await showDialog(
      "Stop Server",
      "Stop the local data server? The app will stop working until you restart it.",
      [
        { label: "Stop Server", value: "stop", cls: "btn-danger" },
        { label: "Cancel", value: "cancel", cls: "btn-ghost" },
      ],
    );
    if (choice !== "stop") return;
    try {
      await apiRequest("POST", "/api/shutdown");
    } catch {
      // Server may close the connection before the response is fully sent — that's fine.
    }
    updateServerStatus("offline");
  });

  document.getElementById("btn-license").addEventListener("click", async () => {
    const modal = document.getElementById("license-modal");
    const content = document.getElementById("license-content");

    modal.classList.remove("hidden");

    try {
      const response = await fetch("LICENSE.md");
      if (!response.ok) throw new Error("Failed to load LICENSE");

      const text = await response.text();
      content.textContent = text;
    } catch (err) {
      content.innerHTML = `<p style="color: var(--mid-grey); text-align: center;">Error loading license: ${err.message}</p>`;
    }
  });

  document.getElementById("license-close").addEventListener("click", () => {
    document.getElementById("license-modal").classList.add("hidden");
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
