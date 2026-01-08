'use client'

import { useState } from 'react'
import Modal from './Modal'
import ValidatedInput from './ValidatedInput'
import { validateEmail, validateRequired } from '@/lib/validation'
import LoadingButton from './LoadingButton'
import ErrorMessage from './ErrorMessage'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
}

interface KullaniciDuzenleFormProps {
  user: User
  onSuccess: () => void
}

export default function KullaniciDuzenleForm({ user, onSuccess }: KullaniciDuzenleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    isActive: user.isActive,
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const nameValidation = validateRequired(formData.name, 'Ad Soyad')
    const emailValidation = validateEmail(formData.email)

    if (!nameValidation.isValid || !emailValidation.isValid) {
      setErrors({
        name: nameValidation.error || '',
        email: emailValidation.error || '',
        password: '',
      })
      return
    }

    setError('')
    setLoading(true)

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      }

      // Only include password if provided
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/kullanicilar/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Kullanıcı güncellenirken hata oluştu')
        setLoading(false)
        return
      }

      toast.success('Kullanıcı başarıyla güncellendi')
      setIsOpen(false)
      setFormData({ ...formData, password: '' })
      onSuccess()
    } catch (err) {
      setError('Bir hata oluştu')
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-secondary text-xs">
        ✏️ Düzenle
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Kullanıcı Düzenle"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

          <ValidatedInput
            label="Ad Soyad"
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value })
              setErrors({ ...errors, name: '' })
            }}
            error={errors.name}
            validate={(value) => validateRequired(value, 'Ad Soyad')}
            required
          />

          <ValidatedInput
            label="E-posta"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value })
              setErrors({ ...errors, email: '' })
            }}
            error={errors.email}
            validate={validateEmail}
            required
          />

          <ValidatedInput
            label="Yeni Şifre"
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value })
              setErrors({ ...errors, password: '' })
            }}
            error={errors.password}
            placeholder="Değiştirmek istemiyorsanız boş bırakın"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Aktif kullanıcı
            </label>
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
              Güncelle
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </>
  )
}
