import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../constants/theme";
import { PixelIcon } from "./PixelIcons";
export function BottomNav({ activeTab }: { activeTab: string }) {
  const router = useRouter();

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
    <View style={styles.bottomNav}>
      <NavItem name="home" label="Casa" route="/" />
      <NavItem name="check" label="Hábitos" route="/habitos/checkin" />
      <NavItem name="flag" label="Misiones" route="/misiones/tablero" />
      <NavItem name="shop" label="Tienda" route="/area2_economia/tienda/escaparate" />
      <NavItem name="trophy" label="Progreso" route="/logros/vitrina" />
    </View>
  );
}

const styles = StyleSheet.create({
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
  navLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontFamily: theme.fonts.retro,
  },
  navActive: { color: theme.colors.yellow },
});
