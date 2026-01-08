import { prisma } from '@/lib/prisma'

async function getAnalytics() {
  const [vehicles, transactions, expenses, customers] = await Promise.all([
    prisma.vehicle.findMany({
      include: {
        expenses: true,
        transactions: true,
      },
    }),
    prisma.transaction.findMany({
      include: {
        vehicle: true,
      },
    }),
    prisma.expense.findMany({
      include: {
        vehicle: true,
      },
    }),
    prisma.customer.findMany({
      include: {
        transactions: true,
      },
    }),
  ])

  return { vehicles, transactions, expenses, customers }
}

export default async function AnalitikPage() {
  const { vehicles, transactions, expenses, customers } = await getAnalytics()

  // Vehicle statistics
  const totalVehicles = vehicles.length
  const inStockVehicles = vehicles.filter((v) => v.status === 'IN_STOCK').length
  const soldVehicles = vehicles.filter((v) => v.status === 'SOLD').length

  // Transaction statistics
  const purchases = transactions.filter((t) => t.type === 'PURCHASE')
  const sales = transactions.filter((t) => t.type === 'SALE')
  const totalPurchaseAmount = purchases.reduce((sum, t) => sum + Number(t.price), 0)
  const totalSaleAmount = sales.reduce((sum, t) => sum + Number(t.price), 0)

  // Expense statistics
  const totalExpenseAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const vehicleExpenses = expenses.filter((e) => e.vehicleId !== null)
  const generalExpenses = expenses.filter((e) => e.vehicleId === null)
  const vehicleExpensesAmount = vehicleExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const generalExpensesAmount = generalExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  // Financial calculations
  const grossProfit = totalSaleAmount - totalPurchaseAmount
  const netProfit = grossProfit - totalExpenseAmount
  const profitMargin = totalSaleAmount > 0 ? (grossProfit / totalSaleAmount) * 100 : 0

  // Customer statistics
  const buyerCustomers = customers.filter((c) => c.type === 'BUYER')
  const sellerCustomers = customers.filter((c) => c.type === 'SELLER')

  // Inventory value
  const inventoryValue = vehicles
    .filter((v) => v.status === 'IN_STOCK')
    .reduce((sum, v) => sum + Number(v.purchasePrice), 0)

  // Vehicle expenses for in-stock vehicles
  const inStockExpenses = vehicles
    .filter((v) => v.status === 'IN_STOCK')
    .reduce((sum, v) => {
      const vehicleExpenseSum = v.expenses.reduce((s, e) => s + Number(e.amount), 0)
      return sum + vehicleExpenseSum
    }, 0)

  const totalInventoryCost = inventoryValue + inStockExpenses

  // Average metrics
  const avgPurchasePrice = purchases.length > 0 ? totalPurchaseAmount / purchases.length : 0
  const avgSalePrice = sales.length > 0 ? totalSaleAmount / sales.length : 0
  const avgProfit = sales.length > 0 ? grossProfit / sales.length : 0

  // Recent activity
  const recentTransactions = transactions.slice(0, 5)
  const recentExpenses = expenses.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analitik</h1>
      </div>

      {/* Financial Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Finansal Özet</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Toplam Alım</p>
            <p className="text-2xl font-bold text-blue-600">
              ₺{totalPurchaseAmount.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-gray-500 mt-1">{purchases.length} işlem</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Toplam Satış</p>
            <p className="text-2xl font-bold text-green-600">
              ₺{totalSaleAmount.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-gray-500 mt-1">{sales.length} işlem</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Toplam Gider</p>
            <p className="text-2xl font-bold text-red-600">
              ₺{totalExpenseAmount.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-gray-500 mt-1">{expenses.length} gider</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Net Kar/Zarar</p>
            <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit >= 0 ? '+' : ''}₺{netProfit.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Brüt Kar: ₺{grossProfit.toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      </div>

      {/* Profitability Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Karlılık Metrikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Kar Marjı</p>
            <p className="text-2xl font-bold text-purple-600">
              %{profitMargin.toFixed(1)}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Ort. Alış Fiyatı</p>
            <p className="text-2xl font-bold text-blue-600">
              ₺{avgPurchasePrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Ort. Satış Fiyatı</p>
            <p className="text-2xl font-bold text-green-600">
              ₺{avgSalePrice.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Ort. Araç Karı</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₺{avgProfit.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Inventory & Vehicles */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stok Durumu</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Toplam Araç</p>
            <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Stokta</p>
            <p className="text-2xl font-bold text-blue-600">{inStockVehicles}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Satılan</p>
            <p className="text-2xl font-bold text-green-600">{soldVehicles}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Stok Değeri</p>
            <p className="text-2xl font-bold text-orange-600">
              ₺{totalInventoryCost.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Alış: ₺{inventoryValue.toLocaleString('tr-TR')}
            </p>
            <p className="text-xs text-gray-500">
              Gider: ₺{inStockExpenses.toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      </div>

      {/* Expenses Breakdown */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gider Dağılımı</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Araç Giderleri</p>
            <p className="text-3xl font-bold text-orange-600">
              ₺{vehicleExpensesAmount.toLocaleString('tr-TR')}
            </p>
            <p className="text-sm text-gray-500 mt-1">{vehicleExpenses.length} gider</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-2">Genel Giderler</p>
            <p className="text-3xl font-bold text-purple-600">
              ₺{generalExpensesAmount.toLocaleString('tr-TR')}
            </p>
            <p className="text-sm text-gray-500 mt-1">{generalExpenses.length} gider</p>
          </div>
        </div>
      </div>

      {/* Customer Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Müşteri İstatistikleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Toplam Müşteri</p>
            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Alıcılar</p>
            <p className="text-2xl font-bold text-green-600">{buyerCustomers.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Satıcılar</p>
            <p className="text-2xl font-bold text-blue-600">{sellerCustomers.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son İşlemler</h2>
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Henüz işlem yok</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.vehicle.brand} {transaction.vehicle.model}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.type === 'PURCHASE'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {transaction.type === 'PURCHASE' ? 'Alım' : 'Satış'}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      ₺{Number(transaction.price).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Giderler</h2>
          {recentExpenses.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Henüz gider yok</p>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{expense.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(expense.date).toLocaleDateString('tr-TR')}
                      {expense.vehicle && (
                        <span className="ml-2">
                          • {expense.vehicle.brand} {expense.vehicle.model}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      ₺{Number(expense.amount).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
