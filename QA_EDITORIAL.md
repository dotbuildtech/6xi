# Editorial / Member Access QA

Updated areas:
- Dedicated `/signup` member-access page.
- BRAND > SIGN UP now routes to `/signup` instead of the homepage newsletter anchor.
- Footer includes a dedicated Member access link.
- About page rebuilt as an editorial brand page using supplied 6ix to Go campaign assets.
- Responsive desktop/mobile styles added for both pages.

Static validation performed:
- Required media, product images and logo assets exist.
- `/signup` page and signup client component exist.
- Navigation contains no remaining `/#newsletter` SIGN UP target.
- Existing policy, product, collection, cart and review routes were left intact.

Environment note:
- A full `next build` could not be run in this workspace because Next.js dependencies are not installed here and offline npm installation did not complete within the execution window. Run `npm install && npm run build` in the deployment environment.
