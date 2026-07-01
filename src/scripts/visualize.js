"use strict";

// ── Geo-temporal visualizations (Map + Timeline) ───────────────────
//
// Two extra views for the Explore modal. Both read the same working set as the
// relationship graph (the current filteredRecords, else all non-deleted) and
// render with the vendored D3 bundle. Everything is offline: the basemap and
// the place gazetteer are static files under src/.

const ENTITY_COLORS = {
  person: "#4A90E2",
  association: "#16A085",
  institution: "#8E44AD",
  company: "#D35400",
};

// Lazily-loaded, cached offline assets.
let _worldGeo = null;
let _gazetteer = null;

async function loadWorldGeo() {
  if (!_worldGeo) {
    _worldGeo = await fetch("vendor/world-countries.json").then((r) => r.json());
  }
  return _worldGeo;
}

async function loadGazetteer() {
  if (!_gazetteer) {
    const raw = await fetch("data/places.json").then((r) => r.json());
    _gazetteer = {};
    for (const [k, v] of Object.entries(raw)) {
      if (!k.startsWith("_")) _gazetteer[k] = v; // skip "_comment" keys
    }
  }
  return _gazetteer;
}

// Records to visualize — mirrors the selection in showRelationshipNetwork().
async function getActiveRecords() {
  if (filteredRecords.length > 0) return filteredRecords;
  return apiGetAll()
    .then((records) => records.filter((r) => !r.deletedAt))
    .catch(() => []);
}

// The graph sub-view currently shown; set by selectExploreView (boot.js).
let currentExploreView = "list";

// Re-render whichever sub-view is active. Called when the toolbar filter
// changes while the graph view is open, so it tracks the same set as the table.
async function renderActiveExploreView() {
  await showRelationshipNetwork(); // rebuild list cards + entity count
  if (currentExploreView === "graph") renderRelationshipGraph();
  else if (currentExploreView === "map") renderMapView();
  else if (currentExploreView === "timeline") renderTimelineView();
}

// ── Map ────────────────────────────────────────────────────────────

// Normalize a free-text place into a gazetteer key: lowercase, drop
// parentheticals / "?", and keep the first segment when several are listed
// (e.g. "Livorno (Chiesa della Madonna)" → "livorno", "Amsterdam; Florence" → "amsterdam").
function normalizePlaceKey(value) {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\?/g, " ")
    .split(/[;,]/)[0]
    .trim()
    .replace(/\s+/g, " ");
}

function resolvePlace(value) {
  if (!_gazetteer) return null;
  return _gazetteer[normalizePlaceKey(value)] || null;
}

