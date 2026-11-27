import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { PixelIcon, type PixelIconName } from "./PixelIcons";

// Barra inferior con el estilo de la PWA (bottom-dock): una "isla" redondeada y la
// sección activa como botón verde que sobresale.
// Va al final de la pantalla (no flota sobre el contenido) y suma el alto de la barra
// de navegación del sistema (botones o línea de gestos) para no quedar debajo de ella.

const DOCK = {
  surface: theme.colors.surface,
  border: "#34344A",
  shadow: "#0A0A12",
  active: theme.colors.green,
  activeDeep: "#1B5E20",
  onActive: "#101629",
  muted: theme.colors.textSecondary,
  text: theme.colors.textPrimary,
};

type Item = { name: PixelIconName; label: string; route: string };

const ITEMS: Item[] = [
  { name: "home", label: "Casa", route: "/" },
  { name: "check", label: "Hábitos", route: "/area1_jugabilidad/habitos/checkin" },
  { name: "flag", label: "Misiones", route: "/area1_jugabilidad/misiones/tablero" },
  { name: "shop", label: "Tienda", route: "/area2_economia/tienda/escaparate" },
  { name: "trophy", label: "Progreso", route: "/area2_economia/logros/vitrina" },
];

const DOCK_HEIGHT = 68;
const bottomGap = (insetBottom: number) => Math.max(insetBottom, 10);

// Espacio que cada pantalla deja al final de su contenido para que lo último no quede
// detrás de la barra (que flota encima): alto de la barra + botones del sistema + aire.
export function useBottomNavSpace() {
  const insets = useSafeAreaInsets();
  return DOCK_HEIGHT + bottomGap(insets.bottom) + 20;
}

export function BottomNav({ activeTab }: { activeTab: PixelIconName }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    // Flota sobre el contenido (como en la PWA): lo de atrás se sigue viendo a los lados.
    // box-none: los toques fuera de la barra llegan al contenido.
    <View style={[styles.wrap, { paddingBottom: bottomGap(insets.bottom) }]} pointerEvents="box-none">
      <View style={styles.dock} accessibilityRole="tablist">
        {ITEMS.map(({ name, label, route }) => {
          const isActive = activeTab === name;
          return (
            <Pressable
              key={name}
              style={({ pressed }) => [styles.item, pressed && !isActive && styles.itemPressed]}
              onPress={() => {
                if (!isActive) router.push(route as never);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={label}
            >
              <View style={[styles.icon, isActive && styles.iconActive]}>
                {isActive && <View style={styles.iconShine} />}
                <PixelIcon name={name} size={24} color={isActive ? DOCK.onActive : DOCK.muted} />
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 8,
  },
  dock: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: DOCK_HEIGHT,
    paddingHorizontal: 4,
    paddingBottom: 9,
    borderWidth: 2,
    borderBottomWidth: 6, // sombra sólida de 4 px como en la PWA
    borderColor: DOCK.border,
    borderBottomColor: DOCK.shadow,
    borderRadius: 24,
    backgroundColor: DOCK.surface,
    overflow: "visible",
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
    overflow: "visible",
  },
  itemPressed: { transform: [{ translateY: -2 }] },
  icon: {
    width: 40,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  // Botón verde que sobresale de la barra (mismo efecto 3D que la PWA)
  iconActive: {
    width: 56,
    height: 56,
    marginTop: -28,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: DOCK.activeDeep,
    borderRadius: 16,
    backgroundColor: DOCK.active,
    overflow: "hidden",
  },
  iconShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  label: {
    fontSize: 11,
    color: DOCK.muted,
    fontFamily: theme.fonts.retro,
  },
  labelActive: { color: DOCK.text, fontWeight: "700" },
});
