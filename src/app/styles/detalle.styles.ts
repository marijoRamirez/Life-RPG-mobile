import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.bg },
scrollContent: { padding: 16, paddingBottom: 32, gap: 18 },

header: { flexDirection: "row", alignItems: "center", gap: 12 },
backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
},
backText: { fontFamily: "RetroTech", fontSize: 18, color: COLORS.text },
title: { fontFamily: "RetroTech", fontSize: 22, color: COLORS.text },

// Vista previa
previewCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
},
previewEmojiBox: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
},
previewEmoji: { fontSize: 38 },
previewInfo: { flex: 1, gap: 4 },
previewName: { fontFamily: "RetroTech", fontSize: 17, color: COLORS.text },
previewDesc: { fontFamily: "RetroTech", fontSize: 12, color: COLORS.muted },
previewPriceRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
previewPrice: { fontFamily: "RetroTech", fontSize: 18 },

// Formulario
section: { gap: 8 },
label: { fontFamily: "RetroTech", fontSize: 14, color: COLORS.text },
hint: { fontFamily: "RetroTech", fontSize: 11, color: COLORS.muted },
input: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontFamily: "RetroTech",
    fontSize: 15,
},
inputMultiline: { minHeight: 80, textAlignVertical: "top" },

// Tipo de puntos
typeRow: { flexDirection: "row", gap: 8 },
typeOption: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
},
typeText: { fontFamily: "RetroTech", fontSize: 12, color: COLORS.muted },

// Precio
priceControl: { flexDirection: "row", alignItems: "center", gap: 10 },
stepButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
},
stepText: { fontFamily: "RetroTech", fontSize: 20, color: COLORS.text },
priceInput: { flex: 1, textAlign: "center", fontSize: 20 },

// Íconos
emojiRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
},
emojiOptionActive: { borderColor: COLORS.green, backgroundColor: COLORS.surfaceAlt },
emojiOptionText: { fontSize: 24 },

// Botón guardar
saveButton: {
    backgroundColor: COLORS.green,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
},
saveButtonDisabled: { backgroundColor: COLORS.surfaceAlt },
saveText: { fontFamily: "RetroTech", fontSize: 16, color: COLORS.text },
saveTextDisabled: { color: COLORS.muted },
});