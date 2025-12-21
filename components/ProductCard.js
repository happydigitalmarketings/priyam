import Image from 'next/image';

export default function ProductCard({product}) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item._id === product._id);
      
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({
          _id: product._id,
          title: product.title,
          price: product.price,
          weight: product.weight,
          image: product.images?.[0],
          qty: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      // Open the cart sidebar
      window.dispatchEvent(new Event('openCart'));
    } catch(err) {
      console.error('Error adding to cart:', err);
    }
  };

  const rating = product.rating || 4.5;
  const reviews = product.reviews || 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-green-300 transition-all duration-300 h-full flex flex-col group">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.images && product.images.length ? (
          <Image
            src={product.images[0] || "/images/products/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority
            onError={(e) => {
              e.currentTarget.src = "/images/products/placeholder.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-4">
            <div className="text-3xl mb-2">🛒</div>
            <p className="text-gray-600 text-xs text-center">No image</p>
          </div>
        )}
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 flex flex-col h-full">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-yellow-500">⭐</span>
          <span className="text-xs font-semibold text-gray-800">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-600">({reviews})</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2 flex-grow">
          {product.title}
        </h3>

        {/* Weight */}
        <p className="text-xs text-red-500 font-semibold mb-1">
          {product.weight || 'Standard Pack'}
        </p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gray-900">₹{Math.round(product.price).toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-500 line-through">₹{Math.round(product.originalPrice).toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-1.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
            product.stock === 0 
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <span>🛒</span>
          {product.stock === 0 ? 'Out of Stock' : 'Add'}
        </button>
      </div>
    </div>
  );
}

