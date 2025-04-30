import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@/lib/utils'

const Container = ({
  children,
  className,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>) => {
  return (
    <div {...props} className={cn(className, 'mx-auto max-w-7xl px-8 py-4')}>
      {children}
    </div>
  )
}

export default Container
