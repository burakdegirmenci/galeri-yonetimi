'use client'

import { useState } from 'react'
import Modal from './Modal'
import ValidatedInput from './ValidatedInput'
import { validateEmail, validateRequired } from '@/lib/validation'
import LoadingButton from './LoadingButton'
import ErrorMessage from './ErrorMessage'
import toast from 'react-hot-toast'

interface KullaniciEkleFormProps {
  onSuccess: () => void
}

export default function KullaniciEkleForm({ onSuccess }: KullaniciEkleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const nameError = validateRequired(formData.name)
    const emailError = validateEmail(formData.email)
    const passwordError = validateRequired(formData.password)

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError || '',
        email: emailError || '',
        password: passwordError || '',
      })
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/kullanicilar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Kullanıcı eklenirken hata oluştu')
        setLoading(false)
        return
      }

      toast.success('Kullanıcı başarıyla eklendi')
      setIsOpen(false)
      setFormData({ name: '', email: '', password: '', role: 'ADMIN' })
      onSuccess()
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        + Yeni Kullanıcı
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yeni Kullanıcı Ekle"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

          <ValidatedInput
            label="Ad Soyad"
            type="text"
            value={formData.name}
            onChange={(value) => {
              setFormData({ ...formData, name: value })
              setErrors({ ...errors, name: '' })
            }}
            error={errors.name}
            validate={validateRequired}
            required
          />

          <ValidatedInput
            label="E-posta"
            type="email"
            value={formData.email}
            onChange={(value) => {
              setFormData({ ...formData, email: value })
              setErrors({ ...errors, email: '' })
            }}
            error={errors.email}
            validate={validateEmail}
            required
          />

          <ValidatedInput
            label="Şifre"
            type="password"
            value={formData.password}
            onChange={(value) => {
              setFormData({ ...formData, password: value })
              setErrors({ ...errors, password: '' })
            }}
            error={errors.password}
            validate={validateRequired}
            required
            placeholder="Minimum 6 karakter"
          />

          <div>
            <label className="label">Rol *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input"
              required
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Süper Admin</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Admin: Tüm işlemleri yapabilir<br />
              Süper Admin: Kullanıcı yönetimi ve audit log görme yetkisi
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn-secondary"
              disabled={loading}
            >
              İptal
            </button>
            <LoadingButton loading={loading} variant="primary" type="submit">
              Kullanıcı Ekle
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </>
  )
}
