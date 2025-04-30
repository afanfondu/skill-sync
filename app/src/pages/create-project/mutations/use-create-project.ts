import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import authApi from '@/lib/auth-api'
import { onError } from '@/lib/utils'
import { Project } from '@/lib/types'
import { ProjectFormValues } from '../create-project-form'

export function useCreateProjectMutation(
  options?: UseMutationOptions<
    Project,
    Error,
    Omit<ProjectFormValues, 'budget'> & { budget: number }
  >
) {
  return useMutation({
    mutationFn: async (
      data: Omit<ProjectFormValues, 'budget'> & { budget: number }
    ): Promise<Project> => {
      const res = await authApi.post('/projects', data)
      return res.data
    },
    onError,
    ...options
  })
}
