import type { Attributes, Tamagotchi } from "@/models/Tamagotchi";
import type { UserProfile } from "@/models/UserProfile";
import { getTodayMoodLog } from "@/services/moodService";

// Servicio de la Casa / HUD principal (Módulo 1).
// Mientras no esté el backend, los datos viven en memoria y cada función
// simula su endpoint. Al conectar la API, sustituir el cuerpo de cada
// función por la petición indicada en su comentario usando apiClient.

const MOCK_LATENCY_MS = 250;

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));

const tamagotchi: Tamagotchi = {
  name: "Susi Botitas",
  title: "Guardián del Enfoque",
  level: 14,
  xp: 1240,
  xpForNextLevel: 1800,
  hp: 82,
  hpMax: 100,
  habitat: "Hábitat del bosque",
};

const attributes: Attributes = {
  cultura: { value: 340, progress: 0.7 },
  fisico: { value: 210, progress: 0.4 },
  enfoque: { value: 480, progress: 0.9 },
};

// GET /api/v1/tamagotchi
export function getTamagotchi(): Promise<Tamagotchi> {
  return delay({ ...tamagotchi });
}

// GET /api/v1/usuarios/me/atributos
export function getAttributes(): Promise<Attributes> {
  return delay(JSON.parse(JSON.stringify(attributes)));
}

// GET /api/v1/usuarios/me
// hasMoodLogToday decide si se muestra la burbuja "¿Cómo te sientes hoy?" (RDF017)
export async function getUserProfile(): Promise<UserProfile> {
  const todayLog = await getTodayMoodLog();
  return { id: "u-1", displayName: "Yess", hasMoodLogToday: todayLog !== null };
}
