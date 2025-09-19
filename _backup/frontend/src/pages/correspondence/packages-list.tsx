import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { packagesApi, storesApi } from '../../services/api'
import { Package, Store } from '../../types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert, AlertDescription } from '../../components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { Package as PackageIcon, Plus, Search, Filter, Eye, Archive, Trash2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import PackageForm from '../../components/forms/PackageForm'
import CollectionModal from '../../components/forms/CollectionModal'

export function PackagesList() {
  const { user } = useAuth()
  const [packages, setPackages] = useState<Package[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [storeFilter, setStoreFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showCollectionModal, setShowCollectionModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [statusFilter, storeFilter])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [packagesData, storesData] = await Promise.all([
        packagesApi.list({ status: statusFilter, store_id: storeFilter ? parseInt(storeFilter) : undefined }),
        storesApi.list(),
      ])

      setPackages(packagesData.data || packagesData)
      setStores(storesData)
    } catch (error: any) {
      toast.error('Erro ao carregar dados', {
        description: error.response?.data?.message || 'Falha na comunicação com o servidor'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusAction = async (packageId: number, action: 'returned' | 'deleted') => {
    try {
      if (action === 'returned') {
        await packagesApi.markAsReturned(packageId)
        toast.success('Encomenda marcada como devolvida')
      } else if (action === 'deleted') {
        await packagesApi.delete(packageId)
        toast.success('Encomenda excluída')
      }
      loadData()
    } catch (error: any) {
      toast.error(`Erro ao ${action === 'returned' ? 'devolver' : 'excluir'} encomenda`, {
        description: error.response?.data?.message || 'Falha na operação'
      })
    }
  }

  const handleCollectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowCollectionModal(true)
  }

  const handleCollectionSuccess = () => {
    setShowCollectionModal(false)
    setSelectedPackage(null)
    loadData()
    toast.success('Encomenda coletada com sucesso!')
  }

  const canPerformAction = (action: string) => {
    if (action === 'delete') {
      return user?.role === 'admin'
    }
    return user?.role === 'admin' || user?.role === 'portaria'
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'warning',
      collected: 'success',
      returned: 'secondary',
      deleted: 'destructive',
    } as const

    const labels = {
      pending: 'Pendente',
      collected: 'Retirada',
      returned: 'Devolvida',
      deleted: 'Excluída',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
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

  // Filter packages based on search term
  const filteredPackages = packages.filter(pkg =>
    pkg.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.courier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.store?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Correspondências</h2>
          <p className="text-muted-foreground">
            Gerencie todas as encomendas do sistema
          </p>
        </div>

        {(user?.role === 'admin' || user?.role === 'portaria') && (
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nova Encomenda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Encomenda</DialogTitle>
                <DialogDescription>
                  Preencha os dados da encomenda recebida
                </DialogDescription>
              </DialogHeader>
              <PackageForm
                onSuccess={() => {
                  setShowForm(false)
                  loadData()
                  toast.success('Encomenda cadastrada com sucesso!')
                }}
                onCancel={() => setShowForm(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código, transportadora..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="pending">Pendente</option>
              <option value="collected">Retirada</option>
              <option value="returned">Devolvida</option>
              <option value="deleted">Excluída</option>
            </Select>

            {(user?.role === 'admin' || user?.role === 'portaria') && (
              <Select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
              >
                <option value="">Todas as lojas</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </Select>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setStoreFilter('')
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5" />
            Lista de Encomendas
          </CardTitle>
          <CardDescription>
            {filteredPackages.length} encomenda(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nenhuma encomenda encontrada com os filtros aplicados.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead>Transportadora</TableHead>
                  <TableHead>Recebido em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.code}</TableCell>
                    <TableCell>{pkg.store?.name}</TableCell>
                    <TableCell>{pkg.courier}</TableCell>
                    <TableCell>{formatDate(pkg.received_at)}</TableCell>
                    <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {pkg.status === 'pending' && canPerformAction('collect') && (
                          <Button
                            size="sm"
                            onClick={() => handleCollectPackage(pkg)}
                            className="gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Retirar
                          </Button>
                        )}
                        {pkg.status === 'pending' && canPerformAction('return') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusAction(pkg.id, 'returned')}
                            className="gap-1"
                          >
                            <Archive className="w-3 h-3" />
                            Devolver
                          </Button>
                        )}
                        {canPerformAction('delete') && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusAction(pkg.id, 'deleted')}
                            className="gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Excluir
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Collection Modal */}
      <CollectionModal
        isOpen={showCollectionModal}
        onClose={() => {
          setShowCollectionModal(false)
          setSelectedPackage(null)
        }}
        package={selectedPackage}
        onSuccess={handleCollectionSuccess}
      />
    </div>
  )
}