import Image from 'next/image';
import SignupForm from '../../components/SignupForm';

export const metadata = { title:'Member Access — 6ix to Go' };

const benefits=[
  ['MEMBER ACCESS','FIRST LOOK AT NEW DROPS, RESTOCKS AND LIMITED RELEASES BEFORE THE GENERAL ANNOUNCEMENT.'],
  ['DROP PRIORITY','BE FIRST IN LINE WHEN A NEW 6IX GOES LIVE — ESPECIALLY WHEN QUANTITIES ARE LIMITED.'],
  ['BEHIND THE 6IX','GET CAMPAIGN NOTES, DESIGN STORIES, EARLY PREVIEWS AND THE PROCESS BEHIND EACH RELEASE.']
];

export default function Signup(){
  return <main className="member-page">
    <section className="member-hero member-hero-static">
      <Image src="/images/products/the-regrettucine/4.webp" fill priority sizes="100vw" alt="6ix to Go Member Access campaign" className="member-hero-image"/>
      <div className="member-hero-overlay" />
      <div className="member-date">THE 6IX</div>
      <div className="member-hero-copy"><span>MEMBER ACCESS</span><h1>GET IN<br/>BEFORE THE DROP.</h1></div>
      <div className="member-time">EARLY ACCESS</div>
      <img className="member-hero-logo" src="/brand/logo-secondary-colour.svg" alt="6ix to Go" />
    </section>

    <section className="member-content">
      <h2>JOIN THE 6IX FOR EARLY ACCESS</h2>
      <div className="member-benefits">{benefits.map(([title,copy])=><article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <SignupForm />
    </section>
  </main>;
}
