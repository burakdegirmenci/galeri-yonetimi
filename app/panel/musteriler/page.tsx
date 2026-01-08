import { prisma } from '@/lib/prisma'
import MusterilerClient from '@/components/MusterilerClient'

async function getCustomers() {
  const customers = await prisma.customer.findMany({
    include: {
      transactions: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return customers
}

export default async function MusterilerPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
      </div>

      <MusterilerClient customers={customers} />
    </div>
  )
}
