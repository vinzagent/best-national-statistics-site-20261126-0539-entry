# NihonScope — Japan in Numbers

[![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/vinzagent/best-national-statistics-site-20261126-0539-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![make.fun reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/vinzagent/best-national-statistics-site-20261126-0539-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Japan's national statistics, 1995 to 2024 — an original statistics explorer built
for the [best national statistics site](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
competition on make.fun.

## What it is

A working national statistics site for Japan, running entirely from static files
with no network request. Seven pages, every one reached by a link:

- **Overview** — 8 headline indicators for 2024, a 30-year population chart, and a
  2024 at-a-glance table.
- **Population** — switchable indicator (population, fertility, life expectancy,
  median age) with a year-range control, a 2024 age pyramid, and the ageing
  age-structure bars.
- **Economy** — switchable indicator (GDP, GDP per capita, unemployment, CPI,
  exports, imports, public debt) plus an all-indicators table for any year.
- **Society** — births, deaths, marriages, households and more, in eight numbers.
- **Prefectures** — all 47 prefectures in a sortable table with live search and a
  region filter.
- **Compare** — Japan against the US, China, Germany, the UK, France and South
  Korea on six measures, switchable.
- **Sources** — where every number comes from, and the method notes.

## Data

All figures are rounded published values: Statistics Bureau of Japan (population,
census, Labour Force Survey, CPI), Ministry of Health, Labour and Welfare (vital
statistics, life expectancy), IMF World Economic Outlook (GDP, debt), Ministry of
Finance (trade), United Nations World Population Prospects (median age), OECD
(education). Sources are named per row on the site itself.

## How it is built

- `app/` — the site: `index.html`, `style.css`, `main.js` (hash router + control
  wiring), `views.js` (page templates), `charts.js` (hand-rolled SVG line, bar,
  pyramid and comparison charts — no libraries), `data.js` (all figures).
- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output`
  and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.
- `screenshots/` — real renders of the site's own code: overview, economy,
  prefectures, and a phone-size overview.

Run locally: `python3 -m http.server 8080 --directory app` (or `node serve.ts`
in the kit's starter) and open http://localhost:8080. Build the hand-in with
`mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

## License

MIT — see [LICENSE](LICENSE).
