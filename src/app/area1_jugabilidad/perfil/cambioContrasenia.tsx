import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PasswordField } from "@/components/acceso/FormField";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { theme } from "@/constants/theme";
import { authStyles } from "@/styles/auth.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useChangePasswordViewModel } from "@/viewmodels/useChangePasswordViewModel";

// Cambiar contraseña (M01 · RDF025)
export default function CambioContraseniaScreen() {
  const router = useRouter();
  const vm = useChangePasswordViewModel();

  return (
    <SafeAreaView style={ui.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Cambiar contraseña" />
        {vm.done ? (
          <>
            <Text style={ui.notice}>Tu contraseña se cambió. Úsala la próxima vez que inicies sesión.</Text>
            <TouchableOpacity style={ui.primaryButton} onPress={() => router.back()} accessibilityRole="button">
              <Text style={ui.primaryButtonText}>Volver a mi perfil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <PasswordField
              label="Contraseña actual"
              value={vm.current}
              onChangeText={vm.setCurrent}
              visible={vm.visible}
              onToggleVisible={vm.toggleVisible}
              autoComplete="current-password"
            />
            <PasswordField
              label="Contraseña nueva"
              value={vm.next}
              onChangeText={vm.setNext}
              visible={vm.visible}
              onToggleVisible={vm.toggleVisible}
              autoComplete="new-password"
              error={vm.sameAsCurrent ? "Debe ser distinta a la actual." : null}
            >
              <View style={authStyles.rules}>
                {vm.rules.map((r) => (
                  <View key={r.label} style={authStyles.rule}>
                    <Text style={[authStyles.ruleText, r.ok && authStyles.ruleOk]}>{r.ok ? "✓" : "•"}</Text>
                    <Text style={[authStyles.ruleText, r.ok && authStyles.ruleOk]}>{r.label}</Text>
                  </View>
                ))}
              </View>
            </PasswordField>
            <PasswordField
              label="Confirmar contraseña nueva"
              value={vm.confirm}
              onChangeText={vm.setConfirm}
              visible={vm.visible}
              onToggleVisible={vm.toggleVisible}
              autoComplete="new-password"
              error={vm.mismatch ? "No coincide con la contraseña nueva." : null}
            />
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
                <Text style={ui.primaryButtonText}>Cambiar contraseña</Text>
              )}
            </TouchableOpacity>
            <Text style={[ui.subtitle, { textAlign: "center", color: theme.colors.textSecondary }]}>
              ¿No la recuerdas? Cierra sesión y usa «¿Olvidaste tu contraseña?».
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
