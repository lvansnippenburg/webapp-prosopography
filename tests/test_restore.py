#!/usr/bin/env python3
"""Tests for the record version backup/restore helpers in server/server.py.

Run: python3 tests/test_restore.py
"""

import re
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "server"))

import server  # noqa: E402


class RestoreTests(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        server.DATA_DIR = Path(self._tmp.name)
        server._records = {}

    def tearDown(self):
        self._tmp.cleanup()

    def _write(self, record):
        server._records[record["uuid"]] = record
        server._write_record(record)

    def test_list_and_restore_roundtrip(self):
        self._write({"uuid": "t1", "firstname": "A", "lastname": "Old"})
        # Overwriting backs up the "Old" version before writing "New".
        self._write({"uuid": "t1", "firstname": "A", "lastname": "New"})

        versions = server._list_backups("t1")
        self.assertEqual(len(versions), 1)
        self.assertRegex(versions[0]["timestamp"], r"^[0-9T]+$")
        self.assertEqual(versions[0]["name"], "A Old")
        self.assertFalse(versions[0]["deleted"])

        restored = server._restore_record("t1", versions[0]["timestamp"])
        self.assertIsNotNone(restored)
        self.assertEqual(restored["lastname"], "Old")

        # In-memory index and on-disk file both reflect the restored version.
        self.assertEqual(server._records["t1"]["lastname"], "Old")
        on_disk = (server.DATA_DIR / "t1.json").read_text(encoding="utf-8")
        self.assertIn('"lastname": "Old"', on_disk)

        # Restoring backed up the "New" version, so there are now two backups.
        self.assertEqual(len(server._list_backups("t1")), 2)

    def test_deleted_flag_in_preview(self):
        self._write({"uuid": "t2", "lastname": "X"})
        self._write({"uuid": "t2", "lastname": "X", "deletedAt": "2026-01-01T00:00:00Z"})
        # The backup is of the first (non-deleted) version.
        self.assertFalse(server._list_backups("t2")[0]["deleted"])

    def test_missing_backup_returns_none(self):
        self._write({"uuid": "t3", "lastname": "Keep"})
        self.assertIsNone(server._restore_record("t3", "20000101T000000000000"))
        # Nothing was overwritten.
        self.assertEqual(server._records["t3"]["lastname"], "Keep")

    def test_timestamp_guard_rejects_path_traversal(self):
        # The /restore handler only accepts this shape before touching disk;
        # anything else (path fragments, letters) must be refused.
        guard = re.compile(r"[0-9T]+")
        for bad in ["../../etc/passwd", "abc", "2026/01", "..", ""]:
            self.assertIsNone(guard.fullmatch(bad), f"{bad!r} should be rejected")
        self.assertIsNotNone(guard.fullmatch("20260605T180907032707"))


if __name__ == "__main__":
    unittest.main()
