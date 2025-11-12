import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function AdminLayout({ children, user }) {
  const router = useRouter();

  const menuItems = [
    { icon: 'grid', label: 'Dashboard', href: '/admin' },
    { icon: 'box', label: 'Products', href: '/admin/products' },
    { icon: 'shopping-bag', label: 'Orders', href: '/admin/orders' },
    { icon: 'file-text', label: 'Blog Posts', href: '/admin/blogs' },
    { icon: 'bar-chart-2', label: 'Sales Reports', href: '/admin/reports' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
             
            </div>
            
            {/* Admin Profile */}
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">Welcome, {typeof user?.name === 'string' ? user.name : (user?.name?.name || '')}</span>
                <button 
                  onClick={() => {
                    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                    router.push('/admin/login');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <nav className="mt-5 px-2">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md mb-1 ${
                    isActive
                      ? 'bg-[#8B4513]/10 text-[#8B4513]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#8B4513]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                       className={`mr-3 h-5 w-5 ${isActive ? 'text-[#8B4513]' : 'text-gray-500'}`}
                       fill="none" 
                       viewBox="0 0 24 24" 
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath(item.icon)} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function getIconPath(icon) {
  switch (icon) {
    case 'grid':
      return 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z';
    case 'box':
      return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
    case 'shopping-bag':
      return 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z';
    case 'file-text':
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    case 'bar-chart-2':
      return 'M18 20V10M12 20V4M6 20v-6';
    default:
      return '';
  }
}