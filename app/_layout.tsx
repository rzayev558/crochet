import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import migrations from "../drizzle/migrations";
import { db } from "../src/db/client";
import { migrateLegacyCountersIfNeeded } from "../src/db/queries";
import { useEntitlements } from "../src/entitlements/store";
import { useLanguage, useT } from "../src/i18n";
import { Onboarding } from "../src/onboarding";
import { colors, spacing, type } from "../src/theme";

const ONBOARDED_KEY = "loop.onboarded.v1";

export default function RootLayout() {
  const t = useT();
  const { success, error } = useMigrations(db, migrations);
  const [legacyDone, setLegacyDone] = useState(false);
  const initEntitlements = useEntitlements((s) => s.init);
  const initLanguage = useLanguage((s) => s.init);
  const languageReady = useLanguage((s) => s.ready);

  // null = still loading the flag; false = show onboarding; true = go to app.
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    initEntitlements();
    initLanguage();
    AsyncStorage.getItem(ONBOARDED_KEY).then((v) => setOnboarded(v === "1"));
  }, [initEntitlements, initLanguage]);

  const finishOnboarding = () => {
    AsyncStorage.setItem(ONBOARDED_KEY, "1");
    setOnboarded(true);
  };

  useEffect(() => {
    if (success) migrateLegacyCountersIfNeeded().finally(() => setLegacyDone(true));
  }, [success]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        {error ? (
          <Gate>
            <Text style={styles.err}>{t("gate.dbError")}</Text>
            <Text style={styles.errSub}>{error.message}</Text>
          </Gate>
        ) : !success || !legacyDone || onboarded === null || !languageReady ? (
          <Gate>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loading}>{t("gate.loading")}</Text>
          </Gate>
        ) : !onboarded ? (
          <Onboarding onDone={finishOnboarding} />
        ) : (
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerShadowVisible: false,
              headerTintColor: colors.primary,
              headerTitleStyle: {
                color: colors.text,
                fontSize: type.heading,
                fontWeight: "700",
              },
              contentStyle: { backgroundColor: colors.bg },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="project/[id]" options={{ title: "" }} />
            <Stack.Screen name="counter/[id]" options={{ title: "", headerBackTitle: t("common.back") }} />
            <Stack.Screen
              name="yarn/[id]"
              options={{ presentation: "modal", title: t("nav.yarn") }}
            />
            <Stack.Screen
              name="pattern/[id]"
              options={{ presentation: "modal", title: t("nav.pattern") }}
            />
            <Stack.Screen name="lesson/[id]" options={{ title: "" }} />
            <Stack.Screen
              name="paywall"
              options={{ presentation: "modal", title: "" }}
            />
            <Stack.Screen name="settings" options={{ title: t("nav.settings") }} />
          </Stack>
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function Gate({ children }: { children: React.ReactNode }) {
  return <View style={styles.gate}>{children}</View>;
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  loading: { marginTop: spacing.md, color: colors.textMuted, fontSize: type.body },
  err: { color: colors.danger, fontSize: type.heading, fontWeight: "700" },
  errSub: { color: colors.textMuted, fontSize: type.label, marginTop: spacing.sm, textAlign: "center" },
});
