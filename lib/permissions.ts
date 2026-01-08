import { JWTPayload } from './auth'

export function isSuperAdmin(user: JWTPayload | null): boolean {
  return user?.role === 'SUPER_ADMIN'
}

export function isAdmin(user: JWTPayload | null): boolean {
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
}

export function canManageUsers(user: JWTPayload | null): boolean {
  return isSuperAdmin(user)
}

export function canViewAuditLogs(user: JWTPayload | null): boolean {
  return isSuperAdmin(user)
}

export function canDeleteVehicle(user: JWTPayload | null): boolean {
  return isSuperAdmin(user)
}

export function canDeleteCustomer(user: JWTPayload | null): boolean {
  return isSuperAdmin(user)
}

// All authenticated users can perform these actions
export function canCreateVehicle(user: JWTPayload | null): boolean {
  return isAdmin(user)
}

export function canUpdateVehicle(user: JWTPayload | null): boolean {
  return isAdmin(user)
}

export function canCreateTransaction(user: JWTPayload | null): boolean {
  return isAdmin(user)
}

export function canCreateExpense(user: JWTPayload | null): boolean {
  return isAdmin(user)
}

export function canCreateCustomer(user: JWTPayload | null): boolean {
  return isAdmin(user)
}

export function canUpdateCustomer(user: JWTPayload | null): boolean {
  return isAdmin(user)
}
