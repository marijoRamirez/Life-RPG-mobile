import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AUTH_COLORS, authStyles as styles } from "@/styles/auth.styles";
import { useChoosePetViewModel } from "@/viewmodels/useChoosePetViewModel";

// M00 · "Bienvenido a Life-RPG": elige tu animal. Sale UNA vez por cuenta, justo después
// de crearla. Si cambia de celular e inicia sesión, ya tiene su animal y entra a la Casa.
export default function WelcomeScreen() {
  const vm = useChoosePetViewModel();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{vm.greeting}</Text>
        <Text style={styles.subtitle}>
          Elige a tu compañero. Crecerá contigo cada vez que cumplas tus hábitos y misiones. Esta decisión es para siempre.
        </Text>

        <View style={styles.previewCard}>
          {vm.selectedOption ? (
            <>
              <Image source={vm.selectedOption.image} style={styles.previewImage} resizeMode="contain" />
              <Text style={styles.previewText}>{vm.selectedOption.label}</Text>
            </>
          ) : (
            <Text style={[styles.previewText, { paddingVertical: 56 }]}>¿Quién será tu mascota?</Text>
          )}
        </View>

        <View style={styles.petGrid}>
          {vm.options.map((pet) => {
            const active = vm.selected === pet.key;
            return (
              <TouchableOpacity
                key={pet.key}
                style={[styles.petCard, active && styles.petCardActive]}
                onPress={() => vm.select(pet.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={pet.label}
              >
                <Image source={pet.image} style={styles.petImage} resizeMode="contain" />
                <Text style={styles.petName}>{pet.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {vm.error && <Text style={styles.error}>{vm.error}</Text>}
        <TouchableOpacity
          style={[styles.primaryButton, (!vm.selected || vm.saving) && styles.disabled]}
          onPress={vm.confirm}
          disabled={!vm.selected || vm.saving}
          accessibilityRole="button"
        >
          {vm.saving ? (
            <ActivityIndicator color={AUTH_COLORS.onAccent} />
          ) : (
            <Text style={styles.primaryButtonText}>{vm.selectedOption ? `Elegir a ${vm.selectedOption.label}` : "Elige un animal"}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
