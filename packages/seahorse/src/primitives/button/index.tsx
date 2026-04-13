'use client'
import React, { createContext, useContext, useMemo } from 'react'
import { Platform } from 'react-native'
import { ActivityIndicator, Pressable, Text, View } from 'react-native-css/components'
import { styled } from 'react-native-css'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type ButtonAction = 'primary' | 'secondary' | 'positive' | 'negative' | 'default'
type ButtonVariant = 'solid' | 'outline' | 'link' | 'ghost'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonContextValue {
  action: ButtonAction
  variant: ButtonVariant
  size: ButtonSize
}

const ButtonContext = createContext<ButtonContextValue>({
  action: 'primary',
  variant: 'solid',
  size: 'md',
})

// ---------------------------------------------------------------------------
// Variant maps – Button (root)
// ---------------------------------------------------------------------------

const buttonBase =
  'group/button rounded-lg bg-primary-500 flex-row items-center justify-center data-[focus-visible=true]:web:outline-none data-[focus-visible=true]:web:ring-2 data-[disabled=true]:opacity-40 gap-2'

const buttonActionMap: Record<ButtonAction, string> = {
  primary:
    'bg-primary-500 data-[hover=true]:bg-primary-500/70 data-[active=true]:bg-primary-700/80 border-primary-300/80 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500 data-[focus-visible=true]:web:ring-indicator-info',
  secondary:
    'bg-secondary-500 border-secondary-300 data-[hover=true]:bg-secondary-600 data-[hover=true]:border-secondary-400 data-[active=true]:bg-secondary-700 data-[active=true]:border-secondary-700 data-[focus-visible=true]:web:ring-indicator-info',
  positive:
    'bg-success-500 border-success-300 data-[hover=true]:bg-success-600 data-[hover=true]:border-success-400 data-[active=true]:bg-success-700 data-[active=true]:border-success-500 data-[focus-visible=true]:web:ring-indicator-info',
  negative:
    'bg-error-500 border-error-300 data-[hover=true]:bg-error-600 data-[hover=true]:border-error-400 data-[active=true]:bg-error-700 data-[active=true]:border-error-500 data-[focus-visible=true]:web:ring-indicator-info',
  default:
    'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
}

const buttonVariantMap: Record<ButtonVariant, string> = {
  link: 'px-0',
  outline:
    'bg-transparent border data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent',
  solid: '',
  ghost:
    'bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent',
}

const buttonSizeMap: Record<ButtonSize, string> = {
  xs: 'px-3.5 h-8',
  sm: 'px-4 h-9',
  md: 'px-5 h-10',
  lg: 'px-6 h-11',
  xl: 'px-7 h-12',
}

// Compound: action × variant overrides
const buttonCompound = (action: ButtonAction, variant: ButtonVariant): string => {
  if (variant === 'link') {
    if (
      action === 'primary' ||
      action === 'secondary' ||
      action === 'positive' ||
      action === 'negative'
    ) {
      return 'px-0 bg-transparent data-[hover=true]:bg-transparent data-[active=true]:bg-transparent'
    }
  }
  if (variant === 'outline') {
    if (
      action === 'primary' ||
      action === 'secondary' ||
      action === 'positive' ||
      action === 'negative'
    ) {
      return 'bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent'
    }
  }
  return ''
}

// ---------------------------------------------------------------------------
// Variant maps – ButtonText
// ---------------------------------------------------------------------------

const buttonTextBase = 'text-typography-0 font-semibold web:select-none'

const buttonTextActionMap: Record<Exclude<ButtonAction, 'default'>, string> = {
  primary:
    'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
  secondary:
    'text-typography-500 data-[hover=true]:text-typography-600 data-[active=true]:text-typography-700',
  positive:
    'text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700',
  negative:
    'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
}

const buttonTextVariantMap: Record<ButtonVariant, string> = {
  link: 'data-[hover=true]:underline data-[active=true]:underline',
  outline: '',
  solid:
    'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
  ghost: '',
}

const buttonTextSizeMap: Record<ButtonSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const buttonTextCompound = (
  action: ButtonAction,
  variant: ButtonVariant,
): string => {
  if (variant === 'solid') {
    if (action === 'secondary') {
      return 'text-typography-800 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800'
    }
    return 'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0'
  }
  if (variant === 'outline') {
    if (action === 'secondary') {
      return 'text-typography-500 data-[hover=true]:text-primary-600 data-[active=true]:text-typography-700'
    }
    return 'text-primary-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-500'
  }
  return ''
}

// ---------------------------------------------------------------------------
// Variant maps – ButtonIcon
// ---------------------------------------------------------------------------

const buttonIconBase = 'fill-none'

const buttonIconActionMap: Record<Exclude<ButtonAction, 'default'>, string> = {
  primary:
    'text-primary-600 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700',
  secondary:
    'text-typography-500 data-[hover=true]:text-typography-600 data-[active=true]:text-typography-700',
  positive:
    'text-success-600 data-[hover=true]:text-success-600 data-[active=true]:text-success-700',
  negative:
    'text-error-600 data-[hover=true]:text-error-600 data-[active=true]:text-error-700',
}

const buttonIconVariantMap: Record<ButtonVariant, string> = {
  link: 'data-[hover=true]:underline data-[active=true]:underline',
  outline: '',
  solid:
    'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0',
  ghost: '',
}

const buttonIconSizeMap: Record<ButtonSize, string> = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
  lg: 'h-[18px] w-[18px]',
  xl: 'h-5 w-5',
}

