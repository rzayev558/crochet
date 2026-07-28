import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEV_PRICES, LimitKind } from "../src/entitlements/limits";
import { PurchasePackage, useEntitlements } from "../src/entitlements/store";
import { useT } from "../src/i18n";
import { PRIVACY_URL, TERMS_URL } from "../src/legal";
import { colors, radius, shadow, spacing, type } from "../src/theme";
import { PrimaryButton } from "../src/ui";

/** Maps a limit reason to the plural unit key used in the "reached limit" copy. */
const REASON_UNIT: Record<LimitKind, "units.projects" | "units.counters" | "units.yarns" | "units.patterns"> = {
  projects: "units.projects",
  countersPerProject: "units.counters",
  yarns: "units.yarns",
  patterns: "units.patterns",
};

export default function Paywall() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { reason } = useLocalSearchParams<{ reason?: LimitKind }>();

  const benefits = [t("plus.benefit1"), t("plus.benefit2"), t("plus.benefit3")];

  const source = useEntitlements((s) => s.source);
  const isPlus = useEntitlements((s) => s.isPlus);
  const rcPackages = useEntitlements((s) => s.packages);
  const purchasing = useEntitlements((s) => s.purchasing);
  const purchase = useEntitlements((s) => s.purchase);
  const offeringsError = useEntitlements((s) => s.offeringsError);
  const loadingOfferings = useEntitlements((s) => s.loadingOfferings);
  const refreshOfferings = useEntitlements((s) => s.refreshOfferings);

  // In dev mode there are no store packages, so show marketing prices. Never
  // show them in RevenueCat mode — a real price must come from the store.
  const devPackages: PurchasePackage[] = [
    { id: "yearly", title: "Yearly", priceString: DEV_PRICES.yearly, period: "yearly" },
    { id: "monthly", title: "Monthly", priceString: DEV_PRICES.monthly, period: "monthly" },
  ];
  const packages = source === "revenuecat" ? rcPackages : devPackages;
  const plansUnavailable = packages.length === 0;

  const [selected, setSelected] = useState<string | undefined>(undefined);
  // Offerings arrive asynchronously, so fall back to the yearly plan until the
  // user picks one — and re-derive if the list changes underneath us.
  const selectedId = packages.some((p) => p.id === selected)
    ? selected
    : packages.find((p) => p.period === "yearly")?.id ?? packages[0]?.id;

  const [restoring, setRestoring] = useState(false);

  const onContinue = async () => {
    const pkg = packages.find((p) => p.id === selectedId);
    const res = await purchase(pkg);
    if (res.ok) {
      router.back();
    } else if (res.error) {
      Alert.alert(t("paywall.purchaseErrorTitle"), res.error);
    }
  };

  const onRestore = async () => {
    if (restoring) return;
    setRestoring(true);
    const res = await useEntitlements.getState().restore();
    setRestoring(false);
    if (res.ok) {
      Alert.alert(t("paywall.restoreOkTitle"), t("paywall.restoreOkBody"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else if (res.error) {
      Alert.alert(t("paywall.restoreErrorTitle"), res.error);
    } else {
      Alert.alert(t("paywall.restoreNoneTitle"), t("paywall.restoreNoneBody"));
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.textMuted} />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + 140 }}>
        <Text style={styles.hero}>🧶</Text>
        <Text style={styles.title}>{t("paywall.title")}</Text>
        {isPlus ? (
          <Text style={styles.subtitle}>{t("paywall.alreadyPlus")}</Text>
        ) : (
          <Text style={styles.subtitle}>
            {reason && REASON_UNIT[reason]
              ? t("paywall.reachedLimit", { label: t(REASON_UNIT[reason]) })
              : ""}
            {t("paywall.unlockAll")}
          </Text>
        )}

        <View style={styles.benefits}>
          {benefits.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.sage} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {!isPlus && plansUnavailable && (
          <>
            <Text style={styles.unavailable}>{t("paywall.plansUnavailable")}</Text>
            {/* The copy above tells people to try again, so give them a way to. */}
            <Pressable onPress={refreshOfferings} style={styles.retry} disabled={loadingOfferings}>
              <Text style={styles.retryText}>
                {loadingOfferings ? t("paywall.pleaseWait") : t("paywall.retry")}
              </Text>
            </Pressable>
            {__DEV__ && !!offeringsError && (
              <Text style={styles.diagnostic}>{offeringsError}</Text>
            )}
          </>
        )}

        {!isPlus && (
          <View style={{ marginTop: spacing.lg }}>
            {packages.map((p) => {
              const active = p.id === selectedId;
              const best = p.period === "yearly";
              return (
                <Pressable
                  key={p.id}
                  style={[styles.plan, active && styles.planActive]}
                  onPress={() => setSelected(p.id)}
                >
                  <View style={styles.radio}>
                    <Ionicons
                      name={active ? "radio-button-on" : "radio-button-off"}
                      size={24}
                      color={active ? colors.primary : colors.textFaint}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planTitle}>
                      {p.period === "yearly" ? t("paywall.yearly") : p.period === "monthly" ? t("paywall.monthly") : p.title}
                    </Text>
                    {/* Guideline 3.1.2: the billing period has to be spelled
                        out next to the price, not implied by the plan name. */}
                    <Text style={styles.planPrice}>
                      {p.priceString}
                      {p.period === "yearly"
                        ? ` ${t("paywall.perYear")}`
                        : p.period === "monthly"
                          ? ` ${t("paywall.perMonth")}`
                          : ""}
                    </Text>
                  </View>
                  {best && (
                    <View style={styles.bestBadge}>
                      <Text style={styles.bestText}>{t("paywall.bestValue")}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {!isPlus && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          {source === "dev" && (
            <Text style={styles.devNote}>{t("paywall.devNote")}</Text>
          )}
          <PrimaryButton
            label={purchasing ? t("paywall.pleaseWait") : t("paywall.continue")}
            onPress={purchasing || plansUnavailable ? () => {} : onContinue}
          />
          <Pressable onPress={onRestore} style={styles.restore} disabled={restoring}>
            <Text style={styles.restoreText}>
              {restoring ? t("paywall.pleaseWait") : t("paywall.restore")}
            </Text>
          </Pressable>
          <Text style={styles.fine}>{t("paywall.fine")}</Text>
          {/* Guideline 3.1.2 requires both links on the purchase screen. */}
          <View style={styles.legal}>
            <Pressable onPress={() => Linking.openURL(TERMS_URL)} hitSlop={8}>
              <Text style={styles.legalLink}>{t("paywall.terms")}</Text>
            </Pressable>
            <Text style={styles.legalDot}>·</Text>
            <Pressable onPress={() => Linking.openURL(PRIVACY_URL)} hitSlop={8}>
              <Text style={styles.legalLink}>{t("paywall.privacy")}</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { fontSize: 56, textAlign: "center", marginTop: spacing.md },
  title: { fontSize: 36, fontWeight: "800", color: colors.text, textAlign: "center", marginTop: spacing.sm },
  subtitle: {
    fontSize: type.body,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 26,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  benefits: { marginTop: spacing.xl, gap: spacing.md },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  benefitText: { fontSize: type.body, color: colors.text, fontWeight: "600", flex: 1 },

  plan: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  planActive: { borderColor: colors.primary },
  radio: { marginRight: spacing.sm },
  planTitle: { fontSize: type.body, fontWeight: "800", color: colors.text },
  planPrice: { fontSize: type.label, color: colors.textMuted, marginTop: 2 },
  bestBadge: { backgroundColor: colors.sageSoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  bestText: { color: colors.sage, fontWeight: "800", fontSize: 12 },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  devNote: { textAlign: "center", color: colors.textFaint, fontSize: type.label, marginBottom: spacing.sm },
  restore: { alignItems: "center", paddingVertical: spacing.md },
  restoreText: { color: colors.primary, fontSize: type.body, fontWeight: "700" },
  unavailable: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: type.label,
    lineHeight: 22,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  retry: { alignItems: "center", paddingVertical: spacing.md },
  retryText: { color: colors.primary, fontSize: type.body, fontWeight: "700" },
  diagnostic: {
    textAlign: "center",
    color: colors.textFaint,
    fontSize: 11,
    lineHeight: 15,
    paddingHorizontal: spacing.md,
  },
  legal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  legalLink: { color: colors.textMuted, fontSize: 12, textDecorationLine: "underline" },
  legalDot: { color: colors.textFaint, fontSize: 12 },
  fine: { textAlign: "center", color: colors.textFaint, fontSize: 12, lineHeight: 16 },
});
