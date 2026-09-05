# 6ix to Go storefront

A Next.js headless storefront for **6ix to Go**, built from the supplied brand guideline, product workbook, product photography, homepage campaign videos, brand story, logos and legal documents.

The visual structure retains the minimal fashion-store rhythm approved in the previous implementation while applying 6ix to Go's own identity, products and content.

## Included brand content

- 6 actual launch products with supplied names, descriptions, materials, sizes and INR pricing
- 29 supplied product photographs mapped to the correct products
- supplied desktop and mobile homepage campaign videos
- supplied primary/secondary 6ix to Go logos
- brand-guideline colour system and typography stack
- complete About / Brand Story content
- Return, Exchange & Refund Policy
- Privacy Policy
- Shipping Policy
- Terms & Conditions
- Contact information
- working cart and product variant selection in demo mode
- working browser-local review submission and star ratings for approval/testing
- Shopify-ready catalogue, inventory, collection and checkout layer
- Judge.me-ready production review integration

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

For production validation:

```bash
npm run build
npm start
```

## Shopify: what the client can manage without code

Once Shopify is connected, the client manages day-to-day commerce from Shopify Admin:

- product names and descriptions
- product photos and galleries
- prices / compare-at prices
- sizes and other variants
- inventory and SOLD OUT state
- New Arrivals and other collections
- product visibility
- collection ordering
- discounts, orders, taxes and checkout settings

The storefront reads Shopify availability directly. If a product or size has no available inventory, the customer sees the corresponding sold-out/disabled state automatically.

### Collection handles used by this storefront

- `new-arrivals`
- `shop-all`
- `drop-01`
- `t-shirts`
- `polos`
- `jerseys`
- `shirts`

These can be manual or automated Shopify collections.

## Connect Shopify

Copy `.env.example` to `.env.local` and provide:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
SHOPIFY_API_VERSION=2026-07
NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL=...
```

The optional product metafields supported by the storefront are:

- `custom.color`
- `custom.model_info`
- `custom.care`
- `custom.shipping_returns`
- `custom.badge`
- `custom.material`

## Homepage management from Shopify

The built-in homepage already uses the supplied 6ix to Go campaign videos and copy. For later client editing, the commerce adapter can read Shopify metaobjects of type `homepage_section` with these fields:

- `position`
- `eyebrow`
- `title`
- `body`
- `image`
- `link`
- `collection`
- `desktop_video_url` (optional)
- `mobile_video_url` (optional)

This allows campaign copy, featured collections and optional CDN-hosted hero videos to be changed without editing React files.

## Reviews

Without external credentials, reviews are fully interactive for approval/testing and persist in that browser using local storage.

For production shared reviews and moderation, connect Judge.me:

```env
JUDGEME_SHOP_DOMAIN=your-store.myshopify.com
JUDGEME_PRIVATE_API_TOKEN=...
```

The review token remains server-side.

## Checkout

In Shopify mode, cart lines retain real Shopify ProductVariant IDs. Checkout creates a Shopify Cart and redirects the buyer to Shopify's secure `checkoutUrl`.

Without Shopify credentials, the catalogue/cart remain usable for design approval but real payment checkout is intentionally unavailable.

## Legal-content note

The supplied Terms & Conditions document still contains two unresolved source placeholders: **Legal Business Name** and **GSTIN**. They are intentionally not shown publicly in the current rendered Terms page rather than inventing legal information. Add the correct values before production launch if they apply.

The privacy/grievance email and return-support email were populated using the support email supplied elsewhere in the uploaded legal documents (`krishj57@gmail.com`).

## Typography

The supplied brand guideline specifies **Field Gothic Bold Wide** as the primary typeface and **Franklin Gothic ATF Regular** as secondary. The CSS requests those families first and provides web-safe fallbacks. The uploaded package did not include licensed webfont files, so exact cross-device font rendering will require your licensed webfont assets before launch.
