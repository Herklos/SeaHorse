'use client'
import React, { useMemo } from 'react'
import {
  View,
  Pressable,
  TextInput,
  Platform,
  type ViewProps,
  type TextInputProps,
  type PressableProps,
} from 'react-native'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type InputVariant = 'underlined' | 'outline' | 'rounded'
type InputSize = 'sm' | 'md' | 'lg' | 'xl'

interface InputContextValue {
  variant: InputVariant
  size: InputSize
  isDisabled: boolean
  isInvalid: boolean
  isReadOnly: boolean
  isRequired: boolean
  isFocused: boolean
  isHovered: boolean
  setIsFocused: (v: boolean) => void
  inputFieldRef: React.RefObject<TextInput | null>
}

const InputContext = React.createContext<InputContextValue | null>(null)

function useInputContext() {
  const ctx = React.useContext(InputContext)
  if (!ctx) throw new Error('Input sub-components must be used within <Input>')
  return ctx
}

// ---------------------------------------------------------------------------
// Variant maps
// ---------------------------------------------------------------------------

const inputBase =
  'border-background-300 flex-row overflow-hidden content-center data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[focus=true]:hover:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:hover:border-background-300 items-center'

const inputSizeClasses: Record<InputSize, string> = {
  xl: 'h-12',
  lg: 'h-11',
  md: 'h-10',
  sm: 'h-9',
}

const inputVariantClasses: Record<InputVariant, string> = {
  underlined:
    'rounded-none border-b data-[invalid=true]:border-b-2 data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700',
  outline:
    'rounded-lg border border-primary-500/20 data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[focus=true]:hover:web:ring-1 data-[invalid=true]:data-[focus=true]:hover:web:ring-inset data-[invalid=true]:data-[focus=true]:hover:web:ring-indicator-error data-[invalid=true]:data-[disabled=true]:hover:web:ring-1 data-[invalid=true]:data-[disabled=true]:hover:web:ring-inset data-[invalid=true]:data-[disabled=true]:hover:web:ring-indicator-error',
  rounded:
    'rounded-full border data-[invalid=true]:border-error-700 data-[invalid=true]:hover:border-error-700 data-[invalid=true]:data-[focus=true]:border-error-700 data-[invalid=true]:data-[focus=true]:hover:border-error-700 data-[invalid=true]:data-[disabled=true]:hover:border-error-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[focus=true]:hover:web:ring-1 data-[invalid=true]:data-[focus=true]:hover:web:ring-inset data-[invalid=true]:data-[focus=true]:hover:web:ring-indicator-error data-[invalid=true]:data-[disabled=true]:hover:web:ring-1 data-[invalid=true]:data-[disabled=true]:hover:web:ring-inset data-[invalid=true]:data-[disabled=true]:hover:web:ring-indicator-error',
}

// InputField
const inputFieldBase =
  'flex-1 text-typography-900 py-0 px-3 placeholder:text-typography-500 h-full ios:leading-[0px] web:cursor-text web:data-[disabled=true]:cursor-not-allowed'

const inputFieldVariantClasses: Record<InputVariant, string> = {
  underlined: 'web:outline-0 web:outline-none px-0',
  outline: 'web:outline-0 web:outline-none',
  rounded: 'web:outline-0 web:outline-none px-4',
}

