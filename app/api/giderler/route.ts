import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const data = await request.json()

    const expense = await prisma.expense.create({
      data: {
        vehicleId: data.vehicleId || null,
        type: data.type,
        amount: data.amount,
        date: data.date ? new Date(data.date) : new Date(),
        description: data.description,
      },
    })

    // Audit log
    await createAuditLog({
      userId: user.userId,
      action: 'CREATE',
      entity: 'Expense',
      entityId: expense.id,
      newData: {
        vehicleId: expense.vehicleId,
        type: expense.type,
        amount: expense.amount,
        description: expense.description,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Create expense error:', error)
    return NextResponse.json(
      { error: 'Gider oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
