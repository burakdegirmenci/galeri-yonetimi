'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AracSilButtonProps {
  vehicleId: string
  vehicleName: string
}

export default function AracSilButton({ vehicleId, vehicleName }: AracSilButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/araclar/${vehicleId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Araç silinirken hata oluştu')
        setLoading(false)
        return
      }

      setIsOpen(false)
      router.push('/panel/araclar')
      router.refresh()
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-danger">
        🗑️ Sil
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aracı Sil</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <p className="text-gray-600 mb-6">
              <strong>{vehicleName}</strong> aracını silmek istediğinizden emin misiniz? Bu işlem
              geri alınamaz ve aracın tüm gider ve işlem kayıtları da silinecektir.
            </p>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn-secondary"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
