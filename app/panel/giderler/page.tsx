import { prisma } from '@/lib/prisma'
import TableWrapper from '@/components/TableWrapper'

async function getExpenses() {
  const expenses = await prisma.expense.findMany({
    include: {
      vehicle: true,
    },
    orderBy: { date: 'desc' },
  })
  return expenses
}

export default async function GiderlerPage() {
  const expenses = await getExpenses()

  // Calculate statistics
  const totalExpenses = expenses.length
  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const vehicleExpenses = expenses.filter((e) => e.vehicleId !== null).length
  const generalExpenses = expenses.filter((e) => e.vehicleId === null).length
  const vehicleExpensesAmount = expenses
    .filter((e) => e.vehicleId !== null)
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const generalExpensesAmount = expenses
    .filter((e) => e.vehicleId === null)
    .reduce((sum, e) => sum + Number(e.amount), 0)

  // Group by type
  const expensesByType = expenses.reduce((acc, expense) => {
    const type = expense.type
    if (!acc[type]) {
      acc[type] = { count: 0, amount: 0 }
    }
    acc[type].count++
    acc[type].amount += Number(expense.amount)
    return acc
  }, {} as Record<string, { count: number; amount: number }>)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Giderler</h1>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Toplam Gider</p>
          <p className="text-2xl font-bold text-gray-900">{totalExpenses}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Toplam Tutar</p>
          <p className="text-2xl font-bold text-red-600">
            ₺{totalAmount.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Araç Giderleri</p>
          <p className="text-xl font-bold text-orange-600">{vehicleExpenses} adet</p>
          <p className="text-sm text-gray-500 mt-1">
            ₺{vehicleExpensesAmount.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Genel Giderler</p>
          <p className="text-xl font-bold text-purple-600">{generalExpenses} adet</p>
          <p className="text-sm text-gray-500 mt-1">
            ₺{generalExpensesAmount.toLocaleString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Expense Types Breakdown */}
      {Object.keys(expensesByType).length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gider Türlerine Göre Dağılım
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(expensesByType).map(([type, data]) => (
              <div key={type} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">{type}</p>
                <p className="text-lg font-bold text-gray-900">{data.count} adet</p>
                <p className="text-sm text-red-600 font-medium">
                  ₺{data.amount.toLocaleString('tr-TR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expenses List */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gider Listesi</h2>
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Henüz gider kaydı yok
          </div>
        ) : (
          <TableWrapper
            mobileCards={
              <>
                {expenses.map((expense) => (
                  <div key={expense.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mb-2">
                          {expense.type}
                        </span>
                        <p className="text-sm text-gray-600">
                          {new Date(expense.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        ₺{Number(expense.amount).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    {expense.vehicle && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Araç:</p>
                        <a
                          href={`/panel/araclar/${expense.vehicle.licensePlate}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {expense.vehicle.brand} {expense.vehicle.model}
                        </a>
                        <p className="text-xs text-gray-500">{expense.vehicle.licensePlate}</p>
                      </div>
                    )}
                    {expense.description && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Açıklama:</p>
                        <p className="text-sm text-gray-900">{expense.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            }
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tarih
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Gider Türü
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Araç
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Açıklama
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Tutar
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(expense.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {expense.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {expense.vehicle ? (
                        <div>
                          <a
                            href={`/panel/araclar/${expense.vehicle.licensePlate}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {expense.vehicle.brand} {expense.vehicle.model}
                          </a>
                          <div className="text-xs text-gray-500">
                            {expense.vehicle.licensePlate}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Genel Gider</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {expense.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-red-600">
                        ₺{Number(expense.amount).toLocaleString('tr-TR')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </div>
    </div>
  )
}
