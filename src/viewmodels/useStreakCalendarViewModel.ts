import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { DayStatus, Habit, StreakCalendar } from "@/models/Quest";
import { getHabits, getStreakCalendar } from "@/services/habitService";
import { addMonths, monthKey, monthTitle } from "./dateFormat";

// ViewModel del Calendario de rachas (M02 · RF009): mes a mes (RDF036), por hábito
// o de todos (RDF037), con racha actual y mejor racha (RDF038).

export type CalendarCell = { key: string; day: number | null; status: DayStatus | null; isToday: boolean };

export function useStreakCalendarViewModel() {
  const thisMonth = monthKey(new Date());
  const [month, setMonth] = useState(thisMonth);
  const [habitId, setHabitId] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [data, setData] = useState<StreakCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (m: string, h: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const [calendar, list] = await Promise.all([getStreakCalendar(m, h), getHabits()]);
      setData(calendar);
      setHabits(list.filter((x) => x.active));
    } catch {
      setError("No se pudo cargar el calendario.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(month, habitId);
    }, [load, month, habitId]),
  );

  // Celdas de la cuadrícula: huecos al inicio para que el día 1 caiga en su columna (L a D)
  const cells: CalendarCell[] = [];
  if (data) {
    const [y, m] = data.month.split("-").map(Number);
    const firstWeekday = (new Date(y, m - 1, 1).getDay() + 6) % 7; // 0 = lunes
    for (let i = 0; i < firstWeekday; i++) cells.push({ key: `e${i}`, day: null, status: null, isToday: false });
    const todayKey = new Date().toDateString();
    data.days.forEach((d, i) =>
      cells.push({
        key: d.date,
        day: i + 1,
        status: d.status,
        isToday: new Date(y, m - 1, i + 1).toDateString() === todayKey,
      }),
    );
  }

  return {
    monthTitle: monthTitle(month),
    canGoNext: month < thisMonth,
    previousMonth: () => setMonth((m) => addMonths(m, -1)),
    nextMonth: () => setMonth((m) => (m < thisMonth ? addMonths(m, 1) : m)),
    habitId,
    setHabitId,
    filters: [{ id: null as string | null, label: "Todos" }, ...habits.map((h) => ({ id: h.id as string | null, label: h.name }))],
    cells,
    currentStreak: data?.currentStreak ?? 0,
    bestStreak: data?.bestStreak ?? 0,
    completedText: data ? `${data.completedDays}/${data.scheduledDays}` : "–",
    byHabit: data?.byHabit ?? [],
    loading,
    error,
  };
}
