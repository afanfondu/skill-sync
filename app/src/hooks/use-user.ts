import { useQuery } from '@tanstack/react-query'
import authApi from '@/lib/auth-api'
import { User } from '@/lib/types'

export const useUser = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await authApi.get('/users/current-user')
      return data
    },
    retry: false
  })
}
