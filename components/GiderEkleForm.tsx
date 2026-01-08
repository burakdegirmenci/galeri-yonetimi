'use client'

import { useState } from 'react'
import Modal from './Modal'

interface GiderEkleFormProps {
  vehicleId: string
  onSuccess: () => void
}

export default function GiderEkleForm({ vehicleId, onSuccess }: GiderEkleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    type: 'BAKIM',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  })

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/giderler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          type: formData.type,
          amount: parseFloat(formData.amount),
          date: formData.date,
          description: formData.description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Gider eklenirken hata oluştu')
        setLoading(false)
        return
      }

      // Reset form
      setFormData({
        type: 'BAKIM',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      })
      setIsOpen(false)
      setLoading(false)
      onSuccess()
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-primary"
        type="button"
      >
        + Gider Ekle
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setError('')
        }}
        title="Yeni Gider Ekle"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gider Türü
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
            >
              <option value="BAKIM">Bakım</option>
              <option value="ONARIM">Onarım</option>
              <option value="BOYA">Boya</option>
              <option value="KAPORTA">Kaporta</option>
              <option value="YAKIT">Yakıt</option>
              <option value="SIGORTA">Sigorta</option>
              <option value="VERGI">Vergi</option>
              <option value="DIGER">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tutar (₺)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarih
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Gider açıklaması..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setIsOpen(false)
                setError('')
              }}
              className="btn-secondary"
              type="button"
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.amount}
              className="btn-primary disabled:opacity-50"
              type="button"
            >
              {loading ? 'Ekleniyor...' : 'Gider Ekle'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
