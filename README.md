# Plaza Shopping Center - Correspondence Management System

Complete correspondence management system for shopping centers, built with Laravel + React TypeScript and 4-level user access control.

## 🎯 Features

### Core Features
- **4-Level User System**: System Admin, Mall Manager, Reception Desk, Store Manager
- **Package Registration**: Reception desk registers incoming packages
- **Collection Workflow**: Photo + Digital signature + CPF verification
- **Real-time Dashboard**: Analytics and metrics
- **Complete Audit Trail**: Logs of all actions
- **Role-based Permissions**: Granular access control

### User Roles & Permissions

#### 🔑 System Administrator
- Full system access
- User management
- All store access
- System configuration

#### 👨‍💼 Mall Manager
- Manage all correspondence
- Delete packages (soft delete)
- View all stores
- Process collections

#### 🏢 Reception Desk
- Register new packages
- Process collections
- Return to sender
- View all stores

#### 🏪 Store Manager
- View own store packages only
- Track delivery status
- Package history

## 🛠️ Stack Tecnológica

### Backend
- **Laravel 12** - Framework PHP
- **MySQL 8.0** - Banco de dados
- **Laravel Sanctum** - Autenticação API
- **Storage Local** - Fotos e assinaturas

### Frontend
- **React 18 + TypeScript** - Interface
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **react-webcam** - Captura de foto
- **react-signature-canvas** - Assinatura digital

## 📋 Pré-requisitos

- **PHP 8.3+**
- **Composer**
- **Node.js 18+**
- **npm ou yarn**
- **MySQL 8.0+**
- **Docker** (opcional)

## 🚀 Quick Start (Tomorrow's Presentation)

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <your-repository-url>
cd app_correspondence

# Start all services
docker-compose up -d

# Wait for containers to start (2-3 minutes)
# Then access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

### ✅ System Ready!
After containers start, the system is fully functional with:
- ✅ Database populated with test data
- ✅ 6 test users created
- ✅ 5 sample packages
- ✅ All 4 user roles working

### Opção 2: Instalação Manual

#### Backend (Laravel)

```bash
# Navegar para pasta backend
cd backend

# Instalar dependências
composer install

# Configurar ambiente
cp .env.example .env
php artisan key:generate

# Configurar banco no .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=correspondence_db
DB_USERNAME=root
DB_PASSWORD=sua_senha

# Executar migrations
php artisan migrate

# Popular banco com dados de teste
php artisan db:seed --class=CorrespondenceSeeder

# Iniciar servidor
php artisan serve
```

#### Frontend (React)

```bash
# Em outro terminal, navegar para frontend
cd frontend

# Instalar dependências
npm install

# Configurar API URL (opcional)
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Iniciar servidor de desenvolvimento
npm run dev
```

## 👥 Test Users (Ready for Demo)

After seeding, these users are available:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| 🔑 **System Admin** | admin@plaza.com | password | Full system access |
| 👨‍💼 **Mall Manager** | manager@plaza.com | password | Mall administration |
| 🏢 **Reception** | reception@plaza.com | password | Package reception |
| 🏪 **Fashion Store** | fashion@plaza.com | password | Fashion Store manager |
| 🏪 **Electronics** | electronics@plaza.com | password | Electronics store |
| 🏪 **Beauty Store** | beauty@plaza.com | password | Beauty store |

### 🏢 Shopping Center: Plaza Shopping Center
- 5 stores created (Fashion, Electronics, Beauty, Sports, Books)
- 5 sample packages with different statuses
- Professional English interface

## 🎭 Demo Workflow (Tomorrow's Presentation)

### 1. System Access
- Open `http://localhost:3000`
- Login with any test user (password: `password`)

### 2. Test Complete Workflow

#### 📦 As Reception Desk (`reception@plaza.com`):
1. Go to "Correspondências"
2. Click "Nova Encomenda"
3. Fill: Store = Fashion Store, Code = TEST123, Courier = FedEx
4. Save package

