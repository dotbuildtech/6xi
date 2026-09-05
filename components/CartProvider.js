'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('6ix-to-go-cart') || '[]')); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem('6ix-to-go-cart', JSON.stringify(items)); } catch {} }, [items]);

  const add = (product, size='M', variantOverride=null) => {
    const variant = variantOverride || product.variants?.find(v => v.options?.Size === size || v.title === size) || product.variants?.find(v => v.available) || product.variants?.[0];
    if (variant && variant.available === false) return false;
    setItems(curr => {
      const key = variant?.id || `${product.slug}-${size}`;
      const found = curr.find(i => i.key === key);
      const row = {
        key,
        merchandiseId: variant?.id?.startsWith('gid://shopify/ProductVariant/') ? variant.id : null,
        slug: product.slug,
        title: product.title,
        price: variant?.price ?? product.price,
        image: variant?.image || product.images?.[0],
        size,
        qty: found ? found.qty + 1 : 1
      };
      return found ? curr.map(i => i.key === key ? {...i, qty:i.qty+1} : i) : [...curr, row];
    });
    setOpen(true);
    return true;
  };
  const remove = key => setItems(curr => curr.filter(i => i.key !== key));
  const setQty = (key, qty) => setItems(curr => qty <= 0 ? curr.filter(i => i.key !== key) : curr.map(i => i.key===key ? {...i, qty:Math.max(1,qty)} : i));
  const total = useMemo(() => items.reduce((s,i)=>s+i.price*i.qty,0),[items]);
  const count = useMemo(() => items.reduce((s,i)=>s+i.qty,0),[items]);

  const checkout = async () => {
    setCheckoutBusy(true); setCheckoutError('');
    try {
      const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ lines: items.map(i => ({ merchandiseId:i.merchandiseId, quantity:i.qty })) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout is not available yet.');
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (error) { setCheckoutError(error.message); }
    finally { setCheckoutBusy(false); }
  };

  return <CartContext.Provider value={{items,add,remove,setQty,total,count,open,setOpen,checkout,checkoutBusy,checkoutError}}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
