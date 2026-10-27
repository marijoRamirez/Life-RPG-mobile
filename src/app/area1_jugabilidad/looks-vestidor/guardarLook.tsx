import { router, Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ClothesIcon, PixelIcon } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import { styles } from "../../styles/guardar-look.styles";

export default function GuardarLook() {
  const route = useRouter();

  // y aqui el nombre del look
  const [lookName, setLookName] = useState("Lector nocturno");
  //eto es la simulasao
  const savedLooks = [
    {
      id: 1,
      name: "Lector nocturno",
      details: "Boina de lector · Lentes redondos · La Casa",
      color: "#9C27B0",
      inUse: true,
    },
    {
      id: 2,
      name: "Corredor matutino",
      details: "Banda deportiva · Lentes de sol · Bosque",
      color: "#FF5722",
      inUse: false,
    },
    {
      id: 3,
      name: "Modo monje",
      details: "Gorro de lana · Sudadera · La Casa",
      color: "#03A9F4",
      inUse: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => route.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <PixelIcon
              name="chevron-left"
              size={24}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Guardar Look</Text>
        </View>

        <View style={styles.lookCard}>
          <View style={styles.lookImageContainer}>
            <Image
              source={require("../../../../assets/images/gato.png")}
              style={styles.mascotaImage}
              resizeMode="contain"
            />
          </View>

          {/* checkpoint para saber donde modificar cuando se integre el back */}
          <View style={styles.lookDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cabeza</Text>
              <Text style={styles.detailValue}>Gorrito del lectorcito</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cara</Text>
              <Text style={styles.detailValue}>Lentes redonditos</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cuerpo</Text>
              <Text style={styles.detailValue}>Sudadera</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fondo</Text>
              <Text style={styles.detailValue}>Casita</Text>
            </View>
          </View>
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Nombre del look</Text>
          <TextInput
            style={styles.textInput}
            value={lookName}
            onChangeText={(text) => {
              if (text.length <= 24) setLookName(text); //luego veo si cambio el limite de caracteres
            }}
            placeholder="Introduce el nombre"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Text style={styles.inputSubtext}>
            Hasta 24 caracteres. Se guarda en el servidor.
          </Text>
        </View>

        <View style={styles.alertBanner}>
          <View style={styles.alertIcon}>
            <PixelIcon name="info" size={16} color="#00BCD4" />
          </View>
          <Text style={styles.alertText}>
            Tus amigos verán este look en tu Perfil Espejo (M07).
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Looks Guardados</Text>
        <View style={styles.looksList}>
          {savedLooks.map((item) => (
            <View key={item.id} style={styles.lookItem}>
              <View
                style={[
                  styles.lookIconWrapper,
                  { backgroundColor: "rgba(255,255,255,0.05)" },
                ]}
              >
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
                <TouchableOpacity style={[styles.badge, styles.useButton]}>
                  <Text style={styles.useButtonText}>Usar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() =>
            router.push("/area1_jugabilidad/looks-vestidor/vestidor")
          }
        >
          <Text style={styles.saveButtonText}>
            Guardar look(solo regresa al vestidor)
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
