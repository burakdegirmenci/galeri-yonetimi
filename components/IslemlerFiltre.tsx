'use client'

import { useState } from 'react'
import TableWrapper from './TableWrapper'

interface Transaction {
  id: string
  type: string
  date: Date
  price: number
  vehicle: {
    brand: string
    model: string
    licensePlate: string
  }
  customer: {
    name: string
    phone: string
  }
  createdBy: {
    name: string
  }
}

interface IslemlerFiltreProps {
  transactions: Transaction[]
}

export default function IslemlerFiltre({ transactions }: IslemlerFiltreProps) {
  const [filterType, setFilterType] = useState<string>('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Type filter
    if (filterType !== 'ALL' && transaction.type !== filterType) {
      return false
    }

    // Date range filter
    if (startDate) {
      const transactionDate = new Date(transaction.date)
      if (transactionDate < new Date(startDate)) {
        return false
      }
    }

    if (endDate) {
      const transactionDate = new Date(transaction.date)
      if (transactionDate > new Date(endDate + 'T23:59:59')) {
        return false
      }
    }

    // Search filter (vehicle, customer)
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      const vehicleMatch = `${transaction.vehicle.brand} ${transaction.vehicle.model} ${transaction.vehicle.licensePlate}`.toLowerCase().includes(search)
      const customerMatch = `${transaction.customer.name} ${transaction.customer.phone}`.toLowerCase().includes(search)

      if (!vehicleMatch && !customerMatch) {
        return false
      }
    }

    return true
  })

  // Calculate statistics for filtered data
  const totalPurchases = filteredTransactions.filter((t) => t.type === 'PURCHASE').length
  const totalSales = filteredTransactions.filter((t) => t.type === 'SALE').length
  const totalPurchaseAmount = filteredTransactions
    .filter((t) => t.type === 'PURCHASE')
    .reduce((sum, t) => sum + Number(t.price), 0)
  const totalSaleAmount = filteredTransactions
    .filter((t) => t.type === 'SALE')
    .reduce((sum, t) => sum + Number(t.price), 0)
  const netProfit = totalSaleAmount - totalPurchaseAmount

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrele</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İşlem Türü
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="ALL">Tümü</option>
              <option value="PURCHASE">Alım</option>
              <option value="SALE">Satış</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ara (Araç/Müşteri)
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Araç veya müşteri ara..."
              className="input"
            />
          </div>
        </div>

        {(filterType !== 'ALL' || startDate || endDate || searchTerm) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredTransactions.length} işlem gösteriliyor
            </p>
            <button
              onClick={() => {
                setFilterType('ALL')
                setStartDate('')
                setEndDate('')
                setSearchTerm('')
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Toplam Alım</p>
          <p className="text-2xl font-bold text-blue-600">{totalPurchases}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Toplam Satış</p>
          <p className="text-2xl font-bold text-green-600">{totalSales}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Alım Tutarı</p>
          <p className="text-2xl font-bold text-blue-600">
            ₺{totalPurchaseAmount.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Satış Tutarı</p>
          <p className="text-2xl font-bold text-green-600">
            ₺{totalSaleAmount.toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Net Kar/Zarar</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netProfit >= 0 ? '+' : ''}₺{netProfit.toLocaleString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {transactions.length === 0 ? 'Henüz işlem kaydı yok' : 'Filtreye uygun işlem bulunamadı'}
          </div>
        ) : (
          <TableWrapper
            mobileCards={
              <>
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'PURCHASE'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {transaction.type === 'PURCHASE' ? '📥 Alım' : '📤 Satış'}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">
                          {new Date(transaction.date).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <span
                        className={`text-lg font-bold ${
                          transaction.type === 'PURCHASE'
                            ? 'text-blue-600'
                            : 'text-green-600'
                        }`}
                      >
                        ₺{Number(transaction.price).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Araç:</p>
                        <a
                          href={`/panel/araclar/${transaction.vehicle.licensePlate}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {transaction.vehicle.brand} {transaction.vehicle.model}
                        </a>
                        <p className="text-xs text-gray-500">{transaction.vehicle.licensePlate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Müşteri:</p>
                        <p className="text-sm text-gray-900">{transaction.customer.name}</p>
                        <a href={`tel:${transaction.customer.phone}`} className="text-xs text-primary-600 hover:text-primary-700">
                          {transaction.customer.phone}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">İşlemi Yapan:</p>
                        <p className="text-sm text-gray-900">{transaction.createdBy.name}</p>
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
                    Tarih
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    İşlem Türü
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Araç
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Müşteri
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    İşlemi Yapan
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(transaction.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'PURCHASE'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {transaction.type === 'PURCHASE' ? '📥 Alım' : '📤 Satış'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={`/panel/araclar/${transaction.vehicle.licensePlate}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {transaction.vehicle.brand} {transaction.vehicle.model}
                      </a>
                      <div className="text-xs text-gray-500">
                        {transaction.vehicle.licensePlate}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {transaction.customer.name}
                      <div className="text-xs text-gray-500">
                        {transaction.customer.phone}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`text-sm font-medium ${
                          transaction.type === 'PURCHASE'
                            ? 'text-blue-600'
                            : 'text-green-600'
                        }`}
                      >
                        ₺{Number(transaction.price).toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {transaction.createdBy.name}
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
