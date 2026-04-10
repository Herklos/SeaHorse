import React from 'react'
import { View } from 'react-native-css/components'
import { cn } from '../../utils/cn'

export interface OnboardingDotsProps {
  count: number
  activeIndex: number
  /** NativeWind class for the active dot. Default: "bg-primary-500" */
  activeClassName?: string
  /** NativeWind class for inactive dots. Default: "bg-outline-200" */
  inactiveClassName?: string
  className?: string
}

export function OnboardingDots({
  count,
  activeIndex,
  activeClassName,
  inactiveClassName,
  className,
}: OnboardingDotsProps) {
  return (
    <View className={cn('flex-row items-center justify-center gap-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          className={cn(
            'h-2 rounded-full',
            i === activeIndex
              ? cn('w-8', activeClassName ?? 'bg-primary-500')
              : cn('w-2', inactiveClassName ?? 'bg-outline-200'),
          )}
        />
      ))}
    </View>
  )
}

OnboardingDots.displayName = 'OnboardingDots'
