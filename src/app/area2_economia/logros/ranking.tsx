import { Stack } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressTabs } from "@/components/logros/ProgressTabs";
import { XpChart } from "@/components/logros/XpChart";
import { BottomNav } from "@/components/ui/BottomNav";
import { theme } from "@/constants/theme";
import { achievementStyles as styles } from "@/styles/achievements.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useMonthlyComparisonViewModel } from "@/viewmodels/useMonthlyComparisonViewModel";

// 5.3 Leaderboard personal · Tú vs. tú (M05 · RF018). Sin compararse con otras personas.
export default function RankingScreen() {
  const vm = useMonthlyComparisonViewModel();

  return (
    <SafeAreaView style={ui.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={ui.content}>
        <View style={{ gap: 2 }}>
          <Text style={ui.subtitle}>{vm.rangeText}</Text>
          <Text style={ui.title}>Tú vs. tú</Text>
        </View>

        <ProgressTabs active="comparativa" />

        {vm.loading && <ActivityIndicator color={theme.colors.green} />}
        {vm.error && <Text style={ui.error}>{vm.error}</Text>}

        {!vm.loading && !vm.error && (
          <>
            <View style={styles.monthsRow}>
              <View style={styles.monthKey}>
                <View style={[styles.monthSwatch, { backgroundColor: theme.colors.green }]} />
                <Text style={ui.subtitle}>{vm.currentLabel}</Text>
              </View>
              <View style={styles.monthKey}>
                <View style={[styles.monthSwatch, { backgroundColor: UI_COLORS.muted }]} />
                <Text style={ui.subtitle}>{vm.previousLabel}</Text>
              </View>
            </View>
            <Text style={ui.text}>
              Mejoraste en {vm.improvedCount} de {vm.totalMetrics} indicadores respecto a {vm.previousLabel.toLowerCase()}.
            </Text>

            {vm.metrics.map((m) => (
              <View key={m.key} style={[ui.card, styles.metric]}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                  <Text style={[styles.change, { color: m.improved ? theme.colors.green : UI_COLORS.danger }]}>{m.changeText}</Text>
                </View>
                <View style={styles.barRow}>
                  <View style={styles.barTrack}>
                    <View style={[ui.barFill, { width: `${Math.round(m.currentShare * 100)}%` }]} />
                  </View>
                  <Text style={styles.barValue}>{m.current}</Text>
                </View>
                <View style={styles.barRow}>
                  <View style={styles.barTrack}>
                    <View style={[ui.barFill, { width: `${Math.round(m.previousShare * 100)}%`, backgroundColor: UI_COLORS.muted }]} />
                  </View>
                  <Text style={[styles.barValue, { color: UI_COLORS.muted }]}>{m.previous}</Text>
                </View>
              </View>
            ))}

            <View style={[ui.card, styles.metric]}>
              <Text style={ui.label}>XP acumulada por día</Text>
              <XpChart current={vm.dailyXp.current} previous={vm.dailyXp.previous} toDay={vm.toDay} />
            </View>
          </>
        )}
      </ScrollView>
      <BottomNav activeTab="trophy" />
    </SafeAreaView>
  );
}
