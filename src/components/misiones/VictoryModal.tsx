import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PixelIcon } from "@/components/ui/PixelIcons";
import { MISSION_COLORS, MISSION_TYPE_META } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import type { SessionOutcome } from "@/models/Mission";
import { shared } from "@/app/styles/missions.styles";

type Props = {
  outcome: SessionOutcome | undefined;
  visible: boolean;
  manualConfirmed: boolean;
  claiming: boolean;
  onToggleManual: () => void;
  onClaim: () => void;
  onShowHistory: () => void;
  onGoHome: () => void;
};

// Pantalla de victoria (RDF042) con la validación de la misión (RDF043)
export function VictoryModal({
  outcome,
  visible,
  manualConfirmed,
  claiming,
  onToggleManual,
  onClaim,
  onShowHistory,
  onGoHome,
}: Props) {
  const insets = useSafeAreaInsets();
  if (!outcome) return null;
  const { mission, activity, claimed } = outcome;
  const meta = MISSION_TYPE_META[mission.type];

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onShowHistory}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(insets.top, 20) + 16, paddingBottom: 24 + insets.bottom },
        ]}
      >
        <View style={styles.banner}>
          <View style={[styles.star, { top: 20, left: 28 }]}>
            <PixelIcon name="star" size={24} color={theme.colors.yellow} />
          </View>
          <View style={[styles.star, { top: 44, right: 36 }]}>
            <PixelIcon name="star" size={16} color={theme.colors.yellow} />
          </View>
          <Image
            source={require("@/assets/images/gato.png")}
            style={styles.pet}
            resizeMode="contain"
            accessibilityLabel="Tu mascota celebrando"
          />
          <Text style={styles.bannerTitle} accessibilityRole="header">
            {claimed ? "¡Misión completada!" : "¡Tiempo cumplido!"}
          </Text>
          <Text style={styles.bannerSub}>{mission.title}</Text>
        </View>

        <View style={styles.earnedRow}>
          <View style={[shared.card, styles.earned]}>
            <PixelIcon name="star" size={24} color={theme.colors.yellow} />
            <View>
              <Text style={[styles.earnedValue, { color: theme.colors.yellow }]}>+{mission.reward.xp}</Text>
              <Text style={styles.earnedLabel}>XP</Text>
            </View>
          </View>
          <View style={[shared.card, styles.earned]}>
            <PixelIcon name={meta.icon} size={24} color={meta.color} />
            <View>
              <Text style={[styles.earnedValue, { color: meta.color }]}>+{mission.reward.points}</Text>
              <Text style={styles.earnedLabel}>Puntos {meta.pointsLabel}</Text>
            </View>
          </View>
        </View>

        {outcome.validation === "smartwatch" && activity && (
          <View style={[shared.card, styles.validation, { borderColor: theme.colors.green }]}>
            <View style={styles.validationIcon}>
              <PixelIcon name="heart" size={24} color={MISSION_TYPE_META.fisico.color} />
            </View>
            <View style={styles.validationBody}>
              <Text style={styles.validationTitle}>Validado con smartwatch</Text>
              <Text style={styles.validationText}>
                Health Connect · {activity.distanceKm} km · {activity.steps.toLocaleString("es-MX")} pasos ·{" "}
                {activity.activeMin} min
              </Text>
            </View>
            <PixelIcon name="check" size={24} color={theme.colors.green} />
          </View>
        )}

        {outcome.validation === "bloqueo" && (
          <View style={[shared.card, styles.validation, { borderColor: theme.colors.green }]}>
            <View style={styles.validationIcon}>
              <PixelIcon name="lock" size={24} color={theme.colors.yellow} />
            </View>
            <View style={styles.validationBody}>
              <Text style={styles.validationTitle}>Sesión de enfoque completa</Text>
              <Text style={styles.validationText}>{mission.durationMin} min sin salir de la app</Text>
            </View>
            <PixelIcon name="check" size={24} color={theme.colors.green} />
          </View>
        )}

        {outcome.validation === "manual" && (
          <View style={[shared.card, styles.manual]}>
            <View style={styles.manualHeader}>
              <PixelIcon name="info" size={16} color={MISSION_TYPE_META.enfoque.color} />
              <Text style={styles.validationTitle}>
                {mission.type === "fisico" ? "Sin smartwatch conectado" : "Confirma tu misión"}
              </Text>
            </View>
            {claimed ? (
              <Text style={styles.validationText}>Validada manualmente. Tus puntos ya están en tu cuenta.</Text>
            ) : (
              <>
                <Text style={styles.manualText}>
                  Confirma la actividad para recibir tus puntos. Quedará marcada como validación manual.
                </Text>
                <TouchableOpacity
                  style={styles.checkRow}
                  onPress={onToggleManual}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: manualConfirmed }}
                >
                  <View style={[styles.checkbox, manualConfirmed && styles.checkboxOn]}>
                    {manualConfirmed && <PixelIcon name="check" size={16} color={MISSION_COLORS.onAccent} />}
                  </View>
                  <Text style={styles.checkLabel}>Sí, completé «{mission.title}»</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {claimed ? (
          <View style={styles.actions}>
            <TouchableOpacity style={[shared.secondaryButton, styles.flex]} onPress={onShowHistory} accessibilityRole="button">
              <Text style={shared.secondaryButtonText}>Ver historial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[shared.primaryButton, styles.flex]} onPress={onGoHome} accessibilityRole="button">
              <PixelIcon name="home" size={16} color={MISSION_COLORS.onAccent} />
              <Text style={shared.primaryButtonText}>A la casa</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[shared.primaryButton, (!manualConfirmed || claiming) && shared.disabled]}
            onPress={onClaim}
            disabled={!manualConfirmed || claiming}
            accessibilityRole="button"
          >
            <Text style={shared.primaryButtonText}>{claiming ? "Validando…" : "Reclamar recompensa"}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 20, gap: 14 },
  banner: {
    height: 220,
    borderRadius: 8,
    backgroundColor: theme.colors.green,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 16,
    overflow: "hidden",
  },
  star: { position: "absolute" },
  pet: { width: 104, height: 104 },
  bannerTitle: { fontFamily: theme.fonts.retro, fontSize: 24, color: MISSION_COLORS.onAccent, marginTop: 6 },
  bannerSub: { fontSize: 13, fontWeight: "bold", color: MISSION_COLORS.onAccent },
  earnedRow: { flexDirection: "row", gap: 8 },
  earned: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  earnedValue: { fontFamily: theme.fonts.retro, fontSize: 20 },
  earnedLabel: { fontSize: 11, color: MISSION_COLORS.muted },
  validation: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  validationIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  validationBody: { flex: 1, gap: 3 },
  validationTitle: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: "bold" },
  validationText: { color: MISSION_COLORS.muted, fontSize: 12 },
  manual: { padding: 12, gap: 10, borderStyle: "dashed" },
  manualHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  manualText: { color: MISSION_COLORS.softText, fontSize: 12, lineHeight: 17 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: MISSION_COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: theme.colors.green, borderColor: theme.colors.green },
  checkLabel: { flex: 1, color: theme.colors.textPrimary, fontSize: 14 },
  actions: { flexDirection: "row", gap: 8, marginTop: 6 },
  flex: { flex: 1 },
});
