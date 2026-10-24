import { StyleSheet } from "react-native";

import { MISSION_COLORS } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 24, gap: 14 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerText: { gap: 4 },
  count: { fontFamily: theme.fonts.retro, fontSize: 12, color: MISSION_COLORS.muted },
  addButton: { backgroundColor: theme.colors.purple, borderColor: theme.colors.purple },
  list: { gap: 10 },
  error: { color: MISSION_COLORS.danger, fontSize: 13, textAlign: "center", padding: 12 },
});
