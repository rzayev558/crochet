import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Fragment } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useT } from "../../src/i18n";
import { LESSON_LEVELS, useLessons } from "../../src/lessons";
import { colors, radius, shadow, spacing, type } from "../../src/theme";

export default function LearnTab() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lessons = useLessons();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}
    >
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🧶</Text>
        <Text style={styles.heroTitle}>{t("learn.heroTitle")}</Text>
        <Text style={styles.heroBody}>{t("learn.heroBody")}</Text>
      </View>

      {LESSON_LEVELS.map((level) => {
        const inLevel = lessons.filter((l) => l.level === level);
        if (inLevel.length === 0) return null;
        return (
          <Fragment key={level}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{t(`level.${level}`)}</Text>
              <Text style={styles.sectionBlurb}>{t(`level.blurb.${level}`)}</Text>
            </View>
            {inLevel.map((lesson) => (
              <Pressable
                key={lesson.id}
                style={styles.card}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>{lesson.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title} numberOfLines={1}>
                    {lesson.title}
                  </Text>
                  <Text style={styles.summary} numberOfLines={2}>
                    {lesson.summary}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color={colors.textFaint} />
                    <Text style={styles.meta}>{t("learn.minutes", { n: lesson.minutes })}</Text>
                    <Text style={styles.metaDot}>·</Text>
                    <Text style={styles.meta}>
                      {lesson.steps.length === 1
                        ? t("learn.stepOne", { n: lesson.steps.length })
                        : t("learn.stepOther", { n: lesson.steps.length })}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color={colors.textFaint} />
              </Pressable>
            ))}
          </Fragment>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: {
    backgroundColor: colors.sageSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroEmoji: { fontSize: 40, marginBottom: spacing.xs },
  heroTitle: { fontSize: type.title, fontWeight: "800", color: colors.text, marginBottom: spacing.xs },
  heroBody: { fontSize: type.body, color: colors.textMuted, lineHeight: 26 },

  sectionHead: { marginBottom: spacing.sm, marginTop: spacing.xs },
  sectionTitle: { fontSize: type.heading, fontWeight: "800", color: colors.text },
  sectionBlurb: { fontSize: type.label, color: colors.textMuted, marginTop: 2 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  badgeEmoji: { fontSize: 28 },
  title: { fontSize: type.body, fontWeight: "700", color: colors.text },
  summary: { fontSize: type.label, color: colors.textMuted, marginTop: 2, lineHeight: 20 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  meta: { fontSize: 12, fontWeight: "700", color: colors.textFaint },
  metaDot: { fontSize: 12, color: colors.textFaint, marginHorizontal: 2 },
});
