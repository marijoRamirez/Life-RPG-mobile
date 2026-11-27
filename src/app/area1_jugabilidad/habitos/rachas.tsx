import { Stack } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChoiceChip } from "@/components/acceso/FormField";
import { BottomNav, useBottomNavSpace } from "@/components/ui/BottomNav";
import { ChevronLeftIcon, ChevronRightIcon, StreakIcon } from "@/components/ui/PixelIcons";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { theme } from "@/constants/theme";
import type { DayStatus } from "@/models/Quest";
import { DAY_COLORS, habitStyles as styles } from "@/styles/habits.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useStreakCalendarViewModel } from "@/viewmodels/useStreakCalendarViewModel";

const WEEK = ["L", "M", "M", "J", "V", "S", "D"];

const cellColor = (status: DayStatus | null) =>
  status === "completo" || status === "parcial" || status === "fallido" ? DAY_COLORS[status] : theme.colors.surfaceAlt;

// 2.3 Calendario de rachas (M02 · RF009)
export default function RachasScreen() {
  const navSpace = useBottomNavSpace();
  const vm = useStreakCalendarViewModel();

  return (
    <SafeAreaView style={ui.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={[ui.content, { paddingBottom: navSpace }]}>
        <ScreenHeader title="Rachas" />

        <View style={[ui.card, styles.streakCard]}>
          <StreakIcon size={28} color={theme.colors.yellow} />
          <View style={styles.streakInfo}>
            <Text style={styles.streakBig}>{vm.currentStreak} días</Text>
            <Text style={ui.subtitle}>Racha actual · mejor: {vm.bestStreak} días</Text>
          </View>
          <View style={styles.streakSide}>
            <Text style={styles.sideValue}>{vm.completedText}</Text>
            <Text style={ui.subtitle}>días completos</Text>
          </View>
        </View>

        <View style={styles.monthHeader}>
          <TouchableOpacity style={ui.iconButton} onPress={vm.previousMonth} accessibilityLabel="Mes anterior">
            <ChevronLeftIcon size={16} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{vm.monthTitle}</Text>
          <TouchableOpacity
            style={[ui.iconButton, !vm.canGoNext && ui.disabled]}
            onPress={vm.nextMonth}
            disabled={!vm.canGoNext}
            accessibilityLabel="Mes siguiente"
          >
            <ChevronRightIcon size={16} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {vm.filters.map((f) => (
            <ChoiceChip key={f.id ?? "todos"} label={f.label} active={vm.habitId === f.id} onPress={() => vm.setHabitId(f.id)} />
          ))}
        </ScrollView>

        <View style={[ui.card, { padding: 10 }]}>
          <View style={styles.weekHeader}>
            {WEEK.map((d, i) => (
              <Text key={i} style={styles.weekDay}>
                {d}
              </Text>
            ))}
          </View>
          {vm.loading && !vm.cells.length ? (
            <ActivityIndicator color={theme.colors.green} />
          ) : (
            <View style={styles.grid}>
              {vm.cells.map((c) => (
                <View key={c.key} style={styles.cellWrap}>
                  {c.day !== null && (
                    <View
                      style={[styles.cell, { backgroundColor: cellColor(c.status) }, c.isToday && styles.cellToday]}
                      accessibilityLabel={`Día ${c.day}: ${c.status?.replace("_", " ")}`}
                    >
                      <Text
                        style={[
                          styles.cellText,
                          (c.status === "futuro" || c.status === "sin_habitos") && styles.cellTextDim,
                          (c.status === "completo" || c.status === "parcial") && { color: UI_COLORS.onAccent },
                        ]}
                      >
                        {c.day}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.legend}>
          {(
            [
              ["Completo", DAY_COLORS.completo],
              ["Parcial", DAY_COLORS.parcial],
              ["Fallido", DAY_COLORS.fallido],
            ] as const
          ).map(([label, color]) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { borderWidth: 2, borderColor: theme.colors.yellow }]} />
            <Text style={styles.legendText}>Hoy</Text>
          </View>
        </View>
        <Text style={ui.subtitle}>
          La racha cuenta los días seguidos con al menos un hábito cumplido; un día sin ninguno la rompe.
        </Text>

        {vm.error && <Text style={ui.error}>{vm.error}</Text>}

        <View>
          <Text style={ui.label}>Rachas por hábito</Text>
          {vm.byHabit.map((h) => (
            <View key={h.habitId} style={styles.habitStreakRow}>
              <Text style={styles.habitStreakName} numberOfLines={1}>
                {h.name}
              </Text>
              <Text style={styles.habitStreakValue}>{h.streak}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav activeTab="check" />
    </SafeAreaView>
  );
}
