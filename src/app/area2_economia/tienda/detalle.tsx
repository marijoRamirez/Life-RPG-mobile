import { AddIcon, ChevronLeftIcon, MinusIcon, PixelIcon } from "@/components/ui/PixelIcons";
import {
COLORS,
ICON_OPTIONS,
POINT_META,
POINT_TYPES,
PointType,
SUGGESTED_PRICE,
} from "@/app/area2_economia/tienda/data/tienda";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
Alert,
KeyboardAvoidingView,
Platform,
SafeAreaView,
ScrollView,
Switch,
Text,
TextInput,
TouchableOpacity,
View,
} from "react-native";
import { styles } from "../../styles/detalle.styles";

const PRICE_STEP = 10;

export default function DetalleCompraScreen() {
const router = useRouter();
const [icon, setIcon] = useState(ICON_OPTIONS[0]);
const [name, setName] = useState("Noche de cine con amigos");
const [description, setDescription] = useState(
    "Película en el cine del centro, con palomitas grandes.",
);
const [pointType, setPointType] = useState<PointType>("cultura");
const [price, setPrice] = useState(300);
const [consumable, setConsumable] = useState(true);

const meta = POINT_META[pointType];
const canSave = name.trim().length > 0 && price > 0;

const handlePriceText = (text: string) => {
    const n = parseInt(text.replace(/[^0-9]/g, ""), 10);
    setPrice(Number.isNaN(n) ? 0 : n);
};

const handleSave = () => {
    // TODO: enviar { icon, name, description, pointType, price, consumable } a la API
    Alert.alert("Recompensa creada", `"${name.trim()}" ya está en tu escaparate.`, [
    { text: "Listo", onPress: () => router.back() },
    ]);
};

return (
    <SafeAreaView style={styles.container}>
    <Stack.Screen options={{ headerShown: false }} />
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        >
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeftIcon size={16} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Recompensa personalizada</Text>
        </View>

        {/* Vista previa */}
        <View style={styles.previewCard}>
            <View style={styles.previewIconBox}>
            <PixelIcon name={icon} size={32} color={COLORS.ink} />
            </View>
            <View style={styles.previewInfo}>
            <Text style={styles.previewName} numberOfLines={1}>
                {name.trim() || "Nombre de la recompensa"}
            </Text>
            <Text style={styles.previewSub}>
                {consumable ? "Consumible · se usa una vez" : "Permanente · se queda contigo"}
            </Text>
            </View>
            <View style={styles.previewPrice}>
            <PixelIcon name={meta.icon} size={16} color={COLORS.amber} />
            <Text style={styles.previewPriceText}>{price}</Text>
            </View>
        </View>

        {/* Ícono */}
        <Text style={styles.sectionLabel}>ÍCONO</Text>
        <View style={styles.iconRow}>
            {ICON_OPTIONS.map((i) => (
            <TouchableOpacity
                key={i}
                style={[styles.iconOption, icon === i && styles.iconOptionActive]}
                onPress={() => setIcon(i)}
            >
                <PixelIcon name={i} size={16} color={COLORS.text} />
            </TouchableOpacity>
            ))}
        </View>

        {/* Nombre */}
        <Text style={styles.sectionLabel}>NOMBRE</Text>
        <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej. Maratón de series"
            placeholderTextColor={COLORS.muted}
            maxLength={30}
        />

        {/* Detalles */}
        <Text style={styles.sectionLabel}>DETALLES</Text>
        <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="¿Qué incluye o cuándo puedes usarla?"
            placeholderTextColor={COLORS.muted}
            multiline
            maxLength={80}
        />

        {/* Se paga con */}
        <Text style={styles.sectionLabel}>SE PAGA CON</Text>
        <View style={styles.typeRow}>
            {POINT_TYPES.map((type) => {
            const active = pointType === type;
            return (
                <TouchableOpacity
                key={type}
                style={[styles.typeOption, active && styles.typeOptionActive]}
                onPress={() => setPointType(type)}
                >
                <PixelIcon
                    name={POINT_META[type].icon}
                    size={16}
                    color={active ? COLORS.ink : COLORS.text}
                />
                <Text style={[styles.typeText, active && styles.typeTextActive]}>
                    {POINT_META[type].label}
                </Text>
                </TouchableOpacity>
            );
            })}
        </View>

        {/* Precio */}
        <Text style={styles.sectionLabel}>PRECIO</Text>
        <View style={styles.priceControl}>
            <TouchableOpacity
            style={styles.stepButton}
            onPress={() => setPrice((p) => Math.max(0, p - PRICE_STEP))}
            >
            <MinusIcon size={16} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.priceBox}>
            <TextInput
                style={styles.priceInput}
                value={String(price)}
                onChangeText={handlePriceText}
                keyboardType="number-pad"
                maxLength={5}
            />
            </View>
            <TouchableOpacity
            style={styles.stepButton}
            onPress={() => setPrice((p) => p + PRICE_STEP)}
            >
            <AddIcon size={16} color={COLORS.text} />
            </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
            Sugerido para tu nivel (LV {SUGGESTED_PRICE.level}): {SUGGESTED_PRICE.min} a{" "}
            {SUGGESTED_PRICE.max} pts
        </Text>

        {/* Consumible */}
        <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Consumible</Text>
            <Text style={styles.switchSub}>Desaparece del inventario al canjearla</Text>
            </View>
            <Switch
            value={consumable}
            onValueChange={setConsumable}
            trackColor={{ false: COLORS.surfaceAlt, true: COLORS.green }}
            thumbColor={COLORS.ink}
            />
        </View>
        </ScrollView>

        <View style={styles.footer}>
        <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            disabled={!canSave}
            onPress={handleSave}
        >
            <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
);
}