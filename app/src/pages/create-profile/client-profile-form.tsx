import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@/lib/types'
import { useNavigate } from 'react-router'
import { useCreateProfileMutation } from './mutations/use-create-profile'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const clientProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  company: z.string().optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal(''))
})

type ClientProfileFormValues = z.infer<typeof clientProfileSchema>

export default function ClientProfileForm({ user }: { user: User }) {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profilePicture
  )
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { mutate, isPending } = useCreateProfileMutation()

  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      bio: user.bio || '',
      company: '',
      website: ''
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = (values: ClientProfileFormValues) => {
    const formData = new FormData()
    formData.append('bio', values.bio)
    formData.append('userId', user.id)
    formData.append('role', user.role)
    if (values.company) formData.append('company', values.company)
    if (values.website) formData.append('website', values.website)
    if (imageFile) formData.append('profilePicture', imageFile)

    mutate(formData, {
      onSuccess: () => {
        navigate('/dashboard')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Avatar className="w-24 h-24">
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt={user.name} />
            ) : (
              <AvatarFallback className="text-xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <Input
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            className="max-w-xs"
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself or your company..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://yourwebsite.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Saving...' : 'Complete Profile'}
        </Button>
      </form>
    </Form>
  )
}
