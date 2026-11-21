import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChip, FormField } from "@/components/acceso/FormField";
import { SettingsIcon } from "@/components/ui/PixelIcons";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { GENDER_OPTIONS, GOAL_OPTIONS } from "@/constants/accountOptions";
import { theme } from "@/constants/theme";
import { profileStyles as styles } from "@/styles/profile.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useProfileViewModel } from "@/viewmodels/useProfileViewModel";

// 1.3 Edición de perfil de usuario (M01 · RF006)
export default function PerfilScreen() {
  const router = useRouter();
  const vm = useProfileViewModel();

  return (
    <SafeAreaView style={ui.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            title="Mi perfil"
            right={
              <TouchableOpacity
                style={ui.iconButton}
                onPress={() => router.push("/area1_jugabilidad/perfil/ajustes")}
                accessibilityRole="button"
                accessibilityLabel="Ajustes"
              >
                <SettingsIcon size={18} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            }
          />

          <View style={[ui.card, styles.identity]}>
            <View style={styles.avatar}>
              {vm.photoUrl ? (
                <Image source={{ uri: vm.photoUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarInitial}>{vm.initial}</Text>
              )}
            </View>
            <Text style={styles.name}>{vm.fullName}</Text>
            <Text style={ui.subtitle}>{vm.sinceText}</Text>
            <TouchableOpacity style={styles.photoButton} onPress={vm.pickPhoto} accessibilityRole="button">
              <Text style={styles.photoButtonText}>Cambiar foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <FormField label="Nombre" value={vm.firstName} onChangeText={vm.setFirstName} autoComplete="given-name" />
            </View>
            <View style={styles.half}>
              <FormField label="Apellido" value={vm.lastName} onChangeText={vm.setLastName} autoComplete="family-name" />
            </View>
          </View>

          <FormField
            label="Correo electrónico"
            value={vm.email}
            onChangeText={vm.setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            hint="Si lo cambias, te enviaremos un enlace al correo nuevo para confirmarlo."
          />

          <View style={{ gap: 6 }}>
            <Text style={ui.label}>Contraseña</Text>
            <TouchableOpacity
              style={[ui.card, styles.passwordRow]}
              onPress={() => router.push("/area1_jugabilidad/perfil/cambioContrasenia")}
              accessibilityRole="button"
              accessibilityLabel="Cambiar contraseña"
            >
              <Text style={styles.passwordDots}>••••••••</Text>
              <Text style={styles.linkText}>Cambiar</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: 110 }}>
            <FormField label="Edad" value={vm.ageText} onChangeText={vm.setAgeText} keyboardType="number-pad" maxLength={3} />
          </View>

          <View style={{ gap: 8 }}>
            <Text style={ui.label}>Género</Text>
            <View style={ui.chipsWrap}>
              {GENDER_OPTIONS.map((g) => (
                <ChoiceChip key={g.key} label={g.label} active={vm.gender === g.key} onPress={() => vm.setGender(g.key)} />
              ))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={ui.label}>Mis metas</Text>
            <View style={ui.chipsWrap}>
              {GOAL_OPTIONS.map((g) => (
                <ChoiceChip key={g.key} label={g.label} active={vm.goals.includes(g.key)} onPress={() => vm.toggleGoal(g.key)} />
              ))}
            </View>
            <FormField label="Meta propia" value={vm.customGoal} onChangeText={vm.setCustomGoal} placeholder="Opcional" />
          </View>

          <View style={{ gap: 6 }}>
            <Text style={ui.label}>Apariencia</Text>
            <View style={[ui.card, styles.petRow]}>
              <View style={{ backgroundColor: vm.petColors.find((c) => c.key === vm.petColor)?.value, borderRadius: 30 }}>
                <Image source={vm.petImage} style={styles.pet} resizeMode="contain" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Mi mascota: {vm.petLabel}</Text>
                <Text style={ui.subtitle}>La elegiste al crear tu cuenta. Su ropa se cambia en el Vestidor.</Text>
              </View>
            </View>
            <Text style={[ui.subtitle, { marginTop: 6 }]}>Color de tu mascota (su aura y su hábitat en la Casa)</Text>
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              {vm.petColors.map((c) => {
                const active = vm.petColor === c.key;
                return (
                  <TouchableOpacity
                    key={c.key}
                    onPress={() => vm.setPetColor(c.key)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={`Color ${c.label}`}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: c.value,
                      borderWidth: 3,
                      borderColor: active ? theme.colors.textPrimary : "transparent",
                    }}
                  />
                );
              })}
            </View>
          </View>

          {vm.notice && <Text style={ui.notice}>{vm.notice}</Text>}
          {vm.error && <Text style={ui.error}>{vm.error}</Text>}

          <TouchableOpacity style={[ui.primaryButton, vm.saving && ui.disabled]} onPress={vm.save} disabled={vm.saving} accessibilityRole="button">
            {vm.saving ? <ActivityIndicator color={UI_COLORS.onAccent} /> : <Text style={ui.primaryButtonText}>Guardar cambios</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
