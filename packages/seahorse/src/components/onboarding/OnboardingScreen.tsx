import React from 'react'
import { View, Text } from 'react-native-css/components'
import { cn } from '../../utils/cn'

export interface OnboardingScreenProps {
  /** Content rendered in the illustration area — icon, image, or any ReactNode */
  illustration: React.ReactNode
  /** Main heading text */
  title: string
  /** Supporting description text */
  description: string
  className?: string
  illustrationClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function OnboardingScreen({
  illustration,
  title,
  description,
  className,
  illustrationClassName,
  titleClassName,
  descriptionClassName,
}: OnboardingScreenProps) {
  return (
    <View className={cn('flex-1 flex-col', className)}>
      <View
        className={cn(
          'flex-1 items-center justify-center px-8',
          illustrationClassName,
        )}
      >
        {illustration}
      </View>
      <View className="px-8 pb-4 gap-3">
        <Text
          className={cn(
            'text-3xl font-bold text-typography-900 text-center',
            titleClassName,
          )}
        >
          {title}
        </Text>
        <Text
          className={cn(
            'text-base text-typography-500 text-center leading-6',
            descriptionClassName,
          )}
        >
          {description}
        </Text>
      </View>
    </View>
  )
}

OnboardingScreen.displayName = 'OnboardingScreen'
