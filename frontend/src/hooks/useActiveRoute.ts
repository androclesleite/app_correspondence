import { useLocation } from 'react-router-dom'

export function useActiveRoute() {
  const location = useLocation()

  const isActive = (path: string) => {
    // Exact match for root paths
    if (path === '/dashboard' && location.pathname === '/dashboard') {
      return true
    }

    // Check if current path starts with the given path (for sub-routes)
    if (path !== '/dashboard' && location.pathname.startsWith(path)) {
      return true
    }

    return false
  }

  return { isActive, currentPath: location.pathname }
}