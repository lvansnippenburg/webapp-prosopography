"use strict";

// ── Server API ─────────────────────────────────────────────────────

function getServerUrl() {
  migrateServerUrlKey();
  return (localStorage.getItem(SERVER_URL_KEY) || DEFAULT_SERVER_URL).replace(/\/$/, "");
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
  const labels = { online: "⏻", offline: "🔺", connecting: "◌" };
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

