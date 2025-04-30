import { Outlet, useNavigate } from 'react-router'
import { useUser } from '@/hooks/use-user'
import { useEffect } from 'react'
import { useToken } from '@/store/use-token'

export default function ProtectedRoute() {
  const { data: user, isLoading } = useUser()
  const navigate = useNavigate()
  const token = useToken(state => state.accessToken)

  useEffect(() => {
    if (isLoading) return

    if (!user) navigate('/login')
  }, [token, isLoading, user, navigate])

  if (isLoading) return <div>Loading...</div>

  return <Outlet />
}
