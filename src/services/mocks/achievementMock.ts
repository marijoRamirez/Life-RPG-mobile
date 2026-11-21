import type { Achievement, ClaimResult, MonthlyComparison } from "@/models/Achievement";
import { copy, delay } from "./mockUtils";
import { addPoints } from "./userMock";

// Datos simulados del Módulo 5 (Logros y progresión).
// Imitan lo que responde la API (docs/API.md) mientras el módulo no esté conectado.
// En el servidor, evaluarLogros (RDF061) revisa las condiciones tras cada evento;
// aquí solo "Día perfecto" se desbloquea en vivo al completar todos los hábitos de hoy.

const year = new Date().getFullYear();
const on = (month: number, day: number) => new Date(year, month - 1, day, 19, 30).toISOString();

let achievements: Achievement[] = [
  { id: "a-primera-racha", name: "Primera racha", description: "Cumple tus hábitos 3 días seguidos.", icon: "streak", rarity: "comun", area: "habitos", current: 3, target: 3, unit: "días", conditions: ["Al menos un hábito cumplido cada día", "3 días seguidos"], unlockedAt: on(3, 2), reward: { points: 50, pointType: "enfoque", item: null }, claimed: true },
  { id: "a-lector", name: "Lector voraz", description: "Cumple 30 veces un hábito de Cultura.", icon: "book-open", rarity: "raro", area: "habitos", current: 30, target: 30, unit: "veces", conditions: ["Hábitos de tipo Cultura", "30 cumplimientos en total"], unlockedAt: on(4, 18), reward: { points: 150, pointType: "cultura", item: null }, claimed: true },
  { id: "a-maratonista", name: "Maratonista", description: "Completa 10 misiones físicas.", icon: "dumbbell", rarity: "raro", area: "misiones", current: 10, target: 10, unit: "misiones", conditions: ["Misiones de tipo Física", "10 misiones completadas"], unlockedAt: on(6, 30), reward: { points: 150, pointType: "fisico", item: "Banda deportiva" }, claimed: true },
  { id: "a-madrugador", name: "Madrugador", description: "Marca un hábito antes de las 7:00 durante 5 días.", icon: "star", rarity: "comun", area: "habitos", current: 5, target: 5, unit: "días", conditions: ["Check-in antes de las 7:00", "5 días distintos"], unlockedAt: on(8, 12), reward: { points: 80, pointType: "fisico", item: null }, claimed: true },
  { id: "a-mente-clara", name: "Mente clara", description: "Registra tu ánimo 14 días seguidos.", icon: "heart", rarity: "raro", area: "animo", current: 14, target: 14, unit: "días", conditions: ["Un registro de ánimo por día", "14 días seguidos"], unlockedAt: on(9, 21), reward: { points: 120, pointType: "enfoque", item: null }, claimed: false },
  { id: "a-monje", name: "Monje digital", description: "Completa 20 sesiones de Modo concentración sin pulsar «Rendirse».", icon: "focus", rarity: "epico", area: "enfoque", current: 14, target: 20, unit: "sesiones", conditions: ["Sesiones de 25 min o más", "Sin pulsar «Rendirse»", "20 sesiones completas"], unlockedAt: null, reward: { points: 300, pointType: "enfoque", item: "Capucha de monje" }, claimed: false },
  { id: "a-explorador", name: "Explorador", description: "Visita 5 museos con misiones de Cultura.", icon: "flag", rarity: "raro", area: "misiones", current: 3, target: 5, unit: "museos", conditions: ["Misiones de Cultura con la palabra «museo»", "5 misiones completadas"], unlockedAt: null, reward: { points: 200, pointType: "cultura", item: null }, claimed: false },
  { id: "a-coleccionista", name: "Coleccionista", description: "Consigue 15 prendas para tu mascota.", icon: "clothes", rarity: "raro", area: "tienda", current: 9, target: 15, unit: "prendas", conditions: ["Prendas compradas, regaladas o ganadas", "15 prendas distintas"], unlockedAt: null, reward: { points: 150, pointType: "cultura", item: "Corona de sabio" }, claimed: false },
  { id: "a-imparable", name: "Imparable 30", description: "Mantén tu racha 30 días seguidos.", icon: "streak", rarity: "legendario", area: "habitos", current: 12, target: 30, unit: "días", conditions: ["Al menos un hábito cumplido cada día", "30 días seguidos"], unlockedAt: null, reward: { points: 500, pointType: "fisico", item: "Aura dorada" }, claimed: false },
  { id: "a-dia-perfecto", name: "Día perfecto", description: "Cumple todos tus hábitos del día.", icon: "check", rarity: "comun", area: "habitos", current: 3, target: 6, unit: "hábitos hoy", conditions: ["Todos los hábitos programados para hoy", "Antes del cierre de las 23:59"], unlockedAt: null, reward: { points: 60, pointType: "enfoque", item: null }, claimed: false },
  { id: "a-ahorrador", name: "Ahorrador", description: "Junta 1 000 puntos de un mismo tipo.", icon: "bag", rarity: "epico", area: "tienda", current: 480, target: 1000, unit: "puntos", conditions: ["Puntos de Cultura, Físicos o de Enfoque", "1 000 puntos de un solo tipo al mismo tiempo"], unlockedAt: null, reward: { points: 250, pointType: "cultura", item: null }, claimed: false },
  { id: "a-constancia", name: "Constancia", description: "Escribe 10 entradas en tu diario.", icon: "edit", rarity: "comun", area: "animo", current: 2, target: 10, unit: "entradas", conditions: ["Entradas del diario rápido", "10 entradas"], unlockedAt: null, reward: { points: 80, pointType: "cultura", item: null }, claimed: false },
];

