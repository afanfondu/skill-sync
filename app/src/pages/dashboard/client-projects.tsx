import { Link } from 'react-router'
import { formatDistanceToNow } from 'date-fns'
import { Project } from '@/lib/types'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClientProjects } from './queries/use-client-projects'

export default function ClientProjects() {
  const { data: projects, isLoading } = useClientProjects()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-gray-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading your projects...</div>
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-4">
          You haven't created any projects yet
        </h2>
        <Link to="/create-project">
          <Button>Create Your First Project</Button>
        </Link>
      </div>
    )
  }

  const openProjects = projects.filter((p: Project) => p.status === 'open')
  const inProgressProjects = projects.filter(
    (p: Project) => p.status === 'in_progress'
  )
  const completedProjects = projects.filter(
    (p: Project) => p.status === 'completed'
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Link to="/create-project">
          <Button>Create New Project</Button>
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All Projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="open">Open ({openProjects.length})</TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ProjectGrid projects={projects} getStatusColor={getStatusColor} />
        </TabsContent>

        <TabsContent value="open" className="mt-6">
          <ProjectGrid
            projects={openProjects}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <ProjectGrid
            projects={inProgressProjects}
            getStatusColor={getStatusColor}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <ProjectGrid
            projects={completedProjects}
            getStatusColor={getStatusColor}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProjectGridProps {
  projects: Project[]
  getStatusColor: (status: string) => string
}

function ProjectGrid({ projects, getStatusColor }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: Project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <Badge className={getStatusColor(project.status)}>
                {project.status.replace('_', ' ')}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(project.createdAt), {
                  addSuffix: true
                })}
              </span>
            </div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">
                Budget: ${project.budget}
              </div>
              <div className="text-sm text-gray-500">
                {project.bids?.length || 0} bids
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 line-clamp-3">{project.description}</p>

            {project.freelancer && (
              <div className="mt-4 p-2 rounded-md">
                <div className="text-sm font-medium">Assigned to:</div>
                <div>{project.freelancer.name}</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <Link to={`/projects/${project.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
