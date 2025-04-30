import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import api from '@/lib/api'
import { LoginSchema } from '../schemas'
import { onError } from '@/lib/utils'

type LoginResponse = {
  accessToken: string
}

const login = async (values: LoginSchema): Promise<LoginResponse> => {
  const res = await api.post('/auth/login', values)
  return res.data
}

export const useLoginMutation = (
  options: UseMutationOptions<LoginResponse, Error, LoginSchema>
) =>
  useMutation({
    mutationFn: login,
    onError,
    ...options
  })