// GET /logros — RDF060 · desbloqueados y bloqueados con su avance
export function getAchievements(): Promise<Achievement[]> {
  return delay(copy(achievements));
}

// GET /logros/:id — RDF063
export function getAchievement(id: string): Promise<Achievement> {
  const found = achievements.find((a) => a.id === id);
  return found ? delay(copy(found)) : Promise.reject(new Error("El logro no existe."));
}

// POST /logros/:id/reclamar — RDF064 · se acredita una sola vez
export function claimAchievement(id: string): Promise<ClaimResult> {
  const found = achievements.find((a) => a.id === id);
  if (!found) return Promise.reject(new Error("El logro no existe."));
  if (!found.unlockedAt) return Promise.reject(new Error("Todavía no desbloqueas este logro."));
  if (found.claimed) return Promise.reject(new Error("Ya reclamaste esta recompensa."));
  achievements = achievements.map((a) => (a.id === id ? { ...a, claimed: true } : a));
  const wallet = found.reward ? addPoints(found.reward.pointType, found.reward.points) : addPoints("cultura", 0);
  return delay({ achievement: copy({ ...found, claimed: true }), wallet });
}

// Uso interno de otros mocks (en el servidor lo hace evaluarLogros, RDF061).
// Devuelve el nombre del logro si se acaba de desbloquear, o null si ya lo estaba.
export function unlockAchievement(id: string): string | null {
  const found = achievements.find((a) => a.id === id);
  if (!found || found.unlockedAt) return null;
  achievements = achievements.map((a) =>
    a.id === id ? { ...a, current: a.target, unlockedAt: new Date().toISOString() } : a,
  );
  return found.name;
}

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// GET /progreso/comparativa — RDF065 y RDF066 (días 1 a hoy de este mes y del anterior)
export function getMonthlyComparison(): Promise<MonthlyComparison> {
  const now = new Date();
  const toDay = now.getDate();
  // XP por día con un patrón fijo; el mes actual va un poco mejor
  const perDay = (seed: number, base: number) =>
    Array.from({ length: toDay }, (_, i) => base + ((i * 37 + seed * 11) % 90));
  const accumulate = (values: number[]) => values.reduce<number[]>((acc, v) => [...acc, (acc.at(-1) ?? 0) + v], []);
  const current = accumulate(perDay(3, 130));
  const previous = accumulate(perDay(7, 105));
  return delay({
    fromDay: 1,
    toDay,
    currentMonth: MONTHS[now.getMonth()],
    previousMonth: MONTHS[(now.getMonth() + 11) % 12],
    metrics: [
      { key: "xp", label: "XP ganada", current: current.at(-1) ?? 0, previous: previous.at(-1) ?? 0, decimals: 0 },
      { key: "misiones", label: "Misiones completadas", current: 11, previous: 9, decimals: 0 },
      { key: "enfoque", label: "Horas de enfoque", current: 9.5, previous: 6, decimals: 1 },
      { key: "racha", label: "Racha máxima (días)", current: 12, previous: 9, decimals: 0 },
      { key: "habitos", label: "Hábitos cumplidos", current: 74, previous: 81, decimals: 0 },
      { key: "animo", label: "Ánimo promedio", current: 3.8, previous: 3.4, decimals: 1 },
    ],
    dailyXp: { current, previous },
  });
}
