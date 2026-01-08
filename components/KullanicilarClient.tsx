'use client'

import { useRouter } from 'next/navigation'
import KullaniciEkleForm from './KullaniciEkleForm'
import KullaniciDuzenleForm from './KullaniciDuzenleForm'
import TableWrapper from './TableWrapper'
import toast from 'react-hot-toast'
import { useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface KullanicilarClientProps {
  users: User[]
  currentUserId: string
}

export default function KullanicilarClient({ users, currentUserId }: KullanicilarClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleSuccess = () => {
    router.refresh()
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`${userName} kullanıcısını silmek istediğinizden emin misiniz?`)) {
      return
    }

    setDeletingId(userId)

    try {
      const response = await fetch(`/api/kullanicilar/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Kullanıcı silinirken hata oluştu')
        setDeletingId(null)
        return
      }

      toast.success('Kullanıcı başarıyla silindi')
      router.refresh()
    } catch (err) {
      toast.error('Bir hata oluştu')
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (userId: string, userName: string, currentStatus: boolean) => {
    const action = currentStatus ? 'devre dışı bırakmak' : 'aktif etmek'

    if (!confirm(`${userName} kullanıcısını ${action} istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const response = await fetch(`/api/kullanicilar/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: !currentStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Durum değiştirilirken hata oluştu')
        return
      }

      toast.success(`Kullanıcı ${!currentStatus ? 'aktif edildi' : 'devre dışı bırakıldı'}`)
      router.refresh()
    } catch (err) {
      toast.error('Bir hata oluştu')
    }
  }

  const activeUsers = users.filter(u => u.isActive)
  const inactiveUsers = users.filter(u => !u.isActive)
  const superAdmins = users.filter(u => u.role === 'SUPER_ADMIN')

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <KullaniciEkleForm onSuccess={handleSuccess} />
      </div>

      <div className="card">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Henüz kullanıcı kaydı yok</p>
            <KullaniciEkleForm onSuccess={handleSuccess} />
          </div>
        ) : (
          <TableWrapper
            mobileCards={
              <>
                {users.map((user) => (
                  <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'SUPER_ADMIN'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {user.role === 'SUPER_ADMIN' ? 'Süper Admin' : 'Admin'}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {user.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kayıt Tarihi:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Son Güncelleme:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(user.updatedAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <KullaniciDuzenleForm user={user} onSuccess={handleSuccess} />
                      <button
                        onClick={() => handleToggleActive(user.id, user.name, user.isActive)}
                        className={`btn-secondary flex-1 min-w-[120px] ${
                          user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={user.id === currentUserId}
                      >
                        {user.isActive ? '🔒 Devre Dışı' : '✅ Aktif Et'}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className={`btn-danger flex-1 min-w-[120px] ${
                          user.id === currentUserId || deletingId === user.id
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                        disabled={user.id === currentUserId || deletingId === user.id}
                      >
                        {deletingId === user.id ? 'Siliniyor...' : '🗑️ Sil'}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            }
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Kullanıcı
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    E-posta
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Rol
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Durum
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Kayıt Tarihi
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role === 'SUPER_ADMIN' ? 'Süper Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-center">
                        <KullaniciDuzenleForm user={user} onSuccess={handleSuccess} />
                        <button
                          onClick={() => handleToggleActive(user.id, user.name, user.isActive)}
                          className={`btn-secondary text-xs ${
                            user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={user.id === currentUserId}
                          title={user.id === currentUserId ? 'Kendi hesabınızı devre dışı bırakamazsınız' : ''}
                        >
                          {user.isActive ? '🔒 Devre Dışı' : '✅ Aktif Et'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className={`btn-danger text-xs ${
                            user.id === currentUserId || deletingId === user.id
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={user.id === currentUserId || deletingId === user.id}
                          title={user.id === currentUserId ? 'Kendi hesabınızı silemezsiniz' : ''}
                        >
                          {deletingId === user.id ? 'Siliniyor...' : '🗑️ Sil'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Toplam Kullanıcı</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Aktif Kullanıcı</p>
          <p className="text-2xl font-bold text-green-600">
            {activeUsers.length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Süper Admin</p>
          <p className="text-2xl font-bold text-purple-600">
            {superAdmins.length}
          </p>
        </div>
      </div>
    </div>
  )
}
