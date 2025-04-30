import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import authApi from '@/lib/auth-api'
import { onError } from '@/lib/utils'
import { Profile } from '@/lib/types'

export function useCreateProfileMutation(
  options?: UseMutationOptions<Profile, Error, FormData>
) {
  return useMutation({
    mutationFn: async (formData: FormData): Promise<Profile> => {
      const { data } = await authApi.post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return data
    },
    onError,
    ...options
  })
}
