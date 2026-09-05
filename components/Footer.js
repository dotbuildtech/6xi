'use client';
import Link from 'next/link';
import { useState } from 'react';
export default function Footer(){
  const [status,setStatus]=useState('');
  const submit=(e)=>{e.preventDefault();const email=new FormData(e.currentTarget).get('email');if(!email)return;try{localStorage.setItem('6ix-newsletter-email',email)}catch{}setStatus('YOU’RE ON THE LIST.');e.currentTarget.reset()};
  return <footer className="footer" id="newsletter">
    <div className="newsletter-row"><div><span className="footer-kicker">SIGN UP</span><p>Get first access to new drops, restocks and 6ix to Go updates.</p>{status&&<small className="newsletter-status">{status}</small>}</div><form className="newsletter-form" onSubmit={submit}><input name="email" type="email" required placeholder="Email address" aria-label="Email address"/><button type="submit">SUBSCRIBE</button></form></div>
    <div className="footer-top"><div className="footer-brand"><img src="/brand/logo-secondary-black.svg" alt="6ix to Go"/></div><div className="footer-links"><Link href="/about">About</Link><Link href="/signup">Member access</Link><Link href="/policies/refund-policy">Return & exchange</Link><Link href="/policies/privacy-policy">Privacy policy</Link><Link href="/policies/terms-of-service">Terms & conditions</Link><Link href="/policies/shipping-policy">Shipping policy</Link><Link href="/policies/contact-information">Contact</Link></div></div>
    <div className="footer-bottom"><span>© 2026 6IX TO GO</span><span>INDIA / INR ₹</span></div>
  </footer>
}
