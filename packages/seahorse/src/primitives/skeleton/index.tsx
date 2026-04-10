import React, { forwardRef } from 'react'
import { Animated, Easing, Platform, View } from 'react-native'
import { cn } from '../../utils/cn'

const variantClasses: Record<string, string> = {
  sharp: 'rounded-none',
  circular: 'rounded-full',
  rounded: 'rounded-md',
}

type SkeletonProps = React.ComponentProps<typeof View> & {
  className?: string
  variant?: keyof typeof variantClasses
  isLoaded?: boolean
  startColor?: string
  speed?: 1 | 2 | 3 | 4
}

type SkeletonTextProps = React.ComponentProps<typeof View> & {
  className?: string
  _lines?: number
  isLoaded?: boolean
  startColor?: string
  gap?: 1 | 2 | 3 | 4
}

const gapClasses: Record<number, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
}

const Skeleton = forwardRef<any, SkeletonProps>(
  (
    {
      className,
      variant = 'rounded',
      children,
      startColor = 'bg-background-200',
      isLoaded = false,
      speed = 2,
      ...props
    },
    ref,
  ) => {
    const pulseAnim = new Animated.Value(1)
    const customTimingFunction = Easing.bezier(0.4, 0, 0.6, 1)
    const fadeDuration = 0.6
    const animationDuration = (fadeDuration * 10000) / speed

    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: animationDuration / 2,
        easing: customTimingFunction,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.75,
        duration: animationDuration / 2,
        easing: customTimingFunction,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: animationDuration / 2,
        easing: customTimingFunction,
        useNativeDriver: Platform.OS !== 'web',
      }),
    ])

    if (!isLoaded) {
      Animated.loop(pulse).start()
      return (
        <Animated.View
          style={{ opacity: pulseAnim }}
          className={cn('w-full h-full', startColor, variantClasses[variant], className)}
          {...props}
          ref={ref}
        />
      )
    }

    Animated.loop(pulse).stop()
    return children
  },
)

const SkeletonText = forwardRef<React.ElementRef<typeof View>, SkeletonTextProps>(
  (
    {
      className,
      _lines,
      isLoaded = false,
      startColor = 'bg-background-200',
      gap = 2,
      children,
      ...props
    },
    ref,
  ) => {
    if (!isLoaded) {
      if (_lines) {
        return (
          <View className={cn('flex flex-col', gapClasses[gap])} ref={ref}>
            {Array.from({ length: _lines }).map((_, index) => (
              <Skeleton
                key={index}
                className={cn('rounded-sm w-full', startColor, className)}
                {...props}
              />
            ))}
          </View>
        )
      }
      return (
        <Skeleton
          className={cn('rounded-sm w-full', startColor, className)}
          {...props}
          ref={ref}
        />
      )
    }
    return children
  },
)

Skeleton.displayName = 'Skeleton'
SkeletonText.displayName = 'SkeletonText'

export { Skeleton, SkeletonText }
