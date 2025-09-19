import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Package, Mail, Lock, Building2, Shield, Users, X } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoUsers, setShowDemoUsers] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
      </div>

      {/* Demo Users Button - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          onClick={() => setShowDemoUsers(!showDemoUsers)}
          variant="outline"
          className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white/90 shadow-lg"
        >
          <Users className="w-4 h-4 mr-2" />
          Usuários Demo
        </Button>
      </div>

      {/* Demo Users Panel */}
      {showDemoUsers && (
        <div className="absolute top-20 right-6 z-20 w-80">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Usuários de Demonstração
                </CardTitle>
                <Button
                  onClick={() => setShowDemoUsers(false)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                  <div>
                    <span className="font-semibold text-gray-900">Admin Geral</span>
                    <p className="text-gray-600">admin@contoso.com</p>
                  </div>
                  <div className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium">
                    ADMIN
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div>
                    <span className="font-semibold text-gray-900">Portaria</span>
                    <p className="text-gray-600">portaria@contoso.com</p>
                  </div>
                  <div className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium">
                    PORTARIA
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div>
                    <span className="font-semibold text-gray-900">Loja A</span>
                    <p className="text-gray-600">loja.a@contoso.com</p>
                  </div>
                  <div className="px-2 py-1 bg-green-500 text-white rounded text-xs font-medium">
                    LOJA
                  </div>
                </div>
                <div className="text-center pt-3 border-t border-gray-200">
                  <p className="text-gray-700 font-medium">Senha para todos: <code className="bg-gray-100 px-2 py-1 rounded text-gray-900 font-mono text-xs">password</code></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="relative w-full max-w-lg mx-auto px-6">
        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            {/* Logo and Title inside card */}
            <div className="flex flex-col items-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <Package className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Madnezz
              </h1>
              <p className="text-gray-600">
                Sistema de gestão para shoppings
              </p>
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Acesso Seguro
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email de acesso
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary rounded-lg"
                      placeholder="seuemail@exemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary rounded-lg"
                      placeholder="Digite sua senha"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Autenticando...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Entrar no Sistema
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Sistema desenvolvido para modernizar a gestão de correspondências</p>
        </div>
      </div>
    </div>
  );
}