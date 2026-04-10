import React, { createContext, useContext } from 'react'
import {
  Modal as RNModal,
  Pressable,
  ScrollView,
  View,
  type ViewProps,
  type ScrollViewProps,
  type PressableProps,
} from 'react-native'
import { X } from 'lucide-react-native'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type AlertDialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'full'

interface AlertDialogContextValue {
  onClose: () => void
  size: AlertDialogSize
  closeOnOverlayClick: boolean
}

const AlertDialogContext = createContext<AlertDialogContextValue>({
  onClose: () => {},
  size: 'md',
  closeOnOverlayClick: false,
})

const useAlertDialogContext = () => useContext(AlertDialogContext)

// ---------------------------------------------------------------------------
// Size mapping
// ---------------------------------------------------------------------------

const sizeClasses: Record<AlertDialogSize, string> = {
  xs: 'w-[60%] max-w-[360px]',
  sm: 'w-[70%] max-w-[420px]',
  md: 'w-[80%] max-w-[510px]',
  lg: 'w-[90%] max-w-[640px]',
  full: 'w-full',
}

// ---------------------------------------------------------------------------
// AlertDialog (root)
// ---------------------------------------------------------------------------

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  size?: AlertDialogSize
  closeOnOverlayClick?: boolean
  children: React.ReactNode
  className?: string
}

const AlertDialog = React.forwardRef<View, AlertDialogProps>(
  (
    {
      isOpen,
      onClose,
      size = 'md',
      closeOnOverlayClick = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <AlertDialogContext.Provider value={{ onClose, size, closeOnOverlayClick }}>
        <RNModal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={onClose}
          statusBarTranslucent
        >
          <View
            ref={ref}
            className={cn(
              'w-full h-full justify-center items-center',
              className,
            )}
            {...props}
          >
            {children}
          </View>
        </RNModal>
      </AlertDialogContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// AlertDialogBackdrop
// ---------------------------------------------------------------------------

interface AlertDialogBackdropProps extends PressableProps {
  className?: string
}

const AlertDialogBackdrop = React.forwardRef<View, AlertDialogBackdropProps>(
  ({ className, ...props }, ref) => {
    const { onClose, closeOnOverlayClick } = useAlertDialogContext()

    return (
      <Pressable
        ref={ref}
        onPress={closeOnOverlayClick ? onClose : undefined}
        className={cn(
          'absolute left-0 top-0 right-0 bottom-0 bg-background-dark opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// AlertDialogContent
// ---------------------------------------------------------------------------

interface AlertDialogContentProps extends ViewProps {
  className?: string
}

const AlertDialogContent = React.forwardRef<View, AlertDialogContentProps>(
  ({ className, ...props }, ref) => {
    const { size } = useAlertDialogContext()

    return (
      <View
        ref={ref}
        className={cn(
          'bg-background-0 rounded-xl overflow-hidden border border-outline-100 p-6',
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// AlertDialogHeader
// ---------------------------------------------------------------------------

interface AlertDialogHeaderProps extends ViewProps {
  className?: string
}

const AlertDialogHeader = React.forwardRef<View, AlertDialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('justify-between items-center flex-row', className)}
      {...props}
    />
  ),
)

// ---------------------------------------------------------------------------
// AlertDialogBody
// ---------------------------------------------------------------------------

interface AlertDialogBodyProps extends ScrollViewProps {
  className?: string
}

const AlertDialogBody = React.forwardRef<ScrollView, AlertDialogBodyProps>(
  ({ className, ...props }, ref) => (
    <ScrollView ref={ref} className={cn('mt-2 mb-4', className)} {...props} />
  ),
)

// ---------------------------------------------------------------------------
// AlertDialogFooter
// ---------------------------------------------------------------------------

interface AlertDialogFooterProps extends ViewProps {
  className?: string
}

const AlertDialogFooter = React.forwardRef<View, AlertDialogFooterProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('flex-row justify-end items-center gap-3', className)}
      {...props}
    />
  ),
)

// ---------------------------------------------------------------------------
// AlertDialogCloseButton
// ---------------------------------------------------------------------------

interface AlertDialogCloseButtonProps extends PressableProps {
  className?: string
}

const AlertDialogCloseButton = React.forwardRef<
  View,
  AlertDialogCloseButtonProps
>(({ className, children, ...props }, ref) => {
  const { onClose } = useAlertDialogContext()

  return (
    <Pressable
      ref={ref}
      onPress={onClose}
      className={cn('z-10 rounded-full p-2 cursor-pointer web:hover:bg-background-50 web:transition-colors', className)}
      accessibilityRole="button"
      accessibilityLabel="Close"
      {...props}
    >
      {children ?? <X size={18} className="text-typography-500" />}
    </Pressable>
  )
})

// ---------------------------------------------------------------------------
// Display names
// ---------------------------------------------------------------------------

AlertDialog.displayName = 'AlertDialog'
AlertDialogContent.displayName = 'AlertDialogContent'
AlertDialogCloseButton.displayName = 'AlertDialogCloseButton'
AlertDialogHeader.displayName = 'AlertDialogHeader'
AlertDialogFooter.displayName = 'AlertDialogFooter'
AlertDialogBody.displayName = 'AlertDialogBody'
AlertDialogBackdrop.displayName = 'AlertDialogBackdrop'

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogBackdrop,
}
