# Scripts

Utility scripts for importing and processing Pokemon GO data.

## Rocket Lineups Importer

**File:** `import-rocket-lineups.ts`

Imports current Team GO Rocket lineups (Giovanni, Leaders, and Grunts) directly from **LeekDuck.com**.

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
  "lastUpdated": "2026-01-28T18:54:30.848Z",
  "leekduckUpdated": "2026-01-23 05:40:52 -0400",
  "source": "https://leekduck.com/rocket-lineups/",
  "giovanni": {
    "id": "giovanni",
    "name": "Giovanni",
    "title": "Team GO Rocket Boss",
    "quote": "I will not tolerate your interference.",
    "photoUrl": "https://cdn.leekduck.com/assets/img/rocket/boss-giovanni.png",
    "slots": {
      "slot1": {
        "pokemon": [{
          "name": "Persian",
          "type1": "normal",
          "doubleWeaknesses": [],
          "singleWeaknesses": ["Fighting"],
          "templateId": "EXTENDED_V0053_POKEMON_PERSIAN"
        }]
      },
      "slot2": { "pokemon": [...] },
      "slot3": { "pokemon": [...] }
    }
  },
  "leaders": [...],
  "grunts": [...]
}
```

### Features

- ✅ Fetches live data directly from https://leekduck.com/rocket-lineups/
- ✅ Extracts Pokemon data from HTML data-attributes
- ✅ Includes Pokemon types (type1, type2)
- ✅ Includes weaknesses (double and single)
- ✅ Includes character photos and quotes
- ✅ Tracks LeekDuck's last update date
- ✅ Enriches with game master template IDs
- ✅ Categorizes into Giovanni, Leaders (Arlo/Cliff/Sierra), and Grunts

### Data Source

This importer scrapes **LeekDuck** directly by parsing the HTML data-attributes that LeekDuck embeds in their page (data-pokemon, data-type1, data-type2, data-double-weaknesses, data-single-weaknesses).

### Notes

- Lineups are typically rotated monthly by Niantic
- Giovanni's legendary reward (slot 3) changes with each research
- The importer preserves game master template IDs for easy data linking
- Run the importer whenever lineups change to get fresh data
