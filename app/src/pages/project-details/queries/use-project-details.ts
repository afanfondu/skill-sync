import authApi from '@/lib/auth-api'
import { Project } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'

export async function getProjectById(id: string): Promise<Project> {
  const response = await authApi.get(`/projects/${id}`)
  return response.data
}

export function useProjectDetails(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectById(projectId!),
    enabled: !!projectId
  })
}
