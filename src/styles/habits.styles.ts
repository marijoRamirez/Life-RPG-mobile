import { StyleSheet } from "react-native";

import { MISSION_TYPE_META } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import { UI_COLORS } from "./ui.styles";

// Estilos del Módulo 2 (Hábitos): check-in, creador y calendario de rachas.

// Mismo color por tipo de punto que Misiones y Tienda
export const TYPE_COLOR = {
  cultura: MISSION_TYPE_META.cultura.color,
  fisico: MISSION_TYPE_META.fisico.color,
  enfoque: MISSION_TYPE_META.enfoque.color,
};

export const DAY_COLORS = {
  completo: theme.colors.green,
  parcial: UI_COLORS.partial,
  fallido: UI_COLORS.danger,
};

export const habitStyles = StyleSheet.create({
  // 2.1 Check-in
  summary: { padding: 16, gap: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  count: { fontFamily: theme.fonts.retro, fontSize: 28, color: theme.colors.textPrimary },
  petRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  pet: { width: 56, height: 56 },
  petText: { flex: 1, fontSize: 13, color: UI_COLORS.softText, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  rowDone: { borderColor: theme.colors.green },
  check: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: UI_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkDone: { backgroundColor: theme.colors.green, borderColor: theme.colors.green },
  rowText: { flex: 1, gap: 2, minWidth: 0 },
  rowTitle: { fontSize: 15, fontWeight: "bold", color: theme.colors.textPrimary },
  rowTitleDone: { color: UI_COLORS.softText, textDecorationLine: "line-through" },
  rowMeta: { fontSize: 12, color: UI_COLORS.muted },
  reward: { fontFamily: theme.fonts.retro, fontSize: 16, color: theme.colors.yellow },
  streakTag: { fontSize: 11, color: UI_COLORS.muted },
  typeDot: { width: 8, height: 8, borderRadius: 4 },
  editButton: { padding: 6 },
  pausedRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12 },

  // 2.2 Creador
  daysRow: { flexDirection: "row", gap: 6 },
  dayButton: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: UI_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButtonActive: { backgroundColor: theme.colors.green, borderColor: theme.colors.green },
  dayText: { fontFamily: theme.fonts.retro, fontSize: 14, color: UI_COLORS.muted },
  dayTextActive: { color: UI_COLORS.onAccent },
  focusCard: { padding: 14, gap: 12 },
  focusHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  stepButton: {
    width: 48,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: UI_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  focusValue: { fontFamily: theme.fonts.retro, fontSize: 24, color: theme.colors.textPrimary },
  warning: { flexDirection: "row", gap: 10, padding: 12, alignItems: "flex-start", borderColor: theme.colors.yellow },
  warningText: { flex: 1, fontSize: 12, color: UI_COLORS.softText, lineHeight: 17 },
  field: { gap: 8 },

  // 2.3 Rachas
  monthHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  monthTitle: { fontFamily: theme.fonts.retro, fontSize: 18, color: theme.colors.textPrimary },
  streakCard: { flexDirection: "row", padding: 16, gap: 12, alignItems: "center" },
  streakBig: { fontFamily: theme.fonts.retro, fontSize: 32, color: theme.colors.yellow },
  streakInfo: { flex: 1, gap: 2 },
  streakSide: { alignItems: "flex-end", gap: 2 },
  sideValue: { fontFamily: theme.fonts.retro, fontSize: 20, color: theme.colors.textPrimary },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  weekHeader: { flexDirection: "row" },
  weekDay: { width: `${100 / 7}%`, textAlign: "center", fontFamily: theme.fonts.retro, fontSize: 12, color: UI_COLORS.muted, paddingBottom: 6 },
  cellWrap: { width: `${100 / 7}%`, aspectRatio: 1, padding: 3 },
  cell: { flex: 1, borderRadius: 6, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.surfaceAlt },
  cellToday: { borderWidth: 2, borderColor: theme.colors.yellow },
  cellText: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: "bold" },
  cellTextDim: { color: UI_COLORS.muted, fontWeight: "normal" },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 3 },
  legendText: { fontSize: 12, color: UI_COLORS.muted },
  filters: { gap: 8, paddingRight: 8 },
  habitStreakRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: UI_COLORS.border },
  habitStreakName: { fontSize: 14, color: theme.colors.textPrimary, flex: 1 },
  habitStreakValue: { fontFamily: theme.fonts.retro, fontSize: 16, color: theme.colors.yellow },
});
