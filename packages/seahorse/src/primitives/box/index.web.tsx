import React from 'react'
import { cn } from '../../utils/cn'

type BoxProps = React.ComponentPropsWithoutRef<'div'> & { className?: string }

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col min-h-0 min-w-0', className)} {...props} />
  ),
)

Box.displayName = 'Box'
export { Box }
