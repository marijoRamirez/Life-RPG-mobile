import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { StyleSheet } from "react-native";

// Estilos del módulo de tienda: escaparate, inventario y detalle de recompensa.
// Los bloques base se comparten para mantener una sola fuente de verdad.

const container = { flex: 1, backgroundColor: COLORS.bg } as const;
const title = { fontFamily: "RetroTech", fontSize: 26, color: COLORS.text } as const;
const subtitle = { fontFamily: "RetroTech", fontSize: 13, color: COLORS.muted, marginTop: 2 } as const;
const grid = { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 } as const;
const card = {
  width: "48%",
  backgroundColor: COLORS.surface,
  borderWidth: 2,
  borderColor: COLORS.border,
  borderRadius: 8,
  padding: 12,
  gap: 8,
} as const;
const emojiBox = {
  height: 64,
  borderRadius: 6,
  backgroundColor: COLORS.surfaceAlt,
  alignItems: "center",
  justifyContent: "center",
} as const;
const emoji = { fontSize: 34 } as const;
const filterPillActive = { backgroundColor: COLORS.green, borderColor: COLORS.green } as const;
const filterTextActive = { color: COLORS.text } as const;

// Inventario de la mascota
export const inventoryStyles = StyleSheet.create({
  container,
  scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },

  title,
  subtitle,

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
  filterPillActive,
  filterText: { fontFamily: "RetroTech", fontSize: 12, color: COLORS.muted },
  filterTextActive,

  // Cuadrícula
  grid,
  card,
  cardEquipped: { borderColor: COLORS.green },
  emojiBox,
  emoji,
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

// Escaparate de recompensas
export const showcaseStyles = StyleSheet.create({
  container,
  scrollContent: { padding: 16, paddingBottom: 32, gap: 16 },

  // Header
  title,
  subtitle,

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
  filterPillActive,
  filterText: { fontFamily: "RetroTech", fontSize: 13, color: COLORS.muted },
  filterTextActive,

  // Cuadrícula
  grid,
  card,
  emojiBox,
  emoji,
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

// Detalle / creación de recompensa
export const itemDetailStyles = StyleSheet.create({
  container,
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
