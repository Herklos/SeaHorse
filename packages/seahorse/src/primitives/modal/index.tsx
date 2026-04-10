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

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'full'

interface ModalContextValue {
  onClose: () => void
  size: ModalSize
}

const ModalContext = createContext<ModalContextValue>({
  onClose: () => {},
  size: 'md',
})

const useModalContext = () => useContext(ModalContext)

// ---------------------------------------------------------------------------
// Size mapping
// ---------------------------------------------------------------------------

const sizeClasses: Record<ModalSize, string> = {
  xs: 'w-[60%] max-w-[360px]',
  sm: 'w-[70%] max-w-[420px]',
  md: 'w-[80%] max-w-[510px]',
  lg: 'w-[90%] max-w-[640px]',
  full: 'w-full',
}

// ---------------------------------------------------------------------------
// Modal (root)
// ---------------------------------------------------------------------------

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  size?: ModalSize
  children: React.ReactNode
  finalFocusRef?: React.RefObject<any>
  className?: string
}

const Modal = React.forwardRef<View, ModalProps>(
  ({ isOpen, onClose, size = 'md', children, className, ...props }, ref) => {
    return (
      <ModalContext.Provider value={{ onClose, size }}>
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
      </ModalContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// ModalBackdrop
// ---------------------------------------------------------------------------

interface ModalBackdropProps extends PressableProps {
  className?: string
}

const ModalBackdrop = React.forwardRef<View, ModalBackdropProps>(
  ({ className, ...props }, ref) => {
    const { onClose } = useModalContext()

    return (
      <Pressable
        ref={ref}
        onPress={onClose}
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
// ModalContent
// ---------------------------------------------------------------------------

interface ModalContentProps extends ViewProps {
  className?: string
}

const ModalContent = React.forwardRef<View, ModalContentProps>(
  ({ className, ...props }, ref) => {
    const { size } = useModalContext()

    return (
      <View
        ref={ref}
        className={cn(
          'bg-background-0 rounded-xl overflow-hidden border border-outline-100 shadow-hard-2 p-6',
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// ModalHeader
// ---------------------------------------------------------------------------

interface ModalHeaderProps extends ViewProps {
  className?: string
}

const ModalHeader = React.forwardRef<View, ModalHeaderProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('justify-between items-center flex-row', className)}
      {...props}
    />
  ),
)

// ---------------------------------------------------------------------------
// ModalBody
// ---------------------------------------------------------------------------

interface ModalBodyProps extends ScrollViewProps {
  className?: string
}

const ModalBody = React.forwardRef<ScrollView, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <ScrollView ref={ref} className={cn('mt-2 mb-6', className)} {...props} />
  ),
)

// ---------------------------------------------------------------------------
// ModalFooter
// ---------------------------------------------------------------------------

interface ModalFooterProps extends ViewProps {
  className?: string
}

const ModalFooter = React.forwardRef<View, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn('flex-row justify-end items-center gap-2', className)}
      {...props}
    />
  ),
)

// ---------------------------------------------------------------------------
// ModalCloseButton
// ---------------------------------------------------------------------------

interface ModalCloseButtonProps extends PressableProps {
  className?: string
}

const ModalCloseButton = React.forwardRef<View, ModalCloseButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { onClose } = useModalContext()

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
  },
)

// ---------------------------------------------------------------------------
// Display names
// ---------------------------------------------------------------------------

Modal.displayName = 'Modal'
ModalBackdrop.displayName = 'ModalBackdrop'
ModalContent.displayName = 'ModalContent'
ModalHeader.displayName = 'ModalHeader'
ModalBody.displayName = 'ModalBody'
ModalFooter.displayName = 'ModalFooter'
ModalCloseButton.displayName = 'ModalCloseButton'

export {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
}
