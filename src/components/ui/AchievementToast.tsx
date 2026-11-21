import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { theme } from "@/constants/theme";
import { onAchievementsUnlocked } from "@/services/achievementEvents";
import { PixelIcon } from "./PixelIcons";

// Aviso "¡Logro desbloqueado!" (M05 · RDF062). Aparece arriba de cualquier pantalla
// unos segundos con una animación de entrada (cae y rebota); al tocarlo abre la Vitrina.
const VISIBLE_MS = 5000;

export function AchievementToast() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [names, setNames] = useState<string[]>([]);

  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => onAchievementsUnlocked(setNames), []);

  // Animación de entrada (RDF062): baja desde arriba con un pequeño rebote
  useEffect(() => {
    if (!names.length) return;
    enter.setValue(0);
    Animated.timing(enter, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.6)), useNativeDriver: true }).start();
  }, [names, enter]);

  useEffect(() => {
    if (!names.length) return;
    const timer = setTimeout(() => setNames([]), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [names]);

  if (!names.length) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          top: insets.top + 8,
          opacity: enter,
          transform: [
            { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] }) },
            { scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toast}
        onPress={() => {
          setNames([]);
          router.push("/area2_economia/logros/vitrina");
        }}
        accessibilityRole="alert"
        accessibilityLabel={`Logro desbloqueado: ${names.join(", ")}`}
      >
        <PixelIcon name="trophy" size={28} color={theme.colors.background} />
        <Animated.View style={{ flex: 1 }}>
          <Text style={styles.kicker}>¡Logro desbloqueado!</Text>
          <Text style={styles.name}>{names.join(" · ")}</Text>
        </Animated.View>
        <Text style={styles.cta}>Ver</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, zIndex: 100 },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: theme.colors.yellow,
    borderBottomWidth: 4,
    borderBottomColor: "#B88600",
  },
  kicker: { fontFamily: theme.fonts.retro, fontSize: 13, color: theme.colors.background },
  name: { fontSize: 15, fontWeight: "bold", color: theme.colors.background },
  cta: { fontFamily: theme.fonts.retro, fontSize: 14, color: theme.colors.background },
});
