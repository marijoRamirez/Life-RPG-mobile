import { StyleSheet } from "react-native";

import { theme } from "@/constants/theme";
import { UI_COLORS } from "./ui.styles";

// Estilos del Módulo 5 (Logros y progresión): vitrina, ficha y Tú vs. tú.
export const achievementStyles = StyleSheet.create({
  // 5.1 Vitrina
  headerRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  percent: { fontFamily: theme.fonts.retro, fontSize: 28, color: theme.colors.yellow },
  banner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  bannerText: { flex: 1, fontSize: 13, color: UI_COLORS.softText },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  medal: {
    width: "31%",
    flexGrow: 1,
    maxWidth: "33%",
    padding: 10,
    gap: 6,
    alignItems: "center",
  },
  medalLocked: { opacity: 0.55 },
  medalIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.yellow,
  },
  medalIconLocked: { backgroundColor: theme.colors.surfaceAlt, borderWidth: 2, borderColor: UI_COLORS.border },
  medalName: { fontSize: 12, fontWeight: "bold", color: theme.colors.textPrimary, textAlign: "center" },
  medalCaption: { fontSize: 11, color: UI_COLORS.muted },
  miniTrack: { alignSelf: "stretch", height: 4, borderRadius: 2, backgroundColor: theme.colors.surfaceAlt, overflow: "hidden" },
  miniFill: { height: "100%", backgroundColor: theme.colors.green },
  claimDot: { position: "absolute", top: 8, right: 8, width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.green },

  // 5.2 Ficha
  hero: { alignItems: "center", gap: 10, padding: 20 },
  heroIcon: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.yellow },
  rarity: { fontFamily: theme.fonts.retro, fontSize: 12, letterSpacing: 1 },
  name: { fontFamily: theme.fonts.retro, fontSize: 24, color: theme.colors.textPrimary, textAlign: "center" },
  description: { fontSize: 14, color: UI_COLORS.softText, textAlign: "center", lineHeight: 20 },
  section: { padding: 16, gap: 10 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  progressValue: { fontFamily: theme.fonts.retro, fontSize: 18, color: theme.colors.textPrimary },
  condition: { flexDirection: "row", gap: 8, alignItems: "center" },
  conditionText: { fontSize: 13, color: UI_COLORS.softText, flex: 1 },
  rewardText: { fontSize: 15, fontWeight: "bold", color: theme.colors.yellow },

  // 5.3 Tú vs. tú
  monthsRow: { flexDirection: "row", gap: 16 },
  monthKey: { flexDirection: "row", alignItems: "center", gap: 6 },
  monthSwatch: { width: 14, height: 4, borderRadius: 2 },
  metric: { padding: 14, gap: 8 },
  metricHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metricLabel: { fontSize: 14, fontWeight: "bold", color: theme.colors.textPrimary },
  change: { fontFamily: theme.fonts.retro, fontSize: 14 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceAlt, overflow: "hidden" },
  barValue: { width: 52, textAlign: "right", fontSize: 13, color: theme.colors.textPrimary, fontVariant: ["tabular-nums"] },
});
