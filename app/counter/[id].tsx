import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  counterByIdQuery,
  deleteCounter,
  setCount as persistCount,
  updateCounter,
} from "../../src/db/queries";
import { colors, radius, shadow, spacing, type } from "../../src/theme";

export default function CounterScreen() {
  useKeepAwake(); // don't let the screen lock mid-project

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data } = useLiveQuery(counterByIdQuery(id), [id]);
  const counter = data?.[0];

  // Local count for instant taps; seeded once from the DB.
  const [count, setCountLocal] = useState<number | null>(null);
  const seeded = useRef(false);
  useEffect(() => {
    if (counter && !seeded.current) {
      setCountLocal(counter.count);
      seeded.current = true;
    }
  }, [counter]);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scale] = useState(() => new Animated.Value(1));

  if (!counter) {
    return (
      <View style={styles.screen}>
        <Text style={styles.gone}>This counter no longer exists.</Text>
      </View>
    );
  }

  const value = count ?? counter.count;
  const step = counter.step;
  const target = counter.target;
  const atGoal = target != null && target > 0 && value >= target;

  const bump = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 60, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();
  };

  const up = () => {
    const next = value + step;
    setCountLocal(next);
    persistCount(id, next);
    bump();
    Haptics.impactAsync(
      target != null && next >= target
        ? Haptics.ImpactFeedbackStyle.Heavy
        : Haptics.ImpactFeedbackStyle.Medium
    );
  };

  const down = () => {
    if (value === 0) return;
    const next = Math.max(0, value - step);
    setCountLocal(next);
    persistCount(id, next);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const progress = target && target > 0 ? Math.min(1, value / target) : null;

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: counter.name,
          headerRight: () => (
            <Pressable onPress={() => setSettingsOpen(true)} hitSlop={12}>
              <Text style={styles.headerBtn}>Edit</Text>
            </Pressable>
          ),
        }}
      />

      <Pressable style={styles.tapArea} onPress={up}>
        <Animated.View style={{ transform: [{ scale }], alignItems: "center" }}>
          <Text style={styles.count}>{value}</Text>
          <Text style={styles.countCaption}>
            {atGoal
              ? "Goal reached 🎉"
              : target
              ? `of ${target}`
              : step > 1
              ? `+${step} per tap`
              : "tap anywhere to count"}
          </Text>
        </Animated.View>
      </Pressable>

      {progress !== null && (
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%`, backgroundColor: atGoal ? colors.sage : colors.primary },
            ]}
          />
        </View>
      )}

      <View style={[styles.controls, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable style={[styles.ctrl, styles.ctrlGhost]} onPress={down} accessibilityLabel="Subtract">
          <Text style={styles.ctrlGhostText}>−</Text>
        </Pressable>
        <Pressable
          style={[styles.ctrl, styles.ctrlWide, styles.ctrlGhost]}
          onPress={() =>
            Alert.alert("Reset to zero?", `"${counter.name}" will go back to 0.`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Reset",
                style: "destructive",
                onPress: () => {
                  setCountLocal(0);
                  persistCount(id, 0);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                },
              },
            ])
          }
        >
          <Text style={styles.ctrlGhostText}>Reset</Text>
        </Pressable>
        <Pressable style={[styles.ctrl, styles.ctrlPrimary]} onPress={up} accessibilityLabel="Add">
          <Text style={styles.ctrlPrimaryText}>+</Text>
        </Pressable>
      </View>

      <SettingsSheet
        counter={counter}
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onDeleted={() => {
          setSettingsOpen(false);
          router.back();
        }}
      />
    </View>
  );
}

function SettingsSheet({
  counter,
  visible,
  onClose,
  onDeleted,
}: {
  counter: { id: string; name: string; step: number; target: number | null };
  visible: boolean;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [name, setName] = useState(counter.name);
  const [step, setStep] = useState(String(counter.step));
  const [target, setTarget] = useState(counter.target ? String(counter.target) : "");

  // Re-seed local fields whenever the sheet is opened.
  useEffect(() => {
    if (visible) {
      setName(counter.name);
      setStep(String(counter.step));
      setTarget(counter.target ? String(counter.target) : "");
    }
  }, [visible]);

  const save = () => {
    updateCounter(counter.id, {
      name: name.trim() || counter.name,
      step: Math.max(1, Math.round(Number(step) || 1)),
      target: target ? Math.max(1, Math.round(Number(target))) : null,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.sheetTitle}>Counter settings</Text>

          <Text style={styles.field}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.field}>Rows per tap</Text>
              <TextInput style={styles.input} value={step} onChangeText={setStep} keyboardType="number-pad" />
            </View>
            <View style={styles.col}>
              <Text style={styles.field}>Goal (optional)</Text>
              <TextInput
                style={styles.input}
                value={target}
                onChangeText={setTarget}
                keyboardType="number-pad"
                placeholder="—"
                placeholderTextColor={colors.textFaint}
              />
            </View>
          </View>

          <Pressable style={styles.saveBtn} onPress={save}>
            <Text style={styles.saveBtnText}>Save</Text>
          </Pressable>
          <Pressable
            style={styles.deleteBtn}
            onPress={() =>
              Alert.alert("Delete this counter?", `"${counter.name}" will be removed.`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    deleteCounter(counter.id);
                    onDeleted();
                  },
                },
              ])
            }
          >
            <Text style={styles.deleteBtnText}>Delete counter</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  headerBtn: { color: colors.primary, fontSize: type.body, fontWeight: "700" },
  gone: { fontSize: type.body, color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },

  tapArea: {
    flex: 1,
    margin: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  count: { fontSize: type.display, fontWeight: "800", color: colors.text, fontVariant: ["tabular-nums"] },
  countCaption: { fontSize: type.body, color: colors.textMuted, marginTop: spacing.xs },

  progressTrack: { height: 10, borderRadius: radius.pill, backgroundColor: colors.bgDeep, marginHorizontal: spacing.md, overflow: "hidden" },
  progressFill: { height: 10, borderRadius: radius.pill },

  controls: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.md },
  ctrl: { height: 72, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  ctrlGhost: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderStrong, paddingHorizontal: spacing.lg },
  ctrlGhostText: { fontSize: type.heading, fontWeight: "700", color: colors.text },
  ctrlWide: { flex: 1 },
  ctrlPrimary: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, ...shadow, shadowOpacity: 0.25 },
  ctrlPrimaryText: { fontSize: 40, fontWeight: "800", color: colors.white, marginTop: -4 },

  backdrop: { flex: 1, backgroundColor: "rgba(59,47,42,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.surface, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg, paddingBottom: spacing.xl },
  sheetTitle: { fontSize: type.title, fontWeight: "800", color: colors.text, marginBottom: spacing.md },
  field: { fontSize: type.label, fontWeight: "700", color: colors.textMuted, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { borderWidth: 2, borderColor: colors.borderStrong, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: type.body, color: colors.text, backgroundColor: colors.surfaceMuted },
  twoCol: { flexDirection: "row", gap: spacing.md },
  col: { flex: 1 },
  saveBtn: { backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: radius.pill, alignItems: "center", marginTop: spacing.lg },
  saveBtnText: { color: colors.white, fontSize: type.body, fontWeight: "700" },
  deleteBtn: { paddingVertical: spacing.md, alignItems: "center", marginTop: spacing.xs },
  deleteBtnText: { color: colors.danger, fontSize: type.body, fontWeight: "700" },
});
