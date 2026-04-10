import React from 'react'
import { cn } from '../../utils/cn'

type AnchorProps = React.ComponentPropsWithoutRef<'a'> & { className?: string }

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn('cursor-pointer', className)}
      {...props}
    />
  ),
)

Anchor.displayName = 'Anchor'
export { Anchor }
