import React from 'react'
import { cn } from '../../utils/cn'

type NavProps = React.ComponentPropsWithoutRef<'nav'> & { className?: string }

const Nav = React.forwardRef<HTMLElement, NavProps>(
  ({ className, ...props }, ref) => (
    <nav ref={ref} className={cn('flex flex-row min-h-0 min-w-0', className)} {...props} />
  ),
)

Nav.displayName = 'Nav'
export { Nav }
