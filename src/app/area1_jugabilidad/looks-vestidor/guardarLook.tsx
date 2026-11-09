import { Stack, useRouter } from "expo-router";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ClothesIcon, PixelIcon } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import { saveLookStyles as styles } from "@/styles/looks.styles";
import { useSaveLookViewModel } from "@/viewmodels/useSaveLookViewModel";

// Guardar look (M01)
export default function GuardarLook() {
  const router = useRouter();
  const vm = useSaveLookViewModel();

  const handleSave = async () => {
    if (await vm.save()) {
      if (router.canGoBack()) router.back();
      else router.replace("/area1_jugabilidad/looks-vestidor/vestidor");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <PixelIcon name="chevron-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Guardar Look</Text>
        </View>

        <View style={styles.lookCard}>
          <View style={styles.lookImageContainer}>
            <Image source={require("@/assets/images/gato.png")} style={styles.mascotaImage} resizeMode="contain" />
          </View>

          {/* Lo que lleva puesto en cada parte (viene del servicio) */}
          <View style={styles.lookDetails}>
            {vm.slotRows.map((row) => (
              <View key={row.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Nombre del look</Text>
          <TextInput
            style={styles.textInput}
            value={vm.lookName}
            onChangeText={vm.setLookName}
            placeholder="Introduce el nombre"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Text style={styles.inputSubtext}>
            {vm.error ?? `Hasta ${vm.nameMax} caracteres. Se guarda en el servidor.`}
          </Text>
        </View>

        <View style={styles.alertBanner}>
          <View style={styles.alertIcon}>
            <PixelIcon name="info" size={16} color="#00BCD4" />
          </View>
          <Text style={styles.alertText}>Tus amigos verán este look en tu Perfil Espejo (M07).</Text>
        </View>

        <Text style={styles.sectionTitle}>Looks Guardados</Text>
        <View style={styles.looksList}>
          {vm.savedLooks.map((item) => (
            <View key={item.id} style={styles.lookItem}>
              <View style={[styles.lookIconWrapper, { backgroundColor: "rgba(255,255,255,0.05)" }]}>
                <ClothesIcon size={20} color={item.color} />
              </View>

              <View style={styles.lookInfo}>
                <Text style={styles.lookItemName}>{item.name}</Text>
                <Text style={styles.lookItemStats} numberOfLines={1}>
                  {item.details}
                </Text>
              </View>
              {item.inUse ? (
                <View style={[styles.badge, styles.badgeInUse]}>
                  <Text style={styles.badgeInUseText}>En uso</Text>
                </View>
              ) : (
                <TouchableOpacity style={[styles.badge, styles.useButton]} onPress={() => vm.applyLook(item.id)}>
                  <Text style={styles.useButtonText}>Usar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.saveButton, !vm.canSave && { opacity: 0.45 }]}
          disabled={!vm.canSave}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{vm.saving ? "Guardando…" : "Guardar look"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
