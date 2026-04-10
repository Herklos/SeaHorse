import React from 'react'
import { cn } from '../../utils/cn'

type FooterProps = React.ComponentPropsWithoutRef<'footer'> & { className?: string }

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, ...props }, ref) => (
    <footer ref={ref} className={cn('flex flex-col min-h-0 min-w-0', className)} {...props} />
  ),
)

Footer.displayName = 'Footer'
export { Footer }
