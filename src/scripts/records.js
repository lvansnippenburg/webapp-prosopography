"use strict";

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
      } catch (e) {
        console.error("Invalid Regex:", e);
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
    const y1 = parseInt(rangeMatch[1], 10);
    const y2 = parseInt(rangeMatch[2], 10);
    const queryStart = Math.min(y1, y2);
    const queryEnd = Math.max(y1, y2);

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
      <span class="stat-label">${escapeHtml(origin)}</span>
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
        <span class="stat-label">${escapeHtml(religion)}</span>
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
      .map((v) => `<span class="tag">${escapeHtml(v)}</span>`)
      .join("");
    const fnVars = (r.firstnameVariations || [])
      .map((v) => `<span class="tag">${escapeHtml(v)}</span>`)
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

    const fullFirstname = [r.firstname || "", r.patronymic || ""]
      .filter(Boolean)
      .map(escapeHtml)
      .join(" ");

    tr.innerHTML = `
            <td>${entityIcon}${cityLabel}</td>
            <td>${escapeHtml(r.lastname)}${lnVars}</td>
            <td>${fullFirstname}${fnVars}</td>
            <td>${escapeHtml(r.profession)}</td>
            <td>${escapeHtml(r.firstseen)}</td>
            <td>${escapeHtml(r.lastseen)}</td>
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

    const details = [r.firstname, r.patronymic].filter(Boolean).map(escapeHtml).join(" ");

    div.innerHTML = `
            <strong>${escapeHtml(r.lastname)}</strong>
            <span class="match-type">(${escapeHtml(matchType)})</span>
            <div class="person-details">
                ${details || "—"}
                ${r.lastnameVariations?.length ? " · vars: " + escapeHtml(r.lastnameVariations.join(", ")) : ""}
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

