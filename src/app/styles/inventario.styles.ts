import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { StyleSheet } from "react-native";

import { theme } from "@/constants/theme";


export const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: COLORS.bg },
scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 10 },

// Header
header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
title: { fontFamily: theme.fonts.retro, fontSize: 24, color: COLORS.text },
count: { fontSize: 12, color: COLORS.muted },

sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: COLORS.muted,
    marginTop: 8,
},
emptyText: { fontSize: 12, color: COLORS.muted },

// Recompensas activas
rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
},
rewardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
},
rewardInfo: { flex: 1, gap: 2 },
rewardName: { fontSize: 14, fontWeight: "700", color: COLORS.text },
rewardSub: { fontSize: 11, color: COLORS.muted },
redeemButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
},
redeemText: { fontSize: 12, fontWeight: "700", color: COLORS.ink },

// Consumibles
consumableRow: { flexDirection: "row", gap: 8 },
consumableCard: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
},
qty: { position: "absolute", top: 6, right: 8, fontSize: 10, fontWeight: "700", color: COLORS.amber },
consumableName: { fontSize: 11, fontWeight: "700", color: COLORS.text, textAlign: "center" },
consumableUse: { fontSize: 10, color: COLORS.muted },

// Ropa
clothingRow: { flexDirection: "row", gap: 8 },
clothingTile: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
},
clothingTileActive: { borderColor: COLORS.green, borderWidth: 2 },
clothingName: { fontSize: 11, fontWeight: "700", color: COLORS.text },

// Footer
footer: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 4 },
wardrobeButton: {
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
wardrobeText: { fontSize: 14, fontWeight: "700", color: COLORS.text },
});