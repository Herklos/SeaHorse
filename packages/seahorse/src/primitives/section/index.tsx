import React from 'react'
import { Section as RNSection } from '@expo/html-elements'
import { styled as cssInterop } from 'react-native-css'
import type { ViewProps } from 'react-native'

cssInterop(RNSection, { className: 'style' })

type SectionProps = ViewProps & { className?: string }

const Section = React.forwardRef<any, SectionProps>(
  ({ className, ...props }, ref) => (
    // @ts-ignore
    <RNSection ref={ref} className={className} {...props} />
  ),
)

Section.displayName = 'Section'
export { Section }
