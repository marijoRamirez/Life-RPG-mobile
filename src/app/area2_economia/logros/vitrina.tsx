import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressTabs } from "@/components/logros/ProgressTabs";
import { BottomNav } from "@/components/ui/BottomNav";
import { LockIcon, PixelIcon, StarIcon } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import { achievementStyles as styles } from "@/styles/achievements.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useAchievementsViewModel } from "@/viewmodels/useAchievementsViewModel";

// 5.1 Vitrina de medallas (M05 · RF016)
export default function VitrinaScreen() {
  const router = useRouter();
  const vm = useAchievementsViewModel();
  const open = (id: string) => router.push({ pathname: "/area2_economia/logros/ficha", params: { id } });

  return (
    <SafeAreaView style={ui.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={ui.content}>
        <View style={styles.headerRow}>
          <View style={{ gap: 2 }}>
            <Text style={ui.subtitle}>{vm.countText}</Text>
            <Text style={ui.title}>Logros</Text>
          </View>
          <Text style={styles.percent}>{vm.percent}</Text>
        </View>

        <ProgressTabs active="medallas" />

        {vm.toClaimText && (
          <View style={[ui.card, styles.banner, { borderColor: theme.colors.green }]}>
            <StarIcon size={16} color={theme.colors.green} />
            <Text style={styles.bannerText}>{vm.toClaimText}. Toca la medalla con punto verde.</Text>
          </View>
        )}

        {vm.loading && <ActivityIndicator color={theme.colors.green} />}
        {vm.error && <Text style={ui.error}>{vm.error}</Text>}

        <View style={styles.grid}>
          {vm.cards.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[ui.card, styles.medal, !c.unlocked && styles.medalLocked]}
              onPress={() => open(c.id)}
              accessibilityRole="button"
              accessibilityLabel={`${c.name}, ${c.unlocked ? "desbloqueado" : `bloqueado ${c.caption}`}`}
            >
              {c.pendingClaim && <View style={styles.claimDot} />}
              <View style={[styles.medalIcon, !c.unlocked && styles.medalIconLocked]}>
                {c.unlocked ? (
                  <PixelIcon name={c.icon} size={26} color={theme.colors.background} />
                ) : (
                  <LockIcon size={20} color={UI_COLORS.muted} />
                )}
              </View>
              <Text style={styles.medalName} numberOfLines={2}>
                {c.name}
              </Text>
              <Text style={styles.medalCaption}>{c.caption}</Text>
              {!c.unlocked && (
                <View style={styles.miniTrack}>
                  <View style={[styles.miniFill, { width: c.progress as `${number}%` }]} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {vm.closestText && vm.closestId && (
          <TouchableOpacity style={[ui.card, styles.banner]} onPress={() => open(vm.closestId!)} accessibilityRole="button">
            <PixelIcon name="trophy" size={16} color={theme.colors.yellow} />
            <Text style={styles.bannerText}>{vm.closestText}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <BottomNav activeTab="trophy" />
    </SafeAreaView>
  );
}
