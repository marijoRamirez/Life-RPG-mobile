import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { theme } from "@/constants/theme";
import { StyleSheet } from "react-native";

/* ==========================================================
 * 4.1 Escaparate de recompensas
 * ========================================================== */
export const showcaseStyles = StyleSheet.create({
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
  badge: { position: "absolute", top: 4, right: 6 },
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

/* ==========================================================
 * 4.2 Detalle de compra · creador
 * ========================================================== */
export const itemDetailStyles = StyleSheet.create({
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
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

/* ==========================================================
 * 4.3 Inventario
 * ========================================================== */
export const inventoryStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 10 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
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