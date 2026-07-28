import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEntitlements } from "../src/entitlements/store";
import { LangPref, useLanguage, useT } from "../src/i18n";
import { colors, radius, shadow, spacing, type } from "../src/theme";

export default function Settings() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPlus = useEntitlements((s) => s.isPlus);
  const source = useEntitlements((s) => s.source);
  const restore = useEntitlements((s) => s.restore);
  const devSetPlus = useEntitlements((s) => s.devSetPlus);

  const langPref = useLanguage((s) => s.pref);
  const setLangPref = useLanguage((s) => s.setPref);

  const LANG_OPTIONS: { value: LangPref; label: string }[] = [
    { value: "system", label: t("language.system") },
    { value: "en", label: t("language.en") },
    { value: "de", label: t("language.de") },
  ];

  const onRestore = async () => {
    const res = await restore();
    Alert.alert(
      res.ok ? t("settings.restoredTitle") : t("settings.nothingRestoreTitle"),
      res.ok
        ? t("settings.restoredBody")
        : res.error ?? t("settings.nothingRestoreBody")
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}
    >
      {/* Subscription status */}
      <View style={[styles.card, isPlus && styles.cardPlus]}>
        <View style={styles.statusRow}>
          <Ionicons
            name={isPlus ? "sparkles" : "sparkles-outline"}
            size={24}
            color={isPlus ? colors.sage : colors.primary}
          />
          <Text style={styles.statusTitle}>{isPlus ? t("settings.loopPlus") : t("settings.freePlan")}</Text>
        </View>
        <Text style={styles.statusSub}>
          {isPlus ? t("settings.plusStatusSub") : t("settings.freeStatusSub")}
        </Text>
        {!isPlus && (
          <Pressable style={styles.upgradeBtn} onPress={() => router.push("/paywall")}>
            <Text style={styles.upgradeText}>{t("settings.upgradeCta")}</Text>
          </Pressable>
        )}
      </View>

      {/* Language */}
      <Text style={styles.sectionLabel}>{t("settings.language")}</Text>
      <View style={styles.langCard}>
        {LANG_OPTIONS.map((opt, i) => {
          const active = langPref === opt.value;
          return (
            <Pressable
              key={opt.value}
              style={[styles.langRow, i > 0 && styles.langRowBorder]}
              onPress={() => setLangPref(opt.value)}
            >
              <Text style={[styles.langLabel, active && styles.langLabelActive]}>{opt.label}</Text>
              {active && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.row} onPress={onRestore}>
        <Ionicons name="refresh" size={20} color={colors.text} />
        <Text style={styles.rowText}>{t("settings.restore")}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      </Pressable>

      {/* Dev tools — only when running without a real RevenueCat key. */}
      {source === "dev" && (
        <>
          <Text style={styles.sectionLabel}>{t("settings.developer")}</Text>
          <View style={styles.row}>
            <Ionicons name="construct-outline" size={20} color={colors.text} />
            <Text style={styles.rowText}>{t("settings.simulatePlus")}</Text>
            <Switch
              value={isPlus}
              onValueChange={devSetPlus}
              trackColor={{ true: colors.sage, false: colors.borderStrong }}
            />
          </View>
          <Text style={styles.devHint}>{t("settings.devHint")}</Text>
        </>
      )}

      <Text style={styles.version}>
        {t("settings.version", { version: Constants.expoConfig?.version ?? "1.0.0" })}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow,
  },
  cardPlus: { backgroundColor: colors.sageSoft, borderColor: colors.sageSoft },
  statusRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  statusTitle: { fontSize: type.title, fontWeight: "800", color: colors.text },
  statusSub: { fontSize: type.body, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 24 },
  upgradeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
    marginTop: spacing.md,
  },
  upgradeText: { color: colors.white, fontSize: type.body, fontWeight: "700" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  rowText: { flex: 1, fontSize: type.body, fontWeight: "600", color: colors.text },

  langCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginTop: spacing.xs,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  langRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  langLabel: { fontSize: type.body, fontWeight: "600", color: colors.text },
  langLabelActive: { color: colors.primary, fontWeight: "700" },

  sectionLabel: {
    fontSize: type.label,
    fontWeight: "800",
    color: colors.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  devHint: { fontSize: type.label, color: colors.textFaint, marginTop: spacing.sm, lineHeight: 20 },
  version: { textAlign: "center", color: colors.textFaint, fontSize: type.label, marginTop: spacing.xl },
});
