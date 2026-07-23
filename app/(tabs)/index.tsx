import { Ionicons } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../src/db/client";
import { counters } from "../../src/db/schema";
import { createProject, projectsQuery } from "../../src/db/queries";
import { FREE_LIMITS } from "../../src/entitlements/limits";
import { useEntitlements } from "../../src/entitlements/store";
import { colors, radius, shadow, spacing, type } from "../../src/theme";
import { EmptyState, Fab, FreeLimitBar } from "../../src/ui";

export default function ProjectsTab() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPlus = useEntitlements((s) => s.isPlus);
  const { data: projects } = useLiveQuery(projectsQuery);
  const { data: counterRows } = useLiveQuery(
    db.select({ projectId: counters.projectId }).from(counters)
  );

  const countByProject: Record<string, number> = {};
  for (const r of counterRows ?? []) {
    countByProject[r.projectId] = (countByProject[r.projectId] ?? 0) + 1;
  }

  const count = projects?.length ?? 0;

  const addProject = () => {
    if (!isPlus && count >= FREE_LIMITS.projects) {
      router.push("/paywall?reason=projects");
      return;
    }
    const id = createProject("New project");
    router.push(`/project/${id}`);
  };

  return (
    <View style={styles.screen}>
      {!isPlus && count > 0 && (
        <FreeLimitBar
          used={count}
          limit={FREE_LIMITS.projects}
          label="projects"
          onUpgrade={() => router.push("/paywall?reason=projects")}
        />
      )}
      {(projects?.length ?? 0) === 0 ? (
        <EmptyState
          emoji="🧶"
          title="Start a project"
          body="Group your counters, notes and a photo for each thing you're making — a sweater, a blanket, a granny square."
        />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + 120 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/project/${item.id}`)}>
              {item.photoUri ? (
                <Image source={{ uri: item.photoUri }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbEmpty]}>
                  <Ionicons name="image-outline" size={26} color={colors.textFaint} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.sub}>
                  {(countByProject[item.id] ?? 0)}{" "}
                  {(countByProject[item.id] ?? 0) === 1 ? "counter" : "counters"}
                </Text>
                {item.status === "finished" && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Finished</Text>
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textFaint} />
            </Pressable>
          )}
        />
      )}
      <Fab label="New project" onPress={addProject} bottom={insets.bottom + spacing.lg} />
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
  thumb: { width: 64, height: 64, borderRadius: radius.sm, marginRight: spacing.md },
  thumbEmpty: { backgroundColor: colors.bgDeep, alignItems: "center", justifyContent: "center" },
  name: { fontSize: type.heading, fontWeight: "700", color: colors.text },
  sub: { fontSize: type.label, color: colors.textMuted, marginTop: 2 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.sageSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: 6,
  },
  badgeText: { color: colors.sage, fontSize: 12, fontWeight: "700" },
});
