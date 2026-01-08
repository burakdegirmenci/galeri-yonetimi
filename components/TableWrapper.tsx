'use client'

import { ReactNode } from 'react'

interface TableWrapperProps {
  children: ReactNode
  mobileCards?: ReactNode
}

export default function TableWrapper({ children, mobileCards }: TableWrapperProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        {children}
      </div>

      {/* Mobile Cards */}
      {mobileCards && (
        <div className="md:hidden space-y-4">
          {mobileCards}
        </div>
      )}

      {/* Scroll Indicator for mobile table fallback */}
      {!mobileCards && (
        <div className="md:hidden">
          <div className="overflow-x-auto pb-4">
            <div className="inline-block min-w-full align-middle">
              {children}
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Kaydırarak tüm bilgileri görüntüleyebilirsiniz
          </p>
        </div>
      )}
    </>
  )
}
