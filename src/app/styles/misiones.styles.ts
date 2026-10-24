import { StyleSheet } from "react-native";

import { MISSION_COLORS } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";

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
