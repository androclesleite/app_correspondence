import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { packagesApi, storesApi } from '../../services/api';
import type { Store } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface PackageFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PackageForm({ onSuccess, onCancel }: PackageFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    store_id: '',
    code: '',
    courier: '',
    received_at: new Date().toISOString().slice(0, 16), // Format for datetime-local
    postal_type: 'simples' as 'simples' | 'registrada',
    volume_type: 'caixa' as 'caixa' | 'envelope' | 'pacote' | 'sedex' | 'sedex-caixa' | 'sedex-envelope' | 'sedex-pacote',
    observations: '',
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const storesData = await storesApi.list();
      setStores(storesData);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await packagesApi.create({
        ...formData,
        store_id: parseInt(formData.store_id),
      });

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setFormData({
        store_id: '',
        code: '',
        courier: '',
        received_at: new Date().toISOString().slice(0, 16),
        postal_type: 'simples',
        volume_type: 'caixa',
        observations: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar encomenda');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Se usuário é de loja, não pode cadastrar encomendas
  if (user?.role === 'loja') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">
            Apenas usuários da portaria podem cadastrar encomendas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova Correspondência</h2>
        <p className="text-muted-foreground">
          Cadastrar nova correspondência recebida na portaria
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="store_id" className="block text-sm font-medium text-gray-700">
                Loja *
              </label>
              <Select
                value={formData.store_id}
                onValueChange={(value) => handleChange('store_id', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione uma loja" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código da Postagem *
              </label>
              <Input
                id="code"
                type="text"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
                className="mt-1"
                placeholder="Ex: BR123456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="courier" className="block text-sm font-medium text-gray-700">
                Transportadora/CDD *
              </label>
              <Input
                id="courier"
                type="text"
                value={formData.courier}
                onChange={(e) => handleChange('courier', e.target.value)}
                required
                className="mt-1"
                placeholder="Ex: Correios, Mercado Envios"
              />
            </div>

            <div>
              <label htmlFor="received_at" className="block text-sm font-medium text-gray-700">
                Data/Hora de Recebimento *
              </label>
              <Input
                id="received_at"
                type="datetime-local"
                value={formData.received_at}
                onChange={(e) => handleChange('received_at', e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="postal_type" className="block text-sm font-medium text-gray-700">
                Tipo de Postagem *
              </label>
              <Select
                value={formData.postal_type}
                onValueChange={(value) => handleChange('postal_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tipo de postagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples</SelectItem>
                  <SelectItem value="registrada">Registrada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="volume_type" className="block text-sm font-medium text-gray-700">
                Tipo de Volume *
              </label>
              <Select
                value={formData.volume_type}
                onValueChange={(value) => handleChange('volume_type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Tipo de volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caixa">Caixa</SelectItem>
                  <SelectItem value="envelope">Envelope</SelectItem>
                  <SelectItem value="pacote">Pacote</SelectItem>
                  <SelectItem value="sedex">SEDEX</SelectItem>
                  <SelectItem value="sedex-caixa">SEDEX/Caixa</SelectItem>
                  <SelectItem value="sedex-envelope">SEDEX/Envelope</SelectItem>
                  <SelectItem value="sedex-pacote">SEDEX/Pacote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700">
              Observações
            </label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleChange('observations', e.target.value)}
              className="mt-1"
              placeholder="Ex: Caixa azul, frágil, envelope grande..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Encomenda'}
            </Button>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}