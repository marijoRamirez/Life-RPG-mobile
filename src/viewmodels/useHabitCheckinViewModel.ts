import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { DAY_CLOSE_TIME, DIFFICULTY_META } from "@/constants/habitTypes";
import { petImage } from "@/constants/petTypes";
import { POINT_META } from "@/constants/pointTypes";
import type { Habit, TodayHabit } from "@/models/Quest";
import { announceAchievements } from "@/services/achievementEvents";
import { checkIn, getHabits, getTodayHabits, undoCheckIn } from "@/services/habitService";
import { longDate } from "./dateFormat";
import { useSession } from "./SessionProvider";

// ViewModel del Check-in interactivo (M02 · RF007).
// Tocar un hábito lo marca (RDF028); tocarlo otra vez el mismo día lo deshace (RDF029).

export function useHabitCheckinViewModel() {
  const session = useSession();
  const [habits, setHabits] = useState<TodayHabit[]>([]);
  const [paused, setPaused] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [today, all] = await Promise.all([getTodayHabits(), getHabits()]);
      setHabits(today);
      setPaused(all.filter((h) => !h.active));
    } catch {
      setError("No se pudieron cargar tus hábitos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga al volver del creador
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const toggle = async (habit: TodayHabit) => {
    if (busyId) return;
    setBusyId(habit.id);
    setError(null);
    try {
      const result = habit.done ? await undoCheckIn(habit.id) : await checkIn(habit.id);
      setHabits((list) => list.map((h) => (h.id === habit.id ? result.habit : h)));
      const label = POINT_META[habit.pointType].label;
      setNotice(
        result.pointsChange >= 0
          ? `+${result.pointsChange} ${label} · +${result.xpChange} XP`
          : `Check-in deshecho · ${result.pointsChange} ${label}`,
      );
      announceAchievements(result.unlockedAchievements);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo registrar el hábito.");
    } finally {
      setBusyId(null);
    }
  };

  // RDF028: un hábito con tiempo de enfoque se marca al terminar su Modo concentración
  const needsFocus = (habit: TodayHabit) => !habit.done && habit.focusMinutes !== null;

  const done = habits.filter((h) => h.done).length;
  const remaining = habits.length - done;

  return {
    dateText: longDate(new Date()),
    countText: `${done}/${habits.length}`,
    progress: habits.length ? `${Math.round((done / habits.length) * 100)}%` : "0%",
    petMessage:
      habits.length === 0
        ? "Hoy no tienes hábitos programados. ¡Crea uno nuevo!"
        : remaining === 0
          ? "¡Cumpliste todo lo de hoy! Gracias por cuidarme."
          : `Te faltan ${remaining}. El día cierra a las ${DAY_CLOSE_TIME} y cada hábito fallido me quita HP.`,
    petImage: petImage(session.account?.pet),
    rows: habits.map((h) => ({
      habit: h,
      title: h.name,
      meta: [
        POINT_META[h.pointType].label,
        DIFFICULTY_META[h.difficulty].label,
        h.focusMinutes ? `${h.focusMinutes} min` : null,
      ]
        .filter(Boolean)
        .join(" · "),
      reward: `+${h.reward}`,
      streak: h.streak,
      busy: busyId === h.id,
    })),
    paused,
    loading,
    error,
    notice,
    toggle,
    needsFocus,
  };
}
