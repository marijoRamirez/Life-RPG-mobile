import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

import { petImage } from "@/constants/petTypes";
import { theme } from "@/constants/theme";
import type { PetSpecies } from "@/models/Account";
import { PixelIcon, type PixelIconName } from "./PixelIcons";

// Mascota animada (M01 · RDF016): se dibuja con su ropa equipada y con un estado
// visual según su HP. Feliz (70+) brinca alegre, Cansado (40-69) se mueve lento y
// Enfermo (menos de 40) se queda quieto y apagado. Si el sistema pide reducir el
// movimiento, no se anima.

export type PetMood = "feliz" | "cansado" | "enfermo";

export const petMoodFromHp = (hp: number, hpMax = 100): PetMood => {
  const ratio = hpMax ? hp / hpMax : 1;
  return ratio >= 0.7 ? "feliz" : ratio >= 0.4 ? "cansado" : "enfermo";
};

const MOOD_META: Record<PetMood, { label: string; icon: PixelIconName; color: string; bounce: number; ms: number }> = {
  feliz: { label: "Feliz", icon: "heart", color: theme.colors.green, bounce: 8, ms: 700 },
  cansado: { label: "Cansado", icon: "moon", color: theme.colors.yellow, bounce: 3, ms: 1600 },
  enfermo: { label: "Enfermo", icon: "info", color: "#FF6B5E", bounce: 0, ms: 0 },
};

type Props = {
  species: PetSpecies | null | undefined;
  hp?: number;
  hpMax?: number;
  size?: number;
  equipped?: { id: string; name: string; icon: PixelIconName }[]; // Ropa equipada
  showMood?: boolean; // Etiqueta "Feliz / Cansado / Enfermo"
};

export function PetAvatar({ species, hp = 100, hpMax = 100, size = 128, equipped = [], showMood = true }: Props) {
  const mood = petMoodFromHp(hp, hpMax);
  const meta = MOOD_META[mood];
  const offset = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => setReduceMotion(false));
  }, []);

  useEffect(() => {
    offset.setValue(0);
    if (reduceMotion || !meta.bounce) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(offset, { toValue: -meta.bounce, duration: meta.ms / 2, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(offset, { toValue: 0, duration: meta.ms / 2, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mood, reduceMotion, meta.bounce, meta.ms, offset]);

  return (
    <View style={styles.wrap} accessibilityLabel={`Tu mascota está ${meta.label.toLowerCase()}`}>
      <Animated.View style={{ transform: [{ translateY: offset }] }}>
        <Image
          source={petImage(species)}
          style={{ width: size, height: size, opacity: mood === "enfermo" ? 0.6 : 1 }}
          resizeMode="contain"
        />
      </Animated.View>
      {equipped.length > 0 && (
        <View style={styles.equipRow} accessibilityLabel={`Lleva puesto: ${equipped.map((e) => e.name).join(", ")}`}>
          {equipped.map((e) => (
            <View key={e.id} style={styles.equipBadge}>
              <PixelIcon name={e.icon} size={12} color={theme.colors.background} />
            </View>
          ))}
        </View>
      )}
      {showMood && (
        <View style={[styles.mood, { borderColor: meta.color }]}>
          <PixelIcon name={meta.icon} size={10} color={meta.color} />
          <Text style={[styles.moodText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 4 },
  equipRow: { flexDirection: "row", gap: 4 },
  equipBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  mood: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "rgba(18,18,26,0.75)",
  },
  moodText: { fontSize: 11, fontWeight: "bold" },
});
