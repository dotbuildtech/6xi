'use client';
import { useMemo, useState } from 'react';
import ProductGrid from '../../components/ProductGrid';
export default function SearchClient({products,initialQuery=''}){
  const [q,setQ]=useState(initialQuery);
  const results=useMemo(()=>q.trim()?products.filter(p=>(p.title+' '+p.category+' '+p.color).toLowerCase().includes(q.toLowerCase())):products,[q,products]);
  return <section className="page-shell"><div className="page-title"><span>SEARCH</span><h1>SEARCH</h1></div><input autoFocus className="search-input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search"/><p className="result-count">{results.length} results</p><ProductGrid products={results}/>{!results.length&&<p className="no-results">No products found.</p>}</section>
}
