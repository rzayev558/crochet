import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createPattern,
  deletePattern,
  patternByIdQuery,
  updatePattern,
} from "../../src/db/queries";
import { deleteFile, persistFile } from "../../src/media";
import { colors, radius, spacing, type } from "../../src/theme";
import { Chips, Field, GhostButton, PhotoPicker, PrimaryButton } from "../../src/ui";

const CRAFTS = [
  { label: "Crochet", value: "crochet" },
  { label: "Knit", value: "knit" },
];

export default function PatternEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
    else Alert.alert("Add a full link", "Include https:// so we can open it.");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
      <Stack.Screen options={{ title: isNew ? "Add pattern" : "Edit pattern" }} />

      <PhotoPicker uri={photoUri} onChange={setPhotoUri} height={160} />

      <Field label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Granny Square Blanket" />
      <Chips label="Craft" options={CRAFTS} value={craft} onChange={setCraft} />

      {/* Attached file */}
      <Text style={styles.fieldLabel}>Pattern file</Text>
      {fileUri ? (
        <View style={styles.fileRow}>
          <Ionicons name="document-text" size={22} color={colors.primary} />
          <Text style={styles.fileName} numberOfLines={1}>
            {fileName ?? "Attached file"}
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
          <Text style={styles.importText}>Import a PDF or image</Text>
        </Pressable>
      )}

      <Field
        label="Source link"
        value={sourceUrl}
        onChangeText={setSourceUrl}
        placeholder="https://…"
        autoCapitalize="none"
        keyboardType="url"
      />
      {sourceUrl.trim().length > 0 && (
        <Pressable onPress={openLink} style={styles.openLink}>
          <Ionicons name="open-outline" size={16} color={colors.primary} />
          <Text style={styles.openLinkText}>Open link</Text>
        </Pressable>
      )}

      <Field label="Notes" value={notes} onChangeText={setNotes} multiline placeholder="Hook size, gauge, yardage…" />

      <PrimaryButton label={isNew ? "Save pattern" : "Save"} onPress={save} style={{ marginTop: spacing.xl }} />

      {!isNew && (
        <GhostButton
          label="Delete pattern"
          danger
          style={{ marginTop: spacing.sm }}
          onPress={() =>
            Alert.alert("Delete pattern?", `"${existing?.title}" will be removed.`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
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
    </ScrollView>
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
