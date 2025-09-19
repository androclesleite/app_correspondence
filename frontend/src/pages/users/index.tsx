import { usePermissions } from '../../hooks/usePermissions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Users, Shield, Key, Store } from 'lucide-react'

export function UsersIndex() {
  const { canManageUsers, getRoleLabel, user } = usePermissions()

  if (!canManageUsers()) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
            <p className="text-muted-foreground">Gerencie usuários do sistema</p>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta área. Apenas Super Administradores podem gerenciar usuários.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const userRoles = [
    {
      id: 'super_admin',
      title: 'System Administrator',
      description: 'Full system access. Can manage users, stores and all correspondence operations.',
      icon: Key,
      permissions: [
        'Manage users and permissions',
        'Manage stores and shopping centers',
        'Create, edit and delete all correspondence',
        'Access administrative reports',
        'System configuration and settings'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'admin',
      title: 'Mall Manager',
      description: 'Manages correspondence and can delete records. Administers a specific shopping center.',
      icon: Shield,
      permissions: [
        'Create, edit and delete correspondence',
        'Manage correspondence for all stores',
        'Access shopping center reports',
        'Mark correspondence as returned',
        'Process collections and deliveries'
      ],
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: 'portaria',
      title: 'Reception Desk',
      description: 'Receives correspondence, registers in system and processes collections.',
      icon: Users,
      permissions: [
        'Create new correspondence entries',
        'Register collections and deliveries',
        'Mark correspondence as returned',
        'View correspondence for all stores',
        'Process package handovers'
      ],
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: 'loja',
      title: 'Store Manager',
      description: 'Limited access to correspondence for their own store only.',
      icon: Store,
      permissions: [
        'View correspondence for own store only',
        'Check correspondence status',
        'View correspondence history',
        'Track pending deliveries'
      ],
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Níveis de Usuário</h1>
          <p className="text-muted-foreground">
            Sistema de permissões com 4 níveis de acesso
          </p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          Seu nível: {getRoleLabel(user?.role)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {userRoles.map((role) => {
          const IconComponent = role.icon
          return (
            <Card key={role.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <Badge className={role.color}>{role.id}</Badge>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Permissões:</h4>
                  <ul className="space-y-1">
                    {role.permissions.map((permission, index) => (
                      <li key={index} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demonstração do Sistema</CardTitle>
          <CardDescription>
            Este sistema está preparado para demonstração com os 4 níveis de usuário implementados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Funcionalidades Implementadas:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Controle de acesso baseado em roles</li>
                <li>• Interface adaptativa por nível de usuário</li>
                <li>• Filtros automáticos por loja (usuário "loja")</li>
                <li>• Permissões granulares de CRUD</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Pronto para Produção:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Backend Laravel com autenticação</li>
                <li>• Frontend React com TypeScript</li>
                <li>• Componentes shadcn/ui responsivos</li>
                <li>• Docker para deploy fácil</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}