async function renderMapView() {
  const container = document.getElementById("map-container");
  const svgEl = document.getElementById("map-svg");
  const field = document.getElementById("map-field-select").value || "bornin";

  await Promise.all([loadWorldGeo(), loadGazetteer()]);
  const records = await getActiveRecords();

  // Aggregate by resolved place; collect everything else as "unplaced".
  // For compound values (e.g. "Flemish/Dutch"), split and resolve each segment,
  // attributing the record to every place that resolves. If none resolve, the
  // entire value goes to unplaced; if some resolve, unresolved segments are not
  // separately listed (the record is covered by its resolved places).
  const byPlace = new Map(); // label -> { place, records: [] }
  const unplaced = new Map(); // raw value -> count
  let hasOverlaps = false; // true if any record mapped to multiple places
  records.forEach((r) => {
    const val = (r[field] || "").trim();
    if (!val) return;
    // Split on /, ;, or , to handle compound origins (e.g. "Flemish/Dutch").
    const segments = val
      .split(/[/;,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const resolvedPlaces = [];
    segments.forEach((seg) => {
      const place = resolvePlace(seg);
      if (place && !resolvedPlaces.some((p) => p.label === place.label)) {
        resolvedPlaces.push(place);
      }
    });
    if (resolvedPlaces.length > 0) {
      if (resolvedPlaces.length > 1) hasOverlaps = true;
      resolvedPlaces.forEach((place) => {
        if (!byPlace.has(place.label)) byPlace.set(place.label, { place, records: [] });
        byPlace.get(place.label).records.push(r);
      });
    } else {
      // No segments resolved; the entire value is unplaced.
      unplaced.set(val, (unplaced.get(val) || 0) + 1);
    }
  });

  const svg = d3.select(svgEl);
  svg.selectAll("*").remove();
  const width = svgEl.clientWidth || container.clientWidth || 900;
  const height = svgEl.clientHeight || 600;
  svg.attr("viewBox", `0 0 ${width} ${height}`);

  // Projection fit to the placed points, falling back to a Europe view.
  const places = [...byPlace.values()];
  const projection = d3.geoMercator();
  if (places.length) {
    const fc = {
      type: "FeatureCollection",
      features: places.map((d) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [d.place.lon, d.place.lat] },
      })),
    };
    projection.fitExtent(
      [
        [30, 30],
        [width - 30, height - 30],
      ],
      fc,
    );
  } else {
    projection
      .center([8, 47])
      .scale(700)
      .translate([width / 2, height / 2]);
  }
  const path = d3.geoPath(projection);

  // Basemap and dots live in separate groups: the basemap pans/zooms with the
  // transform, while the dot markers keep a constant screen size and only their
  // positions follow the transform (see the zoom handler below).
  const gCountries = svg.append("g").attr("class", "map-countries");
  gCountries
    .selectAll("path")
    .data(_worldGeo.features)
    .join("path")
    .attr("class", "map-country")
    .attr("d", path);

  // One dot per place, area ∝ count.
  const maxCount = d3.max(places, (d) => d.records.length) || 1;
  const rScale = d3.scaleSqrt().domain([1, maxCount]).range([4, 22]);

  const dot = svg
    .append("g")
    .attr("class", "map-dots")
    .selectAll("g.place")
    .data(places)
    .join("g")
    .attr("class", "place")
    .attr("transform", (d) => {
      const xy = projection([d.place.lon, d.place.lat]);
      return `translate(${xy[0]},${xy[1]})`;
    })
    .style("cursor", "pointer")
    .on("click", (event, d) => showPlaceRecords(d));

  dot
    .append("circle")
    .attr("class", (d) => `place-dot${d.place.approx ? " place-dot--approx" : ""}`)
    .attr("r", (d) => rScale(d.records.length));
  dot.append("title").text((d) => {
    let label = `${d.place.label}: ${d.records.length}`;
    if (d.place.approx) label += " (approximate regional centroid)";
    return label;
  }); // .text() is safe
  dot
    .append("text")
    .attr("class", "place-label")
    .attr("text-anchor", "middle")
    .attr("y", (d) => -rScale(d.records.length) - 4)
    .text((d) => d.place.label);

  // Mouse pan (drag) and zoom (wheel). The basemap transforms; the dots keep a
  // constant screen size and just follow the transform's position mapping, so
  // zooming spreads clustered places apart without inflating the markers.
  svg.call(
    d3
      .zoom()
      .scaleExtent([0.5, 20])
      .on("zoom", (event) => {
        const t = event.transform;
        gCountries.attr("transform", t);
        dot.attr("transform", (d) => {
          const p = t.apply(projection([d.place.lon, d.place.lat]));
          return `translate(${p[0]},${p[1]})`;
        });
      }),
  );

  renderUnplacedPanel(unplaced, byPlace.size, hasOverlaps, field);
}

// Side panel: list the records at a clicked place, each opening its record.
function showPlaceRecords({ place, records }) {
  const side = document.getElementById("map-side-content");
  const rows = records
    .map((r) => {
      const name = [r.firstname, r.lastname].filter(Boolean).join(" ") || "(unnamed)";
      return `<li class="map-side-row" data-uuid="${escapeHtml(r.uuid)}">${escapeHtml(name)}</li>`;
    })
    .join("");
  side.innerHTML =
    `<h4>${escapeHtml(place.label)} <span class="muted">(${records.length})</span></h4>` +
    `<ul class="map-side-list">${rows}</ul>`;
  side.querySelectorAll(".map-side-row").forEach((li) => {
    li.addEventListener("click", () => openEditModal(li.dataset.uuid));
  });
}

function renderUnplacedPanel(unplaced, placedCount, hasOverlaps, field) {
  const side = document.getElementById("map-side-content");
  const entries = [...unplaced.entries()].sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, c]) => sum + c, 0);
  if (entries.length === 0) {
    let msg = `<h4>Placed</h4><p class="muted">${placedCount} place${placedCount === 1 ? "" : "s"} mapped. Click a dot to list its people.`;
    if (hasOverlaps && field === "origin") {
      msg += ` Note: combined origins (like Flemish/Dutch) count toward each place, so dot counts may add up to more than the total records.`;
    }
    side.innerHTML = msg + `</p>`;
    return;
  }
  const rows = entries
    .map(([val, c]) => `<li>${escapeHtml(val)} <span class="muted">(${c})</span></li>`)
    .join("");
  let msg =
    `<h4>Unplaced <span class="muted">(${total})</span></h4>` +
    `<p class="muted">Not in the gazetteer (ethnonyms, or add coordinates to ` +
    `<code>data/places.json</code>):`;
  if (hasOverlaps && field === "origin") {
    msg += ` Note: combined origins (like Flemish/Dutch) count toward each place.`;
  }
  msg += `</p>` + `<ul class="map-side-list">${rows}</ul>`;
  side.innerHTML = msg;
}

