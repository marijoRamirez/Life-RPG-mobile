import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PixelIcon } from "@/components/ui/PixelIcons";
import { ENERGY_MAX, MOOD_COLORS, MOOD_FACTORS, MOOD_LEVELS, MOOD_META, MOOD_XP_REWARD } from "@/constants/moodTypes";
import { theme } from "@/constants/theme";
import { useMoodRegisterViewModel } from "@/viewmodels/useMoodRegisterViewModel";
import { moodShared as shared, registerStyles as styles } from "@/styles/mood.styles";

const ENERGY_STEPS = Array.from({ length: ENERGY_MAX }, (_, i) => i + 1);

// 6.1 Registro rápido (RF019)
export default function RegistroAnimoScreen() {
  const router = useRouter();
  const vm = useMoodRegisterViewModel();
  const saved = vm.xpAwarded !== null;

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const onSubmit = async () => {
    if (saved) {
      router.push("/area2_economia/animo/grafica");
      return;
    }
    await vm.submit();
  };

  const buttonText = saved
    ? "Ver mi gráfica"
    : vm.alreadyRegistered
      ? "Actualizar registro"
      : `Registrar · +${MOOD_XP_REWARD} XP`;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.reminderText}>
            {vm.reminder?.enabled ? `Recordatorio diario · ${vm.reminder.time}` : "Recordatorio desactivado"}
          </Text>
          <TouchableOpacity style={shared.iconButton} onPress={close} accessibilityRole="button" accessibilityLabel="Cerrar">
            <PixelIcon name="close" size={16} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingRow}>
          <Image source={require("@/assets/images/dragon.png")} style={styles.mascot} resizeMode="contain" />
          <View style={[shared.card, styles.bubble]}>
            <Text style={styles.bubbleText}>¡Hola! ¿Cómo te sientes hoy?</Text>
          </View>
        </View>

        {vm.loading ? (
          <ActivityIndicator color={theme.colors.green} />
        ) : (
          <>
            {/* Ánimo de 1 a 5 (RDF068) */}
            <View style={styles.moodRow} accessibilityRole="radiogroup">
              {MOOD_LEVELS.map((level) => {
                const active = vm.mood === level;
                return (
                  <TouchableOpacity
                    key={level}
                    style={[styles.moodButton, active && styles.moodButtonActive]}
                    onPress={() => vm.setMood(level)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={MOOD_META[level].label}
                  >
                    <Text style={styles.moodEmoji}>{MOOD_META[level].emoji}</Text>
                    <Text style={[styles.moodLabel, active && styles.moodLabelActive]}>{MOOD_META[level].label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Energía de 0 a 10: tocar un segmento la fija; tocar el primero encendido la baja a 0 */}
            <View style={[shared.card, styles.energyCard]}>
              <View style={styles.energyHeader}>
                <Text style={shared.label}>Energía</Text>
                <Text style={styles.energyValue}>
                  {vm.energy} / {ENERGY_MAX}
                </Text>
              </View>
              <View style={styles.energyBar}>
                {ENERGY_STEPS.map((step) => (
                  <TouchableOpacity
                    key={step}
                    style={[styles.energySegment, step <= vm.energy && styles.energySegmentOn]}
                    onPress={() => vm.setEnergy(step === 1 && vm.energy === 1 ? 0 : step)}
                    accessibilityRole="button"
                    accessibilityLabel={`Energía ${step}`}
                  />
                ))}
              </View>
              <View style={styles.energyEnds}>
                <Text style={styles.energyEndText}>Agotada</Text>
                <Text style={styles.energyEndText}>Con pila</Text>
              </View>
            </View>

            {/* Factores opcionales (RDF069) */}
            <Text style={shared.label}>¿Qué influyó?</Text>
            <View style={styles.factorsWrap}>
              {MOOD_FACTORS.map((f) => {
                const active = vm.factors.includes(f.key);
                return (
                  <TouchableOpacity
                    key={f.key}
                    style={[shared.chip, active && shared.chipActive]}
                    onPress={() => vm.toggleFactor(f.key)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active }}
                  >
                    <Text style={[shared.chipText, active && shared.chipTextActive]}>{f.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Aviso de privacidad (RDF071) */}
            {vm.privacy && (
              <View style={[shared.card, styles.privacyNote]}>
                <PixelIcon name={vm.privacy.visibleToViewers ? "user" : "lock"} size={16} color={MOOD_COLORS.muted} />
                <Text style={styles.privacyText}>
                  {vm.privacy.visibleToViewers
                    ? `Tus ${vm.privacy.viewersCount} visualizadores verán este registro. Puedes cambiarlo en Ajustes › Privacidad.`
                    : "Este registro es privado. Puedes cambiarlo en Ajustes › Privacidad."}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {vm.error && <Text style={shared.error}>{vm.error}</Text>}
        {saved && (
          <Text style={shared.notice}>
            {vm.xpAwarded ? `¡Registrado! +${vm.xpAwarded} XP` : "Registro de hoy actualizado."}
          </Text>
        )}
        <TouchableOpacity
          style={[shared.primaryButton, !saved && !vm.canSubmit && shared.disabled]}
          onPress={onSubmit}
          disabled={!saved && !vm.canSubmit}
          accessibilityRole="button"
        >
          {vm.saving ? (
            <ActivityIndicator color={MOOD_COLORS.onAccent} />
          ) : (
            <Text style={shared.primaryButtonText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}