import { NextResponse } from 'next/server';
import { isShopifyConfigured, shopifyFetch } from '../../../lib/shopify';

export async function POST(request) {
  try {
    const { lines = [] } = await request.json();
    if (!isShopifyConfigured) {
      return NextResponse.json({ mode: 'demo', error: 'Shopify checkout is not connected yet.' }, { status: 409 });
    }
    const valid = lines.filter(x => x.merchandiseId?.startsWith('gid://shopify/ProductVariant/') && x.quantity > 0);
    if (!valid.length) return NextResponse.json({ error: 'No Shopify variants are available in this cart.' }, { status: 400 });
    const data = await shopifyFetch({
      query: `mutation CreateCart($input: CartInput!) {
        cartCreate(input: $input) {
          cart { id checkoutUrl totalQuantity }
          userErrors { field message }
          warnings { code message }
        }
      }`,
      variables: { input: { lines: valid.map(x => ({ merchandiseId: x.merchandiseId, quantity: x.quantity })) } },
      revalidate: 0
    });
    const result = data.cartCreate;
    if (result.userErrors?.length) return NextResponse.json({ error: result.userErrors.map(x => x.message).join(', ') }, { status: 400 });
    return NextResponse.json({ mode: 'shopify', checkoutUrl: result.cart.checkoutUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Checkout could not be created.' }, { status: 500 });
  }
}
