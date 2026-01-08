import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Get vehicles error:', error)
    return NextResponse.json(
      { error: 'Araçlar getirilirken hata oluştu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const data = await request.json()

    const existing = await prisma.vehicle.findUnique({
      where: { licensePlate: data.licensePlate },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Bu plaka zaten kayıtlı' },
        { status: 409 }
      )
    }

    const vehicle = await prisma.vehicle.create({
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
      },
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Create vehicle error:', error)
    return NextResponse.json(
      { error: 'Araç oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}
