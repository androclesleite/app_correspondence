import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { DashboardLayout } from './components/layout/dashboard-layout'
import Login from './pages/Login'
import { DashboardIndex } from './pages/dashboard/index'
import { PackagesList } from './pages/correspondence/index'
import { NewCorrespondence } from './pages/correspondence/new'
import { UsersIndex } from './pages/users/index'
import { Skeleton } from './components/ui/skeleton'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardIndex />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Correspondence Module Routes */}
      <Route
        path="/correspondence"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PackagesList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/correspondence/new"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <NewCorrespondence />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Future modules placeholders */}
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Módulo de Documentos</h2>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/loans"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Módulo de Empréstimos</h2>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Módulo de Funcionários</h2>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UsersIndex />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Configurações</h2>
                <p className="text-muted-foreground">Em desenvolvimento...</p>
              </div>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Legacy route redirect */}
      <Route path="/packages" element={<Navigate to="/correspondence" />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
