'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/panel', label: 'Genel Bakış', icon: '📊' },
  { href: '/panel/araclar', label: 'Araçlar', icon: '🚗' },
  { href: '/panel/musteriler', label: 'Müşteriler', icon: '👥' },
  { href: '/panel/islemler', label: 'Alım / Satım', icon: '💰' },
  { href: '/panel/giderler', label: 'Giderler', icon: '💸' },
  { href: '/panel/analitik', label: 'Analitik', icon: '📈' },
]

export default function YanMenu() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">Galeri Yönetim</h1>
      </div>
      <nav className="px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
