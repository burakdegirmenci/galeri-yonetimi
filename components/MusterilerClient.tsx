'use client'

import { useRouter } from 'next/navigation'
import MusteriEkleForm from './MusteriEkleForm'
import TableWrapper from './TableWrapper'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string | null
  type: string
  notes?: string | null
  createdAt: Date
  transactions: any[]
}

interface MusterilerClientProps {
  customers: Customer[]
}

export default function MusterilerClient({ customers }: MusterilerClientProps) {
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <MusteriEkleForm onSuccess={handleSuccess} />
      </div>

      <div className="card">
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Henüz müşteri kaydı yok</p>
            <MusteriEkleForm onSuccess={handleSuccess} />
          </div>
        ) : (
          <TableWrapper
            mobileCards={
              <>
                {customers.map((customer) => (
                  <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{customer.name}</h3>
                        {customer.notes && (
                          <p className="text-xs text-gray-500 mt-1">{customer.notes}</p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.type === 'BIREYSEL'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {customer.type === 'BIREYSEL' ? 'Bireysel' : 'Kurumsal'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Telefon:</span>
                        <a href={`tel:${customer.phone}`} className="font-medium text-primary-600 hover:text-primary-700">
                          {customer.phone}
                        </a>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">E-posta:</span>
                        <span className="font-medium text-gray-900">{customer.email || '-'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">İşlem Sayısı:</span>
                        <span className="font-medium text-gray-900">{customer.transactions.length} işlem</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Kayıt Tarihi:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
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
                    Müşteri Adı
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Telefon
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    E-posta
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tip
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    İşlem Sayısı
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Kayıt Tarihi
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      {customer.notes && (
                        <div className="text-xs text-gray-500 mt-1">{customer.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {customer.phone}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {customer.email || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          customer.type === 'BIREYSEL'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {customer.type === 'BIREYSEL' ? 'Bireysel' : 'Kurumsal'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">
                      {customer.transactions.length} işlem
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
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
          <p className="text-sm text-gray-600 mb-1">Toplam Müşteri</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Bireysel</p>
          <p className="text-2xl font-bold text-blue-600">
            {customers.filter((c) => c.type === 'BIREYSEL').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Kurumsal</p>
          <p className="text-2xl font-bold text-purple-600">
            {customers.filter((c) => c.type === 'KURUMSAL').length}
          </p>
        </div>
      </div>
    </div>
  )
}
