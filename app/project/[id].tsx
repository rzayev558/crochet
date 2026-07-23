import { Ionicons } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  countersForProjectQuery,
  createCounter,
  deleteProject,
  projectByIdQuery,
  updateProject,
} from "../../src/db/queries";
import { FREE_LIMITS } from "../../src/entitlements/limits";
import { useEntitlements } from "../../src/entitlements/store";
import { colors, radius, shadow, spacing, type } from "../../src/theme";
import { GhostButton, PhotoPicker } from "../../src/ui";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isPlus = useEntitlements((s) => s.isPlus);
  const { data: rows } = useLiveQuery(projectByIdQuery(id), [id]);
  const project = rows?.[0];
  const { data: counters } = useLiveQuery(countersForProjectQuery(id), [id]);

  const addCounter = () => {
    const n = (counters?.length ?? 0) + 1;
    if (!isPlus && (counters?.length ?? 0) >= FREE_LIMITS.countersPerProject) {
      router.push("/paywall?reason=countersPerProject");
      return;
    }
    const cid = createCounter(id, `Counter ${n}`);
    router.push(`/counter/${cid}`);
  };

  // Local mirror of editable text, seeded once from the DB.
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const seeded = useRef(false);
  useEffect(() => {
    if (project && !seeded.current) {
      setName(project.name);
      setNotes(project.notes);
      seeded.current = true;
    }
  }, [project]);

  if (!project) return <View style={styles.screen} />;

  const finished = project.status === "finished";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
      <Stack.Screen options={{ title: "" }} />

      <PhotoPicker
        uri={project.photoUri}
        onChange={(uri) => updateProject(id, { photoUri: uri })}
      />

      <TextInput
        style={styles.nameInput}
        value={name}
        onChangeText={setName}
        onEndEditing={() => updateProject(id, { name })}
        placeholder="Project name"
        placeholderTextColor={colors.textFaint}
      />

      <Pressable
        style={[styles.statusChip, finished && styles.statusChipDone]}
        onPress={() => updateProject(id, { status: finished ? "active" : "finished" })}
      >
        <Ionicons
          name={finished ? "checkmark-circle" : "ellipse-outline"}
          size={18}
          color={finished ? colors.sage : colors.textMuted}
        />
        <Text style={[styles.statusText, finished && { color: colors.sage }]}>
          {finished ? "Finished" : "In progress"}
        </Text>
      </Pressable>

      {/* Counters */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Counters</Text>
        <Pressable onPress={addCounter} hitSlop={10} style={styles.addCounter}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addCounterText}>Add</Text>
        </Pressable>
      </View>

      {(counters?.length ?? 0) === 0 ? (
        <Text style={styles.hint}>No counters yet. Add one to start counting rows.</Text>
      ) : (
        counters!.map((c) => (
          <Pressable
            key={c.id}
            style={styles.counterRow}
            onPress={() => router.push(`/counter/${c.id}`)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.counterName}>{c.name}</Text>
              <Text style={styles.counterSub}>
                {c.target ? `${c.count} of ${c.target}` : `${c.count} rows`}
              </Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{c.count}</Text>
            </View>
          </Pressable>
        ))
      )}

      {/* Notes */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Notes</Text>
      <TextInput
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
        onEndEditing={() => updateProject(id, { notes })}
        multiline
        placeholder="Hook size, gauge, modifications…"
        placeholderTextColor={colors.textFaint}
      />

      <GhostButton
        label="Delete project"
        danger
        style={{ marginTop: spacing.xl }}
        onPress={() =>
          Alert.alert("Delete project?", `"${project.name}" and its counters will be removed.`, [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                deleteProject(id);
                router.back();
              },
            },
          ])
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  nameInput: {
    fontSize: type.title,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  statusChipDone: { backgroundColor: colors.sageSoft, borderColor: colors.sageSoft },
  statusText: { fontSize: type.label, fontWeight: "700", color: colors.textMuted },

  sectionHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.md },
  sectionTitle: { fontSize: type.heading, fontWeight: "800", color: colors.text },
  addCounter: { flexDirection: "row", alignItems: "center", gap: 2 },
  addCounterText: { color: colors.primary, fontSize: type.body, fontWeight: "700" },
  hint: { color: colors.textMuted, fontSize: type.body, marginTop: spacing.sm },

  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
    ...shadow,
  },
  counterName: { fontSize: type.body, fontWeight: "700", color: colors.text },
  counterSub: { fontSize: type.label, color: colors.textMuted, marginTop: 2 },
  countPill: {
    minWidth: 52,
    height: 52,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  countPillText: { fontSize: 22, fontWeight: "800", color: colors.primaryDark },

  notes: {
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: type.body,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    minHeight: 100,
    textAlignVertical: "top",
    marginTop: spacing.sm,
  },
});
