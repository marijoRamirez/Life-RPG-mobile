import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CheckIcon, LockIcon, PixelIcon } from "@/components/ui/PixelIcons";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { theme } from "@/constants/theme";
import { achievementStyles as styles } from "@/styles/achievements.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useAchievementDetailViewModel } from "@/viewmodels/useAchievementDetailViewModel";

// 5.2 Ficha de logro (M05 · RF017)
export default function FichaLogroScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const vm = useAchievementDetailViewModel(id);
  const item = vm.item;

  return (
    <SafeAreaView style={ui.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={ui.content}>
        <ScreenHeader title="Logro" />
        {vm.loading && <ActivityIndicator color={theme.colors.green} />}
        {!vm.loading && !item && <Text style={ui.error}>{vm.error ?? "El logro no existe."}</Text>}
        {item && vm.rarity && (
          <>
            <View style={[ui.card, styles.hero]}>
              <View style={[styles.heroIcon, !item.unlockedAt && { backgroundColor: theme.colors.surfaceAlt }]}>
                {item.unlockedAt ? (
                  <PixelIcon name={item.icon} size={44} color={theme.colors.background} />
                ) : (
                  <LockIcon size={32} color={UI_COLORS.muted} />
                )}
              </View>
              <Text style={[styles.rarity, { color: vm.rarity.color }]}>{vm.rarity.label}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={ui.subtitle}>{vm.statusText}</Text>
            </View>

            <View style={[ui.card, styles.section]}>
              <View style={styles.progressRow}>
                <Text style={ui.label}>Progreso</Text>
                <Text style={styles.progressValue}>{vm.progressText}</Text>
              </View>
              <View style={ui.barTrack}>
                <View style={[ui.barFill, { width: vm.progress as `${number}%` }]} />
              </View>
              {item.conditions.map((c) => (
                <View key={c} style={styles.condition}>
                  <CheckIcon size={12} color={item.unlockedAt ? theme.colors.green : UI_COLORS.muted} />
                  <Text style={styles.conditionText}>{c}</Text>
                </View>
              ))}
            </View>

            {vm.rewardText && (
              <View style={[ui.card, styles.section]}>
                <Text style={ui.label}>Recompensa</Text>
                <Text style={styles.rewardText}>{vm.rewardText}</Text>
                {vm.claimed && <Text style={ui.subtitle}>Ya la reclamaste.</Text>}
              </View>
            )}

            {vm.notice && <Text style={ui.notice}>{vm.notice}</Text>}
            {vm.error && <Text style={ui.error}>{vm.error}</Text>}

            {vm.canClaim && (
              <TouchableOpacity style={ui.primaryButton} onPress={vm.claim} disabled={vm.claiming} accessibilityRole="button">
                {vm.claiming ? (
                  <ActivityIndicator color={UI_COLORS.onAccent} />
                ) : (
                  <Text style={ui.primaryButtonText}>Reclamar recompensa</Text>
                )}
              </TouchableOpacity>
            )}
            {vm.action && (
              <TouchableOpacity
                style={ui.secondaryButton}
                onPress={() => router.push(vm.action!.route as never)}
                accessibilityRole="button"
              >
                <Text style={ui.secondaryButtonText}>{vm.action.label}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
