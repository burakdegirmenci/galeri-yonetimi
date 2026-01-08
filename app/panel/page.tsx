import { prisma } from '@/lib/prisma'
import IstatistikKart from '@/components/IstatistikKart'

async function getDashboardStats() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [totalVehicles, inStockVehicles, soldLast30Days] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'IN_STOCK' } }),
    prisma.vehicle.count({
      where: {
        status: 'SOLD',
        galleryExitDate: { gte: thirtyDaysAgo },
      },
    }),
  ])

  return {
    totalVehicles,
    inStockVehicles,
    soldLast30Days,
    totalProfit: 0,
  }
}

export default async function PanelPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
        <p className="text-gray-600 mt-1">Galeri yönetim paneline hoş geldiniz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IstatistikKart
          baslik="Toplam Araç"
          deger={stats.totalVehicles}
          icon="🚗"
          renk="blue"
        />
        <IstatistikKart
          baslik="Stoktaki Araç"
          deger={stats.inStockVehicles}
          icon="📦"
          renk="green"
        />
        <IstatistikKart
          baslik="Son 30 Günde Satılan"
          deger={stats.soldLast30Days}
          icon="✅"
          renk="purple"
        />
        <IstatistikKart
          baslik="Toplam Kâr"
          deger={`₺${stats.totalProfit.toLocaleString('tr-TR')}`}
          icon="💰"
          renk="orange"
        />
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Hoş Geldiniz!
        </h2>
        <p className="text-gray-600">
          Galeri yönetim sisteminize başarıyla giriş yaptınız. Sol menüden istediğiniz bölüme geçebilirsiniz.
        </p>
      </div>
    </div>
  )
}
