import { MOOD_XP_REWARD } from "@/constants/moodTypes";
import type {
    JournalEntry,
    JournalEntryInput,
    MoodDayPoint,
    MoodLevel,
    MoodLog,
    MoodPeriod,
    MoodPrivacy,
    MoodRegisterResult,
    MoodReminder,
    MoodSummary,
    MoodTrend,
    NewMoodLogInput,
} from "@/models/MoodLog";

// Servicio del Módulo 6 (Estado de ánimo).
// Mientras no esté el backend, los datos viven en memoria y cada función
// simula su endpoint. Al conectar la API, sustituir el cuerpo de cada
// función por la petición indicada en su comentario usando apiClient.

const MOCK_LATENCY_MS = 250;

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));

let nextId = 100;
const newId = (prefix: string) => `${prefix}-${nextId++}`;

const pad = (n: number) => String(n).padStart(2, "0");

// Fecha local en formato AAAA-MM-DD
export const toDateKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const atHour = (d: Date, hour: number, minute = 0) => {
  const copy = new Date(d);
  copy.setHours(hour, minute, 0, 0);
  return copy.toISOString();
};

// Historial simulado de los últimos 34 días (sin registro de hoy, para poder probar el +5 XP)
const MOCK_SERIES: [MoodLevel, number][] = [
  [4, 6],
  [3, 5],
  [2, 3],
  [4, 7],
  [5, 8],
  [3, 4],
  [4, 6],
  [2, 2],
  [3, 5],
  [4, 6],
  [5, 9],
  [4, 7],
  [3, 4],
  [2, 3],
  [3, 5],
  [4, 7],
  [4, 6],
  [5, 8],
  [3, 5],
  [2, 4],
  [4, 6],
  [3, 4],
  [5, 9],
  [4, 7],
  [3, 5],
  [4, 6],
  [2, 3],
  [3, 5],
  [4, 6],
  [5, 8],
  [3, 4],
  [4, 7],
  [2, 2],
  [4, 6],
];

let logs: MoodLog[] = MOCK_SERIES.map(([mood, energy], i) => {
  const day = daysAgo(i + 1);
  return {
    id: `mood-${i + 1}`,
    date: toDateKey(day),
    createdAt: atHour(day, 21, 10),
    mood,
    energy,
    factors:
      mood >= 4 ? ["motivada"] : mood <= 2 ? ["cansada", "estres_escolar"] : [],
  };
});

let journal: JournalEntry[] = [
  {
    id: "j-1",
    date: toDateKey(daysAgo(1)),
    createdAt: atHour(daysAgo(1), 22, 5),
    text: "Día pesado, dormí poco y no me dio tiempo de entrenar.",
    mood: logs[0].mood,
    energy: logs[0].energy,
    shared: false,
  },
  {
    id: "j-2",
    date: toDateKey(daysAgo(2)),
    createdAt: atHour(daysAgo(2), 21, 40),
    text: "Buena clase de natación, cené con mi familia.",
    mood: logs[1].mood,
    energy: logs[1].energy,
    shared: true,
  },
];

let reminder: MoodReminder = { enabled: true, time: "20:00" };
const privacy: MoodPrivacy = { visibleToViewers: true, viewersCount: 2 };

// GET /api/v1/animo/hoy
export function getTodayMoodLog(): Promise<MoodLog | null> {
  const today = toDateKey(new Date());
  return delay(logs.find((l) => l.date === today) ?? null);
}

// RDF068 · registrarEstadoAnimo — POST /api/v1/animo
// Si ya hay registro hoy se actualiza y no se vuelve a dar XP.
export function registerMood(
  input: NewMoodLogInput,
): Promise<MoodRegisterResult> {
  if (input.energy < 0 || input.energy > 10) {
    return Promise.reject(new Error("La energía debe estar entre 0 y 10."));
  }
  const now = new Date();
  const today = toDateKey(now);
  const existing = logs.find((l) => l.date === today);

  if (existing) {
    const updated: MoodLog = {
      ...existing,
      ...input,
      createdAt: now.toISOString(),
    };
    logs = logs.map((l) => (l.id === existing.id ? updated : l));
    return delay({ log: updated, xpAwarded: 0 });
  }

  const log: MoodLog = {
    id: newId("mood"),
    date: today,
    createdAt: now.toISOString(),
    ...input,
  };
  logs = [log, ...logs];
  return delay({ log, xpAwarded: MOOD_XP_REWARD });
}

// RDF070 · programarRecordatorioAnimo — GET / PUT /api/v1/animo/recordatorio
export function getMoodReminder(): Promise<MoodReminder> {
  return delay({ ...reminder });
}

export function updateMoodReminder(next: MoodReminder): Promise<MoodReminder> {
  reminder = { ...next };
  return delay({ ...reminder });
}

