import * as React from "react"
import {
  Package,
  Home,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"
import { useActiveRoute } from "@/hooks/useActiveRoute"
import { usePermissions } from "@/hooks/usePermissions"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { isActive } = useActiveRoute()
  const { canCreatePackages, getRoleLabel, canManageUsers } = usePermissions()

  const data = {
    user: {
      name: user?.name || "Usuário",
      email: user?.email || "usuario@shopping.com",
      avatar: "/avatars/admin.jpg",
      role: getRoleLabel(user?.role),
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: isActive("/dashboard"),
        items: [
          {
            title: "Visão Geral",
            url: "/dashboard",
          },
        ],
      },
      {
        title: "Correspondências",
        url: "/correspondence",
        icon: Package,
        isActive: isActive("/correspondence"),
        items: [
          {
            title: "Lista de Correspondências",
            url: "/correspondence",
          },
          {
            title: "Nova Correspondência",
            url: "/correspondence/new",
          },
        ],
      },
      ...(canManageUsers() ? [{
        title: "Usuários",
        url: "/users",
        icon: Users,
        isActive: isActive("/users"),
        items: [
          {
            title: "Níveis de Acesso",
            url: "/users",
          },
        ],
      }] : []),
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Shopping Center</span>
            <span className="text-xs text-muted-foreground">Módulo Correspondência</span>
          </div>
        </div>
      </SidebarHeader> */}
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Package className="h-4 w-4" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Shopping Center</span>
            <span className="text-xs text-muted-foreground">Módulo Correspondência</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
