'use client';
import Link from 'next/link';
import { Search, ShoppingBag, UserRound, X, Menu, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navGroups } from '../lib/store-data';
import { useCart } from './CartProvider';

export default function Header(){
  const [menu,setMenu]=useState(false);
  const [search,setSearch]=useState(false);
  const [account,setAccount]=useState(false);
  const [active,setActive]=useState(null);
  const {count,setOpen}=useCart();
  const anyPanel = menu || search || account;
  const closePanels=()=>{setMenu(false);setSearch(false);setAccount(false);setActive(null)};

  useEffect(()=>{const onKey=e=>{if(e.key==='Escape')closePanels()};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[]);

  return <>
    <header className="site-header">
      <div className="header-row">
        <button className="mobile-menu-trigger" onClick={()=>setMenu(true)} aria-label="Open menu"><Menu size={18}/></button>
        <Link className="brand-logo-link" href="/" aria-label="6ix to Go home"><img className="header-logo" src="/brand/logo-secondary-colour.svg" alt="6ix to Go"/></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navGroups.map((g,i)=><div className="nav-item" key={g.label} onMouseEnter={()=>g.items&&setActive(i)} onMouseLeave={()=>setActive(null)}>
            {g.href ? <Link href={g.href}>{g.label}</Link> : <button type="button" aria-expanded={active===i} onClick={()=>setActive(active===i?null:i)}>{g.label}</button>}
            {g.items && active===i && <div className="mega-bar"><div className="mega-inner"><div className="mega-title">{g.label}</div><div className="mega-links">{g.items.map(x=><Link key={x.href+x.label} href={x.href}>{x.label}</Link>)}</div></div></div>}
          </div>)}
        </nav>
        <div className="header-actions">
          <button className="header-action desktop-account" onClick={()=>setAccount(true)} aria-label="Account"><UserRound size={18} strokeWidth={1.4}/></button>
          <button className="header-action" onClick={()=>setSearch(true)} aria-label="Search"><Search size={18} strokeWidth={1.4}/></button>
          <button className="header-action bag-button" onClick={()=>setOpen(true)} aria-label="Open cart"><ShoppingBag size={18} strokeWidth={1.4}/><span>{count || 0}</span></button>
        </div>
      </div>
    </header>

    {anyPanel && <button className="drawer-backdrop" onClick={closePanels} aria-label="Close panel"/>}

    {menu && <aside className="nav-drawer panel-left" aria-label="Menu">
      <div className="drawer-head"><Link className="drawer-logo-link" href="/" onClick={closePanels}><img className="drawer-logo" src="/brand/logo-secondary-colour.svg" alt="6ix to Go"/></Link><button onClick={closePanels} aria-label="Close"><X size={19}/></button></div>
      <div className="drawer-nav-body">
        <Link className="drawer-home" href="/" onClick={closePanels}>HOME <ChevronRight size={14}/></Link>
        {navGroups.map((g)=>g.items?<details className="drawer-nav-group" key={g.label}><summary>{g.label}<span>+</span></summary><div>{g.href&&<Link href={g.href} onClick={closePanels}>VIEW ALL</Link>}{g.items.map(x=><Link href={x.href} key={x.href+x.label} onClick={closePanels}>{x.label}</Link>)}</div></details>:<Link className="drawer-home" key={g.label} href={g.href} onClick={closePanels}>{g.label}<ChevronRight size={14}/></Link>)}
        <div className="drawer-spacer"/>
        <button className="drawer-utility" onClick={()=>{setMenu(false);setAccount(true)}}>ACCOUNT <ChevronRight size={13}/></button>
      </div>
    </aside>}

    {search && <aside className="utility-drawer" aria-label="Search">
      <div className="drawer-head"><strong>SEARCH</strong><button onClick={closePanels} aria-label="Close"><X size={19}/></button></div>
      <form className="search-drawer-form" action="/search"><input name="q" autoFocus placeholder="Search 6ix to Go" aria-label="Search products"/><button type="submit" aria-label="Submit search"><Search size={18} strokeWidth={1.4}/></button></form>
      <div className="drawer-footnote">Search the current 6ix, products and collections.</div>
    </aside>}

    {account && <aside className="utility-drawer" aria-label="Account">
      <div className="drawer-head"><strong>ACCOUNT</strong><button onClick={closePanels} aria-label="Close"><X size={19}/></button></div>
      <div className="account-drawer-body"><h2>6ix to Go Account</h2><p>Sign in to view orders, saved information and a faster checkout experience when Shopify customer accounts are connected.</p><Link className="black-button full" href="/account" onClick={closePanels}>SIGN IN</Link><Link className="account-link" href="/account" onClick={closePanels}>Orders <ChevronRight size={14}/></Link><Link className="account-link" href="/account" onClick={closePanels}>Profile <ChevronRight size={14}/></Link></div>
    </aside>}
  </>
}