// RDF071 · aplicarPrivacidadRegistro — GET /api/v1/usuarios/me/privacidad
export function getMoodPrivacy(): Promise<MoodPrivacy> {
  return delay({ ...privacy });
}

// RDF073 · calcularResumenAnimo y RDF074 · detectarPatronSemanal.
// En producción los calcula el servidor; aquí solo se imitan para el mock.
function summarize(points: MoodDayPoint[], period: MoodPeriod): MoodSummary {
  const withData = points.filter(
    (p): p is MoodDayPoint & { mood: MoodLevel; energy: number } =>
      p.mood !== null && p.energy !== null,
  );
  const word = period === "semana" ? "la semana" : "el mes";

  if (withData.length === 0) {
    return {
      average: null,
      bestDate: null,
      worstDate: null,
      pattern: `Aún no hay registros en ${word}.`,
    };
  }

  const average =
    withData.reduce((sum, p) => sum + p.mood, 0) / withData.length;
  const best = withData.reduce((a, b) =>
    b.mood > a.mood || (b.mood === a.mood && b.energy > a.energy) ? b : a,
  );
  const worst = withData.reduce((a, b) =>
    b.mood < a.mood || (b.mood === a.mood && b.energy < a.energy) ? b : a,
  );

  // Correlación entre ánimo y energía para describir el patrón
  let pattern = `Tu ánimo se mantuvo estable durante ${word}.`;
  if (withData.length >= 3) {
    const n = withData.length;
    const mx = average;
    const my = withData.reduce((s, p) => s + p.energy, 0) / n;
    let cov = 0;
    let vx = 0;
    let vy = 0;
    for (const p of withData) {
      cov += (p.mood - mx) * (p.energy - my);
      vx += (p.mood - mx) ** 2;
      vy += (p.energy - my) ** 2;
    }
    const r = vx && vy ? cov / Math.sqrt(vx * vy) : 0;
    if (r >= 0.5) {
      pattern =
        "Tu ánimo y tu energía se movieron juntos: los días con más energía también fueron los de mejor ánimo.";
    } else if (r <= -0.3) {
      pattern =
        "Tu ánimo y tu energía fueron en sentidos distintos: aunque tuviste poca pila, tu ánimo se sostuvo.";
    }
  }

  return {
    average: Math.round(average * 10) / 10,
    bestDate: best.date,
    worstDate: worst.date,
    pattern,
  };
}

// RDF072 · consultarTendenciaAnimo — GET /api/v1/animo/tendencia?periodo=semana|mes
export function getMoodTrend(period: MoodPeriod): Promise<MoodTrend> {
  // Semana: los últimos 7 días. Mes: los últimos 30 días. Ambos terminan hoy.
  const days = period === "semana" ? 7 : 30;
  const start = daysAgo(days - 1);

  const points: MoodDayPoint[] = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = toDateKey(d);
    const log = logs.find((l) => l.date === key);
    return { date: key, mood: log?.mood ?? null, energy: log?.energy ?? null };
  });

  return delay({
    period,
    from: points[0].date,
    to: points[points.length - 1].date,
    points,
    summary: summarize(points, period),
  });
}

// RDF077 · consultarEntradasDiario — GET /api/v1/animo/diario
export function getJournalEntries(): Promise<JournalEntry[]> {
  return delay(
    [...journal].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );
}

// RDF075 · agregarEntradaDiario — POST /api/v1/animo/diario
// La entrada queda ligada al registro de ánimo del día.
export function createJournalEntry(
  input: JournalEntryInput,
): Promise<JournalEntry> {
  if (!input.text.trim())
    return Promise.reject(new Error("Escribe algo antes de guardar."));
  const now = new Date();
  const today = toDateKey(now);
  const log = logs.find((l) => l.date === today);
  const entry: JournalEntry = {
    id: newId("j"),
    date: today,
    createdAt: now.toISOString(),
    text: input.text.trim(),
    mood: log?.mood ?? null,
    energy: log?.energy ?? null,
    shared: input.shared,
  };
  journal = [entry, ...journal];
  return delay(entry);
}

// RDF076 y RDF078 · actualizarEntradaDiario — PUT /api/v1/animo/diario/:id
export function updateJournalEntry(
  id: string,
  input: JournalEntryInput,
): Promise<JournalEntry> {
  const current = journal.find((e) => e.id === id);
  if (!current) return Promise.reject(new Error("La entrada ya no existe."));
  if (!input.text.trim())
    return Promise.reject(new Error("La entrada no puede quedar vacía."));
  const updated: JournalEntry = {
    ...current,
    text: input.text.trim(),
    shared: input.shared,
  };
  journal = journal.map((e) => (e.id === id ? updated : e));
  return delay(updated);
}

// RDF078 · actualizarEntradaDiario (eliminar) — DELETE /api/v1/animo/diario/:id
export function deleteJournalEntry(id: string): Promise<void> {
  journal = journal.filter((e) => e.id !== id);
  return delay(undefined);
}
