'use client'
import React from 'react'
import { Switch as RNSwitch } from 'react-native'
import { styled as cssInterop } from 'react-native-css'
import { cn } from '../../utils/cn'

cssInterop(RNSwitch, {
  className: { target: 'style' },
})

const sizeVariants = {
  sm: 'scale-75',
  md: '',
  lg: 'scale-125',
} as const

type SwitchProps = React.ComponentProps<typeof RNSwitch> & {
  size?: keyof typeof sizeVariants
}

const Switch = React.forwardRef<
  React.ElementRef<typeof RNSwitch>,
  SwitchProps
>(({ className, size = 'md', ...props }, ref) => {
  return (
    <RNSwitch
      ref={ref}
      {...props}
      className={cn(
        'data-[focus=true]:outline-0 data-[focus=true]:ring-2 data-[focus=true]:ring-indicator-primary web:cursor-pointer disabled:cursor-not-allowed data-[disabled=true]:opacity-40 data-[invalid=true]:border-error-700 data-[invalid=true]:rounded-xl data-[invalid=true]:border-2',
        sizeVariants[size],
        className,
      )}
    />
  )
})

Switch.displayName = 'Switch'
export { Switch }
