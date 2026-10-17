import { COLORS } from "@/app/area2_economia/tienda/data/tienda";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  active: "escaparate" | "inventario";
};

// Selector superior para moverse entre Escaparate e Inventario
export function TiendaTabs({ active }: Props) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.tab, active === "escaparate" && styles.tabActive]}
        onPress={() => active !== "escaparate" && router.replace("/area2_economia/tienda/escaparate")}
      >
        <Text style={[styles.label, active === "escaparate" && styles.labelActive]}>
          Escaparate
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, active === "inventario" && styles.tabActive]}
        onPress={() => active !== "inventario" && router.replace("/area2_economia/tienda/inventario")}
      >
        <Text style={[styles.label, active === "inventario" && styles.labelActive]}>
          Inventario
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: COLORS.purple,
  },
  label: {
    fontFamily: "RetroTech",
    fontSize: 14,
    color: COLORS.muted,
  },
  labelActive: {
    color: COLORS.text,
  },
});
