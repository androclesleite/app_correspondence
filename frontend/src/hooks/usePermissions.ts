import { useAuth } from './useAuth'

export function usePermissions() {
  const { user } = useAuth()

  const hasRole = (roles: string | string[]) => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const canManagePackages = () => {
    return hasRole(['super_admin', 'admin', 'portaria'])
  }

  const canCreatePackages = () => {
    return hasRole(['super_admin', 'admin', 'portaria'])
  }

  const canDeletePackages = () => {
    return hasRole(['super_admin', 'admin'])
  }

  const canManageStores = () => {
    return hasRole(['super_admin', 'admin'])
  }

  const canManageUsers = () => {
    return hasRole(['super_admin'])
  }

  const canViewAllStores = () => {
    return hasRole(['super_admin', 'admin', 'portaria'])
  }

  const canAccessAdminPanel = () => {
    return hasRole(['super_admin', 'admin'])
  }

  const getRoleLabel = (role?: string) => {
    const labels = {
      'super_admin': 'System Administrator',
      'admin': 'Mall Manager',
      'portaria': 'Reception Desk',
      'loja': 'Store Manager'
    }
    return labels[role as keyof typeof labels] || role
  }

  return {
    user,
    hasRole,
    canManagePackages,
    canCreatePackages,
    canDeletePackages,
    canManageStores,
    canManageUsers,
    canViewAllStores,
    canAccessAdminPanel,
    getRoleLabel,
    isSuperAdmin: hasRole('super_admin'),
    isAdmin: hasRole(['super_admin', 'admin']),
    isPorteiro: hasRole('portaria'),
    isLoja: hasRole('loja')
  }
}