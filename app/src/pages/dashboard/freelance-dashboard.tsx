import { useUser } from '@/hooks/use-user'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ProjectList from './project-list'
import FreelancerBids from './freelancer-bids'

export default function FreelancerDashboard() {
  const { data: user } = useUser()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Freelancer Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Active Projects"
          value="0"
          description="Projects in progress"
        />
        <DashboardCard title="My Bids" value="0" description="Open proposals" />
        <DashboardCard title="Earnings" value="$0" description="This month" />
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList>
          <TabsTrigger value="projects">Available Projects</TabsTrigger>
          <TabsTrigger value="proposals">My Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <ProjectList />
        </TabsContent>

        <TabsContent value="proposals">
          <FreelancerBids />
        </TabsContent>
      </Tabs>
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
