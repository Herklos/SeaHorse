import React from 'react'
import { cn } from '../../utils/cn'

type ImageSource = { uri?: string } | number | null | undefined

type ImageBackgroundProps = React.ComponentPropsWithoutRef<'div'> & {
  source?: ImageSource
  className?: string
  imageClassName?: string
}

const ImageBackground = React.forwardRef<HTMLDivElement, ImageBackgroundProps>(
  ({ source, className, imageClassName: _imageClassName, style, children, ...props }, ref) => {
    const uri = source && typeof source === 'object' && 'uri' in source ? source.uri : undefined
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={{
          ...(uri ? { backgroundImage: `url(${uri})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
          ...(style as React.CSSProperties),
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)

ImageBackground.displayName = 'ImageBackground'
export { ImageBackground }
