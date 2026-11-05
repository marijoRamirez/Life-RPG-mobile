// Constantes visuales y textos del Módulo 6 (Estado de ánimo).

import type { MoodFactor, MoodLevel } from "@/models/MoodLog";

export const MOOD_COLORS = {
  border: "#3A3A48",
  muted: "#9A9AAE",
  softText: "#C9C9D6",
  danger: "#FF6B5E",
  onAccent: "#12121A", // Texto sobre botones de color (contraste AA)
  greenShadow: "#2E7D32",
  energy: "#C9C9D6", // Línea punteada de energía en la gráfica
};

export const MOOD_LEVELS: MoodLevel[] = [1, 2, 3, 4, 5];

export const MOOD_META: Record<MoodLevel, { label: string; emoji: string }> = {
  1: { label: "Muy mal", emoji: "😣" },
  2: { label: "Mal", emoji: "🙁" },
  3: { label: "Normal", emoji: "😐" },
  4: { label: "Bien", emoji: "🙂" },
  5: { label: "Genial", emoji: "😄" },
};

export const MOOD_FACTORS: { key: MoodFactor; label: string }[] = [
  { key: "motivada", label: "Motivada" },
  { key: "cansada", label: "Cansada" },
  { key: "estres_escolar", label: "Estrés escolar" },
  { key: "tranquila", label: "Tranquila" },
  { key: "ansiosa", label: "Ansiosa" },
  { key: "amigos", label: "Salí con amigos" },
];

export const ENERGY_MAX = 10;
export const MOOD_XP_REWARD = 5;

// Preguntas guía del diario (RDF075)
export const JOURNAL_PROMPTS = ["¿Qué te hizo sonreír?", "¿Qué te costó trabajo?"];