#!/usr/bin/env bash
# Run all project tests: the Python (server) and JavaScript (client) copies of
# the fuzzy-search helpers are checked against the same cases.json table.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== Python tests =="
python3 tests/test_search.py
python3 tests/test_restore.py

echo
echo "== JavaScript tests =="
node tests/test_search.mjs
