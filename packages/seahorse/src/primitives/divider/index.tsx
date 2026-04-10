import React from 'react'
import { Platform, View } from 'react-native'
import { cn } from '../../utils/cn'

type DividerProps = React.ComponentPropsWithoutRef<typeof View> & {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

const Divider = React.forwardRef<React.ElementRef<typeof View>, DividerProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <View
      ref={ref}
      aria-orientation={orientation}
      role={Platform.OS === 'web' ? 'separator' : undefined}
      className={cn(
        'bg-background-200',
        orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full',
        className,
      )}
      {...props}
    />
  ),
)

Divider.displayName = 'Divider'
export { Divider }
