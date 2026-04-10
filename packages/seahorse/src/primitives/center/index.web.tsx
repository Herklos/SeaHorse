import React from 'react'
import { cn } from '../../utils/cn'

type CenterProps = React.ComponentPropsWithoutRef<'div'> & { className?: string }

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex justify-center items-center', className)}
      {...props}
    />
  ),
)

Center.displayName = 'Center'
export { Center }
