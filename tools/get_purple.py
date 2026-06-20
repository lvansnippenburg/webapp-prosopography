#!/usr/bin/env python3

import json
import os

import requests

# ============ CONFIGURATION ============
API_KEY = os.environ["ZOTERO_API_KEY"]  # Get from zotero.org/settings/keys
LIBRARY_ID = os.environ["ZOTERO_LIBRARY_ID"]  # Your user ID (number) or group ID
LIBRARY_TYPE = "user"  # "user" or "group"
COLLECTION_KEY = os.environ["ZOTERO_COLLECTION_KEY"]  # The collection's key (from URL)

# Purple hex code (Zotero default purple)
PURPLE_HEX = "#a28ae5"
# =======================================

BASE_URL = f"https://api.zotero.org/{LIBRARY_TYPE}s/{LIBRARY_ID}"
HEADERS = {"Zotero-API-Version": "3", "Authorization": f"Bearer {API_KEY}"}


def get_collection_items(collection_key):
    """Get all top-level items in a collection."""
    items = []
    start = 0
    limit = 100

    while True:
        url = f"{BASE_URL}/collections/{collection_key}/items/top"
        params = {"start": start, "limit": limit, "format": "json"}
        resp = requests.get(url, headers=HEADERS, params=params)
        resp.raise_for_status()

        batch = resp.json()
        if not batch:
            break
        items.extend(batch)
        start += limit

        # Check if there are more results
        if len(batch) < limit:
            break

    return items


def get_child_items(item_key):
    """Get all children of an item, with error handling."""
    children = []
    start = 0
    limit = 100

    while True:
        url = f"{BASE_URL}/items/{item_key}/children"
        params = {"start": start, "limit": limit, "format": "json"}
        resp = requests.get(url, headers=HEADERS, params=params)

        # If this item can't have children, skip it gracefully
        if resp.status_code == 400:
            print(f"  [skip] Item {item_key} returned 400: {resp.text.strip()}")
            return []

        resp.raise_for_status()

        batch = resp.json()
        if not batch:
            break
        children.extend(batch)
        start += limit

        if len(batch) < limit:
            break

    return children


def is_purple(annotation_color):
    """Check if annotation color matches purple."""
    if not annotation_color:
        return False
    return annotation_color.lower() == PURPLE_HEX.lower()


def build_annotation_link(attachment_key, annotation_data):
    """Build a Zotero link to the annotation."""
    # Web link to the parent item
    web_link = (
        f"https://www.zotero.org/{LIBRARY_TYPE}s/{LIBRARY_ID}/items/{attachment_key}"
    )

    # Local Zotero link (opens in desktop app)
    page_index = annotation_data.get("annotationPageLabel", "")
    zotero_link = f"zotero://open-pdf/library/items/{attachment_key}"
    if "annotationPosition" in annotation_data:
        try:
            pos = json.loads(annotation_data["annotationPosition"])
            page = pos.get("pageIndex", 0)
            zotero_link += f"?page={page + 1}"
        except (json.JSONDecodeError, KeyError):
            pass

    return web_link, zotero_link


def extract_purple_annotations():
    """Main function to extract all purple annotations."""
    print("Fetching collection items...\n")
    top_items = get_collection_items(COLLECTION_KEY)

    results = []

    for item in top_items:
        item_data = item["data"]
        item_key = item_data["key"]
        title = item_data.get("title", "Untitled")

        # Get children (attachments)
        children = get_child_items(item_key)

        doc_annotations = []

        for child in children:
            child_data = child["data"]

            # If child is an attachment, get ITS children (the annotations)
            if child_data.get("itemType") == "attachment":
                attachment_key = child_data["key"]
                annotations = get_child_items(attachment_key)

                for ann in annotations:
                    ann_data = ann["data"]
                    if ann_data.get("itemType") != "annotation":
                        continue

                    color = ann_data.get("annotationColor", "")
                    if not is_purple(color):
                        continue

                    # Extract details
                    text = ann_data.get("annotationText", "") or ann_data.get(
                        "annotationComment", ""
                    )
                    page_label = ann_data.get("annotationPageLabel", "N/A")

                    web_link, zotero_link = build_annotation_link(
                        attachment_key, ann_data
                    )

                    doc_annotations.append(
                        {
                            "text": text.strip(),
                            "page": page_label,
                            "web_link": web_link,
                            "zotero_link": zotero_link,
                        }
                    )

        if doc_annotations:
            results.append(
                {"title": title, "key": item_key, "annotations": doc_annotations}
            )

    return results


def print_results(results):
    """Print results in readable format."""
    for doc in results:
        print("=" * 70)
        print(f"DOCUMENT: {doc['title']}")
        print("=" * 70)

        for i, ann in enumerate(doc["annotations"], 1):
            print(f"\n  [{i}] Page: {ann['page']}")
            print(f"      Text: {ann['text']}")
            print(f"      Web link: {ann['web_link']}")
            print(f"      Zotero link: {ann['zotero_link']}")
        print()


def save_markdown(results, filename="purple_annotations.md"):
    """Save results as a Markdown file."""
    with open(filename, "w", encoding="utf-8") as f:
        f.write("# Purple Annotations Export\n\n")

        for doc in results:
            f.write(f"## {doc['title']}\n\n")

            for i, ann in enumerate(doc["annotations"], 1):
                f.write(f"**{i}. Page {ann['page']}**\n\n")
                f.write(f"> {ann['text']}\n\n")
                f.write(f"- [Web link]({ann['web_link']})\n")
                f.write(f"- [Open in Zotero]({ann['zotero_link']})\n\n")

            f.write("---\n\n")

    print(f"Saved to {filename}")


if __name__ == "__main__":
    results = extract_purple_annotations()
    print_results(results)
    save_markdown(results)
