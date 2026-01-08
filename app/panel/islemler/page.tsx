import { prisma } from '@/lib/prisma'
import IslemlerFiltre from '@/components/IslemlerFiltre'

async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
    include: {
      vehicle: true,
      customer: true,
      createdBy: true,
    },
    orderBy: { date: 'desc' },
  })
  return transactions
}

export default async function IslemlerPage() {
  const transactions = await getTransactions()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">İşlemler</h1>
      </div>

      <IslemlerFiltre transactions={transactions} />
    </div>
  )
}