// ── Timeline ───────────────────────────────────────────────────────

// First 3–4 digit run in a free-text year field, as an integer (or null).
function parseYear(value) {
  const m = String(value ?? "").match(/\d{3,4}/);
  return m ? parseInt(m[0], 10) : null;
}

// A {start, end, mode} span for one record, preferring the chosen mode and
// falling back to the other. "life" = yob→yod, "attest" = firstseen→lastseen.
function recordRange(record, preferred) {
  const modes = preferred === "attest" ? ["attest", "life"] : ["life", "attest"];
  for (const mode of modes) {
    const [a, b] =
      mode === "life"
        ? [parseYear(record.yob), parseYear(record.yod)]
        : [parseYear(record.firstseen), parseYear(record.lastseen)];
    if (a != null || b != null) {
      return { start: a ?? b, end: b ?? a, mode };
    }
  }
  return null;
}

async function renderTimelineView() {
  const svgEl = document.getElementById("timeline-svg");
  const preferred = document.getElementById("timeline-mode-select").value || "life";
  const records = await getActiveRecords();

  // Build {record, start, end}, skipping records with no usable years.
  const items = [];
  let skipped = 0;
  records.forEach((r) => {
    const range = recordRange(r, preferred);
    if (!range) {
      skipped += 1;
      return;
    }
    items.push({ record: r, ...range });
  });
  items.sort((a, b) => a.start - b.start || a.end - b.end);

  document.getElementById("timeline-skipped").textContent =
    `${items.length} shown` + (skipped ? `, ${skipped} without dates` : "");

  const svg = d3.select(svgEl);
  svg.selectAll("*").remove();
  if (items.length === 0) return;

  const margin = { top: 10, right: 20, bottom: 28, left: 20 };
  const width = (svgEl.clientWidth || 900) - margin.left - margin.right;
  const minYear = d3.min(items, (d) => d.start);
  const maxYear = d3.max(items, (d) => d.end);
  const x = d3.scaleLinear().domain([minYear, maxYear]).nice().range([0, width]);

  // Greedy lane packing: place each bar in the first lane whose last bar ended.
  const rowH = 16;
  const laneEnds = []; // pixel x where each lane is free
  items.forEach((d) => {
    const x0 = x(d.start);
    const x1 = Math.max(x(d.end), x0 + 3);
    let lane = laneEnds.findIndex((end) => end <= x0 - 4);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = x1;
    d._x0 = x0;
    d._x1 = x1;
    d._lane = lane;
  });

  const height = laneEnds.length * rowH;
  svg
    .attr(
      "viewBox",
      `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
    )
    .attr("width", "100%")
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const bar = g
    .selectAll("g.tl-item")
    .data(items)
    .join("g")
    .attr("class", "tl-item")
    .attr("transform", (d) => `translate(0,${d._lane * rowH})`)
    .style("cursor", "pointer")
    .on("click", (event, d) => openEditModal(d.record.uuid));

  // Single-year → dot; range → bar.
  bar.each(function (d) {
    const sel = d3.select(this);
    const color = ENTITY_COLORS[d.record.entityType || "person"] || ENTITY_COLORS.person;
    if (d.end === d.start) {
      sel
        .append("circle")
        .attr("class", "tl-dot")
        .attr("cx", d._x0)
        .attr("cy", rowH / 2)
        .attr("r", 4)
        .attr("fill", color);
    } else {
      sel
        .append("rect")
        .attr("class", "tl-bar")
        .attr("x", d._x0)
        .attr("y", 3)
        .attr("width", d._x1 - d._x0)
        .attr("height", rowH - 6)
        .attr("fill", color);
    }
    const name = [d.record.firstname, d.record.lastname].filter(Boolean).join(" ") || "(unnamed)";
    sel
      .append("title")
      .text(
        `${name} — ${d.start}${d.end !== d.start ? "–" + d.end : ""} (${d.mode === "life" ? "life" : "attested"})`,
      );
  });

  // Axis along the bottom.
  svg
    .append("g")
    .attr("class", "tl-axis")
    .attr("transform", `translate(${margin.left},${height + margin.top})`)
    .call(
      d3
        .axisBottom(x)
        .ticks(Math.min(12, maxYear - minYear))
        .tickFormat(d3.format("d")),
    );
}
