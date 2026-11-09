import { Stack, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { ClothesIcon, PixelIcon } from "@/components/ui/PixelIcons";
import { SHOP_COLORS as COLORS } from "@/constants/shopTypes";
import type { Consumable, OwnedReward } from "@/models/Item";
import { inventoryStyles as styles } from "@/styles/shop.styles";
import { useInventoryViewModel } from "@/viewmodels/useInventoryViewModel";

// 4.3 Inventario
export default function InventarioScreen() {
  const router = useRouter();
  const vm = useInventoryViewModel();

  const handleRedeem = (reward: OwnedReward) => {
    Alert.alert("Canjear recompensa", `¿Canjear "${reward.name}" ahora?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Canjear", onPress: () => vm.redeem(reward) },
    ]);
  };

  const handleUse = (item: Consumable) => {
    Alert.alert("Usar consumible", `¿Usar "${item.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Usar", onPress: () => vm.consume(item) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Inventario</Text>
          <Text style={styles.count}>{vm.totalObjects} objetos</Text>
        </View>

        {vm.error && <Text style={styles.emptyText}>{vm.error}</Text>}

        {/* Recompensas activas */}
        <Text style={styles.sectionLabel}>RECOMPENSAS ACTIVAS</Text>
        {!vm.loading && vm.rewards.length === 0 && (
          <Text style={styles.emptyText}>No tienes recompensas pendientes.</Text>
        )}
        {vm.rewards.map((r) => (
          <View key={r.id} style={styles.rewardCard}>
            <View style={styles.rewardIconBox}>
              <PixelIcon name={r.icon} size={16} color={COLORS.text} />
            </View>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardName}>{r.name}</Text>
              <Text style={styles.rewardSub}>{r.subtitle}</Text>
            </View>
            <TouchableOpacity style={styles.redeemButton} onPress={() => handleRedeem(r)}>
              <Text style={styles.redeemText}>Canjear</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Consumibles */}
        <Text style={styles.sectionLabel}>CONSUMIBLES</Text>
        {!vm.loading && vm.consumables.length === 0 ? (
          <Text style={styles.emptyText}>No tienes consumibles.</Text>
        ) : (
          <View style={styles.consumableRow}>
            {vm.consumables.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.consumableCard}
                activeOpacity={0.8}
                onPress={() => handleUse(c)}
              >
                <Text style={styles.qty}>x{c.quantity}</Text>
                <PixelIcon name={c.icon} size={32} color={COLORS.text} />
                <Text style={styles.consumableName}>{c.name}</Text>
                <Text style={styles.consumableUse}>Usar</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ropa */}
        <Text style={styles.sectionLabel}>ROPA DEL TAMAGOTCHI</Text>
        <View style={styles.clothingRow}>
          {vm.clothing.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.clothingTile, c.equipped && styles.clothingTileActive]}
              activeOpacity={0.8}
              onPress={() => vm.toggle(c.id)}
            >
              <PixelIcon name={c.icon} size={32} color={COLORS.text} />
              <Text style={styles.clothingName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.wardrobeButton}
          onPress={() => router.push("/area1_jugabilidad/looks-vestidor/vestidor")}
        >
          <ClothesIcon size={16} color={COLORS.text} />
          <Text style={styles.wardrobeText}>Abrir vestidor</Text>
        </TouchableOpacity>
      </View>

      <BottomNav activeTab="shop" />
    </SafeAreaView>
  );
}
