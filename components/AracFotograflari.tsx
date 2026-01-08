'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AracFotograflariProps {
  vehicleId: string
  currentImages: string[]
  onSuccess: () => void
}

export default function AracFotograflari({
  vehicleId,
  currentImages,
  onSuccess,
}: AracFotograflariProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch(`/api/araclar/${vehicleId}/images`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Fotoğraflar yüklenirken hata oluştu')
        setUploading(false)
        return
      }

      setUploading(false)
      e.target.value = '' // Reset input
      onSuccess()
    } catch (err) {
      setError('Bir hata oluştu')
      setUploading(false)
    }
  }

  const handleDelete = async (imagePath: string) => {
    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) {
      return
    }

    setError('')
    setDeleting(imagePath)

    try {
      const response = await fetch(`/api/araclar/${vehicleId}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Fotoğraf silinirken hata oluştu')
        setDeleting(null)
        return
      }

      setDeleting(null)
      onSuccess()
    } catch (err) {
      setError('Bir hata oluştu')
      setDeleting(null)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Araç Fotoğrafları</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fotoğraf Yükle (Birden fazla seçilebilir)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-medium
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            disabled:opacity-50"
        />
        {uploading && (
          <p className="mt-2 text-sm text-gray-500">Yükleniyor...</p>
        )}
      </div>

      {/* Image Gallery */}
      {currentImages.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          Henüz fotoğraf yüklenmemiş
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {currentImages.map((imagePath, index) => (
            <div
              key={imagePath}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setSelectedImage(imagePath)}
            >
              <Image
                src={imagePath}
                alt={`Araç fotoğrafı ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(imagePath)
                  }}
                  disabled={deleting === imagePath}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-opacity"
                  type="button"
                >
                  {deleting === imagePath ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white text-gray-900 rounded-full p-2 hover:bg-gray-100"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Tam boyut"
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
