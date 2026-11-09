import { Stack, useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import { wardrobeStyles as styles } from "@/styles/looks.styles";
import { useWardrobeViewModel } from "@/viewmodels/useWardrobeViewModel";

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

        <View style={styles.lookCard}>
          <Text style={styles.lookSubtitle}>Look Actual</Text>
          <Text style={styles.lookTitle}>{vm.lookName}</Text>
          <Image source={require("@/assets/images/gato.png")} style={styles.mascotaImage} resizeMode="contain" />
        </View>

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

        {/* Cuadrícula de objetos filtrada */}
        <View style={styles.gridContainer}>
          {vm.filteredItems.length > 0 ? (
            vm.filteredItems.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.itemCard, item.equipped && styles.itemCardActive]}>
                <View style={styles.itemIconBox}>
                  <PixelIcon name="chevron-up" size={24} color={theme.colors.textPrimary} />
                </View>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.itemStatRow}>
                  <PixelIcon name={item.icon} size={10} color={theme.colors.textSecondary} />
                  <Text style={styles.itemStatText}>{item.stat}</Text>
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
