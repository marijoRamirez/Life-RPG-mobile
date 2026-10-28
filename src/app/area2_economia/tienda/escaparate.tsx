import { BottomNav } from "@/components/ui/BottomNav";
import { AddIcon, PixelIcon } from "@/components/ui/PixelIcons";
import {
COLORS,
FILTERS,
POINT_META,
POINT_TYPES,
PointType,
SHOP_ITEMS_MOCK,
ShopItem,
WALLET_MOCK,
} from "@/app/area2_economia/tienda/data/tienda";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
Alert,
SafeAreaView,
ScrollView,
Text,
TouchableOpacity,
View,
} from "react-native";
import { showcaseStyles as styles } from "../../styles/shop.styles";

export default function EscaparateScreen() {
const router = useRouter();
const [filter, setFilter] = useState<"todo" | PointType>("todo");
const [wallet, setWallet] = useState(WALLET_MOCK);

const items = useMemo(
    () =>
    filter === "todo"
        ? SHOP_ITEMS_MOCK
        : SHOP_ITEMS_MOCK.filter((i) => i.pointType === filter),
    [filter],
);

const handlePress = (item: ShopItem) => {
    const meta = POINT_META[item.pointType];
    const missing = item.price - wallet[item.pointType];

    if (missing > 0) {
    Alert.alert(
        "Puntos insuficientes",
        `Te faltan ${missing} pts de ${meta.label} para "${item.name}".`,
    );
    return;
    }

    Alert.alert(
    "Confirmar compra",
    `¿Comprar "${item.name}" por ${item.price} pts de ${meta.label}?`,
    [
        { text: "Cancelar", style: "cancel" },
        {
        text: "Comprar",
        onPress: () =>
            setWallet((w) => ({ ...w, [item.pointType]: w[item.pointType] - item.price })),
        },
    ],
    );
};

return (
    <SafeAreaView style={styles.container}>
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
            <Text style={styles.walletValue}>{wallet[type]}</Text>
            </View>
        ))}
        </View>

        {/* Filtros */}
        <View style={styles.segment}>
        {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
            <TouchableOpacity
                key={f.key}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                onPress={() => setFilter(f.key)}
            >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                {f.label}
                </Text>
            </TouchableOpacity>
            );
        })}
        </View>

        {/* Artículos */}
        <View style={styles.grid}>
        {items.length === 0 && (
            <Text style={styles.emptyText}>No hay artículos en esta categoría.</Text>
        )}
        {items.map((item) => {
            const meta = POINT_META[item.pointType];
            const locked = item.price > wallet[item.pointType];
            return (
            <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={[styles.card, locked && styles.cardLocked]}
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
        <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/area2_economia/tienda/detalle")}
        >
        <AddIcon size={16} color={COLORS.text} />
        <Text style={styles.createText}>Crear recompensa</Text>
        </TouchableOpacity>
    </View>

    <BottomNav activeTab="shop" />
    </SafeAreaView>
);
}