import React from 'react'
import { Text as RNText } from 'react-native'
import { cn } from '../../utils/cn'

const sizeClasses: Record<string, string> = {
  '2xs': 'text-2xs',
  'xs': 'text-xs',
  'sm': 'text-sm',
  'md': 'text-base',
  'lg': 'text-lg',
  'xl': 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
}

type TextProps = React.ComponentProps<typeof RNText> & {
  className?: string
  size?: keyof typeof sizeClasses
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikeThrough?: boolean
  isTruncated?: boolean
  sub?: boolean
  highlight?: boolean
}

const Text = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
  (
    {
      className,
      size = 'md',
      bold,
      italic: isItalic,
      underline,
      strikeThrough,
      isTruncated,
      sub,
      highlight,
      ...props
    },
    ref,
  ) => (
    <RNText
      ref={ref}
      className={cn(
        'text-typography-700 font-body',
        sizeClasses[size],
        bold && 'font-bold',
        isItalic && 'italic',
        underline && 'underline',
        strikeThrough && 'line-through',
        isTruncated && 'web:truncate',
        sub && 'text-xs',
        highlight && 'bg-yellow-500',
        className,
      )}
      {...props}
    />
  ),
)

Text.displayName = 'Text'
export { Text }
