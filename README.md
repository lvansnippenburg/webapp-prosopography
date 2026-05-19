# Livorno Prosopography

A historical prosopography database for researching persons, associations, institutions, companies, and their relationships. Built as a single-page web app backed by a local Python data server that stores each record as a JSON file on disk.

## This webapp is primarily for personal use

Before using, copying, or modifying this code: **read the LICENSE.md file.**

If you adapt this for your own project, the things most likely to need changing are:

1. The name — replace "Livorno" throughout `index.html`, `manifest.json`, and the app header.
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

To stop the server you can go to the settings and the click the "Stop server" button. If you wang to stop the server from the terminal, use one of these commands (as it is running in the background):
```
lsof -ti :8081 | xargs kill

or

pkill -f server.py
```
(assuming you started it on port 8081)

To see the log of the server:
```
tail -f /tmp/prosopography-server.log
```

## Special API calls 

**GET /api/lookup?q=<string>** — server searches lastname + lastname variations for all non-deleted records using the same five-tier match cascade as the JS function: exact → prefix → contains → soundex → levenshtein (≤ 2 edits, min 3 chars). Results are sorted by match quality and returned as:

[
  { "uuid": "abc-123", "name": "Jan van der Berg", "matchType": "exact" },
  { "uuid": "def-456", "name": "Johan van Bergh",  "matchType": "sounds like" }
]
async function apiLookup(query) in app.js — thin client wrapper, returns [] on any error so callers don't need try/catch.

The Python _soundex implementation is a direct port of the JS version (including the cur || 0 reset behaviour across vowels), so results will be identical on both sides.