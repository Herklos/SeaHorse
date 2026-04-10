import React from 'react'
import { View, type ViewProps } from 'react-native'
import { cn } from '../../utils/cn'

type CenterProps = ViewProps & { className?: string }

const Center = React.forwardRef<React.ElementRef<typeof View>, CenterProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('justify-center items-center', className)}
      {...props}
    />
  ),
)

Center.displayName = 'Center'
export { Center }
