import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import YanMenu from '@/components/YanMenu'
import UstCubuk from '@/components/UstCubuk'

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/giris')
  }

  return (
    <div className="flex min-h-screen">
      <YanMenu />
      <div className="flex-1">
        <UstCubuk userName={user.name} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
