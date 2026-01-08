import { prisma } from './prisma'
import { headers } from 'next/headers'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
export type AuditEntity = 'User' | 'Vehicle' | 'Customer' | 'Transaction' | 'Expense'

interface AuditLogData {
  userId: string
  action: AuditAction
  entity: AuditEntity
  entityId?: string
  oldData?: any
  newData?: any
}

export async function createAuditLog(data: AuditLogData) {
  try {
    const headersList = await headers()
    const ipAddress = headersList.get('x-forwarded-for') ||
                     headersList.get('x-real-ip') ||
                     'unknown'
    const userAgent = headersList.get('user-agent') || 'unknown'

    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        oldData: data.oldData ? JSON.stringify(data.oldData) : null,
        newData: data.newData ? JSON.stringify(data.newData) : null,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    // Don't throw error, just log it - audit log shouldn't break the main flow
    console.error('[Audit Log Error]:', error)
  }
}

export async function getAuditLogs(options?: {
  userId?: string
  entity?: AuditEntity
  action?: AuditAction
  limit?: number
  offset?: number
}) {
  const where: any = {}

  if (options?.userId) where.userId = options.userId
  if (options?.entity) where.entity = options.entity
  if (options?.action) where.action = options.action

  return prisma.auditLog.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit || 50,
    skip: options?.offset || 0,
  })
}

export async function getEntityAuditHistory(entity: AuditEntity, entityId: string) {
  return prisma.auditLog.findMany({
    where: {
      entity,
      entityId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Helper to get changes between old and new data
export function getChanges(oldData: any, newData: any): string[] {
  const changes: string[] = []
  const allKeys = new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})])

  allKeys.forEach((key) => {
    const oldValue = oldData?.[key]
    const newValue = newData?.[key]

    if (oldValue !== newValue) {
      if (oldValue === undefined) {
        changes.push(`${key}: added "${newValue}"`)
      } else if (newValue === undefined) {
        changes.push(`${key}: removed "${oldValue}"`)
      } else {
        changes.push(`${key}: changed from "${oldValue}" to "${newValue}"`)
      }
    }
  })

  return changes
}
