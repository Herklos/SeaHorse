'use client'
import React, { useCallback, useMemo } from 'react'
import { View, Pressable, Text, Platform } from 'react-native'
import type { PressableProps, ViewProps, TextProps } from 'react-native'
import { Svg, Path } from 'react-native-svg'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type CheckboxSize = 'sm' | 'md' | 'lg'

interface CheckboxContextValue {
  size: CheckboxSize
  isChecked: boolean
  isDisabled: boolean
  isInvalid: boolean
  isHovered: boolean
}

const CheckboxContext = React.createContext<CheckboxContextValue>({
  size: 'md',
  isChecked: false,
  isDisabled: false,
  isInvalid: false,
  isHovered: false,
})

// ---------------------------------------------------------------------------
// Variant maps
// ---------------------------------------------------------------------------

const checkboxSizeStyles: Record<CheckboxSize, string> = {
  lg: 'gap-2',
  md: 'gap-2',
  sm: 'gap-1.5',
}

const indicatorSizeStyles: Record<CheckboxSize, string> = {
  lg: 'w-6 h-6 border-[3px]',
  md: 'w-5 h-5 border-2',
  sm: 'w-4 h-4 border-2',
}

const labelSizeStyles: Record<CheckboxSize, string> = {
  lg: 'text-lg',
  md: 'text-base',
  sm: 'text-sm',
}

const iconSizeStyles: Record<CheckboxSize, string> = {
  lg: 'h-5 w-5',
  md: 'h-4 w-4',
  sm: 'h-3 w-3',
}

const iconPixelSizes: Record<CheckboxSize, number> = {
  lg: 20,
  md: 16,
  sm: 12,
}

// ---------------------------------------------------------------------------
// CheckboxGroup
// ---------------------------------------------------------------------------

interface CheckboxGroupProps extends ViewProps {
  value?: string[]
  onChange?: (value: string[]) => void
  children: React.ReactNode
}

const CheckboxGroupContext = React.createContext<{
  value: string[]
  onChange: (val: string[]) => void
} | null>(null)

const CheckboxGroup = React.forwardRef<
  React.ElementRef<typeof View>,
  CheckboxGroupProps
>(({ value = [], onChange, children, className, ...props }, ref) => {
  const ctx = useMemo(
    () => ({
      value,
      onChange: onChange ?? (() => {}),
    }),
    [value, onChange]
  )

  return (
    <CheckboxGroupContext.Provider value={ctx}>
      <View ref={ref} className={cn(className)} {...props}>
        {children}
      </View>
    </CheckboxGroupContext.Provider>
  )
})

CheckboxGroup.displayName = 'CheckboxGroup'

// ---------------------------------------------------------------------------
// Checkbox (root)
// ---------------------------------------------------------------------------

