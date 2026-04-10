import React from 'react'
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

type TextProps = React.ComponentPropsWithoutRef<'span'> & {
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

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
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
    <span
      ref={ref}
      className={cn(
        'text-typography-700 font-body font-sans tracking-sm',
        sizeClasses[size],
        bold && 'font-bold',
        isItalic && 'italic',
        underline && 'underline',
        strikeThrough && 'line-through',
        isTruncated && 'truncate',
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
