import { DIFFICULTY_META } from "@/constants/habitTypes";
import type {
  CheckInResult,
  DayStatus,
  Habit,
  NewHabitInput,
  StreakCalendar,
  TodayHabit,
  Weekday,
} from "@/models/Quest";
import { unlockAchievement } from "./achievementMock";
import { copy, dateKey, daysAgo, delay, isoWeekday, newId } from "./mockUtils";
import { addPoints } from "./userMock";

// Datos simulados del Módulo 2 (Hábitos diarios).
// Imitan lo que responde la API (docs/API.md) mientras el módulo no esté conectado.
//
// Racha global: días seguidos en los que se cumplió AL MENOS un hábito programado
// (un día "parcial" no la rompe; un día "fallido" sí). Por hábito: días seguidos cumpliéndolo.

const EVERY_DAY: Weekday[] = [1, 2, 3, 4, 5, 6, 7];

type StoredHabit = Omit<Habit, "streak" | "reward">;

let habits: StoredHabit[] = [
  { id: "h-1", name: "Meditar 10 min", pointType: "enfoque", difficulty: "facil", days: EVERY_DAY, focusMinutes: 10, penalty: "hp", active: true },
  { id: "h-2", name: "Leer 20 páginas", pointType: "cultura", difficulty: "media", days: EVERY_DAY, focusMinutes: null, penalty: "hp", active: true },
  { id: "h-3", name: "Entrenar fuerza 40 min", pointType: "fisico", difficulty: "dificil", days: EVERY_DAY, focusMinutes: null, penalty: "racha", active: true },
  { id: "h-4", name: "Caminar 8 000 pasos", pointType: "fisico", difficulty: "facil", days: EVERY_DAY, focusMinutes: null, penalty: "hp", active: true },
  { id: "h-5", name: "Estudiar inglés 30 min", pointType: "cultura", difficulty: "media", days: EVERY_DAY, focusMinutes: 30, penalty: "puntos", active: true },
  { id: "h-6", name: "Sin redes hasta mediodía", pointType: "enfoque", difficulty: "dificil", days: EVERY_DAY, focusMinutes: null, penalty: "hp", active: true },
  { id: "h-7", name: "Diario de gratitud", pointType: "cultura", difficulty: "facil", days: [1, 3, 5], focusMinutes: null, penalty: "hp", active: false },
];

// Historial: hábito → fechas cumplidas (AAAA-MM-DD) y hora del cumplimiento de hoy
const doneDates = new Map<string, Set<string>>(habits.map((h) => [h.id, new Set<string>()]));
const completedAt = new Map<string, string>();

// Historial de ~3 meses, fijo (no aleatorio) para que todos vean lo mismo.
// Rachas actuales: Meditar 12, Caminar 9, Leer 5… Los días 13, 35, 57 y 79 nadie cumplió
// nada: rompen la racha global (la mejor queda en 21 días, como en el mockup).
const BLANK_DAYS = new Set([13, 35, 57, 79]);
const SEED_STREAKS: Record<string, number> = { "h-1": 12, "h-2": 5, "h-3": 2, "h-4": 9, "h-5": 3, "h-6": 1 };
for (const h of habits) {
  const set = doneDates.get(h.id)!;
  const streak = SEED_STREAKS[h.id] ?? 0;
  for (let d = 1; d <= 95; d++) {
    const date = daysAgo(d);
    if (!h.days.includes(isoWeekday(date))) continue;
    const pattern = (d * 7 + Number(h.id.slice(2)) * 3) % 10 < 7; // ~70 % de los días
    if (d <= streak || (d > streak + 1 && !BLANK_DAYS.has(d) && pattern)) set.add(dateKey(date));
  }
}
// Hoy: ya marcó Meditar, Leer y Caminar (3 de 6, como en el mockup)
const todayKey = () => dateKey(new Date());
for (const id of ["h-1", "h-2", "h-4"]) {
  doneDates.get(id)!.add(todayKey());
  completedAt.set(id, new Date(new Date().setHours(8, 15, 0, 0)).toISOString());
}

const isScheduled = (h: StoredHabit, date: Date) => h.active && h.days.includes(isoWeekday(date));

// Días seguidos cumpliendo un hábito (hoy cuenta solo si ya lo cumplió)
function habitStreak(h: StoredHabit): number {
  const set = doneDates.get(h.id)!;
  let streak = 0;
  for (let d = set.has(dateKey(new Date())) ? 0 : 1; d < 400; d++) {
    const date = daysAgo(d);
    if (!h.days.includes(isoWeekday(date))) continue; // Los días que no le tocaba no rompen la racha
    if (!set.has(dateKey(date))) break;
    streak++;
  }
  return streak;
}

const withComputed = (h: StoredHabit): Habit => ({ ...h, reward: DIFFICULTY_META[h.difficulty].reward, streak: habitStreak(h) });

const toToday = (h: StoredHabit): TodayHabit => ({
  ...withComputed(h),
  done: doneDates.get(h.id)!.has(todayKey()),
  completedAt: completedAt.get(h.id) ?? null,
});

function dayStatus(date: Date): DayStatus {
  if (date > new Date()) return "futuro";
  const scheduled = habits.filter((h) => isScheduled(h, date) || doneDates.get(h.id)!.has(dateKey(date)));
  if (scheduled.length === 0) return "sin_habitos";
  const done = scheduled.filter((h) => doneDates.get(h.id)!.has(dateKey(date))).length;
  if (done === scheduled.length) return "completo";
  return done > 0 ? "parcial" : "fallido";
}

