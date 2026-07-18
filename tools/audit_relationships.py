#!/usr/bin/env python3
"""Read-only relationship consistency audit.

Never writes anything — flags patterns worth a manual look:

    TOO-MANY-PARENTS       a record has more than 2 distinct "child" (parent) entries
    ASYMMETRIC-RECIPROCAL  a bidirectional relationship (married/brother/sister/
                            associate/business/friend/neighbour/other) whose reciprocal
                            is missing on the other person's record
    ORPHAN                 a relationship entry pointing at a uuid that doesn't
                            resolve to any known record
    UNRESOLVED             a relationship entry with a blank personUuid (usually
                            left over from an old Excel import)
    SELF-REFERENCE         a relationship entry pointing at the record's own uuid

"child", "member", and "employed" are deliberately one-way by design (see
CLAUDE.md) and are not checked for a missing reciprocal.

Usage:
    python3 tools/audit_relationships.py
    python3 tools/audit_relationships.py --server-url http://localhost:9000

Requires: pip install requests
"""

import argparse
import sys

import requests

# Types whose reciprocal is expected to be the same type on the other record.
# child/member/employed are intentionally one-way and excluded.
BIDIRECTIONAL_RECIPROCAL = {
    "married": "married",
    "brother": "brother",
    "sister": "sister",
    "friend": "friend",
    "associate": "associate",
    "business": "business",
    "neighbour": "neighbour",
    "other": "other",
}


def fetch_all_records(server_url):
    resp = requests.get(f"{server_url}/api/records")
    resp.raise_for_status()
    return resp.json()


def person_name(record):
    return f"{record.get('firstname', '')} {record.get('lastname', '')}".strip()


def audit(records):
    index = {r["uuid"]: r for r in records}
    warnings = []
    counts = {
        "TOO-MANY-PARENTS": 0,
        "ASYMMETRIC-RECIPROCAL": 0,
        "ORPHAN": 0,
        "UNRESOLVED": 0,
        "SELF-REFERENCE": 0,
    }

    for uuid, r in index.items():
        rels = r.get("relationships") or []
        name = person_name(r)

        parent_uuids = {rel.get("personUuid") for rel in rels if rel.get("type") == "child" and rel.get("personUuid")}
        if len(parent_uuids) > 2:
            counts["TOO-MANY-PARENTS"] += 1
            warnings.append(f"[TOO-MANY-PARENTS] {name} ({uuid}) has {len(parent_uuids)} distinct 'child' (parent) entries")

        for rel in rels:
            rtype = rel.get("type")
            target_uuid = rel.get("personUuid") or ""

            if not target_uuid:
                counts["UNRESOLVED"] += 1
                warnings.append(f"[UNRESOLVED] {name} ({uuid}) has a blank-uuid '{rtype}' entry for \"{rel.get('personName')}\"")
                continue

            if target_uuid == uuid:
                counts["SELF-REFERENCE"] += 1
                warnings.append(f"[SELF-REFERENCE] {name} ({uuid}) has a self-referential '{rtype}' entry")
                continue

            if target_uuid not in index:
                counts["ORPHAN"] += 1
                warnings.append(f"[ORPHAN] {name} ({uuid}) has a '{rtype}' entry pointing at unknown uuid {target_uuid}")
                continue

            if rtype in BIDIRECTIONAL_RECIPROCAL:
                expected = BIDIRECTIONAL_RECIPROCAL[rtype]
                target = index[target_uuid]
                target_rels = target.get("relationships") or []
                has_reciprocal = any(
                    tr.get("type") == expected and tr.get("personUuid") == uuid for tr in target_rels
                )
                if not has_reciprocal:
                    counts["ASYMMETRIC-RECIPROCAL"] += 1
                    warnings.append(
                        f"[ASYMMETRIC-RECIPROCAL] {name} ({uuid}) has '{rtype}' -> \"{rel.get('personName')}\" "
                        f"but {person_name(target)} ({target_uuid}) has no matching '{expected}' back"
                    )

    return warnings, counts


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--server-url", default="http://localhost:8081", help="Base URL of the running server")
    args = parser.parse_args()
    server_url = args.server_url.rstrip("/")

    try:
        records = fetch_all_records(server_url)
    except requests.RequestException as e:
        print(f"Could not reach {server_url} ({e}). Is the server running? Try ./run.sh", file=sys.stderr)
        sys.exit(1)

    records = [r for r in records if not r.get("deletedAt")]
    print(f"Fetched {len(records)} non-deleted records from {server_url}\n")

    warnings, counts = audit(records)
    for w in warnings:
        print(w)

    print("\nSummary:")
    for key in ("TOO-MANY-PARENTS", "ASYMMETRIC-RECIPROCAL", "ORPHAN", "UNRESOLVED", "SELF-REFERENCE"):
        print(f"  {key}: {counts[key]}")

    if not warnings:
        print("\nNo issues found.")


if __name__ == "__main__":
    main()
