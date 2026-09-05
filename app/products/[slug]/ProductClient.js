'use client';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useCart } from '../../../components/CartProvider';
const money=(n,c='INR')=>c==='INR'?`Rs. ${new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(n)}.00`:new Intl.NumberFormat('en-IN',{style:'currency',currency:c}).format(n);
export default function ProductClient({product}){
  const initial = product.variants?.find(v => v.available) || product.variants?.[0] || null;
  const [variantId,setVariantId]=useState(initial?.id || null); const {add}=useCart();
  const variant=useMemo(()=>product.variants?.find(v=>v.id===variantId)||initial,[product.variants,variantId,initial]);
  const size=variant?.options?.Size || variant?.title || product.sizes?.[0] || 'OS';
  const price=variant?.price ?? product.price; const compare=variant?.compareAt ?? product.compareAt;
  const images=product.images?.length?product.images:['/images/products/the-number-one/1.webp'];
  const care=product.care || 'For best results, follow the care label attached to the garment. Contact us before washing if you need product-specific care guidance.';
  return <section className="pdp">
    <div className="pdp-gallery" id="product-media">{images.map((im,i)=><div className="pdp-image" key={`${im}-${i}`}><Image src={im} fill priority={i<2} sizes="(max-width: 820px) 100vw, 34vw" alt={`${product.title} image ${i+1}`}/><span className="media-index">{i+1}/{images.length}</span></div>)}</div>
    <div className="pdp-info" id="product-information">
      <span className="eyebrow">{String(product.productType || product.category || '6IX TO GO').toUpperCase()}</span>
      <h1>{product.title}</h1>
      <div className="pdp-price">{compare>price&&<s>{money(compare,product.currencyCode)}</s>}<strong>{money(price,product.currencyCode)}</strong></div>
      <div className="pdp-description"><p>{product.description}</p>{product.details?.length>0&&<ul>{product.details.map(d=><li key={d}>{d}</li>)}</ul>}{product.color&&<p><b>Colour:</b> {product.color}</p>}</div>
      <div className="size-row"><div><b>SIZE</b><a className="text-button size-help" href="https://wa.me/918108200988" target="_blank" rel="noreferrer">SIZE HELP</a></div><div className={`size-options ${product.sizes?.length===1?'single-size':''}`}>{(product.variants || []).map(v=>{const label=v.options?.Size||v.title;return <button key={v.id} disabled={!v.available} className={`${variantId===v.id?'active':''} ${!v.available?'disabled':''}`} onClick={()=>setVariantId(v.id)}>{label}</button>})}</div></div>
      <p className="size-note">Need help choosing a size? WhatsApp us on +91 81082 00988.</p>
      <button disabled={!product.available || !variant?.available} className="black-button full add-to-cart" onClick={()=>add(product,size,variant)}>{product.available&&variant?.available?'ADD TO CART':'SOLD OUT'}</button>
      <details><summary>PRODUCT & CARE</summary><div>{product.material&&<p><b>Material:</b> {product.material}</p>}<p>{care}</p></div></details>
      <details><summary>SHIPPING & RETURNS</summary><div><p>Orders are generally processed and dispatched within 1–2 business days. Estimated delivery is 2–5 business days for metro cities, 3–7 for other serviceable locations and 5–8 for remote locations.</p><p>Eligible return or exchange requests must be raised within 7 days of delivery. See our Shipping and Return & Exchange policies for full terms.</p></div></details>
    </div>
  </section>
}
