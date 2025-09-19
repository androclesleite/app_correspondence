# Sistema de Correspondências

Sistema completo de gestão de correspondências para shoppings, desenvolvido com Laravel 12 + React TypeScript.

## 🚀 Funcionalidades

### Principais
- **Cadastro de Encomendas**: Portaria registra encomendas recebidas
- **Gestão por Níveis**: Admin, Portaria e Loja com permissões específicas
- **Confirmação de Retirada**: Foto + Assinatura digital + CPF
- **Dashboard Analytics**: Métricas e estatísticas em tempo real
- **Rastreabilidade Completa**: Logs de todas as ações

### Por Tipo de Usuário

#### 👨‍💼 Admin
- Todos os acessos
- Exclusão de encomendas (soft delete)
- Visualização de todas as lojas

#### 🏢 Portaria
- Cadastro de encomendas
- Confirmação de retiradas
- Devolução ao remetente
- Visualização de todas as lojas

#### 🏪 Loja
- Visualização das próprias encomendas
- Confirmação de leitura de notificações

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

## 🚀 Instalação

### Opção 1: Docker (Recomendado)

```bash
# Clonar repositório
git clone <repository-url>
cd app_correspondence

# Subir containers
docker-compose up -d

# Aguardar containers iniciarem e acessar:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

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

## 👥 Usuários de Teste

Após executar o seeder, estarão disponíveis:

| Tipo | Email | Senha | Descrição |
|------|-------|-------|-----------|
| **Admin** | admin@contoso.com | password | Administrador geral |
| **Portaria** | portaria@contoso.com | password | Usuário da portaria |
| **Loja A** | loja.a@contoso.com | password | Lojista da Loja A |
| **Loja B** | loja.b@contoso.com | password | Lojista da Loja B |

## 📱 Como Usar

### 1. Acesso ao Sistema
- Acesse `http://localhost:5173`
- Faça login com um dos usuários de teste

### 2. Cadastrar Encomenda (Portaria/Admin)
- Vá em "Gerenciar Encomendas"
- Clique em "Cadastrar Nova Encomenda"
- Preencha: Loja, Código, Transportadora, Data, Tipo, etc.
- Salve a encomenda

### 3. Confirmar Retirada (Portaria/Admin)
- Na lista de encomendas, clique em "Confirmar Retirada"
- **Passo 1**: Digite nome e CPF do responsável
- **Passo 2**: Capture foto com webcam
- **Passo 3**: Colete assinatura digital
- Confirme a retirada

### 4. Visualizar Dashboard
- Dashboard mostra estatísticas
- Encomendas pendentes, retiradas, devolvidas
- Lista das encomendas mais recentes

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