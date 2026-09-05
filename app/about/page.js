import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title:'About 6ix to Go' };

export default function About(){
  return <main className="brand-about">
    <section className="about-campaign" aria-label="6ix to Go brand film">
      <video autoPlay muted loop playsInline preload="metadata" className="about-campaign-video">
        <source src="/media/home-desktop.mp4" type="video/mp4" />
      </video>
      <div className="about-film-shade" />
      <div className="about-film-title"><span>ABOUT</span><strong>6IX TO GO</strong></div>
      <div className="about-marquee" aria-hidden="true"><div>6IX PIECES AT A TIME. ONE DIFFERENT MINDSET. &nbsp;&nbsp;&nbsp; 6IX PIECES AT A TIME. ONE DIFFERENT MINDSET. &nbsp;&nbsp;&nbsp; 6IX PIECES AT A TIME. ONE DIFFERENT MINDSET.</div></div>
    </section>

    <section className="about-mission">
      <div className="about-mission-inner">
        <p className="about-mission-title">6IX TO GO IS A STREETWEAR LABEL BUILT AROUND EDITED DROPS.</p>
        <p>EVERY RELEASE IS LIMITED TO <strong>SIX PRODUCTS</strong> — ENOUGH ROOM TO EXPLORE AN IDEA WITHOUT FILLING A COLLECTION WITH NOISE.</p>
        <p>THE VISUAL WORLD PULLS FROM <strong>Y2K CULTURE, TRAVEL, GRAPHIC DESIGN AND EARLY-2000S ENERGY</strong>, THEN REWORKS THOSE REFERENCES FOR THE WAY WE DRESS NOW.</p>
        <p>INSPIRED BY LA. BUILT IN INDIA. MADE FOR PEOPLE WHO WOULD RATHER <strong>STAND APART THAN FIT A TEMPLATE.</strong></p>
      </div>
    </section>

    <section className="about-full-image">
      <Image src="/images/products/the-bloodline/3.webp" fill sizes="100vw" alt="6ix to Go Bloodline campaign" />
      <div className="about-full-image-copy">SIX AT A TIME.</div>
    </section>

    <section className="about-paths">
      <div className="about-paths-head"><span>GO DEEPER</span><h2>THREE SIDES<br/>OF THE BRAND.</h2></div>
      <div className="about-paths-grid">
        <Link href="/story"><span>01</span><h3>THE STORY</h3><p>Where the idea came from, why Los Angeles mattered and how the six-piece format became the name.</p><b>READ THE STORY →</b></Link>
        <Link href="/philosophy"><span>02</span><h3>OUR PHILOSOPHY</h3><p>The principles behind the drops: edited collections, reworked nostalgia and graphics with a point of view.</p><b>EXPLORE THE PHILOSOPHY →</b></Link>
        <Link href="/signup"><span>03</span><h3>MEMBER ACCESS</h3><p>Get closer to each release with early drop access, restock news and behind-the-6ix updates.</p><b>JOIN THE 6IX →</b></Link>
      </div>
    </section>
  </main>;
}
