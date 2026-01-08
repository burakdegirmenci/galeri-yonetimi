import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, hashPassword } from '@/lib/auth'
import { canManageUsers } from '@/lib/permissions'
import { createAuditLog } from '@/lib/audit'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    if (!canManageUsers(user)) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    const data = await request.json()

    // Get old data for audit
    const oldUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    if (!oldUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Prevent user from deactivating themselves
    if (oldUser.id === user.userId && data.isActive === false) {
      return NextResponse.json(
        { error: 'Kendi hesabınızı devre dışı bırakamazsınız' },
        { status: 400 }
      )
    }

    // Prevent user from changing their own role
    if (oldUser.id === user.userId && data.role && data.role !== oldUser.role) {
      return NextResponse.json(
        { error: 'Kendi rolünüzü değiştiremezsiniz' },
        { status: 400 }
      )
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
      isActive: data.isActive,
    }

    // Update password if provided
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password)
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    })

    // Audit log
    await createAuditLog({
      userId: user.userId,
      action: 'UPDATE',
      entity: 'User',
      entityId: updatedUser.id,
      oldData: {
        email: oldUser.email,
        name: oldUser.name,
        role: oldUser.role,
        isActive: oldUser.isActive,
      },
      newData: {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı güncellenirken hata oluştu' },
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

    if (!canManageUsers(user)) {
      return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 })
    }

    // Prevent user from deleting themselves
    if (params.id === user.userId) {
      return NextResponse.json(
        { error: 'Kendi hesabınızı silemezsiniz' },
        { status: 400 }
      )
    }

    // Get user data before deletion for audit
    const deletedUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    if (!deletedUser) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    })

    // Audit log
    await createAuditLog({
      userId: user.userId,
      action: 'DELETE',
      entity: 'User',
      entityId: deletedUser.id,
      oldData: {
        email: deletedUser.email,
        name: deletedUser.name,
        role: deletedUser.role,
      },
    })

    return NextResponse.json({ message: 'Kullanıcı silindi' })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Kullanıcı silinirken hata oluştu' },
      { status: 500 }
    )
  }
}
