import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardOverview } from '@/pages/dashboard/overview'

export default function Dashboard() {
  return (
    <DashboardLayout
      breadcrumb={{
        items: [
          { title: 'Sistema de Correspondências', href: '/' },
          { title: 'Dashboard' }
        ]
      }}
    >
      <DashboardOverview />
    </DashboardLayout>
  )
}