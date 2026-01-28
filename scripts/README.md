# Scripts

Utility scripts for importing and processing Pokemon GO data.

## Rocket Lineups Importer

**File:** `import-rocket-lineups.ts`

Imports current Team GO Rocket lineups (Giovanni, Leaders, and Grunts) from the community-maintained [ccev/pogoinfo](https://github.com/ccev/pogoinfo) repository.

### Usage

```bash
# Run directly
bun run scripts/import-rocket-lineups.ts

# Or use npm script
npm run import:rocket-lineups
```

### Output

Creates/updates: `src/lib/data/rocket-lineups.json`

### Data Structure

```json
{
  "lastUpdated": "2026-01-28T18:36:14.501Z",
  "source": "https://raw.githubusercontent.com/ccev/pogoinfo/v2/active/grunts.json",
  "giovanni": {
    "id": "character_giovanni",
    "name": "Giovanni",
    "title": "Team GO Rocket Boss",
    "quote": "",
    "gender": "male",
    "slots": {
      "slot1": {
        "pokemon": ["PERSIAN_NORMAL"]
      },
      "slot2": {
        "pokemon": ["NIDOKING_NORMAL", "KINGLER_NORMAL", "KINGDRA_NORMAL"]
      },
      "slot3": {
        "pokemon": ["REGICE"]
      }
    }
  },
  "leaders": [...],
  "grunts": [...]
}
```

### Features

- ✅ Fetches live data from ccev/pogoinfo (community-maintained, updated automatically)
- ✅ Enriches Pokemon names with game master template IDs
- ✅ Categorizes into Giovanni, Leaders (Arlo/Cliff/Sierra), and Grunts
- ✅ Preserves type information for typed grunts
- ✅ Structured JSON output ready for use in the app

### Data Source

This importer uses **ccev/pogoinfo** as the data source instead of scraping LeekDuck directly because:

1. **Reliability**: LeekDuck's page is JavaScript-rendered, making it harder to scrape
2. **Structure**: PogoInfo provides well-structured JSON data
3. **Automation**: PogoInfo is automatically updated by community bots
4. **Accuracy**: Same source that LeekDuck and other tools use

The data is essentially the same information displayed on https://leekduck.com/rocket-lineups/

### Notes

- Lineups are typically rotated monthly by Niantic
- Giovanni's legendary reward (slot 3) changes with each research
- The importer preserves game master template IDs for easy data linking
