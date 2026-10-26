import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { StyleSheet } from "react-native";
import { theme } from "@/constants/theme";


export const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.bg },
scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 14 },

// Header
header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
title: { fontFamily: theme.fonts.retro, fontSize: 24, color: COLORS.text },
gridButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
},

// Billetera
walletRow: { flexDirection: "row", gap: 8 },
walletChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
},
walletValue: { fontFamily: theme.fonts.retro, fontSize: 14, color: COLORS.text },

// Filtros
segment: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 4,
},
segmentItem: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: "center" },
segmentItemActive: { backgroundColor: COLORS.bg },
segmentText: { fontSize: 13, fontWeight: "600", color: COLORS.muted },
segmentTextActive: { color: COLORS.text, fontWeight: "700" },

// Cuadrícula
grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
card: {
    width: "48%",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 10,
    gap: 10,
},
cardLocked: { opacity: 0.55 },
iconBox: {
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
},
badge: {
    position: "absolute",
    top: 4,
    right: 6,
},
badgeText: { fontSize: 9, fontWeight: "700", color: COLORS.muted, letterSpacing: 0.5 },
itemName: { fontSize: 13, fontWeight: "700", color: COLORS.text },
priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
priceText: { fontFamily: theme.fonts.retro, fontSize: 14, color: COLORS.text },
priceType: { fontSize: 11, color: COLORS.muted },

emptyText: { width: "100%", textAlign: "center", color: COLORS.muted, marginTop: 24, fontSize: 13 },

// Footer
footer: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 4 },
createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
},
createText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
});