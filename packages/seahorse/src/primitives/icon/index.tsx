import React, { useMemo } from 'react'
import { Platform } from 'react-native'
import { styled } from 'react-native-css'
import { cn } from '../../utils/cn'

const sizeMap: Record<string, number> = {
  '2xs': 12,
  'xs': 14,
  'sm': 16,
  'md': 18,
  'lg': 20,
  'xl': 24,
}

const sizeClasses: Record<string, string> = {
  '2xs': 'h-3 w-3',
  'xs': 'h-3.5 w-3.5',
  'sm': 'h-4 w-4',
  'md': 'h-[18px] w-[18px]',
  'lg': 'h-5 w-5',
  'xl': 'h-6 w-6',
}

type IconProps = {
  as?: React.ElementType
  size?: keyof typeof sizeClasses | number
  className?: string
  color?: string
  [key: string]: any
}

const Icon = React.forwardRef<unknown, IconProps>(
  ({ as: IconComponent, size = 'md', className, color, ...props }, ref) => {
    const numericSize = typeof size === 'number' ? size : sizeMap[size as string] ?? 18
    const sizeClass = typeof size === 'string' ? sizeClasses[size] : undefined

    // On native, NativeWind text-* classes don't propagate to SVG `color` prop.
    // Use styled() with nativeStyleToProp to bridge CSS color → Lucide color prop.
    const NativeAwareIcon = useMemo(() => {
      if (!IconComponent) return null
      if (Platform.OS === 'web') return IconComponent as React.ComponentType<any>
      return styled(IconComponent as React.ComponentType<any>, {
        className: { target: false, nativeStyleToProp: { color: 'color' } },
      })
    }, [IconComponent])

    if (!NativeAwareIcon) return null

    return (
      <NativeAwareIcon
        ref={ref}
        size={numericSize}
        color={color}
        className={cn(
          'text-typography-950 fill-none pointer-events-none',
          sizeClass,
          className,
        )}
        {...props}
      />
    )
  },
)

Icon.displayName = 'Icon'
export { Icon }
