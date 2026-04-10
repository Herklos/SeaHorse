import * as Haptics from 'expo-haptics'
import { Platform } from 'react-native'

export const lightHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }
}

export const mediumHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }
}
