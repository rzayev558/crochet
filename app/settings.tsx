import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEntitlements } from "../src/entitlements/store";
import { colors, radius, shadow, spacing, type } from "../src/theme";

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPlus = useEntitlements((s) => s.isPlus);
  const source = useEntitlements((s) => s.source);
  const restore = useEntitlements((s) => s.restore);
  const devSetPlus = useEntitlements((s) => s.devSetPlus);

  const onRestore = async () => {
    const res = await restore();
    Alert.alert(
      res.ok ? "Restored" : "Nothing to restore",
      res.ok ? "Loop Plus is active again." : res.error ?? "No previous purchase was found."
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
          <Text style={styles.statusTitle}>{isPlus ? "Loop Plus" : "Free plan"}</Text>
        </View>
        <Text style={styles.statusSub}>
          {isPlus
            ? "Everything's unlocked. Thanks for supporting Loop!"
            : "Upgrade to remove all limits and unlock every feature."}
        </Text>
        {!isPlus && (
          <Pressable style={styles.upgradeBtn} onPress={() => router.push("/paywall")}>
            <Text style={styles.upgradeText}>Upgrade to Loop Plus</Text>
          </Pressable>
        )}
      </View>

      <Pressable style={styles.row} onPress={onRestore}>
        <Ionicons name="refresh" size={20} color={colors.text} />
        <Text style={styles.rowText}>Restore purchases</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
      </Pressable>

      {/* Dev tools — only when running without a real RevenueCat key. */}
      {source === "dev" && (
        <>
          <Text style={styles.sectionLabel}>Developer</Text>
          <View style={styles.row}>
            <Ionicons name="construct-outline" size={20} color={colors.text} />
            <Text style={styles.rowText}>Simulate Loop Plus</Text>
            <Switch
              value={isPlus}
              onValueChange={devSetPlus}
              trackColor={{ true: colors.sage, false: colors.borderStrong }}
            />
          </View>
          <Text style={styles.devHint}>
            No RevenueCat key set, so purchases are simulated locally. Add a key in
            src/entitlements/config.ts and build natively for real subscriptions.
          </Text>
        </>
      )}

      <Text style={styles.version}>
        Loop v{Constants.expoConfig?.version ?? "1.0.0"}
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
