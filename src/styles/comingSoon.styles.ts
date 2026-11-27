import { StyleSheet } from "react-native";

import { theme } from "@/constants/theme";

// Prendas y fondos que todavía no tienen dibujo (ver missingArt en constants/itemAssets.ts):
// tarjeta apagada, nombre tachado y la etiqueta "Próximamente". Se usa en la Tienda,
// el Inventario y el Vestidor.
export const comingSoonStyles = StyleSheet.create({
  card: { opacity: 0.45 },
  name: { textDecorationLine: "line-through", color: theme.colors.textSecondary },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.retro,
  },
});
