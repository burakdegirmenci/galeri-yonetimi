'use client'

import { useState } from 'react'

export default function GirisPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      console.log('Sending login request...')
      const response = await fetch('/api/auth/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      console.log('Response status:', response.status, response.ok)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        console.log('Login failed:', data.error)
        setError(data.error || 'Giriş başarısız')
        setLoading(false)
        return
      }

      // Success - redirect to panel
      console.log('Login successful, redirecting to /panel...')
      console.log('About to redirect in 100ms')
      setTimeout(() => {
        console.log('Executing redirect NOW')
        window.location.href = '/panel'
      }, 100)
    } catch (err) {
      console.error('Login error caught:', err)
      setError('Bir hata oluştu: ' + String(err))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Galeri Yönetim</h1>
          <p className="text-gray-600">Sisteme giriş yapın</p>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="label">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="ornek@galeri.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <a href="/kayit" className="text-primary-600 hover:text-primary-700 font-medium">
              Kayıt Ol
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
