'use client';
import React from 'react';
import { View, TextInput } from 'react-native';
import type { ViewProps, TextInputProps } from 'react-native';
import { cn } from '../../utils/cn';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type TextareaContextValue = {
  size: 'sm' | 'md' | 'lg' | 'xl';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
};

const TextareaContext = React.createContext<TextareaContextValue>({
  size: 'md',
});

// ---------------------------------------------------------------------------
// Variant maps
// ---------------------------------------------------------------------------

const textareaVariantClasses = {
  default:
    'data-[focus=true]:border-primary-700 data-[focus=true]:web:ring-1 data-[focus=true]:web:ring-inset data-[focus=true]:web:ring-indicator-primary data-[invalid=true]:border-error-700 data-[invalid=true]:web:ring-1 data-[invalid=true]:web:ring-inset data-[invalid=true]:web:ring-indicator-error data-[invalid=true]:data-[hover=true]:border-error-700 data-[invalid=true]:data-[focus=true]:data-[hover=true]:border-primary-700 data-[invalid=true]:data-[focus=true]:data-[hover=true]:web:ring-1 data-[invalid=true]:data-[focus=true]:data-[hover=true]:web:ring-inset data-[invalid=true]:data-[focus=true]:data-[hover=true]:web:ring-indicator-primary data-[invalid=true]:data-[disabled=true]:data-[hover=true]:border-error-700 data-[invalid=true]:data-[disabled=true]:data-[hover=true]:web:ring-1 data-[invalid=true]:data-[disabled=true]:data-[hover=true]:web:ring-inset data-[invalid=true]:data-[disabled=true]:data-[hover=true]:web:ring-indicator-error',
} as const;

const textareaBase =
  'w-full h-[100px] border border-background-300 rounded data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[focus=true]:data-[hover=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:bg-background-50 data-[disabled=true]:data-[hover=true]:border-background-300';

const inputBase =
  'p-2 web:outline-0 web:outline-none flex-1 color-typography-900 align-text-top placeholder:text-typography-500 web:cursor-text web:data-[disabled=true]:cursor-not-allowed';

const inputSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
} as const;

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

type TextareaProps = ViewProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
};

const Textarea = React.forwardRef<View, TextareaProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      isDisabled,
      isInvalid,
      isReadOnly,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useMemo<TextareaContextValue>(
      () => ({ size, isDisabled, isInvalid, isReadOnly }),
      [size, isDisabled, isInvalid, isReadOnly],
    );

    return (
      <TextareaContext.Provider value={ctx}>
        <View
          ref={ref}
          {...props}
          data-disabled={isDisabled ? true : undefined}
          data-invalid={isInvalid ? true : undefined}
          data-readonly={isReadOnly ? true : undefined}
          className={cn(textareaBase, textareaVariantClasses[variant], className)}
        />
      </TextareaContext.Provider>
    );
  },
);

// ---------------------------------------------------------------------------
// TextareaInput
// ---------------------------------------------------------------------------

type TextareaInputProps = TextInputProps;

const TextareaInput = React.forwardRef<TextInput, TextareaInputProps>(
  ({ className, ...props }, ref) => {
    const { size, isDisabled, isInvalid, isReadOnly } =
      React.useContext(TextareaContext);

    return (
      <TextInput
        ref={ref}
        multiline
        editable={!isDisabled && !isReadOnly}
        aria-disabled={isDisabled}
        aria-invalid={isInvalid}
        aria-readonly={isReadOnly}
        data-disabled={isDisabled ? true : undefined}
        data-invalid={isInvalid ? true : undefined}
        {...props}
        className={cn(inputBase, inputSizeClasses[size], className)}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
TextareaInput.displayName = 'TextareaInput';

export { Textarea, TextareaInput };
