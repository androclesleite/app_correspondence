import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Package, PackageCheck, TrendingUp, Clock, AlertCircle, Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { packagesApi } from "../../services/api"
import type { Package as PackageType } from "../../types"
import { toast } from "sonner"
import { useAuth } from "../../hooks/useAuth"
import { usePermissions } from "../../hooks/usePermissions"

interface DashboardStats {
  total: number
  pending: number
  collected: number
  returned: number
  deleted: number
}

export function DashboardIndex() {
  const { user } = useAuth()
  const { getRoleLabel, canCreatePackages } = usePermissions()
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    collected: 0,
    returned: 0,
    deleted: 0
  })
  const [recentPackages, setRecentPackages] = useState<PackageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Load packages based on user role
      const queryParams = user?.role === 'loja' && user?.store_id
        ? { store_id: user.store_id }
        : {}

      const response = await packagesApi.list(queryParams)
      const packages = response.data || response

      // Calculate statistics
      const newStats = {
        total: packages.length,
        pending: packages.filter((p: PackageType) => p.status === 'pending').length,
        collected: packages.filter((p: PackageType) => p.status === 'collected').length,
        returned: packages.filter((p: PackageType) => p.status === 'returned').length,
        deleted: packages.filter((p: PackageType) => p.status === 'deleted').length,
      }

      setStats(newStats)

      // Get recent packages (last 5)
      const recent = packages
        .sort((a: PackageType, b: PackageType) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5)

      setRecentPackages(recent)

      if (newStats.pending > 10) {
        toast.info(`Você tem ${newStats.pending} encomendas pendentes`, {
          description: "Considere processar as encomendas mais antigas"
        })
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar dados do dashboard'
      setError(errorMessage)
      toast.error("Erro ao carregar dashboard", {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      collected: "bg-green-100 text-green-800 border-green-200",
      returned: "bg-blue-100 text-blue-800 border-blue-200",
      deleted: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'Pendente',
      collected: 'Retirada',
      returned: 'Devolvida',
      deleted: 'Excluída',
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Principal</h1>
            <p className="text-muted-foreground">
              Bem-vindo {user?.name} • {getRoleLabel(user?.role)}
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Principal</h1>
          <p className="text-muted-foreground">
            Bem-vindo {user?.name} • {getRoleLabel(user?.role)}
          </p>
        </div>
        {canCreatePackages() && (
          <Button onClick={() => window.location.href = '/correspondence/new'}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Encomenda
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Encomendas
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  Todas as encomendas registradas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando retirada
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Retiradas
            </CardTitle>
            <PackageCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">{stats.collected}</div>
                <p className="text-xs text-muted-foreground">
                  Encomendas entregues
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Sucesso
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats.total > 0 ? Math.round((stats.collected / stats.total) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Encomendas entregues vs total
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Correspondências Recentes</CardTitle>
            <CardDescription>
              Últimas correspondências do sistema
            </CardDescription>
          </div>
          <Button onClick={() => window.location.href = '/correspondence'}>
            <Plus className="h-4 w-4 mr-2" />
            Ver Todas
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead>Transportadora</TableHead>
                  <TableHead>Recebido</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPackages.length > 0 ? (
                  recentPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.code}</TableCell>
                      <TableCell>{pkg.store?.name}</TableCell>
                      <TableCell>{pkg.courier}</TableCell>
                      <TableCell>{formatDate(pkg.received_at)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pkg.status)}>
                          {getStatusText(pkg.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhuma correspondência encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}