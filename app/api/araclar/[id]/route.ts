import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { canDeleteVehicle } from '@/lib/permissions'

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

    // Get old data for audit
    const oldVehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!oldVehicle) {
      return NextResponse.json({ error: 'Araç bulunamadı' }, { status: 404 })
    }

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

    // Audit log
    await createAuditLog({
      userId: user.userId,
      action: 'UPDATE',
      entity: 'Vehicle',
      entityId: vehicle.id,
      oldData: {
        licensePlate: oldVehicle.licensePlate,
        brand: oldVehicle.brand,
        model: oldVehicle.model,
        status: oldVehicle.status,
        purchasePrice: oldVehicle.purchasePrice,
      },
      newData: {
        licensePlate: vehicle.licensePlate,
        brand: vehicle.brand,
        model: vehicle.model,
        status: vehicle.status,
        purchasePrice: vehicle.purchasePrice,
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

    if (!canDeleteVehicle(user)) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    // Get vehicle data before deletion for audit
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Araç bulunamadı' }, { status: 404 })
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

    // Audit log
    await createAuditLog({
      userId: user.userId,
      action: 'DELETE',
      entity: 'Vehicle',
      entityId: vehicle.id,
      oldData: {
        licensePlate: vehicle.licensePlate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
      },
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
