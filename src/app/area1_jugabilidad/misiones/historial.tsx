import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterPills, type PillOption } from "@/components/misiones/FilterPills";
import { VictoryModal } from "@/components/misiones/VictoryModal";
import { BottomNav } from "@/components/ui/BottomNav";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { MISSION_COLORS, MISSION_TYPE_META, MISSION_TYPES } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import { styles } from "../../styles/historial.styles";
import { shared } from "../../styles/misiones.styles";
import {
  type HistoryStatusFilter,
  type HistoryTypeFilter,
  useMissionHistoryViewModel,
} from "@/viewmodels/useMissionHistoryViewModel";

const STATUS_OPTIONS: { key: HistoryStatusFilter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "completada", label: "Completadas" },
  { key: "fallida", label: "Fallidas" },
];

const TYPE_OPTIONS: PillOption<HistoryTypeFilter>[] = [
  { key: "todos", label: "Todos", color: theme.colors.green },
  ...MISSION_TYPES.map((t) => ({ key: t, label: MISSION_TYPE_META[t].label, color: MISSION_TYPE_META[t].color })),
];

// 3.3 Validación e historial (RF012)
export default function HistorialMisionesScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const vm = useMissionHistoryViewModel(sessionId);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/area1_jugabilidad/misiones/tablero");
  };

  const goHome = () => {
    vm.dismissVictory();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={shared.iconButton} onPress={goBack} accessibilityRole="button" accessibilityLabel="Volver">
            <PixelIcon name="chevron-left" size={16} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <View>
            <Text style={[shared.title, { fontSize: 24 }]} accessibilityRole="header">
              Historial
            </Text>
            <Text style={styles.subtitle}>Misiones únicas completadas y fallidas</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[shared.card, styles.summaryTile]}>
            <Text style={[styles.summaryValue, { color: theme.colors.green }]}>{vm.summary.completed}</Text>
            <Text style={styles.summaryLabel}>Completadas</Text>
          </View>
          <View style={[shared.card, styles.summaryTile]}>
            <Text style={[styles.summaryValue, { color: MISSION_COLORS.danger }]}>{vm.summary.failed}</Text>
            <Text style={styles.summaryLabel}>Fallidas</Text>
          </View>
          <View style={[shared.card, styles.summaryTile]}>
            <Text style={[styles.summaryValue, { color: theme.colors.yellow }]}>{vm.summary.xp}</Text>
            <Text style={styles.summaryLabel}>XP ganada</Text>
          </View>
        </View>

        <View style={styles.segmented} accessibilityRole="radiogroup" accessibilityLabel="Filtrar por estado">
          {STATUS_OPTIONS.map((o) => {
            const active = vm.statusFilter === o.key;
            return (
              <TouchableOpacity
                key={o.key}
                style={[styles.segment, active && styles.segmentActive]}
                onPress={() => vm.setStatusFilter(o.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{o.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FilterPills
          options={TYPE_OPTIONS}
          value={vm.typeFilter}
          onChange={vm.setTypeFilter}
          accessibilityLabel="Filtrar por tipo"
        />

        {vm.error && (
          <TouchableOpacity onPress={vm.reload} accessibilityRole="button">
            <Text style={styles.error}>{vm.error} Toca para reintentar.</Text>
          </TouchableOpacity>
        )}

        {vm.loading && vm.rows.length === 0 ? (
          <ActivityIndicator color={theme.colors.yellow} />
        ) : (
          <View>
            {vm.rows.map((row) => {
              const meta = MISSION_TYPE_META[row.type];
              const done = row.status === "completada";
              return (
                <View key={row.id} style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: meta.color + "26" }]}>
                    <PixelIcon name={meta.icon} size={16} color={meta.color} />
                  </View>
                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle}>{row.title}</Text>
                    <Text style={styles.rowMeta}>
                      {row.whenLabel} · {row.detailLabel}
                    </Text>
                  </View>
                  <View style={styles.rowSide}>
                    <Text style={[styles.badge, done ? styles.badgeDone : styles.badgeFail]}>
                      {done ? "Completada" : "Fallida"}
                    </Text>
                    <Text style={[styles.rowXp, { color: done ? theme.colors.yellow : MISSION_COLORS.muted }]}>
                      +{row.reward.xp} XP
                    </Text>
                  </View>
                </View>
              );
            })}
            {!vm.error && vm.rows.length === 0 && (
              <Text style={shared.centerText}>No hay misiones con estos filtros.</Text>
            )}
          </View>
        )}
      </ScrollView>

      <BottomNav activeTab="flag" />

      <VictoryModal
        outcome={vm.outcome}
        visible={vm.isVictoryOpen}
        manualConfirmed={vm.manualConfirmed}
        claiming={vm.claiming}
        onToggleManual={vm.toggleManualConfirmed}
        onClaim={vm.claimManual}
        onShowHistory={vm.dismissVictory}
        onGoHome={goHome}
      />
    </SafeAreaView>
  );
}
