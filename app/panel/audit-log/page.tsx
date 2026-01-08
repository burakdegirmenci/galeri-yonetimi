import { getCurrentUser } from '@/lib/auth'
import { canViewAuditLogs } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import { getAuditLogs } from '@/lib/audit'
import AuditLogClient from '@/components/AuditLogClient'

export default async function AuditLogPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser || !canViewAuditLogs(currentUser)) {
    redirect('/panel')
  }

  const auditLogs = await getAuditLogs({ limit: 100 })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-sm text-gray-600 mt-1">
            Tüm kullanıcı aktivitelerini görüntüleyin
          </p>
        </div>
      </div>

      <AuditLogClient logs={auditLogs} />
    </div>
  )
}
