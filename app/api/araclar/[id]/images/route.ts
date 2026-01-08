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
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
    }

    // Check if vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Araç bulunamadı' }, { status: 404 })
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'vehicles')

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (err) {
      console.error('Error creating directory:', err)
    }

    // Get existing images
    const existingImages = vehicle.images ? JSON.parse(vehicle.images) : []
    const newImagePaths: string[] = []

    // Upload new images
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue // Skip non-image files
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const filename = `${params.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${file.type.split('/')[1]}`
      const filepath = join(uploadDir, filename)

      await writeFile(filepath, buffer)
      newImagePaths.push(`/uploads/vehicles/${filename}`)
    }

    // Combine with existing images
    const allImages = [...existingImages, ...newImagePaths]

    // Update vehicle with new images
    await prisma.vehicle.update({
      where: { id: params.id },
      data: { images: JSON.stringify(allImages) },
    })

    return NextResponse.json({
      message: 'Fotoğraflar başarıyla yüklendi',
      images: allImages,
    })
  } catch (error) {
    console.error('Upload vehicle images error:', error)
    return NextResponse.json(
      { error: 'Fotoğraflar yüklenirken hata oluştu' },
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

    const { imagePath } = await request.json()

    if (!imagePath) {
      return NextResponse.json({ error: 'Resim yolu bulunamadı' }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: params.id },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Araç bulunamadı' }, { status: 404 })
    }

    const existingImages = vehicle.images ? JSON.parse(vehicle.images) : []

    // Remove image from array
    const updatedImages = existingImages.filter((img: string) => img !== imagePath)

    // Delete file from disk
    try {
      const filepath = join(process.cwd(), 'public', imagePath)
      await unlink(filepath)
    } catch (err) {
      console.error('Error deleting file:', err)
    }

    // Update vehicle
    await prisma.vehicle.update({
      where: { id: params.id },
      data: { images: JSON.stringify(updatedImages) },
    })

    return NextResponse.json({
      message: 'Fotoğraf başarıyla silindi',
      images: updatedImages
    })
  } catch (error) {
    console.error('Delete vehicle image error:', error)
    return NextResponse.json(
      { error: 'Fotoğraf silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
