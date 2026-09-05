'use client';
import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import ProductGrid from '../../../components/ProductGrid';
export default function CollectionClient({initial,title}){
  const ceiling=Math.max(100,Math.ceil(Math.max(...initial.map(p=>p.price||0),100)/100)*100);
  const [stock,setStock]=useState('all'); const [sort,setSort]=useState('featured'); const [max,setMax]=useState(ceiling); const [filters,setFilters]=useState(false);
  const filtered=useMemo(()=>{let arr=initial.filter(p=>(stock==='all'||(stock==='in'?p.available:!p.available))&&p.price<=max); if(sort==='low')arr=[...arr].sort((a,b)=>a.price-b.price); if(sort==='high')arr=[...arr].sort((a,b)=>b.price-a.price); if(sort==='az')arr=[...arr].sort((a,b)=>a.title.localeCompare(b.title)); if(sort==='za')arr=[...arr].sort((a,b)=>b.title.localeCompare(a.title)); return arr;},[initial,stock,sort,max]);
  const clear=()=>{setStock('all');setMax(ceiling);setSort('featured')};
  return <section className="collection-page">
    <div className="collection-heading"><h1>{title}</h1></div>
    <div className="collection-bar"><div className="collection-bar-left"><button className="filter-trigger" onClick={()=>setFilters(true)}>FILTER</button><span>{filtered.length} ITEMS</span></div><label className="sort-control">SORT <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option><option value="az">Alphabetically, A–Z</option><option value="za">Alphabetically, Z–A</option></select></label></div>
    <ProductGrid products={filtered}/>{!filtered.length&&<p className="no-results collection-empty">No products match these filters.</p>}
    {filters&&<><button className="drawer-backdrop" onClick={()=>setFilters(false)} aria-label="Close filters"/><aside className="filter-drawer"><div className="drawer-head"><strong>FILTER</strong><button onClick={()=>setFilters(false)} aria-label="Close"><X size={19}/></button></div><div className="filter-body"><fieldset><legend>Availability</legend><label><input type="radio" name="stock" checked={stock==='all'} onChange={()=>setStock('all')}/> All</label><label><input type="radio" name="stock" checked={stock==='in'} onChange={()=>setStock('in')}/> In stock</label><label><input type="radio" name="stock" checked={stock==='out'} onChange={()=>setStock('out')}/> Out of stock</label></fieldset><fieldset><legend>Price</legend><div className="price-fields"><span>₹</span><input type="number" min="0" step="100" value={max} onChange={e=>setMax(Number(e.target.value)||0)}/></div><small>Highest price: ₹{ceiling.toLocaleString('en-IN')}</small></fieldset></div><div className="filter-foot"><button className="text-button" onClick={clear}>CLEAR ALL</button><button className="black-button" onClick={()=>setFilters(false)}>SEE {filtered.length} ITEMS</button></div></aside></>}
  </section>
}
