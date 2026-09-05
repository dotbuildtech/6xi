import { campaigns, homeMedia, editorialImages, collections as fallbackCollections, products as fallbackProducts } from './store-data';
import { isShopifyConfigured, shopifyFetch } from './shopify';

const PRODUCT_FRAGMENT = `
  id handle title description descriptionHtml productType tags availableForSale publishedAt updatedAt
  featuredImage { url altText width height }
  images(first: 12) { nodes { url altText width height } }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  options { name values }
  variants(first: 100) {
    nodes {
      id title availableForSale currentlyNotInStock
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
      image { url altText width height }
    }
  }
  metafields(identifiers: [
    {namespace:"custom", key:"color"},
    {namespace:"custom", key:"model_info"},
    {namespace:"custom", key:"care"},
    {namespace:"custom", key:"shipping_returns"},
    {namespace:"custom", key:"badge"},
    {namespace:"custom", key:"material"}
  ]) { key value type }
`;

const moneyNumber = value => Number.parseFloat(value || '0') || 0;
const gidTail = id => id?.split('/').pop() || null;
const metafieldMap = nodes => Object.fromEntries((nodes || []).filter(Boolean).map(x => [x.key, x.value]));

function normalizeProduct(p, collectionHandles = []) {
  const fields = metafieldMap(p.metafields);
  const variants = (p.variants?.nodes || []).map(v => ({
    id: v.id,
    shopifyId: gidTail(v.id),
    title: v.title,
    available: Boolean(v.availableForSale),
    currentlyNotInStock: Boolean(v.currentlyNotInStock),
    price: moneyNumber(v.price?.amount),
    compareAt: v.compareAtPrice ? moneyNumber(v.compareAtPrice.amount) : null,
    options: Object.fromEntries((v.selectedOptions || []).map(o => [o.name, o.value])),
    image: v.image?.url || null
  }));
  const sizeOption = p.options?.find(o => o.name.toLowerCase() === 'size');
  if (!sizeOption && variants.length === 1 && variants[0].title === 'Default Title') { variants[0].title = 'OS'; variants[0].options = { ...variants[0].options, Size: 'OS' }; }
  const sizes = sizeOption?.values?.length ? sizeOption.values : variants.map(v => v.options?.Size || v.title).filter(Boolean);
  const images = (p.images?.nodes || []).map(x => x.url).filter(Boolean);
  const price = moneyNumber(p.priceRange?.minVariantPrice?.amount);
  const compare = moneyNumber(p.compareAtPriceRange?.minVariantPrice?.amount);
  const newByDate = p.publishedAt ? Date.now() - new Date(p.publishedAt).getTime() < 1000 * 60 * 60 * 24 * 45 : false;
  const tagSet = new Set((p.tags || []).map(t => t.toUpperCase()));
  const badge = fields.badge || (tagSet.has('NEW') || collectionHandles.includes('new-arrivals') || newByDate ? 'NEW' : (compare > price ? 'SALE' : null));
  return {
    id: p.id,
    shopifyProductId: gidTail(p.id),
    slug: p.handle,
    title: p.title,
    price,
    compareAt: compare > price ? compare : null,
    category: p.productType || 'Product',
    collections: collectionHandles,
    available: Boolean(p.availableForSale),
    badge: p.availableForSale ? badge : 'SOLD OUT',
    images: images.length ? images : [p.featuredImage?.url].filter(Boolean),
    sizes: [...new Set(sizes)],
    variants,
    description: p.description || '',
    descriptionHtml: p.descriptionHtml || '',
    details: [],
    model: fields.model_info || '',
    color: fields.color || '',
    care: fields.care || '',
    material: fields.material || '',
    shippingReturns: fields.shipping_returns || '',
    tags: p.tags || [],
    currencyCode: p.priceRange?.minVariantPrice?.currencyCode || 'INR'
  };
}

function normalizeFallback(p) {
  const variants = (p.sizes || []).map((size, i) => ({
    id: `demo:${p.slug}:${size}`,
    shopifyId: null,
    title: size,
    available: p.available !== false,
    price: p.price,
    compareAt: p.compareAt,
    options: { Size: size },
    image: p.images?.[0] || null
  }));
  return { ...p, id: `demo:${p.slug}`, shopifyProductId: null, variants, currencyCode: 'INR' };
}

export async function getProduct(handle) {
  if (!isShopifyConfigured) return fallbackProducts.find(p => p.slug === handle) ? normalizeFallback(fallbackProducts.find(p => p.slug === handle)) : null;
  const data = await shopifyFetch({
    query: `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FRAGMENT} collections(first: 20) { nodes { handle } } } }`,
    variables: { handle },
    tags: [`product:${handle}`]
  });
  if (!data.product) return null;
  return normalizeProduct(data.product, data.product.collections.nodes.map(c => c.handle));
}

export async function getProducts(first = 24) {
  if (!isShopifyConfigured) return fallbackProducts.map(normalizeFallback);
  const data = await shopifyFetch({
    query: `query Products($first: Int!) { products(first: $first, sortKey: CREATED_AT, reverse: true) { nodes { ${PRODUCT_FRAGMENT} } } }`,
    variables: { first },
    tags: ['products']
  });
  return data.products.nodes.map(p => normalizeProduct(p));
}

