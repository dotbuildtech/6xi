'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from './CartProvider';
const money=(n,c='INR')=>c==='INR'?`Rs. ${new Intl.NumberFormat('en-IN',{maximumFractionDigits:0}).format(n)}.00`:new Intl.NumberFormat('en-IN',{style:'currency',currency:c}).format(n);
export default function ProductCard({p}){
  const {add}=useCart(); const [choosing,setChoosing]=useState(false);
  const choices = (p.variants || []).filter(v => v.available !== false);
  const madeToMeasure = choices.some(v => String(v.options?.Size || v.title || '').toUpperCase().includes('MADE TO MEASURE'));
  const begin=()=>{ if(!p.available)return; if(choices.length===1){const v=choices[0];add(p,v.options?.Size || v.title,v);return;} setChoosing(true); };
  const selectVariant=(v)=>{add(p,v.options?.Size || v.title,v);setChoosing(false)};
  return <article className="product-card">
    <Link className="product-image-wrap" href={`/products/${p.slug}`}>
      {p.badge&&<span className="badge">{p.available?p.badge:'SOLD OUT'}</span>}
      <Image src={p.images?.[0] || '/images/products/the-number-one/1.webp'} fill sizes="(max-width: 820px) 50vw, 25vw" alt={p.title}/>
      {p.images?.[1]&&<Image className="hover-image" src={p.images[1]} fill sizes="(max-width: 820px) 50vw, 25vw" alt=""/>}
    </Link>
    <div className="product-meta">
      <div className="product-copy"><Link href={`/products/${p.slug}`}>{p.title}</Link><div className="product-price">{p.compareAt&&<s>{money(p.compareAt,p.currencyCode)}</s>}<span>{money(p.price,p.currencyCode)}</span></div></div>
      {madeToMeasure?<Link className="quick-add" href={`/products/${p.slug}`}><span>VIEW</span><Plus size={11}/></Link>:<button className="quick-add" disabled={!p.available} onClick={begin}>{p.available?<><span>ADD</span><Plus size={11}/></>:<span>SOLD OUT</span>}</button>}
    </div>
    {choosing&&<div className="quick-size-panel"><div><span>SELECT SIZE</span><button onClick={()=>setChoosing(false)} aria-label="Close size selector"><X size={13}/></button></div><div className="quick-sizes">{(p.variants || []).map(v=><button disabled={!v.available} className={!v.available?'disabled':''} key={v.id} onClick={()=>selectVariant(v)}>{v.options?.Size || v.title}</button>)}</div></div>}
  </article>
}
