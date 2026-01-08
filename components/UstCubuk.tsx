'use client'

import { useRouter } from 'next/navigation'

interface UstCubukProps {
  userName: string
}

export default function UstCubuk({ userName }: UstCubukProps) {
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
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Hoş Geldiniz</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">Yönetici</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </header>
  )
}
