// Modelos del Módulo 5 (Logros y progresión).
// Solo definen la forma de los datos; no contienen lógica.

import type { PixelIconName } from "@/components/ui/PixelIcons";
import type { PointType, Wallet } from "@/models/common";

export type Rarity = "comun" | "raro" | "epico" | "legendario";

// Área del juego que hace avanzar el logro; decide a qué pantalla lleva "Ir a…"
export type AchievementArea = "habitos" | "misiones" | "enfoque" | "tienda" | "animo";

export interface Achievement {
  id: string;
  name: string;
  description: string; // Condición para desbloquearlo (RDF063)
  icon: PixelIconName;
  rarity: Rarity;
  area: AchievementArea;
  current: number; // Avance actual (p. ej. 14)
  target: number; // Meta (p. ej. 20)
  unit: string; // "sesiones", "días", "libros"…
  conditions: string[]; // Reglas detalladas de la ficha
  unlockedAt: string | null; // ISO 8601; null = bloqueado (se ve en silueta)
  reward: { points: number; pointType: PointType; item: string | null } | null;
  claimed: boolean; // Recompensa ya acreditada (RDF064, una sola vez)
}

// Respuesta al reclamar la recompensa de un logro
export interface ClaimResult {
  achievement: Achievement;
  wallet: Wallet;
}

// RF018 · Tú vs. tú: mismo tramo de días del mes actual y del anterior (RDF065)
export interface MonthlyComparison {
  fromDay: number; // 1
  toDay: number; // Hoy (p. ej. 20)
  currentMonth: string; // "noviembre"
  previousMonth: string; // "octubre"
  metrics: {
    key: string;
    label: string;
    current: number;
    previous: number;
    decimals: number; // 0 para conteos, 1 para promedios u horas
  }[];
  dailyXp: { current: number[]; previous: number[] }; // XP acumulada por día del tramo
}
