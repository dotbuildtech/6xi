import Image from 'next/image';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import { getCollection, getHomepageContent } from '../lib/commerce';

export default async function Home(){
  const home = await getHomepageContent();
  const primary = home.campaigns?.[0];
  const secondary = home.campaigns?.[1] || primary;
  const [featured, essentials] = await Promise.all([
    getCollection(home.featuredCollection || 'drop-01'),
    getCollection(home.essentialsCollection || 'shop-all')
  ]);
  const editorial = home.editorialImages || [];
  return <main className="home-page">
    <section className="home-hero home-video-hero" aria-label="6ix to Go campaign">
      <video className="hero-video hero-video-desktop" autoPlay muted loop playsInline preload="metadata">
        <source src={home.homeMedia?.desktopVideo || '/media/home-desktop.mp4'} type="video/mp4"/>
      </video>
      <video className="hero-video hero-video-mobile" autoPlay muted loop playsInline preload="metadata">
        <source src={home.homeMedia?.mobileVideo || '/media/home-mobile.mp4'} type="video/mp4"/>
      </video>
      <div className="hero-caption"><span>{primary?.eyebrow || 'DROP 01'}</span></div>
    </section>

    <section className="editorial-copy intro-copy">
      <span className="editorial-eyebrow">{primary?.eyebrow}</span>
      <h1>{primary?.title || '6IX PRODUCTS. ONE DROP.'}</h1>
      <p>{primary?.body || '6ix pieces. 6ix ideas. 6ix chances to wear something different.'}</p>
      <Link href={primary?.href || '/collections/drop-01'}>SHOP THE 6IX</Link>
    </section>

    <section className="home-product-run"><ProductGrid products={(featured?.products || []).slice(0,6)}/></section>

    <section className="campaign-triptych">
      {(editorial.length ? editorial : ['/images/products/the-number-one/4.webp','/images/products/the-starter/4.webp','/images/products/the-bloodline/3.webp']).slice(0,3).map((src,i)=><div key={src}><Image src={src} fill sizes="33vw" alt={`6ix to Go editorial ${i+1}`}/></div>)}
    </section>

    <section className="editorial-copy origins-copy">
      <span className="editorial-eyebrow">{secondary?.eyebrow || 'ABOUT 6IX TO GO'}</span>
      <h2>{secondary?.title || 'BRINGING THE 2000S BACK TO INDIA'}</h2>
      <p>{secondary?.body || 'Inspired by LA. Built in India. Made for a generation that wants to stand apart.'}</p>
      <Link href={secondary?.href || '/about'}>OUR STORY</Link>
    </section>

    <section className="home-product-run"><ProductGrid products={(essentials?.products || []).slice(0,6)}/></section>

    <section className="home-closing-media">
      <div><Image src="/images/products/the-ride/2.webp" fill sizes="50vw" alt="The Ride by 6ix to Go"/></div>
      <div><Image src="/images/products/the-regrettucine/5.webp" fill sizes="50vw" alt="The Regrettucine by 6ix to Go"/></div>
    </section>
  </main>
}
