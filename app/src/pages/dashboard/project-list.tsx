import { useQuery } from '@tanstack/react-query'
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
import authApi from '@/lib/auth-api'

export default function ProjectList() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await authApi.get('/projects')
      return response.data
    }
  })

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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">Available Projects</h1>
        <div className="text-sm text-gray-500">
          {projects?.length} projects found
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading projects...</div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-8">
          No projects found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project: Project) => (
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
                <div className="text-sm text-gray-500">
                  Posted by {project.client.name}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium">Budget</div>
                    <div className="font-semibold">${project.budget}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Category</div>
                    <div>{project.category}</div>
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  {project.description}
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/projects/${project.id}`} className="w-full">
                  <Button
                    variant={project.status === 'open' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {project.status === 'open'
                      ? 'Submit Proposal'
                      : 'View Details'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
