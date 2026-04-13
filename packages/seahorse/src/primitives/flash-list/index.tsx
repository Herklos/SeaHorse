import React from 'react'
import { LegendList } from '@legendapp/list'
import type { FlatListProps } from 'react-native'

export type FlashListProps<T> = FlatListProps<T> & {
  estimatedItemSize?: number
  recycleItems?: boolean
}

export function FlashList<T>({
  estimatedItemSize: _,
  recycleItems = false,
  style,
  ...rest
}: FlashListProps<T>) {
  return (
    <LegendList
      {...(rest as any)}
      style={[{ flex: 1 }, style]}
      recycleItems={recycleItems}
      drawDistance={250}
    />
  )
}
