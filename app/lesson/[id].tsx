import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useT } from "../../src/i18n";
import { useLesson, useLessons } from "../../src/lessons";
import { colors, radius, shadow, spacing, type } from "../../src/theme";
import { PrimaryButton } from "../../src/ui";

export default function LessonScreen() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const lessons = useLessons();
  const lesson = useLesson(id);

  if (!lesson) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: "" }} />
        <Text style={styles.missingText}>{t("learn.unavailable")}</Text>
      </View>
    );
  }

  // The next lesson in the overall path, for a gentle "keep going" nudge.
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const next = index >= 0 ? lessons[index + 1] : undefined;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}
    >
      <Stack.Screen options={{ title: t(`level.${lesson.level}`) }} />

      <Text style={styles.emoji}>{lesson.emoji}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={15} color={colors.textMuted} />
        <Text style={styles.meta}>{t("learn.minutes", { n: lesson.minutes })}</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.meta}>
          {lesson.steps.length === 1
            ? t("learn.stepOne", { n: lesson.steps.length })
            : t("learn.stepOther", { n: lesson.steps.length })}
        </Text>
      </View>

      <Text style={styles.intro}>{lesson.intro}</Text>

      {lesson.steps.map((step, i) => (
        <View key={i} style={styles.step}>
          <View style={styles.stepHead}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
          </View>
          <Text style={styles.stepBody}>{step.body}</Text>
          {step.tip && (
            <View style={styles.tip}>
              <Ionicons name="bulb-outline" size={16} color={colors.primaryDark} />
              <Text style={styles.tipText}>{step.tip}</Text>
            </View>
          )}
        </View>
      ))}

      {next ? (
        <>
          <Text style={styles.nextLabel}>{t("learn.upNext")}</Text>
          <PrimaryButton
            label={`${next.emoji}  ${next.title}`}
            onPress={() => router.replace(`/lesson/${next.id}`)}
            style={{ marginTop: spacing.xs }}
          />
        </>
      ) : (
        <View style={styles.doneCard}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>{t("learn.doneTitle")}</Text>
          <Text style={styles.doneBody}>{t("learn.doneBody")}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  missing: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg },
  missingText: { fontSize: type.body, color: colors.textMuted },

  emoji: { fontSize: 52, marginBottom: spacing.xs },
  title: { fontSize: type.title, fontWeight: "800", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.xs },
  meta: { fontSize: type.label, fontWeight: "700", color: colors.textMuted },
  metaDot: { fontSize: type.label, color: colors.textFaint, marginHorizontal: 2 },
  intro: { fontSize: type.body, color: colors.text, lineHeight: 27, marginTop: spacing.md },

  step: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  stepHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: { color: colors.white, fontWeight: "800", fontSize: type.label },
  stepTitle: { flex: 1, fontSize: type.body, fontWeight: "700", color: colors.text },
  stepBody: { fontSize: type.body, color: colors.textMuted, lineHeight: 26, marginTop: spacing.sm },

  tip: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  tipText: { flex: 1, fontSize: type.label, color: colors.primaryDark, lineHeight: 22, fontWeight: "600" },

  nextLabel: {
    fontSize: type.label,
    fontWeight: "700",
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },

  doneCard: {
    backgroundColor: colors.sageSoft,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
    alignItems: "center",
  },
  doneEmoji: { fontSize: 40, marginBottom: spacing.xs },
  doneTitle: { fontSize: type.heading, fontWeight: "800", color: colors.text, marginBottom: spacing.xs },
  doneBody: { fontSize: type.body, color: colors.textMuted, textAlign: "center", lineHeight: 26 },
});
