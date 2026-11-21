import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormField } from "@/components/acceso/FormField";
import { ChevronLeftIcon } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import { AUTH_COLORS, authStyles as styles } from "@/styles/auth.styles";
import { useRecoverPasswordViewModel } from "@/viewmodels/useRecoverPasswordViewModel";

// M00 · Recuperar contraseña (RF002 · RDF009). Firebase envía el enlace por correo.
export default function RecoverPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const vm = useRecoverPasswordViewModel(email ?? "");

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
            <ChevronLeftIcon size={18} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Recuperar contraseña</Text>
        </View>

        {vm.sentTo ? (
          <>
            <Text style={styles.notice}>
              Si {vm.sentTo} tiene una cuenta, te llegará un correo con un enlace para crear una contraseña nueva. Revisa también la carpeta de spam.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()} accessibilityRole="button">
              <Text style={styles.primaryButtonText}>Volver a iniciar sesión</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.</Text>
            <FormField
              label="Correo"
              value={vm.email}
              onChangeText={vm.setEmail}
              placeholder="tucorreo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              onSubmitEditing={vm.send}
            />
            {vm.error && <Text style={styles.error}>{vm.error}</Text>}
            <TouchableOpacity style={[styles.primaryButton, !vm.canSend && styles.disabled]} onPress={vm.send} disabled={!vm.canSend} accessibilityRole="button">
              {vm.sending ? <ActivityIndicator color={AUTH_COLORS.onAccent} /> : <Text style={styles.primaryButtonText}>Enviar enlace</Text>}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
