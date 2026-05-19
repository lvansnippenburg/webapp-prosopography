#!/usr/bin/env python3
"""
Prosopography data server.

Replaces IndexedDB + Codeberg sync with a local REST API backed by one JSON
file per record on disk.  Also serves the webapp's static files.

Usage:
    python3 server.py [--port 8081] [--data-dir /path/to/Persons]

API:
    GET    /api/records          → all records (JSON array)
    GET    /api/records/<uuid>   → single record
    GET    /api/lookup?q=<str>   → fuzzy name search; returns [{uuid, name, matchType}]
    POST   /api/records          → create / upsert record (body: JSON object)
    PUT    /api/records/<uuid>   → update record (body: JSON object)
    DELETE /api/records/<uuid>   → soft-delete (sets deletedAt)
"""

import argparse
import json
import os
import sys
import re
import threading
from datetime import datetime, timezone
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs

# ── Defaults ───────────────────────────────────────────────────────────────

DEFAULT_DATA_DIR = "/Users/lvansnippenburg/Sources/Persons"
DEFAULT_PORT = 8081

# ── Globals (set in main) ──────────────────────────────────────────────────

DATA_DIR: Path = Path(DEFAULT_DATA_DIR)
ROOT_DIR: Path = Path(__file__).parent.parent     # project root
WEBAPP_DIR: Path = ROOT_DIR / "src"               # web root served at /
_records: dict[str, dict] = {}                    # uuid → record (in-memory index)
_lock = threading.Lock()                           # guard concurrent writes
_httpserver: "HTTPServer | None" = None            # set in main(), used for shutdown


# ── Disk helpers ───────────────────────────────────────────────────────────

def _record_path(uuid: str) -> Path:
    """Return the JSON file path for a given UUID."""
    return DATA_DIR / f"{uuid}.json"


