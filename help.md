# Livorno Prosopography - Database Guide

A historical prosopography database for researching persons, associations, institutions, companies, and their relationships.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Settings & Server](#settings--server)
3. [Entity Types and Relationships](#entity-types-and-relationships)
4. [Import & Export Data](#import--export-data)
5. [Basic Search](#basic-search)
6. [Search Scopes](#search-scopes)
7. [Multiple Scope Selection](#multiple-scope-selection)
8. [Regex Mode](#regex-mode)
9. [Advanced Query Syntax](#advanced-query-syntax)
10. [Search History](#search-history)
11. [Statistics Cards](#statistics-cards)
12. [Relationship Network](#relationship-network)
13. [Search Examples](#search-examples)
14. [Tips & Best Practices](#tips--best-practices)
15. [Troubleshooting](#troubleshooting)

---

## Getting Started

The application requires a local data server to run. The server stores each record as a JSON file on disk and exposes a REST API that the web app talks to.

### Requirements

You'll need to have Python installed.

### Launching

**Easiest way when on Mac:** Double-click **Livorno Prosopography.app** in the project folder. It will start the server and open the app in your default browser automatically. If the server is already running it will just open the browser.

**Manual way:**
```
python3 server/server.py
```
Then open `http://localhost:8081` in your browser.

**Custom port or data directory:**
```
python3 server/server.py --port 9000 --data-dir ~/MyPersons
```

### Server Status

The header shows a server status indicator:
- **● Server** in green — connected and responding
- **● Server** in red — cannot reach the configured server URL

If the indicator is red, open Settings and check the server URL or restart the server.

---

## Settings & Server

Open the settings panel with the **⚙ Settings** button in the header.

### Data Server URL

The most important setting. This is the base URL of the running server.

- Default: `http://localhost:8081`
- Can be any reachable host: `http://192.168.1.10:8081`
- Click **Test** to verify the connection before saving
- Click **Save Settings** to apply — the app will reconnect immediately

### Data Files

Each record is stored as a separate file named `{uuid}.json` in the server's data directory (default: `/Users/lvansnippenburg/Sources/Persons/`). The directory can be changed with `--data-dir` when starting the server.

**To start with a clean slate:** stop the server, empty the data directory, restart.

**To back up:** copy the data directory anywhere. The JSON files are self-contained.

---

## Entity Types and Relationships

### Entity Types

The database supports four types of entities:

**1. Person** (default)
- Individual historical figures
- Has gender field (Male/Female)
- Can have family relationships (father, mother, son, daughter, husband, wife, brother, sister)

**2. Association**
- Organizations, societies, guilds, clubs
- Icon: 🏛
- Name entered in "Lastname" field (Firstname optional)
- No gender field displayed

**3. Institution**
- Government bodies, churches, schools, hospitals
- Icon: 🏢
- Name entered in "Lastname" field (Firstname optional)
- No gender field displayed

**4. Company**
- Commercial enterprises, trading houses, banks
- Icon: 🏭
- Name entered in "Lastname" field (Firstname optional)
- No gender field displayed

### Relationship Types

**Family Relations (bidirectional):**
- Father ↔ Son/Daughter
- Mother ↔ Son/Daughter
- Husband ↔ Wife
- Brother ↔ Brother
- Sister ↔ Sister

*When you add a family relationship, the reciprocal is automatically created on the related record.*

**Organizational Relations (one-way):**
- **Member of**: Person is a member of an Association
- **Employed by**: Person is employed by an Institution or Company

*These are one-way — no reciprocal is created.*

**Social/Business Relations (bidirectional):**
- Associate ↔ Associate
- Business ↔ Business
- Friend ↔ Friend
- Neighbour ↔ Neighbour
- Other ↔ Other

### Working with Entities

**Creating an Entity:**
1. Click **"+ New Entity"** button
2. Select Entity Type from the dropdown
3. Fill in fields — the form adjusts per type (gender hidden for non-persons)
4. Click **Save** — the record is written to disk immediately

**Deleting a Record:**
Deletion is soft: the record is marked with a `deletedAt` timestamp and hidden from the main view. It remains on disk. Use **"Show Deleted"** in Settings to reveal deleted records.

**Filtering by Entity Type:**
- Click entity type stat cards (Persons, Associations, Institutions, Companies)
- Or use Advanced mode: `entityType:association`

---

## Import & Export Data

### Import Excel Files

Click **⬆ Import Excel** in the Settings panel. Importing always adds to or updates existing records — it never wipes the database.

The application supports two Excel formats:

**1. Original Format (Positional Columns):**
- Legacy format with 19 columns in a specific order
- No headers required
- Name variations in brackets: `Smith (Smit, Smythe)`
- Creates new records with generated UUIDs

**2. Exported Format (Named Columns):**
- Excel files previously exported from this application
- Has column headers (UUID, Lastname, Firstname, etc.)
- If a UUID matches an existing record → **updates that record**
- If UUID is missing or not found → **creates a new record**

**Import Tips:**

- Do not delete or modify the UUID column when re-importing exported files — it is used for matching
- Multi-value fields use semicolons: `value1; value2; value3`
- Relationships format: `type:personName; type:personName`
- Each imported record is saved to disk immediately

### Export Data

Click **⬇ Export** in the Settings panel. The export includes all currently displayed records — apply filters first to export a subset, or clear search to export everything.

**Excel (.xlsx):**
- One record per row, one field per column
- Multi-value fields (variations, relationships, references) separated by semicolons
- Filename: `livorno_prosopography_YYYY-MM-DDTHH-MM-SS.xlsx`

**JSON (.json):**
- Complete array of record objects with full structure preserved
- Filename: `livorno_prosopography_YYYY-MM-DDTHH-MM-SS.json`

**Round-trip editing:**
1. Export records to Excel
2. Edit in a spreadsheet (fix typos, add dates, etc.)
3. Re-import — UUID matching updates the correct records

---

## Basic Search

### Default Behaviour

By default, searches use **fuzzy matching on name fields only**:
- Lastname (including variations)
- Firstname (including variations)
- Patronymic

### Fuzzy Matching Types

| Match Type | Description | Example |
|------------|-------------|---------|
| **Exact** | Identical match | `Berg` matches "Berg" |
| **Prefix** | Starts with query | `Ber` matches "Berg", "Bernini" |
| **Contains** | Query found anywhere | `erg` matches "Berg", "Bergman" |
| **Soundex** | Sounds similar | `Smit` matches "Smith", "Schmitt" |
| **Levenshtein** | Within 2 edits (queries ≥3 chars) | `Bergh` matches "Berg" |

All searches are case-insensitive.

### Enabling Other Modes

| Mode | How to Enable | What It Does |
|------|---------------|--------------|
| **Scope selection** | Click the scope dropdown | Search specific fields |
| **Regex mode** | Click `.*` button | Use regular expressions |
| **Advanced mode** | Click `AND/OR` button | Use field:value with boolean operators |

---

## Search Scopes

Scopes limit your search to specific fields.

| Scope | Searches |
|-------|----------|
| **All Fields** | Every field (default) |
| **Name** | Lastname, firstname, patronymic + all variations |
| **Lastname** | Lastname + lastname variations |
| **Firstname** | Firstname + firstname variations |
| **Entity Type** | person, association, institution, company |
| **Patronymic** | Patronymic only |
| **Gender** | M or F |
| **Origin** | Geographic origin |
| **City** | City of residence |
| **Profession** | Occupation |
| **Religion** | Religious affiliation |
| **Timespan** | Firstseen–Lastseen (supports year queries) |
| **Notes** | Notes field |
| **References** | Zotero and Archief references |
| **Relationships** | Related persons' names and relationship types |

### How to Use

1. Click the **"Scope: All ▼"** button
2. Check the field(s) to search
3. Click **Apply**

When multiple scopes are selected, a record matches if it satisfies **any** scope (OR logic). Checking "All Fields" unchecks all others.

---

## Multiple Scope Selection

**Example:**
```
Scopes: Lastname, Origin
Query: "Berg"

Matches:
✓ Person with lastname "van der Berg"
✓ Person with origin "Bergen, Norway"
```

---

## Regex Mode

Click **".*"** to toggle regex mode (blue = active). Uses JavaScript regex syntax with the `i` (case-insensitive) flag.

| Pattern | Matches |
|---------|---------|
| `^van` | Starts with "van" |
| `Berg$` | Ends with "Berg" |
| `^van.*Berg$` | Starts with "van", ends with "Berg" |
| `\d{4}` | Any four-digit number |
| `(Jan\|Johan)` | "Jan" or "Johan" |
| `\bvan\b` | Word boundary "van" |

Invalid regex patterns are silently ignored.

---

## Advanced Query Syntax

Click **"AND/OR"** to toggle advanced mode (blue = active).

### Syntax

```
field:value AND field:value
field:value OR field:value
field:!value        (negation)
```

### Field Names

`lastname` · `firstname` · `patronymic` · `origin` · `city` · `profession` · `religion` · `timespan` · `notes` · `references` · `relationships` · `name` · `entityType` · `gender`

### Boolean Operators

**AND** — both conditions must be true:
```
city:Amsterdam AND profession:merchant
```

**OR** — either condition must be true:
```
city:Amsterdam OR city:Rotterdam
```

**! (negation)** — excludes matching records:
```
city:!Livorno
profession:!merchant AND profession:!banker
entityType:!person
```

### Operator Precedence

Operators evaluate left-to-right: `A AND B OR C` → `(A AND B) OR C`

Note: parentheses are not yet supported.

### Without Field Prefix

Queries without `field:` search all fields:
```
Berg AND Amsterdam
```

---

## Timespan Search

The **Timespan** scope searches `firstseen` and `lastseen` to find persons active during a period.

**Single year:**
```
1650
```
Finds persons where `firstseen ≤ 1650 ≤ lastseen`

**Year range:**
```
1630-1680
```
Finds persons whose entire active period falls within the range.

**With advanced mode:**
```
timespan:1630-1680 AND profession:merchant
```

### Handling Missing Dates

| Missing Field | Single Year | Range |
|---------------|-------------|-------|
| `firstseen` missing | Match if lastseen ≥ query year | Match if lastseen within range |
| `lastseen` missing | Match if firstseen ≤ query year | Match if firstseen within range |
| Both missing | No match | No match |

Year values are extracted from text automatically: `"circa 1650"` → 1650.

---

## Search History

Every search is automatically saved with its query, scopes, and timestamp.

- Click the **⏱** button in the search box to view history
- Maximum 20 entries — oldest auto-removed
- Duplicate queries move to the top
- Click an entry to restore the query and scopes
- Persists across browser sessions

---

## Statistics Cards

Click any card to filter the table by that value.

- **Total Entities** — all non-deleted records
- **Male / Female** — filters by gender
- **Relationships** — opens the Relationship Network modal
- **Object types** (toggle) — Persons, Associations, Institutions, Companies
- **Origin** (toggle) — one card per unique origin value
- **Religion** (toggle) — one card per unique religion value

---

## Relationship Network

Click the **Relationships** stat card to open the network modal. The network shows only entities from the **current filtered view** — use search first to narrow the set.

### Views

**List View:** Cards showing each entity and its relationships as coloured badges. Click a card to open that record.

**Graph View:** Interactive D3.js force-directed graph.
- Drag nodes to reposition
- Scroll to zoom (0.5× – 3×)
- Drag background to pan
- Click **📷 Save PNG** to export the graph

### Legend Filtering

Click any relationship type in the legend to toggle it. Works in both views simultaneously.

**Legend groups:**
- Family Relations: father, mother, son, daughter, husband, wife, brother, sister
- Organizational Relations: member, employed
- Other Relations: associate, business, friend, neighbour, other

### Livorno Indicator

Entities without "Livorno" in their city field appear at 60% opacity in both views.

---

## Search Examples

**All Dutch merchants (advanced):**
```
origin:Dutch AND profession:merchant
```

**Dutch merchants not in Amsterdam:**
```
origin:Dutch AND profession:merchant AND city:!Amsterdam
```

**Names starting with "van", ending with Berg/Burg (regex, lastname scope):**
```
^van.*(Berg|Burg)$
```

**Persons active in 1650:**
```
Scope: Timespan → 1650
```

**Merchants active between 1630 and 1680:**
```
timespan:1630-1680 AND profession:merchant
```

**Notes with 200+ characters (well-documented records):**
```
Scope: Notes, Regex ON → .{200,}
```

**Find all female persons in Amsterdam:**
```
gender:F AND city:Amsterdam
```

**Associations and institutions only:**
```
entityType:!person AND entityType:!company
```

**Find everyone related to a specific person:**
```
Scope: Relationships → Van der Berg
```

**References from the 1650s (regex, references scope):**
```
165\d
```

---

## Tips & Best Practices

**Search precision:**
- Use specific scopes rather than "All Fields"
- `profession:merchant` is more precise than searching "merchant" everywhere
- Add negations to exclude noise: `city:Livorno AND profession:!merchant`

**Iterative workflow:**
1. Start broad — search a name or profession
2. Review results
3. Narrow with scope or advanced syntax
4. Use search history to switch between queries

**Relationship navigation:**
- Click coloured relationship chips inside a record to jump directly to the related entity
- Open the network modal after filtering to see only the connections that matter

**Data quality checks:**
- Duplicate detection: search name variations of the same person
- Relationship consistency: search by relationship type to verify reciprocals

---

## Troubleshooting

### Server not connecting

- Check that `server.py` is running (`python3 server/server.py`)
- Open Settings and verify the Server URL
- Click **Test** to check reachability
- Server logs go to `/tmp/prosopography-server.log` when launched via the app

### "No results found"

1. Check for typos
2. Switch to "All Fields" scope
3. Disable regex mode temporarily
4. Try simpler search terms

### Regex not working

1. Confirm the `.*` button is highlighted (active)
2. Test your pattern at regex101.com
3. Remember: regex is case-insensitive by default

### Advanced query not working

1. Confirm the `AND/OR` button is highlighted
2. Use exact format: `field:value AND field:value`
3. Use lowercase field names
4. Parentheses are not yet supported

### Import creates duplicates

The UUID column in exported Excel files is what prevents duplicates on re-import. If you see duplicates, check that the UUID column was not deleted or modified before re-importing.

---

## Technical Details

### Architecture

The application is a client-side single-page app (vanilla JS) served by a local Python HTTP server. The server also handles all data via a simple REST API:

| Method | Endpoint | Action |
|--------|----------|--------|
| GET | `/api/records` | All records |
| GET | `/api/records/{uuid}` | Single record |
| PUT | `/api/records/{uuid}` | Create or update |
| DELETE | `/api/records/{uuid}` | Soft-delete (sets deletedAt) |

Each record is stored as `{uuid}.json` in the data directory. Files are written atomically (temp file → rename) so they are never corrupt.

### Search Architecture

- `refreshRecords(query)` — fetches all records from the server, then filters in-browser
- `searchInRecord(record, query, scopes)` — per-field matching
- `evaluateAdvancedQuery(record, query)` — boolean logic parser
- Debounced input: 280 ms delay

### Browser Storage

Only search history is stored in the browser (localStorage key `searchHistory`, max 20 entries). All record data lives on the server.

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires JavaScript ES6+, CSS Grid/Flexbox.

---

## Credits

Developed for historical prosopographical research of the Livorno migrant communities.

**Technologies:** Vanilla JavaScript (ES6+) · Python 3 (http.server) · D3.js v7 · SheetJS (xlsx)
