'use client'
import React, { createContext, useContext } from 'react'
import { Text, View } from 'react-native'
import { cn } from '../../utils/cn'
import { Icon as UIIcon } from '../icon'

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const actionClasses: Record<string, string> = {
  error: 'bg-background-error',
  warning: 'bg-background-warning',
  success: 'bg-background-success',
  info: 'bg-background-info',
  muted: 'bg-background-muted',
}

const variantClasses: Record<string, string> = {
  solid: '',
  outline: 'border bg-background-0',
}

const actionTextColor: Record<string, string> = {
  error: 'text-error-800',
  warning: 'text-warning-800',
  success: 'text-success-800',
  info: 'text-info-800',
  muted: 'text-background-800',
}

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

const iconSizeClasses: Record<string, string> = {
  '2xs': 'h-3 w-3',
  'xs': 'h-3.5 w-3.5',
  'sm': 'h-4 w-4',
  'md': 'h-[18px] w-[18px]',
  'lg': 'h-5 w-5',
  'xl': 'h-6 w-6',
}

// ---------------------------------------------------------------------------
// Alert context (parent -> child variant passing)
// ---------------------------------------------------------------------------

type AlertContextValue = {
  action: string
  variant: string
}

const AlertContext = createContext<AlertContextValue>({
  action: 'muted',
  variant: 'solid',
})

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------

type AlertProps = React.ComponentProps<typeof View> & {
  className?: string
  action?: 'error' | 'warning' | 'success' | 'info' | 'muted'
  variant?: 'solid' | 'outline'
}

const Alert = React.forwardRef<React.ComponentRef<typeof View>, AlertProps>(
  ({ className, action = 'muted', variant = 'solid', ...props }, ref) => {
    return (
      <AlertContext.Provider value={{ action, variant }}>
        <View
          ref={ref}
          role="alert"
          className={cn(
            'items-center py-3 px-4 rounded-md flex-row gap-2 border-outline-100',
            actionClasses[action],
            variantClasses[variant],
            className,
          )}
          {...props}
        />
      </AlertContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// AlertText
// ---------------------------------------------------------------------------

type AlertTextProps = React.ComponentProps<typeof Text> & {
  className?: string
  size?: keyof typeof sizeClasses
  isTruncated?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
  sub?: boolean
  italic?: boolean
  highlight?: boolean
}

const AlertText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  AlertTextProps
>(
  (
    {
      className,
      size = 'md',
      isTruncated,
      bold,
      underline,
      strikeThrough,
      sub,
      italic,
      highlight,
      ...props
    },
    ref,
  ) => {
    const { action } = useContext(AlertContext)
    return (
      <Text
        ref={ref}
        className={cn(
          'font-normal font-body',
          actionTextColor[action],
          sizeClasses[size],
          isTruncated && 'web:truncate',
          bold && 'font-bold',
          underline && 'underline',
          strikeThrough && 'line-through',
          sub && 'text-xs',
          italic && 'italic',
          highlight && 'bg-yellow-500',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// AlertIcon
// ---------------------------------------------------------------------------

type AlertIconProps = {
  as?: React.ElementType
  className?: string
  size?: keyof typeof iconSizeClasses | number
  height?: number
  width?: number
  [key: string]: any
}

const AlertIcon = React.forwardRef<unknown, AlertIconProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const { action } = useContext(AlertContext)

    return (
      <UIIcon
        ref={ref}
        size={size}
        className={cn(
          'fill-none',
          actionTextColor[action],
          className,
        )}
        {...props}
      />
    )
  },
)

Alert.displayName = 'Alert'
AlertText.displayName = 'AlertText'
AlertIcon.displayName = 'AlertIcon'

export { Alert, AlertText, AlertIcon }
