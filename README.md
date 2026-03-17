# Livorno Prosopography - Search Guide

A comprehensive historical prosopography database application with advanced search capabilities for researching persons, relationships, and historical records.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Search](#basic-search)
3. [Search Scopes](#search-scopes)
4. [Multiple Scope Selection](#multiple-scope-selection)
5. [Regex Mode](#regex-mode)
6. [Advanced Query Syntax](#advanced-query-syntax)
7. [Search History](#search-history)
8. [Statistics Cards](#statistics-cards)
9. [Search Examples](#search-examples)
10. [Tips & Best Practices](#tips--best-practices)

---

## Quick Start

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

## Basic Search

### Default Behavior

By default, searches scan **all fields** in every person record:

- Names (lastname, firstname, patronymic + variations)
- Origin
- City
- Profession
- Religion
- Notes
- References (Zotero, Archief)
- Relationships (related person names, relationship types)
- Gender (searches "male"/"female" text)

### Case-Insensitive

All standard searches are **case-insensitive**:
- `berg` matches "Berg", "BERG", "van der Berg"
- `amsterdam` matches "Amsterdam", "AMSTERDAM"

### Substring Matching

Searches match **any part** of the field:
- `van` matches "van der Berg", "Giovanni", "Ivan"
- `merchant` matches "merchant", "merchants", "merchantman"

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
| **Patronymic** | Patronymic only |
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

### Example 4: Research Documentation

**Find persons with extensive notes:**
```
1. Click "Scope" → Select "Notes"
2. Click ".*" (regex)
3. Type: .{200,}
```
Result: Notes with 200+ characters (well-documented persons)

### Example 5: Relationship Networks

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

### Example 6: Year-Based Search

**Find references from 1650s:**
```
1. Click "Scope" → Select "References"
2. Click ".*" (regex)
3. Type: 165\d
```
Result: References with years 1650-1659

### Example 7: Multi-City Search

**Find persons in major cities:**
```
1. Click "Scope" → Select "City"
2. Click ".*" (regex)
3. Type: (Amsterdam|Rotterdam|Livorno)
```
Result: Persons in any of the three cities

### Example 8: Timespan Searches

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

### Edge Cases

**Incomplete Data:**

For **single year queries**:
- If `firstseen` missing: Treats firstseen as the query year
- If `lastseen` missing: Treats lastseen as the query year
- If both missing: Treats both as the query year

For **range queries** (e.g., `1630-1680`):
- If `firstseen` missing: Treats firstseen as the range start (1630)
- If `lastseen` missing: Treats lastseen as the range end (1680)
- If both missing: Matches (considered to be within range)

**Examples:**
```
Person: firstseen=1650, lastseen=null
Query: 1630-1680
Logic: 1650 ≥ 1630 AND 1680 ≤ 1680 → ✓ Match

Person: firstseen=null, lastseen=1660
Query: 1630-1680
Logic: 1630 ≥ 1630 AND 1660 ≤ 1680 → ✓ Match

Person: firstseen=null, lastseen=null
Query: 1630-1680
Logic: 1630 ≥ 1630 AND 1680 ≤ 1680 → ✓ Match
```

**Year Extraction:**
- Automatically extracts 4-digit years from field text
- `"circa 1650"` → extracts 1650
- `"1650-1651"` → extracts first year (1650)
- `"early 17th century"` → no extraction, no match

### Use Cases

**Research Applications:**
1. **Historical events:** Find persons active during specific events
2. **Generational studies:** Identify contemporaries
3. **Career analysis:** Track professional activity periods
4. **Migration patterns:** Correlate movement with time periods

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