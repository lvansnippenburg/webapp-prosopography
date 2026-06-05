#!/usr/bin/env python3
"""Pin the server-side fuzzy-search helpers (_soundex, _levenshtein).

These functions are duplicated in JavaScript (src/scripts/app.js). The expected
outputs live in cases.json and are also asserted by test_search.mjs, so the two
implementations are kept in lock-step.

Run: python3 -m unittest tests.test_search   (or)   python3 tests/test_search.py
"""

import json
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "server"))

import server  # noqa: E402  (path set up above)

CASES = json.loads((HERE / "cases.json").read_text(encoding="utf-8"))


class SoundexTests(unittest.TestCase):
    def test_table(self):
        for value, expected in CASES["soundex"]:
            with self.subTest(value=value):
                self.assertEqual(server._soundex(value), expected)


class LevenshteinTests(unittest.TestCase):
    def test_table(self):
        for a, b, expected in CASES["levenshtein"]:
            with self.subTest(a=a, b=b):
                self.assertEqual(server._levenshtein(a, b), expected)

    def test_symmetric(self):
        for a, b, expected in CASES["levenshtein"]:
            with self.subTest(a=a, b=b):
                self.assertEqual(server._levenshtein(b, a), expected)


if __name__ == "__main__":
    unittest.main()