// Un día suma a la racha global si cumplió al menos un hábito
function globalStreaks(filter: (h: StoredHabit) => boolean) {
  const dayOk = (date: Date) => habits.filter(filter).some((h) => doneDates.get(h.id)!.has(dateKey(date)));
  let current = 0;
  for (let d = dayOk(new Date()) ? 0 : 1; d < 400 && dayOk(daysAgo(d)); d++) current++;
  let best = 0;
  let run = 0;
  for (let d = 400; d >= 0; d--) {
    run = dayOk(daysAgo(d)) ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return { current, best: Math.max(best, current) };
}

// GET /habitos/hoy — RDF027 · los programados para hoy según su frecuencia
export function getTodayHabits(): Promise<TodayHabit[]> {
  return delay(habits.filter((h) => isScheduled(h, new Date())).map(toToday));
}

// GET /habitos — todos, incluidos los pausados
export function getHabits(): Promise<Habit[]> {
  return delay(habits.map(withComputed));
}

// GET /habitos/:id
export function getHabit(id: string): Promise<Habit> {
  const habit = habits.find((h) => h.id === id);
  return habit ? delay(withComputed(habit)) : Promise.reject(new Error("El hábito ya no existe."));
}

function validate(input: NewHabitInput): string | null {
  if (!input.name.trim()) return "Escribe el nombre del hábito.";
  if (input.days.length === 0) return "Elige al menos un día.";
  return null;
}

// POST /habitos — RDF031 · agregarHabito
export function createHabit(input: NewHabitInput): Promise<Habit> {
  const problem = validate(input);
  if (problem) return Promise.reject(new Error(problem));
  const habit: StoredHabit = { id: newId("h"), ...input, name: input.name.trim(), active: true };
  habits = [...habits, habit];
  doneDates.set(habit.id, new Set());
  return delay(withComputed(habit));
}

// PUT /habitos/:id — RDF034 · actualizarHabito (en el servidor aplica desde mañana)
export function updateHabit(id: string, input: NewHabitInput): Promise<Habit> {
  const problem = validate(input);
  if (problem) return Promise.reject(new Error(problem));
  habits = habits.map((h) => (h.id === id ? { ...h, ...input, name: input.name.trim() } : h));
  return getHabit(id);
}

// PATCH /habitos/:id — RDF035 · archivarHabito (pausar o reactivar; conserva su historial)
export function setHabitActive(id: string, active: boolean): Promise<Habit> {
  habits = habits.map((h) => (h.id === id ? { ...h, active } : h));
  return getHabit(id);
}

// POST /habitos/:id/checkin — RDF028 · completarHabito (una vez al día)
export function checkIn(id: string): Promise<CheckInResult> {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return Promise.reject(new Error("El hábito ya no existe."));
  const set = doneDates.get(id)!;
  if (set.has(todayKey())) return Promise.reject(new Error("Ya marcaste este hábito hoy."));
  set.add(todayKey());
  completedAt.set(id, new Date().toISOString());
  const reward = DIFFICULTY_META[habit.difficulty].reward;
  addPoints(habit.pointType, reward);

  // M05: completar todos los hábitos del día desbloquea "Día perfecto"
  const allDone = habits.filter((h) => isScheduled(h, new Date())).every((h) => doneDates.get(h.id)!.has(todayKey()));
  const unlocked = allDone ? unlockAchievement("a-dia-perfecto") : null;

  return delay({ habit: toToday(habit), xpChange: reward, pointsChange: reward, unlockedAchievements: unlocked ? [unlocked] : [] });
}

// DELETE /habitos/:id/checkin — RDF029 · deshacerCheckIn (solo el mismo día; resta la recompensa)
export function undoCheckIn(id: string): Promise<CheckInResult> {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return Promise.reject(new Error("El hábito ya no existe."));
  const set = doneDates.get(id)!;
  if (!set.has(todayKey())) return Promise.reject(new Error("Este hábito no estaba marcado hoy."));
  set.delete(todayKey());
  completedAt.delete(id);
  const reward = DIFFICULTY_META[habit.difficulty].reward;
  addPoints(habit.pointType, -reward);
  return delay({ habit: toToday(habit), xpChange: -reward, pointsChange: -reward, unlockedAchievements: [] });
}

// GET /habitos/rachas?mes=AAAA-MM[&habito=id] — RDF036 a RDF038
export function getStreakCalendar(month: string, habitId: string | null): Promise<StreakCalendar> {
  const [year, m] = month.split("-").map(Number);
  const daysInMonth = new Date(year, m, 0).getDate();
  const now = new Date();
  const only = habitId ? habits.filter((h) => h.id === habitId) : null;

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, m - 1, i + 1);
    let status: DayStatus;
    if (only) {
      const h = only[0];
      if (date > now) status = "futuro";
      else if (!h || !h.days.includes(isoWeekday(date))) status = "sin_habitos";
      else status = doneDates.get(h.id)!.has(dateKey(date)) ? "completo" : dateKey(date) === todayKey() ? "parcial" : "fallido";
    } else {
      status = dayStatus(date);
    }
    return { date: dateKey(date), status };
  });

  const past = days.filter((d) => d.status !== "futuro" && d.status !== "sin_habitos");
  const streaks = globalStreaks(only ? (h) => h.id === habitId : (h) => h.active);
  return delay(
    copy({
      month,
      habitId,
      days,
      completedDays: past.filter((d) => d.status === "completo").length,
      scheduledDays: past.length,
      currentStreak: streaks.current,
      bestStreak: streaks.best,
      byHabit: habits
        .filter((h) => h.active)
        .map((h) => ({ habitId: h.id, name: h.name, streak: habitStreak(h) }))
        .sort((a, b) => b.streak - a.streak),
    }),
  );
}
