'use client'

import { useState } from 'react'
import TableWrapper from './TableWrapper'

interface AuditLog {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string | null
  oldData: string | null
  newData: string | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: Date
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

interface AuditLogClientProps {
  logs: AuditLog[]
}

export default function AuditLogClient({ logs }: AuditLogClientProps) {
  const [entityFilter, setEntityFilter] = useState<string>('ALL')
  const [actionFilter, setActionFilter] = useState<string>('ALL')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const filteredLogs = logs.filter((log) => {
    if (entityFilter !== 'ALL' && log.entity !== entityFilter) return false
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false
    return true
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-700'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700'
      case 'DELETE':
        return 'bg-red-100 text-red-700'
      case 'LOGIN':
        return 'bg-purple-100 text-purple-700'
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'Oluşturma'
      case 'UPDATE':
        return 'Güncelleme'
      case 'DELETE':
        return 'Silme'
      case 'LOGIN':
        return 'Giriş'
      case 'LOGOUT':
        return 'Çıkış'
      default:
        return action
    }
  }

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case 'User':
        return 'Kullanıcı'
      case 'Vehicle':
        return 'Araç'
      case 'Customer':
        return 'Müşteri'
      case 'Transaction':
        return 'İşlem'
      case 'Expense':
        return 'Gider'
      default:
        return entity
    }
  }

  const formatData = (data: string | null) => {
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }

  const renderDataChanges = (oldData: string | null, newData: string | null) => {
    const old = formatData(oldData)
    const newD = formatData(newData)

    if (!old && !newD) return null

    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs">
        {old && (
          <div className="mb-2">
            <p className="font-semibold text-gray-700 mb-1">Eski Veri:</p>
            <pre className="whitespace-pre-wrap text-gray-600">
              {JSON.stringify(old, null, 2)}
            </pre>
          </div>
        )}
        {newD && (
          <div>
            <p className="font-semibold text-gray-700 mb-1">Yeni Veri:</p>
            <pre className="whitespace-pre-wrap text-gray-600">
              {JSON.stringify(newD, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Entity Tipi</label>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="input"
            >
              <option value="ALL">Tümü</option>
              <option value="User">Kullanıcı</option>
              <option value="Vehicle">Araç</option>
              <option value="Customer">Müşteri</option>
              <option value="Transaction">İşlem</option>
              <option value="Expense">Gider</option>
            </select>
          </div>
          <div>
            <label className="label">İşlem Tipi</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="input"
            >
              <option value="ALL">Tümü</option>
              <option value="CREATE">Oluşturma</option>
              <option value="UPDATE">Güncelleme</option>
              <option value="DELETE">Silme</option>
              <option value="LOGIN">Giriş</option>
              <option value="LOGOUT">Çıkış</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="card">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Kayıt bulunamadı</p>
          </div>
        ) : (
          <TableWrapper
            mobileCards={
              <>
                {filteredLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {log.user.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">{log.user.email}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                          {getActionLabel(log.action)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Entity:</span>
                        <span className="font-medium text-gray-900">{getEntityLabel(log.entity)}</span>
                      </div>
                      {log.entityId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Entity ID:</span>
                          <span className="font-mono text-xs text-gray-900">{log.entityId}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tarih:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(log.createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      {log.ipAddress && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">IP:</span>
                          <span className="font-mono text-xs text-gray-900">{log.ipAddress}</span>
                        </div>
                      )}
                    </div>
                    {(log.oldData || log.newData) && (
                      <div className="mt-3">
                        <button
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {expandedLog === log.id ? '▼ Detayları Gizle' : '▶ Detayları Göster'}
                        </button>
                        {expandedLog === log.id && renderDataChanges(log.oldData, log.newData)}
                      </div>
                    )}
                  </div>
                ))}
              </>
            }
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Kullanıcı
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    İşlem
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Entity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    IP Adresi
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Tarih
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                    Detay
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{log.user.name}</div>
                      <div className="text-xs text-gray-500">{log.user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">{getEntityLabel(log.entity)}</div>
                      {log.entityId && (
                        <div className="text-xs text-gray-500 font-mono">{log.entityId.substring(0, 8)}...</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 font-mono">
                      {log.ipAddress || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {(log.oldData || log.newData) && (
                        <button
                          onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {expandedLog === log.id ? 'Gizle' : 'Göster'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Expanded details below table */}
            {expandedLog && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                {filteredLogs.map((log) =>
                  log.id === expandedLog ? renderDataChanges(log.oldData, log.newData) : null
                )}
              </div>
            )}
          </TableWrapper>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Toplam Kayıt</p>
          <p className="text-2xl font-bold text-gray-900">{filteredLogs.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Oluşturma</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredLogs.filter((l) => l.action === 'CREATE').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Silme</p>
          <p className="text-2xl font-bold text-red-600">
            {filteredLogs.filter((l) => l.action === 'DELETE').length}
          </p>
        </div>
      </div>
    </div>
  )
}
