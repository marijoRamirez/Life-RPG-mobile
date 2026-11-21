// Opciones fijas del Módulo 2 (Hábitos). Las define Life-RPG, no el jugador (RDF032).

import type { Difficulty, Penalty, Weekday } from "@/models/Quest";

export const DIFFICULTY_META: Record<Difficulty, { label: string; reward: number }> = {
  facil: { label: "Fácil", reward: 10 },
  media: { label: "Media", reward: 20 },
  dificil: { label: "Difícil", reward: 40 },
};
export const DIFFICULTIES: Difficulty[] = ["facil", "media", "dificil"];

export const PENALTY_META: Record<Penalty, { label: string }> = {
  hp: { label: "−10 HP" },
  racha: { label: "Reiniciar racha" },
  puntos: { label: "−25 pts" },
};
export const PENALTIES: Penalty[] = ["hp", "racha", "puntos"];

export const WEEKDAYS: { key: Weekday; short: string; label: string }[] = [
  { key: 1, short: "L", label: "Lunes" },
  { key: 2, short: "M", label: "Martes" },
  { key: 3, short: "M", label: "Miércoles" },
  { key: 4, short: "J", label: "Jueves" },
  { key: 5, short: "V", label: "Viernes" },
  { key: 6, short: "S", label: "Sábado" },
  { key: 7, short: "D", label: "Domingo" },
];

export const FOCUS_MIN = 10;
export const FOCUS_MAX = 120;
export const FOCUS_STEP = 5;
export const FOCUS_DEFAULT = 30;
export const HABIT_NAME_MAX = 40;

// Hora de cierre del día: a esa hora se penalizan los hábitos no cumplidos (RDF030)
export const DAY_CLOSE_TIME = "23:59";
