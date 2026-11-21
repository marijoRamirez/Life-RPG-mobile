import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChip } from "@/components/acceso/FormField";
import { AddIcon, CheckIcon, InfoIcon, MinusIcon } from "@/components/ui/PixelIcons";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { DIFFICULTIES, DIFFICULTY_META, PENALTIES, PENALTY_META, WEEKDAYS } from "@/constants/habitTypes";
import { POINT_META, POINT_TYPES } from "@/constants/pointTypes";
import { theme } from "@/constants/theme";
import { habitStyles as styles } from "@/styles/habits.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useHabitEditorViewModel } from "@/viewmodels/useHabitEditorViewModel";

// 2.2 Creador de hábitos (M02 · RF008). Con ?id= edita, pausa o reactiva.
export default function CreadorHabitoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vm = useHabitEditorViewModel(id, () => router.back());

  return (
    <SafeAreaView style={ui.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader title={vm.title} />
          {vm.loading ? (
            <ActivityIndicator color={theme.colors.green} />
          ) : (
            <>
              <View style={styles.field}>
                <Text style={ui.label}>Nombre</Text>
                <TextInput
                  style={ui.input}
                  value={vm.name}
                  onChangeText={vm.setName}
                  placeholder="Ej. Leer 20 páginas"
                  placeholderTextColor={UI_COLORS.muted}
                  accessibilityLabel="Nombre del hábito"
                />
              </View>

              <View style={styles.field}>
                <Text style={ui.label}>Tipo de punto</Text>
                <View style={ui.chipsWrap}>
                  {POINT_TYPES.map((t) => (
                    <ChoiceChip key={t} label={POINT_META[t].label} active={vm.pointType === t} onPress={() => vm.setPointType(t)} />
                  ))}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={ui.label}>Dificultad</Text>
                <View style={ui.chipsWrap}>
                  {DIFFICULTIES.map((d) => (
                    <ChoiceChip
                      key={d}
                      label={`${DIFFICULTY_META[d].label} · +${DIFFICULTY_META[d].reward}`}
                      active={vm.difficulty === d}
                      onPress={() => vm.setDifficulty(d)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.field}>
                <Text style={ui.label}>Frecuencia</Text>
                <View style={styles.daysRow}>
                  {WEEKDAYS.map((d) => {
                    const active = vm.days.includes(d.key);
                    return (
                      <TouchableOpacity
                        key={d.key}
                        style={[styles.dayButton, active && styles.dayButtonActive]}
                        onPress={() => vm.toggleDay(d.key)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: active }}
                        accessibilityLabel={d.label}
                      >
                        <Text style={[styles.dayText, active && styles.dayTextActive]}>{d.short}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={[ui.card, styles.focusCard]}>
                <View style={styles.focusHeader}>
                  <Text style={ui.label}>Tiempo de enfoque</Text>
                  <Switch
                    value={vm.focusOn}
                    onValueChange={vm.toggleFocus}
                    trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.green }}
                    thumbColor={theme.colors.textPrimary}
                    accessibilityLabel="Tiempo de enfoque"
                  />
                </View>
                {vm.focusOn && (
                  <View style={styles.stepper}>
                    <TouchableOpacity style={styles.stepButton} onPress={vm.decreaseFocus} accessibilityLabel="Menos minutos">
                      <MinusIcon size={16} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.focusValue}>{vm.focusMinutes} min</Text>
                    <TouchableOpacity style={styles.stepButton} onPress={vm.increaseFocus} accessibilityLabel="Más minutos">
                      <AddIcon size={16} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.field}>
                <Text style={ui.label}>Penalización si no se cumple</Text>
                <View style={ui.chipsWrap}>
                  {PENALTIES.map((p) => (
                    <ChoiceChip key={p} label={PENALTY_META[p].label} active={vm.penalty === p} onPress={() => vm.setPenalty(p)} />
                  ))}
                </View>
                <Text style={ui.subtitle}>Opciones fijas definidas por Life-RPG.</Text>
              </View>

              {/* RDF033: advertencia del modo concentración */}
              {vm.focusOn && (
                <View style={[ui.card, styles.warning]}>
                  <InfoIcon size={16} color={theme.colors.yellow} />
                  <Text style={styles.warningText}>
                    Al iniciar este hábito entrarás en Modo concentración {vm.focusMinutes} min. Si sales de la app o pulsas
                    «Rendirse», no ganas puntos.
                  </Text>
                </View>
              )}
              {vm.focusOn && (
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
                  onPress={vm.toggleFocusAccepted}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: vm.focusAccepted }}
                  accessibilityLabel="Entiendo y acepto el modo concentración"
                >
                  <View style={[styles.check, vm.focusAccepted && styles.checkDone]}>
                    {vm.focusAccepted && <CheckIcon size={14} color={UI_COLORS.onAccent} />}
                  </View>
                  <Text style={[ui.text, { flex: 1 }]}>Entiendo y acepto el modo concentración</Text>
                </TouchableOpacity>
              )}

              {vm.editNote && <Text style={ui.subtitle}>{vm.editNote}</Text>}
              {vm.error && <Text style={ui.error}>{vm.error}</Text>}

              <TouchableOpacity
                style={[ui.primaryButton, !vm.canSave && ui.disabled]}
                onPress={vm.save}
                disabled={!vm.canSave}
                accessibilityRole="button"
              >
                {vm.saving ? (
                  <ActivityIndicator color={UI_COLORS.onAccent} />
                ) : (
                  <Text style={ui.primaryButtonText}>{vm.editing ? "Guardar cambios" : `Crear hábito · +${vm.reward}`}</Text>
                )}
              </TouchableOpacity>

              {vm.editing && (
                <TouchableOpacity
                  style={vm.isActive ? ui.dangerButton : ui.secondaryButton}
                  onPress={vm.toggleActive}
                  disabled={vm.saving}
                  accessibilityRole="button"
                >
                  <Text style={vm.isActive ? ui.dangerButtonText : ui.secondaryButtonText}>
                    {vm.isActive ? "Pausar hábito" : "Reactivar hábito"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
