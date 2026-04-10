import React from 'react'
import { cn } from '../../utils/cn'

type SectionProps = React.ComponentPropsWithoutRef<'section'> & { className?: string }

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={cn('flex flex-col min-h-0 min-w-0', className)} {...props} />
  ),
)

Section.displayName = 'Section'
export { Section }