const inputFieldSizeClasses: Record<string, string> = {
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

// InputIcon
const inputIconBase = 'justify-center items-center text-typography-400 fill-none'

const inputIconSizeClasses: Record<string, string> = {
  '2xs': 'h-3 w-3',
  'xs': 'h-3.5 w-3.5',
  'sm': 'h-4 w-4',
  'md': 'h-[18px] w-[18px]',
  'lg': 'h-5 w-5',
  'xl': 'h-6 w-6',
}

const inputIconNumericSize: Record<string, number> = {
  '2xs': 12,
  'xs': 14,
  'sm': 16,
  'md': 18,
  'lg': 20,
  'xl': 24,
}

// InputSlot
const inputSlotBase = 'justify-center items-center web:disabled:cursor-not-allowed'

// ---------------------------------------------------------------------------
// NativeWind data-* helpers
// ---------------------------------------------------------------------------

type DataSetProps = {
  dataSet?: Record<string, string>
  'data-hover'?: string
  'data-focus'?: string
  'data-disabled'?: string
  'data-invalid'?: string
  'data-readonly'?: string
  'data-required'?: string
  'data-focus-visible'?: string
}

// ---------------------------------------------------------------------------
// Input (Root)
// ---------------------------------------------------------------------------

interface InputProps extends Omit<ViewProps, 'children'> {
  variant?: InputVariant
  size?: InputSize
  isDisabled?: boolean
  isInvalid?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isFocused?: boolean
  isHovered?: boolean
  className?: string
  children?: React.ReactNode
}

const Input = React.forwardRef<View, InputProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'md',
      isDisabled = false,
      isInvalid = false,
      isReadOnly = false,
      isRequired = false,
      isFocused: isFocusedProp,
      isHovered: isHoveredProp = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const inputFieldRef = React.useRef<TextInput>(null)

    const resolvedFocused = isFocusedProp ?? isFocused

    const dataAttrs: DataSetProps = useMemo(
      () => ({
        dataSet: {
          hover: isHoveredProp ? 'true' : 'false',
          focus: resolvedFocused ? 'true' : 'false',
          disabled: isDisabled ? 'true' : 'false',
          invalid: isInvalid ? 'true' : 'false',
          readonly: isReadOnly ? 'true' : 'false',
          required: isRequired ? 'true' : 'false',
        },
        'data-hover': isHoveredProp ? 'true' : 'false',
        'data-focus': resolvedFocused ? 'true' : 'false',
        'data-disabled': isDisabled ? 'true' : 'false',
        'data-invalid': isInvalid ? 'true' : 'false',
        'data-readonly': isReadOnly ? 'true' : 'false',
        'data-required': isRequired ? 'true' : 'false',
      }),
      [isHoveredProp, resolvedFocused, isDisabled, isInvalid, isReadOnly, isRequired],
    )

    const ctxValue = useMemo<InputContextValue>(
      () => ({
        variant,
        size,
        isDisabled,
        isInvalid,
        isReadOnly,
        isRequired,
        isFocused: resolvedFocused,
        isHovered: isHoveredProp,
        setIsFocused,
        inputFieldRef,
      }),
      [variant, size, isDisabled, isInvalid, isReadOnly, isRequired, resolvedFocused, isHoveredProp],
    )

    return (
      <InputContext.Provider value={ctxValue}>
        <View
          ref={ref}
          {...props}
          {...(dataAttrs as any)}
          className={cn(
            inputBase,
            inputSizeClasses[size],
            inputVariantClasses[variant],
            className,
          )}
        >
          {children}
        </View>
      </InputContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// InputField
// ---------------------------------------------------------------------------

interface InputFieldProps extends TextInputProps {
  className?: string
  type?: 'text' | 'password'
  variant?: InputVariant
}

const InputField = React.forwardRef<TextInput, InputFieldProps>(
  ({ className, type = 'text', variant: _variant, onFocus, onBlur, onKeyPress, ...props }, ref) => {
    const {
      variant,
      size,
      isDisabled,
      isInvalid,
      isReadOnly,
      isRequired,
      isFocused,
      isHovered,
      setIsFocused,
      inputFieldRef,
    } = useInputContext()

    const editable = useMemo(() => {
      if (props.editable !== undefined) return props.editable
      return !(isDisabled || isReadOnly)
    }, [isDisabled, isReadOnly, props.editable])

    const mergedRef = useMergedRefs(ref, inputFieldRef)

    const dataAttrs: DataSetProps = useMemo(
      () => ({
        dataSet: {
          focus: isFocused ? 'true' : 'false',
          invalid: isInvalid ? 'true' : 'false',
          readonly: isReadOnly ? 'true' : 'false',
          required: isRequired ? 'true' : 'false',
          hover: isHovered ? 'true' : 'false',
          disabled: isDisabled ? 'true' : 'false',
        },
        'data-focus': isFocused ? 'true' : 'false',
        'data-invalid': isInvalid ? 'true' : 'false',
        'data-readonly': isReadOnly ? 'true' : 'false',
        'data-required': isRequired ? 'true' : 'false',
        'data-hover': isHovered ? 'true' : 'false',
        'data-disabled': isDisabled ? 'true' : 'false',
      }),
      [isFocused, isInvalid, isReadOnly, isRequired, isHovered, isDisabled],
    )

    return (
      <TextInput
        ref={mergedRef}
        {...props}
        {...(dataAttrs as any)}
        editable={editable}
        secureTextEntry={props.secureTextEntry || type === 'password'}
        accessible
        aria-label={props['aria-label'] ?? 'Input Field'}
        aria-required={isRequired}
        aria-invalid={isInvalid}
        aria-disabled={isDisabled}
        aria-selected={Platform.OS !== 'web' ? isFocused : undefined}
        accessibilityElementsHidden={isDisabled}
        readOnly={!editable}
        onKeyPress={(e) => {
          e.persist?.()
          onKeyPress?.(e)
        }}
        onFocus={(e) => {
          setIsFocused(true)
          onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          onBlur?.(e)
        }}
        className={cn(
          inputFieldBase,
          inputFieldVariantClasses[variant],
          inputFieldSizeClasses[size],
          className,
        )}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// InputSlot
// ---------------------------------------------------------------------------

interface InputSlotProps extends PressableProps {
  className?: string
  focusOnPress?: boolean
  children?: React.ReactNode
}

const InputSlot = React.forwardRef<View, InputSlotProps>(
  ({ className, onPress, focusOnPress = true, children, ...props }, ref) => {
    const { inputFieldRef, isDisabled } = useInputContext()

    const dataAttrs: DataSetProps = useMemo(
      () => ({
        dataSet: { disabled: isDisabled ? 'true' : 'false' },
        'data-disabled': isDisabled ? 'true' : 'false',
      }),
      [isDisabled],
    )

    return (
      <Pressable
        ref={ref}
        {...props}
        {...(dataAttrs as any)}
        accessibilityElementsHidden
        tabIndex={-1}
        onPress={(e) => {
          onPress?.(e)
          if (focusOnPress) inputFieldRef.current?.focus()
        }}
        className={cn(inputSlotBase, className)}
      >
        {children}
      </Pressable>
    )
  },
)

// ---------------------------------------------------------------------------
// InputIcon
// ---------------------------------------------------------------------------

type InputIconProps = {
  as?: React.ElementType
  size?: keyof typeof inputIconSizeClasses | number
  className?: string
  height?: number
  width?: number
  color?: string
} & Record<string, any>

const InputIcon = React.forwardRef<unknown, InputIconProps>(
  ({ as: IconComponent, size, className, height, width, color, ...props }, ref) => {
    if (!IconComponent) return null

    const { size: parentSize } = useInputContext()

    // If explicit numeric size, use it directly
    if (typeof size === 'number') {
      return (
        <IconComponent
          ref={ref}
          size={size}
          color={color}
          className={cn(inputIconBase, className as string)}
          {...props}
        />
      )
    }

    // If explicit height/width without size, skip size classes
    if ((height !== undefined || width !== undefined) && size === undefined) {
      return (
        <IconComponent
          ref={ref}
          height={height}
          width={width}
          color={color}
          className={cn(inputIconBase, className as string)}
          {...props}
        />
      )
    }

    // Resolve size from prop or parent
    const resolvedSize = (size as string) ?? parentSize
    const sizeClass = inputIconSizeClasses[resolvedSize] ?? inputIconSizeClasses.md
    const numericSize = inputIconNumericSize[resolvedSize] ?? 18

    return (
      <IconComponent
        ref={ref}
        size={numericSize}
        color={color}
        className={cn(inputIconBase, sizeClass, className as string)}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function useMergedRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(
    (node: T | null) => {
      for (const r of refs) {
        if (typeof r === 'function') r(node)
        else if (r && typeof r === 'object')
          (r as React.MutableRefObject<T | null>).current = node
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  )
}

// ---------------------------------------------------------------------------
// Display names & export
// ---------------------------------------------------------------------------

Input.displayName = 'Input'
InputField.displayName = 'InputField'
InputSlot.displayName = 'InputSlot'
InputIcon.displayName = 'InputIcon'

export { Input, InputField, InputIcon, InputSlot }
