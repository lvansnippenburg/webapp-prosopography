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
let editingUUID = null;
let showDeleted = false;
let sortCol = "lastname";
let sortAsc = true;

// ── Settings ───────────────────────────────────────────────────────

function loadSettings() {
  return {
    token: localStorage.getItem("cb_token") || "",
    owner: localStorage.getItem("cb_owner") || "",
    repo: localStorage.getItem("cb_repo") || "",
    branch: localStorage.getItem("cb_branch") || "main",
    lastSyncPush: localStorage.getItem("cb_lastSyncPush") || null,
    lastSyncPull: localStorage.getItem("cb_lastSyncPull") || null,
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

// ── Codeberg API ───────────────────────────────────────────────────

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
    const q = query.toLowerCase();
    filtered = filtered.filter((r) => {
      const names = [
        r.lastname,
        r.firstname,
        r.patronymic,
        ...(r.lastnameVariations || []),
        ...(r.firstnameVariations || []),
      ].map((s) => (s || "").toLowerCase());
      if (names.some((n) => n.includes(q))) return true;
      const refs = [...(r.zotero || []), ...(r.archief || [])].map((ref) =>
        ref.reference.toLowerCase(),
      );
      if (refs.some((n) => n.includes(q))) return true;
      if (r.notes?.toLowerCase().includes(q)) return true;
      if (r.origin?.toLowerCase().includes(q)) return true;
      if (r.city?.toLowerCase().includes(q)) return true;
      if (r.profession?.toLowerCase().includes(q)) return true;
      // Gender matching: "male" matches "M", "female" matches "F"
      const genderLabel = r.gender === "F" ? "female" : "male";
      if (genderLabel.includes(q)) return true;
      return false;
    });
  }

  // Sort
  filtered.sort((a, b) => {
    const av = (a[sortCol] || "").toString().toLowerCase();
    const bv = (b[sortCol] || "").toString().toLowerCase();
    return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  renderStats(allRecords);
  renderTable(filtered);
}

function renderStats(records) {
  // Only count non-deleted records
  const active = records.filter((r) => !r.deletedAt);
  const total = active.length;
  const male = active.filter((r) => r.gender === "M").length;
  const female = active.filter((r) => r.gender === "F").length;

  // Collect unique origins and their counts
  const originCounts = {};
  active.forEach((r) => {
    const origin = (r.origin || "").trim();
    if (origin) {
      originCounts[origin] = (originCounts[origin] || 0) + 1;
    }
  });

  // Sort origins alphabetically
  const sortedOrigins = Object.keys(originCounts).sort();

  // Update total/gender stats
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-male").textContent = male;
  document.getElementById("stat-female").textContent = female;

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
      refreshRecords(origin);
    });
    originContainer.appendChild(card);
  });
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

    tr.innerHTML = `
            <td>${r.lastname || ""}${lnVars}</td>
            <td>${r.firstname || ""}${fnVars}</td>
            <td>${r.patronymic || ""}</td>
            <td>${genderLabel}</td>
            <td>${cityLabel}</td>
            <td>${r.profession || ""}</td>
            <td>${r.firstseen || ""}</td>
            <td>${r.lastseen || ""}</td>
            <td>${zoteroCount ? `<span class="tag">${zoteroCount} ref${zoteroCount > 1 ? "s" : ""}</span>` : ""}</td>
            <td>${archiefCount ? `<span class="tag">${archiefCount} ref${archiefCount > 1 ? "s" : ""}</span>` : ""}</td>
            <td>
                <button class="btn-ghost btn-small btn-edit" data-uuid="${r.uuid}">Edit</button>
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

function openNewModal() {
  editingUUID = null;
  document.getElementById("modal-title").textContent = "New Person";
  document.getElementById("btn-delete-person").classList.add("hidden");
  clearForm();
  document.getElementById("person-modal").classList.remove("hidden");
}

async function openEditModal(uuid) {
  const record = await idbGet(uuid);
  if (!record) return;
  editingUUID = uuid;
  document.getElementById("modal-title").textContent = "Edit Person";
  document.getElementById("btn-delete-person").classList.remove("hidden");
  populateForm(record);
  document.getElementById("person-modal").classList.remove("hidden");
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
  set("field-lasting", r.lasting);
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
    lasting: document.getElementById("field-lasting").value.trim(),
    mocosince: document.getElementById("field-mocosince").value.trim(),
    religion: document.getElementById("field-religion").value.trim(),
    yob: document.getElementById("field-yob").value.trim(),
    bornin: document.getElementById("field-bornin").value.trim(),
    yod: document.getElementById("field-yod").value.trim(),
    diedin: document.getElementById("field-diedin").value.trim(),
    notes: document.getElementById("field-notes").value.trim(),
    zotero: collectRefs("zotero-container"),
    archief: collectRefs("archief-container"),
  };

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

  // Populate settings UI
  const s = loadSettings();
  document.getElementById("setting-token").value = s.token;
  document.getElementById("setting-owner").value = s.owner;
  document.getElementById("setting-repo").value = s.repo;
  document.getElementById("setting-branch").value = s.branch;
  updateSyncTimestamps();

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

  await refreshRecords();
  attachEventListeners();

  // Warn before closing
  window.addEventListener("beforeunload", (e) => {
    e.preventDefault();
    e.returnValue = "Push changes to Codeberg before leaving?";
  });
}

// ── Event Listeners ────────────────────────────────────────────────

function attachEventListeners() {
  // Search
  let searchDebounce;
  document.getElementById("search-input").addEventListener("input", (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => refreshRecords(e.target.value), 280);
  });

  // Stat card filters
  document.getElementById("stat-card-total").addEventListener("click", () => {
    const searchInput = document.getElementById("search-input");
    searchInput.value = "";
    refreshRecords("");
  });

  document.getElementById("stat-card-male").addEventListener("click", () => {
    const searchInput = document.getElementById("search-input");
    searchInput.value = "Male";
    refreshRecords("Male");
  });

  document.getElementById("stat-card-female").addEventListener("click", () => {
    const searchInput = document.getElementById("search-input");
    searchInput.value = "Female";
    refreshRecords("Female");
  });

  // New person
  document.getElementById("btn-new").addEventListener("click", openNewModal);

  // Import Excel
  document.getElementById("btn-import").addEventListener("click", () => {
    document.getElementById("file-input").click();
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
    const lastPull = s.lastSyncPull ? new Date(s.lastSyncPull).toLocaleString() : "Never";
    const message = s.lastSyncPull
      ? `Quick sync: only pull records changed since ${lastPull}\n\nOr do a full sync to check all records?`
      : "No previous sync found. A full sync will be performed.";

    const choice = await showDialog("Pull from Codeberg", message, [
      { label: "Quick Sync", cls: "btn-primary", value: "quick" },
      { label: "Full Sync", cls: "btn-secondary", value: "full" },
      { label: "Cancel", cls: "btn-ghost", value: false },
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
    saveSettings({
      token: document.getElementById("setting-token").value.trim(),
      owner: document.getElementById("setting-owner").value.trim(),
      repo: document.getElementById("setting-repo").value.trim(),
      branch: document.getElementById("setting-branch").value.trim() || "main",
    });
    notify("Settings saved.", "success");
    document.getElementById("settings-panel").style.display = "none";
  });

  // Modal controls
  document.getElementById("modal-close-btn").addEventListener("click", () => {
    document.getElementById("person-modal").classList.add("hidden");
  });
  document.getElementById("btn-cancel-modal").addEventListener("click", () => {
    document.getElementById("person-modal").classList.add("hidden");
  });
  document.getElementById("btn-save-person").addEventListener("click", savePerson);
  document.getElementById("btn-delete-person").addEventListener("click", deletePerson);

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
