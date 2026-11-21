import { StyleSheet } from "react-native";

import { theme } from "@/constants/theme";

// Estilos del acceso (M00): Login, Crear cuenta, Recuperar contraseña y Bienvenida.
// Mismo lenguaje visual que el resto de la app (tema oscuro, fuente retro, bordes de 2 px).

export const AUTH_COLORS = {
  border: "#3A3A48",
  muted: "#9A9AAE",
  softText: "#C9C9D6",
  danger: "#FF6B5E",
  onAccent: "#12121A", // Texto sobre botones de color
  greenShadow: "#2E7D32",
  google: "#FFFFFF",
};

export const authStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24, paddingBottom: 40, gap: 16, flexGrow: 1 },
  centered: { justifyContent: "center" },

  // Encabezado
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AUTH_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontFamily: theme.fonts.retro, fontSize: 24, color: theme.colors.textPrimary, flexShrink: 1 },
  subtitle: { fontSize: 14, color: AUTH_COLORS.softText, lineHeight: 20 },

  // Portada del login
  hero: { alignItems: "center", gap: 10, paddingTop: 12, paddingBottom: 8 },
  petsRow: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 2 },
  heroPet: { width: 56, height: 56 },
  heroPetCenter: { width: 80, height: 80 },
  brand: { fontFamily: theme.fonts.retro, fontSize: 34, color: theme.colors.textPrimary, letterSpacing: 1 },
  tagline: { fontSize: 14, color: AUTH_COLORS.muted, textAlign: "center" },

  // Campos
  field: { gap: 6 },
  label: {
    fontFamily: theme.fonts.retro,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: AUTH_COLORS.muted,
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AUTH_COLORS.border,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  inputDisabled: { opacity: 0.6 },
  inputError: { borderColor: AUTH_COLORS.danger },
  passwordRow: { justifyContent: "center" }, // El botón "Mostrar" va encima del campo, a la derecha
  showButton: { position: "absolute", right: 12, paddingVertical: 8, paddingHorizontal: 4 },
  showText: { fontSize: 13, fontWeight: "bold", color: AUTH_COLORS.softText },
  hint: { fontSize: 12, color: AUTH_COLORS.muted },
  fieldError: { fontSize: 12, color: AUTH_COLORS.danger },
  row: { flexDirection: "row", gap: 12 },
  half: { flex: 1 },

  // Reglas de contraseña
  rules: { gap: 4 },
  rule: { flexDirection: "row", alignItems: "center", gap: 6 },
  ruleText: { fontSize: 12, color: AUTH_COLORS.muted },
  ruleOk: { color: theme.colors.green },

  // Chips (género y metas)
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: AUTH_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: theme.colors.green, borderColor: theme.colors.green },
  chipText: { fontSize: 13, color: theme.colors.textPrimary },
  chipTextActive: { color: AUTH_COLORS.onAccent, fontWeight: "bold" },

  // Botones
  primaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: theme.colors.green,
    borderBottomWidth: 4,
    borderBottomColor: AUTH_COLORS.greenShadow,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: { fontFamily: theme.fonts.retro, fontSize: 16, color: AUTH_COLORS.onAccent },
  googleButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: AUTH_COLORS.google,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#DADCE0",
    alignItems: "center",
    justifyContent: "center",
  },
  googleBadgeText: { fontSize: 14, fontWeight: "bold", color: "#3C4043" },
  googleButtonText: { fontSize: 16, fontWeight: "bold", color: "#3C4043" },
  disabled: { opacity: 0.45 },
  linkButton: { alignSelf: "center", paddingVertical: 8 },
  linkText: { fontSize: 14, color: theme.colors.textPrimary, fontWeight: "bold", textDecorationLine: "underline" },
  linkMuted: { fontSize: 14, color: AUTH_COLORS.muted },
  forgot: { alignSelf: "flex-end", paddingVertical: 4 },

  // Separador "o con tu correo"
  divider: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 2, backgroundColor: AUTH_COLORS.border },
  dividerText: { fontSize: 12, color: AUTH_COLORS.muted },

  // Mensajes
  error: { color: AUTH_COLORS.danger, fontSize: 13, textAlign: "center" },
  notice: { color: theme.colors.green, fontSize: 14, textAlign: "center", lineHeight: 20 },
  infoCard: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: AUTH_COLORS.border,
    backgroundColor: theme.colors.surface,
  },
  infoText: { flex: 1, fontSize: 12, color: AUTH_COLORS.softText, lineHeight: 17 },

  // Bienvenida: elegir animal
  petGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  petCard: {
    width: "30%",
    aspectRatio: 0.85,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AUTH_COLORS.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  petCardActive: { borderColor: theme.colors.yellow, backgroundColor: theme.colors.surfaceAlt },
  petImage: { width: 76, height: 76 },
  petName: { fontFamily: theme.fonts.retro, fontSize: 14, color: theme.colors.textPrimary },
  previewCard: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 18,
    borderRadius: 10,
    backgroundColor: theme.colors.green,
  },
  previewImage: { width: 128, height: 128 },
  previewText: { fontFamily: theme.fonts.retro, fontSize: 16, color: AUTH_COLORS.onAccent },
  footer: { padding: 24, paddingTop: 8, gap: 8 },
});
