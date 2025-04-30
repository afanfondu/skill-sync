import { useUser } from '@/hooks/use-user'
import { UserRole } from '@/lib/types'
import ClientProfileForm from './client-profile-form'
import FreelancerProfileForm from './freelance-profile-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function CreateProfilePage() {
  const { data: user, isLoading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.profile) navigate('/dashboard')
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Please provide additional information to complete your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.role === UserRole.Client ? (
          <ClientProfileForm user={user!} />
        ) : (
          <FreelancerProfileForm user={user!} />
        )}
      </CardContent>
    </Card>
  )
}
