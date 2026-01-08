'use client'

import { useState } from 'react'
import Modal from './Modal'

interface MusteriEkleFormProps {
  onSuccess: () => void
}

export default function MusteriEkleForm({ onSuccess }: MusteriEkleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'BIREYSEL',
    notes: '',
  })

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      setError('Müşteri adı ve telefonu gereklidir')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/musteriler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Müşteri eklenirken hata oluştu')
        setLoading(false)
        return
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        type: 'BIREYSEL',
        notes: '',
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
        + Yeni Müşteri
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setError('')
        }}
        title="Yeni Müşteri Ekle"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Müşteri Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Müşteri adı"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon *
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="05XX XXX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Müşteri Tipi
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
            >
              <option value="BIREYSEL">Bireysel</option>
              <option value="KURUMSAL">Kurumsal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notlar
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Müşteri hakkında notlar..."
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
              disabled={loading || !formData.name || !formData.phone}
              className="btn-primary disabled:opacity-50"
              type="button"
            >
              {loading ? 'Ekleniyor...' : 'Müşteri Ekle'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
