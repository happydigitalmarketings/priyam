import Link from 'next/link';

export default function Deals() {
  const deals = [
    {
      title: 'Fresh Fruits',
      subtitle: 'Up to 70% off',
      color: 'from-orange-400 to-red-500',
      icon: '🍎',
      link: '/products?category=fruits'
    },
    {
      title: 'Dairy Products',
      subtitle: 'Buy 2 Get 1 free',
      color: 'from-blue-400 to-cyan-500',
      icon: '🥛',
      link: '/products?category=dairy'
    },
    {
      title: 'Grocery Staples',
      subtitle: 'Saving 15%',
      color: 'from-green-400 to-emerald-500',
      icon: '🌾',
      link: '/products?category=grocery'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Today's Best Deals</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((deal, idx) => (
            <Link 
              key={idx}
              href={deal.link}
              className="group relative overflow-hidden rounded-2xl h-48 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${deal.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="relative h-full flex flex-col justify-between p-8 text-white">
                <div className="text-5xl">{deal.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{deal.title}</h3>
                  <p className="text-white/90 font-semibold">{deal.subtitle}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-sm font-bold bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100">
                    Shop Now →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
