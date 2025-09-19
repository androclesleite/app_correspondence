"use client"

import * as React from "react"
import {
  Package,
  BarChart3,
  Settings,
  Home,
  FileText,
  Clock,
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

const data = {
  user: {
    name: "Admin",
    email: "admin@correspondence.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Visão Geral",
          url: "/dashboard/overview",
        },
        {
          title: "Estatísticas",
          url: "/dashboard/stats",
        },
      ],
    },
    {
      title: "Correspondências",
      url: "/correspondence",
      icon: Package,
      items: [
        {
          title: "Nova Correspondência",
          url: "/correspondence/new",
        },
        {
          title: "Lista de Pacotes",
          url: "/correspondence/packages",
        },
        {
          title: "Histórico",
          url: "/correspondence/history",
        },
        {
          title: "Arquivados",
          url: "/correspondence/archived",
        },
      ],
    },
    {
      title: "Coletas",
      url: "/collections",
      icon: Clock,
      items: [
        {
          title: "Agendadas",
          url: "/collections/scheduled",
        },
        {
          title: "Em Andamento",
          url: "/collections/in-progress",
        },
        {
          title: "Concluídas",
          url: "/collections/completed",
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/reports",
      icon: BarChart3,
      items: [
        {
          title: "Resumo Mensal",
          url: "/reports/monthly",
        },
        {
          title: "Por Destinatário",
          url: "/reports/recipients",
        },
        {
          title: "Por Status",
          url: "/reports/status",
        },
      ],
    },
    {
      title: "Configurações",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "Geral",
          url: "/settings/general",
        },
        {
          title: "Usuários",
          url: "/settings/users",
        },
        {
          title: "Sistema",
          url: "/settings/system",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Correspondência</span>
            <span className="text-xs text-muted-foreground">Sistema de Gestão</span>
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