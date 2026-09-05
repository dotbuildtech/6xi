import { NextResponse } from 'next/server';

const domain = process.env.JUDGEME_SHOP_DOMAIN;
const token = process.env.JUDGEME_PRIVATE_API_TOKEN;
const configured = Boolean(domain && token);
const endpoint = 'https://judge.me/api/v1/reviews';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  if (!configured || !productId) return NextResponse.json({ mode: 'demo', reviews: [] });
  try {
    const lookup = new URLSearchParams({ api_token: token, shop_domain: domain, external_id: productId });
    const productRes = await fetch(`https://api.judge.me/api/v1/products/-1?${lookup}`, { cache: 'no-store' });
    if (!productRes.ok) throw new Error(`Review product lookup returned ${productRes.status}`);
    const productData = await productRes.json();
    const internalId = productData.product?.id;
    if (!internalId) return NextResponse.json({ mode: 'judgeme', reviews: [] });
    const qs = new URLSearchParams({ api_token: token, shop_domain: domain, published: 'true', per_page: '100', product_id: String(internalId) });
    const res = await fetch(`https://api.judge.me/api/v1/reviews?${qs}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Review service returned ${res.status}`);
    const data = await res.json();
    const raw = data.reviews || data.data || [];
    const reviews = raw.map(r => ({
      id: r.id,
      name: r.reviewer?.name || r.reviewer_name || r.name || 'Customer',
      rating: Number(r.rating || 0),
      title: r.title || '',
      body: r.body || '',
      createdAt: r.created_at || r.createdAt || null,
      verified: Boolean(r.verified || r.verified_buyer)
    }));
    return NextResponse.json({ mode: 'judgeme', reviews });
  } catch (error) {
    return NextResponse.json({ mode: 'judgeme', reviews: [], error: error.message }, { status: 502 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { productId, name, email, rating, title = '', body } = payload;
    if (!name || !email || !body || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Name, email, rating and review text are required.' }, { status: 400 });
    }
    if (!configured || !productId) return NextResponse.json({ mode: 'demo', accepted: true });
    const form = new URLSearchParams({
      api_token: token,
      shop_domain: domain,
      platform: 'shopify',
      name,
      email,
      rating: String(rating),
      body,
      title,
      id: String(productId)
    });
    const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form, cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ error: data.error || data.message || 'Review could not be submitted.' }, { status: res.status });
    return NextResponse.json({ mode: 'judgeme', accepted: true, review: data.review || data });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Review could not be submitted.' }, { status: 500 });
  }
}
