import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MISSION_COLORS } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";

export type PillOption<K extends string> = { key: K; label: string; color: string };

type Props<K extends string> = {
  options: PillOption<K>[];
  value: K;
  onChange: (key: K) => void;
  accessibilityLabel: string;
};

// Fila de filtros tipo "píldora": la activa se rellena con el color de su opción
export function FilterPills<K extends string>({ options, value, onChange, accessibilityLabel }: Props<K>) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <TouchableOpacity
            key={o.key}
            style={[styles.pill, active && { backgroundColor: o.color, borderColor: o.color }]}
            onPress={() => onChange(o.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.text, active && styles.textActive]} numberOfLines={1}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  pill: {
    flex: 1,
    height: 36,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  text: { fontFamily: theme.fonts.retro, fontSize: 13, color: MISSION_COLORS.muted },
  textActive: { color: MISSION_COLORS.onAccent },
});
