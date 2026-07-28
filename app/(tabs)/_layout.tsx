import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useT } from "../../src/i18n";
import { colors, spacing, type } from "../../src/theme";

export default function TabsLayout() {
  const router = useRouter();
  const t = useT();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: {
          color: colors.text,
          fontSize: type.title,
          fontWeight: "800",
        },
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/settings")}
            hitSlop={12}
            style={{ marginRight: spacing.md }}
          >
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.projects"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stash"
        options={{
          title: t("tabs.stash"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="color-palette-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="patterns"
        options={{
          title: t("tabs.patterns"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t("tabs.learn"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
