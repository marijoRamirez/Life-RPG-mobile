import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, BackHandler } from "react-native";

import type { Habit } from "@/models/Quest";
import { announceAchievements } from "@/services/achievementEvents";
import { checkIn, getHabit } from "@/services/habitService";

// ViewModel del Modo concentración de un HÁBITO (M02 · RDF028): si el hábito tiene
// tiempo de enfoque, primero se completa el temporizador y solo entonces se marca.
// Igual que en Misiones (M03): salir de la app o pulsar «Rendirse» lo deja sin marcar.

export type HabitFocusStatus = "cargando" | "activa" | "terminada" | "fallida" | "error";

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};

export function useHabitFocusViewModel(habitId: string | undefined) {
  const [habit, setHabit] = useState<Habit | null>(null);
  const [status, setStatus] = useState<HabitFocusStatus>("cargando");
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [rewardText, setRewardText] = useState<string | null>(null);
  const [failText, setFailText] = useState<string | null>(null);
  const [giveUpOpen, setGiveUpOpen] = useState(false);
  const closingRef = useRef(false);

  useEffect(() => {
    if (!habitId) return;
    getHabit(habitId)
      .then((h) => {
        if (!h.focusMinutes) throw new Error("Este hábito no tiene tiempo de enfoque.");
        setHabit(h);
        setStartedAt(Date.now());
        setNow(Date.now());
        setStatus("activa");
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "No se pudo iniciar el modo concentración.");
        setStatus("error");
      });
  }, [habitId]);

  useEffect(() => {
    if (status !== "activa") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status]);

  const totalMs = (habit?.focusMinutes ?? 0) * 60_000;
  const elapsedMs = status === "activa" ? Math.min(totalMs, now - startedAt) : totalMs;
  const remainingMs = totalMs - elapsedMs;

  const fail = useCallback((reason: "rendicion" | "salio_app") => {
    if (closingRef.current) return;
    closingRef.current = true;
    setGiveUpOpen(false);
    setFailText(
      reason === "salio_app"
        ? "Saliste de la app antes de terminar. El hábito sigue sin marcar."
        : "Te rendiste. El hábito sigue sin marcar; puedes intentarlo otra vez hoy.",
    );
    setStatus("fallida");
  }, []);

  // Al terminar el tiempo se marca el hábito y se otorgan sus puntos
  const finish = useCallback(async () => {
    if (!habit || closingRef.current) return;
    closingRef.current = true;
    try {
      const result = await checkIn(habit.id);
      setRewardText(`+${result.pointsChange} puntos · +${result.xpChange} XP`);
      announceAchievements(result.unlockedAchievements);
      setStatus("terminada");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo marcar el hábito.");
      setStatus("error");
    }
  }, [habit]);

  useEffect(() => {
    if (status === "activa" && habit && remainingMs <= 0) void finish();
  }, [status, habit, remainingMs, finish]);

  // Salir de la app cuenta como rendirse
  useEffect(() => {
    if (status !== "activa") return;
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "background") fail("salio_app");
    });
    return () => sub.remove();
  }, [status, fail]);

  // Botón "atrás" de Android: pregunta antes de rendirse
  useEffect(() => {
    if (status !== "activa") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setGiveUpOpen(true);
      return true;
    });
    return () => sub.remove();
  }, [status]);

  return {
    habit,
    status,
    error,
    remainingLabel: clock(remainingMs),
    elapsedLabel: clock(elapsedMs),
    totalLabel: clock(totalMs),
    progress: totalMs ? elapsedMs / totalMs : 0,
    rewardText,
    failText,
    giveUpOpen,
    openGiveUp: () => setGiveUpOpen(true),
    closeGiveUp: () => setGiveUpOpen(false),
    giveUp: () => fail("rendicion"),
  };
}
