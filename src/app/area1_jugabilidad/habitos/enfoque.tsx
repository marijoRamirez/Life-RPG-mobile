import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GiveUpDialog } from "@/components/misiones/GiveUpDialog";
import { SegmentedProgress } from "@/components/misiones/SegmentedProgress";
import { PetAvatar } from "@/components/ui/PetAvatar";
import { theme } from "@/constants/theme";
import { TYPE_COLOR } from "@/styles/habits.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useHabitFocusViewModel } from "@/viewmodels/useHabitFocusViewModel";
import { useSession } from "@/viewmodels/SessionProvider";

// Modo concentración de un hábito con tiempo de enfoque (M02 · RDF028)
export default function HabitFocusScreen() {
  const router = useRouter();
  const session = useSession();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vm = useHabitFocusViewModel(id);
  const color = vm.habit ? TYPE_COLOR[vm.habit.pointType] : theme.colors.green;
  const back = () => router.replace("/area1_jugabilidad/habitos/checkin");

  return (
    <SafeAreaView style={ui.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: vm.status !== "activa" }} />
      <View style={[ui.content, { flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }]}>
        {vm.status === "cargando" && <ActivityIndicator color={theme.colors.green} />}

        {vm.status === "error" && (
          <>
            <Text style={ui.error}>{vm.error}</Text>
            <TouchableOpacity style={[ui.secondaryButton, { alignSelf: "stretch" }]} onPress={back} accessibilityRole="button">
              <Text style={ui.secondaryButtonText}>Volver a mis hábitos</Text>
            </TouchableOpacity>
          </>
        )}

        {vm.habit && vm.status !== "error" && (
          <>
            <Text style={[ui.label, { color }]}>Modo concentración · hábito</Text>
            <Text style={[ui.title, { textAlign: "center" }]}>{vm.habit.name}</Text>

            {vm.status === "activa" && (
              <>
                <Text style={{ fontFamily: theme.fonts.retro, fontSize: 64, color: theme.colors.textPrimary }}>{vm.remainingLabel}</Text>
                <Text style={ui.subtitle}>de {vm.totalLabel} · no salgas de la app</Text>
                <SegmentedProgress progress={vm.progress} color={color} />
              </>
            )}

            <PetAvatar species={session.account?.pet} hp={vm.status === "fallida" ? 35 : 100} size={120} showMood={false} />

            {vm.status === "activa" && (
              <TouchableOpacity style={[ui.secondaryButton, { alignSelf: "stretch" }]} onPress={vm.openGiveUp} accessibilityRole="button">
                <Text style={ui.secondaryButtonText}>Rendirse</Text>
              </TouchableOpacity>
            )}

            {vm.status === "terminada" && (
              <>
                <Text style={[ui.title, { color: theme.colors.green }]}>¡Hábito cumplido!</Text>
                <Text style={{ fontSize: 16, color: theme.colors.yellow, fontWeight: "bold" }}>{vm.rewardText}</Text>
                <TouchableOpacity style={[ui.primaryButton, { alignSelf: "stretch" }]} onPress={back} accessibilityRole="button">
                  <Text style={ui.primaryButtonText}>Volver a mis hábitos</Text>
                </TouchableOpacity>
              </>
            )}

            {vm.status === "fallida" && (
              <>
                <Text style={[ui.text, { textAlign: "center", color: UI_COLORS.softText }]}>{vm.failText}</Text>
                <TouchableOpacity style={[ui.secondaryButton, { alignSelf: "stretch" }]} onPress={back} accessibilityRole="button">
                  <Text style={ui.secondaryButtonText}>Volver a mis hábitos</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>

      <GiveUpDialog
        visible={vm.giveUpOpen}
        elapsedLabel={vm.elapsedLabel}
        totalLabel={vm.totalLabel}
        onStay={vm.closeGiveUp}
        onGiveUp={vm.giveUp}
      />
    </SafeAreaView>
  );
}