def _load_all() -> None:
    """Read every *.json file in DATA_DIR into the in-memory index."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    errors = 0
    for path in DATA_DIR.glob("*.json"):
        try:
            with path.open(encoding="utf-8") as f:
                record = json.load(f)
            uuid = record.get("uuid")
            if not uuid:
                print(f"  [warn] {path.name}: missing 'uuid' field, skipped", file=sys.stderr)
                errors += 1
                continue
            # Ensure filename matches uuid (self-healing)
            expected = f"{uuid}.json"
            if path.name != expected:
                print(f"  [warn] {path.name}: filename does not match uuid '{uuid}', skipped", file=sys.stderr)
                errors += 1
                continue
            _records[uuid] = record
            count += 1
        except (json.JSONDecodeError, OSError) as exc:
            print(f"  [warn] {path.name}: {exc}", file=sys.stderr)
            errors += 1
    print(f"Loaded {count} records from {DATA_DIR}" + (f" ({errors} skipped)" if errors else ""))


def _write_record(record: dict) -> None:
    """Write a single record to its JSON file (must be called with _lock held)."""
    uuid = record["uuid"]
    path = _record_path(uuid)
    tmp = path.with_suffix(".tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(record, f, ensure_ascii=False, indent=2)
        f.write("\n")
    tmp.replace(path)   # atomic rename


# ── HTTP handler ───────────────────────────────────────────────────────────

class Handler(SimpleHTTPRequestHandler):
    """
    Handles /api/* routes directly; delegates everything else to
    SimpleHTTPRequestHandler which serves files from WEBAPP_DIR.
    """

    # Serve static files from src/, with a fallback to the project root for
    # top-level files (LICENSE.md, robots.txt) that live outside src/.
    def translate_path(self, path):
        path = urlparse(path).path
        rel = path.lstrip("/")
        if rel in ("LICENSE.md", "robots.txt"):
            return str(ROOT_DIR / rel)
        return str(WEBAPP_DIR / rel)

    def end_headers(self):
        """Inject CORS headers into every response, including static files and errors."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/records":
            self._get_all_records()
        elif m := re.fullmatch(r"/api/records/([^/]+)", path):
            self._get_record(m.group(1))
        elif path == "/api/lookup":
            q = parse_qs(parsed.query).get("q", [""])[0]
            self._lookup(q)
        elif path == "/api/config":
            self._get_config()
        else:
            super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/records":
            self._upsert_record(uuid_from_url=None)
        elif path == "/api/shutdown":
            self._shutdown()
        else:
            self._not_found()

    def do_PUT(self):
        path = urlparse(self.path).path
        if m := re.fullmatch(r"/api/records/([^/]+)", path):
            self._upsert_record(uuid_from_url=m.group(1))
        else:
            self._not_found()

    def do_DELETE(self):
        path = urlparse(self.path).path
        if m := re.fullmatch(r"/api/records/([^/]+)", path):
            self._delete_record(m.group(1))
        else:
            self._not_found()

    # ── API handlers ────────────────────────────────────────────────────

    def _get_all_records(self):
        with _lock:
            data = list(_records.values())
        self._send_json(data)

    def _get_record(self, uuid: str):
        with _lock:
            record = _records.get(uuid)
        if record is None:
            self._not_found()
        else:
            self._send_json(record)

    def _upsert_record(self, uuid_from_url: str | None):
        body = self._read_json_body()
        if body is None:
            return

        uuid = uuid_from_url or body.get("uuid")
        if not uuid:
            self._send_error_json(400, "Record must have a 'uuid' field")
            return

        if uuid_from_url and body.get("uuid") and body["uuid"] != uuid_from_url:
            self._send_error_json(400, "UUID in URL and body do not match")
            return

        body["uuid"] = uuid

        with _lock:
            is_new = uuid not in _records
            _records[uuid] = body
            _write_record(body)

        status = 201 if is_new else 200
        self._send_json(body, status=status)

    def _shutdown(self):
        self._send_json({"status": "shutting down"})
        # server.shutdown() blocks until serve_forever() returns, so run it in a
        # background thread so the response is fully sent first.
        threading.Thread(target=_httpserver.shutdown, daemon=True).start()

    def _delete_record(self, uuid: str):
        with _lock:
            record = _records.get(uuid)
            if record is None:
                self._not_found()
                return
            record["deletedAt"] = _now_iso()
            record["modifiedAt"] = record["deletedAt"]
            _records[uuid] = record
            _write_record(record)

        self._send_json(record)

    # ── Helpers ─────────────────────────────────────────────────────────

    def _read_json_body(self) -> dict | None:
        length = int(self.headers.get("Content-Length", 0))
        if length == 0:
            self._send_error_json(400, "Empty request body")
            return None
        raw = self.rfile.read(length)
        try:
            return json.loads(raw)
        except json.JSONDecodeError as exc:
            self._send_error_json(400, f"Invalid JSON: {exc}")
            return None

    def _send_json(self, payload, status: int = 200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_error_json(self, status: int, message: str):
        self._send_json({"error": message}, status=status)

    def _not_found(self):
        self._send_error_json(404, "Not found")

    def _lookup(self, query: str):
        if len(query) < 2:
            self._send_json([])
            return

        ql = query.lower()
        sx_query = _soundex(query)
        results = []

        with _lock:
            records = list(_records.values())

        for r in records:
            if r.get("deletedAt"):
                continue

            names = (
                [r.get("lastname")]
                + (r.get("lastnameVariations") or [])
                + [r.get("firstname")]
                + (r.get("firstnameVariations") or [])
                + [r.get("patronymic")]
            )
            match_type = None

            for name in names:
                if not name:
                    continue
                nl = name.lower()
                if nl == ql:
                    match_type = "exact"; break
                if nl.startswith(ql):
                    match_type = "prefix"; break
                if ql in nl:
                    match_type = "contains"; break
                if _soundex(name) == sx_query:
                    match_type = "sounds like"; break
                if len(ql) >= 3 and _levenshtein(ql, nl) <= 2:
                    match_type = "similar"; break

            if match_type:
                full_name = " ".join(
                    p for p in [r.get("firstname"), r.get("lastname"), r.get("patronymic")] if p
                )
                results.append({"uuid": r["uuid"], "name": full_name, "matchType": match_type})

        order = {"exact": 0, "prefix": 1, "contains": 2, "sounds like": 3, "similar": 4}
        results.sort(key=lambda x: order.get(x["matchType"], 9))
        self._send_json(results)

    def _get_config(self):
        self._send_json({"dataDir": str(DATA_DIR)})

    def log_message(self, fmt, *args):
        # Suppress noisy static-file logs; keep API logs.
        if "/api/" in str(args[0] if args else ""):
            super().log_message(fmt, *args)


# ── Utility ────────────────────────────────────────────────────────────────

def _soundex(s: str) -> str:
    """Soundex implementation matching the JavaScript version in app.js."""
    MAP = {
        "B": "1", "F": "1", "P": "1", "V": "1",
        "C": "2", "G": "2", "J": "2", "K": "2", "Q": "2", "S": "2", "X": "2", "Z": "2",
        "D": "3", "T": "3",
        "L": "4",
        "M": "5", "N": "5",
        "R": "6",
    }
    s = re.sub(r"[^A-Za-z]", "", s).upper()
    if not s:
        return ""
    code = s[0]
    prev = MAP.get(s[0], "0")
    for ch in s[1:]:
        if len(code) >= 4:
            break
        cur = MAP.get(ch)          # None for vowels / H / W / Y
        if cur and cur != prev:
            code += cur
        prev = cur if cur else "0"  # reset across vowels, matching JS `cur || 0`
    return code.ljust(4, "0")


def _levenshtein(a: str, b: str) -> int:
    """Edit distance between two strings."""
    m, n = len(a), len(b)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, n + 1):
            temp = dp[j]
            dp[j] = prev if a[i - 1] == b[j - 1] else 1 + min(prev, dp[j], dp[j - 1])
            prev = temp
    return dp[n]


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


# ── Entry point ────────────────────────────────────────────────────────────

def main():
    global DATA_DIR

    parser = argparse.ArgumentParser(description="Prosopography data server")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT,
                        help=f"Port to listen on (default: {DEFAULT_PORT})")
    parser.add_argument("--data-dir", default=DEFAULT_DATA_DIR,
                        help=f"Directory where record JSON files are stored (default: {DEFAULT_DATA_DIR})")
    args = parser.parse_args()

    DATA_DIR = Path(args.data_dir).expanduser().resolve()
    print(f"Data directory : {DATA_DIR}")
    print(f"Web root       : {WEBAPP_DIR}")

    _load_all()

    global _httpserver
    _httpserver = HTTPServer(("", args.port), Handler)
    print(f"Listening on http://localhost:{args.port}/")
    print("Press Ctrl-C to stop.\n")

    try:
        _httpserver.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        print("Server stopped.")


if __name__ == "__main__":
    main()
