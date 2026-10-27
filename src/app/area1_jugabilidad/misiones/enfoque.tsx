import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GiveUpDialog } from "@/components/misiones/GiveUpDialog";
import { SegmentedProgress } from "@/components/misiones/SegmentedProgress";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { MISSION_TYPE_META } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import type { MissionType } from "@/models/Mission";
import { focusStyles as styles, shared } from "../../styles/missions.styles";
import { useFocusSessionViewModel } from "@/viewmodels/useFocusSessionViewModel";

const HABITAT: Record<MissionType, { badge: string; speech: string }> = {
  enfoque: { badge: "Modo estudio", speech: "Shh… estoy estudiando contigo." },
  fisico: { badge: "Modo entrenamiento", speech: "¡Vamos, tú puedes!" },
  cultura: { badge: "Modo cultura", speech: "¡Esto se pone interesante!" },
};

// 3.2 Modo concentración (RF011)
export default function ModoConcentracionScreen() {
  const router = useRouter();
  const { missionId } = useLocalSearchParams<{ missionId: string }>();
  const vm = useFocusSessionViewModel(missionId);

  useEffect(() => {
    if (vm.status === "terminada" && vm.outcome) {
      router.replace({
        pathname: "/area1_jugabilidad/misiones/historial",
        params: { sessionId: vm.outcome.sessionId },
      });
    }
    if (vm.status === "fallida") {
      if (vm.failReason === "salio_app") {
        Alert.alert("Misión fallida", "Saliste de la app durante el bloqueo, así que la misión no otorgó puntos.");
      }
      router.back();
    }
  }, [vm.status, vm.outcome, vm.failReason, router]);

  const screenOptions = <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />;

  if (vm.status === "error") {
    return (
      <SafeAreaView style={styles.container}>
        {screenOptions}
        <View style={styles.center}>
          <Text style={styles.error}>{vm.error}</Text>
          <TouchableOpacity style={[shared.secondaryButton, { alignSelf: "stretch" }]} onPress={() => router.back()}>
            <Text style={shared.secondaryButtonText}>Volver al tablero</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!vm.mission) {
    return (
      <SafeAreaView style={styles.container}>
        {screenOptions}
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.yellow} />
        </View>
      </SafeAreaView>
    );
  }

  const meta = MISSION_TYPE_META[vm.mission.type];
  const habitat = HABITAT[vm.mission.type];

  return (
    <SafeAreaView style={styles.container}>
      {screenOptions}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.chip}>
          <PixelIcon name={vm.locksDevice ? "lock" : "flag"} size={16} color={theme.colors.yellow} />
          <Text style={styles.chipText}>{vm.locksDevice ? "Pantalla fijada" : "Misión en curso"}</Text>
        </View>

        <View style={styles.missionBlock}>
          <Text style={[shared.label, { color: meta.color }]}>Misión de {meta.label}</Text>
          <Text style={styles.missionTitle}>{vm.mission.title}</Text>
        </View>

        <View style={styles.timerBlock} accessibilityLabel={`Tiempo restante ${vm.remainingLabel}`}>
          <Text style={styles.timer}>{vm.remainingLabel}</Text>
          <Text style={styles.timerHint}>
            restante de {vm.totalLabel} · termina a las {vm.endsAtLabel}
          </Text>
        </View>

        <SegmentedProgress progress={vm.progress} color={meta.color} />

        <View style={[styles.habitat, { backgroundColor: meta.color }]}>
          <View style={styles.habitatBadge}>
            <Text style={styles.habitatBadgeText}>{habitat.badge}</Text>
          </View>
          <View style={styles.speech}>
            <Text style={styles.speechText}>{habitat.speech}</Text>
          </View>
          <Image
            source={require("@/assets/images/gato.png")}
            style={styles.pet}
            resizeMode="contain"
            accessibilityLabel="Tu mascota acompañándote"
          />
        </View>

        <View style={styles.rewardRow}>
          <View style={styles.rewardChip}>
            <PixelIcon name="star" size={16} color={theme.colors.yellow} />
            <Text style={[styles.rewardText, { color: theme.colors.yellow }]}>+{vm.mission.reward.xp} XP</Text>
          </View>
          <View style={styles.rewardChip}>
            <PixelIcon name={meta.icon} size={16} color={meta.color} />
            <Text style={[styles.rewardText, { color: meta.color }]}>
              +{vm.mission.reward.points} {meta.pointsLabel}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={shared.secondaryButton} onPress={vm.openGiveUp} accessibilityRole="button">
            <Text style={shared.secondaryButtonText}>Rendirse</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            {vm.locksDevice
              ? "Si te rindes o sales de la app, la misión queda como fallida y no ganas puntos."
              : "Si te rindes, la misión queda como fallida y no ganas puntos."}
          </Text>
          {__DEV__ && (
            <TouchableOpacity style={styles.devButton} onPress={vm.finishNow}>
              <Text style={styles.devText}>Terminar ya (solo desarrollo)</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <GiveUpDialog
        visible={vm.isGiveUpOpen}
        elapsedLabel={vm.elapsedLabel}
        totalLabel={vm.totalLabel}
        onStay={vm.closeGiveUp}
        onGiveUp={vm.giveUp}
      />
    </SafeAreaView>
  );
}
