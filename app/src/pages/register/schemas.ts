import { UserRole } from '@/lib/types'
import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Required'),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    role: z.nativeEnum(UserRole)
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

export type RegisterSchema = z.infer<typeof registerSchema>
