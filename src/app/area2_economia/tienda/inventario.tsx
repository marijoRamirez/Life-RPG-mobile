import { BottomNav } from "@/components/ui/BottomNav";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { TiendaTabs } from "@/components/tienda/TiendaTabs";
import {
INVENTORY_MOCK,
INVENTORY_TABS,
InventoryItem,
InventoryKind,
POINT_META,
} from "@/app/area2_economia/tienda/data/tienda";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
Alert,
SafeAreaView,
ScrollView,
Text,
TouchableOpacity,
View,
} from "react-native";
import { styles } from "../../styles/inventario.styles";

const ACTION_LABEL: Record<InventoryKind, string> = {
recompensa: "Canjear",
consumible: "Usar",
ropa: "Equipar",
};

export default function InventarioScreen() {
const router = useRouter();
const [tab, setTab] = useState<InventoryKind>("recompensa");
const [items, setItems] = useState<InventoryItem[]>(INVENTORY_MOCK);

const visible = items.filter((i) => i.kind === tab);

const consume = (item: InventoryItem) => {
    // Resta 1 y elimina el objeto cuando se acaba
    setItems((prev) =>
    prev
        .map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
};

const handleAction = (item: InventoryItem) => {
    if (item.kind === "ropa") {
    setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, equipped: !i.equipped } : i)),
    );
    return;
    }
    const verb = item.kind === "recompensa" ? "canjear" : "usar";
    Alert.alert("Confirmar", `¿Quieres ${verb} "${item.name}"?`, [
    { text: "Cancelar", style: "cancel" },
    { text: "Sí", onPress: () => consume(item) },
    ]);
};

return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
        <Text style={styles.title}>Inventario</Text>
        <Text style={styles.subtitle}>Lo que ya tienes</Text>
        </View>

        <TiendaTabs active="inventario" />

        <View style={styles.filterRow}>
        {INVENTORY_TABS.map((t) => {
            const active = tab === t.key;
            return (
            <TouchableOpacity
                key={t.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setTab(t.key)}
            >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {t.label}
                </Text>
            </TouchableOpacity>
            );
        })}
        </View>

        <View style={styles.grid}>
        {visible.length === 0 && (
            <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Aquí no hay nada todavía.</Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.replace("/area2_economia/tienda/escaparate")}
            >
                <Text style={styles.emptyButtonText}>Ir al escaparate</Text>
            </TouchableOpacity>
            </View>
        )}

        {visible.map((item) => {
            const meta = item.pointType ? POINT_META[item.pointType] : null;
            const equipped = item.kind === "ropa" && item.equipped;
            return (
            <View key={item.id} style={[styles.card, equipped && styles.cardEquipped]}>
                <View style={styles.emojiBox}>
                <PixelIcon
                    name={item.icon}
                    size={48}
                    color={meta ? meta.color : "#FFFFFF"}
                />
                {item.kind !== "ropa" && (
                    <View style={styles.qtyBadge}>
                    <Text style={styles.qtyText}>x{item.quantity}</Text>
                    </View>
                )}
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
                </Text>
                <View style={styles.tagRow}>
                {meta && (
                    <>
                    <PixelIcon name={meta.icon} size={16} color={meta.color} />
                    <Text style={[styles.tagText, { color: meta.color }]}>
                        {meta.label}
                    </Text>
                    </>
                )}
                </View>
                <TouchableOpacity
                style={[styles.actionButton, equipped && styles.actionButtonEquipped]}
                onPress={() => handleAction(item)}
                >
                <Text style={styles.actionText}>
                    {equipped ? "Quitar" : ACTION_LABEL[item.kind]}
                </Text>
                </TouchableOpacity>
            </View>
            );
        })}
        </View>
    </ScrollView>
    <BottomNav activeTab={"tienda" as any} />
    </SafeAreaView>
);
}