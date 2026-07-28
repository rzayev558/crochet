import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  ActionSheetIOS,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from "react-native";
import { useT } from "./i18n";
import { KeyboardAwareTextInput } from "./keyboard";
import { persistFile } from "./media";
import { colors, radius, shadow, spacing, type } from "./theme";

export function PrimaryButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: object;
}) {
  return (
    <Pressable style={[styles.primary, style]} onPress={onPress}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  label,
  onPress,
  danger,
  style,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  style?: object;
}) {
  return (
    <Pressable style={[styles.ghost, style]} onPress={onPress}>
      <Text style={[styles.ghostText, danger && { color: colors.danger }]}>{label}</Text>
    </Pressable>
  );
}

export function Fab({ label, onPress, bottom }: { label: string; onPress: () => void; bottom: number }) {
  return (
    <Pressable style={[styles.fab, { bottom }]} onPress={onPress} accessibilityLabel={label}>
      <Ionicons name="add" size={24} color={colors.white} />
      <Text style={styles.fabLabel}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & TextInputProps) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <KeyboardAwareTextInput
        style={[styles.input, props.multiline && { minHeight: 90, textAlignVertical: "top" }]}
        placeholderTextColor={colors.textFaint}
        {...props}
      />
    </View>
  );
}

export function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: { label: string; value: string }[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginTop: spacing.md }}>
      {label && <Text style={styles.fieldLabel}>{label}</Text>}
      <View style={styles.chipsWrap}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <Pressable
              key={o.value}
              onPress={() => onChange(o.value)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Stepper({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.stepper}>
        <Pressable style={styles.stepBtn} onPress={() => onChange(Math.max(min, value - 1))}>
          <Ionicons name="remove" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.stepValue}>{value}</Text>
        <Pressable style={styles.stepBtn} onPress={() => onChange(value + 1)}>
          <Ionicons name="add" size={22} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Slim bar shown to free users: "2 of 2 free projects · Upgrade". Turns
 * terracotta once the limit is hit. Render only when the user is not Plus.
 */
export function FreeLimitBar({
  used,
  limit,
  label,
  onUpgrade,
}: {
  used: number;
  limit: number;
  /** Already-localized plural unit, e.g. t("units.projects"). */
  label: string;
  onUpgrade: () => void;
}) {
  const t = useT();
  const atLimit = used >= limit;
  return (
    <Pressable
      onPress={onUpgrade}
      style={[styles.limitBar, atLimit && styles.limitBarFull]}
    >
      <Ionicons
        name={atLimit ? "lock-closed" : "sparkles-outline"}
        size={16}
        color={atLimit ? colors.primaryDark : colors.textMuted}
      />
      <Text style={[styles.limitText, atLimit && { color: colors.primaryDark }]}>
        {t("freeLimit.bar", { used, limit, label })}
      </Text>
      <Text style={styles.limitUpgrade}>{t("freeLimit.upgrade")}</Text>
    </Pressable>
  );
}

export function EmptyState({
  emoji,
  title,
  body,
}: {
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

/**
 * Tappable photo well. Shows the current photo (if any) and lets the user pick
 * from the library or take a photo. Persists the chosen image and returns its
 * permanent uri via onChange.
 */
export function PhotoPicker({
  uri,
  onChange,
  height = 180,
}: {
  uri?: string | null;
  onChange: (uri: string | null) => void;
  height?: number;
}) {
  const pick = async (source: "library" | "camera") => {
    const opts: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      quality: 0.7,
      allowsEditing: true,
    };
    const res =
      source === "camera"
        ? await ImagePicker.launchCameraAsync(opts)
        : await ImagePicker.launchImageLibraryAsync(opts);
    if (!res.canceled && res.assets?.[0]) {
      const saved = await persistFile(res.assets[0].uri);
      onChange(saved);
    }
  };

  const choose = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: uri
            ? ["Take Photo", "Choose from Library", "Remove Photo", "Cancel"]
            : ["Take Photo", "Choose from Library", "Cancel"],
          cancelButtonIndex: uri ? 3 : 2,
          destructiveButtonIndex: uri ? 2 : undefined,
        },
        (i) => {
          if (i === 0) pick("camera");
          else if (i === 1) pick("library");
          else if (uri && i === 2) onChange(null);
        }
      );
    } else {
      pick("library");
    }
  };

  return (
    <Pressable style={[styles.photo, { height }]} onPress={choose}>
      {uri ? (
        <Image source={{ uri }} style={styles.photoImg} resizeMode="cover" />
      ) : (
        <View style={styles.photoEmpty}>
          <Ionicons name="camera-outline" size={30} color={colors.textMuted} />
          <Text style={styles.photoEmptyText}>Add a photo</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
    ...shadow,
    shadowOpacity: 0.22,
  },
  primaryText: { color: colors.white, fontSize: type.body, fontWeight: "700" },

  ghost: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  ghostText: { color: colors.text, fontSize: type.body, fontWeight: "700" },

  fab: {
    position: "absolute",
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    ...shadow,
    shadowOpacity: 0.25,
  },
  fabLabel: { color: colors.white, fontSize: type.body, fontWeight: "700", marginLeft: 6 },

  fieldLabel: {
    fontSize: type.label,
    fontWeight: "700",
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: type.body,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
  },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: type.label, fontWeight: "700", color: colors.textMuted },
  chipTextActive: { color: colors.white },

  stepper: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
  },
  stepBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  stepValue: { fontSize: type.heading, fontWeight: "800", color: colors.text, minWidth: 44, textAlign: "center" },

  limitBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  limitBarFull: { backgroundColor: colors.primarySoft, borderBottomColor: colors.primarySoft },
  limitText: { flex: 1, fontSize: type.label, fontWeight: "700", color: colors.textMuted },
  limitUpgrade: { fontSize: type.label, fontWeight: "800", color: colors.primary },

  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  emptyEmoji: { fontSize: 60, marginBottom: spacing.md },
  emptyTitle: { fontSize: type.title, fontWeight: "800", color: colors.text, marginBottom: spacing.sm },
  emptyBody: { fontSize: type.body, color: colors.textMuted, textAlign: "center", lineHeight: 26 },

  photo: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.bgDeep,
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoImg: { width: "100%", height: "100%" },
  photoEmpty: { flex: 1, alignItems: "center", justifyContent: "center" },
  photoEmptyText: { color: colors.textMuted, fontSize: type.label, marginTop: 6, fontWeight: "600" },
});
