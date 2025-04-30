import { useUser } from '@/hooks/use-user'
import ClientDashboard from './client-dashboard'
import FreelancerDashboard from './freelance-dashboard'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function DashboardPage() {
  const { data: user, isLoading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.profile) navigate('/create-profile')
  }, [navigate, user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  return user?.role === 'client' ? <ClientDashboard /> : <FreelancerDashboard />
}