interface CheckboxProps extends Omit<PressableProps, 'children'> {
  size?: CheckboxSize
  isChecked?: boolean
  isDisabled?: boolean
  isInvalid?: boolean
  isHovered?: boolean
  value?: string
  onChange?: (isChecked: boolean) => void
  children?: React.ReactNode
  className?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  CheckboxProps
>(
  (
    {
      size = 'md',
      isChecked: isCheckedProp,
      isDisabled = false,
      isInvalid = false,
      isHovered = false,
      value,
      onChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const groupCtx = React.useContext(CheckboxGroupContext)

    // Derive checked state: group context takes priority if present
    const isChecked = groupCtx
      ? groupCtx.value.includes(value ?? '')
      : isCheckedProp ?? false

    const handlePress = useCallback(() => {
      if (isDisabled) return
      if (groupCtx && value !== undefined) {
        const next = isChecked
          ? groupCtx.value.filter((v) => v !== value)
          : [...groupCtx.value, value]
        groupCtx.onChange(next)
      } else {
        onChange?.(!isChecked)
      }
    }, [isDisabled, groupCtx, value, isChecked, onChange])

    const ctx = useMemo<CheckboxContextValue>(
      () => ({ size, isChecked, isDisabled, isInvalid, isHovered }),
      [size, isChecked, isDisabled, isInvalid, isHovered]
    )

    const rootClass = cn(
      'group/checkbox flex-row items-center justify-start web:cursor-pointer data-[disabled=true]:cursor-not-allowed',
      checkboxSizeStyles[size],
      className
    )

    const dataProps = {
      'data-checked': isChecked,
      'data-disabled': isDisabled,
      'data-invalid': isInvalid,
      'data-hover': isHovered,
    } as Record<string, unknown>

    return (
      <CheckboxContext.Provider value={ctx}>
        <Pressable
          ref={ref}
          role="checkbox"
          aria-checked={isChecked}
          aria-disabled={isDisabled}
          aria-invalid={isInvalid}
          className={rootClass}
          disabled={isDisabled}
          onPress={handlePress}
          {...dataProps}
          {...props}
        >
          {children}
        </Pressable>
      </CheckboxContext.Provider>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// ---------------------------------------------------------------------------
// CheckboxIndicator
// ---------------------------------------------------------------------------

interface CheckboxIndicatorProps extends ViewProps {
  className?: string
}

const CheckboxIndicator = React.forwardRef<
  React.ElementRef<typeof View>,
  CheckboxIndicatorProps
>(({ className, children, ...props }, ref) => {
  const { size, isChecked, isDisabled, isInvalid, isHovered } =
    React.useContext(CheckboxContext)

  const dataProps = {
    'data-checked': isChecked,
    'data-disabled': isDisabled,
    'data-invalid': isInvalid,
    'data-hover': isHovered,
  } as Record<string, unknown>

  return (
    <View
      ref={ref}
      className={cn(
        'justify-center items-center border-outline-400 bg-transparent rounded',
        // focus-visible (web)
        'web:data-[focus-visible=true]:outline-none web:data-[focus-visible=true]:ring-2 web:data-[focus-visible=true]:ring-indicator-primary',
        // checked
        'data-[checked=true]:bg-primary-600 data-[checked=true]:border-primary-600',
        // hover unchecked
        'data-[hover=true]:data-[checked=false]:border-outline-500 data-[hover=true]:bg-transparent',
        // hover invalid
        'data-[hover=true]:data-[invalid=true]:border-error-700',
        // hover checked
        'data-[hover=true]:data-[checked=true]:bg-primary-700 data-[hover=true]:data-[checked=true]:border-primary-700',
        // hover checked disabled
        'data-[hover=true]:data-[checked=true]:data-[disabled=true]:border-primary-600 data-[hover=true]:data-[checked=true]:data-[disabled=true]:bg-primary-600 data-[hover=true]:data-[checked=true]:data-[disabled=true]:opacity-40',
        // hover checked disabled invalid
        'data-[hover=true]:data-[checked=true]:data-[disabled=true]:data-[invalid=true]:border-error-700',
        // hover disabled
        'data-[hover=true]:data-[disabled=true]:border-outline-400 data-[hover=true]:data-[disabled=true]:data-[invalid=true]:border-error-700',
        // active checked
        'data-[active=true]:data-[checked=true]:bg-primary-800 data-[active=true]:data-[checked=true]:border-primary-800',
        // invalid / disabled
        'data-[invalid=true]:border-error-700 data-[disabled=true]:opacity-40',
        // size
        indicatorSizeStyles[size],
        className
      )}
      {...dataProps}
      {...props}
    >
      {children}
    </View>
  )
})

CheckboxIndicator.displayName = 'CheckboxIndicator'

// ---------------------------------------------------------------------------
// CheckboxLabel
// ---------------------------------------------------------------------------

interface CheckboxLabelProps extends TextProps {
  className?: string
}

const CheckboxLabel = React.forwardRef<
  React.ElementRef<typeof Text>,
  CheckboxLabelProps
>(({ className, ...props }, ref) => {
  const { size, isChecked, isDisabled, isHovered } =
    React.useContext(CheckboxContext)

  const dataProps = {
    'data-checked': isChecked,
    'data-disabled': isDisabled,
    'data-hover': isHovered,
  } as Record<string, unknown>

  return (
    <Text
      ref={ref}
      className={cn(
        'text-typography-600',
        'data-[checked=true]:text-typography-900',
        'data-[hover=true]:text-typography-900',
        'data-[hover=true]:data-[checked=true]:text-typography-900',
        'data-[hover=true]:data-[checked=true]:data-[disabled=true]:text-typography-900',
        'data-[hover=true]:data-[disabled=true]:text-typography-400',
        'data-[active=true]:text-typography-900',
        'data-[active=true]:data-[checked=true]:text-typography-900',
        'data-[disabled=true]:opacity-40',
        'web:select-none',
        labelSizeStyles[size],
        className
      )}
      {...dataProps}
      {...props}
    />
  )
})

CheckboxLabel.displayName = 'CheckboxLabel'

// ---------------------------------------------------------------------------
// CheckboxIcon
// ---------------------------------------------------------------------------

interface CheckboxIconProps extends ViewProps {
  as?: React.ComponentType<{ size?: number; color?: string; className?: string }>
  size?: CheckboxSize | number
  color?: string
  className?: string
}

/** Default checkmark rendered via react-native-svg */
function DefaultCheckIcon({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 6 9 17l-5-5" />
    </Svg>
  )
}

const CheckboxIcon = React.forwardRef<
  React.ElementRef<typeof View>,
  CheckboxIconProps
>(({ as: IconComponent, className, size: sizeProp, color, ...props }, ref) => {
  const { size: parentSize, isChecked } = React.useContext(CheckboxContext)

  if (!isChecked) return null

  const resolvedSize =
    typeof sizeProp === 'number'
      ? sizeProp
      : iconPixelSizes[sizeProp ?? parentSize]

  const iconClass = cn(
    'text-typography-50 fill-none',
    typeof sizeProp !== 'number' && iconSizeStyles[sizeProp ?? parentSize],
    className
  )

  return (
    <View ref={ref} className={iconClass} {...props}>
      {IconComponent ? (
        <IconComponent size={resolvedSize} color={color} />
      ) : (
        <DefaultCheckIcon size={resolvedSize} color={color ?? '#fafafa'} />
      )}
    </View>
  )
})

CheckboxIcon.displayName = 'CheckboxIcon'

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  CheckboxGroup,
}
