import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const data = await request.json()

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        vehicleId: data.vehicleId,
        customerId: data.customerId,
        price: data.price,
        date: data.date ? new Date(data.date) : new Date(),
        notes: data.notes,
        createdById: user.userId,
      },
    })

    // If it's a sale, update vehicle status
    if (data.type === 'SALE') {
      await prisma.vehicle.update({
        where: { id: data.vehicleId },
        data: {
          status: 'SOLD',
          salePrice: data.price,
          galleryExitDate: new Date(),
        },
      })
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'İşlem oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
