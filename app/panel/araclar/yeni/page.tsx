'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function YeniAracPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    bodyType: '',
    fuelType: 'BENZIN',
    transmission: 'MANUEL',
    kmAtPurchase: '',
    purchasePrice: '',
    notes: '',
  })

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/araclar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          kmAtPurchase: formData.kmAtPurchase ? Number(formData.kmAtPurchase) : null,
          purchasePrice: Number(formData.purchasePrice),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Araç eklenirken hata oluştu')
        setLoading(false)
        return
      }

      router.push('/panel/araclar')
      router.refresh()
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yeni Araç Ekle</h1>
        <p className="text-gray-600 mt-1">Galeri stokuna yeni araç ekleyin</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Plaka *</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                className="input-field"
                placeholder="34ABC123"
                required
              />
            </div>
            <div>
              <label className="label">Marka *</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Yıl *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                className="input-field"
                min="1950"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            <div>
              <label className="label">Kasa Tipi</label>
              <input
                type="text"
                value={formData.bodyType}
                onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                className="input-field"
                placeholder="Sedan, HB, SUV, vb."
              />
            </div>
            <div>
              <label className="label">Kilometre</label>
              <input
                type="number"
                value={formData.kmAtPurchase}
                onChange={(e) => setFormData({ ...formData, kmAtPurchase: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Yakıt Tipi *</label>
              <select
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                className="input-field"
                required
              >
                <option value="BENZIN">Benzin</option>
                <option value="DIZEL">Dizel</option>
                <option value="LPG">LPG</option>
                <option value="BENZIN_LPG">Benzin & LPG</option>
                <option value="HIBRIT">Hibrit</option>
                <option value="ELEKTRIK">Elektrik</option>
              </select>
            </div>
            <div>
              <label className="label">Vites *</label>
              <select
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                className="input-field"
                required
              >
                <option value="MANUEL">Manuel</option>
                <option value="OTOMATIK">Otomatik</option>
                <option value="YARIMOTOMATIK">Yarı Otomatik</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label">Alış Fiyatı (₺) *</label>
              <input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                className="input-field"
                min="0"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Notlar</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="Araçla ilgili ek notlar..."
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : 'Aracı Kaydet'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  )
}
