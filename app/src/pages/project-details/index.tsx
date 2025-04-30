import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useUser } from '@/hooks/use-user'
import { useProjectDetails } from './queries/use-project-details'
import { useCreateBidMutation } from './mutations/use-create-bid'
import { useAcceptBidMutation } from './mutations/use-accept-bid'
import { useCompleteProjectMutation } from './mutations/use-complete-project'
import { useQueryClient } from '@tanstack/react-query'

const bidSchema = z.object({
  amount: z
    .string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Amount must be a positive number'
    }),
  deliveryDays: z
    .string()
    .refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: 'Delivery time must be a positive number'
    }),
  proposal: z
    .string()
    .min(20, { message: 'Proposal must be at least 20 characters' })
    .max(1000, { message: 'Proposal must be at most 1000 characters' })
})

type BidFormValues = z.infer<typeof bidSchema>

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: user } = useUser()
  const navigate = useNavigate()
  const [bidDialogOpen, setBidDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  const { data: project, isLoading } = useProjectDetails(id)

  const bidForm = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      amount: '',
      deliveryDays: '',
      proposal: ''
    }
  })

  const createBidMutation = useCreateBidMutation(id!, {
    onSuccess: () => {
      setBidDialogOpen(false)
      bidForm.reset()
      queryClient.invalidateQueries({ queryKey: ['project', id] })
    }
  })

  const acceptBidMutation = useAcceptBidMutation(id!)
  const completeProjectMutation = useCompleteProjectMutation(id!)

  const onSubmitBid = (values: BidFormValues) => {
    if (!id) return

    createBidMutation.mutate({
      projectId: id,
      amount: parseFloat(values.amount),
      deliveryDays: parseInt(values.deliveryDays),
      proposal: values.proposal
    })
  }

  const handleAcceptBid = (bidId: string) => {
    acceptBidMutation.mutate({ bidId, status: 'accepted' })
  }

  const handleCompleteProject = () => {
    completeProjectMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        Loading project details...
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button onClick={() => navigate('/dashboard')}>Back to Projects</Button>
      </div>
    )
  }

  const isFreelancer = user?.role === 'freelancer'
  const isProjectOwner = user?.id === project.clientId
  const isAssignedFreelancer = user?.id === project.freelancerId
  const hasPlacedBid = project.bids?.some(bid => bid.freelancerId === user?.id)

  const canBid = isFreelancer && project.status === 'open' && !hasPlacedBid

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <Badge
              className={`mb-2 ${
                project.status === 'open'
                  ? 'bg-green-500'
                  : project.status === 'in_progress'
                    ? 'bg-blue-500'
                    : project.status === 'completed'
                      ? 'bg-gray-500'
                      : 'bg-red-500'
              }`}
            >
              {project.status.replace('_', ' ')}
            </Badge>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-gray-500">
              Posted by {project.client.name} on{' '}
              {format(new Date(project.createdAt), 'MMM d, yyyy')}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xl font-bold">${project.budget}</div>
            <div className="text-gray-500">Budget</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="whitespace-pre-line">{project.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p>{project.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Deadline</h3>
                  <p>{format(new Date(project.deadline), 'MMM d, yyyy')}</p>
                </div>
              </div>

              {project.freelancer && (
                <div>
                  <h3 className="font-semibold">Assigned To</h3>
                  <p>{project.freelancer.name}</p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {canBid && (
                  <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Submit a Proposal</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Submit Your Proposal</DialogTitle>
                      </DialogHeader>

                      <Form {...bidForm}>
                        <form
                          onSubmit={bidForm.handleSubmit(onSubmitBid)}
                          className="space-y-4"
                        >
                          <FormField
                            control={bidForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bid Amount ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={bidForm.control}
                            name="deliveryDays"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Delivery Time (days)</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={bidForm.control}
                            name="proposal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cover Letter</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Explain why you're a good fit for this project..."
                                    className="min-h-[150px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setBidDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={createBidMutation.isPending}
                            >
                              {createBidMutation.isPending
                                ? 'Submitting...'
                                : 'Submit Proposal'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                )}

                {isProjectOwner && project.status === 'in_progress' && (
                  <Button onClick={handleCompleteProject}>
                    Mark Project as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {(isProjectOwner || isAssignedFreelancer) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {project.status === 'open'
                    ? 'Freelancer Proposals'
                    : 'Assigned Freelancer'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.bids && project.bids.length > 0 ? (
                  <div className="space-y-4">
                    {project.status === 'open' ? (
                      project.bids.map(bid => (
                        <div key={bid.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold">
                              {bid.freelancer.name}
                            </div>
                            <div className="font-bold">${bid.amount}</div>
                          </div>
                          <div className="text-sm mb-2">
                            Delivery: {bid.deliveryDays} days
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {bid.proposal}
                          </p>

                          {isProjectOwner && project.status === 'open' && (
                            <Button
                              size="sm"
                              onClick={() => handleAcceptBid(bid.id)}
                              disabled={acceptBidMutation.isPending}
                            >
                              Accept Proposal
                            </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="border rounded-lg p-4">
                        <div className="font-semibold">
                          {project.freelancer?.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          {
                            project.bids.find(
                              bid => bid.freelancerId === project.freelancerId
                            )?.proposal
                          }
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>No proposals yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {isFreelancer && hasPlacedBid && (
            <Card>
              <CardHeader>
                <CardTitle>Your Proposal Status</CardTitle>
              </CardHeader>
              <CardContent>
                {project.bids
                  ?.filter(bid => bid.freelancerId === user?.id)
                  .map(bid => (
                    <div key={bid.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge
                          className={
                            bid.status === 'accepted'
                              ? 'bg-green-500'
                              : bid.status === 'rejected'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                          }
                        >
                          {bid.status}
                        </Badge>
                        <div className="font-bold">${bid.amount}</div>
                      </div>
                      <div className="text-sm mb-2">
                        Delivery: {bid.deliveryDays} days
                      </div>
                      <p className="text-sm text-gray-600">{bid.proposal}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
