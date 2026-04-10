import React from 'react'
import { ImageBackground as RNImageBackground } from 'react-native'

const ImageBackground = React.forwardRef<
  React.ElementRef<typeof RNImageBackground>,
  React.ComponentProps<typeof RNImageBackground>
>(({ className, ...props }, ref) => (
  <RNImageBackground ref={ref} className={className} {...props} />
))

ImageBackground.displayName = 'ImageBackground'
export { ImageBackground }
