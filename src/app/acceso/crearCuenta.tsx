import { useRouter } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChip, FormField, PasswordField } from "@/components/acceso/FormField";
import { ChevronLeftIcon } from "@/components/ui/PixelIcons";
import { GENDER_OPTIONS, GOAL_OPTIONS } from "@/constants/accountOptions";
import { theme } from "@/constants/theme";
import { AUTH_COLORS, authStyles as styles } from "@/styles/auth.styles";
import { useCreateAccountViewModel } from "@/viewmodels/useCreateAccountViewModel";

// M00 · Crear cuenta (RF001 · RDF001), ruta B: después de Google o del correo.
export default function CreateAccountScreen() {
  const router = useRouter();
  const vm = useCreateAccountViewModel();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            {vm.canGoBack && (
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
                <ChevronLeftIcon size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={styles.title}>{vm.title}</Text>
          </View>
          <Text style={styles.subtitle}>{vm.subtitle}</Text>

          {(vm.needsEmail || vm.emailLocked) && (
            <FormField
              label="Correo"
              value={vm.email}
              onChangeText={vm.setEmail}
              editable={!vm.emailLocked}
              placeholder="tucorreo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              error={vm.fieldError("email")}
            />
          )}

          <View style={styles.row}>
            <View style={styles.half}>
              <FormField label="Nombre" value={vm.firstName} onChangeText={vm.setFirstName} placeholder="Majo" autoComplete="given-name" error={vm.fieldError("firstName")} />
            </View>
            <View style={styles.half}>
              <FormField label="Apellido" value={vm.lastName} onChangeText={vm.setLastName} placeholder="Ramírez" autoComplete="family-name" error={vm.fieldError("lastName")} />
            </View>
          </View>

          {vm.needsPassword && (
            <PasswordField
              value={vm.password}
              onChangeText={vm.setPassword}
              visible={vm.showPassword}
              onToggleVisible={vm.toggleShowPassword}
              placeholder="Crea tu contraseña"
              autoComplete="new-password"
              error={vm.fieldError("password")}
            >
              <View style={styles.rules}>
                {vm.passwordRules.map((rule) => (
                  <View key={rule.label} style={styles.rule}>
                    <Text style={[styles.ruleText, rule.ok && styles.ruleOk]}>{rule.ok ? "✓" : "•"}</Text>
                    <Text style={[styles.ruleText, rule.ok && styles.ruleOk]}>{rule.label}</Text>
                  </View>
                ))}
              </View>
            </PasswordField>
          )}

          <View style={styles.row}>
            <View style={{ width: 110 }}>
              <FormField label="Edad" value={vm.ageText} onChangeText={vm.setAgeText} placeholder="21" keyboardType="number-pad" maxLength={3} error={vm.fieldError("age")} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Género</Text>
            <View style={styles.chipsWrap}>
              {GENDER_OPTIONS.map((g) => (
                <ChoiceChip key={g.key} label={g.label} active={vm.gender === g.key} onPress={() => vm.setGender(g.key)} />
              ))}
            </View>
            {vm.fieldError("gender") && <Text style={styles.fieldError}>{vm.fieldError("gender")}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>¿Qué te gustaría lograr?</Text>
            <Text style={styles.hint}>Elige todas las que quieras.</Text>
            <View style={styles.chipsWrap}>
              {GOAL_OPTIONS.map((g) => (
                <ChoiceChip key={g.key} label={g.label} active={vm.goals.includes(g.key)} onPress={() => vm.toggleGoal(g.key)} />
              ))}
              <ChoiceChip label="Otra meta" active={vm.customGoalOn} onPress={vm.toggleCustomGoal} />
            </View>
            {vm.customGoalOn && (
              <FormField label="Tu meta" value={vm.customGoal} onChangeText={vm.setCustomGoal} placeholder="Ej. Aprender a tocar guitarra" />
            )}
            {vm.fieldError("goals") && <Text style={styles.fieldError}>{vm.fieldError("goals")}</Text>}
          </View>

          {vm.error && <Text style={styles.error}>{vm.error}</Text>}

          <TouchableOpacity style={[styles.primaryButton, vm.saving && styles.disabled]} onPress={vm.submit} disabled={vm.saving} accessibilityRole="button">
            {vm.saving ? <ActivityIndicator color={AUTH_COLORS.onAccent} /> : <Text style={styles.primaryButtonText}>Crear cuenta</Text>}
          </TouchableOpacity>

          {!vm.canGoBack && (
            <TouchableOpacity style={styles.linkButton} onPress={vm.useAnotherAccount} accessibilityRole="button">
              <Text style={styles.linkMuted}>Usar otra cuenta</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
