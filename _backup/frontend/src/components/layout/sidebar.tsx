import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  Package,
  Home,
  FileText,
  HandCoins,
  Users,
  Settings,
  LogOut,
  Building2
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useLocation, useNavigate } from "react-router-dom"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: location.pathname === "/dashboard",
    },
    {
      name: "Correspondências",
      href: "/correspondence",
      icon: Package,
      current: location.pathname.startsWith("/correspondence"),
      badge: "Ativo",
    },
    {
      name: "Documentos",
      href: "/documents",
      icon: FileText,
      current: location.pathname.startsWith("/documents"),
      badge: "Em breve",
      disabled: true,
    },
    {
      name: "Empréstimos",
      href: "/loans",
      icon: HandCoins,
      current: location.pathname.startsWith("/loans"),
      badge: "Em breve",
      disabled: true,
    },
    {
      name: "Funcionários",
      href: "/employees",
      icon: Users,
      current: location.pathname.startsWith("/employees"),
      badge: "Em breve",
      disabled: true,
    },
  ]

  const handleNavigation = (href: string, disabled?: boolean) => {
    if (!disabled) {
      navigate(href)
    }
  }

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* Header */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Correspondências
              </h2>
              <p className="text-xs text-muted-foreground">
                Sistema de Gestão
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Módulos
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={item.current ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handleNavigation(item.href, item.disabled)}
                disabled={item.disabled}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
                {item.badge && (
                  <Badge
                    variant={item.disabled ? "outline" : "default"}
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            <div className="px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-primary font-semibold text-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {user?.role?.toUpperCase()}
                    </Badge>
                    {user?.store && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="w-3 h-3" />
                        {user.store.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/settings")}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}