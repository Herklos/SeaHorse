import React from 'react'
import { cn } from '../../utils/cn'

type MainProps = React.ComponentPropsWithoutRef<'main'> & { className?: string }

const Main = React.forwardRef<HTMLElement, MainProps>(
  ({ className, ...props }, ref) => (
    <main ref={ref} className={cn('flex flex-col min-h-0 min-w-0', className)} {...props} />
  ),
)

Main.displayName = 'Main'
export { Main }
