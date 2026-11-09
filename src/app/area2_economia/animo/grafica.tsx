import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MoodChart } from "@/components/animo/MoodChart";
import { BottomNav } from "@/components/ui/BottomNav";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { MOOD_COLORS } from "@/constants/moodTypes";
import { theme } from "@/constants/theme";
import type { MoodPeriod } from "@/models/MoodLog";
import { useMoodChartViewModel } from "@/viewmodels/useMoodChartViewModel";
import { chartStyles as styles, moodShared as shared } from "@/styles/mood.styles";

const PERIODS: { key: MoodPeriod; label: string }[] = [
  { key: "semana", label: "Semana" },
  { key: "mes", label: "Mes" },
];

// 6.2 Gráfica de ánimo (RF020)
export default function GraficaAnimoScreen() {
  const router = useRouter();
  const vm = useMoodChartViewModel();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={shared.subtitle}>{vm.rangeText}</Text>
            <Text style={shared.title}>Tu ánimo</Text>
          </View>
          <View style={styles.segmented} accessibilityRole="tablist">
            {PERIODS.map((p) => {
              const active = vm.period === p.key;
              return (
                <TouchableOpacity
                  key={p.key}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => vm.setPeriod(p.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{p.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {vm.error ? (
          <TouchableOpacity onPress={vm.retry} accessibilityRole="button">
            <Text style={styles.error}>{vm.error} Toca para reintentar.</Text>
          </TouchableOpacity>
        ) : !vm.trend || vm.loading ? (
          <ActivityIndicator color={theme.colors.green} />
        ) : (
          <>
            {/* Serie diaria (RDF072) */}
            <View style={[shared.card, styles.chartCard]}>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={styles.legendSquare} />
                  <Text style={styles.legendText}>Ánimo (1 a 5)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendDash} />
                  <Text style={styles.legendText}>Energía (0 a 10)</Text>
                </View>
              </View>
              <MoodChart points={vm.trend.points} />
              <View style={styles.axisRow}>
                {vm.xLabels.map((label, i) => (
                  <Text key={i} style={styles.axisLabel} numberOfLines={1}>
                    {label}
                  </Text>
                ))}
              </View>
            </View>

            {/* Resumen del periodo (RDF073) */}
            <View style={styles.statsRow}>
              <View style={[shared.card, styles.statTile]}>
                <Text style={shared.label}>Promedio</Text>
                <Text style={styles.statValue}>{vm.averageText}</Text>
              </View>
              <View style={[shared.card, styles.statTile]}>
                <Text style={shared.label}>Mejor</Text>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                  {vm.bestText}
                </Text>
              </View>
              <View style={[shared.card, styles.statTile]}>
                <Text style={shared.label}>Más bajo</Text>
                <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                  {vm.worstText}
                </Text>
              </View>
            </View>

            {/* Patrón detectado (RDF074) */}
            <View style={[shared.card, styles.patternCard]}>
              <PixelIcon name="star" size={16} color={theme.colors.yellow} />
              <View style={styles.patternBody}>
                <Text style={styles.patternTitle}>{vm.patternTitle}</Text>
                <Text style={styles.patternText}>{vm.patternText}</Text>
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          style={shared.secondaryButton}
          onPress={() => router.push("/area2_economia/animo/diario")}
          accessibilityRole="button"
        >
          <PixelIcon name="edit" size={16} color={theme.colors.textPrimary} />
          <Text style={shared.secondaryButtonText}>Abrir diario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/area2_economia/animo/registro")}
          accessibilityRole="button"
        >
          <Text style={[shared.subtitle, { textAlign: "center", color: MOOD_COLORS.softText }]}>
            Registrar el ánimo de hoy
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav activeTab="trophy" />
    </SafeAreaView>
  );
}