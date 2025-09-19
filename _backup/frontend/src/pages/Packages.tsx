import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { packagesApi, storesApi } from '../services/api';
import { Package, Store } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import PackageForm from '../components/forms/PackageForm';
import CollectionModal from '../components/forms/CollectionModal';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function Packages() {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    store_id: 0,
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [packagesData, storesData] = await Promise.all([
        packagesApi.list(filters),
        storesApi.list(),
      ]);

      setPackages(packagesData.data || packagesData);
      setStores(storesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusAction = async (packageId: number, action: 'returned' | 'deleted') => {
    try {
      if (action === 'returned') {
        await packagesApi.markAsReturned(packageId);
      } else if (action === 'deleted') {
        await packagesApi.delete(packageId);
      }
      loadData(); // Reload data
    } catch (error) {
      console.error(`Erro ao ${action === 'returned' ? 'devolver' : 'excluir'} encomenda:`, error);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: 'Pendente',
      collected: 'Retirada',
      returned: 'Devolvida',
      deleted: 'Excluída',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      collected: 'bg-green-100 text-green-800',
      returned: 'bg-blue-100 text-blue-800',
      deleted: 'bg-red-100 text-red-800',
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCollectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setShowCollectionModal(true);
  };

  const handleCollectionSuccess = () => {
    setShowCollectionModal(false);
    setSelectedPackage(null);
    loadData(); // Reload data
  };

  const canPerformAction = (action: string) => {
    if (action === 'delete') {
      return user?.role === 'admin';
    }
    return user?.role === 'admin' || user?.role === 'portaria';
  };

  return (
    <DashboardLayout
      breadcrumb={{
        items: [
          { title: 'Sistema de Correspondências', href: '/dashboard' },
          { title: 'Gerenciar Encomendas' }
        ]
      }}
    >
        {/* Form Section */}
        {(user?.role === 'admin' || user?.role === 'portaria') && (
          <div className="mb-8">
            {showForm ? (
              <PackageForm
                onSuccess={() => {
                  setShowForm(false);
                  loadData();
                }}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <Card>
                <CardContent className="py-6">
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Cadastrar Nova Encomenda
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="collected">Retirada</option>
                  <option value="returned">Devolvida</option>
                  <option value="deleted">Excluída</option>
                </Select>
              </div>

              {(user?.role === 'admin' || user?.role === 'portaria') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loja
                  </label>
                  <Select
                    value={filters.store_id}
                    onChange={(e) => setFilters(prev => ({ ...prev, store_id: parseInt(e.target.value) || 0 }))}
                  >
                    <option value="">Todas as lojas</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ status: '', store_id: 0 })}
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Encomendas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : packages.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Nenhuma encomenda encontrada
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transportadora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recebido em
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pkg.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pkg.store?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pkg.courier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(pkg.received_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.status)}`}>
                            {getStatusText(pkg.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {pkg.status === 'pending' && canPerformAction('collect') && (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => handleCollectPackage(pkg)}
                            >
                              Confirmar Retirada
                            </Button>
                          )}
                          {pkg.status === 'pending' && canPerformAction('return') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusAction(pkg.id, 'returned')}
                            >
                              Devolver
                            </Button>
                          )}
                          {canPerformAction('delete') && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusAction(pkg.id, 'deleted')}
                            >
                              Excluir
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Collection Modal */}
        <CollectionModal
          isOpen={showCollectionModal}
          onClose={() => {
            setShowCollectionModal(false);
            setSelectedPackage(null);
          }}
          package={selectedPackage}
          onSuccess={handleCollectionSuccess}
        />
    </DashboardLayout>
  );
}