import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { formatDistanceToNow } from 'date-fns'
import { Bid } from '@/lib/types'
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

export default function FreelancerBids() {
  const { data: bids, isLoading } = useQuery({
    queryKey: ['freelancer-bids'],
    queryFn: async () => {
      const response = await authApi.get('/projects/bids/freelancer')
      return response.data
    }
  })

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400'
      case 'accepted':
        return 'bg-green-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading your proposals...</div>
  }

  if (!bids || bids.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-4">
          You haven't submitted any proposals yet
        </h2>
        <Link to="/projects">
          <Button>Browse Projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bids.map((bid: Bid) => (
          <Card key={bid.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge className={getBidStatusColor(bid.status)}>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </Badge>
                <span className="font-medium">${bid.amount}</span>
              </div>
              <CardTitle className="text-lg">{bid.project.title}</CardTitle>
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(bid.createdAt), {
                  addSuffix: true
                })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm mb-2">
                <span className="font-medium">Delivery Time:</span>{' '}
                {bid.deliveryDays} days
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {bid.proposal}
              </p>
            </CardContent>
            <CardFooter>
              <Link to={`/projects/${bid.projectId}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Project
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
