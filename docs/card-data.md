# Card data

The saved deck contains **11,213 cards**. It preserves all 9,994 original V1
records and adds 1,219 records from
[Wikitrivia Classic](https://github.com/michaelclarkcuadrado/wikitrivia-classic),
at commit [`134654a`](https://github.com/michaelclarkcuadrado/wikitrivia-classic/commit/134654a372131a8d4145df8a4d76041d673cdf3c).
Credit to that project for collecting and publishing the newer snapshot.
The underlying facts come from Wikidata; its structured data is CC0.
Image licenses remain those of the individual Wikimedia Commons files.

## Selection

The import preserves the original records, including their date properties.
New records must have an image, a supported date property, a unique Wikidata
ID, and a category in the importer’s explicit list. That list covers discoveries,
spacecraft, software, entertainment, museums, parks, buildings, and events.
It excludes people, countries, religions, and other categories whose dates can
be ambiguous. It also excludes blacklisted cards and obvious date clues.

Added dates range from 449 BCE to 2025. The import excludes dates after 2025
to avoid scheduled releases in the snapshot, and excludes end dates and
earliest-record dates. The original deck's date types remain unchanged.
One film with a questionable pre-release year is excluded in the importer.

Examples include PHP (1995), the Tiangong space station (2021), ChatGPT (2022),
and Android 14 (2023). Cards show which event is being dated, such as
“created,” “published,” or “officially opened.” The game's modern period now
extends through the current year instead of stopping at 2020.

These are community-maintained historical facts, not individually verified
research. Filtering removes some unsuitable entries but cannot guarantee every
date is correct. Report a questionable card with its title and Wikidata ID.

## Rebuild the saved deck

From a checkout containing the original V1 Git history, run:

```bash
bun run data:expand
```

The script downloads the pinned Classic snapshot from GitHub, verifies its
SHA-256 checksum, reads the original deck from Git, and writes the combined
NDJSON file to `public/items.json`. It does not query Wikimedia APIs.
Running it again produces the same file. Changes to the selection rules must
be made in `scripts/expand-deck.mjs` before rebuilding.

Review the resulting diff and run `bun run lint` and `bun run test` before
publishing with `bun run pages:deploy`. The browser checks include rendering
and flipping a newly added card with a date after 2020.
