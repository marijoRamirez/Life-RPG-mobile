import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { PixelIcon } from "./PixelIcons";

// La barra va al final de la pantalla (no flota sobre el contenido) y suma
// el alto de la barra de navegación del sistema para no quedar debajo de ella.
export function BottomNav({ activeTab }: { activeTab: string }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const NavItem = ({
    name,
    label,
    route,
  }: {
    name: React.ComponentProps<typeof PixelIcon>["name"];
    label: string;
    route: string;
  }) => {
    const isActive = activeTab === name;

    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push(route as any)}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={label}
      >
        <PixelIcon
          name={name}
          size={24}
          color={isActive ? theme.colors.yellow : theme.colors.textSecondary}
        />
        <Text style={[styles.navLabel, isActive && styles.navActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}
      accessibilityRole="tablist"
    >
      <NavItem name="home" label="Casa" route="/" />
      <NavItem name="check" label="Hábitos" route="/habitos/checkin" />
      <NavItem name="flag" label="Misiones" route="/area1_jugabilidad/misiones/tablero" />
      <NavItem name="shop" label="Tienda" route="/area2_economia/tienda/escaparate" />
      <NavItem name="trophy" label="Progreso" route="/logros/vitrina" />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceAlt,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 56,
    minHeight: 48,
    paddingVertical: 4,
  },
  navLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.retro,
  },
  navActive: { color: theme.colors.yellow },
});
