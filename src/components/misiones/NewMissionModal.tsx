import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PixelIcon } from "@/components/ui/PixelIcons";
import {
  MISSION_COLORS,
  MISSION_DURATIONS,
  MISSION_TYPE_META,
  MISSION_TYPES,
} from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import type { MissionReward, MissionType, NewMissionInput } from "@/models/Mission";
import { shared } from "@/app/styles/missions.styles";

type Props = {
  visible: boolean;
  draft: NewMissionInput;
  reward: MissionReward;
  error: string | null;
  saving: boolean;
  onChange: (changes: Partial<NewMissionInput>) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const NOTICE: Record<MissionType, { icon: "lock" | "heart" | "book-open"; color: string; title: string; text: (min: number) => string }> = {
  enfoque: {
    icon: "lock",
    color: theme.colors.yellow,
    title: "Tu celular se bloqueará",
    text: (min) => `Al iniciar, la pantalla queda fijada ${min} min. Si sales de la app, la misión cuenta como fallida.`,
  },
  fisico: {
    icon: "heart",
    color: MISSION_TYPE_META.fisico.color,
    title: "Validación con smartwatch",
    text: () => "Si tienes un reloj conectado a Health Connect, validamos pasos y actividad. Si no, la confirmas tú.",
  },
  cultura: {
    icon: "book-open",
    color: MISSION_TYPE_META.cultura.color,
    title: "Validación manual",
    text: () => "Al terminar, confirmas que la completaste para recibir tus puntos.",
  },
};

// 3.1b Nueva misión (RDF037) con vista previa de la recompensa (RDF038)
export function NewMissionModal({ visible, draft, reward, error, saving, onChange, onSubmit, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const notice = NOTICE[draft.type];
  const typeMeta = MISSION_TYPE_META[draft.type];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.heading}>Nueva misión</Text>
              <TouchableOpacity style={shared.iconButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Cerrar">
                <PixelIcon name="close" size={16} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={shared.label} nativeID="m3-titulo">
                Título
              </Text>
              <TextInput
                style={styles.input}
                value={draft.title}
                onChangeText={(title) => onChange({ title })}
                placeholder="Ej. Terminar ensayo de historia"
                placeholderTextColor={MISSION_COLORS.muted}
                accessibilityLabelledBy="m3-titulo"
                maxLength={80}
                returnKeyType="done"
              />
            </View>

            <View style={styles.field}>
              <Text style={shared.label}>Tipo de actividad</Text>
              <View style={styles.typeRow} accessibilityRole="radiogroup">
                {MISSION_TYPES.map((type) => {
                  const meta = MISSION_TYPE_META[type];
                  const active = draft.type === type;
                  return (
                    <TouchableOpacity
                      key={type}
                      style={[styles.typeButton, active && { borderColor: meta.color, backgroundColor: meta.color + "26" }]}
                      onPress={() => onChange({ type })}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                    >
                      <PixelIcon name={meta.icon} size={24} color={active ? meta.color : MISSION_COLORS.muted} />
                      <Text style={[styles.typeText, { color: active ? meta.color : MISSION_COLORS.muted }]}>
                        {meta.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={shared.label}>Duración estimada</Text>
              <View style={styles.durationRow} accessibilityRole="radiogroup">
                {MISSION_DURATIONS.map((min) => {
                  const active = draft.durationMin === min;
                  return (
                    <TouchableOpacity
                      key={min}
                      style={[styles.durationPill, active && styles.durationPillActive]}
                      onPress={() => onChange({ durationMin: min })}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.durationText, active && styles.durationTextActive]}>{min} min</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.notice}>
              <PixelIcon name={notice.icon} size={16} color={notice.color} />
              <View style={styles.noticeBody}>
                <Text style={[styles.noticeTitle, { color: notice.color }]}>{notice.title}</Text>
                <Text style={styles.noticeText}>{notice.text(draft.durationMin)}</Text>
              </View>
            </View>

            <View style={[shared.card, styles.reward]}>
              <PixelIcon name="star" size={32} color={theme.colors.yellow} />
              <View style={styles.rewardBody}>
                <Text style={shared.label}>Recompensa estimada</Text>
                <Text style={styles.rewardHint}>La calcula el servidor según tipo y duración</Text>
              </View>
              <View style={styles.rewardValues}>
                <Text style={styles.rewardXp}>+{reward.xp} XP</Text>
                <Text style={[styles.rewardPoints, { color: typeMeta.color }]}>
                  +{reward.points} {typeMeta.pointsLabel}
                </Text>
              </View>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[shared.primaryButton, saving && shared.disabled]}
              onPress={onSubmit}
              disabled={saving}
              accessibilityRole="button"
            >
              <PixelIcon name="add" size={16} color={MISSION_COLORS.onAccent} />
              <Text style={shared.primaryButtonText}>{saving ? "Guardando…" : "Crear misión"}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(8,8,12,0.72)" },
  sheet: {
    maxHeight: "92%",
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
  },
  content: { padding: 20, paddingBottom: 32, gap: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heading: { fontFamily: theme.fonts.retro, fontSize: 24, color: theme.colors.textPrimary },
  field: { gap: 8 },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    color: theme.colors.textPrimary,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  typeRow: { flexDirection: "row", gap: 8 },
  typeButton: {
    flex: 1,
    height: 76,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  typeText: { fontFamily: theme.fonts.retro, fontSize: 13 },
  durationRow: { flexDirection: "row", gap: 8 },
  durationPill: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  durationPillActive: { backgroundColor: theme.colors.yellow, borderColor: theme.colors.yellow },
  durationText: { fontFamily: theme.fonts.retro, fontSize: 13, color: MISSION_COLORS.muted },
  durationTextActive: { color: MISSION_COLORS.onAccent },
  notice: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: MISSION_COLORS.border,
    backgroundColor: theme.colors.surface,
  },
  noticeBody: { flex: 1, gap: 4 },
  noticeTitle: { fontFamily: theme.fonts.retro, fontSize: 14 },
  noticeText: { color: MISSION_COLORS.softText, fontSize: 12, lineHeight: 17 },
  reward: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  rewardBody: { flex: 1, gap: 2 },
  rewardHint: { color: MISSION_COLORS.muted, fontSize: 11 },
  rewardValues: { alignItems: "flex-end", gap: 2 },
  rewardXp: { fontFamily: theme.fonts.retro, fontSize: 18, color: theme.colors.yellow },
  rewardPoints: { fontFamily: theme.fonts.retro, fontSize: 13 },
  error: { color: MISSION_COLORS.danger, fontSize: 13 },
});
