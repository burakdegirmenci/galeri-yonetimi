import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { canManageUsers } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import KullanicilarClient from '@/components/KullanicilarClient'

async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return users
}

export default async function KullanicilarPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser || !canManageUsers(currentUser)) {
    redirect('/panel')
  }

  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
      </div>

      <KullanicilarClient users={users} currentUserId={currentUser.userId} />
    </div>
  )
}
