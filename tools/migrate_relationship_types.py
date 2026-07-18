#!/usr/bin/env python3
"""Migrate old family relationship types to the simplified vocabulary.

    father, mother                -> child   (renamed in place, on the offspring's
                                                own record, pointing at the parent)
    husband, wife                  -> married (renamed in place, symmetric)
    son, daughter                  -> dropped from the parent's record; backfilled
                                       as a "child" entry on the child's own record
                                       if one isn't already there

Talks to a locally-running instance of this app's own server (not the JSON
files directly), so every write goes through the server's existing atomic-write
+ automatic-backup path (20 versions kept per record) — anything this script
does can be rolled back via the app's own History/restore UI.

Usage:
    python3 tools/migrate_relationship_types.py              # dry run (default)
    python3 tools/migrate_relationship_types.py --apply       # write changes
    python3 tools/migrate_relationship_types.py --apply -v    # + per-record detail

Requires: pip install requests
"""

import argparse
import sys

import requests

RENAME_MAP = {"father": "child", "mother": "child", "husband": "married", "wife": "married"}
PARENT_SIDE_TYPES = {"son", "daughter"}


def fetch_all_records(server_url):
    resp = requests.get(f"{server_url}/api/records")
    resp.raise_for_status()
    return resp.json()


def put_record(server_url, record):
    resp = requests.put(f"{server_url}/api/records/{record['uuid']}", json=record)
    resp.raise_for_status()


def person_name(record):
    return f"{record.get('firstname', '')} {record.get('lastname', '')}".strip()


def migrate(records, verbose):
    """Compute the migrated relationships for every record.

    Returns (changed_uuids, log_lines, warnings, counts).
    """
    index = {r["uuid"]: r for r in records}
    # Work on a plain dict copy of each record's relationships list so we never
    # mutate the input structures while still iterating over them.
    new_rels = {uuid: list(r.get("relationships") or []) for uuid, r in index.items()}
    changed = set()
    log = []
    warnings = []
    counts = {"RENAME": 0, "BACKFILL": 0, "DROP-REDUNDANT": 0, "WARN-ORPHAN": 0, "WARN-UNRESOLVED": 0}

    def note(line):
        log.append(line)
        if verbose:
            print(line)

    # ── Pass 2a: local renames (father/mother -> child, husband/wife -> married) ──
    for uuid, rels in new_rels.items():
        for rel in rels:
            old_type = rel.get("type")
            if old_type in RENAME_MAP:
                new_type = RENAME_MAP[old_type]
                rel["type"] = new_type
                changed.add(uuid)
                counts["RENAME"] += 1
                note(f"[RENAME] {person_name(index[uuid])} ({uuid}) {old_type}->{new_type} (-> \"{rel.get('personName')}\")")

    # ── Pass 2b: cross-record son/daughter resolution ──
    # Iterate over the *original* records for son/daughter entries so we don't
    # get confused by entries this same pass adds/removes elsewhere.
    for uuid, r in index.items():
        original_rels = r.get("relationships") or []
        for rel in original_rels:
            if rel.get("type") not in PARENT_SIDE_TYPES:
                continue
            old_type = rel["type"]
            child_uuid = rel.get("personUuid") or ""

            if not child_uuid:
                warnings.append(
                    f"[WARN-UNRESOLVED] {person_name(r)} ({uuid}) has a blank-uuid "
                    f"'{old_type}' entry for \"{rel.get('personName')}\" — left as-is, needs manual resolution"
                )
                counts["WARN-UNRESOLVED"] += 1
                continue

            if child_uuid == uuid:
                warnings.append(f"[WARN-SELF] {person_name(r)} ({uuid}) has a self-referential '{old_type}' entry — skipped")
                continue

            if child_uuid not in index:
                warnings.append(
                    f"[WARN-ORPHAN] {person_name(r)} ({uuid}) has a '{old_type}' entry pointing at "
                    f"unknown uuid {child_uuid} — left as-is"
                )
                counts["WARN-ORPHAN"] += 1
                continue

            # Does the child already have a "child" entry pointing back at this parent
            # (either pre-existing, or just renamed onto it in pass 2a)?
            child_rels = new_rels[child_uuid]
            has_reverse = any(cr.get("type") == "child" and cr.get("personUuid") == uuid for cr in child_rels)

            if not has_reverse:
                child_rels.append({"type": "child", "personUuid": uuid, "personName": person_name(r)})
                changed.add(child_uuid)
                counts["BACKFILL"] += 1
                note(f"[BACKFILL] {person_name(index[child_uuid])} ({child_uuid}) += child -> \"{person_name(r)}\"")

            # Either way, the parent-side son/daughter entry is now redundant.
            new_rels[uuid] = [
                cr for cr in new_rels[uuid] if not (cr.get("type") == old_type and cr.get("personUuid") == child_uuid)
            ]
            changed.add(uuid)
            counts["DROP-REDUNDANT"] += 1
            note(f"[DROP-REDUNDANT] {person_name(r)} ({uuid}) removed {old_type} -> \"{rel.get('personName')}\"")

    return changed, new_rels, warnings, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--server-url", default="http://localhost:8081", help="Base URL of the running server")
    parser.add_argument("--apply", action="store_true", help="Actually write changes (default: dry run only)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Print every rename/backfill/drop, not just warnings")
    args = parser.parse_args()

    server_url = args.server_url.rstrip("/")

    try:
        records = fetch_all_records(server_url)
    except requests.RequestException as e:
        print(f"Could not reach {server_url} ({e}). Is the server running? Try ./run.sh", file=sys.stderr)
        sys.exit(1)

    print(f"Fetched {len(records)} records from {server_url}")
    changed, new_rels, warnings, counts = migrate(records, args.verbose)

    # Warnings are always printed (loud by design); RENAME/BACKFILL/DROP-REDUNDANT
    # lines only print with -v (already handled by note() during migrate()).
    for w in warnings:
        print(w)

    print()
    print("Summary:")
    for key in ("RENAME", "BACKFILL", "DROP-REDUNDANT", "WARN-ORPHAN", "WARN-UNRESOLVED"):
        print(f"  {key}: {counts[key]}")
    print(f"  Records touched: {len(changed)}")

    if not changed:
        print("\nNothing to do.")
        return

    if not args.apply:
        print("\nDry run only — no changes written. Re-run with --apply to write them.")
        return

    index = {r["uuid"]: r for r in records}
    applied = 0
    for uuid in changed:
        record = index[uuid]
        record["relationships"] = new_rels[uuid]
        try:
            put_record(server_url, record)
            applied += 1
            if args.verbose:
                print(f"[APPLIED] {person_name(record)} ({uuid})")
        except requests.RequestException as e:
            print(f"[ERROR] failed to save {person_name(record)} ({uuid}): {e}", file=sys.stderr)

    print(f"\nApplied changes to {applied}/{len(changed)} records.")


if __name__ == "__main__":
    main()
