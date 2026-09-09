# Livorno Prosopography

A historical prosopography database for researching persons, associations, institutions, companies, and their relationships. Built as a single-page web app backed by a local Python data server that stores each record as a JSON file on disk.

## Features

- **Search** — fuzzy name matching (exact/prefix/contains/soundex/Levenshtein), scoped search across specific fields, regex mode, and an advanced `field:value AND/OR field:value` query syntax.
- **Relationships** — married/child/brother/sister/associate/etc. between records, with automatic reciprocal writes for symmetric types. "Child of" is one-way (stored only on the offspring, pointing at the parent); the parent's own record shows a computed "Parent of" chip instead. Siblings are inferred automatically from a shared parent. Each relationship can carry a free-text comment, optionally linking to one of the record's own Zotero/Archief references.
- **Timespan slider** — a dual-handle range slider beneath the search bar filters records by `firstseen`/`lastseen`, defaulting to the full span of the loaded data. It matches on **overlap**: a record is included if it was active at *any point* during the selected years, not only if its whole attested period fits inside them. This is the opposite of the Timespan search scope's range query syntax (typing e.g. `1630-1680` with the Timespan scope selected, or `timespan:1630-1680` in advanced mode — see `src/help.md`), which requires *full containment* instead — the slider is built to be dragged or stepped across the dataset (see "Fixed window" mode, which scrubs a constant-width period through time, including a Play/auto-advance option), and containment semantics would make a moving window useless for anyone whose attested career outlasts it. Records with no usable date are excluded once the range is narrowed, but all show at the default full-range setting.
- **Visualize view** — a second, D3-powered view (toggle next to the search bar) with four sub-views on the same filtered records: a card list, a force-directed/tree relationship graph, an offline world map (place fields resolved via a local gazetteer), and a lifespan/attestation timeline.
- **Import/export** — Excel (legacy positional or named-column round-trip) and JSON import/export, plus a dedicated GEXF export for opening the relationship network directly in [Gephi](https://gephi.org).
- **Versioning** — every overwrite is backed up automatically (20 versions per record) and browsable/restorable from the record's own History panel.
- **Deep links** — "Copy Link" on any record produces a URL that reopens the app with that record's edit form already open.

## This webapp is primarily for personal use

Before using, copying, or modifying this code: **read the LICENSE.md file.**

If you adapt this for your own project, the things most likely to need changing are:

1. The name — replace "Livorno" throughout `index.html` and the app header.
2. The default data directory — in `server/server.py`, change `DEFAULT_DATA_DIR`.

## Running locally

### Quickest way

Double-click **Livorno Prosopography.app** in the project root. It starts the server and opens the app in your default browser. If the server is already running it just opens the browser.

Alternatively use the `run.sh` command from the terminal while in this directory (it will do the same as the Livorno Prosopography.app)

### Manual

Start the server from the project directory:

```
python3 server/server.py
```

Then open `http://localhost:8081` in your browser.

Options:

```
python3 server/server.py --port 9000
python3 server/server.py --data-dir ~/path/to/json/files
python3 server/server.py --host 0.0.0.0      # expose on the LAN (see warning below)
```

The server serves the web app's static files **and** handles all data via a REST API. Each record is stored as `{uuid}.json` in the data directory (default: `/Users/lvansnippenburg/Sources/Persons/`). Before any record is overwritten, the previous version is copied into `<data-dir>/.backups/` (the most recent 20 versions per record are kept), so an accidental edit can always be recovered.

### A note on access

By default the server binds to **`127.0.0.1` (loopback only)** and only honours CORS requests from `localhost`. The data has no authentication layer, so don't change this unless you understand the implications: passing `--host 0.0.0.0` makes every record on your machine readable, editable, and deletable by anything on the same network.

The third-party libraries (SheetJS, D3) are vendored under `src/vendor/`, so the app runs fully offline.

To stop the server, you can click on the ⏻ symbol in the top-right of the window. This will stop the server and close the current window/tab. To stop it from the terminal:

```
lsof -ti :8081 | xargs kill
``` 

or (will kill all servers with script name server.py ...)

```
pkill -f server.py
```

To tail the server log:

```
tail -f /tmp/prosopography-server.log
```

## REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records` | All records (JSON array) |
| GET | `/api/records/<uuid>` | Single record |
| GET | `/api/lookup?q=<string>` | Fuzzy name search |
| POST | `/api/records` | Create / upsert record |
| PUT | `/api/records/<uuid>` | Update record |
| DELETE | `/api/records/<uuid>` | Soft-delete (sets `deletedAt`) |

### Fuzzy name lookup

`GET /api/lookup?q=<string>` searches lastname and lastname variations for all non-deleted records using a five-tier match cascade: exact → prefix → contains → soundex → levenshtein (≤ 2 edits, min 3 chars). Results are sorted by match quality:

```json
[
  { "uuid": "abc-123", "name": "Jan van der Berg", "matchType": "exact" },
  { "uuid": "def-456", "name": "Johan van Bergh",  "matchType": "sounds like" }
]
```

The Python soundex implementation is a direct port of the JS version (`scripts/core.js`), so results are identical on both sides. The client-side wrapper is `apiLookup(query)` in `scripts/data.js`.

The front-end is split into plain scripts that share one global scope, loaded in order by `index.html`: `core.js` (constants, state, utilities, soundex/levenshtein) → `data.js` (server API, parsing, import/export) → `records.js` (table, stats, search/timespan filtering) → `modal.js` (record form & relationship graph) → `visualize.js` (Map & Timeline views) → `boot.js` (startup & event wiring).

## Tests

`tests/cases.json` holds expected outputs for the soundex/levenshtein helpers, asserted by **both** the Python and JavaScript copies so they cannot drift apart:

```
bash tests/run.sh
```
