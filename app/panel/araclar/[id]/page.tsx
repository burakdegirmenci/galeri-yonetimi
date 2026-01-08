import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AracDetayClient from '@/components/AracDetayClient'
import AracDuzenleForm from '@/components/AracDuzenleForm'
import AracSilButton from '@/components/AracSilButton'

async function getVehicleDetails(licensePlate: string) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { licensePlate },
    include: {
      expenses: {
        orderBy: { date: 'desc' },
      },
      transactions: {
        include: {
          customer: true,
        },
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!vehicle) return null
  return vehicle
}

export default async function AracDetayPage({
  params,
}: {
  params: { id: string }
}) {
  const vehicle = await getVehicleDetails(decodeURIComponent(params.id))

  if (!vehicle) {
    notFound()
  }

  const totalExpenses = vehicle.expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  )

  const netProfit = vehicle.salePrice
    ? Number(vehicle.salePrice) - Number(vehicle.purchasePrice) - totalExpenses
    : 0

  const daysInStock = vehicle.galleryExitDate
    ? Math.floor(
        (vehicle.galleryExitDate.getTime() - vehicle.galleryEntryDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : Math.floor(
        (new Date().getTime() - vehicle.galleryEntryDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {vehicle.brand} {vehicle.model}
          </h1>
          <p className="text-gray-600 mt-1">Plaka: {vehicle.licensePlate}</p>
        </div>
        <div className="flex gap-3">
          <AracDuzenleForm vehicle={vehicle} />
          <AracSilButton vehicleId={vehicle.id} vehicleName={`${vehicle.brand} ${vehicle.model}`} />
          <Link href="/panel/araclar" className="btn-secondary">
            Geri Dön
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Alış Fiyatı</p>
          <p className="text-2xl font-bold text-gray-900">
            ₺{Number(vehicle.purchasePrice).toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Toplam Gider</p>
          <p className="text-2xl font-bold text-red-600">
            ₺{totalExpenses.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">
            {vehicle.salePrice ? 'Net Kâr' : 'Durum'}
          </p>
          <p
            className={`text-2xl font-bold ${
              vehicle.salePrice
                ? netProfit >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
                : 'text-blue-600'
            }`}
          >
            {vehicle.salePrice
              ? `₺${netProfit.toLocaleString('tr-TR')}`
              : 'Stokta'}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Marka</p>
            <p className="font-medium text-gray-900">{vehicle.brand}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Model</p>
            <p className="font-medium text-gray-900">{vehicle.model}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Yıl</p>
            <p className="font-medium text-gray-900">{vehicle.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kasa Tipi</p>
            <p className="font-medium text-gray-900">{vehicle.bodyType || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Yakıt Tipi</p>
            <p className="font-medium text-gray-900">{vehicle.fuelType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Vites</p>
            <p className="font-medium text-gray-900">{vehicle.transmission}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kilometre</p>
            <p className="font-medium text-gray-900">
              {vehicle.kmAtPurchase?.toLocaleString('tr-TR') || '-'} km
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Durum</p>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                vehicle.status === 'IN_STOCK'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {vehicle.status === 'IN_STOCK' ? 'Stokta' : 'Satıldı'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Stokta Kaldığı Süre</p>
            <p className="font-medium text-gray-900">{daysInStock} gün</p>
          </div>
        </div>
      </div>

      <AracDetayClient vehicle={vehicle} />

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Giderler ({vehicle.expenses.length})
        </h2>
        {vehicle.expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Henüz gider kaydı yok</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">Tarih</th>
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">Tür</th>
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">Tutar</th>
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {vehicle.expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-700">
                      {new Date(expense.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-2 text-sm text-gray-700">{expense.type}</td>
                    <td className="py-2 text-sm font-medium text-red-600">
                      ₺{Number(expense.amount).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2 text-sm text-gray-700">{expense.description || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">İşlem Geçmişi</h2>
        {vehicle.transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Henüz işlem kaydı yok</p>
        ) : (
          <div className="space-y-4">
            {vehicle.transactions.map((transaction) => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'PURCHASE' ? '📥 Alım' : '📤 Satış'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Müşteri: {transaction.customer.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tarih: {new Date(transaction.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary-600">
                    ₺{Number(transaction.price).toLocaleString('tr-TR')}
                  </p>
                </div>
                {transaction.notes && (
                  <p className="mt-2 text-sm text-gray-600">{transaction.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {vehicle.notes && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Notlar</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{vehicle.notes}</p>
        </div>
      )}
    </div>
  )
}
