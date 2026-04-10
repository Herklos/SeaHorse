import React from 'react'
import { Box, Button, ButtonIcon, ButtonText } from '../../primitives'
import { ArrowLeft } from 'lucide-react-native'
import { cn } from '../../utils/cn'

export function BackButton({
  text,
  className,
  onPress,
}: {
  text: string
  className?: string
  onPress: () => void
}) {
  return (
    <Box className={cn('flex flex-row', className)}>
      <Button variant="ghost" size="sm" className="p-0" onPress={onPress}>
        <Box className="flex-row items-center">
          <ButtonIcon as={ArrowLeft} className="mr-1 h-4 w-4 text-typography-500" />
          <ButtonText className="text-md text-typography-500">{text}</ButtonText>
        </Box>
      </Button>
    </Box>
  )
}