#### 🏪 As Store Manager (`fashion@plaza.com`):
1. Login and see only Fashion Store packages
2. Notice the new package appears
3. Verify limited permissions (can't create/delete)

#### 👨‍💼 As Mall Manager (`manager@plaza.com`):
1. See all stores packages
2. Click "Retirar" on TEST123 package
3. Fill collector info: Name = "John Doe", CPF = "12345678900"
4. Complete collection process

#### 🔑 As System Admin (`admin@plaza.com`):
1. Access "Users" menu (only visible to System Admin)
2. See 4-level permission system explanation
3. Full access to all features

### 3. Key Demo Points
- ✅ Role-based sidebar (different options per user)
- ✅ Data filtering (stores see only their packages)
- ✅ Permission-based buttons (create/delete/manage)
- ✅ Professional UI with modern design
- ✅ Complete audit trail and logging

## 🗂️ Estrutura do Projeto

```
app_correspondence/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Models/         # Eloquent Models
│   │   ├── Http/
│   │   │   ├── Controllers/ # API Controllers
│   │   │   └── Requests/    # Form Requests
│   │   └── Services/       # Business Logic
│   ├── database/
│   │   ├── migrations/     # Database Migrations
│   │   └── seeders/        # Data Seeders
│   └── routes/
│       └── api.php         # API Routes
├── frontend/               # React App
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── pages/          # Page Components
│   │   ├── hooks/          # Custom Hooks
│   │   ├── services/       # API Services
│   │   ├── types/          # TypeScript Types
│   │   └── context/        # React Context
│   └── public/
├── docker-compose.yml      # Docker Configuration
└── README.md
```

## 🔧 Configurações Importantes

### CORS (Backend)
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
```

### Sanctum (Backend)
```php
// config/sanctum.php
'stateful' => ['localhost:5173'],
```

### Storage (Backend)
```bash
# Criar link simbólico para storage público
php artisan storage:link
```

## 🐛 Troubleshooting

### Erro de CORS
- Verificar configuração em `config/cors.php`
- Confirmar `SANCTUM_STATEFUL_DOMAINS` no `.env`

### Erro de Permissões (Laravel)
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Erro de Banco
- Verificar credenciais no `.env`
- Confirmar se database existe
- Executar migrations: `php artisan migrate`

### Erro de Node Modules
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📊 API Endpoints

### Autenticação
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Dados do usuário

### Encomendas
- `GET /api/packages` - Listar encomendas
- `POST /api/packages` - Criar encomenda
- `GET /api/packages/{id}` - Detalhes da encomenda
- `POST /api/packages/{id}/collect` - Confirmar retirada
- `PATCH /api/packages/{id}/return` - Marcar como devolvida
- `DELETE /api/packages/{id}` - Excluir (soft delete)

### Lojas
- `GET /api/stores` - Listar lojas
- `GET /api/stores/{id}` - Detalhes da loja

## 🎨 Personalização

### Cores
A cor principal do sistema é **#00969A** (verde azulado). Para alterar:

```javascript
// frontend/tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#00969A', // Sua cor aqui
        // ... outras variações
      }
    }
  }
}
```

### Logo/Branding
- Substituir logo em `frontend/public/`
- Atualizar título em `frontend/index.html`
- Modificar nome do app em `frontend/src/pages/`

## 📝 Próximos Passos

### Melhorias Sugeridas
- [ ] **Notificações Email** - Templates HTML + fila
- [ ] **QR Code** - Para retirada rápida via mobile
- [ ] **Relatórios Excel** - Exportação completa
- [ ] **Dashboard Analytics** - Gráficos avançados
- [ ] **Mobile App** - PWA ou app nativo
- [ ] **Multi-tenant** - Múltiplos shoppings
- [ ] **Integração Transportadoras** - APIs externas

### Deployment
- [ ] **Nginx/Apache** - Configuração servidor
- [ ] **SSL Certificate** - HTTPS
- [ ] **Environment** - Staging/Production
- [ ] **CI/CD** - GitHub Actions
- [ ] **Backup** - Estratégia de backup
- [ ] **Monitoring** - Logs e métricas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para modernizar a gestão de correspondências em shoppings**
```