import { Loader2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function LoadingButton({
  children,
  isLoading = false,
  loadingText,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  isLoading?: boolean
  loadingText?: string
}) {
  return (
    <Button
      disabled={isLoading}
      {...props}
      className={cn('flex justify-center gap-2 px-3', className)}
    >
      {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
      {loadingText === 'none' && isLoading
        ? ''
        : loadingText && isLoading
          ? loadingText
          : children}
    </Button>
  )
}
