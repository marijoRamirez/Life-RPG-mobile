import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MISSION_COLORS } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import { shared } from "@/app/styles/missions.styles";

type Props = {
  visible: boolean;
  elapsedLabel: string;
  totalLabel: string;
  onStay: () => void;
  onGiveUp: () => void;
};

// Confirmación antes de rendirse (RDF040)
export function GiveUpDialog({ visible, elapsedLabel, totalLabel, onStay, onGiveUp }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onStay}>
      <View style={styles.backdrop}>
        <View style={[shared.card, styles.dialog]} accessibilityViewIsModal>
          <Text style={styles.title} accessibilityRole="header">
            ¿Rendirte ahora?
          </Text>
          <Text style={styles.text}>
            Llevas {elapsedLabel} de {totalLabel}. La misión quedará como fallida, se liberará el celular y no
            recibirás puntos.
          </Text>
          <TouchableOpacity style={shared.primaryButton} onPress={onStay} accessibilityRole="button">
            <Text style={shared.primaryButtonText}>Seguir enfocado</Text>
          </TouchableOpacity>
          <TouchableOpacity style={shared.secondaryButton} onPress={onGiveUp} accessibilityRole="button">
            <Text style={[shared.secondaryButtonText, { color: MISSION_COLORS.danger }]}>Rendirme</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(8,8,12,0.78)", justifyContent: "center", padding: 24 },
  dialog: { padding: 20, gap: 14 },
  title: { fontFamily: theme.fonts.retro, fontSize: 22, color: theme.colors.textPrimary },
  text: { color: MISSION_COLORS.softText, fontSize: 14, lineHeight: 20 },
});