export async function getCollection(handle) {
  if (!isShopifyConfigured) {
    const meta = fallbackCollections.find(c => c.slug === handle);
    const filtered = fallbackProducts.filter(p => p.collections.includes(handle) || p.category === handle).map(normalizeFallback);
    return { handle, title: meta?.title || handle.replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase()), products: filtered.length ? filtered : fallbackProducts.map(normalizeFallback) };
  }
  const data = await shopifyFetch({
    query: `query Collection($handle: String!) { collection(handle: $handle) { id handle title description products(first: 100) { nodes { ${PRODUCT_FRAGMENT} } } } }`,
    variables: { handle },
    tags: [`collection:${handle}`]
  });
  if (!data.collection) return null;
  return { ...data.collection, products: data.collection.products.nodes.map(p => normalizeProduct(p, [handle])) };
}

export async function getCollections() {
  if (!isShopifyConfigured) return fallbackCollections;
  const data = await shopifyFetch({
    query: `query Collections { collections(first: 40, sortKey: UPDATED_AT, reverse: true) { nodes { handle title image { url altText } products(first:1) { nodes { featuredImage { url altText } } } } } }`,
    tags: ['collections']
  });
  return data.collections.nodes.map(c => ({ slug: c.handle, title: c.title, image: c.image?.url || c.products.nodes[0]?.featuredImage?.url || '/images/products/the-number-one/1.webp' }));
}

export async function searchProducts(query) {
  if (!query) return [];
  if (!isShopifyConfigured) {
    const q = query.toLowerCase();
    return fallbackProducts.filter(p => `${p.title} ${p.category} ${(p.collections || []).join(' ')}`.toLowerCase().includes(q)).map(normalizeFallback);
  }
  const data = await shopifyFetch({
    query: `query Search($query: String!) { search(first: 40, query: $query, types: [PRODUCT]) { nodes { ... on Product { ${PRODUCT_FRAGMENT} } } } }`,
    variables: { query },
    revalidate: 0
  });
  return data.search.nodes.map(p => normalizeProduct(p));
}

export async function getRecommendations(productId, excludeHandle) {
  if (!isShopifyConfigured || !productId?.startsWith('gid://')) {
    return fallbackProducts.filter(p => p.slug !== excludeHandle).slice(0, 4).map(normalizeFallback);
  }
  const data = await shopifyFetch({
    query: `query Recommendations($id: ID!) { productRecommendations(productId: $id) { ${PRODUCT_FRAGMENT} } }`,
    variables: { id: productId },
    tags: [`recommendations:${gidTail(productId)}`]
  });
  return (data.productRecommendations || []).slice(0, 4).map(p => normalizeProduct(p));
}

export async function getHomepageContent() {
  if (!isShopifyConfigured) return { campaigns, homeMedia, editorialImages, featuredCollection: 'drop-01', essentialsCollection: 'shop-all' };
  try {
    const data = await shopifyFetch({
      query: `query Homepage { metaobjects(type: "homepage_section", first: 20) { nodes { handle fields { key value reference { ... on MediaImage { image { url altText } } ... on Collection { handle title } } } } } }`,
      tags: ['homepage']
    });
    const nodes = data.metaobjects?.nodes || [];
    if (!nodes.length) return { campaigns, homeMedia, editorialImages, featuredCollection: 'drop-01', essentialsCollection: 'shop-all' };
    const parsed = nodes.map(node => {
      const f = Object.fromEntries(node.fields.map(x => [x.key, x]));
      return {
        handle: node.handle,
        eyebrow: f.eyebrow?.value || '',
        title: f.title?.value || '',
        body: f.body?.value || '',
        href: f.link?.value || (f.collection?.reference?.handle ? `/collections/${f.collection.reference.handle}` : '/collections/new-arrivals'),
        image: f.image?.reference?.image?.url || f.image_url?.value || '/images/products/the-number-one/1.webp',
        collectionHandle: f.collection?.reference?.handle || null,
        desktopVideo: f.desktop_video_url?.value || '',
        mobileVideo: f.mobile_video_url?.value || '',
        position: Number(f.position?.value || 0)
      };
    }).sort((a,b) => a.position - b.position);
    return {
      campaigns: parsed.length ? parsed : campaigns,
      homeMedia: {
        desktopVideo: parsed.find(x => x.desktopVideo)?.desktopVideo || homeMedia.desktopVideo,
        mobileVideo: parsed.find(x => x.mobileVideo)?.mobileVideo || homeMedia.mobileVideo
      }, editorialImages,
      featuredCollection: parsed.find(x => x.collectionHandle)?.collectionHandle || 'drop-01',
      essentialsCollection: parsed.find((x,i) => i > 0 && x.collectionHandle)?.collectionHandle || 'shop-all'
    };
  } catch {
    return { campaigns, homeMedia, editorialImages, featuredCollection: 'drop-01', essentialsCollection: 'shop-all' };
  }
}

export { isShopifyConfigured } from './shopify';
