import { Stack, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { AddIcon, PixelIcon } from "@/components/ui/PixelIcons";
import { FILTERS, POINT_META, POINT_TYPES, SHOP_COLORS as COLORS } from "@/constants/shopTypes";
import type { ShopItem } from "@/models/Item";
import { showcaseStyles as styles } from "@/styles/shop.styles";
import { useShopShowcaseViewModel } from "@/viewmodels/useShopShowcaseViewModel";

// 4.1 Escaparate
export default function EscaparateScreen() {
  const router = useRouter();
  const vm = useShopShowcaseViewModel();

  // Confirmaciones de la compra (la validación la hace el ViewModel)
  const handlePress = (item: ShopItem) => {
    const meta = POINT_META[item.pointType];
    const missing = vm.missingFor(item);

    if (missing > 0) {
      Alert.alert("Puntos insuficientes", `Te faltan ${missing} pts de ${meta.label} para "${item.name}".`);
      return;
    }

    Alert.alert("Confirmar compra", `¿Comprar "${item.name}" por ${item.price} pts de ${meta.label}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Comprar", onPress: () => vm.buy(item) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tienda</Text>
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => router.push("/area2_economia/tienda/inventario")}
          >
            <PixelIcon name="bag" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Puntos */}
        <View style={styles.walletRow}>
          {POINT_TYPES.map((type) => (
            <View key={type} style={styles.walletChip}>
              <PixelIcon name={POINT_META[type].icon} size={16} color={COLORS.amber} />
              <Text style={styles.walletValue}>{vm.wallet[type]}</Text>
            </View>
          ))}
        </View>

        {/* Filtros */}
        <View style={styles.segment}>
          {FILTERS.map((f) => {
            const active = vm.filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                onPress={() => vm.setFilter(f.key)}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {vm.error && <Text style={styles.emptyText}>{vm.error}</Text>}

        {/* Artículos */}
        <View style={styles.grid}>
          {!vm.loading && vm.visibleItems.length === 0 && (
            <Text style={styles.emptyText}>No hay artículos en esta categoría.</Text>
          )}
          {vm.visibleItems.map((item) => {
            const meta = POINT_META[item.pointType];
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[styles.card, vm.isLocked(item) && styles.cardLocked]}
                onPress={() => handlePress(item)}
              >
                <View style={styles.iconBox}>
                  <PixelIcon name={item.icon} size={32} color={COLORS.text} />
                  {item.isCustom && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>TUYA</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.priceRow}>
                  <PixelIcon name={meta.icon} size={16} color={COLORS.amber} />
                  <Text style={styles.priceText}>{item.price}</Text>
                  <Text style={styles.priceType}>{meta.label}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push("/area2_economia/tienda/detalle")}>
          <AddIcon size={16} color={COLORS.text} />
          <Text style={styles.createText}>Crear recompensa</Text>
        </TouchableOpacity>
      </View>

      <BottomNav activeTab="shop" />
    </SafeAreaView>
  );
}
