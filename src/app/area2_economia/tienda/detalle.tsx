import { Stack, useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddIcon, ChevronLeftIcon, MinusIcon, PixelIcon } from "@/components/ui/PixelIcons";
import { ICON_OPTIONS, POINT_META, POINT_TYPES, SHOP_COLORS as COLORS } from "@/constants/shopTypes";
import { itemDetailStyles as styles } from "@/styles/shop.styles";
import { useRewardCreatorViewModel } from "@/viewmodels/useRewardCreatorViewModel";

// 4.2 Recompensa personalizada
export default function DetalleCompraScreen() {
  const router = useRouter();
  const vm = useRewardCreatorViewModel();
  const meta = POINT_META[vm.pointType];

  const handleSave = async () => {
    const savedName = await vm.save();
    if (!savedName) return;
    Alert.alert("Recompensa creada", `"${savedName}" ya está en tu escaparate.`, [
      { text: "Listo", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
              <PixelIcon name={vm.icon} size={32} color={COLORS.ink} />
            </View>
            <View style={styles.previewInfo}>
              <Text style={styles.previewName} numberOfLines={1}>
                {vm.name.trim() || "Nombre de la recompensa"}
              </Text>
              <Text style={styles.previewSub}>
                {vm.consumable ? "Consumible · se usa una vez" : "Permanente · se queda contigo"}
              </Text>
            </View>
            <View style={styles.previewPrice}>
              <PixelIcon name={meta.icon} size={16} color={COLORS.amber} />
              <Text style={styles.previewPriceText}>{vm.price}</Text>
            </View>
          </View>

          {/* Ícono */}
          <Text style={styles.sectionLabel}>ÍCONO</Text>
          <View style={styles.iconRow}>
            {ICON_OPTIONS.map((i) => (
              <TouchableOpacity
                key={i}
                style={[styles.iconOption, vm.icon === i && styles.iconOptionActive]}
                onPress={() => vm.setIcon(i)}
              >
                <PixelIcon name={i} size={16} color={COLORS.text} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Nombre */}
          <Text style={styles.sectionLabel}>NOMBRE</Text>
          <TextInput
            style={styles.input}
            value={vm.name}
            onChangeText={vm.setName}
            placeholder="Ej. Maratón de series"
            placeholderTextColor={COLORS.muted}
            maxLength={30}
          />

          {/* Detalles */}
          <Text style={styles.sectionLabel}>DETALLES</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={vm.description}
            onChangeText={vm.setDescription}
            placeholder="¿Qué incluye o cuándo puedes usarla?"
            placeholderTextColor={COLORS.muted}
            multiline
            maxLength={80}
          />

          {/* Se paga con */}
          <Text style={styles.sectionLabel}>SE PAGA CON</Text>
          <View style={styles.typeRow}>
            {POINT_TYPES.map((type) => {
              const active = vm.pointType === type;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeOption, active && styles.typeOptionActive]}
                  onPress={() => vm.setPointType(type)}
                >
                  <PixelIcon name={POINT_META[type].icon} size={16} color={active ? COLORS.ink : COLORS.text} />
                  <Text style={[styles.typeText, active && styles.typeTextActive]}>{POINT_META[type].label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Precio */}
          <Text style={styles.sectionLabel}>PRECIO</Text>
          <View style={styles.priceControl}>
            <TouchableOpacity style={styles.stepButton} onPress={vm.decreasePrice}>
              <MinusIcon size={16} color={COLORS.text} />
            </TouchableOpacity>
            <View style={styles.priceBox}>
              <TextInput
                style={styles.priceInput}
                value={String(vm.price)}
                onChangeText={vm.setPriceFromText}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <TouchableOpacity style={styles.stepButton} onPress={vm.increasePrice}>
              <AddIcon size={16} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          {vm.suggested && (
            <Text style={styles.hint}>
              Sugerido para tu nivel (LV {vm.suggested.level}): {vm.suggested.min} a {vm.suggested.max} pts
            </Text>
          )}

          {/* Consumible */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Consumible</Text>
              <Text style={styles.switchSub}>Desaparece del inventario al canjearla</Text>
            </View>
            <Switch
              value={vm.consumable}
              onValueChange={vm.setConsumable}
              trackColor={{ false: COLORS.surfaceAlt, true: COLORS.green }}
              thumbColor={COLORS.ink}
            />
          </View>

          {vm.error && <Text style={styles.hint}>{vm.error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, !vm.canSave && styles.saveButtonDisabled]}
            disabled={!vm.canSave}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
