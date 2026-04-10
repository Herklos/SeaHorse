import React, { forwardRef, memo } from 'react'
import { cn } from '../../utils/cn'

const sizeClasses: Record<string, string> = {
  '5xl': 'text-6xl',
  '4xl': 'text-5xl',
  '3xl': 'text-4xl',
  '2xl': 'text-3xl',
  'xl': 'text-2xl',
  'lg': 'text-xl',
  'md': 'text-lg',
  'sm': 'text-base',
  'xs': 'text-sm',
}

type HeadingProps = React.ComponentPropsWithoutRef<'h1'> & {
  className?: string
  size?: keyof typeof sizeClasses
  as?: React.ElementType
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikeThrough?: boolean
  isTruncated?: boolean
  sub?: boolean
  highlight?: boolean
}

function buildClassName(props: HeadingProps, className?: string) {
  return cn(
    'text-typography-900 font-bold font-heading tracking-sm my-0',
    sizeClasses[props.size || 'lg'],
    props.bold && 'font-bold',
    props.italic && 'italic',
    props.underline && 'underline',
    props.strikeThrough && 'line-through',
    props.isTruncated && 'truncate',
    props.sub && 'text-xs',
    props.highlight && 'bg-yellow-500',
    className,
  )
}

const sizeToTag: Record<string, keyof React.JSX.IntrinsicElements> = {
  '5xl': 'h1',
  '4xl': 'h1',
  '3xl': 'h1',
  '2xl': 'h2',
  'xl': 'h3',
  'lg': 'h4',
  'md': 'h5',
  'sm': 'h6',
  'xs': 'h6',
}

const Heading = memo(
  forwardRef<HTMLHeadingElement, HeadingProps>(
    (
      {
        className,
        size = 'lg',
        as: AsComp,
        bold,
        italic,
        underline,
        strikeThrough,
        isTruncated,
        sub,
        highlight,
        ...props
      },
      ref,
    ) => {
      const variantProps = {
        size,
        bold,
        italic,
        underline,
        strikeThrough,
        isTruncated,
        sub,
        highlight,
      }
      const resolvedClassName = buildClassName(variantProps as HeadingProps, className)
      const Tag = AsComp || sizeToTag[size] || 'h4'

      return <Tag className={resolvedClassName} {...props} ref={ref} />
    },
  ),
)

Heading.displayName = 'Heading'
export { Heading }
