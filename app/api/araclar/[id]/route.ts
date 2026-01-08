import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const data = await request.json()

    // Check if licensePlate is being changed and if it's already in use
    if (data.licensePlate) {
      const existing = await prisma.vehicle.findFirst({
        where: {
          licensePlate: data.licensePlate,
          NOT: { id: params.id },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Bu plaka başka bir araçta kullanılıyor' },
          { status: 409 }
        )
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        licensePlate: data.licensePlate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        bodyType: data.bodyType,
        fuelType: data.fuelType,
        transmission: data.transmission,
        kmAtPurchase: data.kmAtPurchase,
        purchasePrice: data.purchasePrice,
        notes: data.notes,
        status: data.status,
      },
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Update vehicle error:', error)
    return NextResponse.json(
      { error: 'Araç güncellenirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    // Delete related records first (cascade delete)
    await prisma.expense.deleteMany({
      where: { vehicleId: params.id },
    })

    await prisma.transaction.deleteMany({
      where: { vehicleId: params.id },
    })

    // Delete the vehicle
    await prisma.vehicle.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Araç başarıyla silindi' })
  } catch (error) {
    console.error('Delete vehicle error:', error)
    return NextResponse.json(
      { error: 'Araç silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
