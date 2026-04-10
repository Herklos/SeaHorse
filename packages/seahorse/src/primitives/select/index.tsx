'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Pressable, View, TextInput, Text, Platform } from 'react-native'
import { cn } from '../../utils/cn'
import { Check, ChevronDown } from 'lucide-react-native'
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetScrollView,
  ActionsheetVirtualizedList,
  ActionsheetFlatList,
  ActionsheetSectionList,
  ActionsheetSectionHeaderText,
} from './actionsheet'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type SelectContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  selectedValue: string | undefined
  selectedLabel: string | undefined
  onValueChange: (value: string, label?: string) => void
  size: 'sm' | 'md' | 'lg' | 'xl'
  variant: 'outline' | 'underlined' | 'rounded'
}

const SelectContext = createContext<SelectContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  selectedValue: undefined,
  selectedLabel: undefined,
  onValueChange: () => {},
  size: 'md',
  variant: 'outline',
})

// ---------------------------------------------------------------------------
// Size / variant maps
// ---------------------------------------------------------------------------

const triggerHeight: Record<string, string> = {
  sm: 'h-9',
  md: 'h-10',
  lg: 'h-11',
  xl: 'h-12',
}

const inputTextSize: Record<string, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
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
// Select (Root)
// ---------------------------------------------------------------------------

type SelectProps = {
  selectedValue?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpen?: () => void
  onClose?: () => void
  isDisabled?: boolean
  children?: React.ReactNode
  className?: string
}

const Select = React.forwardRef<React.ElementRef<typeof View>, SelectProps>(
  ({ selectedValue: controlledValue, defaultValue, onValueChange, onOpen, onClose: onCloseP, isDisabled, children, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
    const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined)

    const isControlled = controlledValue !== undefined
    const currentValue = isControlled ? controlledValue : uncontrolledValue

    const open = useCallback(() => {
      if (isDisabled) return
      setIsOpen(true)
      onOpen?.()
    }, [isDisabled, onOpen])

    const close = useCallback(() => {
      setIsOpen(false)
      onCloseP?.()
    }, [onCloseP])

    const handleValueChange = useCallback(
      (value: string, label?: string) => {
        if (!isControlled) setUncontrolledValue(value)
        if (label) setSelectedLabel(label)
        onValueChange?.(value)
        close()
      },
      [isControlled, onValueChange, close],
    )

    return (
      <SelectContext.Provider
        value={{
          isOpen,
          open,
          close,
          selectedValue: currentValue,
          selectedLabel,
          onValueChange: handleValueChange,
          size: 'md',
          variant: 'outline',
        }}
      >
        <View ref={ref} className={cn('', className)}>
          {children}
        </View>
      </SelectContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// SelectTrigger
// ---------------------------------------------------------------------------

type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'outline' | 'underlined' | 'rounded'
  className?: string
}

const SelectTrigger = React.forwardRef<React.ElementRef<typeof Pressable>, SelectTriggerProps>(
  ({ size = 'md', variant = 'outline', className, children, ...props }, ref) => {
    const { open } = useContext(SelectContext)

    return (
      <Pressable
        ref={ref}
        onPress={open}
        className={cn(
          'border border-background-300 flex-row items-center overflow-hidden',
          triggerHeight[size],
          variant === 'rounded' ? 'rounded-full' : variant === 'underlined' ? 'border-0 border-b rounded-none' : 'rounded-lg',
          className,
        )}
        {...props}
      >
        {children}
      </Pressable>
    )
  },
)

// ---------------------------------------------------------------------------
// SelectInput
// ---------------------------------------------------------------------------

type SelectInputProps = React.ComponentPropsWithoutRef<typeof TextInput> & {
  placeholder?: string
  className?: string
}

const SelectInput = React.forwardRef<React.ElementRef<typeof TextInput>, SelectInputProps>(
  ({ placeholder, className, ...props }, ref) => {
    const { selectedValue, selectedLabel } = useContext(SelectContext)

    return (
      <TextInput
        ref={ref}
        value={selectedLabel ?? selectedValue ?? ''}
        placeholder={placeholder}
        editable={false}
        pointerEvents="none"
        className={cn(
          'py-auto px-3 h-full text-typography-900 flex-1',
          Platform.OS === 'web' && 'outline-none w-full',
          Platform.OS === 'ios' && 'leading-[0px]',
          'placeholder:text-typography-500',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// SelectIcon
// ---------------------------------------------------------------------------

type SelectIconProps = {
  as?: React.ElementType
  size?: string | number
  className?: string
  [key: string]: any
}

const SelectIcon = React.forwardRef<any, SelectIconProps>(
  ({ as: IconComponent, size, className, ...props }, ref) => {
    const Component = (IconComponent ?? ChevronDown) as React.ComponentType<any>
    const sizeClass = typeof size === 'string' ? iconSizeMap[size] : undefined

    return (
      <Component
        ref={ref}
        className={cn('text-background-500 fill-none mr-2', sizeClass ?? 'h-[18px] w-[18px]', className as string | undefined)}
        {...(typeof size === 'number' ? { size } : {})}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// Portal components (delegates to Actionsheet)
// ---------------------------------------------------------------------------

type SelectPortalProps = {
  children?: React.ReactNode
  className?: string
}

const SelectPortal = React.forwardRef<any, SelectPortalProps>(({ children, className }, ref) => {
  const { isOpen, close } = useContext(SelectContext)

  return (
    <Actionsheet ref={ref} isOpen={isOpen} onClose={close} className={className}>
      {children}
    </Actionsheet>
  )
})

const SelectBackdrop = ActionsheetBackdrop
const SelectContent = ActionsheetContent
const SelectDragIndicator = ActionsheetDragIndicator
const SelectDragIndicatorWrapper = ActionsheetDragIndicatorWrapper
const SelectScrollView = ActionsheetScrollView
const SelectVirtualizedList = ActionsheetVirtualizedList
const SelectFlatList = ActionsheetFlatList
const SelectSectionList = ActionsheetSectionList
const SelectSectionHeaderText = ActionsheetSectionHeaderText

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

type SelectItemProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  label: string
  value: string
  isDisabled?: boolean
  className?: string
}

const SelectItem = React.forwardRef<React.ElementRef<typeof Pressable>, SelectItemProps>(
  ({ label, value, isDisabled = false, className, ...props }, ref) => {
    const { selectedValue, onValueChange } = useContext(SelectContext)
    const isSelected = selectedValue === value

    return (
      <Pressable
        ref={ref}
        onPress={() => {
          if (!isDisabled) onValueChange(value, label)
        }}
        disabled={isDisabled}
        className={cn(
          'w-full flex-row items-center p-3 rounded-sm',
          isSelected && 'bg-background-100',
          isDisabled && 'opacity-40',
          !isDisabled && 'active:bg-background-100',
          className,
        )}
        {...props}
      >
        <Text className={cn('text-typography-700 font-normal text-base text-left mx-2 flex-1')}>
          {label}
        </Text>
        {isSelected && <Check size={16} className="text-typography-900" />}
      </Pressable>
    )
  },
)

// ---------------------------------------------------------------------------
// Display names
// ---------------------------------------------------------------------------

Select.displayName = 'Select'
SelectTrigger.displayName = 'SelectTrigger'
SelectInput.displayName = 'SelectInput'
SelectIcon.displayName = 'SelectIcon'
SelectPortal.displayName = 'SelectPortal'
SelectItem.displayName = 'SelectItem'

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
  SelectVirtualizedList,
  SelectFlatList,
  SelectSectionList,
  SelectSectionHeaderText,
}
