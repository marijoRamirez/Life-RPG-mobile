import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { StyleSheet } from "react-native";

import { theme } from "@/constants/theme";


export const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.bg },
scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 8 },

// Header
header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 6 },
backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
},
title: { flex: 1, fontFamily: theme.fonts.retro, fontSize: 18, color: COLORS.text },

// Vista previa
previewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.greenDark,
    borderWidth: 1,
    borderColor: COLORS.greenBorder,
    marginBottom: 6,
},
previewIconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
},
previewInfo: { flex: 1, gap: 2 },
previewName: { fontSize: 14, fontWeight: "700", color: COLORS.text },
previewSub: { fontSize: 11, color: COLORS.muted },
previewPrice: { flexDirection: "row", alignItems: "center", gap: 6 },
previewPriceText: { fontFamily: theme.fonts.retro, fontSize: 16, color: COLORS.text },

// Secciones
sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: COLORS.muted,
    marginTop: 8,
},
input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
},
inputMultiline: { minHeight: 64, textAlignVertical: "top" },

// Ícono
iconRow: { flexDirection: "row", gap: 8 },
iconOption: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
},
iconOptionActive: { borderColor: COLORS.green, borderWidth: 2 },

// Se paga con
typeRow: { flexDirection: "row", gap: 8 },
typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
},
typeOptionActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
typeText: { fontSize: 12, fontWeight: "700", color: COLORS.text },
typeTextActive: { color: COLORS.ink },

// Precio
priceControl: { flexDirection: "row", alignItems: "center", gap: 8 },
stepButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
},
priceBox: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: "center",
},
priceInput: {
    textAlign: "center",
    fontFamily: theme.fonts.retro,
    fontSize: 20,
    color: COLORS.text,
    padding: 0,
},
hint: { fontSize: 11, color: COLORS.muted },

// Consumible
switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
switchTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text },
switchSub: { fontSize: 11, color: COLORS.muted, marginTop: 2 },

// Footer
footer: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
saveButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
},
saveButtonDisabled: { opacity: 0.5 },
saveText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
});