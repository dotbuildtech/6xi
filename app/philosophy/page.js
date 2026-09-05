import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title:'Our Philosophy — 6ix to Go' };

const principles=[
  ['01','LIMITED BY DESIGN','Six products at a time is not a marketing trick. It is the filter we use to keep every drop focused, recognisable and worth paying attention to.'],
  ['02','NOSTALGIA, REWORKED','We borrow the energy of Y2K, early-2000s graphics, travel, music and pop culture — then rebuild those references so they feel current rather than costume-like.'],
  ['03','GRAPHICS WITH A POINT OF VIEW','A print should do more than fill space. Colour, typography and illustration are treated as part of the identity of the garment, not decoration added at the end.'],
  ['04','MADE TO BECOME YOURS','The final meaning comes from the person wearing it. We want pieces that can carry memories, become favourites and feel more personal over time.']
];

export default function Philosophy(){
  return <main className="philosophy-page">
    <section className="philosophy-hero">
      <div className="philosophy-hero-copy"><span>OUR PHILOSOPHY</span><h1>LESS NOISE.<br/>MORE CHARACTER.</h1><p>We would rather make a small number of pieces with a clear personality than an endless stream of clothes designed to disappear into the feed.</p></div>
      <div className="philosophy-hero-image"><Image src="/images/products/the-starter/3.webp" fill priority sizes="(max-width:820px) 100vw, 52vw" alt="6ix to Go campaign portrait"/></div>
    </section>

    <section className="philosophy-statement"><p>THE GOAL ISN&apos;T TO MAKE CLOTHES FOR EVERYONE.</p><h2>IT&apos;S TO MAKE SOMETHING<br/>THE RIGHT PERSON IMMEDIATELY GETS.</h2></section>

    <section className="principles-grid">{principles.map(([n,t,b])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</section>

    <section className="philosophy-feature">
      <div className="philosophy-feature-image"><Image src="/images/products/the-number-one/4.webp" fill sizes="(max-width:820px) 100vw, 50vw" alt="6ix to Go graphic detail"/></div>
      <div className="philosophy-feature-copy"><span>THE 6IX METHOD</span><h2>EDIT FIRST.<br/>RELEASE SECOND.</h2><p>Every product has to justify its place in the drop. That keeps the collection tight and gives each design room to be noticed.</p><Link href="/collections/drop-01">SHOP THE 6IX →</Link></div>
    </section>
  </main>;
}
