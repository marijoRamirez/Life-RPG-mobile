import { StyleSheet } from "react-native";

import { MISSION_COLORS } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 24, gap: 14 },
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
  error: { color: MISSION_COLORS.danger, fontSize: 13, textAlign: "center", padding: 12 },
});
