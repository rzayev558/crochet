import { Ionicons } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { yarnsQuery } from "../../src/db/queries";
import { FREE_LIMITS } from "../../src/entitlements/limits";
import { useEntitlements } from "../../src/entitlements/store";
import { useT } from "../../src/i18n";
import { colors, radius, shadow, spacing, type } from "../../src/theme";
import { EmptyState, Fab, FreeLimitBar } from "../../src/ui";
import { weightLabel } from "../../src/yarn";

export default function StashTab() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPlus = useEntitlements((s) => s.isPlus);
  const { data: yarns } = useLiveQuery(yarnsQuery);
  const count = yarns?.length ?? 0;

  const addYarn = () => {
    if (!isPlus && count >= FREE_LIMITS.yarns) {
      router.push("/paywall?reason=yarns");
      return;
    }
    router.push("/yarn/new");
  };

  return (
    <View style={styles.screen}>
      {!isPlus && count > 0 && (
        <FreeLimitBar
          used={count}
          limit={FREE_LIMITS.yarns}
          label={t("units.yarns")}
          onUpgrade={() => router.push("/paywall?reason=yarns")}
        />
      )}
      {(yarns?.length ?? 0) === 0 ? (
        <EmptyState
          emoji="🧵"
          title={t("stash.emptyTitle")}
          body={t("stash.emptyBody")}
        />
      ) : (
        <FlatList
          data={yarns}
          keyExtractor={(y) => y.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + 120 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/yarn/${item.id}`)}>
              {item.photoUri ? (
                <Image source={{ uri: item.photoUri }} style={styles.thumb} />
              ) : (
                <View
                  style={[
                    styles.thumb,
                    { backgroundColor: item.colorHex ?? colors.bgDeep, alignItems: "center", justifyContent: "center" },
                  ]}
                >
                  {!item.colorHex && <Ionicons name="color-fill-outline" size={24} color={colors.textFaint} />}
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.colorway} numberOfLines={1}>
                  {item.colorway}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {[item.brand, weightLabel(t, item.weight)].filter(Boolean).join(" · ") ||
                    t("stash.yarnFallback")}
                </Text>
              </View>
              <View style={styles.skeinPill}>
                <Text style={styles.skeinNum}>{item.skeins}</Text>
                <Text style={styles.skeinLabel}>
                  {item.skeins === 1 ? t("stash.skeinOne") : t("stash.skeinOther")}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
      <Fab label={t("stash.addYarn")} onPress={addYarn} bottom={insets.bottom + spacing.lg} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
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
  thumb: { width: 60, height: 60, borderRadius: radius.sm, marginRight: spacing.md },
  colorway: { fontSize: type.body, fontWeight: "700", color: colors.text },
  sub: { fontSize: type.label, color: colors.textMuted, marginTop: 2 },
  skeinPill: {
    minWidth: 56,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.sageSoft,
    alignItems: "center",
  },
  skeinNum: { fontSize: 20, fontWeight: "800", color: colors.sage },
  skeinLabel: { fontSize: 11, fontWeight: "700", color: colors.sage },
});
