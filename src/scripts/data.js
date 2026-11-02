"use strict";

// Maps the pre-simplification relationship-type vocabulary to the current one,
// so Excel files exported before that migration still import cleanly.
const LEGACY_RELATIONSHIP_TYPE_MAP = {
  father: "child",
  mother: "child",
  son: "child",
  daughter: "child",
  husband: "married",
  wife: "married",
};

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

// List a record's backed-up versions (newest first); each: {timestamp, modifiedAt, deleted, name}.
async function apiListVersions(uuid) {
  return apiRequest("GET", `/api/records/${uuid}/versions`);
}

// Restore a record to a backed-up version. Returns the restored record.
async function apiRestoreVersion(uuid, timestamp) {
  return apiRequest("POST", `/api/records/${uuid}/restore`, { timestamp });
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

// ── Full-fidelity Excel columns (Residences, Relationships, Zotero, Archief) ──
//
// exportToExcel() writes these as JSON so every field (residence notes/
// reference, relationship personUuid/comment, reference year/remarks) survives
// an export → edit-unrelated-cells → re-import round trip exactly, not just the
// handful of sub-fields the old semicolon-joined summary text could carry.
// importExcel() tries JSON.parse() first; a file exported before this change
// (or a cell a person typed by hand) won't be valid JSON, so each parser below
// falls back to the old delimited-text reading for backward compatibility.

// Shared JSON-then-legacy-fallback plumbing: returns the parsed array if `raw`
// is valid JSON for an array, otherwise null (caller supplies the fallback).
function parseJsonArrayColumn(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parseResidenceColumn(raw, legacyCity, legacyFirstseen, legacyLastseen) {
  const parsed = parseJsonArrayColumn(raw);
  if (parsed) {
    return parsed.map((res) => ({
      city: String(res?.city || "").trim(),
      firstseen: String(res?.firstseen || "").trim(),
      lastseen: String(res?.lastseen || "").trim(),
      notes: String(res?.notes || "").trim(),
      reference: String(res?.reference || "").trim(),
    }));
  }
  // Legacy export (pre-residence-array, or pre-JSON-column) — one entry built
  // from the plain City/First Seen/Last Seen columns, same as before.
  return [
    {
      city: String(legacyCity || "").trim() || "Livorno",
      firstseen: String(legacyFirstseen || "").trim(),
      lastseen: String(legacyLastseen || "").trim(),
      notes: "",
      reference: "",
    },
  ];
}

function parseRelationshipsColumn(raw) {
  const parsed = parseJsonArrayColumn(raw);
  if (parsed) {
    return parsed
      .map((rel) => ({
        type: LEGACY_RELATIONSHIP_TYPE_MAP[rel?.type] || String(rel?.type || "other").trim(),
        personUuid: String(rel?.personUuid || "").trim(),
        personName: String(rel?.personName || "").trim(),
        comment: String(rel?.comment || "").trim(),
      }))
      .filter((rel) => rel.personName || rel.personUuid);
  }
  // Legacy "type:personName; type:personName" text — personUuid and comment
  // were never captured in that format, so personUuid is left blank pending
  // manual resolution (same gap this format has always had).
  return raw
    ? String(raw)
        .split(";")
        .map((r) => {
          const parts = r.trim().split(":");
          if (parts.length !== 2) return null;
          const rawType = parts[0].trim();
          return {
            type: LEGACY_RELATIONSHIP_TYPE_MAP[rawType] || rawType,
            personName: parts[1].trim(),
            personUuid: "",
          };
        })
        .filter(Boolean)
    : [];
}

// Shared by the Zotero and Archief columns — identical {reference, year, remarks} shape.
function parseReferencesColumn(raw) {
  const parsed = parseJsonArrayColumn(raw);
  if (parsed) {
    return parsed
      .map((ref) => ({
        reference: String(ref?.reference || "").trim(),
        year: String(ref?.year || "").trim(),
        remarks: String(ref?.remarks || "").trim(),
      }))
      .filter((ref) => ref.reference);
  }
  // Legacy "ref1; ref2" text — year/remarks were never captured in that format.
  return raw
    ? String(raw)
        .split(";")
        .map((ref) => ({ reference: ref.trim(), year: "", remarks: "" }))
        .filter((r) => r.reference)
    : [];
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

            // Relationships/Zotero/Archief/Residences are JSON in files exported
            // by this app (full fidelity: personUuid, comment, year, remarks,
            // residence notes/reference, every residence — not just the first).
            // parseRelationshipsColumn/parseReferencesColumn/parseResidenceColumn
            // (data.js, "Parsing helpers") fall back to the old delimited-text
            // reading when the cell isn't valid JSON, for files exported before
            // this change (or hand-typed by someone following the old format).
            const relationships = parseRelationshipsColumn(row.Relationships);
            const zotero = parseReferencesColumn(row.Zotero);
            const archief = parseReferencesColumn(row.Archief);
            const residence = parseResidenceColumn(
              row.Residences,
              row.City,
              row["First Seen"],
              row["Last Seen"],
            );

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
              residence: residence,
              profession: String(row.Profession || "").trim(),
              origin: String(row.Origin || "").trim(),
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

              // Col 4 — City, Col 7 — First seen, Col 8 — Last seen: one residence entry
              residence: [
                {
                  city: String(row[4] || "").trim() || "Livorno",
                  firstseen: String(row[7] || "").trim(),
                  lastseen: String(row[8] || "").trim(),
                  notes: "",
                  reference: "",
                },
              ],

              // Col 5 — Profession
              profession: String(row[5] || "").trim(),

              // Col 6 — Origin
              origin: String(row[6] || "").trim(),

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
      // City/First Seen/Last Seen are a read-only preview of the primary
      // (first) residence, handy for a glance or for sorting in Excel — they
      // are NOT read back on import. "Residences" is the authoritative,
      // full-fidelity column (JSON: every residence, including notes/reference).
      City: r.residence?.[0]?.city || "",
      Profession: r.profession || "",
      Origin: r.origin || "",
      "First Seen": r.residence?.[0]?.firstseen || "",
      "Last Seen": r.residence?.[0]?.lastseen || "",
      // JSON, not a semicolon summary — see parseResidenceColumn()/
      // parseRelationshipsColumn()/parseReferencesColumn() in importExcel()
      // for why: a human-readable "City (1650–1680)" string can't carry notes,
      // reference, personUuid, comment, or year/remarks, and re-importing it
      // would silently drop them. These columns aren't meant for hand-editing
      // in Excel — use the app's own editor for relationships/residences/refs.
      Residences: JSON.stringify(r.residence || []),
      "Moco Since": r.mocosince || "",
      Religion: r.religion || "",
      "Year of Birth": r.yob || "",
      "Born In": r.bornin || "",
      "Year of Death": r.yod || "",
      "Died In": r.diedin || "",
      Notes: r.notes || "",
      Relationships: JSON.stringify(r.relationships || []),
      Zotero: JSON.stringify(r.zotero || []),
      Archief: JSON.stringify(r.archief || []),
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
    { wch: 50 }, // Residences (JSON)
    { wch: 12 }, // Moco Since
    { wch: 15 }, // Religion
    { wch: 12 }, // Year of Birth
    { wch: 15 }, // Born In
    { wch: 12 }, // Year of Death
    { wch: 15 }, // Died In
    { wch: 30 }, // Notes
    { wch: 50 }, // Relationships (JSON)
    { wch: 40 }, // Zotero (JSON)
    { wch: 40 }, // Archief (JSON)
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

// Node fill color used by the in-app D3 graph (renderRelationshipGraph's
// getNodeColor in modal.js) — mirrored here so the Gephi import looks the
// same at a glance without the user having to re-color it themselves.
function gephiNodeColor(r) {
  const entityType = r.entityType || "person";
  if (entityType === "association" || entityType === "institution" || entityType === "company") {
    return { r: 232, g: 145, b: 58 }; // #e8913a
  }
  if (r.gender === "F") {
    return { r: 216, g: 112, b: 147 }; // #d87093
  }
  return { r: 90, g: 157, b: 181 }; // #5a9db5
}

// Export the current results as a GEXF 1.3 network file for Gephi (gephi.org).
// Nodes carry as many record fields as GEXF's typed-attribute model supports;
// edges come from each record's relationships. Relationship types that are
// inherently symmetric (getReciprocalRelationType(type) === type — married,
// brother, sister, associate, business, friend, neighbour, other) are stored
// on both records today, so they're deduped to one "undirected" edge per
// pair+type; one-way types (child, member, employed) become single "directed"
// edges. Only edges whose other endpoint is also part of this export are
// included, since a GEXF edge must reference a node present in the file.
function exportToGephi() {
  if (!filteredRecords.length) {
    notify("No records to export.", "warning");
    return;
  }

  const exportedUuids = new Set(filteredRecords.map((r) => r.uuid));

  const NODE_ATTRS = [
    ["entityType", "string"],
    ["gender", "string"],
    ["patronymic", "string"],
    ["city", "string"], // every residence's city, joined ("City1, City2")
    ["residences", "string"], // full residence history, city (first–last)
    ["profession", "string"],
    ["origin", "string"],
    ["religion", "string"],
    ["yob", "string"],
    ["yod", "string"],
    ["bornin", "string"],
    ["diedin", "string"],
    ["firstseen", "string"], // overall attested span across all residences
    ["lastseen", "string"],
    ["mocosince", "string"],
    ["lastnameVariations", "string"],
    ["firstnameVariations", "string"],
    ["notes", "string"],
    ["zotero", "string"],
    ["archief", "string"],
    ["createdAt", "string"],
    ["modifiedAt", "string"],
    ["relationshipCount", "integer"],
  ];

  const attrDefs = NODE_ATTRS.map(
    ([title, type], i) => `      <attribute id="${i}" title="${escapeHtml(title)}" type="${type}"/>`,
  ).join("\n");

  const nodeXml = filteredRecords
    .map((r) => {
      const label = `${r.firstname || ""} ${r.lastname || ""}`.trim();
      const values = {
        entityType: r.entityType || "person",
        gender: r.gender || "",
        patronymic: r.patronymic || "",
        city: residenceCitiesLabel(r),
        residences: (r.residence || [])
          .map((res) => {
            const span = [res.firstseen, res.lastseen].filter(Boolean).join("–");
            return span ? `${res.city} (${span})` : res.city;
          })
          .join("; "),
        profession: r.profession || "",
        origin: r.origin || "",
        religion: r.religion || "",
        yob: r.yob || "",
        yod: r.yod || "",
        bornin: r.bornin || "",
        diedin: r.diedin || "",
        // recordYearSpan is defined in records.js (loads after data.js) — safe
        // here for the same reason as getReciprocalRelationType below: this
        // whole function only runs at click-time, once every script has loaded.
        firstseen: recordYearSpan(r).first ?? "",
        lastseen: recordYearSpan(r).last ?? "",
        mocosince: r.mocosince || "",
        lastnameVariations: (r.lastnameVariations || []).join("; "),
        firstnameVariations: (r.firstnameVariations || []).join("; "),
        notes: r.notes || "",
        zotero: (r.zotero || []).map((z) => z.reference).join("; "),
        archief: (r.archief || []).map((a) => a.reference).join("; "),
        createdAt: r.createdAt || "",
        modifiedAt: r.modifiedAt || "",
        relationshipCount: (r.relationships || []).length,
      };

      const attvalues = NODE_ATTRS.map(([title], i) => {
        const val = values[title];
        if (val === "" || val === undefined || val === null) return "";
        return `          <attvalue for="${i}" value="${escapeHtml(val)}"/>`;
      })
        .filter(Boolean)
        .join("\n");

      const color = gephiNodeColor(r);

      return (
        `      <node id="${escapeHtml(r.uuid)}" label="${escapeHtml(label)}">\n` +
        (attvalues ? `        <attvalues>\n${attvalues}\n        </attvalues>\n` : "") +
        `        <viz:color r="${color.r}" g="${color.g}" b="${color.b}"/>\n` +
        `      </node>`
      );
    })
    .join("\n");

  const seenUndirected = new Set();
  let edgeId = 0;
  const edgeLines = [];
  filteredRecords.forEach((r) => {
    (r.relationships || []).forEach((rel) => {
      if (!rel.personUuid || !exportedUuids.has(rel.personUuid)) return;
      const isUndirected = getReciprocalRelationType(rel.type) === rel.type;
      if (isUndirected) {
        const key = [r.uuid, rel.personUuid].sort().join("|") + "|" + rel.type;
        if (seenUndirected.has(key)) return;
        seenUndirected.add(key);
      }
      edgeLines.push(
        `      <edge id="${edgeId++}" source="${escapeHtml(r.uuid)}" target="${escapeHtml(rel.personUuid)}" ` +
          `label="${escapeHtml(rel.type)}" type="${isUndirected ? "undirected" : "directed"}"/>`,
      );
    });
  });

  const gexf =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<gexf xmlns="http://gexf.net/1.3" version="1.3" xmlns:viz="http://gexf.net/1.3/viz">\n` +
    `  <meta lastmodifieddate="${new Date().toISOString().slice(0, 10)}">\n` +
    `    <creator>Livorno Prosopography</creator>\n` +
    `    <description>Relationship network export for Gephi (gephi.org)</description>\n` +
    `  </meta>\n` +
    `  <graph mode="static" defaultedgetype="directed">\n` +
    `    <attributes class="node">\n${attrDefs}\n    </attributes>\n` +
    `    <nodes>\n${nodeXml}\n    </nodes>\n` +
    `    <edges>\n${edgeLines.join("\n")}\n    </edges>\n` +
    `  </graph>\n` +
    `</gexf>\n`;

  const blob = new Blob([gexf], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  a.download = `livorno_prosopography_${timestamp}.gexf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  notify(
    `Exported ${filteredRecords.length} records and ${edgeLines.length} relationships to Gephi format`,
    "success",
  );
}

