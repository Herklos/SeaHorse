'use client'
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { Text, View, ViewStyle } from 'react-native'
import { cn } from '../../utils/cn'
import {
  Motion,
  AnimatePresence,
  MotionComponentProps,
} from '@legendapp/motion'

// ---------------------------------------------------------------------------
// Motion wrapper
// ---------------------------------------------------------------------------

type IMotionViewProps = React.ComponentProps<typeof View> &
  MotionComponentProps<typeof View, ViewStyle, unknown, unknown, unknown>

const MotionView = Motion.View as React.ComponentType<IMotionViewProps>

// ---------------------------------------------------------------------------
// Style helpers
// ---------------------------------------------------------------------------

const actionClasses: Record<string, string> = {
  error: 'bg-error-800',
  warning: 'bg-warning-700',
  success: 'bg-success-700',
  info: 'bg-info-700',
  muted: 'bg-background-800',
}

const variantClasses: Record<string, string> = {
  solid: '',
  outline: 'border bg-background-0',
}

const outlineTitleColor: Record<string, string> = {
  error: 'text-error-800',
  warning: 'text-warning-800',
  success: 'text-success-800',
  info: 'text-info-800',
  muted: 'text-background-800',
}

const descVariantColor: Record<string, string> = {
  solid: 'text-typography-50',
  outline: 'text-typography-900',
}

const sizeClasses: Record<string, string> = {
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

// ---------------------------------------------------------------------------
// Toast style context (parent -> child variant passing)
// ---------------------------------------------------------------------------

type ToastStyleContextValue = {
  variant: string
  action: string
}

const ToastStyleContext = createContext<ToastStyleContextValue>({
  variant: 'solid',
  action: 'muted',
})

// ---------------------------------------------------------------------------
// Toast provider (manages toast queue + renders overlay)
// ---------------------------------------------------------------------------

type ToastEntry = {
  id: string
  placement: string
  duration: number
  render: (props: { id: string }) => React.ReactNode
}

type ToastContextValue = {
  show: (opts: {
    id?: string
    placement?: string
    duration?: number
    render: (props: { id: string }) => React.ReactNode
  }) => string
  close: (id: string) => void
  isActive: (id: string) => boolean
}

const ToastContext = createContext<ToastContextValue | null>(null)

function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  )

  const close = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (opts: {
      id?: string
      placement?: string
      duration?: number
      render: (props: { id: string }) => React.ReactNode
    }) => {
      const id = opts.id ?? Math.random().toString(36).slice(2)
      const duration = opts.duration ?? 3000
      const placement = opts.placement ?? 'top'

      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id)
        return [...filtered, { id, placement, duration, render: opts.render }]
      })

      if (duration > 0) {
        const timer = setTimeout(() => {
          close(id)
        }, duration)
        const existing = timersRef.current.get(id)
        if (existing) clearTimeout(existing)
        timersRef.current.set(id, timer)
      }

      return id
    },
    [close],
  )

  const isActive = useCallback(
    (id: string) => toasts.some((t) => t.id === id),
    [toasts],
  )

  return (
    <ToastContext.Provider value={{ show, close, isActive }}>
      {children}
      {/* Toast overlay */}
      <View
        pointerEvents="box-none"
        className="absolute top-0 left-0 right-0 z-50 items-center"
        style={{ position: 'absolute' }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <MotionView
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full items-center web:pointer-events-auto"
            >
              {toast.render({ id: toast.id })}
            </MotionView>
          ))}
        </AnimatePresence>
      </View>
    </ToastContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Toast (styled container)
// ---------------------------------------------------------------------------

type ToastProps = React.ComponentProps<typeof View> & {
  className?: string
  action?: 'error' | 'warning' | 'success' | 'info' | 'muted'
  variant?: 'solid' | 'outline'
}

const Toast = React.forwardRef<React.ComponentRef<typeof View>, ToastProps>(
  function Toast(
    { className, variant = 'solid', action = 'muted', ...props },
    ref,
  ) {
    return (
      <ToastStyleContext.Provider value={{ variant, action }}>
        <View
          ref={ref}
          className={cn(
            'p-4 m-1 rounded-lg gap-1 web:pointer-events-auto shadow-hard-5 border-outline-100',
            actionClasses[action],
            variantClasses[variant],
            className,
          )}
          {...props}
        />
      </ToastStyleContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// ToastTitle
// ---------------------------------------------------------------------------

type ToastTitleProps = React.ComponentProps<typeof Text> & {
  className?: string
  size?: keyof typeof sizeClasses
}

const ToastTitle = React.forwardRef<
  React.ComponentRef<typeof Text>,
  ToastTitleProps
>(function ToastTitle({ className, size = 'md', children, ...props }, ref) {
  const { variant, action } = useContext(ToastStyleContext)

  const colorClass =
    variant === 'outline' ? outlineTitleColor[action] : 'text-typography-0'

  return (
    <Text
      ref={ref}
      aria-live="assertive"
      aria-atomic="true"
      role="alert"
      className={cn(
        'font-medium font-body tracking-md text-left',
        colorClass,
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Text>
  )
})

// ---------------------------------------------------------------------------
// ToastDescription
// ---------------------------------------------------------------------------

type ToastDescriptionProps = React.ComponentProps<typeof Text> & {
  className?: string
  size?: keyof typeof sizeClasses
}

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof Text>,
  ToastDescriptionProps
>(function ToastDescription({ className, size = 'md', ...props }, ref) {
  const { variant } = useContext(ToastStyleContext)

  return (
    <Text
      ref={ref}
      className={cn(
        'font-normal font-body tracking-md text-left',
        descVariantColor[variant] ?? 'text-typography-50',
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
})

Toast.displayName = 'Toast'
ToastTitle.displayName = 'ToastTitle'
ToastDescription.displayName = 'ToastDescription'

export { useToast, Toast, ToastTitle, ToastDescription, ToastProvider }
