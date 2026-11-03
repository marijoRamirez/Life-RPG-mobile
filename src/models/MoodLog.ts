// Modelos del Módulo 6 (Estado de ánimo · Tracker).
// Solo definen la forma de los datos; no contienen lógica.

// Escala de ánimo: 1 muy mal, 2 mal, 3 normal, 4 bien, 5 genial (RDF068)
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

// Factores opcionales que influyeron en el día (RDF069)
export type MoodFactor =
  | "motivada"
  | "cansada"
  | "estres_escolar"
  | "tranquila"
  | "ansiosa"
  | "amigos";

export interface MoodLog {
  id: string;
  date: string; // Día del registro, AAAA-MM-DD
  createdAt: string; // ISO 8601
  mood: MoodLevel;
  energy: number; // 0 a 10
  factors: MoodFactor[];
}

export interface NewMoodLogInput {
  mood: MoodLevel;
  energy: number;
  factors: MoodFactor[];
}

// Respuesta al registrar: el +5 XP solo se otorga una vez al día
export interface MoodRegisterResult {
  log: MoodLog;
  xpAwarded: number;
}

// Recordatorio diario (RDF070)
export interface MoodReminder {
  enabled: boolean;
  time: string; // HH:mm, p. ej. "20:00"
}

// Privacidad del registro según Ajustes › Privacidad (RDF071)
export interface MoodPrivacy {
  visibleToViewers: boolean;
  viewersCount: number;
}

export type MoodPeriod = "semana" | "mes";

// Un punto de la serie diaria (RDF072). Null si ese día no hubo registro.
export interface MoodDayPoint {
  date: string; // AAAA-MM-DD
  mood: MoodLevel | null;
  energy: number | null;
}

// Resumen del periodo (RDF073) y patrón detectado (RDF074)
export interface MoodSummary {
  average: number | null;
  bestDate: string | null;
  worstDate: string | null;
  pattern: string;
}

export interface MoodTrend {
  period: MoodPeriod;
  from: string; // AAAA-MM-DD
  to: string; // AAAA-MM-DD
  points: MoodDayPoint[];
  summary: MoodSummary;
}

// Entrada del diario rápido (RDF075 a RDF078)
export interface JournalEntry {
  id: string;
  date: string; // AAAA-MM-DD
  createdAt: string; // ISO 8601
  text: string;
  mood: MoodLevel | null; // Ánimo del registro de ese día
  energy: number | null;
  shared: boolean; // Privada por defecto (RDF076)
}

export interface JournalEntryInput {
  text: string;
  shared: boolean;
}