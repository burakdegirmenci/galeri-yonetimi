'use client'

import { useState, useEffect } from 'react'
import Modal from './Modal'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
}

interface IslemEkleFormProps {
  vehicleId: string
  vehicleBrand: string
  vehicleModel: string
  onSuccess: () => void
}

export default function IslemEkleForm({ vehicleId, vehicleBrand, vehicleModel, onSuccess }: IslemEkleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [showNewCustomer, setShowNewCustomer] = useState(false)

  const [formData, setFormData] = useState({
    type: 'SALE',
    customerId: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'BIREYSEL',
  })

  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
    }
  }, [isOpen])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/musteriler')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (err) {
      console.error('Error fetching customers:', err)
    }
  }

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      setError('Müşteri adı ve telefonu gereklidir')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/musteriler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Müşteri eklenirken hata oluştu')
        setLoading(false)
        return
      }

      setCustomers([data, ...customers])
      setFormData({ ...formData, customerId: data.id })
      setShowNewCustomer(false)
      setNewCustomer({ name: '', phone: '', email: '', type: 'BIREYSEL' })
      setLoading(false)
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.customerId || !formData.price) {
      setError('Müşteri ve fiyat alanları gereklidir')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/islemler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          type: formData.type,
          customerId: formData.customerId,
          price: parseFloat(formData.price),
          date: formData.date,
          notes: formData.notes,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'İşlem eklenirken hata oluştu')
        setLoading(false)
        return
      }

      setFormData({
        type: 'SALE',
        customerId: '',
        price: '',
        date: new Date().toISOString().split('T')[0],
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
        + İşlem Ekle
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setError('')
          setShowNewCustomer(false)
        }}
        title={`Yeni İşlem Ekle - ${vehicleBrand} ${vehicleModel}`}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İşlem Türü
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
            >
              <option value="SALE">Satış</option>
              <option value="PURCHASE">Alım</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Müşteri
            </label>
            {!showNewCustomer ? (
              <div className="space-y-2">
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="input-field"
                >
                  <option value="">Müşteri Seçin</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewCustomer(true)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                  type="button"
                >
                  + Yeni Müşteri Ekle
                </button>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-3 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Müşteri Adı *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="input-field text-sm"
                    placeholder="Müşteri adı"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="input-field text-sm"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="input-field text-sm"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Müşteri Tipi
                  </label>
                  <select
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                    className="input-field text-sm"
                  >
                    <option value="BIREYSEL">Bireysel</option>
                    <option value="KURUMSAL">Kurumsal</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateCustomer}
                    disabled={loading}
                    className="text-sm btn-primary disabled:opacity-50"
                    type="button"
                  >
                    Müşteri Kaydet
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCustomer(false)
                      setNewCustomer({ name: '', phone: '', email: '', type: 'BIREYSEL' })
                    }}
                    className="text-sm btn-secondary"
                    type="button"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fiyat (₺)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
              Notlar
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="İşlem notları..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setIsOpen(false)
                setError('')
                setShowNewCustomer(false)
              }}
              className="btn-secondary"
              type="button"
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.customerId || !formData.price || showNewCustomer}
              className="btn-primary disabled:opacity-50"
              type="button"
            >
              {loading ? 'Ekleniyor...' : 'İşlem Ekle'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
