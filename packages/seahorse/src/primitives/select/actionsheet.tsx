'use client'

import React, { createContext, useContext } from 'react'
import {
  Pressable,
  View,
  Text,
  ScrollView,
  VirtualizedList,
  FlatList,
  SectionList,
  Modal,
  Platform,
  type ScrollViewProps,
} from 'react-native'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type ActionsheetContextValue = {
  isOpen: boolean
  onClose: () => void
}

const ActionsheetContext = createContext<ActionsheetContextValue>({
  isOpen: false,
  onClose: () => {},
})

// ---------------------------------------------------------------------------
// Actionsheet (Root / Portal)
// ---------------------------------------------------------------------------

type ActionsheetProps = {
  isOpen?: boolean
  onClose?: () => void
  onOpen?: () => void
  children?: React.ReactNode
  className?: string
}

const Actionsheet = React.forwardRef<React.ElementRef<typeof View>, ActionsheetProps>(
  ({ isOpen = false, onClose = () => {}, children, className }, ref) => {
    return (
      <ActionsheetContext.Provider value={{ isOpen, onClose }}>
        <Modal
          visible={isOpen}
          transparent
          animationType="slide"
          onRequestClose={onClose}
          statusBarTranslucent
        >
          <View
            ref={ref}
            className={cn('w-full h-full', Platform.OS === 'web' && 'pointer-events-none', className)}
          >
            {children}
          </View>
        </Modal>
      </ActionsheetContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// ActionsheetBackdrop
// ---------------------------------------------------------------------------

type ActionsheetBackdropProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  className?: string
}

const ActionsheetBackdrop = React.forwardRef<React.ElementRef<typeof Pressable>, ActionsheetBackdropProps>(
  ({ className, ...props }, ref) => {
    const { onClose } = useContext(ActionsheetContext)

    return (
      <Pressable
        ref={ref}
        onPress={onClose}
        className={cn(
          'absolute left-0 top-0 right-0 bottom-0 bg-background-dark opacity-50',
          Platform.OS === 'web' && 'cursor-default pointer-events-auto',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// ActionsheetContent
// ---------------------------------------------------------------------------

type ActionsheetContentProps = React.ComponentPropsWithoutRef<typeof View> & {
  className?: string
}

const ActionsheetContent = React.forwardRef<React.ElementRef<typeof View>, ActionsheetContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          'items-center rounded-tl-3xl rounded-tr-3xl p-2 bg-background-0 shadow-lg mt-auto',
          Platform.OS === 'web' && 'pointer-events-auto select-none',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// ActionsheetItem
// ---------------------------------------------------------------------------

type ActionsheetItemProps = React.ComponentPropsWithoutRef<typeof Pressable> & {
  className?: string
}

const ActionsheetItem = React.forwardRef<React.ElementRef<typeof Pressable>, ActionsheetItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(
          'w-full flex-row items-center p-3 rounded-sm active:bg-background-100',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// ActionsheetItemText
// ---------------------------------------------------------------------------

type ActionsheetItemTextProps = React.ComponentPropsWithoutRef<typeof Text> & {
  className?: string
  size?: string
  isTruncated?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
}

const textSizeMap: Record<string, string> = {
  '2xs': 'text-2xs',
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

const ActionsheetItemText = React.forwardRef<React.ElementRef<typeof Text>, ActionsheetItemTextProps>(
  ({ className, size = 'md', isTruncated, bold, underline, strikeThrough, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          'text-typography-700 font-normal tracking-md text-left mx-2',
          textSizeMap[size],
          bold && 'font-bold',
          underline && 'underline',
          strikeThrough && 'line-through',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// ActionsheetDragIndicator / Wrapper
// ---------------------------------------------------------------------------

type ActionsheetDragIndicatorProps = React.ComponentPropsWithoutRef<typeof View> & { className?: string }

const ActionsheetDragIndicator = React.forwardRef<React.ElementRef<typeof View>, ActionsheetDragIndicatorProps>(
  ({ className, ...props }, ref) => {
    return <View ref={ref} className={cn('w-16 h-1 bg-background-400 rounded-full', className)} {...props} />
  },
)

type ActionsheetDragIndicatorWrapperProps = React.ComponentPropsWithoutRef<typeof View> & { className?: string }

const ActionsheetDragIndicatorWrapper = React.forwardRef<
  React.ElementRef<typeof View>,
  ActionsheetDragIndicatorWrapperProps
>(({ className, ...props }, ref) => {
  return <View ref={ref} className={cn('w-full py-1 items-center', className)} {...props} />
})

// ---------------------------------------------------------------------------
// List wrappers (thin passthrough)
// ---------------------------------------------------------------------------

const ActionsheetScrollView = React.forwardRef<
  React.ElementRef<typeof ScrollView>,
  ScrollViewProps & { className?: string }
>(({ className, ...props }, ref) => {
  return <ScrollView ref={ref} className={cn('w-full h-auto', className)} {...props} />
})

const ActionsheetVirtualizedList = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  return <VirtualizedList ref={ref} className={cn('w-full h-auto', className)} {...(props as any)} />
})

const ActionsheetFlatList = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  return <FlatList ref={ref} className={cn('w-full h-auto', className)} {...(props as any)} />
})

const ActionsheetSectionList = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  return <SectionList ref={ref} className={cn('w-full h-auto', className)} {...(props as any)} />
})

type ActionsheetSectionHeaderTextProps = React.ComponentPropsWithoutRef<typeof Text> & {
  className?: string
  size?: string
  isTruncated?: boolean
  bold?: boolean
  underline?: boolean
  strikeThrough?: boolean
  sub?: boolean
  italic?: boolean
  highlight?: boolean
}

const ActionsheetSectionHeaderText = React.forwardRef<
  React.ElementRef<typeof Text>,
  ActionsheetSectionHeaderTextProps
>(({ className, size = 'xs', isTruncated, bold, underline, strikeThrough, sub, italic, highlight, ...props }, ref) => {
  return (
    <Text
      ref={ref}
      className={cn(
        'leading-5 font-bold font-heading my-0 text-typography-500 p-3 uppercase',
        textSizeMap[size],
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
})

// ---------------------------------------------------------------------------
// Display names
// ---------------------------------------------------------------------------

Actionsheet.displayName = 'Actionsheet'
ActionsheetBackdrop.displayName = 'ActionsheetBackdrop'
ActionsheetContent.displayName = 'ActionsheetContent'
ActionsheetItem.displayName = 'ActionsheetItem'
ActionsheetItemText.displayName = 'ActionsheetItemText'
ActionsheetDragIndicator.displayName = 'ActionsheetDragIndicator'
ActionsheetDragIndicatorWrapper.displayName = 'ActionsheetDragIndicatorWrapper'
ActionsheetScrollView.displayName = 'ActionsheetScrollView'
ActionsheetVirtualizedList.displayName = 'ActionsheetVirtualizedList'
ActionsheetFlatList.displayName = 'ActionsheetFlatList'
ActionsheetSectionList.displayName = 'ActionsheetSectionList'
ActionsheetSectionHeaderText.displayName = 'ActionsheetSectionHeaderText'

export {
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
}
