import React from 'react'
import { Nav as RNNav } from '@expo/html-elements'
import { styled as cssInterop } from 'react-native-css'
import type { ViewProps } from 'react-native'

cssInterop(RNNav, { className: 'style' })

type NavProps = ViewProps & { className?: string }

const Nav = React.forwardRef<any, NavProps>(
  ({ className, ...props }, ref) => (
    // @ts-ignore
    <RNNav ref={ref} className={className} {...props} />
  ),
)

Nav.displayName = 'Nav'
export { Nav }
