import { useEffect, useState } from 'react';
import CartItem from '../components/CartItem';
import { useRouter } from 'next/router';
export default function CartPage(){
  const [cart, setCart] = useState([]);
  const router = useRouter();
  useEffect(()=>{ setCart(JSON.parse(localStorage.getItem('cart')||'[]')); },[]);
  function changeQty(idx, qty){ const c=[...cart]; c[idx].qty = qty; setCart(c); localStorage.setItem('cart', JSON.stringify(c)); }
  function removeIdx(idx){ const c=[...cart]; c.splice(idx,1); setCart(c); localStorage.setItem('cart', JSON.stringify(c)); }
  function checkout(){ router.push('/checkout'); }
  const total = cart.reduce((s,i)=>s + i.qty * i.price, 0);
  return (
    <div>
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        <div className="space-y-4">
          {cart.length===0 && <p>Your cart is empty</p>}
          {cart.map((item, idx)=> <CartItem key={item.product._id} item={item} onChangeQty={(q)=>changeQty(idx,q)} onRemove={()=>removeIdx(idx)} />)}
        </div>
        <div className="mt-6 p-4 bg-white rounded shadow flex items-center justify-between">
          <div className="text-lg">Total: <span className="font-bold">₹{total}</span></div>
          <div><button onClick={checkout} className="px-4 py-2 bg-green-600 text-white rounded">Checkout</button></div>
        </div>
      </main>
    </div>
  );
}
