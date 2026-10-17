import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.bg },
scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },

title: { fontFamily: "RetroTech", fontSize: 26, color: COLORS.text },
subtitle: { fontFamily: "RetroTech", fontSize: 13, color: COLORS.muted, marginTop: 2 },

// Filtro por tipo
filterRow: { flexDirection: "row", gap: 8 },
filterPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
},
filterPillActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
filterText: { fontFamily: "RetroTech", fontSize: 12, color: COLORS.muted },
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
cardEquipped: { borderColor: COLORS.green },
emojiBox: {
    height: 64,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
},
emoji: { fontSize: 34 },
qtyBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.amber,
    borderRadius: 10,
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
},
qtyText: { fontFamily: "RetroTech", fontSize: 12, color: "#14141B" },
itemName: { fontFamily: "RetroTech", fontSize: 14, color: COLORS.text },
tagRow: { flexDirection: "row", alignItems: "center", gap: 6, minHeight: 18 },
tagText: { fontFamily: "RetroTech", fontSize: 11, color: COLORS.muted },
actionButton: {
    backgroundColor: COLORS.purple,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
},
actionButtonEquipped: { backgroundColor: COLORS.surfaceAlt },
actionText: { fontFamily: "RetroTech", fontSize: 13, color: COLORS.text },

// Vacío
emptyBox: { width: "100%", alignItems: "center", gap: 10, marginTop: 24 },
emptyText: { fontFamily: "RetroTech", fontSize: 14, color: COLORS.muted, textAlign: "center" },
emptyButton: {
    backgroundColor: COLORS.green,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
},
emptyButtonText: { fontFamily: "RetroTech", fontSize: 13, color: COLORS.text },
});