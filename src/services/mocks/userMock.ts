import type { PointType, Wallet } from "@/models/common";
import type { Attributes, PrivacySettings, UserProfile } from "@/models/UserProfile";
import { delay } from "./mockUtils";
import { getTodayMoodLog } from "./moodMock";

// Datos simulados del usuario actual (compartidos por varios módulos).
// Imitan lo que responde la API (docs/API.md) mientras el módulo no esté conectado.
// Aquí vive la ÚNICA copia de los puntos: Casa, Tienda y Vestidor leen de aquí.

let wallet: Wallet = { cultura: 340, fisico: 210, enfoque: 480 };

// Avance (0 a 1) hacia la siguiente meta de cada tipo, para las barras de la Casa
const progress: Record<PointType, number> = { cultura: 0.7, fisico: 0.4, enfoque: 0.9 };

const privacy: PrivacySettings = { visibleToViewers: true, viewersCount: 2 };

// GET /usuarios/me
// hasMoodLogToday decide si se muestra la burbuja "¿Cómo te sientes hoy?" (RDF017)
export async function getUserProfile(): Promise<UserProfile> {
  const todayLog = await getTodayMoodLog();
  return { id: "u-1", displayName: "Yess", hasMoodLogToday: todayLog !== null };
}

// GET /usuarios/me/puntos
export function getPoints(): Promise<Wallet> {
  return delay({ ...wallet });
}

// GET /usuarios/me/atributos
export function getAttributes(): Promise<Attributes> {
  return delay({
    cultura: { value: wallet.cultura, progress: progress.cultura },
    fisico: { value: wallet.fisico, progress: progress.fisico },
    enfoque: { value: wallet.enfoque, progress: progress.enfoque },
  });
}

// GET /usuarios/me/privacidad (RDF071)
export function getPrivacy(): Promise<PrivacySettings> {
  return delay({ ...privacy });
}

// ── Uso interno de otros mocks (en la API real esto lo hace el servidor) ──

export const peekPoints = (): Wallet => ({ ...wallet });

export function spendPoints(type: PointType, amount: number): Wallet {
  wallet = { ...wallet, [type]: wallet[type] - amount };
  return { ...wallet };
}
