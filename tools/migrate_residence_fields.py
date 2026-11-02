#!/usr/bin/env python3
"""Migrate the old flat city/firstseen/lastseen fields into a residence array.

    city, firstseen, lastseen  ->  residence: [{city, firstseen, lastseen,
                                                 notes, reference}]

People move between cities over time, so a single city/firstseen/lastseen
triple per record is too rigid. This collapses the three old top-level fields
into one residence entry per record (a record can later be given more entries
through the app's own "+ Add residence" UI). A blank city defaults to
"Livorno" — the primary city of residence assumed throughout this research
project (see the old COLUMN_MAP comment in core.js) — so records that never
had a city recorded still get a sensible first entry rather than an empty one.

Talks to a locally-running instance of this app's own server (not the JSON
files directly), so every write goes through the server's existing atomic-write
+ automatic-backup path (20 versions kept per record) — anything this script
does can be rolled back via the app's own History/restore UI.

Idempotent: a record that already has a "residence" key (or has none of
city/firstseen/lastseen) is left alone, so re-running after --apply is a no-op.

Usage:
    python3 tools/migrate_residence_fields.py              # dry run (default)
    python3 tools/migrate_residence_fields.py --apply       # write changes
    python3 tools/migrate_residence_fields.py --apply -v    # + per-record detail

Requires: pip install requests
"""

import argparse
import sys

import requests

DEFAULT_CITY = ""


def fetch_all_records(server_url):
    resp = requests.get(f"{server_url}/api/records")
    resp.raise_for_status()
    return resp.json()


def put_record(server_url, record):
    resp = requests.put(f"{server_url}/api/records/{record['uuid']}", json=record)
    resp.raise_for_status()


def person_name(record):
    return f"{record.get('firstname', '')} {record.get('lastname', '')}".strip() or record.get("uuid", "")


def migrate(records, verbose):
    """Compute the migrated record for every record that needs it.

    Returns (changed_uuids, new_records, log_lines, skip_counts).
    """
    new_records = {}
    changed = set()
    log = []
    skipped_already_migrated = 0
    skipped_nothing_to_do = 0

    def note(line):
        log.append(line)
        if verbose:
            print(line)

    for r in records:
        uuid = r["uuid"]

        if "residence" in r:
            skipped_already_migrated += 1
            continue

        has_old_fields = "city" in r or "firstseen" in r or "lastseen" in r
        if not has_old_fields:
            skipped_nothing_to_do += 1
            continue

        city = (r.get("city") or "").strip() or DEFAULT_CITY
        firstseen = (r.get("firstseen") or "").strip()
        lastseen = (r.get("lastseen") or "").strip()

        new_record = dict(r)
        new_record.pop("city", None)
        new_record.pop("firstseen", None)
        new_record.pop("lastseen", None)
        new_record["residence"] = [
            {
                "city": city,
                "firstseen": firstseen,
                "lastseen": lastseen,
                "notes": "",
                "reference": "",
            }
        ]

        new_records[uuid] = new_record
        changed.add(uuid)
        note(
            f"[MIGRATE] {person_name(r)} ({uuid}) city={city!r} "
            f"firstseen={firstseen!r} lastseen={lastseen!r}"
        )

    return changed, new_records, log, (skipped_already_migrated, skipped_nothing_to_do)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--server-url", default="http://localhost:8081", help="Base URL of the running server")
    parser.add_argument("--apply", action="store_true", help="Actually write changes (default: dry run only)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Print every migrated record, not just the summary")
    args = parser.parse_args()

    server_url = args.server_url.rstrip("/")

    try:
        records = fetch_all_records(server_url)
    except requests.RequestException as e:
        print(f"Could not reach {server_url} ({e}). Is the server running? Try ./run.sh", file=sys.stderr)
        sys.exit(1)

    print(f"Fetched {len(records)} records from {server_url}")
    changed, new_records, log, (skipped_migrated, skipped_nothing) = migrate(records, args.verbose)

    print()
    print("Summary:")
    print(f"  Records to migrate: {len(changed)}")
    print(f"  Already migrated (has 'residence'): {skipped_migrated}")
    print(f"  Nothing to migrate (no city/firstseen/lastseen): {skipped_nothing}")

    if not changed:
        print("\nNothing to do.")
        return

    if not args.apply:
        print("\nDry run only — no changes written. Re-run with --apply to write them.")
        return

    applied = 0
    for uuid in changed:
        record = new_records[uuid]
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
