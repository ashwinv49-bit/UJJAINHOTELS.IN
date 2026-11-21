# /hotels/ pages

Real hotel and collection pages go here (not built yet; see docs/DECISIONS.md, decision 6).

- Collections: `/hotels/<area-or-type>/` (e.g. `near-mahakal-temple/index.html`, `budget/index.html`)
- Hotels: `/hotels/<hotel-slug>/`, generated from `data/hotels/*.json` validated against `data/schema/hotel.schema.json`

Until a real page exists here, the build publishes a `noindex` "coming soon" page for every
collection URL listed in `data/categories.json` and `data/areas.json`, so links never break.
