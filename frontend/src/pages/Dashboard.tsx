import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardIndex } from './dashboard/index'

export default function Dashboard() {
  return (
    <DashboardLayout
      breadcrumb={{
        items: [
          { title: 'Shopping Center', href: '/' },
          { title: 'Dashboard' }
        ]
      }}
    >
      <DashboardIndex />
    </DashboardLayout>
  )
}