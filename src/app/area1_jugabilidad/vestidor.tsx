import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import { styles } from "../styles/vestidor.styles";

type Category = "Cabeza" | "Cara" | "Cuerpo" | "Fondo";
const CATEGORIES: Category[] = ["Cabeza", "Cara", "Cuerpo", "Fondo"];

const INVENTORY = [
  {
    id: 1,
    name: "Boina de lector",
    stat: "Cultura",
    icon: "book-open",
    status: "Equipado",
    equipped: true,
    category: "Cabeza",
  },
  {
    id: 2,
    name: "Gorro de lana",
    stat: "Enfoque",
    icon: "focus",
    status: "Tuyo",
    equipped: false,
    category: "Cabeza",
  },
  {
    id: 3,
    name: "Banda deportiva",
    stat: "Físico",
    icon: "dumbbell",
    status: "Tuyo",
    equipped: false,
    category: "Cabeza",
  },
  {
    id: 4,
    name: "Gorra de corredor",
    stat: "Físico",
    icon: "dumbbell",
    status: "120 pts",
    equipped: false,
    category: "Cabeza",
  },
  {
    id: 5,
    name: "Capucha de monje",
    stat: "Enfoque",
    icon: "focus",
    status: "Logro",
    equipped: false,
    category: "Cabeza",
  },
  {
    id: 6,
    name: "Corona de sabio",
    stat: "Cultura",
    icon: "book-open",
    status: "LV 18",
    equipped: false,
    category: "Cabeza",
  },
  {
    id: 7,
    name: "Lentes de sol",
    stat: "Cultura",
    icon: "book-open",
    status: "Tuyo",
    equipped: false,
    category: "Cara",
  },
  {
    id: 8,
    name: "Bufanda roja",
    stat: "Físico",
    icon: "dumbbell",
    status: "Equipado",
    equipped: true,
    category: "Cuerpo",
  },
  {
    id: 9,
    name: "Bosque místico",
    stat: "Enfoque",
    icon: "focus",
    status: "Equipado",
    equipped: true,
    category: "Fondo",
  },
];

export default function VestidorScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Category>("Cara");
  const filteredItems = INVENTORY.filter((item) => item.category === activeTab);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => router.back()}
          >
            <PixelIcon
              name="chevron-left"
              size={24}
              color={theme.colors.textPrimary}
            />
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
            <Text style={styles.statText}>340</Text>
          </View>
          <View style={styles.statPill}>
            <PixelIcon name="dumbbell" size={14} color={theme.colors.green} />
            <Text style={styles.statText}>210</Text>
          </View>
          <View style={styles.statPill}>
            <PixelIcon name="focus" size={14} color={theme.colors.green} />
            <Text style={styles.statText}>480</Text>
          </View>
        </View>

        <View style={styles.lookCard}>
          <Text style={styles.lookSubtitle}>Look Actual</Text>
          <Text style={styles.lookTitle}>Lector nocturno</Text>
          <Image
            source={require("../../../assets/images/gato.png")}
            style={styles.mascotaImage}
            resizeMode="contain"
          />
        </View>

        {/* Filtros Interactivos */}
        <View style={styles.tabsContainer}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tabButton,
                activeTab === category && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(category)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === category && styles.tabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cuadrícula de Objetos Filtrada */}
        <View style={styles.gridContainer}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.itemCard,
                  item.equipped && styles.itemCardActive,
                ]}
              >
                <View style={styles.itemIconBox}>
                  <PixelIcon
                    name="chevron-up"
                    size={24}
                    color={theme.colors.textPrimary}
                  />
                </View>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>

                <View style={styles.itemStatRow}>
                  <PixelIcon
                    name={item.icon as any}
                    size={10}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.itemStatText}>{item.stat}</Text>
                </View>

                <View
                  style={[styles.badge, item.equipped && styles.badgeEquipped]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.equipped && styles.badgeTextEquipped,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <PixelIcon
                name="info"
                size={24}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyStateText}>
                No tienes objetos en esta categoría.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar look</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav activeTab="home" />
    </SafeAreaView>
  );
}
