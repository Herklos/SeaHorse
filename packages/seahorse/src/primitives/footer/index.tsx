import React from 'react'
import { Footer as RNFooter } from '@expo/html-elements'
import { styled as cssInterop } from 'react-native-css'
import type { ViewProps } from 'react-native'

cssInterop(RNFooter, { className: 'style' })

type FooterProps = ViewProps & { className?: string }

const Footer = React.forwardRef<any, FooterProps>(
  ({ className, ...props }, ref) => (
    // @ts-ignore
    <RNFooter ref={ref} className={className} {...props} />
  ),
)

Footer.displayName = 'Footer'
export { Footer }
