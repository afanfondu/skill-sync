import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import api from '@/lib/api'
import { RegisterSchema } from '../schemas'
import { onError } from '@/lib/utils'

type RegisterResponse = {
  accessToken: string
}

const register = async (values: RegisterSchema): Promise<RegisterResponse> => {
  const res = await api.post('/auth/register', values)
  return res.data
}

export const useRegisterMutation = (
  options: UseMutationOptions<RegisterResponse, Error, RegisterSchema>
) =>
  useMutation({
    mutationFn: register,
    onError,
    ...options
  })
