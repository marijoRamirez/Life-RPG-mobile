import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PixelIcon } from "@/components/ui/PixelIcons";
import { MISSION_COLORS, MISSION_TYPE_META } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import type { Mission } from "@/models/Mission";
import { shared } from "@/app/styles/misiones.styles";

type Props = { mission: Mission; onStart: (mission: Mission) => void };

// Tarjeta del tablero de selección (RF010)
export function MissionCard({ mission, onStart }: Props) {
  const meta = MISSION_TYPE_META[mission.type];
  const tag =
    mission.type === "enfoque"
      ? { label: "Bloqueo", icon: "lock" as const }
      : mission.type === "fisico"
        ? { label: "Smartwatch", icon: "heart" as const }
        : null;

  return (
    <View style={[shared.card, styles.card]}>
      <View style={[styles.iconBox, { backgroundColor: meta.color + "26" }]}>
        <PixelIcon name={meta.icon} size={24} color={meta.color} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{mission.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.type, { color: meta.color }]}>{meta.label}</Text>
          <Text style={styles.meta}>· {mission.durationMin} min</Text>
          {tag && (
            <>
              <Text style={styles.meta}>·</Text>
              <PixelIcon name={tag.icon} size={12} color={MISSION_COLORS.muted} />
              <Text style={styles.meta}>{tag.label}</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.side}>
        <Text style={styles.xp}>+{mission.reward.xp} XP</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => onStart(mission)}
          accessibilityRole="button"
          accessibilityLabel={`Iniciar ${mission.title}`}
        >
          <Text style={styles.startText}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 4 },
  title: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: "bold" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" },
  type: { fontFamily: theme.fonts.retro, fontSize: 12 },
  meta: { color: MISSION_COLORS.muted, fontSize: 12 },
  side: { alignItems: "flex-end", gap: 6 },
  xp: { fontFamily: theme.fonts.retro, fontSize: 13, color: theme.colors.yellow },
  startButton: {
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.textPrimary,
    justifyContent: "center",
  },
  startText: { fontFamily: theme.fonts.retro, fontSize: 13, color: MISSION_COLORS.onAccent },
});
