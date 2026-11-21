import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from "@/components/ui/PixelIcons";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { theme } from "@/constants/theme";
import { profileStyles as styles } from "@/styles/profile.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useSettingsViewModel } from "@/viewmodels/useSettingsViewModel";

// Ajustes: cuenta, privacidad (RDF071), recordatorio de ánimo (RDF070) y cerrar sesión (RDF008)
export default function AjustesScreen() {
  const router = useRouter();
  const vm = useSettingsViewModel();

  const TimeColumn = ({ value, up, down, label }: { value: string; up: () => void; down: () => void; label: string }) => (
    <View style={styles.timeColumn}>
      <TouchableOpacity style={styles.timeButton} onPress={up} accessibilityLabel={`Subir ${label}`}>
        <ChevronUpIcon size={14} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.timeValue}>{value}</Text>
      <TouchableOpacity style={styles.timeButton} onPress={down} accessibilityLabel={`Bajar ${label}`}>
        <ChevronDownIcon size={14} color={theme.colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={ui.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader title="Ajustes" />
        {vm.error && <Text style={ui.error}>{vm.error}</Text>}

        <Text style={ui.label}>Cuenta</Text>
        <TouchableOpacity
          style={[ui.card, styles.navRow]}
          onPress={() => router.push("/area1_jugabilidad/perfil/perfil")}
          accessibilityRole="button"
        >
          <View style={styles.switchText}>
            <Text style={styles.rowTitle}>Mi perfil</Text>
            <Text style={ui.subtitle}>{vm.email}</Text>
          </View>
          <ChevronRightIcon size={16} color={UI_COLORS.muted} />
        </TouchableOpacity>

        <Text style={ui.label}>Privacidad</Text>
        <View style={[ui.card, styles.section]}>
          {vm.privacy ? (
            <View style={styles.switchRow}>
              <View style={styles.switchText}>
                <Text style={styles.rowTitle}>Mis visualizadores ven mi ánimo</Text>
                <Text style={ui.subtitle}>
                  {vm.privacy.viewersCount} visualizador{vm.privacy.viewersCount === 1 ? "" : "es"} en tu Perfil lite. Las
                  entradas del diario solo se ven si las compartes.
                </Text>
              </View>
              <Switch
                value={vm.privacy.visibleToViewers}
                onValueChange={vm.togglePrivacy}
                trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.green }}
                thumbColor={theme.colors.textPrimary}
                accessibilityLabel="Mis visualizadores ven mi ánimo"
              />
            </View>
          ) : (
            <ActivityIndicator color={theme.colors.green} />
          )}
        </View>

        <Text style={ui.label}>Recordatorio de ánimo</Text>
        <View style={[ui.card, styles.section]}>
          {vm.reminder ? (
            <>
              <View style={styles.switchRow}>
                <View style={styles.switchText}>
                  <Text style={styles.rowTitle}>Recordarme todos los días</Text>
                  <Text style={ui.subtitle}>Una notificación para registrar cómo te sientes.</Text>
                </View>
                <Switch
                  value={vm.reminder.enabled}
                  onValueChange={vm.setReminderEnabled}
                  trackColor={{ false: theme.colors.surfaceAlt, true: theme.colors.green }}
                  thumbColor={theme.colors.textPrimary}
                  accessibilityLabel="Recordarme todos los días"
                />
              </View>
              {vm.reminder.enabled && (
                <View style={styles.timeRow}>
                  <TimeColumn value={vm.timeText.slice(0, 2)} up={vm.hourUp} down={vm.hourDown} label="hora" />
                  <Text style={styles.timeColon}>:</Text>
                  <TimeColumn value={vm.timeText.slice(3)} up={vm.minuteUp} down={vm.minuteDown} label="minutos" />
                </View>
              )}
              {vm.reminderNotice && <Text style={ui.notice}>{vm.reminderNotice}</Text>}
              <TouchableOpacity
                style={ui.secondaryButton}
                onPress={vm.saveReminder}
                disabled={vm.savingReminder}
                accessibilityRole="button"
              >
                {vm.savingReminder ? (
                  <ActivityIndicator color={theme.colors.textPrimary} />
                ) : (
                  <Text style={ui.secondaryButtonText}>Guardar recordatorio</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <ActivityIndicator color={theme.colors.green} />
          )}
        </View>

        <Text style={ui.label}>Servidor</Text>
        <View style={[ui.card, styles.section]}>
          <Text style={ui.subtitle}>
            Dirección del backend: en la nube o la IP y el puerto de una computadora de tu red (modo LAN).
          </Text>
          <TextInput
            style={ui.input}
            value={vm.serverInput}
            onChangeText={vm.setServerInput}
            placeholder="192.168.0.10:3000"
            placeholderTextColor={UI_COLORS.muted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            accessibilityLabel="Dirección del servidor"
          />
          {vm.serverStatus && <Text style={ui.subtitle}>{vm.serverStatus}</Text>}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity style={[ui.secondaryButton, { flex: 1 }]} onPress={vm.checkServer} disabled={vm.testingServer} accessibilityRole="button">
              {vm.testingServer ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={ui.secondaryButtonText}>Probar</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[ui.secondaryButton, { flex: 1 }]} onPress={vm.saveServer} accessibilityRole="button">
              <Text style={ui.secondaryButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={vm.resetServer} accessibilityRole="button" style={{ alignSelf: "center", padding: 4 }}>
            <Text style={ui.subtitle}>Restablecer la del archivo .env</Text>
          </TouchableOpacity>
          <Text style={ui.subtitle}>{vm.connectedText}</Text>
        </View>

        <Text style={ui.label}>Sesión</Text>
        <TouchableOpacity style={ui.dangerButton} onPress={vm.signOut} accessibilityRole="button">
          <Text style={ui.dangerButtonText}>{vm.confirmSignOut ? "Toca otra vez para cerrar sesión" : "Cerrar sesión"}</Text>
        </TouchableOpacity>
        {vm.confirmSignOut && (
          <TouchableOpacity onPress={vm.cancelSignOut} accessibilityRole="button" style={{ alignSelf: "center", padding: 6 }}>
            <Text style={ui.subtitle}>Cancelar</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.footer}>{vm.modeText}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
