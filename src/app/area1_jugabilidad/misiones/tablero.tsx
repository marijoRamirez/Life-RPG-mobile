import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterPills, type PillOption } from "@/components/misiones/FilterPills";
import { MissionCard } from "@/components/misiones/MissionCard";
import { NewMissionModal } from "@/components/misiones/NewMissionModal";
import { BottomNav } from "@/components/ui/BottomNav";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { MISSION_TYPE_META, MISSION_TYPES } from "@/constants/missionTypes";
import { theme } from "@/constants/theme";
import type { Mission } from "@/models/Mission";
import { shared } from "../../styles/misiones.styles";
import { styles } from "../../styles/tablero.styles";
import { type MissionFilter, useMissionBoardViewModel } from "@/viewmodels/useMissionBoardViewModel";

const FILTERS: PillOption<MissionFilter>[] = [
  { key: "todas", label: "Todas", color: theme.colors.green },
  ...MISSION_TYPES.map((t) => ({ key: t, label: MISSION_TYPE_META[t].label, color: MISSION_TYPE_META[t].color })),
];

// 3.1 Tablero de selección (RF010)
export default function TableroMisionesScreen() {
  const router = useRouter();
  const vm = useMissionBoardViewModel();

  const countLabel =
    vm.filter === "todas"
      ? `${vm.totalActive} misiones activas`
      : `${vm.missions.length} de ${MISSION_TYPE_META[vm.filter].label} · ${vm.totalActive} activas`;

  const handleStart = (mission: Mission) => {
    router.push({ pathname: "/area1_jugabilidad/misiones/enfoque", params: { missionId: mission.id } });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.count}>{countLabel}</Text>
            <Text style={shared.title} accessibilityRole="header">
              Misiones
            </Text>
          </View>
          <TouchableOpacity
            style={[shared.iconButton, styles.addButton]}
            onPress={vm.openForm}
            accessibilityRole="button"
            accessibilityLabel="Nueva misión"
          >
            <PixelIcon name="add" size={16} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <FilterPills
          options={FILTERS}
          value={vm.filter}
          onChange={vm.setFilter}
          accessibilityLabel="Filtrar por tipo de actividad"
        />

        {vm.error && (
          <TouchableOpacity onPress={vm.reload} accessibilityRole="button">
            <Text style={styles.error}>{vm.error} Toca para reintentar.</Text>
          </TouchableOpacity>
        )}

        {vm.loading && vm.totalActive === 0 ? (
          <ActivityIndicator color={theme.colors.yellow} />
        ) : (
          <View style={styles.list}>
            {vm.missions.map((m) => (
              <MissionCard key={m.id} mission={m} onStart={handleStart} />
            ))}
            {!vm.error && vm.missions.length === 0 && (
              <View style={shared.card}>
                <Text style={shared.centerText}>No hay misiones de este tipo. Crea una con el botón +.</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={shared.secondaryButton}
          onPress={() => router.push("/area1_jugabilidad/misiones/historial")}
          accessibilityRole="button"
        >
          <PixelIcon name="calendar" size={16} color={theme.colors.textPrimary} />
          <Text style={shared.secondaryButtonText}>Ver historial</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav activeTab="flag" />

      <NewMissionModal
        visible={vm.isFormOpen}
        draft={vm.draft}
        reward={vm.draftReward}
        error={vm.formError}
        saving={vm.saving}
        onChange={vm.updateDraft}
        onSubmit={vm.submitDraft}
        onClose={vm.closeForm}
      />
    </SafeAreaView>
  );
}
