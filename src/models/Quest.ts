// Modelos del Módulo 2 (Hábitos diarios · quests).
// Solo definen la forma de los datos; no contienen lógica.

import type { PointType } from "@/models/common";

export type Difficulty = "facil" | "media" | "dificil";

// Penalizaciones fijas definidas por Life-RPG (RDF032): −10 HP, reiniciar racha o −25 pts
export type Penalty = "hp" | "racha" | "puntos";

// Día de la semana: 1 lunes … 7 domingo (ISO 8601)
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Habit {
  id: string;
  name: string;
  pointType: PointType;
  difficulty: Difficulty;
  reward: number; // Puntos (y XP) por cumplirlo: fácil 10, media 20, difícil 40
  days: Weekday[]; // Frecuencia
  focusMinutes: number | null; // Tiempo de enfoque; null si no lo requiere
  penalty: Penalty;
  active: boolean; // false = pausado (RDF035): no genera pendientes ni penalizaciones
  streak: number; // Racha actual de este hábito
}

// Hábito programado para hoy con su estado (RDF027)
export interface TodayHabit extends Habit {
  done: boolean;
  completedAt: string | null; // ISO 8601
}

export interface NewHabitInput {
  name: string;
  pointType: PointType;
  difficulty: Difficulty;
  days: Weekday[];
  focusMinutes: number | null;
  penalty: Penalty;
}

// Respuesta al marcar (RDF028) o deshacer (RDF029) un hábito
export interface CheckInResult {
  habit: TodayHabit;
  xpChange: number; // +20 al marcar, −20 al deshacer
  pointsChange: number;
  unlockedAchievements: string[]; // Nombres de logros desbloqueados por este check-in (M05)
}

// Estado de un día en el calendario de rachas (RDF036)
export type DayStatus = "completo" | "parcial" | "fallido" | "sin_habitos" | "futuro";

export interface StreakCalendar {
  month: string; // AAAA-MM
  habitId: string | null; // null = todos los hábitos (RDF037)
  days: { date: string; status: DayStatus }[];
  completedDays: number; // Días completos del mes
  scheduledDays: number; // Días del mes que tenían hábitos (hasta hoy)
  currentStreak: number; // RDF038
  bestStreak: number;
  byHabit: { habitId: string; name: string; streak: number }[];
}
