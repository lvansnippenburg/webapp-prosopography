"use strict";

// ── Modal / Form ───────────────────────────────────────────────────

function makeVariationItem(value = "") {
  const div = document.createElement("div");
  div.className = "array-item";
  div.innerHTML = `
        <input type="text" class="variation-input" value="${escapeHtml(value)}" placeholder="Variation">
        <button class="btn-danger btn-small remove-item">✕</button>
    `;
  div.querySelector(".remove-item").addEventListener("click", () => div.remove());
  return div;
}

// Detect and resolve URLs in reference text.
// Supports: https://, zotero://, and local PDF paths.
function resolveRefLink(value) {
  if (!value) return null;
  if (value.startsWith("https://")) return { url: value };
  if (value.startsWith("zotero://")) return { url: value, isZotero: true };
  if (/^[^/]+\/[^/]+\/[^/]+\/[^/]+\.pdf$/i.test(value)) {
    const filePath = `${value}`;
    return { url: `${location.protocol}//${location.hostname}:8080/?file=${encodeURIComponent(filePath)}` };
  }
  return null;
}

// Extract the first zotero:// URL from a text field (remarks might contain surrounding text).
function extractZoteroUrl(text) {
  if (!text) return null;
  const match = text.match(/zotero:\/\/[^\s]+/);
  return match ? match[0] : null;
}

function makeRefItem(ref = {}) {
  const div = document.createElement("div");
  div.className = "array-item";
  div.innerHTML = `
        <div class="array-item-fields">
            <input type="text" class="ref-reference" value="${escapeHtml(ref.reference)}" placeholder="Reference">
            <input type="text" class="ref-year"      value="${escapeHtml(ref.year)}" placeholder="Year (optional)">
            <input type="text" class="ref-remarks"   value="${escapeHtml(ref.remarks)}" placeholder="Remarks (optional)">
        </div>
        <button class="btn-small ref-open-link" title="Open reference" style="display:none;align-self:flex-start;padding:4px 7px;line-height:1;">&#8599;</button>
        <button class="btn-danger btn-small remove-item" style="align-self:flex-start;">✕</button>
    `;
  const refInput = div.querySelector(".ref-reference");
  const remarksInput = div.querySelector(".ref-remarks");
  const openBtn = div.querySelector(".ref-open-link");

  function updateOpenBtn() {
    // Try reference field first, then remarks (for zotero:// URLs).
    let link = resolveRefLink(refInput.value.trim());
    if (!link) {
      const zoteroUrl = extractZoteroUrl(remarksInput.value.trim());
      if (zoteroUrl) link = resolveRefLink(zoteroUrl);
    }
    openBtn.style.display = link ? "" : "none";
    if (link) {
      openBtn.title = link.isZotero ? "Open in Zotero" : "Open reference";
      openBtn.onclick = () => window.open(link.url, "_blank");
    }
  }

  refInput.addEventListener("input", updateOpenBtn);
  remarksInput.addEventListener("input", updateOpenBtn);
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
          <div style="font-weight:600;">${entityIcon}${escapeHtml(r.firstname)} ${escapeHtml(r.lastname)}${escapeHtml(entityTypeLabel)}</div>
          <div style="font-size:11px;color:var(--mid-grey);">${escapeHtml(r.patronymic)} ${r.yob ? `(${escapeHtml(r.yob)})` : ""} ${escapeHtml(r.origin)}</div>
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
            <input type="text" class="rel-person-name" value="${escapeHtml(rel.personName)}" placeholder="Click to select person" readonly style="cursor:pointer;background:var(--ice-blue);">
            <input type="hidden" class="rel-person-uuid" value="${escapeHtml(rel.personUuid)}">
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
  const content = document.getElementById("relationship-network-content");
  const legendItems = document.getElementById("legend-items");

  // Initialize active relationship types if empty (default: all active)
  if (activeRelationshipTypes.size === 0) {
    const allRelTypes = [
      ...RELATIONSHIP_GROUPS.family,
      ...RELATIONSHIP_GROUPS.organizational,
      ...RELATIONSHIP_GROUPS.other,
    ];
    // Hide "member" relationships by default.
    allRelTypes.forEach((type) => { if (type !== "member") activeRelationshipTypes.add(type); });
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
  filterHint.textContent = "click to filter";
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
      btnLegendFilter.classList.toggle("active", open);
      sidebar.classList.toggle("legend-open", open);
    });
  }

  // Network search input for graph view
  const networkSearchInput = document.getElementById("network-search-input");
  if (networkSearchInput && !networkSearchInput._hasSearchListener) {
    networkSearchInput._hasSearchListener = true;
    let searchDebounce;
    networkSearchInput.addEventListener("input", (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        applyNetworkSearchHighlight(e.target.value);
      }, 200);
    });
    // Clear highlight on blur, re-apply on focus if text exists
    networkSearchInput.addEventListener("focus", () => applyNetworkSearchHighlight(networkSearchInput.value));
    networkSearchInput.addEventListener("blur", () => applyNetworkSearchHighlight(""));
  }

  // Layout toggle button
  const viewBtns = document.querySelector(".network-view-btns");
  if (viewBtns && !document.getElementById("btn-layout-toggle")) {
    const btn = document.createElement("button");
    btn.id = "btn-layout-toggle";
    btn.className = "btn-ghost btn-small network-icon-btn";
    btn.title = "Toggle Layout (Force/Tree)";
    btn.innerHTML = "&#x2146;"; // Symbol for hierarchy/mapping
    btn.style.display = "none"; // Hidden by default, shown when graph view is active
    btn.onclick = () => {
      graphLayoutMode = graphLayoutMode === "force" ? "tree" : "force";
      renderRelationshipGraph();
    };
    viewBtns.appendChild(btn);
  }

  // Set initial active state for view buttons
  document.getElementById("btn-list-view").classList.add("active");
  document.getElementById("btn-graph-view").classList.remove("active");

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
          badgesHTML += `<div class="network-rel-badge" style="background: ${color}">${escapeHtml(type)}: ${escapeHtml(name)}</div>`;
        });
      });

      card.innerHTML = `
        <div class="network-person-name">${escapeHtml(person.firstname)} ${escapeHtml(person.lastname)}</div>
        <div class="network-person-details">
          ${escapeHtml(person.patronymic)} ${person.yob ? `(${escapeHtml(person.yob)})` : ""} ${escapeHtml(person.origin)} ${escapeHtml(person.city)}
        </div>
        <div class="network-relationships">
          ${badgesHTML}
        </div>
      `;

      // Click to open person
      card.addEventListener("click", async () => {
        await openEditModal(person.uuid);
      });

      content.appendChild(card);
    });
  }
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

