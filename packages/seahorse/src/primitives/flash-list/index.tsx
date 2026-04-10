import React from 'react'
import { LegendList } from '@legendapp/list'
import type { FlatListProps } from 'react-native'

export type FlashListProps<T> = FlatListProps<T> & {
  estimatedItemSize?: number
}

export function FlashList<T>({
  estimatedItemSize: _,
  style,
  ...rest
}: FlashListProps<T>) {
  return (
    <LegendList
      {...(rest as any)}
      style={[{ flex: 1 }, style]}
      recycleItems
      drawDistance={250}
    />
  )
}
