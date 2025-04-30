import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import api from '@/lib/api'
import { onError } from '@/lib/utils'

const logout = async () => {
  const res = await api.post('/auth/logout')
  return res.data
}

export const useLogoutMutation = (
  options: UseMutationOptions<unknown, Error>
) =>
  useMutation({
    mutationFn: logout,
    onError,
    ...options
  })
