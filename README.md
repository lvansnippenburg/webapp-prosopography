# Livorno Prosopography

A historical prosopography database for researching persons, associations, institutions, companies, and their relationships. Built as a single-page web app backed by a local Python data server that stores each record as a JSON file on disk.

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

The front-end is split into plain scripts that share one global scope, loaded in order by `index.html`: `core.js` (constants, state, utilities, soundex/levenshtein) → `data.js` (server API, parsing, import/export) → `records.js` (table & stats) → `modal.js` (record form & relationship graph) → `boot.js` (startup & event wiring).

## Tests

`tests/cases.json` holds expected outputs for the soundex/levenshtein helpers, asserted by **both** the Python and JavaScript copies so they cannot drift apart:

```
bash tests/run.sh
```
