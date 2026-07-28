import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createPattern,
  deletePattern,
  patternByIdQuery,
  updatePattern,
} from "../../src/db/queries";
import { useT } from "../../src/i18n";
import { KeyboardAwareScrollView } from "../../src/keyboard";
import { deleteFile, persistFile } from "../../src/media";
import { colors, radius, spacing, type } from "../../src/theme";
import { Chips, Field, GhostButton, PhotoPicker, PrimaryButton } from "../../src/ui";

export default function PatternEditor() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const CRAFTS = [
    { label: t("craft.crochet"), value: "crochet" },
    { label: t("craft.knit"), value: "knit" },
  ];
  const insets = useSafeAreaInsets();
  const isNew = id === "new";

  const { data } = useLiveQuery(patternByIdQuery(isNew ? "" : id), [id]);
  const existing = data?.[0];

  const [title, setTitle] = useState("");
  const [craft, setCraft] = useState("crochet");
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const seeded = useRef(false);
  useEffect(() => {
    if (existing && !seeded.current) {
      setTitle(existing.title);
      setCraft(existing.craft);
      setFileUri(existing.fileUri);
      setFileName(existing.fileName);
      setSourceUrl(existing.sourceUrl ?? "");
      setPhotoUri(existing.photoUri);
      setNotes(existing.notes);
      seeded.current = true;
    }
  }, [existing]);

  const importFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });
    if (!res.canceled && res.assets?.[0]) {
      const asset = res.assets[0];
      const saved = await persistFile(asset.uri, asset.name);
      setFileUri(saved);
      setFileName(asset.name);
    }
  };

  const save = () => {
    const payload = {
      title,
      craft,
      fileUri,
      fileName,
      sourceUrl: sourceUrl.trim() || null,
      photoUri,
      notes,
    };
    if (isNew) createPattern(payload);
    else updatePattern(id, payload);
    router.back();
  };

  const openLink = () => {
    const url = sourceUrl.trim();
    if (/^https?:\/\//i.test(url)) Linking.openURL(url);
    else Alert.alert(t("pattern.fullLinkTitle"), t("pattern.fullLinkBody"));
  };

  return (
    <KeyboardAwareScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
      <Stack.Screen options={{ title: isNew ? t("pattern.addTitle") : t("pattern.editTitle") }} />

      <PhotoPicker uri={photoUri} onChange={setPhotoUri} height={160} />

      <Field label={t("pattern.title")} value={title} onChangeText={setTitle} placeholder={t("pattern.titlePlaceholder")} />
      <Chips label={t("pattern.craft")} options={CRAFTS} value={craft} onChange={setCraft} />

      {/* Attached file */}
      <Text style={styles.fieldLabel}>{t("pattern.file")}</Text>
      {fileUri ? (
        <View style={styles.fileRow}>
          <Ionicons name="document-text" size={22} color={colors.primary} />
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName ?? t("pattern.attachedFile")}
          </Text>
          <Pressable
            hitSlop={10}
            onPress={() => {
              deleteFile(fileUri);
              setFileUri(null);
              setFileName(null);
            }}
          >
            <Ionicons name="close-circle" size={22} color={colors.textFaint} />
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.importBtn} onPress={importFile}>
          <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
          <Text style={styles.importText}>{t("pattern.import")}</Text>
        </Pressable>
      )}

      <Field
        label={t("pattern.sourceLink")}
        value={sourceUrl}
        onChangeText={setSourceUrl}
        placeholder="https://…"
        autoCapitalize="none"
        keyboardType="url"
      />
      {sourceUrl.trim().length > 0 && (
        <Pressable onPress={openLink} style={styles.openLink}>
          <Ionicons name="open-outline" size={16} color={colors.primary} />
          <Text style={styles.openLinkText}>{t("pattern.openLink")}</Text>
        </Pressable>
      )}

      <Field label={t("field.notes")} value={notes} onChangeText={setNotes} multiline placeholder={t("pattern.notesPlaceholder")} />

      <PrimaryButton label={isNew ? t("pattern.save") : t("common.save")} onPress={save} style={{ marginTop: spacing.xl }} />

      {!isNew && (
        <GhostButton
          label={t("pattern.delete")}
          danger
          style={{ marginTop: spacing.sm }}
          onPress={() =>
            Alert.alert(t("pattern.deleteTitle"), t("pattern.deleteBody", { name: existing?.title ?? "" }), [
              { text: t("common.cancel"), style: "cancel" },
              {
                text: t("common.delete"),
                style: "destructive",
                onPress: () => {
                  deleteFile(existing?.fileUri);
                  deleteFile(existing?.photoUri);
                  deletePattern(id);
                  router.back();
                },
              },
            ])
          }
        />
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  fieldLabel: { fontSize: type.label, fontWeight: "700", color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.xs },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  fileName: { flex: 1, fontSize: type.body, color: colors.text, fontWeight: "600" },
  importBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderStyle: "dashed",
    borderRadius: radius.sm,
    paddingVertical: spacing.lg,
  },
  importText: { color: colors.primary, fontSize: type.body, fontWeight: "700" },
  openLink: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.xs },
  openLinkText: { color: colors.primary, fontSize: type.label, fontWeight: "700" },
});
