import React from 'react'
import { Image as RNImage, Platform } from 'react-native'
import { cn } from '../../utils/cn'

const sizeClasses: Record<string, string> = {
  '2xs': 'h-6 w-6',
  'xs': 'h-10 w-10',
  'sm': 'h-16 w-16',
  'md': 'h-20 w-20',
  'lg': 'h-24 w-24',
  'xl': 'h-32 w-32',
  '2xl': 'h-64 w-64',
  'full': 'h-full w-full',
  'none': '',
}

type ImageProps = React.ComponentProps<typeof RNImage> & {
  className?: string
  size?: keyof typeof sizeClasses
}

const Image = React.forwardRef<React.ElementRef<typeof RNImage>, ImageProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <RNImage
      ref={ref}
      className={cn('max-w-full', sizeClasses[size], className)}
      {...props}
      // @ts-expect-error web revert-layer
      style={
        Platform.OS === 'web'
          ? { height: 'revert-layer', width: 'revert-layer' }
          : undefined
      }
    />
  ),
)

Image.displayName = 'Image'
export { Image }
