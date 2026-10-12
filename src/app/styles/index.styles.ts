import { StyleSheet } from "react-native";
import { theme } from "./../../constants/theme";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },

  // Cabecera
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerProfile: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  dateText: { color: theme.colors.textSecondary, fontSize: 12 },
  greetingText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontFamily: theme.fonts.retro,
  },
  toggleButton: {
    backgroundColor: theme.colors.surfaceAlt,
    padding: 8,
    borderRadius: 20,
  },
  toggleIcon: { fontSize: 16 },

  // Tarjeta de Estadísticas
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  levelRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  levelBadge: {
    backgroundColor: theme.colors.yellow,
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    marginRight: 12,
  },
  levelLabel: {
    color: theme.colors.textDark,
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: theme.fonts.retro,
  },
  levelNumber: {
    color: theme.colors.textDark,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: theme.fonts.retro,
  },
  nameContainer: { flex: 1 },
  mascotaName: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  xpText: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  barIcon: {
    color: theme.colors.textPrimary,
    width: 50,
    fontSize: 12,
    fontFamily: theme.fonts.retro,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  barFill: { height: "100%", borderRadius: 4 },
  barValue: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    width: 45,
    textAlign: "right",
    fontFamily: theme.fonts.retro,
  },

  // Área del Tamagotchi
  tamagotchiCard: {
    backgroundColor: theme.colors.green,
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  habitatBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  habitatText: {
    color: theme.colors.textPrimary,
    fontSize: 10,
    fontWeight: "bold",
  },
  speechBubble: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: theme.colors.surface,
    padding: 10,
    borderRadius: 12,
  },
  speechText: {
    color: theme.colors.textPrimary,
    fontSize: 10,
    textAlign: "center",
  },
  mascotaImage: { width: 120, height: 120, marginBottom: 20 },

  // Atributos
  attributesContainer: { marginBottom: 20 },
  attributeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  attributeIconBox: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  attributeContent: { flex: 1 },
  attributeTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  attributeLabel: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  attributeValue: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontFamily: theme.fonts.retro,
  },
  barBackgroundAttr: {
    height: 6,
    backgroundColor: theme.colors.surface,
    borderRadius: 3,
  },
  barFillAttr: {
    height: "100%",
    backgroundColor: theme.colors.green,
    borderRadius: 3,
  },

  // Botones de acción
  actionsRow: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionButtonText: { fontWeight: "bold", fontSize: 14 },

  // Navegación Inferior
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceAlt,
  },
  navItem: { alignItems: "center" },
  navIcon: { fontSize: 20, color: theme.colors.textSecondary, marginBottom: 4 },
  navLabel: { fontSize: 10, color: theme.colors.textSecondary },
  navActive: { color: theme.colors.yellow },
});
