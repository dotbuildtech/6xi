const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
export const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-07';
export const isShopifyConfigured = Boolean(domain && token);

export async function shopifyFetch({ query, variables = {}, revalidate = 60, tags = [] }) {
  if (!isShopifyConfigured) {
    throw new Error('Shopify is not configured. Add SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.');
  }
  const res = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags }
  });
  if (!res.ok) throw new Error(`Shopify request failed (${res.status})`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join(', '));
  return json.data;
}

export function shopifyDomain() {
  return domain;
}
