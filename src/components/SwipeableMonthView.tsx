import { ReactNode } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SwipeableMonthViewProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disableSwipeLeft?: boolean;
  children: ReactNode;
}

const SWIPE_THRESHOLD = 50;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDE_DURATION = 200;
const TIMING_CONFIG = { duration: SLIDE_DURATION, easing: Easing.out(Easing.cubic) };

export function SwipeableMonthView({ onSwipeLeft, onSwipeRight, disableSwipeLeft, children }: SwipeableMonthViewProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX * 0.3;
      opacity.value = 1 - Math.min(Math.abs(e.translationX) / (SCREEN_WIDTH * 0.4), 1) * 0.5;
    })
    .onEnd((e) => {
      const swipedRight = e.translationX > SWIPE_THRESHOLD && onSwipeRight;
      const swipedLeft = e.translationX < -SWIPE_THRESHOLD && onSwipeLeft && !disableSwipeLeft;

      if (swipedRight || swipedLeft) {
        const direction = e.translationX > 0 ? 1 : -1;
        // Slide out and fade
        translateX.value = withTiming(direction * SCREEN_WIDTH * 0.4, TIMING_CONFIG);
        opacity.value = withTiming(0, TIMING_CONFIG);
        // After animation completes, reset position and change month
        setTimeout(() => {
          translateX.value = 0;
          const cb = swipedRight ? onSwipeRight! : onSwipeLeft!;
          cb();
          requestAnimationFrame(() => {
            opacity.value = withTiming(1, { duration: 150 });
          });
        }, SLIDE_DURATION);
      } else {
        translateX.value = withTiming(0, TIMING_CONFIG);
        opacity.value = withTiming(1, TIMING_CONFIG);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
