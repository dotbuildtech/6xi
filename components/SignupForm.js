'use client';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SignupForm(){
  const [status,setStatus]=useState('');
  const submit=(e)=>{
    e.preventDefault();
    const email=new FormData(e.currentTarget).get('email');
    if(!email)return;
    try{localStorage.setItem('6ix-newsletter-email',String(email));}catch{}
    setStatus('YOU’RE IN. WATCH YOUR INBOX.');
    e.currentTarget.reset();
  };
  return <form className="member-form" onSubmit={submit}>
    <label htmlFor="member-email">SIGN UP BELOW FOR MEMBER ACCESS.</label>
    <div className="member-input-wrap">
      <input id="member-email" name="email" type="email" required placeholder="Email address" autoComplete="email" />
      <button type="submit" aria-label="Join 6ix to Go member access"><ArrowRight size={31} strokeWidth={1.45}/></button>
    </div>
    <div className="member-consent">By signing up, you agree to receive 6ix to Go updates. You can unsubscribe at any time.</div>
    {status&&<div className="member-success" role="status">{status}</div>}
  </form>;
}
