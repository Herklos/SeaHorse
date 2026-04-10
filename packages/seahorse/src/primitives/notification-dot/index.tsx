import React from 'react'
import { Box } from '../box'
import { Text } from '../text'
import { cn } from '../../utils/cn'

type NotificationDotProps = {
  visible?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info'
  count?: number
  maxCount?: number
  children: React.ReactNode
  right?: number
  top?: number
  className?: string
}

export const NotificationDot = ({
  visible = true,
  size = 'sm',
  color = 'danger',
  count,
  maxCount = 99,
  children,
  right = 0,
  top = 0,
  className = '',
}: NotificationDotProps) => {
  if (!visible) {
    return <>{children}</>
  }

  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const textSizeClasses = {
    xs: 'text-[6px]',
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  }

  // Semantic color tokens (no raw Tailwind colors)
  const colorClasses = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    danger: 'bg-error-500',
    warning: 'bg-warning-500',
    success: 'bg-success-500',
    info: 'bg-info-500',
  }

  const formattedCount =
    count !== undefined && count > 0
      ? count > maxCount
        ? `${maxCount}+`
        : `${count}`
      : ''

  const dotSize = count !== undefined ? sizeClasses.md : sizeClasses[size]
  const paddingClass = count !== undefined ? 'px-1' : ''

  return (
    <Box className="relative">
      {children}
      <Box
        className={
          count !== undefined && count > 0
            ? `absolute rounded-full ${dotSize} ${colorClasses[color]} ${paddingClass} flex items-center justify-center ${className}`
            : undefined
        }
        style={{
          top: -top || 0,
          right: -right || 0,
          zIndex: 10,
        }}
      >
        {count !== undefined && count > 0 && (
          <Text className={cn('text-white font-bold', textSizeClasses[size])}>
            {formattedCount}
          </Text>
        )}
      </Box>
    </Box>
  )
}