// See https://d3js.org/getting-started
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

    // Create a lookup for highlighting neighbors
    const linkedByIndex = {};
    links.forEach(d => {
      linkedByIndex[`${d.source},${d.target}`] = 1;
    });
    function isConnected(a, b) {
      return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
    }

    // Compute depths for hierarchical layout
    const depths = {};
    nodes.forEach(n => depths[n.id] = 0);

    // Simple multi-pass depth calculation for family hierarchy
    // Parents (Father/Mother) are considered level 0, children level 1, etc.
    for (let i = 0; i < 5; i++) { // Max 5 generations deep for layout
      links.forEach(l => {
        const sId = typeof l.source === 'string' ? l.source : l.source.id;
        const tId = typeof l.target === 'string' ? l.target : l.target.id;
        const relType = l.type;

        if (relType === 'child' || relType === 'son' || relType === 'daughter') {
          depths[tId] = Math.max(depths[tId], depths[sId] + 1);
        } else if (relType === 'father' || relType === 'mother') {
          depths[sId] = Math.max(depths[sId], depths[tId] + 1);
        }
      });
    }

    // Update toggle button appearance
    const layoutBtn = document.getElementById("btn-layout-toggle");
    if (layoutBtn) {
      layoutBtn.innerHTML = graphLayoutMode === "force" ? "&#x2146;" : "&#x2608;";
      layoutBtn.classList.toggle("active", graphLayoutMode === "tree");
    }

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => {
            const isFamily = [...RELATIONSHIP_GROUPS.family, "child", "sibling"].includes(d.type);
            return isFamily ? 80 : 180;
          }),
      )
      .force("charge", d3.forceManyBody().strength(graphLayoutMode === "tree" ? -500 : -300))
      .force("collision", d3.forceCollide().radius(50));

    // Apply mode-specific forces
    if (graphLayoutMode === "tree") {
      simulation
        .force("y", d3.forceY(d => (depths[d.id] * 150) + 100).strength(1))
        .force("x", d3.forceX(width / 2).strength(0.1))
        .force("center", null);
    } else {
      simulation
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", null)
        .force("y", null);
    }

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
    networkGraphLinkSelection = link; // Store for external access

    // Create nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "graph-node") // Add a class for easier selection
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
    networkGraphNodesSelection = node; // Store for external access

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
        d3.select(this).select("circle").transition().duration(200).attr("r", 25).attr("fill", getNodeHoverColor(d));

        // Dim unrelated elements
        node.transition().duration(200).style("opacity", o => isConnected(d, o) ? 1 : 0.1);
        link.transition().duration(200).style("opacity", o => (o.source.id === d.id || o.target.id === d.id) ? 1 : 0.1);
      })
      .on("mouseout", function (event, d) {
        d3.select(this).select("circle").transition().duration(200).attr("r", 20).attr("fill", getNodeColor(d));

        // Reset opacity
        node.transition().duration(200).style("opacity", 1);
        link.transition().duration(200).style("opacity", 0.6);
      })
      .on("click", function (event, d) {
        // Only handle click if not dragging
        if (isDragging) {
          isDragging = false;
          return;
        }
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

    // Apply initial search highlight if there's a query
    const networkSearchInput = document.getElementById("network-search-input");
    if (networkSearchInput && networkSearchInput.value) {
      applyNetworkSearchHighlight(networkSearchInput.value);
    }
  });
}

