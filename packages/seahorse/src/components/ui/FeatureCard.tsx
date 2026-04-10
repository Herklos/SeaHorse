import React from 'react'
import { View, Text, Pressable } from 'react-native-css/components'

interface FeatureCardProps {
  /** Icon component (e.g. from lucide-react-native) */
  icon: React.ReactNode
  title: string
  description: string
  ctaLabel?: string
  onCtaPress?: () => void
  className?: string
}

export function FeatureCard({ icon, title, description, ctaLabel, onCtaPress, className }: FeatureCardProps) {
  return (
    <View className={`bg-background-0 rounded-2xl p-5 border border-outline-100 ${className ?? ''}`}>
      <View className="mb-3">{icon}</View>
      <Text className="text-base font-semibold text-typography-900 mb-1">{title}</Text>
      <Text className="text-sm text-typography-500 leading-5">{description}</Text>
      {ctaLabel != null && onCtaPress != null && (
        <Pressable
          onPress={onCtaPress}
          className="mt-4 self-start active:opacity-70"
        >
          <Text className="text-sm font-semibold text-primary-500">{ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  )
}
