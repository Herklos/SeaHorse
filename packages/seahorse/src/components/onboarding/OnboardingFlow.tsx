'use client'
import React, { useRef, useState } from 'react'
import { ScrollView, useWindowDimensions } from 'react-native'
import { View } from 'react-native-css/components'
import { Button, ButtonText } from '../../primitives'
import { cn } from '../../utils/cn'
import { OnboardingDots } from './OnboardingDots'

export interface OnboardingFlowProps {
  /** Called when user taps the complete button on the last screen */
  onComplete: () => void
  /** Called when user taps the skip button. If omitted, skip button is hidden */
  onSkip?: () => void
  /** Label for the "Next" button. Default: "Next" */
  nextButtonText?: string
  /** Label for the final button. Default: "Get Started" */
  completeButtonText?: string
  /** Label for the skip button. Default: "Skip" */
  skipButtonText?: string
  /** OnboardingScreen children */
  children: React.ReactNode
  className?: string
}

export function OnboardingFlow({
  onComplete,
  onSkip,
  nextButtonText = 'Next',
  completeButtonText = 'Get Started',
  skipButtonText = 'Skip',
  children,
  className,
}: OnboardingFlowProps) {
  const { width } = useWindowDimensions()
  const scrollRef = useRef<ScrollView>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const screens = React.Children.toArray(children)
  const count = screens.length
  const isLast = activeIndex === count - 1

  const handleNext = () => {
    if (isLast) {
      onComplete()
      return
    }
    const nextIndex = activeIndex + 1
    scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true })
    setActiveIndex(nextIndex)
  }

  return (
    <View className={cn('flex-1 bg-background-0', className)}>
      {/* Scrollable pages */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width)
          setActiveIndex(index)
        }}
        className="flex-1"
      >
        {screens.map((screen, i) => (
          <View key={i} style={{ width }} className="flex-1">
            {screen}
          </View>
        ))}
      </ScrollView>

      {/* Bottom navigation area */}
      <View className="pb-10 pt-4 px-6 gap-6">
        <OnboardingDots count={count} activeIndex={activeIndex} className="py-1" />
        <View className="flex-row items-center justify-between">
          {onSkip && !isLast ? (
            <Button variant="ghost" size="md" onPress={onSkip} action="default">
              <ButtonText className="text-typography-400">{skipButtonText}</ButtonText>
            </Button>
          ) : (
            <View className="w-20" />
          )}
          <Button
            variant="solid"
            size="md"
            onPress={handleNext}
            action="primary"
            className="min-w-[120px]"
          >
            <ButtonText>{isLast ? completeButtonText : nextButtonText}</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  )
}

OnboardingFlow.displayName = 'OnboardingFlow'
