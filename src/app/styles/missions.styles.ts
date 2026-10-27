import { StyleSheet } from "react-native";

import { MISSION_COLORS } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";

// Estilos del módulo de misiones: tablero, historial, enfoque, tarjetas y modales.
// Agrupados en un solo archivo para evitar estilos duplicados entre pantallas.

const container = { flex: 1, backgroundColor: theme.colors.background } as const;
const listContent = { padding: 20, paddingBottom: 24, gap: 14 } as const;
const errorText = {
  color: MISSION_COLORS.danger,
  fontSize: 13,
  textAlign: "center",
  padding: 12,
} as const;

// Estilos compartidos por las pantallas y componentes del Módulo 3
export const shared = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    borderRadius: 8,
  },
  label: {
    fontFamily: theme.fonts.retro,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: MISSION_COLORS.muted,
  },
  title: { fontFamily: theme.fonts.retro, fontSize: 26, color: theme.colors.textPrimary },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: theme.colors.green,
    borderBottomWidth: 4,
    borderBottomColor: MISSION_COLORS.greenShadow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: { fontFamily: theme.fonts.retro, fontSize: 16, color: MISSION_COLORS.onAccent },
  secondaryButton: {
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryButtonText: { fontFamily: theme.fonts.retro, fontSize: 15, color: theme.colors.textPrimary },
  disabled: { opacity: 0.45 },
  centerText: { color: MISSION_COLORS.muted, fontSize: 13, textAlign: "center", padding: 24 },
});

// Tablero de misiones
export const boardStyles = StyleSheet.create({
  container,
  scrollContent: listContent,
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerText: { gap: 4 },
  count: { fontFamily: theme.fonts.retro, fontSize: 12, color: MISSION_COLORS.muted },
  addButton: { backgroundColor: theme.colors.purple, borderColor: theme.colors.purple },
  list: { gap: 10 },
  error: errorText,
});

// Historial de misiones
export const historyStyles = StyleSheet.create({
  container,
  scrollContent: listContent,
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  subtitle: { fontSize: 12, color: MISSION_COLORS.muted },
  summaryRow: { flexDirection: "row", gap: 8 },
  summaryTile: { flex: 1, padding: 10, gap: 2 },
  summaryValue: { fontFamily: theme.fonts.retro, fontSize: 22 },
  summaryLabel: { fontSize: 11, color: MISSION_COLORS.muted },
  segmented: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surface,
  },
  segment: { flex: 1, height: 36, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  segmentActive: { backgroundColor: theme.colors.surfaceAlt },
  segmentText: { fontFamily: theme.fonts.retro, fontSize: 13, color: MISSION_COLORS.muted },
  segmentTextActive: { color: theme.colors.textPrimary },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceAlt,
  },
  rowIcon: { width: 36, height: 36, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  rowBody: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 14, fontWeight: "bold", color: theme.colors.textPrimary },
  rowMeta: { fontSize: 11, color: MISSION_COLORS.muted },
  rowSide: { alignItems: "flex-end", gap: 4 },
  badge: { fontFamily: theme.fonts.retro, fontSize: 11, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: "hidden" },
  badgeDone: { color: theme.colors.green, backgroundColor: theme.colors.green + "26" },
  badgeFail: { color: MISSION_COLORS.danger, backgroundColor: MISSION_COLORS.danger + "26" },
  rowXp: { fontFamily: theme.fonts.retro, fontSize: 13 },
  error: errorText,
});

// Sesión de enfoque
export const focusStyles = StyleSheet.create({
  container,
  content: { flexGrow: 1, padding: 20, gap: 16, alignItems: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 24 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
  },
  chipText: { fontFamily: theme.fonts.retro, fontSize: 13, color: theme.colors.textPrimary },
  missionBlock: { alignItems: "center", gap: 6 },
  missionTitle: { fontFamily: theme.fonts.retro, fontSize: 21, color: theme.colors.textPrimary, textAlign: "center" },
  timerBlock: { alignItems: "center", gap: 6 },
  timer: { fontFamily: theme.fonts.retro, fontSize: 72, color: theme.colors.textPrimary },
  timerHint: { fontSize: 12, color: MISSION_COLORS.muted },
  habitat: {
    alignSelf: "stretch",
    height: 178,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  habitatBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  habitatBadgeText: { fontFamily: theme.fonts.retro, fontSize: 11, color: theme.colors.textPrimary },
  speech: {
    position: "absolute",
    top: 14,
    right: 14,
    maxWidth: 140,
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  speechText: { fontSize: 11, lineHeight: 15, textAlign: "center", color: theme.colors.textPrimary },
  pet: { width: 120, height: 120, marginBottom: 8 },
  rewardRow: { flexDirection: "row", gap: 8, alignSelf: "stretch" },
  rewardChip: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    backgroundColor: theme.colors.surfaceAlt,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  rewardText: { fontFamily: theme.fonts.retro, fontSize: 13 },
  footer: { alignSelf: "stretch", marginTop: "auto", gap: 10 },
  note: { fontSize: 12, lineHeight: 17, color: MISSION_COLORS.muted, textAlign: "center" },
  devButton: { alignSelf: "center", padding: 8 },
  devText: { fontSize: 12, color: MISSION_COLORS.muted, textDecorationLine: "underline" },
  error: { color: MISSION_COLORS.danger, fontSize: 14, textAlign: "center" },
});
