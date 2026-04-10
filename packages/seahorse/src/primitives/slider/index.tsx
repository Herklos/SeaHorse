'use client'
import React, { createContext, useContext, useCallback, useRef, useState } from 'react'
import { View, PanResponder, LayoutChangeEvent, Platform } from 'react-native'
import { cn } from '../../utils/cn'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type SliderContextValue = {
  size: 'sm' | 'md' | 'lg'
  orientation: 'horizontal' | 'vertical'
  isReversed: boolean
  percent: number
}

const SliderContext = createContext<SliderContextValue>({
  size: 'md',
  orientation: 'horizontal',
  isReversed: false,
  percent: 0,
})

// ---------------------------------------------------------------------------
// Size maps
// ---------------------------------------------------------------------------

const thumbSize: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const thumbPixels: Record<string, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

// ---------------------------------------------------------------------------
// Slider (Root)
// ---------------------------------------------------------------------------

type SliderProps = React.ComponentPropsWithoutRef<typeof View> & {
  value?: number
  defaultValue?: number
  minValue?: number
  maxValue?: number
  step?: number
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
  isReversed?: boolean
  isDisabled?: boolean
  onChange?: (value: number) => void
  onChangeEnd?: (value: number) => void
}

const Slider = React.forwardRef<React.ElementRef<typeof View>, SliderProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      minValue = 0,
      maxValue = 100,
      step = 1,
      size = 'md',
      orientation = 'horizontal',
      isReversed = false,
      isDisabled = false,
      onChange,
      onChangeEnd,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
    const currentValue = isControlled ? controlledValue : uncontrolledValue
    const trackLayout = useRef({ width: 0, height: 0, x: 0, y: 0 })

    const clampAndStep = useCallback(
      (raw: number) => {
        const stepped = Math.round((raw - minValue) / step) * step + minValue
        return Math.min(maxValue, Math.max(minValue, stepped))
      },
      [minValue, maxValue, step],
    )

    const valueFromPosition = useCallback(
      (pageX: number, pageY: number) => {
        const { width, height, x, y } = trackLayout.current
        const isHorizontal = orientation === 'horizontal'
        const trackLength = isHorizontal ? width : height
        if (trackLength === 0) return currentValue

        let ratio: number
        if (isHorizontal) {
          ratio = (pageX - x) / trackLength
        } else {
          ratio = 1 - (pageY - y) / trackLength
        }

        if (isReversed) ratio = 1 - ratio
        ratio = Math.max(0, Math.min(1, ratio))
        return clampAndStep(minValue + ratio * (maxValue - minValue))
      },
      [orientation, isReversed, minValue, maxValue, clampAndStep, currentValue],
    )

    const updateValue = useCallback(
      (newVal: number) => {
        if (!isControlled) setUncontrolledValue(newVal)
        onChange?.(newVal)
      },
      [isControlled, onChange],
    )

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isDisabled,
        onMoveShouldSetPanResponder: () => !isDisabled,
        onPanResponderGrant: (e) => {
          const newVal = valueFromPosition(e.nativeEvent.pageX, e.nativeEvent.pageY)
          updateValue(newVal)
        },
        onPanResponderMove: (e) => {
          const newVal = valueFromPosition(e.nativeEvent.pageX, e.nativeEvent.pageY)
          updateValue(newVal)
        },
        onPanResponderRelease: (e) => {
          const newVal = valueFromPosition(e.nativeEvent.pageX, e.nativeEvent.pageY)
          updateValue(newVal)
          onChangeEnd?.(newVal)
        },
      }),
    ).current

    const percent = maxValue === minValue ? 0 : ((currentValue - minValue) / (maxValue - minValue)) * 100

    const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
      const target = (e.nativeEvent as any).target
      if (Platform.OS === 'web' && target) {
        const rect = (target as unknown as HTMLElement).getBoundingClientRect()
        trackLayout.current = { width: rect.width, height: rect.height, x: rect.left, y: rect.top }
      } else {
        const { width, height } = e.nativeEvent.layout
        trackLayout.current = { ...trackLayout.current, width, height }
        ;(e.target as any)?.measureInWindow?.((x: number, y: number) => {
          trackLayout.current.x = x
          trackLayout.current.y = y
        })
      }
    }, [])

    const isHorizontal = orientation === 'horizontal'

    return (
      <SliderContext.Provider value={{ size, orientation, isReversed, percent }}>
        <View
          ref={ref}
          className={cn(
            'justify-center items-center',
            isHorizontal ? 'w-full' : 'h-full',
            isDisabled && 'opacity-40',
            isDisabled && Platform.OS === 'web' && 'pointer-events-none',
            className,
          )}
          onLayout={onTrackLayout}
          {...panResponder.panHandlers}
          {...props}
        >
          {children}
        </View>
      </SliderContext.Provider>
    )
  },
)

