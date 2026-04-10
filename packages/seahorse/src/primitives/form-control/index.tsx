'use client'
import React, { createContext, useContext } from 'react'
import { View, Text } from 'react-native'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type FormControlContextValue = {
  size: string
  isDisabled: boolean
  isInvalid: boolean
  isRequired: boolean
  isReadOnly: boolean
}

const FormControlContext = createContext<FormControlContextValue>({
  size: 'md',
  isDisabled: false,
  isInvalid: false,
  isRequired: false,
  isReadOnly: false,
})

export const useFormControlContext = () => useContext(FormControlContext)

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const textSizeMap: Record<string, string> = {
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

const helperTextSizeMap: Record<string, string> = {
  '2xs': 'text-2xs',
  xs: 'text-xs',
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
}

const iconSizeMap: Record<string, string> = {
  '2xs': 'h-3 w-3',
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
}

// ---------------------------------------------------------------------------
// FormControl
// ---------------------------------------------------------------------------

type FormControlProps = React.ComponentPropsWithoutRef<typeof View> & {
  size?: string
  isDisabled?: boolean
  isInvalid?: boolean
  isRequired?: boolean
  isReadOnly?: boolean
}

const FormControl = React.forwardRef<React.ElementRef<typeof View>, FormControlProps>(
  (
    {
      size = 'md',
      isDisabled = false,
      isInvalid = false,
      isRequired = false,
      isReadOnly = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <FormControlContext.Provider value={{ size, isDisabled, isInvalid, isRequired, isReadOnly }}>
        <View ref={ref} className={cn('flex flex-col', className)} {...props} />
      </FormControlContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// FormControlError
// ---------------------------------------------------------------------------

type FormControlErrorProps = React.ComponentPropsWithoutRef<typeof View>

const FormControlError = React.forwardRef<React.ElementRef<typeof View>, FormControlErrorProps>(
  ({ className, children, ...props }, ref) => {
    const { isInvalid } = useFormControlContext()
    if (!isInvalid) return null
    return (
      <View ref={ref} className={cn('flex flex-row justify-start items-center mt-1 gap-1', className)} {...props}>
        {children}
      </View>
    )
  },
)

// ---------------------------------------------------------------------------
// FormControlErrorText
// ---------------------------------------------------------------------------

type FormControlErrorTextProps = React.ComponentPropsWithoutRef<typeof Text> & {
  size?: string
  isTruncated?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
  italic?: boolean
  highlight?: boolean
  sub?: boolean
}

const FormControlErrorText = React.forwardRef<React.ElementRef<typeof Text>, FormControlErrorTextProps>(
  ({ className, size, isTruncated, bold, underline, strikeThrough, italic, highlight, sub, ...props }, ref) => {
    const { size: parentSize } = useFormControlContext()
    const resolvedSize = size ?? parentSize

    return (
      <Text
        ref={ref}
        className={cn(
          'text-error-700',
          textSizeMap[resolvedSize],
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
// FormControlErrorIcon
// ---------------------------------------------------------------------------

type FormControlErrorIconProps = React.ComponentPropsWithoutRef<typeof View> & {
  as?: React.ElementType
  size?: string | number
  height?: number
  width?: number
}

const FormControlErrorIcon = React.forwardRef<React.ElementRef<typeof View>, FormControlErrorIconProps>(
  ({ as: IconComponent, className, size, height, width, ...props }, ref) => {
    const { size: parentSize } = useFormControlContext()

    if (!IconComponent) return null

    const resolvedSize = typeof size === 'string' ? size : parentSize
    const sizeClass = typeof size !== 'number' ? iconSizeMap[resolvedSize] : undefined

    return (
      <IconComponent
        ref={ref}
        className={cn('text-error-700 fill-none', sizeClass, className)}
        {...(typeof size === 'number' ? { size } : {})}
        {...(height !== undefined ? { height } : {})}
        {...(width !== undefined ? { width } : {})}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// FormControlLabel
// ---------------------------------------------------------------------------

type FormControlLabelProps = React.ComponentPropsWithoutRef<typeof View>

const FormControlLabel = React.forwardRef<React.ElementRef<typeof View>, FormControlLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <View ref={ref} className={cn('flex flex-row justify-start items-center mb-1', className)} {...props} />
    )
  },
)

// ---------------------------------------------------------------------------
// FormControlLabelText
// ---------------------------------------------------------------------------

type FormControlLabelTextProps = React.ComponentPropsWithoutRef<typeof Text> & {
  size?: string
  isTruncated?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
  italic?: boolean
  highlight?: boolean
  sub?: boolean
}

const FormControlLabelText = React.forwardRef<React.ElementRef<typeof Text>, FormControlLabelTextProps>(
  ({ className, size, isTruncated, bold, underline, strikeThrough, italic, highlight, sub, ...props }, ref) => {
    const { size: parentSize } = useFormControlContext()
    const resolvedSize = size ?? parentSize

    return (
      <Text
        ref={ref}
        className={cn(
          'font-medium text-typography-900',
          textSizeMap[resolvedSize],
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
// FormControlLabelAstrick
// ---------------------------------------------------------------------------

type FormControlLabelAstrickProps = React.ComponentPropsWithoutRef<typeof Text> & {
  size?: string
}

const FormControlLabelAstrick = React.forwardRef<React.ElementRef<typeof Text>, FormControlLabelAstrickProps>(
  ({ className, size, ...props }, ref) => {
    const { size: parentSize } = useFormControlContext()
    const resolvedSize = size ?? parentSize

    return (
      <Text
        ref={ref}
        className={cn('font-medium text-typography-900', textSizeMap[resolvedSize], className)}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// FormControlHelper
// ---------------------------------------------------------------------------

type FormControlHelperProps = React.ComponentPropsWithoutRef<typeof View>

const FormControlHelper = React.forwardRef<React.ElementRef<typeof View>, FormControlHelperProps>(
  ({ className, ...props }, ref) => {
    return (
      <View ref={ref} className={cn('flex flex-row justify-start items-center mt-1', className)} {...props} />
    )
  },
)

// ---------------------------------------------------------------------------
// FormControlHelperText
// ---------------------------------------------------------------------------

type FormControlHelperTextProps = React.ComponentPropsWithoutRef<typeof Text> & {
  size?: string
  isTruncated?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
  italic?: boolean
  highlight?: boolean
  sub?: boolean
}

const FormControlHelperText = React.forwardRef<React.ElementRef<typeof Text>, FormControlHelperTextProps>(
  ({ className, size, isTruncated, bold, underline, strikeThrough, italic, highlight, sub, ...props }, ref) => {
    const { size: parentSize } = useFormControlContext()
    const resolvedSize = size ?? parentSize

    return (
      <Text
        ref={ref}
        className={cn(
          'text-typography-500',
          helperTextSizeMap[resolvedSize],
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
// Display names
// ---------------------------------------------------------------------------

FormControl.displayName = 'FormControl'
FormControlError.displayName = 'FormControlError'
FormControlErrorText.displayName = 'FormControlErrorText'
FormControlErrorIcon.displayName = 'FormControlErrorIcon'
FormControlLabel.displayName = 'FormControlLabel'
FormControlLabelText.displayName = 'FormControlLabelText'
FormControlLabelAstrick.displayName = 'FormControlLabelAstrick'
FormControlHelper.displayName = 'FormControlHelper'
FormControlHelperText.displayName = 'FormControlHelperText'

export {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlLabelAstrick,
  FormControlHelper,
  FormControlHelperText,
}
