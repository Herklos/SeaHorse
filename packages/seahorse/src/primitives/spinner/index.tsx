import React from 'react'
import { ActivityIndicator } from 'react-native'
import { styled as cssInterop } from 'react-native-css'
import { cn } from '../../utils/cn'

cssInterop(ActivityIndicator, {
  className: { target: 'style', nativeStyleToProp: { color: true } } as any,
})

const Spinner = React.forwardRef<
  React.ElementRef<typeof ActivityIndicator>,
  React.ComponentProps<typeof ActivityIndicator>
>(
  (
    {
      className,
      color,
      focusable = false,
      'aria-label': ariaLabel = 'loading',
      ...props
    },
    ref,
  ) => (
    <ActivityIndicator
      ref={ref}
      focusable={focusable}
      aria-label={ariaLabel}
      color={color}
      className={cn(className)}
      {...props}
    />
  ),
)

Spinner.displayName = 'Spinner'
export { Spinner }
