import authApi from '@/lib/auth-api'
import { useQuery } from '@tanstack/react-query'

export const useClientProjects = () =>
  useQuery({
    queryKey: ['client-projects'],
    queryFn: async () => {
      const response = await authApi.get('/projects/client')
      return response.data
    }
  })
