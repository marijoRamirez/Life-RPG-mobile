import { useEffect, useState } from "react";

import { DIFFICULTY_META, FOCUS_DEFAULT, FOCUS_MAX, FOCUS_MIN, FOCUS_STEP, HABIT_NAME_MAX } from "@/constants/habitTypes";
import type { PointType } from "@/models/common";
import type { Difficulty, Habit, NewHabitInput, Penalty, Weekday } from "@/models/Quest";
import { createHabit, getHabit, setHabitActive, updateHabit } from "@/services/habitService";

// ViewModel del Creador de hábitos (M02 · RF008). Con id edita (RDF034) y permite
// pausar o reactivar (RDF035); sin id crea uno nuevo (RDF031).

export function useHabitEditorViewModel(habitId: string | undefined, onDone: () => void) {
  const editing = Boolean(habitId);
  const [loaded, setLoaded] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(editing);
  const [name, setName] = useState("");
  const [pointType, setPointType] = useState<PointType>("enfoque");
  const [difficulty, setDifficulty] = useState<Difficulty>("media");
  const [days, setDays] = useState<Weekday[]>([1, 2, 3, 4, 5]);
  const [focusOn, setFocusOn] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState(FOCUS_DEFAULT);
  const [penalty, setPenalty] = useState<Penalty>("hp");
  const [focusAccepted, setFocusAccepted] = useState(false); // RDF033: aceptar la advertencia
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!habitId) return;
    getHabit(habitId)
      .then((h) => {
        setLoaded(h);
        setName(h.name);
        setPointType(h.pointType);
        setDifficulty(h.difficulty);
        setDays(h.days);
        setFocusOn(h.focusMinutes !== null);
        setFocusAccepted(h.focusMinutes !== null); // Ya la había aceptado al crearlo
        setFocusMinutes(h.focusMinutes ?? FOCUS_DEFAULT);
        setPenalty(h.penalty);
      })
      .catch(() => setError("No se pudo cargar el hábito."))
      .finally(() => setLoading(false));
  }, [habitId]);

  const toggleDay = (day: Weekday) =>
    setDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b),
    );

  const canSave = name.trim().length > 0 && days.length > 0 && (!focusOn || focusAccepted) && !saving;

  const run = async (action: () => Promise<unknown>) => {
    setSaving(true);
    setError(null);
    try {
      await action();
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el hábito.");
      setSaving(false);
    }
  };

  const save = () => {
    if (!canSave) return;
    const input: NewHabitInput = {
      name: name.trim(),
      pointType,
      difficulty,
      days,
      focusMinutes: focusOn ? focusMinutes : null,
      penalty,
    };
    run(() => (habitId ? updateHabit(habitId, input) : createHabit(input)));
  };

  return {
    editing,
    loading,
    title: editing ? "Editar hábito" : "Nueva misión diaria",
    name,
    setName: (v: string) => setName(v.slice(0, HABIT_NAME_MAX)),
    pointType,
    setPointType,
    difficulty,
    setDifficulty,
    reward: DIFFICULTY_META[difficulty].reward,
    days,
    toggleDay,
    focusOn,
    toggleFocus: () => setFocusOn((v) => !v),
    focusAccepted,
    toggleFocusAccepted: () => setFocusAccepted((v) => !v),
    focusMinutes,
    decreaseFocus: () => setFocusMinutes((m) => Math.max(FOCUS_MIN, m - FOCUS_STEP)),
    increaseFocus: () => setFocusMinutes((m) => Math.min(FOCUS_MAX, m + FOCUS_STEP)),
    penalty,
    setPenalty,
    canSave,
    saving,
    error,
    save,
    // Pausar / reactivar solo al editar
    isActive: loaded?.active ?? true,
    toggleActive: () => habitId && run(() => setHabitActive(habitId, !(loaded?.active ?? true))),
    editNote: editing ? "Los cambios aplican desde mañana; tu historial no cambia." : null,
  };
}