// ---------------------------------------------------------------------------
// SliderTrack
// ---------------------------------------------------------------------------

type SliderTrackProps = React.ComponentPropsWithoutRef<typeof View>

const SliderTrack = React.forwardRef<React.ElementRef<typeof View>, SliderTrackProps>(
  ({ className, ...props }, ref) => {
    const { size, orientation, isReversed } = useContext(SliderContext)
    const isHorizontal = orientation === 'horizontal'

    const trackThickness = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-1.5' : 'h-1'
    const trackThicknessV = size === 'sm' ? 'w-1' : size === 'lg' ? 'w-1.5' : 'w-[5px]'

    let flexDir: string
    if (isHorizontal) {
      flexDir = isReversed ? 'flex-row-reverse' : 'flex-row'
    } else {
      flexDir = isReversed ? 'flex-col' : 'flex-col-reverse'
    }

    return (
      <View
        ref={ref}
        className={cn(
          'bg-background-300 rounded-lg overflow-hidden',
          isHorizontal ? `w-full ${trackThickness}` : `h-full ${trackThicknessV}`,
          flexDir,
          className,
        )}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// SliderFilledTrack
// ---------------------------------------------------------------------------

type SliderFilledTrackProps = React.ComponentPropsWithoutRef<typeof View>

const SliderFilledTrack = React.forwardRef<React.ElementRef<typeof View>, SliderFilledTrackProps>(
  ({ className, style, ...props }, ref) => {
    const { orientation, percent } = useContext(SliderContext)
    const isHorizontal = orientation === 'horizontal'

    return (
      <View
        ref={ref}
        className={cn(
          'bg-primary-500',
          isHorizontal ? 'h-full' : 'w-full',
          className,
        )}
        style={[
          isHorizontal ? { width: `${percent}%` } : { height: `${percent}%` },
          style as any,
        ]}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// SliderThumb
// ---------------------------------------------------------------------------

type SliderThumbProps = React.ComponentPropsWithoutRef<typeof View>

const SliderThumb = React.forwardRef<React.ElementRef<typeof View>, SliderThumbProps>(
  ({ className, style, ...props }, ref) => {
    const { size, orientation, isReversed, percent } = useContext(SliderContext)
    const isHorizontal = orientation === 'horizontal'
    const thumbPx = thumbPixels[size] ?? 20

    const positionStyle = isHorizontal
      ? {
          left: `${percent}%`,
          marginLeft: -(thumbPx / 2),
        }
      : {
          bottom: `${percent}%`,
          marginBottom: -(thumbPx / 2),
        }

    return (
      <View
        ref={ref}
        className={cn(
          'bg-primary-500 absolute rounded-full shadow-hard-1',
          Platform.OS === 'web' && 'cursor-pointer',
          thumbSize[size],
          className,
        )}
        style={[positionStyle as any, style as any]}
        {...props}
      />
    )
  },
)

// ---------------------------------------------------------------------------
// Display names & exports
// ---------------------------------------------------------------------------

Slider.displayName = 'Slider'
SliderThumb.displayName = 'SliderThumb'
SliderTrack.displayName = 'SliderTrack'
SliderFilledTrack.displayName = 'SliderFilledTrack'

export { Slider, SliderThumb, SliderTrack, SliderFilledTrack }
