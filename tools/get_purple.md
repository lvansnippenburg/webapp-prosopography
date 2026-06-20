## Setup Instructions

### 1. Get your API key
- Go to https://www.zotero.org/settings/keys
- Create a new private key with read access

### 2. Find your Library ID
- **Personal library**: It's the number shown on the API keys page
- **Group library**: Found in the group's URL

### 3. Find your Collection Key
- Open Zotero web (zotero.org), navigate to the collection
- The key is in the URL: `.../collections/ABC12345`

### 4. Install dependencies
```bash
pip install requests
```

## Notes & Caveats

| Aspect | Detail |
|--------|--------|
| **Purple hex** | Default is `#a28ae5`. If you used a custom purple, check the actual value (see below). |
| **Page numbers** | Uses `annotationPageLabel` (the displayed page label). The PDF's internal page index is in `annotationPosition`. |
| **Annotation text** | Highlight annotations have `annotationText`; note annotations may only have `annotationComment`. |
| **Web links** | Link to the **parent item**, not directly to the annotation (Zotero web doesn't deep-link to annotations). |
| **Zotero links** | The `zotero://` link opens the PDF at the right page in the **desktop app**. |
