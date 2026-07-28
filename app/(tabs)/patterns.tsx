import { Ionicons } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { patternsQuery } from "../../src/db/queries";
import { FREE_LIMITS } from "../../src/entitlements/limits";
import { useEntitlements } from "../../src/entitlements/store";
import { useT } from "../../src/i18n";
import { colors, radius, shadow, spacing, type } from "../../src/theme";
import { EmptyState, Fab, FreeLimitBar } from "../../src/ui";

export default function PatternsTab() {
  const t = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPlus = useEntitlements((s) => s.isPlus);
  const { data: patterns } = useLiveQuery(patternsQuery);
  const count = patterns?.length ?? 0;

  const addPattern = () => {
    if (!isPlus && count >= FREE_LIMITS.patterns) {
      router.push("/paywall?reason=patterns");
      return;
    }
    router.push("/pattern/new");
  };

  return (
    <View style={styles.screen}>
      {!isPlus && count > 0 && (
        <FreeLimitBar
          used={count}
          limit={FREE_LIMITS.patterns}
          label={t("units.patterns")}
          onUpgrade={() => router.push("/paywall?reason=patterns")}
        />
      )}
      {(patterns?.length ?? 0) === 0 ? (
        <EmptyState
          emoji="📋"
          title={t("patterns.emptyTitle")}
          body={t("patterns.emptyBody")}
        />
      ) : (
        <FlatList
          data={patterns}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + 120 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/pattern/${item.id}`)}>
              {item.photoUri ? (
                <Image source={{ uri: item.photoUri }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbEmpty]}>
                  <Ionicons
                    name={item.fileUri ? "document-text" : "reader-outline"}
                    size={26}
                    color={colors.primary}
                  />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.craftBadge}>
                    <Text style={styles.craftText}>
                      {item.craft === "knit" ? t("craft.knit") : t("craft.crochet")}
                    </Text>
                  </View>
                  {item.fileName ? (
                    <Text style={styles.sub} numberOfLines={1}>
                      {item.fileName}
                    </Text>
                  ) : item.sourceUrl ? (
                    <Text style={styles.sub} numberOfLines={1}>
                      {t("patterns.link")}
                    </Text>
                  ) : null}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textFaint} />
            </Pressable>
          )}
        />
      )}
      <Fab label={t("patterns.addPattern")} onPress={addPattern} bottom={insets.bottom + spacing.lg} />
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
  thumbEmpty: { backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  title: { fontSize: type.body, fontWeight: "700", color: colors.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 4 },
  craftBadge: { backgroundColor: colors.bgDeep, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  craftText: { fontSize: 12, fontWeight: "700", color: colors.textMuted },
  sub: { fontSize: type.label, color: colors.textMuted, flex: 1 },
});
