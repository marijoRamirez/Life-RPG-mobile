import { Stack, useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { PetAvatar } from "@/components/ui/PetAvatar";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { POINT_META, POINT_TYPES } from "@/constants/pointTypes";
import { theme } from "@/constants/theme";
import { wardrobeStyles as styles } from "@/styles/looks.styles";
import { useWardrobeViewModel } from "@/viewmodels/useWardrobeViewModel";

// Nombre del look, legible sobre cualquier fondo
const lookLabel = {
  alignItems: "center" as const,
  alignSelf: "center" as const,
  marginBottom: 8,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
  backgroundColor: "rgba(18,18,26,0.7)",
};

// Miniaturas de la cuadrícula
const accessoryThumb = { width: 44, height: 32 };
const backgroundThumb = { width: 56, height: 36, borderRadius: 6 };

// Vestidor (M01)
export default function VestidorScreen() {
  const router = useRouter();
  const vm = useWardrobeViewModel();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
            <PixelIcon name="chevron-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vestidor</Text>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.push("/area2_economia/tienda/escaparate")}
          >
            <PixelIcon name="shop" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <PixelIcon name="book-open" size={14} color={theme.colors.green} />
            <Text style={styles.statText}>{vm.stats?.cultura ?? "–"}</Text>
          </View>
          <View style={styles.statPill}>
            <PixelIcon name="dumbbell" size={14} color={theme.colors.green} />
            <Text style={styles.statText}>{vm.stats?.fisico ?? "–"}</Text>
          </View>
          <View style={styles.statPill}>
            <PixelIcon name="focus" size={14} color={theme.colors.green} />
            <Text style={styles.statText}>{vm.stats?.enfoque ?? "–"}</Text>
          </View>
        </View>

        {/* La mascota con su look (o la vista previa) sobre el fondo equipado */}
        <View style={[styles.lookCard, { overflow: "hidden" }]}>
          {vm.previewBackground && (
            <Image source={vm.previewBackground.source} style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]} resizeMode="cover" accessibilityIgnoresInvertColors />
          )}
          <View style={lookLabel}>
            <Text style={styles.lookSubtitle}>{vm.selected ? "Vista previa" : "Look Actual"}</Text>
            <Text style={[styles.lookTitle, { marginBottom: 0 }]}>{vm.selected ? vm.selected.name : vm.lookName}</Text>
          </View>
          <PetAvatar species={vm.petSpecies} equipped={vm.previewEquipped} size={160} showMood={false} />
        </View>

        {/* RDF020 a RDF022: vista previa con equipar / quitar */}
        {vm.selected && (
          <View style={{ gap: 8, marginBottom: 16 }}>
            {vm.lockedText ? (
              <Text style={[styles.emptyStateText, { textAlign: "center" }]}>{vm.lockedText}</Text>
            ) : (
              <TouchableOpacity
                style={[styles.saveButton, { marginTop: 0 }, vm.saving && { opacity: 0.5 }]}
                onPress={vm.applySelected}
                disabled={vm.saving}
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>{vm.actionLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={vm.cancelPreview} accessibilityRole="button" style={{ alignSelf: "center", padding: 6 }}>
              <Text style={{ color: theme.colors.textSecondary }}>Cancelar vista previa</Text>
            </TouchableOpacity>
          </View>
        )}
        {vm.notice && !vm.selected && (
          <Text style={{ color: theme.colors.green, textAlign: "center", marginBottom: 12 }}>{vm.notice}</Text>
        )}

        {/* Filtros interactivos */}
        <View style={styles.tabsContainer}>
          {vm.categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.tabButton, vm.activeTab === category && styles.tabButtonActive]}
              onPress={() => vm.setActiveTab(category)}
            >
              <Text style={[styles.tabText, vm.activeTab === category && styles.tabTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* RDF019: filtro por estadística */}
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 12 }}>
          {(["todas", ...POINT_TYPES] as const).map((f) => {
            const active = vm.statFilter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => vm.setStatFilter(f)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                style={{
                  flex: 1,
                  height: 32,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? theme.colors.green : theme.colors.surfaceAlt,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "bold", color: active ? theme.colors.background : theme.colors.textPrimary }}>
                  {f === "todas" ? "Todas" : POINT_META[f].label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Cuadrícula de objetos filtrada */}
        <View style={styles.gridContainer}>
          {vm.filteredItems.length > 0 ? (
            vm.filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  item.equipped && styles.itemCardActive,
                  vm.selected?.id === item.id && { borderColor: theme.colors.yellow, borderWidth: 2 },
                ]}
                onPress={() => vm.select(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item.name}, ${item.status}`}
              >
                <View style={styles.itemIconBox}>
                  {vm.itemImage(item) ? (
                    <Image
                      source={vm.itemImage(item)!.source}
                      style={item.category === "Fondo" ? backgroundThumb : accessoryThumb}
                      resizeMode={item.category === "Fondo" ? "cover" : "contain"}
                      accessibilityIgnoresInvertColors
                    />
                  ) : (
                    <PixelIcon name="chevron-up" size={24} color={theme.colors.textPrimary} />
                  )}
                </View>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.itemStatRow}>
                  <PixelIcon name={item.icon} size={10} color={theme.colors.textSecondary} />
                  <Text style={styles.itemStatText}>{POINT_META[item.stat].label}</Text>
                </View>

                <View style={[styles.badge, item.equipped && styles.badgeEquipped]}>
                  <Text style={[styles.badgeText, item.equipped && styles.badgeTextEquipped]}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            !vm.loading && (
              <View style={styles.emptyState}>
                <PixelIcon name="info" size={24} color={theme.colors.textSecondary} />
                <Text style={styles.emptyStateText}>
                  {vm.error ?? "No tienes objetos en esta categoría."}
                </Text>
              </View>
            )
          )}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.push("/area1_jugabilidad/looks-vestidor/guardarLook")}
        >
          <Text style={styles.saveButtonText}>Guardar look</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav activeTab="home" />
    </SafeAreaView>
  );
}
