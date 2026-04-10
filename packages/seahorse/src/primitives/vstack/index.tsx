import React from 'react'
import { View, type ViewProps } from 'react-native'
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

type VStackProps = ViewProps & {
  className?: string
  space?: keyof typeof spaceClasses
  reversed?: boolean
}

const VStack = React.forwardRef<React.ElementRef<typeof View>, VStackProps>(
  ({ className, space, reversed, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        reversed ? 'flex flex-col-reverse' : 'flex flex-col',
        space && spaceClasses[space],
        className,
      )}
      {...props}
    />
  ),
)

VStack.displayName = 'VStack'
export { VStack }