const buttonIconNumericSizeMap: Record<ButtonSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 18,
  xl: 20,
}

const buttonIconCompound = (
  action: ButtonAction,
  variant: ButtonVariant,
): string => {
  if (variant === 'solid') {
    if (action === 'secondary') {
      return 'text-typography-800 data-[hover=true]:text-typography-800 data-[active=true]:text-typography-800'
    }
    return 'text-typography-0 data-[hover=true]:text-typography-0 data-[active=true]:text-typography-0'
  }
  return ''
}

// ---------------------------------------------------------------------------
// Variant maps – ButtonGroup
// ---------------------------------------------------------------------------

const buttonGroupSpaceMap: Record<string, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-5',
  '2xl': 'gap-6',
  '3xl': 'gap-7',
  '4xl': 'gap-8',
}

const buttonGroupFlexMap: Record<string, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

interface ButtonProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  action?: ButtonAction
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  isDisabled?: boolean
}

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    { className, variant = 'solid', size = 'md', action = 'primary', isDisabled, disabled, ...props },
    ref,
  ) => {
    const resolvedDisabled = isDisabled ?? disabled
    return (
      <ButtonContext.Provider value={{ action, variant, size }}>
        <Pressable
          ref={ref}
          disabled={resolvedDisabled}
          {...props}
          className={cn(
            buttonBase,
            buttonActionMap[action],
            buttonVariantMap[variant],
            buttonSizeMap[size],
            buttonCompound(action, variant),
            className,
          )}
        />
      </ButtonContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// ButtonText
// ---------------------------------------------------------------------------

interface ButtonTextProps extends React.ComponentPropsWithoutRef<typeof Text> {
  className?: string
  size?: ButtonSize
}

const ButtonText = React.forwardRef<
  React.ElementRef<typeof Text>,
  ButtonTextProps
>(({ className, size: sizeProp, ...props }, ref) => {
  const { action, variant, size: parentSize } = useContext(ButtonContext)
  const size = sizeProp || parentSize

  return (
    <Text
      ref={ref}
      {...props}
      className={cn(
        buttonTextBase,
        action !== 'default' && buttonTextActionMap[action],
        buttonTextVariantMap[variant],
        buttonTextSizeMap[size],
        buttonTextCompound(action, variant),
        className,
      )}
    />
  )
})

// ---------------------------------------------------------------------------
// ButtonSpinner
// ---------------------------------------------------------------------------

const ButtonSpinner = ActivityIndicator

// ---------------------------------------------------------------------------
// ButtonIcon
// ---------------------------------------------------------------------------

interface ButtonIconProps {
  className?: string
  as: React.ElementType
  size?: ButtonSize | number
  height?: number
  width?: number
}

const ButtonIcon = React.forwardRef<any, ButtonIconProps>(
  ({ className, as: IconComponent, size: sizeProp, height, width, ...props }, ref) => {
    const { action, variant, size: parentSize } = useContext(ButtonContext)

    // On native, NativeWind text-* classes don't propagate to SVG `color` prop.
    // Use styled() with nativeStyleToProp to bridge CSS color → Lucide color prop.
    const NativeAwareIcon = useMemo(() => {
      if (Platform.OS === 'web') return IconComponent
      return styled(IconComponent as React.ComponentType<any>, {
        className: { target: false, nativeStyleToProp: { color: 'color' } },
      })
    }, [IconComponent])

    // Explicit numeric size — skip parent variant sizing
    if (typeof sizeProp === 'number') {
      return (
        <NativeAwareIcon
          ref={ref}
          {...props}
          className={cn(buttonIconBase, className)}
          height={sizeProp}
          width={sizeProp}
        />
      )
    }

    // Explicit height/width without size — skip parent variant sizing
    if ((height !== undefined || width !== undefined) && sizeProp === undefined) {
      return (
        <NativeAwareIcon
          ref={ref}
          {...props}
          className={cn(buttonIconBase, className)}
          height={height}
          width={width}
        />
      )
    }

    const numericSize = typeof sizeProp === 'string'
      ? buttonIconNumericSizeMap[sizeProp]
      : buttonIconNumericSizeMap[parentSize]

    return (
      <NativeAwareIcon
        ref={ref}
        {...props}
        size={numericSize}
        className={cn(
          buttonIconBase,
          action !== 'default' && buttonIconActionMap[action],
          buttonIconVariantMap[variant],
          buttonIconSizeMap[parentSize],
          buttonIconCompound(action, variant),
          className,
        )}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// ButtonGroup
// ---------------------------------------------------------------------------

interface ButtonGroupProps extends React.ComponentPropsWithoutRef<typeof View> {
  className?: string
  space?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  isAttached?: boolean
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
}

const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof View>,
  ButtonGroupProps
>(
  (
    {
      className,
      space = 'md',
      isAttached = false,
      flexDirection = 'column',
      ...props
    },
    ref,
  ) => {
    return (
      <View
        ref={ref}
        {...props}
        className={cn(
          isAttached ? 'gap-0' : buttonGroupSpaceMap[space],
          buttonGroupFlexMap[flexDirection],
          className,
        )}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// Display names
// ---------------------------------------------------------------------------

Button.displayName = 'Button'
ButtonText.displayName = 'ButtonText'
;(ButtonSpinner as any).displayName = 'ButtonSpinner'
ButtonIcon.displayName = 'ButtonIcon'
ButtonGroup.displayName = 'ButtonGroup'

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup }
export type { ButtonProps, ButtonAction, ButtonVariant, ButtonSize }
