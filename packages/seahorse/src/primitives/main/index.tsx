import React from 'react'
import { Main as RNMain } from '@expo/html-elements'
import { styled as cssInterop } from 'react-native-css'
import type { ViewProps } from 'react-native'

cssInterop(RNMain, { className: 'style' })

type MainProps = ViewProps & { className?: string }

const Main = React.forwardRef<any, MainProps>(
  ({ className, ...props }, ref) => (
    // @ts-ignore
    <RNMain ref={ref} className={className} {...props} />
  ),
)

Main.displayName = 'Main'
export { Main }
