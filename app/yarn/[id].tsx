import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createYarn,
  deleteYarn,
  updateYarn,
  yarnByIdQuery,
} from "../../src/db/queries";
import { deleteFile } from "../../src/media";
import { colors, radius, spacing, type } from "../../src/theme";
import { Chips, Field, GhostButton, PhotoPicker, PrimaryButton, Stepper } from "../../src/ui";

const WEIGHTS = [
  { label: "Lace", value: "lace" },
  { label: "Fingering", value: "fingering" },
  { label: "Sport", value: "sport" },
  { label: "DK", value: "dk" },
  { label: "Worsted", value: "worsted" },
  { label: "Aran", value: "aran" },
  { label: "Bulky", value: "bulky" },
  { label: "Super Bulky", value: "super_bulky" },
];

// A friendly starter palette for tagging a yarn's colour.
const SWATCHES = [
  "#C85D4D", "#E0A458", "#E8D5A3", "#7C9070", "#5B8A8F",
  "#4A6FA5", "#8E6FA8", "#C97BA0", "#7A5C43", "#3B2F2A", "#F2EDE4",
];

export default function YarnEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isNew = id === "new";

  const { data } = useLiveQuery(yarnByIdQuery(isNew ? "" : id), [id]);
  const existing = data?.[0];

  const [colorway, setColorway] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState<string | null>(null);
  const [fiber, setFiber] = useState("");
  const [skeins, setSkeins] = useState(1);
  const [yards, setYards] = useState("");
  const [colorHex, setColorHex] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const seeded = useRef(false);
  useEffect(() => {
    if (existing && !seeded.current) {
      setColorway(existing.colorway);
      setBrand(existing.brand);
      setWeight(existing.weight);
      setFiber(existing.fiber);
      setSkeins(existing.skeins);
      setYards(existing.yardsPerSkein ? String(existing.yardsPerSkein) : "");
      setColorHex(existing.colorHex);
      setPhotoUri(existing.photoUri);
      setNotes(existing.notes);
      seeded.current = true;
    }
  }, [existing]);

  const save = () => {
    const payload = {
      colorway,
      brand,
      weight,
      fiber,
      skeins,
      yardsPerSkein: yards ? Number(yards) : null,
      colorHex,
      photoUri,
      notes,
    };
    if (isNew) createYarn(payload);
    else updateYarn(id, payload);
    router.back();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>
      <Stack.Screen options={{ title: isNew ? "Add yarn" : "Edit yarn" }} />

      <PhotoPicker uri={photoUri} onChange={setPhotoUri} height={160} />

      <Field label="Colorway" value={colorway} onChangeText={setColorway} placeholder="e.g. Dusty Rose" />
      <Field label="Brand" value={brand} onChangeText={setBrand} placeholder="e.g. Cascade 220" />

      <Chips label="Weight" options={WEIGHTS} value={weight} onChange={setWeight} />

      <Field label="Fiber" value={fiber} onChangeText={setFiber} placeholder="e.g. 100% merino wool" />

      <View style={styles.row}>
        <Stepper label="Skeins" value={skeins} onChange={setSkeins} min={0} />
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Field label="Yards / skein" value={yards} onChangeText={setYards} keyboardType="number-pad" placeholder="—" />
        </View>
      </View>

      <Text style={styles.swatchLabel}>Colour tag</Text>
      <View style={styles.swatchWrap}>
        {SWATCHES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setColorHex(colorHex === c ? null : c)}
            style={[
              styles.swatch,
              { backgroundColor: c },
              colorHex === c && styles.swatchActive,
            ]}
          />
        ))}
      </View>

      <Field label="Notes" value={notes} onChangeText={setNotes} multiline placeholder="Dye lot, where you bought it…" />

      <PrimaryButton label={isNew ? "Add to stash" : "Save"} onPress={save} style={{ marginTop: spacing.xl }} />

      {!isNew && (
        <GhostButton
          label="Delete yarn"
          danger
          style={{ marginTop: spacing.sm }}
          onPress={() =>
            Alert.alert("Delete yarn?", `"${existing?.colorway}" will be removed.`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  deleteFile(existing?.photoUri);
                  deleteYarn(id);
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
  row: { flexDirection: "row", alignItems: "flex-end" },
  swatchLabel: { fontSize: type.label, fontWeight: "700", color: colors.textMuted, marginTop: spacing.md, marginBottom: spacing.xs },
  swatchWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  swatch: { width: 40, height: 40, borderRadius: radius.pill, borderWidth: 2, borderColor: "transparent" },
  swatchActive: { borderColor: colors.text },
});
