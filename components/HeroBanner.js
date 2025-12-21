import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-yellow-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <p className="text-green-600 font-semibold text-sm mb-2">✓ Fresh Always Deals</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                Fresh Groceries,
                <span className="text-green-600"> Delivered</span> to
                <span className="text-green-600"> Your Door</span>
              </h1>
            </div>
            
            <p className="text-gray-600 text-lg">
              Shop from thousands of fresh products at Priyam Supermarket. Quality guaranteed, always fresh, always affordable.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link 
                href="/products"
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Shop Now →
              </Link>
              <Link 
                href="/offers"
                className="px-8 py-3 bg-white border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                View Offers
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-yellow-100 rounded-3xl p-8 relative overflow-hidden">
              {/* Discount Badge */}
              <div className="absolute top-6 right-6 bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center text-center z-10">
                <div>
                  <p className="text-sm font-bold text-gray-800">50% OFF</p>
                </div>
              </div>

              {/* Product Image Placeholder */}
              <div className="w-full h-80 bg-gradient-to-b from-green-300 to-green-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🥬🍎🥕🧅🥦</div>
                  <p className="text-gray-700 font-semibold text-lg">Fresh Vegetables & Fruits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
