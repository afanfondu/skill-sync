import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import LoadingButton from '@/components/shared/loading-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { LoginSchema, loginSchema } from './schemas'
import { Link, useNavigate } from 'react-router'
import { PasswordInput } from '@/components/ui/password-input'
import { useLoginMutation } from './mutations/use-login'
import { useToken } from '@/store/use-token'
import { useQueryClient } from '@tanstack/react-query'

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const navigate = useNavigate()
  const setToken = useToken(state => state.setToken)
  const queryClient = useQueryClient()

  const { mutate, isPending } = useLoginMutation({
    onSuccess: data => {
      setToken(data.accessToken)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      navigate('/dashboard')
    }
  })

  function onSubmit(values: LoginSchema) {
    mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link to="#" className="inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <LoadingButton isLoading={isPending} type="submit" className="w-full">
            Login
          </LoadingButton>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="underline">
            Register
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
