'use client'
import React, { createContext, useContext } from 'react'
import { Pressable, View, Text, Platform } from 'react-native'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type RadioGroupContextValue = {
  value: string | undefined
  onChange: (value: string) => void
  isDisabled?: boolean
  isInvalid?: boolean
}

const RadioGroupContext = createContext<RadioGroupContextValue>({
  value: undefined,
  onChange: () => {},
})

type RadioContextValue = {
  size: 'sm' | 'md' | 'lg'
  isChecked: boolean
  isDisabled: boolean
  isInvalid: boolean
}

const RadioContext = createContext<RadioContextValue>({
  size: 'md',
  isChecked: false,
  isDisabled: false,
  isInvalid: false,
})

// ---------------------------------------------------------------------------
// Variant maps
// ---------------------------------------------------------------------------

const radioSizeGap: Record<string, string> = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2',
}

const indicatorSize: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const iconSize: Record<string, string> = {
  sm: 'h-[9px] w-[9px]',
  md: 'h-3 w-3',
  lg: 'h-4 w-4',
}

const labelTextSize: Record<string, string> = {
  '2xs': 'text-2xs',
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
}

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------

type RadioGroupProps = React.ComponentPropsWithoutRef<typeof View> & {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  isDisabled?: boolean
  isInvalid?: boolean
}

const RadioGroup = React.forwardRef<React.ElementRef<typeof View>, RadioGroupProps>(
  ({ value: controlledValue, defaultValue, onChange, isDisabled, isInvalid, className, ...props }, ref) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : uncontrolled

    const handleChange = React.useCallback(
      (v: string) => {
        if (!isControlled) setUncontrolled(v)
        onChange?.(v)
      },
      [isControlled, onChange],
    )

    return (
      <RadioGroupContext.Provider value={{ value: currentValue, onChange: handleChange, isDisabled, isInvalid }}>
        <View ref={ref} className={cn('gap-2', className)} {...props} />
      </RadioGroupContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// Radio
// ---------------------------------------------------------------------------

type RadioProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  value: string
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  isInvalid?: boolean
}

const Radio = React.forwardRef<React.ElementRef<typeof Pressable>, RadioProps>(
  ({ value, size = 'md', isDisabled: itemDisabled, isInvalid: itemInvalid, className, children, ...props }, ref) => {
    const group = useContext(RadioGroupContext)
    const isChecked = group.value === value
    const isDisabled = itemDisabled ?? group.isDisabled ?? false
    const isInvalid = itemInvalid ?? group.isInvalid ?? false

    const handlePress = () => {
      if (!isDisabled) group.onChange(value)
    }

    const Wrapper = Platform.OS === 'web' ? View : Pressable

    return (
      <RadioContext.Provider value={{ size, isChecked, isDisabled, isInvalid }}>
        <Wrapper
          ref={ref as any}
          {...(Platform.OS !== 'web' ? { onPress: handlePress } : {})}
          {...(Platform.OS === 'web' ? { onClick: handlePress, role: 'radio', 'aria-checked': isChecked } : {})}
          className={cn(
            'flex-row justify-start items-center',
            Platform.OS === 'web' && 'cursor-pointer',
            isDisabled && Platform.OS === 'web' && 'cursor-not-allowed',
            radioSizeGap[size],
            className,
          )}
          {...props}
        >
          {children as any}
        </Wrapper>
      </RadioContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// RadioIndicator
// ---------------------------------------------------------------------------

type RadioIndicatorProps = React.ComponentPropsWithoutRef<typeof View>

const RadioIndicator = React.forwardRef<React.ElementRef<typeof View>, RadioIndicatorProps>(
  ({ className, ...props }, ref) => {
    const { size, isChecked, isDisabled, isInvalid } = useContext(RadioContext)

    return (
      <View
        ref={ref}
        className={cn(
          'justify-center items-center bg-transparent border-2 rounded-full',
          indicatorSize[size],
          isChecked ? 'border-primary-600' : 'border-outline-400',
          isInvalid && 'border-error-700',
          isDisabled && 'opacity-40',
          isDisabled && isChecked && 'border-outline-400',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// RadioLabel
// ---------------------------------------------------------------------------

type RadioLabelProps = React.ComponentPropsWithoutRef<typeof Text>

const RadioLabel = React.forwardRef<React.ElementRef<typeof Text>, RadioLabelProps>(
  ({ className, ...props }, ref) => {
    const { size, isChecked, isDisabled } = useContext(RadioContext)

    return (
      <Text
        ref={ref}
        className={cn(
          isChecked ? 'text-typography-900' : 'text-typography-600',
          labelTextSize[size] ?? 'text-base',
          isDisabled && 'opacity-40',
          Platform.OS === 'web' && 'select-none',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// RadioIcon
// ---------------------------------------------------------------------------

type RadioIconProps = React.ComponentPropsWithoutRef<typeof View> & {
  as?: React.ElementType
  size?: number
}

const RadioIcon = React.forwardRef<React.ElementRef<typeof View>, RadioIconProps>(
  ({ as: IconComponent, className, size: iconSizeProp, ...props }, ref) => {
    const { size: parentSize, isChecked } = useContext(RadioContext)

    if (!isChecked) return null

    const sizeClass = iconSize[parentSize] ?? iconSize.md

    if (IconComponent) {
      return (
        <IconComponent
          ref={ref}
          className={cn('text-primary-800 fill-primary-800', sizeClass, className)}
          size={iconSizeProp}
          {...props}
        />
      )
    }

    return (
      <View
        ref={ref}
        className={cn('rounded-full bg-primary-800', sizeClass, className)}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// Display names & exports
// ---------------------------------------------------------------------------

Radio.displayName = 'Radio'
RadioGroup.displayName = 'RadioGroup'
RadioIndicator.displayName = 'RadioIndicator'
RadioLabel.displayName = 'RadioLabel'
RadioIcon.displayName = 'RadioIcon'

export { Radio, RadioGroup, RadioIndicator, RadioLabel, RadioIcon }
