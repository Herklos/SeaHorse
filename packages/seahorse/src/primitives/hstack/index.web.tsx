import React from 'react'
import { cn } from '../../utils/cn'

const spaceClasses: Record<string, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-5',
  '2xl': 'gap-6',
  '3xl': 'gap-7',
  '4xl': 'gap-8',
}

type HStackProps = React.ComponentPropsWithoutRef<'div'> & {
  className?: string
  space?: keyof typeof spaceClasses
  reversed?: boolean
}

const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ className, space, reversed, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        reversed ? 'flex flex-row-reverse min-h-0 min-w-0' : 'flex flex-row min-h-0 min-w-0',
        space && spaceClasses[space],
        className,
      )}
      {...props}
    />
  ),
)

HStack.displayName = 'HStack'
export { HStack }
