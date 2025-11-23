
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';

const initialForm = {
  firstName: '',
  lastName: '',
  company: '',
  country: 'India',
  address: '',
  address2: '',
  city: '',
  state: '',
  pin: '',
  phone: '',
  email: '',
  notes: '',
  paymentMethod: 'razorpay',
};

export default function Checkout() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function validate() {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'First name is required.';
    if (!form.lastName) newErrors.lastName = 'Last name is required.';
    if (!form.address) newErrors.address = 'Street address is required.';
    if (!form.city) newErrors.city = 'Town/City is required.';
    if (!form.pin) newErrors.pin = 'PIN Code is required.';
    if (!form.phone) newErrors.phone = 'Phone is required.';
    if (!form.email) newErrors.email = 'Email is required.';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (cart.length === 0) {
      setErrors({ submit: 'Cart is empty.' });
      return;
    }
    setSubmitting(true);
    // Save order and customer info to DB
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form,
        items: cart.map(i => ({ product: i.product?._id || i.product, qty: i.qty, price: i.price })),
        total: subtotal,
        paymentMethod: form.paymentMethod,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!data.success) {
      setErrors({ submit: data.message || 'Order failed.' });
      return;
    }
    if (form.paymentMethod === 'razorpay') {
      // Start Razorpay payment
      const razor = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: subtotal }),
      }).then(r => r.json());
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razor.amount,
        currency: razor.currency,
        name: 'MyStore',
        description: 'Order Payment',
        order_id: razor.id,
        handler: async function (response) {
          // verify on server
          await fetch('/api/orders/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              orderDBId: data.orderId,
            }),
          });
          localStorage.removeItem('cart');
          setOrderPlaced(true);
          setOrderId(data.orderId);
        },
        prefill: { name: form.firstName + ' ' + form.lastName, email: form.email },
      };
      if (typeof window !== 'undefined') {
        if (!window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new window.Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        } else {
          const rzp = new window.Razorpay(options);
          rzp.open();
        }
      }
    } else {
      // Cash on Delivery
      localStorage.removeItem('cart');
      setOrderPlaced(true);
      setOrderId(data.orderId);
    }
  }

  if (orderPlaced) {
    const orderDetails = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      pin: form.pin,
      country: form.country,
      paymentMethod: form.paymentMethod,
      total: subtotal,
      items: cart,
    };

    return (
      <div>
        <main className="max-w-4xl mx-auto p-6 bg-white">
          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Your order is confirmed</h1>
            {form.paymentMethod === 'cod' && (
              <p className="text-center text-gray-600 mb-2">COD Collection fee Rs.  ₹{subtotal.toLocaleString('en-IN')}  is applicable.</p>
            )}
          </div>

          {/* Order Details Card */}
          <div className="border border-gray-300 rounded-lg p-8 space-y-8">
            
            {/* Order Details Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Order details</h2>
              <div className="space-y-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b pb-3">
                    <div className="flex-1">
                      <p className="font-semibold">{item.product?.title || item.name || 'Product'}</p>
                      <p className="text-gray-600 text-sm">Quantity: {item.qty}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg pt-4">
                  <span>Total:</span>
                  <span>₹{subtotal.toLocaleString('en-IN')} INR</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold mb-3">Contact information</h3>
              <p className="text-gray-700">{form.email}</p>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="text-lg font-bold mb-3">Shipping address</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{form.firstName} {form.lastName}</p>
                <p>{form.address} {form.address2 ? form.address2 + ',' : ''}</p>
                <p>{form.city} {form.state} {form.pin}</p>
                <p>{form.country}</p>
                <p className="font-semibold">{form.phone}</p>
              </div>
            </div>

            {/* Shipping Method */}
            <div>
              <h3 className="text-lg font-bold mb-3">Shipping method</h3>
              <p className="text-gray-700">Standard</p>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-bold mb-3">Payment method</h3>
              <p className="text-gray-700">
                {form.paymentMethod === 'cod' 
                  ? `Cash on Delivery (COD) · ₹${subtotal.toLocaleString('en-IN')} INR` 
                  : `Credit Card/Debit Card/NetBanking (Razorpay) · ₹${subtotal.toLocaleString('en-IN')} INR`}
              </p>
            </div>

            {/* Billing Address (same as shipping) */}
            <div>
              <h3 className="text-lg font-bold mb-3">Billing address</h3>
              <div className="text-gray-700 space-y-1">
                <p className="font-semibold">{form.firstName} {form.lastName}</p>
                <p>{form.address} {form.address2 ? form.address2 + ',' : ''}</p>
                <p>{form.city} {form.state} {form.pin}</p>
                <p>{form.country}</p>
                <p className="font-semibold">{form.phone}</p>
              </div>
            </div>
          </div>

          {/* Order ID Info */}
          {/* <div className="mt-8 text-center bg-gray-50 p-4 rounded">
            <p className="text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">{orderId}</p>
          </div> */}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 justify-center">
            <button 
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => router.push('/')}
            >
              Back to Home
            </button>
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => router.push('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='bg-[#FDF8F1]'>
   
      <main className="max-w-6xl mx-auto p-4 bg-[#FDF8F1]">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        {errors.submit && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errors.submit}</div>}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Billing details</h2>
            <div className="mb-2">
              <label>First name *</label>
              <input className="w-full border p-2 rounded" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
              {errors.firstName && <div className="text-red-600 text-sm">{errors.firstName}</div>}
            </div>
            <div className="mb-2">
              <label>Last name *</label>
              <input className="w-full border p-2 rounded" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
              {errors.lastName && <div className="text-red-600 text-sm">{errors.lastName}</div>}
            </div>
            <div className="mb-2">
              <label>Company name (optional)</label>
              <input className="w-full border p-2 rounded" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="mb-2">
              <label>Country/Region *</label>
              <input className="w-full border p-2 rounded" value={form.country} disabled />
            </div>
            <div className="mb-2">
              <label>Street address *</label>
              <input className="w-full border p-2 rounded" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              {errors.address && <div className="text-red-600 text-sm">{errors.address}</div>}
            </div>
            <div className="mb-2">
              <label>Apartment, suite, unit, etc. (optional)</label>
              <input className="w-full border p-2 rounded" value={form.address2} onChange={e => setForm(f => ({ ...f, address2: e.target.value }))} />
            </div>
            <div className="mb-2">
              <label>Town / City *</label>
              <input className="w-full border p-2 rounded" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              {errors.city && <div className="text-red-600 text-sm">{errors.city}</div>}
            </div>
            <div className="mb-2">
              <label>State *</label>
              <input className="w-full border p-2 rounded" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
            </div>
            <div className="mb-2">
              <label>PIN Code *</label>
              <input className="w-full border p-2 rounded" value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value }))} />
              {errors.pin && <div className="text-red-600 text-sm">{errors.pin}</div>}
            </div>
            <div className="mb-2">
              <label>Phone *</label>
              <input className="w-full border p-2 rounded" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
            </div>
            <div className="mb-2">
              <label>Email address *</label>
              <input className="w-full border p-2 rounded" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
            </div>
            <div className="mb-2">
              <label>Order notes (optional)</label>
              <textarea className="w-full border p-2 rounded" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Your order</h2>
            <div className="bg-gray-50 p-4 rounded mb-4">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between mb-2">
                  <span>{item.product?.title || ''} × {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Payment method</label>
              <div className="mb-2">
                <label className="inline-flex items-center">
                  <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod==='cod'} onChange={() => setForm(f => ({ ...f, paymentMethod: 'cod' }))} />
                  <span className="ml-2">Cash on delivery</span>
                </label>
              </div>
              <div>
                <label className="inline-flex items-center">
                  <input type="radio" name="paymentMethod" value="razorpay" checked={form.paymentMethod==='razorpay'} onChange={() => setForm(f => ({ ...f, paymentMethod: 'razorpay' }))} />
                  <span className="ml-2">Credit Card/Debit Card/NetBanking (Razorpay)</span>
                </label>
              </div>
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded" disabled={submitting}>{submitting ? 'Placing order...' : 'Place order'}</button>
          </div>
        </form>
      </main>
    </div>
  );
}
