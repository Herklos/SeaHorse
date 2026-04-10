import React from 'react'
import { Pressable } from 'react-native-css/components'
import { Linking } from 'react-native'
import type { PressableProps } from 'react-native'

type AnchorProps = PressableProps & {
  href?: string
  className?: string
  children?: React.ReactNode
}

const Anchor = React.forwardRef<React.ElementRef<typeof Pressable>, AnchorProps>(
  ({ href, onPress, className, ...props }, ref) => (
    <Pressable
      ref={ref}
      className={className}
      onPress={(e) => {
        if (href) Linking.openURL(href)
        onPress?.(e)
      }}
      {...props}
    />
  ),
)

Anchor.displayName = 'Anchor'
export { Anchor }
