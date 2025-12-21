import Link from 'next/link';

export default function Categories() {
  const categories = [
    { name: 'Fruits & Vegetables', icon: '🥬', count: '34 items' },
    { name: 'Dairy & Eggs', icon: '🥛', count: '28 items' },
    { name: 'Bakery', icon: '🍞', count: '22 items' },
    { name: 'Beverages', icon: '🍷', count: '45 items' },
    { name: 'Snacks', icon: '🍿', count: '56 items' },
    { name: 'Grocery & Staples', icon: '🌾', count: '78 items' },
    { name: 'Personal Care', icon: '🧴', count: '31 items' },
    { name: 'Household', icon: '🏠', count: '42 items' }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
          <Link href="/categories" className="text-green-600 font-semibold hover:text-green-700">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, idx) => (
            <Link 
              key={idx}
              href={`/products?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="group text-center p-6 rounded-2xl border-2 border-gray-100 hover:border-green-600 hover:bg-green-50 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-gray-600 mt-1">{category.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
