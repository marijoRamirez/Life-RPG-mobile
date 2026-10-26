import { StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";

type Props = { progress: number; color: string; segments?: number };

// Barra de avance en bloques, al estilo pixel art
export function SegmentedProgress({ progress, color, segments = 20 }: Props) {
  const filled = Math.round(Math.min(1, Math.max(0, progress)) * segments);
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
    >
      {Array.from({ length: segments }, (_, i) => (
        <View key={i} style={[styles.segment, { backgroundColor: i < filled ? color : theme.colors.surfaceAlt }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 3, alignSelf: "stretch" },
  segment: { flex: 1, height: 14, borderRadius: 2 },
});
