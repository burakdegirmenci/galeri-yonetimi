import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import TableWrapper from '@/components/TableWrapper'

async function getVehicles() {
  return prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      licensePlate: true,
      brand: true,
      model: true,
      year: true,
      status: true,
      purchasePrice: true,
      createdAt: true,
    },
  })
}

export default async function AraclarPage() {
  const vehicles = await getVehicles()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Araçlar</h1>
          <p className="text-gray-600 mt-1">Tüm araç kayıtları</p>
        </div>
        <Link href="/panel/araclar/yeni" className="btn-primary text-center">
          + Yeni Araç Ekle
        </Link>
      </div>

      <div className="card">
        <TableWrapper
          mobileCards={
            vehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Henüz araç eklenmemiş
              </div>
            ) : (
              <>
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{vehicle.licensePlate}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'IN_STOCK'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {vehicle.status === 'IN_STOCK' ? 'Stokta' : 'Satıldı'}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Yıl:</span>
                        <span className="font-medium text-gray-900">{vehicle.year}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Alış Fiyatı:</span>
                        <span className="font-medium text-gray-900">
                          ₺{Number(vehicle.purchasePrice).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/panel/araclar/${vehicle.licensePlate}`}
                      className="block w-full text-center bg-primary-50 text-primary-700 py-2 rounded-lg font-medium hover:bg-primary-100 transition-colors min-h-[44px] flex items-center justify-center"
                    >
                      Detay Görüntüle
                    </Link>
                  </div>
                ))}
              </>
            )
          }
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Plaka
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Marka
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Model
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Yıl
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Durum
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Alış Fiyatı
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Henüz araç eklenmemiş
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {vehicle.licensePlate}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{vehicle.brand}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{vehicle.model}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-center">{vehicle.year}</td>
                    <td className="py-3 px-4 text-sm text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'IN_STOCK'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {vehicle.status === 'IN_STOCK' ? 'Stokta' : 'Satıldı'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium text-right">
                      ₺{Number(vehicle.purchasePrice).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Link
                        href={`/panel/araclar/${vehicle.licensePlate}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </div>
  )
}
