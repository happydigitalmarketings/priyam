import Link from 'next/link';
import Image from 'next/image';

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
            <div className="bg-gradient-to-br from-green-100 to-yellow-100 rounded-3xl p-8 relative overflow-hidden shadow-lg">
              {/* Discount Badge */}
              <div className="absolute top-6 right-6 bg-yellow-400 rounded-full w-24 h-24 flex items-center justify-center text-center z-10 shadow-lg">
                <div>
                  <p className="text-lg font-bold text-gray-800">50%</p>
                  <p className="text-xs font-bold text-gray-800">OFF</p>
                </div>
              </div>

              {/* Product Image */}
              <div className="relative w-full h-80 rounded-2xl overflow-hidden">
                <Image
                  src="/images/banner/vegetables-shelf.jpg"
                  alt="Fresh Vegetables & Fruits"
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    e.currentTarget.src = "/images/banner/1.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
