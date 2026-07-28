import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  TextInput,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewProps,
  type TextInputProps,
} from "react-native";

/** Breathing room left between the focused field and the top of the keyboard. */
const GAP = 16;

const RevealContext = createContext<() => void>(() => {});

/**
 * Scrolls the currently focused input back above the keyboard.
 *
 * Call it from a TextInput's `onFocus`: the keyboard only reports "did show"
 * once, so moving focus from one field to another while it is already open
 * needs its own nudge.
 */
export function useRevealFocusedInput() {
  return useContext(RevealContext);
}

/**
 * TextInput that asks the enclosing <KeyboardAwareScrollView> to scroll it into
 * view when it gains focus. Must be rendered inside one to have any effect.
 */
export function KeyboardAwareTextInput(props: TextInputProps) {
  const reveal = useRevealFocusedInput();
  return (
    <TextInput
      {...props}
      onFocus={(e) => {
        reveal();
        props.onFocus?.(e);
      }}
    />
  );
}

/**
 * Drop-in ScrollView that keeps the focused input visible above the software
 * keyboard.
 *
 * iOS gets UIKit's own inset adjustment, which tracks the keyboard frame
 * continuously (including the interactive swipe-to-dismiss) and scrolls the
 * first responder into view for free.
 *
 * Android is edge-to-edge from Android 16 / Expo SDK 54 onwards, so
 * `softwareKeyboardLayoutMode: "resize"` no longer shrinks the window and the
 * keyboard simply covers the app. We add the keyboard's height as scrollable
 * space and scroll the focused field into view ourselves.
 */
export function KeyboardAwareScrollView({ children, ...props }: ScrollViewProps) {
  const scroller = useRef<ScrollView>(null);
  const offset = useRef(0);
  const keyboardTop = useRef<number | null>(null);
  const [inset, setInset] = useState(0);

  const reveal = useCallback(() => {
    const top = keyboardTop.current;
    const input = TextInput.State.currentlyFocusedInput();
    if (top == null || input == null) return;
    input.measureInWindow((_x, y, _w, height) => {
      const covered = y + height + GAP - top;
      if (covered > 0) {
        scroller.current?.scrollTo({ y: offset.current + covered, animated: true });
      }
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") return;
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      keyboardTop.current = e.endCoordinates.screenY;
      setInset(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      keyboardTop.current = null;
      setInset(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // Wait for the spacer below to be laid out, otherwise the scroll we ask for
  // is clamped to the old (shorter) content height.
  useEffect(() => {
    if (inset === 0) return;
    const frame = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(frame);
  }, [inset, reveal]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    offset.current = e.nativeEvent.contentOffset.y;
    props.onScroll?.(e);
  };

  return (
    <RevealContext.Provider value={reveal}>
      <ScrollView
        ref={scroller}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
        scrollEventThrottle={16}
        {...props}
        onScroll={onScroll}
      >
        {children}
        {inset > 0 && <View style={{ height: inset }} />}
      </ScrollView>
    </RevealContext.Provider>
  );
}
