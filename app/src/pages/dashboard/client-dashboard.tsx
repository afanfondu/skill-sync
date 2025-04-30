import { useUser } from '@/hooks/use-user'
import { Link } from 'react-router'
import ClientProjects from './client-projects'

export default function ClientDashboard() {
  const { data: user } = useUser()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Client Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="My Projects"
          value="0"
          description="Active projects"
        />
        <DashboardCard
          title="Open Bids"
          value="0"
          description="Awaiting response"
        />
        <DashboardCard
          title="Messages"
          value="0"
          description="Unread messages"
        />
      </div>

      <ClientProjects />
    </div>
  )
}

function DashboardCard({ title, value, description }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <h3 className="font-medium">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  )
}
