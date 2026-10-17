import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.bg },
scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },

// Header
title: { fontFamily: "RetroTech", fontSize: 26, color: COLORS.text },
subtitle: { fontFamily: "RetroTech", fontSize: 13, color: COLORS.muted, marginTop: 2 },

// Billetera de puntos
walletRow: { flexDirection: "row", gap: 8 },
walletChip: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
},
walletValue: { fontFamily: "RetroTech", fontSize: 18, color: COLORS.text },
walletLabel: { fontFamily: "RetroTech", fontSize: 11, color: COLORS.muted },

// Filtro de categorías
filterRow: { gap: 8, paddingRight: 8 },
filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.border,
},
filterPillActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
filterText: { fontFamily: "RetroTech", fontSize: 13, color: COLORS.muted },
filterTextActive: { color: COLORS.text },

// Cuadrícula
grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
card: {
    width: "48%",
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    gap: 8,
},
emojiBox: {
    height: 64,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
},
emoji: { fontSize: 34 },
itemName: { fontFamily: "RetroTech", fontSize: 15, color: COLORS.text },
itemDesc: { fontFamily: "RetroTech", fontSize: 11, color: COLORS.muted, minHeight: 30 },
priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
priceText: { fontFamily: "RetroTech", fontSize: 16 },
buyButton: {
    backgroundColor: COLORS.green,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
},
buyButtonDisabled: { backgroundColor: COLORS.surfaceAlt },
buyText: { fontFamily: "RetroTech", fontSize: 13, color: COLORS.text },
buyTextDisabled: { color: COLORS.muted },

emptyText: {
    fontFamily: "RetroTech",
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 24,
    width: "100%",
},

// Botón crear recompensa
createButton: {
    backgroundColor: COLORS.purple,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
},
createText: { fontFamily: "RetroTech", fontSize: 15, color: COLORS.text },
});