import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { theme } from "@/constants/theme";
import { ui } from "@/styles/ui.styles";
import { ChevronLeftIcon } from "./PixelIcons";

// Encabezado con botón de regresar, título y una acción opcional a la derecha.
// Si no hay a dónde regresar (p. ej. se abrió el enlace directo), va a la Casa.
export function ScreenHeader({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <View style={ui.header}>
      <View style={ui.headerLeft}>
        <TouchableOpacity
          style={ui.iconButton}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <ChevronLeftIcon size={18} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={ui.smallTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
