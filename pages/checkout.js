import { useEffect, useState } from 'react';
export default function Checkout(){ 
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(()=> setCart(JSON.parse(localStorage.getItem('cart')||'[]')), []);
  const total = cart.reduce((s,i)=>s + i.qty * i.price, 0);
  async function startPayment(){
    if(cart.length===0) return alert('Cart empty');
    setLoading(true);
    // create order in DB
    const createOrder = await fetch('/api/orders/create', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: cart.map(i=>({ product: i.product._id, qty: i.qty, price: i.price })), shippingAddress: {}, total, paymentMethod: 'razorpay' }) }).then(r=>r.json());
    const orderDBId = createOrder.orderId;
    // create razor order
    const razor = await fetch('/api/razorpay/create-order', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount: total }) }).then(r=>r.json());
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: razor.amount,
      currency: razor.currency,
      name: 'MyStore',
      description: 'Order Payment',
      order_id: razor.id,
      handler: async function(response){
        // verify on server
        await fetch('/api/orders/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature, orderDBId }) });
        localStorage.removeItem('cart');
        window.location.href = '/';
      },
      prefill: { name: '', email: '' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  }
  return (
    <div>
      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="mt-4 bg-white rounded shadow p-4">
          <p>Total payable: <strong>₹{total}</strong></p>
          <button onClick={startPayment} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Processing...' : 'Pay with Razorpay'}</button>
        </div>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </main>
    </div>
  );
}
