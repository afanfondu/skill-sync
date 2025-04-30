import authApi from '@/lib/auth-api'
import { Project } from '@/lib/types'
import { useQueryClient, useMutation } from '@tanstack/react-query'

export async function updateProject(
  projectId: string,
  data: {
    title?: string
    description?: string
    budget?: number
    category?: string
    deadline?: string
    status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
  }
): Promise<Project> {
  const response = await authApi.patch(`/projects/${projectId}`, data)
  return response.data
}

export function useCompleteProjectMutation(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => updateProject(projectId, { status: 'completed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
    }
  })
}
