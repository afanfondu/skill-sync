import authApi from '@/lib/auth-api'
import { Bid } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'

export async function createBid(bidData: {
  projectId: string
  amount: number
  deliveryDays: number
  proposal: string
}): Promise<Bid> {
  const response = await authApi.post('/projects/bids', bidData)
  return response.data
}

export function useCreateBidMutation(projectId: string, options = {}) {
  return useMutation({
    mutationFn: createBid,
    ...options
  })
}
