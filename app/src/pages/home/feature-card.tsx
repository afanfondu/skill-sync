import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  features: string[]
  icon: React.ReactNode
}

export function FeatureCard({
  title,
  description,
  features,
  icon
}: FeatureCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            {icon}
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
