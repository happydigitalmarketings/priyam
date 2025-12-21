export default function Features() {
  const features = [
    {
      icon: '🚚',
      title: 'Free Delivery',
      description: 'Above ₹399'
    },
    {
      icon: '⚡',
      title: 'Fast Delivery',
      description: 'Within 1 hour'
    },
    {
      icon: '✓',
      title: '100% Fresh',
      description: 'Quality assured'
    }
  ];

  return (
    <section className="py-12 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <div className="text-5xl">{feature.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
