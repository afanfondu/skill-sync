import authApi from '@/lib/auth-api'
import { Bid } from '@/lib/types'
import { useQueryClient, useMutation } from '@tanstack/react-query'

export async function updateBidStatus(
  bidId: string,
  status: 'accepted' | 'rejected' | 'pending'
): Promise<Bid> {
  const response = await authApi.patch(`/projects/bids/${bidId}`, { status })
  return response.data
}

export function useAcceptBidMutation(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bidId }: { bidId: string; status: 'accepted' }) =>
      updateBidStatus(bidId, 'accepted'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    }
  })
}
