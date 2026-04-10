import React, { forwardRef, memo } from 'react'
import { H1, H2, H3, H4, H5, H6 } from '@expo/html-elements'
import { styled as cssInterop } from 'react-native-css'
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

cssInterop(H1, { className: 'style' })
cssInterop(H2, { className: 'style' })
cssInterop(H3, { className: 'style' })
cssInterop(H4, { className: 'style' })
cssInterop(H5, { className: 'style' })
cssInterop(H6, { className: 'style' })

type HeadingProps = React.ComponentPropsWithoutRef<typeof H1> & {
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

const sizeToComponent: Record<string, React.ElementType> = {
  '5xl': H1,
  '4xl': H1,
  '3xl': H1,
  '2xl': H2,
  'xl': H3,
  'lg': H4,
  'md': H5,
  'sm': H6,
  'xs': H6,
}

const Heading = memo(
  forwardRef<any, HeadingProps>(
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
      const Component = AsComp || sizeToComponent[size] || H4

      return (
        <Component
          className={resolvedClassName}
          {...props}
            // @ts-ignore
          ref={ref}
        />
      )
    },
  ),
)

Heading.displayName = 'Heading'
export { Heading }
