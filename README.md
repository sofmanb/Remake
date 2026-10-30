# VIRTUS Data Centres — website remake

An unofficial, static redesign of [virtusdatacentres.com](https://virtusdatacentres.com/): six pages (Home, Data Centres, Services, Sustainability, About, Contact) with a responsive layout, a filterable campus directory and a client-side contact form.

The live site couldn't be reached from the build environment, so the facts and figures come from public press coverage (campus names, approximate MW, ST Telemedia ownership). All copy is new. Per-building capacities are shown only where they've been published; check them against current Virtus figures before using this anywhere.

## Structure

- `*.html`: generated pages (open `index.html` directly or serve the folder)
- `assets/`: styles, campus data (`campuses.js`) and behaviour (`main.js`)
- `scripts/build.mjs`: regenerates the pages from shared header/footer partials
- `scripts/check.mjs`: browser verification that writes `REPORT.md` and `screenshots/`

## Commands

```sh
node scripts/build.mjs                          # rebuild pages
NODE_PATH=$(npm root -g) node scripts/check.mjs # verify (needs Playwright)
```

`REPORT.md` ends with `REMAKE COMPLETE` when every check passes.
