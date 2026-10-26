import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CheckIcon,
  ClothesIcon,
  FocusIcon,
  MoonIcon,
  PixelIcon,
} from "@/components/ui/PixelIcons";

// Importamos los estilos separados
import { BottomNav } from "@/components/ui/BottomNav";
import { styles } from "./styles/index.styles";

export default function HUDPrincipalScreen() {
  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerProfile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}></Text>
            </View>
            <View>
              <Text style={styles.dateText}>Jueves 8 de octubre</Text>
              <Text style={styles.greetingText}>Hola, Yess</Text>
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
              <Text style={styles.levelNumber}>14</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.mascotaName}>
                Susi Botitas · Guardián del Enfoque
              </Text>
              <Text style={styles.xpText}>1240 / 1800 XP para nivel 15</Text>
            </View>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.barIcon}>HP</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { backgroundColor: "#4CAF50", width: "82%" },
                ]}
              />
            </View>
            <Text style={styles.barValue}>82/100</Text>
          </View>

          <View style={styles.barRow}>
            <Text style={styles.barIcon}>XP</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { backgroundColor: "#FFC107", width: "69%" },
                ]}
              />
            </View>
            <Text style={styles.barValue}>69%</Text>
          </View>
        </View>

        <View style={styles.tamagotchiCard}>
          <View style={styles.habitatBadge}>
            <Text style={styles.habitatText}>Hábitat del bosque</Text>
          </View>

          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              ¿Cómo te sientes{"\n"}hoy? Toca para{"\n"}contarme.
            </Text>
          </View>

          <Image
            source={require("../../assets/images/gato.png")}
            style={{ width: 128, height: 128 }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.attributesContainer}>
          <AttributeBar
            label="Puntos de Cultura"
            icon="book-open"
            value="340"
            progress="70%"
          />
          <AttributeBar
            label="Puntos Físicos"
            icon="dumbbell"
            value="210"
            progress="40%"
          />
          <AttributeBar
            label="Puntos de Enfoque"
            icon="focus"
            value="480"
            progress="90%"
          />
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
          >
            <Text style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
              <CheckIcon size={16} color="#FFFFFF" /> Check-in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2A2A35" }]}
          >
            <Text style={[styles.actionButtonText, { color: "#FFF" }]}>
              <FocusIcon size={16} color="#FFFFFF" /> Enfocar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#9C27B0" }]}
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

const AttributeBar = ({
  label,
  icon,
  value,
  progress,
}: {
  label: string;
  icon: React.ComponentProps<typeof PixelIcon>["name"] | React.ReactNode;
  value: string;
  progress: string;
}) => (
  <View style={styles.attributeRow}>
    <View style={styles.attributeIconBox}>
      <PixelIcon name={icon as any} size={24} color="#FFFFFF" />
    </View>
    <View style={styles.attributeContent}>
      <View style={styles.attributeTextRow}>
        <Text style={styles.attributeLabel}>{label}</Text>
        <Text style={styles.attributeValue}>{value}</Text>
      </View>
      <View style={styles.barBackgroundAttr}>
        <View style={[styles.barFillAttr, { width: progress as any }]} />
      </View>
    </View>
  </View>
);

const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) => (
  <View style={styles.navItem}>
    <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
    <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
  </View>
);
