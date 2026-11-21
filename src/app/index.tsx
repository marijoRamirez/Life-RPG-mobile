import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { PetAvatar } from "@/components/ui/PetAvatar";
import { CheckIcon, ClothesIcon, FocusIcon, HeartIcon, PixelIcon, SettingsIcon, type PixelIconName } from "@/components/ui/PixelIcons";
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
          {/* M01: el avatar abre Mi perfil; el engrane, Ajustes */}
          <TouchableOpacity
            style={styles.headerProfile}
            onPress={() => router.push("/area1_jugabilidad/perfil/perfil")}
            accessibilityRole="button"
            accessibilityLabel="Mi perfil"
          >
            <View style={[styles.avatar, { overflow: "hidden" }]}>
              {vm.photoUrl ? (
                <Image source={{ uri: vm.photoUrl }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={styles.avatarText}>{vm.initial}</Text>
              )}
            </View>
            <View>
              <Text style={styles.dateText}>{vm.dateText}</Text>
              <Text style={styles.greetingText}>{vm.greeting}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => router.push("/area1_jugabilidad/perfil/ajustes")}
            accessibilityRole="button"
            accessibilityLabel="Ajustes"
          >
            <SettingsIcon size={16} color="#FFFFFF" />
          </TouchableOpacity>
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

        <View style={[styles.tamagotchiCard, { backgroundColor: vm.petColor, height: 230, paddingBottom: 8 }]}>
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

          {/* RDF016: mascota animada con su ropa y su estado según el HP */}
          <PetAvatar species={vm.petSpecies} hp={vm.hp} hpMax={vm.hpMax} equipped={vm.equipped} size={112} />
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
            <CheckIcon size={18} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]} numberOfLines={1}>
              Check-in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2A2A35" }]}
            onPress={() => router.push("/area1_jugabilidad/misiones/tablero")}
          >
            <FocusIcon size={18} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: "#FFF" }]} numberOfLines={1}>
              Misiones
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#9C27B0" }]}
            onPress={() => router.push("/area1_jugabilidad/looks-vestidor/vestidor")}
          >
            <ClothesIcon size={18} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: "#FFF" }]} numberOfLines={1}>
              Vestidor
            </Text>
          </TouchableOpacity>
          {/* M06: acceso fijo a Ánimo (gráfica, diario y registro); la burbuja se oculta tras registrar */}
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2A2A35" }]}
            onPress={() => router.push("/area2_economia/animo/grafica")}
            accessibilityRole="button"
            accessibilityLabel="Ánimo"
          >
            <HeartIcon size={18} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: "#FFF" }]} numberOfLines={1}>
              Ánimo
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
