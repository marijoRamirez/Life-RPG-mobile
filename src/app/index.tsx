import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { CheckIcon, ClothesIcon, FocusIcon, MoonIcon, PixelIcon, type PixelIconName } from "@/components/ui/PixelIcons";
import { homeStyles as styles } from "@/styles/home.styles";
import { useTamagotchiViewModel } from "@/viewmodels/useTamagotchiViewModel";

// Casa / HUD principal (M01)
export default function HUDPrincipalScreen() {
  const router = useRouter();
  const vm = useTamagotchiViewModel();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}></Text>
            </View>
            <View>
              <Text style={styles.dateText}>{vm.dateText}</Text>
              <Text style={styles.greetingText}>{vm.greeting}</Text>
            </View>
          </View>
          <View style={styles.toggleButton}>
            <MoonIcon size={16} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.levelRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelLabel}>LV</Text>
              <Text style={styles.levelNumber}>{vm.level}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.mascotaName}>{vm.petTitle}</Text>
              <Text style={styles.xpText}>{vm.xpText}</Text>
            </View>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.barIcon}>HP</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { backgroundColor: "#4CAF50", width: vm.hpWidth as `${number}%` }]} />
            </View>
            <Text style={styles.barValue}>{vm.hpText}</Text>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.barIcon}>XP</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { backgroundColor: "#FFC107", width: vm.xpPercent as `${number}%` }]} />
            </View>
            <Text style={styles.barValue}>{vm.xpPercent}</Text>
          </View>
        </View>

        <View style={styles.tamagotchiCard}>
          <View style={styles.habitatBadge}>
            <Text style={styles.habitatText}>{vm.habitat}</Text>
          </View>

          {/* RDF017: burbuja que abre el Registro rápido de ánimo (M06) mientras no haya registro del día */}
          {vm.showMoodBubble && (
            <TouchableOpacity
              style={styles.speechBubble}
              onPress={() => router.push("/area2_economia/animo/registro")}
              accessibilityRole="button"
              accessibilityLabel="Registrar cómo te sientes hoy"
            >
              <Text style={styles.speechText}>¿Cómo te sientes{"\n"}hoy? Toca para{"\n"}contarme.</Text>
            </TouchableOpacity>
          )}

          <Image source={require("@/assets/images/gato.png")} style={{ width: 128, height: 128 }} resizeMode="contain" />
        </View>

        <View style={styles.attributesContainer}>
          {vm.attributeRows.map((row) => (
            <AttributeBar key={row.key} label={row.label} icon={row.icon} value={row.value} progress={row.progress} />
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => router.push("/area1_jugabilidad/habitos/checkin")}
          >
            <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
              <CheckIcon size={16} color="#FFFFFF" /> Check-in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2A2A35" }]}
            onPress={() => router.push("/area1_jugabilidad/misiones/tablero")}
          >
            <Text style={[styles.actionButtonText, { color: "#FFF" }]}>
              <FocusIcon size={16} color="#FFFFFF" /> Misiones
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#9C27B0" }]}
            onPress={() => router.push("/area1_jugabilidad/looks-vestidor/vestidor")}
          >
            <Text style={[styles.actionButtonText, { color: "#FFF" }]}>
              <ClothesIcon size={16} color="#FFFFFF" /> Vestidor
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav activeTab="home" />
    </SafeAreaView>
  );
}

// Barra de puntos por tipo (Cultura, Físico, Enfoque)
const AttributeBar = ({
  label,
  icon,
  value,
  progress,
}: {
  label: string;
  icon: PixelIconName;
  value: string;
  progress: string;
}) => (
  <View style={styles.attributeRow}>
    <View style={styles.attributeIconBox}>
      <PixelIcon name={icon} size={24} color="#FFFFFF" />
    </View>
    <View style={styles.attributeContent}>
      <View style={styles.attributeTextRow}>
        <Text style={styles.attributeLabel}>{label}</Text>
        <Text style={styles.attributeValue}>{value}</Text>
      </View>
      <View style={styles.barBackgroundAttr}>
        <View style={[styles.barFillAttr, { width: progress as `${number}%` }]} />
      </View>
    </View>
  </View>
);
