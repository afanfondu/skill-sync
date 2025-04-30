import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@/lib/types'
import { useNavigate } from 'react-router'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useCreateProfileMutation } from './mutations/use-create-profile'
import LoadingButton from '@/components/shared/loading-button'

const freelancerProfileSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  title: z.string().min(3, 'Professional title is required'),
  hourlyRate: z.string().regex(/^\d+$/, 'Must be a number')
})

type FreelancerProfileFormValues = z.infer<typeof freelancerProfileSchema>

const AVAILABLE_SKILLS = [
  'JavaScript',
  'React',
  'Angular',
  'Vue',
  'Node.js',
  'Python',
  'Django',
  'Java',
  'Spring Boot',
  'PHP',
  'Laravel',
  '.NET',
  'C#',
  'TypeScript',
  'GraphQL',
  'SQL',
  'MongoDB',
  'Redis',
  'Docker',
  'AWS',
  'Azure',
  'GCP',
  'UI/UX Design',
  'HTML/CSS',
  'Mobile Development'
]

export default function FreelancerProfileForm({ user }: { user: User }) {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profilePicture
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const { mutate, isPending } = useCreateProfileMutation()

  const form = useForm<FreelancerProfileFormValues>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: {
      bio: user.bio || '',
      title: '',
      hourlyRate: ''
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
    }
    setSkillInput('')
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const filteredSkills = AVAILABLE_SKILLS.filter(
    skill =>
      !skills.includes(skill) &&
      skill.toLowerCase().includes(skillInput.toLowerCase())
  )

  const onSubmit = (values: FreelancerProfileFormValues) => {
    const formData = new FormData()
    formData.append('userId', user.id)
    formData.append('role', user.role)
    formData.append('bio', values.bio)
    formData.append('title', values.title)
    formData.append('hourlyRate', values.hourlyRate)
    formData.append('skills', JSON.stringify(skills))
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Title</FormLabel>
              <FormControl>
                <Input placeholder="Full Stack Developer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell clients about your experience and skills..."
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
          name="hourlyRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate ($)</FormLabel>
              <FormControl>
                <Input placeholder="25" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Skills</FormLabel>
          <div className="flex flex-wrap gap-2 mb-2">
            {skills.map(skill => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 flex items-center"
              >
                <span>{skill}</span>
                <div
                  className="ml-1 p-1 rounded-full hover:bg-muted inline-flex items-center justify-center"
                  onClick={() => {
                    removeSkill(skill)
                  }}
                >
                  <X className="h-3 w-3 cursor-pointer" />
                </div>
              </Badge>
            ))}
          </div>

          <div className="relative">
            <Input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              placeholder="Type or select skills"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill(skillInput)
                }
              }}
            />
            {skillInput && (
              <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredSkills.length > 0 ? (
                  filteredSkills.map(skill => (
                    <div
                      key={skill}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-muted-foreground">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <LoadingButton
          loadingText="Saving..."
          type="submit"
          isLoading={isPending}
          className="w-full"
        >
          Complete Profile
        </LoadingButton>
      </form>
    </Form>
  )
}
