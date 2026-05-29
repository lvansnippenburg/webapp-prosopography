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
```

The server serves the web app's static files **and** handles all data via a REST API. Each record is stored as `{uuid}.json` in the data directory (default: `/Users/lvansnippenburg/Sources/Persons/`).

To stop the server, go to Settings and click the "Stop Server" button. To stop it from the terminal:

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

The Python soundex implementation is a direct port of the JS version, so results are identical on both sides. The client-side wrapper is `apiLookup(query)` in `scripts/app.js`.
