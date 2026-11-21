import { useRouter } from "expo-router";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FormField, PasswordField } from "@/components/acceso/FormField";
import { InfoIcon } from "@/components/ui/PixelIcons";
import { PET_OPTIONS } from "@/constants/petTypes";
import { AUTH_COLORS, authStyles as styles } from "@/styles/auth.styles";
import { useLoginViewModel } from "@/viewmodels/useLoginViewModel";

// M00 · Iniciar sesión (RF002 · RDF006). Google o correo y contraseña.
export default function LoginScreen() {
  const router = useRouter();
  const vm = useLoginViewModel();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={[styles.content, styles.centered]} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.petsRow}>
              {PET_OPTIONS.map((pet, i) => (
                <Image key={pet.key} source={pet.image} style={i === 2 ? styles.heroPetCenter : styles.heroPet} resizeMode="contain" />
              ))}
            </View>
            <Text style={styles.brand}>LIFE-RPG</Text>
            <Text style={styles.tagline}>Cumple tus hábitos y tu mascota crece contigo.</Text>
          </View>

          <TouchableOpacity
            style={[styles.googleButton, vm.busy !== null && styles.disabled]}
            onPress={vm.signInWithGoogle}
            disabled={vm.busy !== null}
            accessibilityRole="button"
            accessibilityLabel="Continuar con Google"
          >
            {vm.busy === "google" ? (
              <ActivityIndicator color="#3C4043" />
            ) : (
              <>
                <View style={styles.googleBadge}>
                  <Text style={styles.googleBadgeText}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o con tu correo</Text>
            <View style={styles.dividerLine} />
          </View>

          <FormField
            label="Correo"
            value={vm.email}
            onChangeText={vm.setEmail}
            placeholder="tucorreo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
          />
          <PasswordField
            value={vm.password}
            onChangeText={vm.setPassword}
            visible={vm.showPassword}
            onToggleVisible={vm.toggleShowPassword}
            placeholder="Tu contraseña"
            autoComplete="password"
            onSubmitEditing={vm.signIn}
          />
          <TouchableOpacity
            style={styles.forgot}
            onPress={() => router.push({ pathname: "/acceso/recuperar", params: { email: vm.email } })}
            accessibilityRole="link"
          >
            <Text style={styles.linkMuted}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {vm.error && <Text style={styles.error}>{vm.error}</Text>}

          <TouchableOpacity
            style={[styles.primaryButton, !vm.canSubmit && styles.disabled]}
            onPress={vm.signIn}
            disabled={!vm.canSubmit}
            accessibilityRole="button"
          >
            {vm.busy === "email" ? (
              <ActivityIndicator color={AUTH_COLORS.onAccent} />
            ) : (
              <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/acceso/crearCuenta")} accessibilityRole="link">
            <Text style={styles.linkMuted}>
              ¿Nuevo en Life-RPG? <Text style={styles.linkText}>Crear cuenta</Text>
            </Text>
          </TouchableOpacity>

          {vm.testAccountHint && (
            <View style={styles.infoCard}>
              <InfoIcon size={16} color={AUTH_COLORS.softText} />
              <Text style={styles.infoText}>{vm.testAccountHint}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
