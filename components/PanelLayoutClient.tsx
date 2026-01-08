'use client'

import { useState } from 'react'
import YanMenu from '@/components/YanMenu'
import UstCubuk from '@/components/UstCubuk'

interface PanelLayoutClientProps {
  userName: string
  children: React.ReactNode
}

export default function PanelLayoutClient({ userName, children }: PanelLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <YanMenu />

      {/* Mobile Sidebar */}
      <YanMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isMobile
      />

      <div className="flex-1 w-full md:w-auto">
        <UstCubuk
          userName={userName}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
