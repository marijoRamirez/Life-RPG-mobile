import { PixelIcon } from "@/components/ui/PixelIcons";
import {
ICON_OPTIONS,
POINT_META,
POINT_TYPES,
PointType,
} from "@/app/area2_economia/tienda/data/tienda";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
Alert,
KeyboardAvoidingView,
Platform,
SafeAreaView,
ScrollView,
Text,
TextInput,
TouchableOpacity,
View,
} from "react-native";
import { styles } from "../../styles/detalle.styles";

const PRICE_STEP = 10;

export default function DetalleCompraScreen() {
const router = useRouter();
const [name, setName] = useState("");
const [description, setDescription] = useState("");
const [pointType, setPointType] = useState<PointType>("cultura");
const [price, setPrice] = useState(100);
const [emoji, setEmoji] = useState(ICON_OPTIONS[0]);

const meta = POINT_META[pointType];
const canSave = name.trim().length > 0 && price > 0;

const handlePriceText = (text: string) => {
    const n = parseInt(text.replace(/[^0-9]/g, ""), 10);
    setPrice(Number.isNaN(n) ? 0 : n);
};

const handleSave = () => {
    // TODO: enviar { name, description, pointType, price, emoji } a la API
    Alert.alert("Recompensa creada", `"${name.trim()}" ya está en tu escaparate.`, [
    { text: "Listo", onPress: () => router.back() },
    ]);
};

return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>{"<"}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Nueva recompensa</Text>
        </View>

        {/* Vista previa en vivo */}
        <View style={[styles.previewCard, { borderColor: meta.color }]}>
            <View style={styles.previewEmojiBox}>
            <Text style={styles.previewEmoji}>{emoji}</Text>
            </View>
            <View style={styles.previewInfo}>
            <Text style={styles.previewName} numberOfLines={1}>
                {name.trim() || "Nombre de la recompensa"}
            </Text>
            <Text style={styles.previewDesc} numberOfLines={2}>
                {description.trim() || "Agrega una descripción para recordar qué ganas."}
            </Text>
            <View style={styles.previewPriceRow}>
                <PixelIcon name={meta.icon as any} size={18} color={meta.color} />
                <Text style={[styles.previewPrice, { color: meta.color }]}>{price}</Text>
            </View>
            </View>
        </View>

        {/* Nombre */}
        <View style={styles.section}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej. Maratón de series"
            placeholderTextColor="#6B6B7D"
            maxLength={30}
            />
        </View>

        {/* Descripción */}
        <View style={styles.section}>
            <Text style={styles.label}>Detalles</Text>
            <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="¿Qué incluye o cuándo puedes usarla?"
            placeholderTextColor="#6B6B7D"
            multiline
            maxLength={80}
            />
        </View>

        {/* Tipo de puntos */}
        <View style={styles.section}>
            <Text style={styles.label}>Se paga con</Text>
            <View style={styles.typeRow}>
            {POINT_TYPES.map((type) => {
                const m = POINT_META[type];
                const active = pointType === type;
                return (
                <TouchableOpacity
                    key={type}
                    style={[
                    styles.typeOption,
                    active && { borderColor: m.color, backgroundColor: "#2A2A35" },
                    ]}
                    onPress={() => setPointType(type)}
                >
                    <PixelIcon
                    name={m.icon as any}
                    size={22}
                    color={active ? m.color : "#9A9AAE"}
                    />
                    <Text style={[styles.typeText, active && { color: m.color }]}>
                    {m.label}
                    </Text>
                </TouchableOpacity>
                );
            })}
            </View>
        </View>

        {/* Precio */}
        <View style={styles.section}>
            <Text style={styles.label}>Precio</Text>
            <View style={styles.priceControl}>
            <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setPrice((p) => Math.max(0, p - PRICE_STEP))}
            >
                <Text style={styles.stepText}>-</Text>
            </TouchableOpacity>
            <TextInput
                style={[styles.input, styles.priceInput]}
                value={String(price)}
                onChangeText={handlePriceText}
                keyboardType="number-pad"
                maxLength={5}
            />
            <TouchableOpacity
                style={styles.stepButton}
                onPress={() => setPrice((p) => p + PRICE_STEP)}
            >
                <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
            </View>
            <Text style={styles.hint}>Puntos de {meta.label}</Text>
        </View>

        {/* Ícono */}
        <View style={styles.section}>
            <Text style={styles.label}>Ícono</Text>
            <View style={styles.emojiRow}>
            {ICON_OPTIONS.map((e) => (
                <TouchableOpacity
                key={e}
                style={[styles.emojiOption, emoji === e && styles.emojiOptionActive]}
                onPress={() => setEmoji(e)}
                >
                <Text style={styles.emojiOptionText}>{e}</Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>

        <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            disabled={!canSave}
            onPress={handleSave}
        >
            <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
            Guardar recompensa
            </Text>
        </TouchableOpacity>
        </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
);
}