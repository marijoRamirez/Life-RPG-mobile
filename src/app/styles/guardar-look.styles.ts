import { theme } from "@/constants/theme";
import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Cabecera
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerIcon: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontFamily: theme.fonts.retro,
  },

  // Tarjeta de Look Actual
  lookCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  lookImageContainer: {
    width: 100,
    height: 100,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  mascotaImage: {
    width: 80,
    height: 80,
  },
  lookDetails: {
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: theme.fonts.retro,
    textTransform: "uppercase",
  },
  detailValue: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: "bold",
  },

  // Campo de Entrada (Nombre del Look)
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: theme.fonts.retro,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  inputSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 8,
  },

  // Banner Alerta (Perfil Espejo)
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    flex: 1,
    fontWeight: "bold",
  },

  // Sección Looks Guardados
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: theme.fonts.retro,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  looksList: {
    gap: 12,
  },
  lookItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    paddingVertical: 12,
  },
  lookIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  lookInfo: {
    flex: 1,
  },
  lookItemName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  lookItemStats: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  // Badges y botones de usar
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeInUse: {
    backgroundColor: "rgba(76, 175, 80, 0.15)", // Tono verde traslúcido
    borderWidth: 1,
    borderColor: theme.colors.green,
  },
  badgeInUseText: {
    color: theme.colors.green,
    fontSize: 11,
    fontWeight: "bold",
  },
  useButton: {
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.surfaceAlt,
  },
  useButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "bold",
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
