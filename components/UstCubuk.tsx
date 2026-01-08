'use client'

import { useRouter } from 'next/navigation'

interface UstCubukProps {
  userName: string
  onMenuClick?: () => void
}

export default function UstCubuk({ userName, onMenuClick }: UstCubukProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/cikis', { method: 'POST' })
      router.push('/giris')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-700 hover:text-gray-900 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Hoş Geldiniz</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">Yönetici</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-3 md:px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium min-h-[44px]"
          >
            <span className="hidden sm:inline">Çıkış Yap</span>
            <span className="sm:hidden">Çıkış</span>
          </button>
        </div>
      </div>
    </header>
  )
}
