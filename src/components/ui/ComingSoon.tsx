import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { PixelIcon, type PixelIconName } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";

// Pantalla temporal para las rutas que su módulo todavía no implementa.
// Evita que la app truene al navegar ahí. Se reemplaza al hacer la pantalla real.

type Props = {
  title: string; // "Check-in de hábitos"
  module: string; // "M02 · Hábitos diarios"
  tab?: PixelIconName; // Pestaña del BottomNav que se marca
};

export function ComingSoon({ title, module, tab = "home" }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.body}>
        <PixelIcon name="settings" size={48} color={theme.colors.yellow} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.module}>{module}</Text>
        <Text style={styles.text}>Esta pantalla está en construcción.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
      <BottomNav activeTab={tab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  body: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 24 },
  title: { fontFamily: theme.fonts.retro, fontSize: 24, color: theme.colors.textPrimary, textAlign: "center" },
  module: { fontSize: 13, color: theme.colors.yellow },
  text: { fontSize: 14, color: theme.colors.textSecondary, textAlign: "center" },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceAlt,
  },
  buttonText: { fontFamily: theme.fonts.retro, fontSize: 15, color: theme.colors.textPrimary },
});
