import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title:'The Story — 6ix to Go' };

const chapters=[
  ['01','LOS ANGELES','The idea started with contrast. In Los Angeles, streetwear felt less like a dress code and more like a language — graphics, music, nostalgia and personal references all living on the same garment.'],
  ['02','BACK TO INDIA','Coming home made the gap clearer. There was room for a label that could bring that expressive energy into an Indian context without simply imitating what already existed elsewhere.'],
  ['03','WHY SIX','The answer became the name. Six pieces per drop keeps every release edited, intentional and easy to remember. No endless catalogue. No filler. Each product has to earn its place.'],
  ['04','WHAT COMES NEXT','6ix to Go is still being written. Every drop adds another reference, another colour and another reason to look twice — while the core stays the same: individuality over sameness.']
];

export default function Story(){
  return <main className="story-destination">
    <section className="story-hero">
      <div className="story-hero-image"><Image src="/images/products/the-number-one/4.webp" fill priority sizes="(max-width:820px) 100vw, 58vw" alt="6ix to Go campaign back graphic"/></div>
      <div className="story-hero-copy"><span>THE STORY</span><h1>FROM A DIFFERENT CITY.<br/>FOR A DIFFERENT POINT OF VIEW.</h1><p>6ix to Go grew out of one simple observation: the clothes people remember usually say something before the person wearing them does.</p></div>
    </section>

    <section className="story-chapters">
      <div className="story-chapters-title"><span>ORIGIN</span><h2>HOW THE 6IX<br/>CAME TO BE.</h2></div>
      <div className="story-chapters-list">{chapters.map(([n,t,b])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{b}</p></div></article>)}</div>
    </section>

    <section className="story-image-pair">
      <div><Image src="/images/products/the-bloodline/4.webp" fill sizes="50vw" alt="6ix to Go Bloodline detail"/></div>
      <div><Image src="/images/products/the-ride/3.webp" fill sizes="50vw" alt="6ix to Go campaign styling"/></div>
    </section>

    <section className="story-ending"><span>THE NAME IS A SYSTEM.</span><h2>SIX PIECES.<br/>A NEW CHAPTER EACH TIME.</h2><p>That limit forces us to choose harder, edit more and make every release feel deliberate.</p><Link href="/collections/drop-01">EXPLORE THE CURRENT 6IX →</Link></section>
  </main>;
}