function applyNetworkSearchHighlight(query) {
  const q = query.toLowerCase().trim();
  const networkSearchInput = document.getElementById("network-search-input");

  if (!networkGraphNodesSelection || !networkGraphLinkSelection) return;

  if (!q) {
    // Reset all opacities if query is empty
    networkGraphNodesSelection.transition().duration(200).style("opacity", 1);
    networkGraphLinkSelection.transition().duration(200).style("opacity", 0.6);
    networkGraphNodesSelection.selectAll("circle").transition().duration(200).attr("r", 20);
    networkSearchInput.style.borderColor = "var(--light-grey)";
    networkSearchInput.style.boxShadow = "none";
    return;
  }

  networkSearchInput.style.borderColor = "var(--ice-blue-dark)";
  networkSearchInput.style.boxShadow = "0 0 0 2px var(--ice-blue)";

  // Dim all elements first
  networkGraphNodesSelection.transition().duration(200).style("opacity", 0.1);
  networkGraphLinkSelection.transition().duration(200).style("opacity", 0.1);

  // Highlight matching nodes and their direct neighbors
  networkGraphNodesSelection.each(function (d) {
    const nameMatch = d.name.toLowerCase().includes(q);
    const detailsMatch = d.details.toLowerCase().includes(q);
    if (nameMatch || detailsMatch) {
      d3.select(this).transition().duration(200).style("opacity", 1);
      networkGraphLinkSelection.filter(l => l.source.id === d.id || l.target.id === d.id)
        .transition().duration(200).style("opacity", 1);
      // Optionally make the matching node slightly larger
      d3.select(this).select("circle").transition().duration(200).attr("r", 25);
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
        <div class="relationship-chip" data-uuid="${escapeHtml(rel.personUuid)}" style="cursor:pointer;">
          <span class="rel-type-badge">${escapeHtml(type)}</span>
          <span class="rel-person-name">${escapeHtml(rel.personName)}</span>
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
  await Promise.all([
    populateFieldSuggestions("city"),
    populateFieldSuggestions("profession"),
    populateFieldSuggestions("origin"),
    populateFieldSuggestions("religion"),
    populateFieldSuggestions("bornin"),
    populateFieldSuggestions("diedin"),
  ]);

  editingUUID = null;
  clearForm();
  // Set default values after clearing.
  document.getElementById("field-entity-type").value = "person";
  document.getElementById("field-gender").value = "M";
  document.getElementById("modal-title").textContent = "New Entity";
  document.getElementById("btn-delete-person").classList.add("hidden");
  document.getElementById("btn-history-person").classList.add("hidden");
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

async function populateFieldSuggestions(fieldName) {
  const datalistId = `${fieldName}-suggestions`;
  const datalist = document.getElementById(datalistId);
  if (!datalist) return;

  // Fetch all records and collect unique values for the given field.
  const records = await apiGetAll().catch(() => []);
  const values = new Set();
  records.forEach((r) => {
    const val = r[fieldName];
    if (val && String(val).trim()) {
      const trimmed = String(val).trim();
      // Add the whole value
      values.add(trimmed);
      // For place fields (city, bornin, diedin) and origin, also add individual segments
      if (["city", "bornin", "diedin", "origin"].includes(fieldName)) {
        trimmed.split(/[/;,]/).forEach((seg) => {
          const segTrimmed = seg.trim();
          if (segTrimmed) values.add(segTrimmed);
        });
      }
    }
  });

  // Sort and populate the datalist.
  const sorted = Array.from(values).sort();
  datalist.innerHTML = sorted.map((val) => `<option value="${escapeHtml(val)}"></option>`).join("");
}

async function openEditModal(uuid) {
  await Promise.all([
    populateFieldSuggestions("city"),
    populateFieldSuggestions("profession"),
    populateFieldSuggestions("origin"),
    populateFieldSuggestions("religion"),
    populateFieldSuggestions("bornin"),
    populateFieldSuggestions("diedin"),
  ]);

  const record = await apiGet(uuid);
  if (!record) return;
  editingUUID = uuid;

  const s = loadSettings();

  const entityTypeLabel = ENTITY_TYPES[record.entityType || "person"];

  document.getElementById("modal-title").textContent = `Edit ${entityTypeLabel}`;
  document.getElementById("btn-delete-person").classList.remove("hidden");
  document.getElementById("btn-history-person").classList.remove("hidden");
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

// Format a backup timestamp (UTC "YYYYMMDDThhmmss…") into a readable local date.
function formatStamp(stamp) {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/.exec(stamp || "");
  if (!m) return stamp || "";
  const [, y, mo, d, h, mi, s] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)).toLocaleString();
}

// Show the saved versions of a record and let the user restore one.
async function showVersionHistory(uuid) {
  if (!uuid) return;
  const modal = document.getElementById("version-history-modal");
  const results = document.getElementById("version-history-results");
  results.innerHTML = '<p style="color:var(--mid-grey);">Loading…</p>';
  modal.classList.remove("hidden");

  let versions;
  try {
    versions = await apiListVersions(uuid);
  } catch (err) {
    results.innerHTML = `<p style="color:var(--mid-grey);">Error loading versions: ${escapeHtml(err.message)}</p>`;
    return;
  }

  if (!versions || !versions.length) {
    results.innerHTML = '<p style="color:var(--mid-grey);">No previous versions saved yet.</p>';
    return;
  }

  results.innerHTML = "";
  versions.forEach((v) => {
    const item = document.createElement("div");
    item.className = "version-item";
    const deletedBadge = v.deleted ? '<span class="tag">deleted</span>' : "";
    item.innerHTML = `
      <div class="version-info">
        <div class="version-when">${escapeHtml(formatStamp(v.timestamp))}</div>
        <div class="version-name">${escapeHtml(v.name) || "—"} ${deletedBadge}</div>
      </div>
      <button class="btn-secondary btn-small version-restore">Restore</button>
    `;
    item.querySelector(".version-restore").addEventListener("click", async () => {
      if (!confirm(
        `Restore the version from ${formatStamp(v.timestamp)}?\n\n` +
        "The current version is saved as a new backup first, so this can be undone.",
      )) return;
      try {
        await apiRestoreVersion(uuid, v.timestamp);
      } catch (err) {
        notify("Restore failed: " + err.message, "error");
        return;
      }
      modal.classList.add("hidden");
      notify("Version restored.", "success");
      await openEditModal(uuid); // reload the form with the restored data
      await refreshRecords(document.getElementById("search-input").value);
    });
    results.appendChild(item);
  });
}

