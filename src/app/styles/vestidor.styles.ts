import { theme } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // Cabecera
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcon: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontFamily: theme.fonts.retro,
  },

  // Fila de Estadísticas
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 0.31,
    justifyContent: "center",
  },
  statText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    marginLeft: 8,
    fontFamily: theme.fonts.retro,
    fontWeight: "bold",
  },

  // Tarjeta de Look Actual
  lookCard: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  lookSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  lookTitle: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  mascotaImage: {
    width: 160,
    height: 160,
  },

  // Filtros (Pestañas)
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.surface,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
  },
  tabTextActive: {
    color: theme.colors.textPrimary,
  },

  // Cuadrícula de Inventario
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  itemCard: {
    backgroundColor: theme.colors.surface,
    width: "31%",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  itemCardActive: {
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.surfaceAlt,
  },
  itemIconBox: {
    marginBottom: 8,
  },
  itemName: {
    color: theme.colors.textPrimary,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    height: 28, // Altura fija para que los textos largos no rompan la cuadrícula
  },
  itemStatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemStatText: {
    color: theme.colors.textSecondary,
    fontSize: 9,
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceAlt,
  },
  badgeEquipped: {
    backgroundColor: theme.colors.green,
    borderColor: theme.colors.green,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
  },
  badgeTextEquipped: {
    color: theme.colors.background,
  },

  // Estado Vacío
  emptyState: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    marginTop: 8,
    fontSize: 12,
  },

  saveButton: {
    backgroundColor: theme.colors.green,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
