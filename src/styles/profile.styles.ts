import { StyleSheet } from "react-native";

import { theme } from "@/constants/theme";
import { UI_COLORS } from "./ui.styles";

// Estilos de Mi perfil, Cambiar contraseña y Ajustes.
export const profileStyles = StyleSheet.create({
  identity: { alignItems: "center", gap: 8, padding: 18 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.purple,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: { width: 88, height: 88 },
  avatarInitial: { fontFamily: theme.fonts.retro, fontSize: 36, color: theme.colors.textPrimary },
  name: { fontFamily: theme.fonts.retro, fontSize: 20, color: theme.colors.textPrimary },
  photoButton: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, borderWidth: 2, borderColor: UI_COLORS.border },
  photoButtonText: { fontSize: 13, fontWeight: "bold", color: theme.colors.textPrimary },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },
  passwordRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  passwordDots: { fontSize: 18, color: UI_COLORS.softText, letterSpacing: 2 },
  linkText: { fontSize: 14, fontWeight: "bold", color: theme.colors.green },
  petRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  pet: { width: 56, height: 56 },
  section: { padding: 14, gap: 12 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  switchText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: "bold", color: theme.colors.textPrimary },
  timeRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  timeColumn: { alignItems: "center", gap: 6 },
  timeButton: {
    width: 48,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: UI_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  timeValue: { fontFamily: theme.fonts.retro, fontSize: 32, color: theme.colors.textPrimary, minWidth: 54, textAlign: "center" },
  timeColon: { fontFamily: theme.fonts.retro, fontSize: 32, color: UI_COLORS.muted },
  navRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  footer: { fontSize: 12, color: UI_COLORS.muted, textAlign: "center" },
});
