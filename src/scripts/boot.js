"use strict";

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

  // Honour pop-out parameters: carry over the originating window's search
  // filter before the first load so the same entities are shown.
  const urlParams = new URLSearchParams(window.location.search);
  const incomingQuery = urlParams.get("q") || "";
  if (incomingQuery) {
    document.getElementById("search-input").value = incomingQuery;
  }
  const incomingRecordUuid = urlParams.get("record") || "";

  await refreshRecords(incomingQuery);
  attachEventListeners();

  // Deep link: ?record=<uuid> opens that record's edit modal on load, as if
  // the user had clicked it in the table. Written by the "Copy Link" button
  // in the person-modal header (see btn-copy-link wiring below).
  if (incomingRecordUuid) {
    await openEditModal(incomingRecordUuid);
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

  // ── Table ⇄ Graph: two views on the same (filtered) data ───────────
  // The graph view lives inline in #records-graph; switching hides the table
  // and stats and vice-versa. The current data flows to both via filteredRecords.
  // (currentExploreView — the active sub-view — is a global in visualize.js so
  // refreshRecords can re-render it when the filter changes.)

  async function setDataView(view) {
    const graph = view === "graph";
    document.getElementById("records-container").classList.toggle("hidden", graph);
    document.getElementById("stats-pane").classList.toggle("hidden", graph);
    document.getElementById("records-graph").classList.toggle("hidden", !graph);

    const btn = document.getElementById("btn-visualize");
    btn.classList.toggle("active", graph);
    btn.textContent = graph ? "📋 Table" : "🗺 Visualize";
    btn.title = graph ? "Back to the records table" : "Map & timeline of the current results";

    if (graph) {
      await showRelationshipNetwork(); // build list cards + entity count
      selectExploreView(currentExploreView); // show/render the active sub-view
    }
  }

  // The Relationships stat card jumps straight to the network sub-view.
  document.getElementById("stat-card-relationships").addEventListener("click", async () => {
    currentExploreView = "graph";
    await setDataView("graph");
  });

  // Visualize button toggles between the table and the graph view.
  document.getElementById("btn-visualize").addEventListener("click", () => {
    const goingToGraph = document.getElementById("records-graph").classList.contains("hidden");
    setDataView(goingToGraph ? "graph" : "table");
  });

  // Sub-view switcher within the graph view (List / Graph / Map / Timeline).
  // One helper keeps the four sub-views mutually exclusive and shows only the
  // controls each needs (PNG export, in-graph search and layout toggle are
  // graph-only).
  function selectExploreView(view) {
    currentExploreView = view;
    const containers = {
      list: ["relationship-network-content", "block"],
      graph: ["relationship-graph-container", "flex"],
      map: ["map-container", "flex"],
      timeline: ["timeline-container", "flex"],
    };
    for (const [name, [id, disp]] of Object.entries(containers)) {
      document.getElementById(id).style.display = name === view ? disp : "none";
    }
    const graphOnly = view === "graph";
    document.getElementById("btn-save-graph-png").style.display = graphOnly ? "" : "none";
    document.getElementById("network-search-input").style.display = graphOnly ? "block" : "none";
    document.getElementById("btn-layout-toggle").style.display = graphOnly ? "flex" : "none";

    const buttons = { list: "btn-list-view", graph: "btn-graph-view", map: "btn-map-view", timeline: "btn-timeline-view" };
    for (const [name, id] of Object.entries(buttons)) {
      document.getElementById(id).classList.toggle("active", name === view);
    }

    if (view === "graph") renderRelationshipGraph();
    else if (view === "map") renderMapView();
    else if (view === "timeline") renderTimelineView();
  }

  document.getElementById("btn-list-view").addEventListener("click", () => selectExploreView("list"));
  document.getElementById("btn-graph-view").addEventListener("click", () => selectExploreView("graph"));
  document.getElementById("btn-map-view").addEventListener("click", () => selectExploreView("map"));
  document.getElementById("btn-timeline-view").addEventListener("click", () => selectExploreView("timeline"));

  // Re-render the active geo-temporal view when its controls change.
  document.getElementById("map-field-select").addEventListener("change", () => renderMapView());
  document.getElementById("timeline-mode-select").addEventListener("change", () => renderTimelineView());

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

  // Export to Gephi
  document.getElementById("btn-export-gephi").addEventListener("click", () => {
    exportToGephi();
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
  document.getElementById("btn-copy-link").addEventListener("click", async () => {
    if (!editingUUID) return;
    const url = `${window.location.origin}${window.location.pathname}?record=${editingUUID}`;
    try {
      await navigator.clipboard.writeText(url);
      notify("Link copied to clipboard", "success");
    } catch {
      notify("Could not copy link — clipboard access was denied", "error");
    }
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
  document.getElementById("btn-history-person").addEventListener("click", () => {
    showVersionHistory(editingUUID);
  });
  document.getElementById("version-history-close").addEventListener("click", () => {
    document.getElementById("version-history-modal").classList.add("hidden");
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

  // Stop server button
  document.getElementById("server-status").addEventListener("click", async () => {
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
      window.close();
    } catch {
      // Server may close the connection before the response is fully sent — that's fine.
    }
    updateServerStatus("offline");
  });

  // license button
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
