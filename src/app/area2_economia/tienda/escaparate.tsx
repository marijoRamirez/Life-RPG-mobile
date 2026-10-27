import { BottomNav } from "@/components/ui/BottomNav";
import { AddIcon, PixelIcon } from "@/components/ui/PixelIcons";
import { TiendaTabs } from "@/components/tienda/TiendaTabs";
import {
CATEGORIES,
Category,
POINT_META,
POINT_TYPES,
SHOP_ITEMS_MOCK,
ShopItem,
WALLET_MOCK,
} from "@/app/area2_economia/tienda/data/tienda";
import { useRouter } from "expo-router";
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
const [category, setCategory] = useState<Category | "todo">("todo");
const [wallet, setWallet] = useState(WALLET_MOCK);

const items = useMemo(
    () =>
    category === "todo"
        ? SHOP_ITEMS_MOCK
        : SHOP_ITEMS_MOCK.filter((i) => i.category === category),
    [category],
);

const handleBuy = (item: ShopItem) => {
    const meta = POINT_META[item.pointType];
    Alert.alert(
    "Confirmar compra",
    `¿Comprar "${item.name}" por ${item.price} Puntos de ${meta.label}?`,
    [
        { text: "Cancelar", style: "cancel" },
        {
        text: "Comprar",
        onPress: () =>
            setWallet((w) => ({
            ...w,
            [item.pointType]: w[item.pointType] - item.price,
            })),
        },
    ],
    );
};

return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
        <Text style={styles.title}>Tienda de Susi</Text>
        <Text style={styles.subtitle}>Gasta tus puntos en recompensas</Text>
        </View>

        <TiendaTabs active="escaparate" />

        {/* Puntos disponibles */}
        <View style={styles.walletRow}>
        {POINT_TYPES.map((type) => {
            const meta = POINT_META[type];
            return (
            <View key={type} style={[styles.walletChip, { borderColor: meta.color }]}>
                <PixelIcon name={meta.icon} size={16} color={meta.color} />
                <Text style={styles.walletValue}>{wallet[type]}</Text>
                <Text style={styles.walletLabel}>{meta.label}</Text>
            </View>
            );
        })}
        </View>

        {/* Categorías */}
        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        >
        {CATEGORIES.map((c) => {
            const active = category === c.key;
            return (
            <TouchableOpacity
                key={c.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setCategory(c.key)}
            >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {c.label}
                </Text>
            </TouchableOpacity>
            );
        })}
        </ScrollView>

        {/* Artículos */}
        <View style={styles.grid}>
        {items.length === 0 && (
            <Text style={styles.emptyText}>No hay artículos en esta categoría.</Text>
        )}
        {items.map((item) => {
            const meta = POINT_META[item.pointType];
            const missing = item.price - wallet[item.pointType];
            const canBuy = missing <= 0;
            return (
            <View key={item.id} style={styles.card}>
                <View style={styles.emojiBox}>
                <PixelIcon name={item.icon} size={48} color={meta.color} />
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
                </Text>
                <Text style={styles.itemDesc} numberOfLines={2}>
                {item.description}
                </Text>
                <View style={styles.priceRow}>
                <PixelIcon name={meta.icon} size={16} color={meta.color} />
                <Text style={[styles.priceText, { color: meta.color }]}>
                    {item.price}
                </Text>
                </View>
                <TouchableOpacity
                style={[styles.buyButton, !canBuy && styles.buyButtonDisabled]}
                disabled={!canBuy}
                onPress={() => handleBuy(item)}
                >
                <Text style={[styles.buyText, !canBuy && styles.buyTextDisabled]}>
                    {canBuy ? "Comprar" : `Faltan ${missing}`}
                </Text>
                </TouchableOpacity>
            </View>
            );
        })}
        </View>

        <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/area2_economia/tienda/detalle")}
        >
        <AddIcon size={16} color="#FFFFFF" />
        <Text style={styles.createText}>Crear recompensa</Text>
        </TouchableOpacity>
    </ScrollView>
    <BottomNav activeTab={"tienda" as any} />
    </SafeAreaView>
);
}