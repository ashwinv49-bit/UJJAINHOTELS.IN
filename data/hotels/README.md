# Hotel database: real hotels only

One JSON file per hotel: `data/hotels/<slug>.json`. Full guide: [`docs/HOTELS.md`](../../docs/HOTELS.md).

- **Create a record:** `npm run new-hotel -- "Exact Hotel Name"` (starts as `draft`), or copy `data/schema/hotel.template.json`.
- **Statuses:** `draft` → `contacted` → `verified`. **Only `verified` records with a complete `verification` block are published.** Draft and contacted records stay private.
- **Never invent anything:** leave a field out rather than guess (names, phone numbers, prices, facilities, distances, photos).
- **Check your records:** `npm run hotels` lists every record, whether it is public, and what still needs fixing.

Placeholder/test records live in `data/hotels-placeholder/` and are never published on the live site.
