import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Sadece PDF dosyaları yüklenebilir' },
        { status: 400 }
      )
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Araç bulunamadı' }, { status: 404 })
    }

    // Delete old file if exists
    if (vehicle.expertisePdfPath) {
      try {
        const oldFilePath = join(process.cwd(), 'public', vehicle.expertisePdfPath)
        await unlink(oldFilePath)
      } catch (err) {
        console.error('Error deleting old file:', err)
      }
    }

    // Save new file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${params.id}-${Date.now()}.pdf`
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'expertise')

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      console.error('Error creating directory:', err)
    }

    const filepath = join(uploadDir, filename)

    await writeFile(filepath, buffer)

    const pdfPath = `/uploads/expertise/${filename}`

    // Update vehicle with new path
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: { expertisePdfPath: pdfPath },
    })

    return NextResponse.json({
      message: 'PDF başarıyla yüklendi',
      path: pdfPath,
    })
  } catch (error) {
    console.error('Upload expertise PDF error:', error)
    return NextResponse.json(
      { error: 'PDF yüklenirken hata oluştu' },
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

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Araç bulunamadı' }, { status: 404 })
    }

    if (!vehicle.expertisePdfPath) {
      return NextResponse.json({ error: 'PDF bulunamadı' }, { status: 404 })
    }

    // Delete file
    try {
      const filepath = join(process.cwd(), 'public', vehicle.expertisePdfPath)
      await unlink(filepath)
    } catch (err) {
      console.error('Error deleting file:', err)
    }

    // Update vehicle
    await prisma.vehicle.update({
      where: { id: params.id },
      data: { expertisePdfPath: null },
    })

    return NextResponse.json({ message: 'PDF başarıyla silindi' })
  } catch (error) {
    console.error('Delete expertise PDF error:', error)
    return NextResponse.json(
      { error: 'PDF silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
