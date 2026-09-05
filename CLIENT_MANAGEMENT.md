# Client management guide — 6ix to Go

The finished storefront is designed so routine store updates happen in **Shopify Admin**, not in the Next.js code.

## Add a new product

1. Shopify Admin → Products → Add product.
2. Enter the product title and description.
3. Upload/reorder product photos.
4. Add price and variants (for example S / M / L / XL / XXL).
5. Enable inventory tracking and enter available quantities.
6. Add the product to the appropriate collections such as New Arrivals, T-Shirts, Polos, Jerseys or Shirts.
7. Publish the product to the storefront sales channel.

The website reads the product automatically once Shopify is connected.

## SOLD OUT / restock

Do not edit the website text manually. Update inventory in Shopify. When all relevant variants are unavailable, the storefront displays SOLD OUT. Restocking inventory makes the variant purchasable again.

## New Arrivals

Add/remove products from the Shopify collection with handle `new-arrivals`. The New Arrivals page will follow that collection automatically.

## Change product images

Edit the product in Shopify and upload/reorder its media. The product grid, hover image and PDP gallery read the Shopify image order.

## Change homepage campaign content

Use Shopify metaobjects of type `homepage_section` after they are configured. The supported keys are documented in `README.md`.

## Reviews

Moderate production reviews from Judge.me once connected. The built-in local review mode is for visual approval/testing only.

## Policies

The current supplied policy text is stored in `lib/store-data.js`. For long-term merchant editing, these can later be moved to Shopify Pages or metaobjects without changing the public URLs.
