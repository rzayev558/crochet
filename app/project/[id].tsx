import { Ionicons } from "@expo/vector-icons";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
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
import { useT } from "../../src/i18n";
import { KeyboardAwareScrollView, KeyboardAwareTextInput } from "../../src/keyboard";
import { colors, radius, shadow, spacing, type } from "../../src/theme";
import { GhostButton, PhotoPicker } from "../../src/ui";

export default function ProjectDetail() {
  const t = useT();
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
    const cid = createCounter(id, t("project.counterDefault", { n }));
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
    <KeyboardAwareScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
      <Stack.Screen options={{ title: "" }} />

      <PhotoPicker
        uri={project.photoUri}
        onChange={(uri) => updateProject(id, { photoUri: uri })}
      />

      <KeyboardAwareTextInput
        style={styles.nameInput}
        value={name}
        onChangeText={setName}
        onEndEditing={() => updateProject(id, { name })}
        placeholder={t("project.namePlaceholder")}
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
          {finished ? t("project.finished") : t("project.inProgress")}
        </Text>
      </Pressable>

      {/* Counters */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{t("project.counters")}</Text>
        <Pressable onPress={addCounter} hitSlop={10} style={styles.addCounter}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addCounterText}>{t("common.add")}</Text>
        </Pressable>
      </View>

      {(counters?.length ?? 0) === 0 ? (
        <Text style={styles.hint}>{t("project.noCounters")}</Text>
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
                {c.target
                  ? t("project.counterOfTarget", { count: c.count, target: c.target })
                  : t("project.counterRows", { count: c.count })}
              </Text>
            </View>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{c.count}</Text>
            </View>
          </Pressable>
        ))
      )}

      {/* Notes */}
      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>{t("project.notes")}</Text>
      <KeyboardAwareTextInput
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
        onEndEditing={() => updateProject(id, { notes })}
        multiline
        placeholder={t("project.notesPlaceholder")}
        placeholderTextColor={colors.textFaint}
      />

      <GhostButton
        label={t("project.delete")}
        danger
        style={{ marginTop: spacing.xl }}
        onPress={() =>
          Alert.alert(t("project.deleteTitle"), t("project.deleteBody", { name: project.name }), [
            { text: t("common.cancel"), style: "cancel" },
            {
              text: t("common.delete"),
              style: "destructive",
              onPress: () => {
                deleteProject(id);
                router.back();
              },
            },
          ])
        }
      />
    </KeyboardAwareScrollView>
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
