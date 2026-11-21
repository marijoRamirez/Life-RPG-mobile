import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/ui/BottomNav";
import { AddIcon, CalendarIcon, CheckIcon, EditIcon, FocusIcon } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import { habitStyles as styles, TYPE_COLOR } from "@/styles/habits.styles";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useHabitCheckinViewModel } from "@/viewmodels/useHabitCheckinViewModel";

// 2.1 Check-in interactivo (M02 · RF007)
export default function CheckinScreen() {
  const router = useRouter();
  const vm = useHabitCheckinViewModel();
  // Los hábitos con tiempo de enfoque pasan primero por el Modo concentración (RDF028)
  const press = (habit: (typeof vm.rows)[number]["habit"]) =>
    vm.needsFocus(habit)
      ? router.push({ pathname: "/area1_jugabilidad/habitos/enfoque", params: { id: habit.id } })
      : vm.toggle(habit);

  return (
    <SafeAreaView style={ui.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={ui.content}>
        <View style={ui.header}>
          <View style={{ gap: 2, flexShrink: 1 }}>
            <Text style={ui.subtitle}>{vm.dateText}</Text>
            <Text style={ui.title}>Hábitos de hoy</Text>
          </View>
          <TouchableOpacity
            style={ui.iconButton}
            onPress={() => router.push("/area1_jugabilidad/habitos/rachas")}
            accessibilityRole="button"
            accessibilityLabel="Calendario de rachas"
          >
            <CalendarIcon size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={[ui.card, styles.summary]}>
          <View style={styles.summaryRow}>
            <Text style={ui.label}>Cumplidos</Text>
            <Text style={styles.count}>{vm.countText}</Text>
          </View>
          <View style={ui.barTrack}>
            <View style={[ui.barFill, { width: vm.progress as `${number}%` }]} />
          </View>
          <View style={styles.petRow}>
            <Image source={vm.petImage} style={styles.pet} resizeMode="contain" />
            <Text style={styles.petText}>{vm.petMessage}</Text>
          </View>
        </View>

        {vm.notice && <Text style={ui.notice}>{vm.notice}</Text>}
        {vm.error && <Text style={ui.error}>{vm.error}</Text>}
        {vm.loading && <ActivityIndicator color={theme.colors.green} />}

        {vm.rows.map((row) => (
          <View key={row.habit.id} style={[ui.card, styles.row, row.habit.done && styles.rowDone]}>
            <TouchableOpacity
              style={[styles.check, row.habit.done && styles.checkDone]}
              onPress={() => press(row.habit)}
              disabled={row.busy}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: row.habit.done }}
              accessibilityLabel={row.title}
            >
              {row.busy ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : row.habit.done ? (
                <CheckIcon size={16} color={UI_COLORS.onAccent} />
              ) : vm.needsFocus(row.habit) ? (
                <FocusIcon size={14} color={UI_COLORS.muted} />
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowText} onPress={() => press(row.habit)} disabled={row.busy}>
              <Text style={[styles.rowTitle, row.habit.done && styles.rowTitleDone]} numberOfLines={1}>
                {row.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={[styles.typeDot, { backgroundColor: TYPE_COLOR[row.habit.pointType] }]} />
                <Text style={styles.rowMeta} numberOfLines={1}>
                  {row.meta}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.reward}>{row.reward}</Text>
              {row.streak > 0 && <Text style={styles.streakTag}>racha {row.streak}</Text>}
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => router.push({ pathname: "/area1_jugabilidad/habitos/creador", params: { id: row.habit.id } })}
              accessibilityRole="button"
              accessibilityLabel={`Editar ${row.title}`}
            >
              <EditIcon size={16} color={UI_COLORS.muted} />
            </TouchableOpacity>
          </View>
        ))}

        {vm.paused.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={ui.label}>En pausa</Text>
            {vm.paused.map((h) => (
              <TouchableOpacity
                key={h.id}
                style={[ui.card, styles.pausedRow]}
                onPress={() => router.push({ pathname: "/area1_jugabilidad/habitos/creador", params: { id: h.id } })}
                accessibilityRole="button"
              >
                <Text style={styles.rowMeta}>{h.name}</Text>
                <Text style={[styles.rowMeta, { color: theme.colors.textPrimary }]}>Reactivar</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={ui.secondaryButton}
          onPress={() => router.push("/area1_jugabilidad/habitos/creador")}
          accessibilityRole="button"
        >
          <AddIcon size={16} color={theme.colors.textPrimary} />
          <Text style={ui.secondaryButtonText}>Nuevo hábito</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav activeTab="check" />
    </SafeAreaView>
  );
}
