import type { UserRole } from './types'

export const roleLabel: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  employee: 'Mitarbeiter',
}

export const canManageMasterData = (role: UserRole): boolean =>
  role === 'admin' || role === 'manager'

export const canEditPlans = (role: UserRole): boolean =>
  role === 'admin' || role === 'manager'

export const canViewReports = (role: UserRole): boolean =>
  role !== 'employee'
