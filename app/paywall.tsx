import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEV_PRICES, LIMIT_COPY, LimitKind, PLUS_BENEFITS } from "../src/entitlements/limits";
import { PurchasePackage, useEntitlements } from "../src/entitlements/store";
import { colors, radius, shadow, spacing, type } from "../src/theme";
import { PrimaryButton } from "../src/ui";

export default function Paywall() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { reason } = useLocalSearchParams<{ reason?: LimitKind }>();

  const source = useEntitlements((s) => s.source);
  const isPlus = useEntitlements((s) => s.isPlus);
  const rcPackages = useEntitlements((s) => s.packages);
  const purchasing = useEntitlements((s) => s.purchasing);
  const purchase = useEntitlements((s) => s.purchase);

  // In dev mode there are no store packages, so show marketing prices.
  const devPackages: PurchasePackage[] = [
    { id: "yearly", title: "Yearly", priceString: DEV_PRICES.yearly, period: "yearly" },
    { id: "monthly", title: "Monthly", priceString: DEV_PRICES.monthly, period: "monthly" },
  ];
  const packages = source === "revenuecat" && rcPackages.length > 0 ? rcPackages : devPackages;

  const [selected, setSelected] = useState(
    packages.find((p) => p.period === "yearly")?.id ?? packages[0]?.id
  );

  const onContinue = async () => {
    const pkg = packages.find((p) => p.id === selected);
    const res = await purchase(pkg);
    if (res.ok) {
      router.back();
    } else if (res.error) {
      Alert.alert("Couldn't complete purchase", res.error);
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
        <Text style={styles.title}>Loop Plus</Text>
        {isPlus ? (
          <Text style={styles.subtitle}>You're on Loop Plus — thank you! Everything's unlocked.</Text>
        ) : (
          <Text style={styles.subtitle}>
            {reason && LIMIT_COPY[reason]
              ? `You've reached the free limit for ${LIMIT_COPY[reason].label}. `
              : ""}
            Unlock the whole app with Loop Plus.
          </Text>
        )}

        <View style={styles.benefits}>
          {PLUS_BENEFITS.map((b) => (
            <View key={b} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.sage} />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {!isPlus && (
          <View style={{ marginTop: spacing.lg }}>
            {packages.map((p) => {
              const active = p.id === selected;
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
                      {p.period === "yearly" ? "Yearly" : p.period === "monthly" ? "Monthly" : p.title}
                    </Text>
                    <Text style={styles.planPrice}>{p.priceString}</Text>
                  </View>
                  {best && (
                    <View style={styles.bestBadge}>
                      <Text style={styles.bestText}>Best value</Text>
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
            <Text style={styles.devNote}>Dev mode — this simulates a purchase, no real charge.</Text>
          )}
          <PrimaryButton
            label={purchasing ? "Please wait…" : "Continue"}
            onPress={purchasing ? () => {} : onContinue}
          />
          <Pressable onPress={() => useEntitlements.getState().restore()} style={styles.restore}>
            <Text style={styles.restoreText}>Restore purchases</Text>
          </Pressable>
          <Text style={styles.fine}>
            Subscriptions renew automatically until cancelled. Manage in your App Store settings.
          </Text>
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
  fine: { textAlign: "center", color: colors.textFaint, fontSize: 12, lineHeight: 16 },
});
