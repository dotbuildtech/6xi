'use client';
import { useEffect, useMemo, useState } from 'react';
import { Star, X } from 'lucide-react';

const storageKey = slug => `6ix-reviews:${slug}`;

export default function Reviews({ product }) {
  const [reviews, setReviews] = useState([]);
  const [mode, setMode] = useState('loading');
  const [formOpen, setFormOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState('');

  const load = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(product.shopifyProductId || '')}`, { cache: 'no-store' });
      const data = await res.json();
      setMode(data.mode || 'demo');
      if (data.mode === 'judgeme') setReviews(data.reviews || []);
      else {
        try { setReviews(JSON.parse(localStorage.getItem(storageKey(product.slug)) || '[]')); } catch { setReviews([]); }
      }
    } catch {
      setMode('demo');
      try { setReviews(JSON.parse(localStorage.getItem(storageKey(product.slug)) || '[]')); } catch { setReviews([]); }
    }
  };
  useEffect(() => { load(); }, [product.slug, product.shopifyProductId]);

  const average = useMemo(() => reviews.length ? reviews.reduce((n,r) => n + Number(r.rating || 0), 0) / reviews.length : 0, [reviews]);

  async function submit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!rating) { setStatus('Choose a star rating.'); return; }
    const review = {
      id: `local-${Date.now()}`,
      name: fd.get('name'), email: fd.get('email'), title: fd.get('title'), body: fd.get('body'), rating,
      createdAt: new Date().toISOString(), verified: false
    };
    setStatus('Submitting…');
    const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...review, productId: product.shopifyProductId }) });
    const data = await res.json();
    if (!res.ok) { setStatus(data.error || 'Could not submit review.'); return; }
    if (data.mode === 'demo') {
      const next = [review, ...reviews];
      localStorage.setItem(storageKey(product.slug), JSON.stringify(next));
      setReviews(next);
    } else await load();
    e.currentTarget.reset(); setRating(0); setHoverRating(0); setStatus('Review submitted.');
    setTimeout(() => { setFormOpen(false); setStatus(''); }, 650);
  }

  return <section className="reviews" id="reviews">
    <div className="reviews-head"><h2>Customer Reviews</h2><button className="outline-button" onClick={() => setFormOpen(true)}>WRITE A REVIEW</button></div>
    <div className="reviews-summary">
      <div className="review-score">{average.toFixed(1)}</div>
      <div><div className="stars-static" aria-label={`${average.toFixed(1)} out of 5`}>{[1,2,3,4,5].map(n => <Star key={n} size={15} fill={n <= Math.round(average) ? 'currentColor' : 'none'} strokeWidth={1.3}/>)}</div><p>{reviews.length ? `${reviews.length} review${reviews.length === 1 ? '' : 's'}` : 'Be the first to write a review'}</p></div>
    </div>
    {reviews.length > 0 && <div className="review-list">{reviews.map(r => <article className="review-item" key={r.id}><div className="review-item-top"><div className="stars-static">{[1,2,3,4,5].map(n => <Star key={n} size={13} fill={n <= r.rating ? 'currentColor' : 'none'} strokeWidth={1.3}/>)}</div><time>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : ''}</time></div>{r.title && <h3>{r.title}</h3>}<p>{r.body}</p><small>{r.name}{r.verified ? ' · Verified buyer' : ''}</small></article>)}</div>}
    {formOpen && <><button className="drawer-backdrop review-backdrop" onClick={() => setFormOpen(false)} aria-label="Close review form"/><aside className="review-drawer" aria-label="Write a review"><div className="drawer-head"><strong>WRITE A REVIEW</strong><button onClick={() => setFormOpen(false)} aria-label="Close"><X size={19}/></button></div><form className="review-form" onSubmit={submit}><div className="review-rating"><span>YOUR RATING</span><div>{[1,2,3,4,5].map(n => <button type="button" key={n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(n)}><Star size={25} fill={n <= (hoverRating || rating) ? 'currentColor' : 'none'} strokeWidth={1.2}/></button>)}</div></div><label>Name<input name="name" required autoComplete="name"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label><label>Review title<input name="title" maxLength="120"/></label><label>Review<textarea name="body" required rows="6" maxLength="3000"/></label>{status && <p className="form-status">{status}</p>}<button className="black-button full" type="submit">SUBMIT REVIEW</button></form></aside></>}
  </section>;
}
