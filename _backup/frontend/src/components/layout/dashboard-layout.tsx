import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: React.ReactNode
  breadcrumb?: {
    items: Array<{
      title: string
      href?: string
    }>
  }
}

export function DashboardLayout({ children, breadcrumb }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4"
            />
            {breadcrumb && (
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumb.items.map((item, index) => (
                    <div key={item.title} className="flex items-center gap-2">
                      {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                      <BreadcrumbItem className="hidden md:block">
                        {item.href ? (
                          <BreadcrumbLink href={item.href}>
                            {item.title}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}