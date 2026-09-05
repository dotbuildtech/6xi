# QA report — 6ix to Go integrated storefront

Date: 2026-09-06

## Content integration verified

- 6/6 products from the supplied workbook are present.
- Product names, materials, sizes, descriptions and INR prices were cross-checked against the workbook.
- 29 supplied product photographs were visually mapped to the corresponding six products and copied into the storefront.
- Desktop homepage MP4 verified at 854×480 and decodes successfully.
- Mobile homepage MP4 verified at 1080×1920 and decodes successfully.
- Supplied primary/secondary logos are included.
- Brand guideline was inspected for logo usage, primary/secondary typography and palette.
- CSS uses the guideline palette and requests Field Gothic / Franklin Gothic ATF first, with web-safe fallbacks.
- Full About / Brand Story content is integrated into the About page.
- Privacy, Shipping, Return/Exchange/Refund and Terms content is integrated.
- Contact email, phone/WhatsApp and address are integrated from the supplied shipping document.

## Storefront behavior retained/checked

- responsive header/navigation and slide-out menu
- search drawer and product search
- collection pages with filter/sort controls
- product card hover image and quick-add
- multi-image product galleries
- product size/variant selection
- made-to-measure product routes to PDP rather than blind quick-add
- cart persistence in browser
- Shopify-ready dynamic inventory and SOLD OUT handling
- Shopify cart/checkout handoff when credentials are configured
- recommendations below product gallery
- interactive 1–5 star review UI
- review submission/readback in browser-local approval mode
- Judge.me server-side production review adapter
- desktop/mobile campaign video swap
- About story and legal pages

## Automated source checks

- 27 JS/MJS source files parsed in JSX mode: **0 syntax errors**.
- Relative imports checked: **0 broken relative imports**.
- Local `/images`, `/brand` and `/media` references checked: **0 missing assets**.
- CSS parsed successfully with PostCSS.
- Store data runtime-transpiled and validated: **6 products, 7 collections, 11 source story sections, 5 policy pages**.
- All raster assets opened/verified: **30 files, 0 decode errors**.
- Both MP4 banner videos decoded successfully with ffmpeg.
- No legacy `@/` alias imports remain.
- No old `YOUR BRAND` / placeholder product artwork remains in the customer-facing source.

## Known external-service requirements

The storefront works for visual/content approval without credentials. Live commerce services require:

- Shopify store domain + Storefront API token
- Shopify customer-account URL
- Judge.me credentials for shared/moderated production reviews

## Production-build environment limitation

An actual `npm install` was attempted in this sandbox but timed out before dependencies could be downloaded, so a true `next build` could not be executed here. This is an environment/network limitation rather than a reported source compilation failure.

On a normal development machine with npm connectivity, the final deployment gate is:

```bash
npm install
npm run build
```

## Legal-source issue intentionally not invented

The supplied Terms & Conditions file contains unresolved placeholders for **Legal Business Name** and **GSTIN**. These two lines are omitted from the public Terms page until correct values are supplied. No legal entity name or GST number was guessed.
