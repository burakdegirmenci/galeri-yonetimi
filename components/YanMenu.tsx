'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const baseMenuItems = [
  { href: '/panel', label: 'Genel Bakış', icon: '📊' },
  { href: '/panel/araclar', label: 'Araçlar', icon: '🚗' },
  { href: '/panel/musteriler', label: 'Müşteriler', icon: '👥' },
  { href: '/panel/islemler', label: 'Alım / Satım', icon: '💰' },
  { href: '/panel/giderler', label: 'Giderler', icon: '💸' },
  { href: '/panel/analitik', label: 'Analitik', icon: '📈' },
]

const superAdminMenuItems = [
  { href: '/panel/kullanicilar', label: 'Kullanıcılar', icon: '👤' },
  { href: '/panel/audit-log', label: 'Audit Log', icon: '📋' },
]

interface YanMenuProps {
  userRole: string
  isOpen?: boolean
  onClose?: () => void
  isMobile?: boolean
}

export default function YanMenu({ userRole, isOpen = true, onClose, isMobile = false }: YanMenuProps) {
  const pathname = usePathname()

  const menuItems = userRole === 'SUPER_ADMIN'
    ? [...baseMenuItems, ...superAdminMenuItems]
    : baseMenuItems

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  const menuContent = (
    <>
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
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors min-h-[44px] ${
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
    </>
  )

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={onClose}
          />
        )}

        {/* Drawer */}
        <aside
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:hidden ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {menuContent}
        </aside>
      </>
    )
  }

  // Desktop sidebar
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
      {menuContent}
    </aside>
  )
}
