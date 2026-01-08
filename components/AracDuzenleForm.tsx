'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Vehicle {
  id: string
  licensePlate: string
  brand: string
  model: string
  year: number
  bodyType?: string | null
  fuelType: string
  transmission: string
  kmAtPurchase?: number | null
  purchasePrice: number
  notes?: string | null
  status: string
}

interface AracDuzenleFormProps {
  vehicle: Vehicle
}

export default function AracDuzenleForm({ vehicle }: AracDuzenleFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    licensePlate: vehicle.licensePlate,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    bodyType: vehicle.bodyType || '',
    fuelType: vehicle.fuelType,
    transmission: vehicle.transmission,
    kmAtPurchase: vehicle.kmAtPurchase?.toString() || '',
    purchasePrice: vehicle.purchasePrice.toString(),
    notes: vehicle.notes || '',
    status: vehicle.status,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/araclar/${vehicle.id}`, {
        method: 'PUT',
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
        setError(data.error || 'Araç güncellenirken hata oluştu')
        setLoading(false)
        return
      }

      setIsOpen(false)
      router.refresh()
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-secondary">
        ✏️ Düzenle
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Araç Bilgilerini Düzenle</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Plaka *</label>
                    <input
                      type="text"
                      value={formData.licensePlate}
                      onChange={(e) =>
                        setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })
                      }
                      className="input-field"
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

                  <div>
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

                  <div>
                    <label className="label">Durum *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="IN_STOCK">Stokta</option>
                      <option value="SOLD">Satıldı</option>
                    </select>
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

                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    İptal
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
