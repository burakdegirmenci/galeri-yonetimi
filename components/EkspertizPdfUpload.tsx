'use client'

import { useState } from 'react'

interface EkspertizPdfUploadProps {
  vehicleId: string
  currentPdfPath?: string | null
  onSuccess: () => void
}

export default function EkspertizPdfUpload({
  vehicleId,
  currentPdfPath,
  onSuccess,
}: EkspertizPdfUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('pdf')) {
      setError('Sadece PDF dosyaları yüklenebilir')
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/araclar/${vehicleId}/expertise-pdf`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'PDF yüklenirken hata oluştu')
        setUploading(false)
        return
      }

      setUploading(false)
      onSuccess()
    } catch (err) {
      setError('Bir hata oluştu')
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Ekspertiz raporunu silmek istediğinize emin misiniz?')) {
      return
    }

    setError('')
    setDeleting(true)

    try {
      const response = await fetch(`/api/araclar/${vehicleId}/expertise-pdf`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'PDF silinirken hata oluştu')
        setDeleting(false)
        return
      }

      setDeleting(false)
      onSuccess()
    } catch (err) {
      setError('Bir hata oluştu')
      setDeleting(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Ekspertiz Raporu</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {currentPdfPath ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-green-900">Ekspertiz raporu mevcut</p>
              <p className="text-sm text-green-700 mt-1">
                PDF dosyası yüklenmiş durumda
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href={currentPdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Görüntüle
              </a>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-secondary text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                type="button"
              >
                {deleting ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeni Rapor Yükle (Mevcut rapor silinecek)
            </label>
            <input
              type="file"
              accept=".pdf"
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
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ekspertiz Raporu PDF Yükle
          </label>
          <input
            type="file"
            accept=".pdf"
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
      )}
    </div>
  )
}
