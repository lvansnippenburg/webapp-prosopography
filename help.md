# Livorno Prosopography - Database Guide

A comprehensive historical prosopography database application with advanced search capabilities for researching persons, associations, institutions, companies, and their relationships.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Entity Types and Relationships](#entity-types-and-relationships)
3. [Guest Mode](#guest-mode)
4. [Import & Export Data](#import--export-data)
5. [Basic Search](#basic-search)
6. [Search Scopes](#search-scopes)
7. [Multiple Scope Selection](#multiple-scope-selection)
8. [Regex Mode](#regex-mode)
9. [Advanced Query Syntax](#advanced-query-syntax)
10. [Search History](#search-history)
11. [Statistics Cards](#statistics-cards)
12. [Search Examples](#search-examples)
13. [Tips & Best Practices](#tips--best-practices)

---

## Quick Start

**Getting Help:**
- Click **"? Help"** button in header to view this documentation
- Click **"📄 License"** in Settings panel to view license information
- Help modal displays on the right side (or center on small screens)

**Basic Search:**
1. Type in the search box
2. Results update automatically (280ms delay)
3. Click any record to view details

**Filter by Field:**
1. Click **"Scope"** button
2. Select field(s) to search
3. Click **Apply**

**Use Patterns:**
1. Click **".*"** button (regex mode)
2. Enter regex pattern
3. Results match pattern

---

## Entity Types and Relationships

### Entity Types

The database supports four types of entities:

**1. Person** (default)
- Individual historical figures
- Has gender field (Male/Female)
- Can have family relationships (father, mother, son, daughter, husband, wife, brother, sister)
- Name displayed as: Firstname + Patronymic + Lastname

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

**Family Relations (8 types - bidirectional):**
- Father ↔ Son/Daughter
- Mother ↔ Son/Daughter
- Husband ↔ Wife
- Brother ↔ Brother
- Sister ↔ Sister

*Note: When you add a family relationship, the reciprocal is automatically created.*

**Organizational Relations (2 types - one-way):**
- **Member of**: Person is a member of an Association
- **Employed by**: Person is employed by an Institution or Company

*Note: These are one-way relationships. No reciprocal is created.*

**Social/Business Relations (5 types - bidirectional):**
- Associate ↔ Associate
- Business ↔ Business
- Friend ↔ Friend
- Neighbour ↔ Neighbour
- Other ↔ Other

*Note: Reciprocal relationships are automatically created.*

### Working with Entity Types

**Creating an Entity:**
1. Click "+ New Entity" button
2. Select Entity Type from dropdown (Person, Association, Institution, Company)
3. Form fields adjust based on type:
   - **Person**: All fields visible, "Lastname" label
   - **Other types**: Gender field hidden, "Name" label for lastname field

**Filtering by Entity Type:**
- Click on entity type stat cards (Persons, Associations, Institutions, Companies)
- Or search using scope selector: choose "Entity Type" scope
- Search terms: "person", "association", "institution", "company"

**Visual Indicators:**
- Table view shows entity icons: 🚹 (male), 🚺 (female), 🏛 (association), 🏢 (institution), 🏭 (company)
- Person picker shows entity type label and icon
- Modal title shows entity type: "Edit Person", "Edit Association", etc.

### Use Cases

**Tracking Memberships:**
- Add persons as "Member of" various associations
- Example: John Smith → Member of → Merchant Guild

**Employment Records:**
- Track persons employed by institutions or companies
- Example: Maria Rossi → Employed by → Bank of Livorno

**Organizational Networks:**
- Map relationships between persons and organizations
- View in relationship network graph
- Filter and analyze organizational affiliations

---

## Guest Mode

### Overview

The application offers two modes of operation:

- **Guest Mode (Read-Only)**: Browse and search the Livorno prosopography database without making changes
- **User Mode (Full Access)**: Full editing capabilities with personal Codeberg sync

### First Time Setup

When you first open the application, you'll be prompted to select a mode:

1. **Guest Mode**: 
   - Automatically loads data from the public Livorno Prosopography repository
   - All local data is replaced with the public dataset
   - No API keys or settings required
   - Perfect for exploring the database

2. **User Mode**: 
   - Full control over your own data
   - Can import, edit, create, and delete records
   - Requires Codeberg API configuration for sync
   - Changes are saved to your personal repository

### Guest Mode Features

**What you CAN do:**
- Browse all person records
- Search using all search modes (basic, regex, advanced)
- View person details and relationships
- Explore relationship networks (list and graph view)
- View statistics and filter by clicking stat cards
- **Pull updates from the public repository** (see below)
- Export data to Excel or JSON

**What you CANNOT do:**
- Create new person records
- Edit existing records
- Delete records
- Import Excel data
- Push to Codeberg (push button is disabled)
- Modify Codeberg settings

### Visual Indicators in Guest Mode

- **Header**: Shows "(Guest Mode)" next to the title
- **Settings Panel**: Displays "Guest Mode (Read-Only)" indicator
- **Disabled Buttons**: Push, Import, and New Entity buttons are greyed out
- **Enabled Buttons**: Pull button is active for updating data
- **Person Modal**: Shows "View Person (Read-Only)" instead of "Edit Person"
- **All Inputs**: Form fields are disabled and cannot be modified

### Switching Modes

You can switch between Guest and User mode at any time:

1. Open the **Settings** panel (⚙ button)
2. Click **"Switch Mode"** button
3. Confirm the mode switch
4. The application will reload

**⚠️ Warning**: Switching modes will reload the application. In Guest Mode, switching will replace your local data with the public repository data.

### Guest Mode Data Source

Guest mode automatically loads data from:
- **Repository**: `codeberg.org/lvansnippenburg/json_storage`
- **Branch**: `LivornoProsopography`
- **Access**: Public (no authentication required)

The data is loaded directly into your browser's local IndexedDB and updates are automatic on first load.

### Updating Guest Data

In Guest Mode, you can pull updates from the public repository using the **↓ Pull** button:

**Two Update Options:**

1. **Replace All Data**
   - Clears your local IndexedDB completely
   - Downloads all records from the public repository
   - Use this for a fresh start or if you want the exact repository state
   - **Warning**: Any local changes or notes will be lost

2. **Update Existing Only**
   - Keeps your local data intact
   - Only updates records that exist in both local and remote
   - Adds new records from repository that don't exist locally
   - Compares modification dates and only updates if remote is newer
   - Skips records where local version is newer or same
   - Safe option that preserves local state while getting updates

**When to Use Each:**

- **Replace All**: First time setup, or when you want to reset to official data
- **Update Existing**: Regular updates to get latest changes while keeping your workspace

**Example Workflow:**
```
1. Open Settings panel (⚙ button)
2. Click "↓ Pull" button
3. Choose "Update Existing Only"
4. Wait for update to complete
5. See summary: "Updated 15 records, added 3 new records, skipped 120 unchanged"
6. View refreshed data in table
```

**Update Summary:**
- Shows how many records were updated (remote newer than local)
- Shows how many new records were added
- Shows how many were skipped (local same or newer)
- Automatic refresh after completion

---

## Import & Export Data

### Import Excel Files

The application supports two Excel import formats:

**1. Original Format (Positional Columns):**
- Legacy format with 19 columns in specific order
- No headers required
- Name variations in brackets: `Smith (Smit, Smythe)`
- Creates new records with generated UUIDs

**2. Exported Format (Named Columns):**
- Excel files exported from this application
- Has column headers (UUID, Lastname, Firstname, etc.)
- Includes UUID column for record identification
- **Updates existing records** if UUID matches
- Creates new records if UUID is missing or not found

### Import Behavior

**When importing exported files:**
1. Application detects format by checking for "UUID" column header
2. For each row:
   - If UUID exists and matches existing record → **Updates that record**
   - If UUID is missing or not found → **Creates new record**
3. Multi-value fields (variations, relationships, references) are parsed from semicolon-separated strings
4. Timestamps: `createdAt` preserved from original, `modifiedAt` updated to import time

**Import Options:**
- **Append to existing**: Adds/updates records, keeps non-matching records
- **Delete all & import**: Removes all existing records first, then imports
- **Cancel**: Aborts import operation

**What Gets Updated:**
All fields are updated when a UUID match is found:
- Names and variations
- Personal details
- Dates and references
- Relationships
- Notes

### Import Use Cases

**Round-Trip Editing:**
1. Export records to Excel
2. Edit data in spreadsheet (add variations, fix typos, update dates)
3. Re-import to update database
4. UUID matching ensures correct records are updated

**Collaborative Editing:**
1. Team member exports subset of records
2. Edits in Excel and shares file
3. Another team member imports to update their database
4. Only modified records are affected

**Data Migration:**
- Import legacy data using original format
- Import updated data using exported format
- Merge data from multiple sources

**Bulk Updates:**
- Export filtered records
- Make bulk changes in Excel (e.g., add religion to all Amsterdam merchants)
- Re-import to apply changes

### Import Tips

**Preserve UUIDs:**
- Do NOT delete or modify the UUID column when editing exported files
- UUIDs ensure correct record matching on import
- Missing UUIDs will create duplicate records

**Relationships:**
- Format: `type:personName` separated by semicolons
- Example: `father:John Smith; brother:Peter Smith`
- Note: `personUuid` is not preserved in Excel (only name and type)
- Relationships may need manual verification after import

**Multi-Value Fields:**
- Separate values with semicolons: `value1; value2; value3`
- Works for: variations, relationships, Zotero, Archief
- Spaces after semicolons are optional

**Guest Mode:**
- Import is disabled in Guest Mode
- Switch to User Mode to import data

---

## Export Data

### Overview

Export your current selection of records to Excel or JSON format. The export will include all currently displayed records (after applying search filters, scopes, and deleted record filters).

### How to Export

1. Open the **Settings** panel (⚙ button)
2. Click the **"⬇ Export"** button
3. Choose your export format:
   - **Excel (.xlsx)**: Spreadsheet format with all fields in separate columns
   - **JSON (.json)**: Complete data export with full structure

### What Gets Exported

**All Fields Included:**
- UUID (unique identifier)
- Names (lastname, firstname, patronymic)
- Name variations (lastname and firstname variations)
- Personal details (gender, city, profession, origin, religion)
- Dates (firstseen, lastseen, mocosince, yob, yod, bornin, diedin)
- Notes
- Relationships (with type and related person name)
- References (Zotero and Archief)
- Metadata (createdAt, modifiedAt, deletedAt)

### Export Formats

**Excel Format:**
- Each record is a row
- Each field is a column
- Multi-value fields (variations, relationships, references) are separated by semicolons (`;`)
  - Example variations: `"merchant; banker; trader"`
  - Example relationships: `"father:John Smith; brother:Peter Smith"`
  - Example references (Zotero/Archief): `"reference1; reference2; reference3"` (only the reference field is exported, not year or remarks)
- Column widths are automatically sized for readability
- Filename: `livorno_prosopography_YYYY-MM-DD-HHMMSS.xlsx`

**JSON Format:**
- Complete array of record objects
- Full data structure preserved (arrays, nested objects)
- Human-readable formatting (indented)
- Compatible with data import/sync tools
- Filename: `livorno_prosopography_YYYY-MM-DD-HHMMSS.json`

### Export Use Cases

**Data Analysis:**
- Import Excel file into statistical software
- Create pivot tables and charts
- Perform bulk data analysis

**Backup:**
- Export all records (clear search first) as JSON
- Store complete backup offline
- Version control for research data

**Collaboration:**
- Share filtered subsets with research team
- Export specific cohorts (e.g., merchants from Amsterdam)
- Provide data for publications

**Data Migration:**
- JSON export for importing into other systems
- Full data structure for database migration
- API integration with other tools

### Tips

**Export Current Selection:**
- Apply filters/search first to export specific records
- Check record count in dialog: "Export N records"
- Clear search to export all records

**Excel Multi-Value Fields:**
- Use "Text to Columns" feature with semicolon delimiter
- Split relationships into separate rows for analysis
- Formula example: `=TRIM(MID(SUBSTITUTE(A1,";",REPT(" ",100)),1,100))` for first value

**Re-Import for Updates:**
- Export, edit in Excel, and re-import to update records
- UUIDs ensure correct record matching
- See "Import & Export Data" section for details

**JSON Editing:**
- JSON can be edited and re-imported (User Mode only)
- Useful for bulk updates via scripts
- Maintain UUID field for proper record matching

**Guest Mode:**
- Export is available in both Guest and User modes
- Use export to save research findings
- Create local copies of filtered datasets

**Entity Types:**
- Entity Type field is included in both Excel and JSON exports
- Default value is "person" for legacy records
- Values: "person", "association", "institution", "company"

---

## Basic Search

### Default Behavior

By default (when no scope, regex, or advanced mode is enabled), searches use **fuzzy matching on name fields only**:

- Lastname (including variations)
- Firstname (including variations)
- Patronymic

This is the same search performed when you click "New Entity" and start typing in the lastname field.

### Fuzzy Matching Types

The default search uses multiple matching strategies, in order of priority:

| Match Type | Description | Example |
|------------|-------------|---------|
| **Exact** | Identical match | `Berg` matches "Berg" |
| **Prefix** | Starts with query | `Ber` matches "Berg", "Bernini" |
| **Contains** | Query found anywhere | `erg` matches "Berg", "Bergman" |
| **Soundex** | Sounds similar | `Smit` matches "Smith", "Schmitt" |
| **Levenshtein** | Within 2 edits (for queries ≥3 chars) | `Bergh` matches "Berg" |

### Case-Insensitive

All searches are **case-insensitive**:
- `berg` matches "Berg", "BERG", "van der Berg"
- `smith` matches "Smith", "SMITH", "Smyth" (via soundex)

### When to Use Other Modes

To search fields beyond names, enable one of the following:

| Mode | How to Enable | What It Does |
|------|---------------|--------------|
| **Scope selection** | Click scope dropdown | Search specific fields |
| **Regex mode** | Click `.*` button | Use regular expressions |
| **Advanced mode** | Click `AND/OR` button | Use field:value syntax with boolean operators |

---

## Search Scopes

### What are Scopes?

Scopes limit your search to specific fields, making searches faster and more precise.

### Available Scopes

| Scope | Searches |
|-------|----------|
| **All Fields** | Every field (default) |
| **Name** | Lastname, firstname, patronymic + all variations |
| **Lastname** | Lastname + lastname variations |
| **Firstname** | Firstname + firstname variations |
| **Entity Type** | Entity type (person, association, institution, company) |
| **Patronymic** | Patronymic only |
| **Gender** | Gender field (M for male, F for female) |
| **Origin** | Geographic origin |
| **City** | City of residence |
| **Profession** | Occupation/profession |
| **Religion** | Religious affiliation |
| **Timespan** | Firstseen-Lastseen date range (supports year queries) |
| **Notes** | Notes/remarks field |
| **References** | Zotero and Archief references |
| **Relationships** | Related persons' names + relationship types |

### How to Use

1. Click **"Scope: All ▼"** button
2. Check the field(s) you want to search
3. Click **Apply**
4. Search query now only checks selected fields

### Scope Display

The scope button shows your current selection:
- **"Scope: All"** - All fields
- **"Scope: Name"** - Single field
- **"Scope: 3 fields"** - Multiple fields selected

---

## Multiple Scope Selection

### OR Logic

When multiple scopes are selected, records match if they satisfy **ANY** scope (OR logic).

**Example:**
```
Scopes: Lastname, Origin
Query: "Berg"

Matches:
✓ Person with lastname "van der Berg"
✓ Person with origin "Bergen, Norway"
✓ Person with both
```

### All Fields Override

Checking **"All Fields"** automatically unchecks all other scopes and searches everywhere.

### No Selection

If you uncheck everything and click Apply, it defaults back to **"All Fields"**.

---

## Regex Mode

### Enable Regex

Click the **".*"** button to toggle regex mode.
- **Active:** Blue background, white text
- **Inactive:** Transparent background

### Regex Syntax

Use JavaScript regular expression syntax:

| Pattern | Matches |
|---------|---------|
| `^van` | Starts with "van" |
| `Berg$` | Ends with "Berg" |
| `^van.*Berg$` | Starts with "van", ends with "Berg" |
| `\d{4}` | Four-digit number (year) |
| `(Jan\|Johan)` | "Jan" OR "Johan" |
| `[A-Z]{2,}` | Two or more uppercase letters |
| `\bvan\b` | Word boundary "van" |
| `.+@.+` | Contains @ (email pattern) |

### Case Sensitivity

Regex mode uses case-insensitive flag (`i`), so:
- `berg` matches "Berg", "BERG", "bergen"

### Error Handling

Invalid regex patterns are silently ignored - search continues with other records.

### Examples

**Find names starting with "van":**
```
Scope: Lastname
Regex: ON
Query: ^van
```

**Find 4-digit years in notes:**
```
Scope: Notes
Regex: ON
Query: \b\d{4}\b
```

**Find variations of Johann/Jan/Johan:**
```
Scope: Firstname
Regex: ON
Query: ^Joh?ann?
```

---

## Advanced Query Syntax

### Enable Advanced Mode

Click the **"AND/OR"** button to toggle advanced query mode.
- **Active:** Blue background, white text
- **Inactive:** Transparent background

### Syntax

```
field:value AND field:value
field:value OR field:value
field:!value  (negation - NOT this value)
```

### Field Names

Use the lowercase scope names as field names:

- `lastname:value`
- `firstname:value`
- `patronymic:value`
- `origin:value`
- `city:value`
- `profession:value`
- `religion:value`
- `timespan:value` (year or year-range)
- `notes:value`
- `references:value`
- `relationships:value`
- `name:value` (searches all name fields)
- `entityType:value`
- `gender:value`

### Boolean Operators

**AND** - Both conditions must be true:
```
city:Amsterdam AND profession:merchant
```
→ Must be in Amsterdam AND be a merchant

**OR** - Either condition must be true:
```
city:Amsterdam OR city:Rotterdam
```
→ In Amsterdam OR Rotterdam (or both)

### Negation Operator

**! (exclamation mark)** - Excludes records with the specified value:

**Syntax:**
```
field:!value
```

**Examples:**

**Exclude a specific city:**
```
city:!Livorno
```
→ All persons NOT in Livorno

**Exclude a gender:**
```
gender:!M
```
→ All non-male persons (female or unspecified)

**Exclude a profession:**
```
profession:!merchant
```
→ All persons who are NOT merchants

**Combined with AND:**
```
city:Amsterdam AND profession:!merchant
```
→ Amsterdam residents who are NOT merchants

**Combined with OR:**
```
city:!Livorno OR city:!Amsterdam
```
→ Persons NOT in Livorno OR NOT in Amsterdam

**Multiple exclusions:**
```
profession:!merchant AND profession:!banker
```
→ Persons who are neither merchants nor bankers

**Exclude entity type:**
```
entityType:!person
```
→ Only associations, institutions, and companies (not persons)

### Mixing Operators

Operators evaluate **left-to-right**:
```
A AND B OR C
→ (A AND B) OR C
```

### Without Field Prefix

Queries without `field:` search all fields:
```
Berg AND Amsterdam
```
→ "Berg" appears somewhere AND "Amsterdam" appears somewhere

### Case Sensitivity

- Operators (`AND`, `OR`) are case-insensitive
- Field values use standard case-insensitive matching
- Can be combined with regex mode for case-sensitive patterns

### Examples

**Dutch merchants:**
```
origin:Dutch AND profession:merchant
```

**Amsterdam or Rotterdam residents:**
```
city:Amsterdam OR city:Rotterdam
```

**Protestant merchants in Amsterdam:**
```
city:Amsterdam AND profession:merchant AND religion:Protestant
```

**Anyone named Berg in Livorno:**
```
lastname:Berg AND city:Livorno
```

**Complex queries:**
```
(origin:Dutch OR origin:Flemish) AND profession:trader
```
Note: Parentheses not yet supported - this won't work as expected.
Workaround: Use multiple searches or regex.

---

## Search History

### Automatic Tracking

Every search is automatically saved with:
- Query text
- Selected scopes
- Timestamp

### Access History

Click the **⏱** (clock) button in the search input to view history.

### Features

- **Maximum 20 entries** - Oldest auto-removed
- **Deduplication** - Repeated searches move to top
- **Persistent** - Survives browser refresh
- **Click to restore** - Applies query + scopes

### History Display

```
merchant
profession, city • 12/15/2024
```

### Use Cases

- Quickly repeat complex searches
- Track research queries over time
- Share search patterns with colleagues (via export)

---

## Statistics Cards

### Overview

Statistics cards provide quick access to common filters and data insights.

### Card Types

**Demographics:**
- **Total Persons** - All non-deleted records
- **Male** - Gender = M
- **Female** - Gender = F
- **Relationships** - Total relationship count (hover for breakdown)

**Geography (Dynamic):**
- One card per unique **Origin** value
- Alphabetically sorted
- Shows count per origin

**Religion (Dynamic):**
- One card per unique **Religion** value
- Alphabetically sorted
- Shows count per religion

### Click to Filter

Clicking any card:
1. Sets search query to that value
2. Sets scope to appropriate field
3. Filters results immediately

**Example:**
- Click "Catholic: 45" → Searches "Catholic" in Religion scope

### Hover Tooltips

**Relationships card** shows breakdown on hover:
```
father: 23
mother: 21
son: 34
daughter: 29
...
```

---

## Relationship Network

### Overview

The Relationship Network modal provides two ways to visualize and explore relationships between entities:
- **List View**: Cards showing each person and their relationships
- **Graph View**: Interactive D3.js force-directed network graph

**Important**: The network displays only entities from the **current filtered view** in the main table. Use search and filters to narrow down the network before opening it.

### Opening the Network

Click on the **"Relationships"** stat card to open the Relationship Network modal.

**The network will show:**
- Only entities currently displayed in the table
- Only relationships between those visible entities
- Respects all active filters, search queries, and scopes

### Legend Filtering

**Interactive Legend:**
- All relationship types are displayed by default
- Click any relationship type in the legend to toggle it on/off
- **Active types**: Full opacity (100%)
- **Hidden types**: Dimmed appearance (60% opacity)
- Tooltip shows current state: "Click to hide" or "Click to show"

**How to Filter:**
1. Open Relationship Network modal
2. Click on any relationship type in the legend
3. That type disappears from both List and Graph views
4. Click again to show it

**Legend Groups:**
- **Family Relations**: father, mother, son, daughter, husband, wife, brother, sister
- **Organizational Relations**: member, employed
- **Other Relations**: associate, business, friend, neighbour, other

### List View Features

- Displays person cards with all their relationships
- Relationships shown as colored badges
- Format: `type: Person Name`
- Click any card to open person details
- Respects legend filters in real-time

### Graph View Features

**Interactive Elements:**
- **Nodes**: Persons/entities (circles)
- **Edges**: Relationships (colored lines with arrows)
- **Drag nodes**: Click and drag to reposition
- **Zoom**: Mouse wheel to zoom in/out (0.5x to 3x)
- **Pan**: Click and drag background

**Visual Indicators:**
- Node colors: Ice blue (#5a9db5)
- Edge colors: Match relationship type colors from legend
- Arrows show relationship direction
- Hover over nodes for highlight effect

**Entity Icons in Nodes:**
- Persons: No icon
- Associations: 🏛 icon
- Institutions: 🏢 icon  
- Companies: 🏭 icon

### Use Cases

**Analyze a Specific Subset:**
1. Use search to filter entities (e.g., "Amsterdam merchants")
2. Open Relationship Network
3. See only relationships within that subset
4. Switch views and toggle types as needed

**Focus on Family Only:**
1. Filter entities as desired (optional)
2. Open network modal
3. Click to hide all "Organizational Relations" types
4. Click to hide all "Other Relations" types
5. View only family tree structure within filtered set

**Analyze Memberships:**
1. Search for persons with mocosince field (optional filter)
2. Open network modal
3. Hide all types except "Member of"
4. See which filtered persons belong to which associations
5. Identify popular organizations

**Employment Patterns:**
1. Filter by profession or city (optional)
2. Open network modal
3. Hide all except "Employed by"
4. View employer-employee networks in filtered set
5. Identify major institutions/companies

**Compare Relationship Types:**
1. Apply desired entity filters
2. Open network modal
3. Show only 2-3 specific types
4. Switch to Graph View
5. Analyze patterns and clusters in filtered dataset

### Livorno Indicator

In both views, persons without "Livorno" in their city field appear at 60% opacity, making it easy to identify non-Livorno residents.

---

## Search Examples

### Example 1: Find All Dutch Merchants

**Method 1 - Multiple Scopes:**
```
1. Click "Scope" button
2. Select "Origin" + "Profession"
3. Click Apply
4. Type: "Dutch merchant"
```
Result: Finds "Dutch" in origin OR "merchant" in profession

**Method 2 - Advanced Syntax:**
```
1. Click "AND/OR" button
2. Type: origin:Dutch AND profession:merchant
```
Result: Finds persons who are BOTH Dutch AND merchants

**Method 3 - With Exclusions:**
```
1. Click "AND/OR" button
2. Type: origin:Dutch AND profession:merchant AND city:!Amsterdam
```
Result: Dutch merchants NOT in Amsterdam

### Example 2: Find Name Variations

**Using Regex:**
```
1. Click "Scope" → Select "Lastname"
2. Click ".*" (regex)
3. Type: ^van.*(Berg|Burg)$
```
Result: Lastnames starting with "van", ending with "Berg" or "Burg"
- van der Berg ✓
- van den Burg ✓
- van Rosenberg ✗ (doesn't end with Berg/Burg)

### Example 3: Amsterdam Business Network

**Advanced Query:**
```
1. Click "AND/OR"
2. Type: city:Amsterdam AND (profession:merchant OR profession:trader)
```
Note: Parentheses don't work yet. Workaround:

**Two Searches:**
```
Search 1: city:Amsterdam AND profession:merchant
Search 2: city:Amsterdam AND profession:trader
```

### Example 4: Gender-Based Search

**Find all male persons:**
```
1. Click "Scope" → Select "Gender"
2. Type: M
```
Result: All male persons

**Or click the stat card:**
```
Click "Male (persons)" stat card
```
Result: Automatically searches for M in Gender scope

**Find all female persons:**
```
1. Click "Scope" → Select "Gender"
2. Type: F
```
Result: All female persons

**Advanced Query with Gender:**
```
1. Click "AND/OR"
2. Type: gender:F AND city:Amsterdam
```
Result: All female persons in Amsterdam

### Example 5: Research Documentation

**Find persons with extensive notes:**
```
1. Click "Scope" → Select "Notes"
2. Click ".*" (regex)
3. Type: .{200,}
```
Result: Notes with 200+ characters (well-documented persons)

### Example 6: Relationship Networks

**View Relationship Network:**
```
1. Click on "Relationships" stat card
2. Choose between List View or Graph View
3. Click legend items to filter by relationship type
```

**Filter by Relationship Type:**
- All relationship types shown by default
- Click any type in legend to hide those relationships
- Dimmed types (opacity 0.6) are hidden
- Click again to show them
- Works in both List and Graph views

**Find all fathers:**
```
1. Click "Scope" → Select "Relationships"
2. Type: father
```
Result: All persons who have/are fathers

**Find specific relationship:**
```
1. Click "Scope" → Select "Relationships"
2. Type: Maria van der Berg
```
Result: Everyone related to Maria van der Berg

### Example 7: Year-Based Search

**Find references from 1650s:**
```
1. Click "Scope" → Select "References"
2. Click ".*" (regex)
3. Type: 165\d
```
Result: References with years 1650-1659

### Example 8: Multi-City Search

**Find persons in major cities:**
```
1. Click "Scope" → Select "City"
2. Click ".*" (regex)
3. Type: (Amsterdam|Rotterdam|Livorno)
```
Result: Persons in any of the three cities

### Example 9: Relationship Network Filtering

**View only family relationships:**
```
1. Open Relationship Network modal
2. In legend, click all "Organizational Relations" types to hide
3. In legend, click all "Other Relations" types to hide
4. Only "Family Relations" remain visible
```

**View organizational memberships only:**
```
1. Open Relationship Network modal
2. Click all types except "Member of" and "Employed by"
3. See only organizational affiliations
```

**Compare two relationship types:**
```
1. Open Relationship Network modal
2. Hide all types except the two you want to compare
3. Switch to Graph View to visualize patterns
```

### Example 10: Exclusion Searches

**Find non-Livorno residents:**
```
1. Click "AND/OR" button
2. Type: city:!Livorno
```
Result: All persons not in Livorno

**Find non-merchants in Amsterdam:**
```
1. Click "AND/OR" button
2. Type: city:Amsterdam AND profession:!merchant
```
Result: Amsterdam residents excluding merchants

**Find persons with no gender specified:**
```
1. Click "AND/OR" button
2. Type: gender:!M AND gender:!F
```
Result: Records without gender information

**Find associations and institutions only:**
```
1. Click "AND/OR" button
2. Type: entityType:!person AND entityType:!company
```
Result: Only associations and institutions

**Exclude multiple professions:**
```
1. Click "AND/OR" button
2. Type: city:Amsterdam AND profession:!merchant AND profession:!banker
```
Result: Amsterdam residents who are neither merchants nor bankers

### Example 11: Timespan Searches

**Find persons active in 1650:**
```
1. Click "Scope" → Select "Timespan"
2. Type: 1650
```
Result: Persons where firstseen ≤ 1650 ≤ lastseen

**Find persons active between 1630-1680:**
```
1. Click "Scope" → Select "Timespan"
2. Type: 1630-1680
```
Result: Persons whose entire active period is within 1630-1680

**Advanced timespan query:**
```
1. Click "AND/OR"
2. Type: timespan:1630-1680 AND profession:merchant
```
Result: Merchants whose career was entirely within 1630-1680

---

## Timespan Search Details

### How Timespan Search Works

The **Timespan** scope searches the `firstseen` and `lastseen` fields to find persons active during specific time periods.

### How to Activate Timespan Search

To use timespan searches, you need to do one of the following:

1. **Select the timespan scope** - Click the scope dropdown and select "Timespan"
2. **Use advanced mode** - Enable the AND/OR button and use `timespan:value` syntax
3. **Search all fields** - Have "All" selected as the search scope (default)

| Method | Example Query |
|--------|---------------|
| Timespan scope selected | `1650` |
| Advanced mode | `timespan:1650` |
| Advanced mode with conditions | `timespan:1630-1680 AND city:Livorno` |
| All fields (default) | `1650` |

### Query Formats

**Single Year:**
```
1650
```
Finds persons where: `firstseen ≤ 1650 ≤ lastseen`

**Year Range:**
```
1630-1680
```
Finds persons whose **entire active period falls within** the query range.

Containment logic: `person.firstseen ≥ 1630 AND person.lastseen ≤ 1680`

### Examples

**Person Record:**
```
Firstseen: 1645
Lastseen: 1670
```

**Query Results:**
- `1650` → ✓ Match (1645 ≤ 1650 ≤ 1670)
- `1630-1680` → ✓ Match (1645 ≥ 1630 AND 1670 ≤ 1680)
- `1650-1670` → ✓ Match (contained within)
- `1640-1650` → ✗ No match (lastseen 1670 exceeds 1650)
- `1671-1680` → ✗ No match (firstseen 1645 before 1671)
- `1640` → ✗ No match (not within timespan)

### Handling Missing Data

When `firstseen` or `lastseen` is missing from a record:

| Missing Field | Single Year Query | Range Query |
|---------------|-------------------|-------------|
| `firstseen` missing | Match if lastseen ≥ query year | Match if lastseen within range |
| `lastseen` missing | Match if firstseen ≤ query year | Match if firstseen within range |
| **Both missing** | **No match** | **No match** |

**Important:** Records with no timespan data (both `firstseen` and `lastseen` empty) are **excluded** from all timespan search results. This ensures that only records with actual date information appear in time-based queries.

**Detailed Behavior:**

For **single year queries** (e.g., `1650`):
- Both dates available: Query year must be within person's timespan (`firstseen ≤ 1650 ≤ lastseen`)
- Only `firstseen` available: Person's firstseen must be ≤ query year
- Only `lastseen` available: Person's lastseen must be ≥ query year
- Both missing: **Excluded from results**

For **range queries** (e.g., `1630-1650`):
- Both dates available: Person's entire timespan must fall within the range
- Only `firstseen` available: firstseen must be within the query range
- Only `lastseen` available: lastseen must be within the query range
- Both missing: **Excluded from results**

**Examples:**
```
Person: firstseen=1640, lastseen=1660
Query: 1630-1650
→ ✗ No match (lastseen 1660 exceeds range end 1650)

Person: firstseen=1640, lastseen=null
Query: 1630-1650
→ ✓ Match (firstseen 1640 is within 1630-1650)

Person: firstseen=1676, lastseen=null
Query: 1630-1650
→ ✗ No match (firstseen 1676 is outside 1630-1650)

Person: firstseen=null, lastseen=1640
Query: 1630-1650
→ ✓ Match (lastseen 1640 is within 1630-1650)

Person: firstseen=null, lastseen=null
Query: 1630-1650
→ ✗ No match (no timespan data)
```

**Year Extraction:**
- Automatically extracts 4-digit years from field text
- `"circa 1650"` → extracts 1650
- `"1650-1651"` → extracts first year (1650)
- `"early 17th century"` → no extraction, no match

### Use Cases

**Research Applications:**
1. **Historical events:** Find persons active during specific events (e.g., `1648` for Peace of Westphalia)
2. **Generational studies:** Identify contemporaries within a decade (`1650-1660`)
3. **Career analysis:** Track professional activity periods
4. **Migration patterns:** Correlate movement with time periods
5. **Cohort analysis:** Combine with other fields (`timespan:1630-1680 AND profession:merchant`)

### Quick Reference

| Query | Finds |
|-------|-------|
| `1650` | People active in 1650 |
| `1630-1680` | People whose entire active period is within 1630-1680 |
| `timespan:1650` | Same as above (advanced mode) |
| `timespan:1630-1680 AND city:Livorno` | People active within range AND in Livorno |
| `timespan:1650 AND profession:merchant` | Merchants active in 1650 |

---

## Tips & Best Practices

### Search Performance

**Narrow Your Scope:**
- Use specific scopes instead of "All Fields"
- Single scope = 7.5x faster than all fields
- Multiple scopes still faster than "All"

**Use Regex Wisely:**
- Simple text faster than complex regex
- Avoid overly broad patterns like `.*`
- Test regex on small datasets first

### Search Accuracy

**Be Specific:**
- `van Berg` better than just `Berg`
- `profession:merchant` better than searching "merchant" everywhere

**Check Variations:**
- Search "Jan" might miss "Johan", "Johannes"
- Use regex: `Joh?ann?e?s?` or multiple searches

**Use Advanced Syntax for Precision:**
- `city:Amsterdam AND profession:merchant` (exact)
- vs. "Amsterdam merchant" (loose - might match "merchant from Rotterdam who visited Amsterdam")

**Use Negation for Exclusions:**
- `city:!Livorno` excludes Livorno residents
- `profession:!merchant AND profession:!banker` excludes multiple professions
- More efficient than complex regex patterns for exclusions
- Combine with AND/OR for complex queries

### Research Workflows

**Iterative Search:**
1. Start broad: Search "merchant"
2. Review results
3. Narrow: Add origin or city
4. Refine further with advanced queries

**Document Your Searches:**
- Search history tracks recent queries
- Copy complex queries to external notes
- Share queries with research team

**Leverage Statistics:**
- Review origin/religion cards for data overview
- Click cards for quick filtering
- Hover relationships for network insights

### Data Quality

**Search to Find Gaps:**
- Empty religion: `religion:^$` (regex for empty field - not yet implemented)
- Incomplete records: Search for placeholder text
- Duplicates: Search variations of same name

**Relationship Consistency:**
- Search for specific relationships to verify networks
- Use relationship chips to navigate connections
- Check bidirectional consistency (father ↔ son)

---

## Keyboard Shortcuts

Currently not implemented, but planned:
- `Ctrl/Cmd + K` - Focus search
- `Ctrl/Cmd + Shift + S` - Open scope selector
- `Ctrl/Cmd + H` - Show search history
- `Esc` - Clear search / close modals

---

## Troubleshooting

### "No results found"

**Possible causes:**
1. **Typo** - Check spelling
2. **Wrong scope** - Verify you're searching the right field
3. **Regex error** - Invalid pattern fails silently
4. **Too specific** - Try broader terms

**Solutions:**
- Switch to "All Fields" scope
- Disable regex mode temporarily
- Try simpler search terms
- Check search history for working queries

### Regex not working

**Common issues:**
1. **Regex mode not enabled** - Check ".*" button is blue
2. **Invalid syntax** - Test pattern at regex101.com
3. **Case sensitivity** - Regex is case-insensitive by default

### Advanced query not working

**Common issues:**
1. **Advanced mode not enabled** - Check "AND/OR" button is blue
2. **Syntax error** - Use exact format: `field:value AND field:value`
3. **Invalid field name** - Use lowercase scope names
4. **Parentheses** - Not yet supported

### Search too slow

**Optimizations:**
1. Use specific scopes (not "All Fields")
2. Simplify regex patterns
3. Break complex queries into smaller searches
4. Check browser performance (close other tabs)

---

## Data Sync & Search

### Codeberg Integration

All searches work on **local data only** - they don't query Codeberg.

**Workflow:**
1. Pull from Codeberg (download records)
2. Search locally (instant)
3. Edit records
4. Push to Codeberg (upload changes)

### Search After Sync

After pulling from Codeberg:
- All new records immediately searchable
- Search indexes update automatically
- Statistics refresh automatically

---

## Future Features

Planned enhancements:
- [ ] Parentheses in advanced queries
- [ ] Save search presets with names
- [ ] Export search results to Excel
- [ ] Highlight matches in results table
- [ ] Fuzzy matching toggle (soundex)
- [ ] Date range queries: `year:1650-1700`
- [ ] Numeric comparisons: `age:>50`
- [ ] NOT operator: `NOT city:Amsterdam`
- [ ] Search result count per scope
- [ ] Search performance metrics

---

## Getting Help

### In-App Help

- Hover over buttons for tooltips
- Check scope modal for field descriptions
- Review search history for working examples

### Documentation

- This README for comprehensive search guide
- Code comments for technical details
- GitHub issues for bug reports

### Community

- Share complex queries with team
- Document successful search patterns
- Report edge cases and bugs

---

## Technical Details

### Search Architecture

**Components:**
- `refreshRecords(query)` - Main search function
- `searchInRecord(record, query, scopes)` - Field-level matching
- `evaluateAdvancedQuery(record, query)` - Boolean logic parser

**Performance:**
- Debounced input: 280ms delay
- Indexed fields: lastname, modifiedAt (IndexedDB)
- In-memory filtering: ~200 records in <50ms
- Regex compilation: Per-query (not cached)

### Storage

**LocalStorage Keys:**
- `searchHistory` - Array of {query, scopes, timestamp}
- Maximum 20 entries, oldest auto-removed

**Data Structure:**
```json
{
  "query": "merchant",
  "scopes": ["profession", "city"],
  "timestamp": "2024-12-15T14:30:00.000Z"
}
```

### Browser Compatibility

**Tested:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Requirements:**
- JavaScript ES6+
- LocalStorage
- IndexedDB
- CSS Grid/Flexbox

---

## Version History

### v1.0 (December 2024)
- ✅ Multiple scope selection
- ✅ Regex mode
- ✅ Advanced query syntax (AND/OR)
- ✅ Search history (20 entries)
- ✅ Religion statistics
- ✅ Timespan search (firstseen-lastseen)
- ✅ Comprehensive search guide

### Previous Versions
- v0.9 - Single scope selection
- v0.8 - Basic search (all fields)
- v0.7 - Initial release

---

## License

[Specify your license here]

---

## Credits

Developed for historical prosopographical research of Livorno merchant communities.

**Technologies:**
- Vanilla JavaScript (ES6+)
- IndexedDB for local storage
- Codeberg API for sync
- Progressive Web App (PWA)

---

**Last Updated:** December 2024
**Documentation Version:** 1.0
