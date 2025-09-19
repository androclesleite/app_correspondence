import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Bell, Search, Menu } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Search */}
        <div className="flex-1 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar encomendas, lojas..."
              className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User */}
          <div className="flex items-center gap-3 pl-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <div className="flex items-center gap-2 justify-end">
                <Badge variant="outline" className="text-xs">
                  {user?.role?.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}