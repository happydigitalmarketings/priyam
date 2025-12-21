"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      try {
        const c = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(c);
        const t = c.reduce((sum, item) => sum + (item.price * item.qty), 0);
        setTotal(t);
      } catch(err) {
        console.error('Error updating cart:', err);
      }
    };

    updateCart();
    
    window.addEventListener('cartUpdated', updateCart);
    window.addEventListener('storage', updateCart);

    return () => {
      window.removeEventListener('cartUpdated', updateCart);
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  // Listen for cart open event
  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  const handleRemoveItem = (itemId) => {
    try {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      const updated = c.filter(item => item._id !== itemId);
      localStorage.setItem('cart', JSON.stringify(updated));
      setCart(updated);
      const t = updated.reduce((sum, item) => sum + (item.price * item.qty), 0);
      setTotal(t);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch(err) {
      console.error('Error removing item:', err);
    }
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      const c = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = c.find(item => item._id === itemId);
      if (item) {
        item.qty = newQty;
      }
      localStorage.setItem('cart', JSON.stringify(c));
      setCart([...c]);
      const t = c.reduce((sum, item) => sum + (item.price * item.qty), 0);
      setTotal(t);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch(err) {
      console.error('Error updating quantity:', err);
    }
  };

  const delivery = Math.max(0, 40); // Free delivery for orders above 399

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="overflow-y-auto flex-1" style={{ height: 'calc(100vh - 280px)' }}>
          {cart.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="text-gray-600">Your cart is empty</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-4 text-green-600 font-semibold hover:text-green-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="border rounded-lg p-3 bg-gray-50">
                  {/* Item Image */}
                  {item.image && (
                    <div className="relative w-full h-24 mb-3 bg-gray-200 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Item Details */}
                  <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">{item.weight || '1 unit'}</p>

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">₹{Math.round(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleUpdateQty(item._id, item.qty - 1)}
                      className="w-6 h-6 border border-green-600 text-green-600 rounded flex items-center justify-center hover:bg-green-50 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-800">{item.qty}</span>
                    <button 
                      onClick={() => handleUpdateQty(item._id, item.qty + 1)}
                      className="w-6 h-6 border border-green-600 text-green-600 rounded flex items-center justify-center hover:bg-green-50 font-bold"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => handleRemoveItem(item._id)}
                      className="ml-auto text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Total & Checkout */}
        {cart.length > 0 && (
          <div className="border-t p-4 bg-gray-50 sticky bottom-0">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery</span>
                <span className="text-green-600">₹{delivery}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-green-600">₹{Math.round(total + delivery).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full block text-center py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors mb-2"
            >
              Proceed to Checkout
            </Link>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-2 text-gray-700 font-semibold hover:text-gray-900"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
