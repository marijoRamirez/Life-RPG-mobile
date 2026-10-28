import { BottomNav } from "@/components/ui/BottomNav";
import { ClothesIcon, PixelIcon } from "@/components/ui/PixelIcons";
import {
CLOTHING_MOCK,
COLORS,
CONSUMABLES_MOCK,
Consumable,
OWNED_REWARDS_MOCK,
OwnedReward,
} from "@/app/area2_economia/tienda/data/tienda";
import { Stack } from "expo-router";
import { useState } from "react";
import {
Alert,
SafeAreaView,
ScrollView,
Text,
TouchableOpacity,
View,
} from "react-native";
import { inventoryStyles as styles } from "../../styles/shop.styles";

export default function InventarioScreen() {
const [rewards, setRewards] = useState(OWNED_REWARDS_MOCK);
const [consumables, setConsumables] = useState(CONSUMABLES_MOCK);
const [clothing, setClothing] = useState(CLOTHING_MOCK);

const totalObjects =
    rewards.length +
    consumables.reduce((sum, c) => sum + c.quantity, 0) +
    clothing.length;

const handleRedeem = (reward: OwnedReward) => {
    Alert.alert("Canjear recompensa", `¿Canjear "${reward.name}" ahora?`, [
    { text: "Cancelar", style: "cancel" },
    {
        text: "Canjear",
        onPress: () => setRewards((prev) => prev.filter((r) => r.id !== reward.id)),
    },
    ]);
};

const handleUse = (item: Consumable) => {
    Alert.alert("Usar consumible", `¿Usar "${item.name}"?`, [
    { text: "Cancelar", style: "cancel" },
    {
        text: "Usar",
        onPress: () =>
        setConsumables((prev) =>
            prev
            .map((c) => (c.id === item.id ? { ...c, quantity: c.quantity - 1 } : c))
            .filter((c) => c.quantity > 0),
        ),
    },
    ]);
};

const toggleClothing = (id: string) =>
    setClothing((prev) => prev.map((c) => (c.id === id ? { ...c, equipped: !c.equipped } : c)));

return (
    <SafeAreaView style={styles.container}>
    <Stack.Screen options={{ headerShown: false }} />
    <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.title}>Inventario</Text>
        <Text style={styles.count}>{totalObjects} objetos</Text>
        </View>

        {/* Recompensas activas */}
        <Text style={styles.sectionLabel}>RECOMPENSAS ACTIVAS</Text>
        {rewards.length === 0 && (
        <Text style={styles.emptyText}>No tienes recompensas pendientes.</Text>
        )}
        {rewards.map((r) => (
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
        {consumables.length === 0 ? (
        <Text style={styles.emptyText}>No tienes consumibles.</Text>
        ) : (
        <View style={styles.consumableRow}>
            {consumables.map((c) => (
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
        {clothing.map((c) => (
            <TouchableOpacity
            key={c.id}
            style={[styles.clothingTile, c.equipped && styles.clothingTileActive]}
            activeOpacity={0.8}
            onPress={() => toggleClothing(c.id)}
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
        onPress={() => {
            // TODO: navegar al vestidor cuando exista la pantalla
        }}
        >
        <ClothesIcon size={16} color={COLORS.text} />
        <Text style={styles.wardrobeText}>Abrir vestidor</Text>
        </TouchableOpacity>
    </View>

    <BottomNav activeTab="shop" />
    </SafeAreaView>
);
}