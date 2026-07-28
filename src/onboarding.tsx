import { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useT } from "./i18n";
import { colors, radius, spacing, type } from "./theme";

const { width } = Dimensions.get("window");

const SLIDES = [
  { emoji: "👆", title: "onboarding.slide1.title", body: "onboarding.slide1.body" },
  { emoji: "🧶", title: "onboarding.slide2.title", body: "onboarding.slide2.body" },
  { emoji: "🧵", title: "onboarding.slide3.title", body: "onboarding.slide3.body" },
] as const;

export function Onboarding({ onDone }: { onDone: () => void }) {
  const t = useT();
  const insets = useSafeAreaInsets();
  const scroller = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const p = Math.round(e.nativeEvent.contentOffset.x / width);
    if (p !== page) setPage(p);
  };

  const next = () => {
    if (page < SLIDES.length - 1) {
      scroller.current?.scrollTo({ x: (page + 1) * width, animated: true });
    } else {
      onDone();
    }
  };

  const isLast = page === SLIDES.length - 1;

  return (
    <View style={styles.screen}>
      <View style={{ height: insets.top }} />
      <Pressable style={styles.skip} onPress={onDone}>
        <Text style={styles.skipText}>{isLast ? "" : t("onboarding.skip")}</Text>
      </Pressable>

      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s) => (
          <View key={s.title} style={[styles.slide, { width }]}>
            <View style={styles.badge}>
              <Text style={styles.emoji}>{s.emoji}</Text>
            </View>
            <Text style={styles.title}>{t(s.title)}</Text>
            <Text style={styles.body}>{t(s.body)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotActive]} />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable style={styles.cta} onPress={next}>
          <Text style={styles.ctaText}>{isLast ? t("onboarding.start") : t("onboarding.next")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  skip: { alignSelf: "flex-end", padding: spacing.lg, minHeight: 44 },
  skipText: { color: colors.textMuted, fontSize: type.body, fontWeight: "700" },

  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  badge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  emoji: { fontSize: 76 },
  title: { fontSize: 30, fontWeight: "800", color: colors.text, textAlign: "center", marginBottom: spacing.md },
  body: { fontSize: type.body, color: colors.textMuted, textAlign: "center", lineHeight: 28 },

  dots: { flexDirection: "row", justifyContent: "center", gap: spacing.xs, marginBottom: spacing.lg },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.borderStrong },
  dotActive: { backgroundColor: colors.primary, width: 24 },

  footer: { paddingHorizontal: spacing.lg },
  cta: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.pill, alignItems: "center" },
  ctaText: { color: colors.white, fontSize: type.body, fontWeight: "800" },
});
