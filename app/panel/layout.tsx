import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import PanelLayoutClient from '@/components/PanelLayoutClient'

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/giris')
  }

  return <PanelLayoutClient userName={user.name}>{children}</PanelLayoutClient>
}
