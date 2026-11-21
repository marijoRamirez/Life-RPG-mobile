import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_MODE } from "@/config/env";
import type { Account, AccountChanges, NewAccountInput, PetSpecies } from "@/models/Account";
import type { PointType, Wallet } from "@/models/common";
import type { Attributes, PrivacySettings, UserProfile } from "@/models/UserProfile";
import { sessionUserId } from "../session";
import { delay } from "./mockUtils";
import { getTodayMoodLog } from "./moodMock";

// Datos simulados del usuario actual (compartidos por varios módulos).
// Imitan lo que responde la API (docs/API.md) mientras el módulo no esté conectado.
// Aquí vive la ÚNICA copia de los puntos: Casa, Tienda y Vestidor leen de aquí.

let wallet: Wallet = { cultura: 340, fisico: 210, enfoque: 480 };

// Avance (0 a 1) hacia la siguiente meta de cada tipo, para las barras de la Casa
const progress: Record<PointType, number> = { cultura: 0.7, fisico: 0.4, enfoque: 0.9 };

let privacy: PrivacySettings = { visibleToViewers: true, viewersCount: 2 };

// GET /usuarios/me
// hasMoodLogToday decide si se muestra la burbuja "¿Cómo te sientes hoy?" (RDF017)
export async function getUserProfile(): Promise<UserProfile> {
  const todayLog = await getTodayMoodLog();
  const account = (await loadAccounts())[sessionUserId()];
  return {
    id: sessionUserId(),
    displayName: account?.firstName ?? "Yess",
    hasMoodLogToday: todayLog !== null,
  };
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

// PUT /usuarios/me/privacidad — Ajustes › Privacidad (RDF071)
export function updatePrivacy(visibleToViewers: boolean): Promise<PrivacySettings> {
  privacy = { ...privacy, visibleToViewers };
  return delay({ ...privacy });
}

// ── Uso interno de otros mocks (en la API real esto lo hace el servidor) ──

export const peekPoints = (): Wallet => ({ ...wallet });

// Suma (o resta, con número negativo) puntos: check-in de hábitos y recompensas de logros
export function addPoints(type: PointType, amount: number): Wallet {
  wallet = { ...wallet, [type]: Math.max(0, wallet[type] + amount) };
  return { ...wallet };
}

export function spendPoints(type: PointType, amount: number): Wallet {
  wallet = { ...wallet, [type]: wallet[type] - amount };
  return { ...wallet };
}

// ── Cuenta del juego (M00) ─────────────────────────────────────────────
// La cuenta de prueba "u-1" (Yess) ya está completa. Las cuentas nuevas se guardan
// por uid. En modo "firebase" (sin backend todavía) se guardan en el teléfono para
// que la cuenta siga ahí al cerrar y abrir la app; en los modos de prueba, solo en memoria.

const STORAGE_KEY = "liferpg.mock.accounts";

let accounts: Record<string, Account> | null = null;

const SEED: Record<string, Account> = {
  "u-1": {
    id: "u-1",
    email: "yess@liferpg.mx",
    firstName: "Yess",
    lastName: "Ramírez",
    age: 21,
    gender: "mujer",
    goals: ["lectura", "enfoque"],
    customGoal: null,
    pet: "gato",
    photoUrl: null,
    petColor: "verde",
    createdAt: "2026-09-01T18:00:00.000Z",
  },
};

async function loadAccounts(): Promise<Record<string, Account>> {
  if (accounts) return accounts;
  let loaded: Record<string, Account> = { ...SEED };
  if (AUTH_MODE === "firebase") {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) loaded = { ...loaded, ...JSON.parse(saved) };
    } catch {
      // Sin almacenamiento disponible: se queda en memoria
    }
  }
  accounts = loaded;
  return loaded;
}

async function saveAccount(account: Account) {
  const all = await loadAccounts();
  all[account.id] = account;
  if (AUTH_MODE === "firebase") {
    const own = Object.fromEntries(Object.entries(all).filter(([id]) => !(id in SEED)));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(own)).catch(() => undefined);
  }
}

// GET /usuarios/me/cuenta
export async function getAccount(): Promise<Account | null> {
  const account = (await loadAccounts())[sessionUserId()];
  return delay(account ? { ...account } : null);
}

// POST /usuarios/me/cuenta
export async function createAccount(email: string, input: NewAccountInput): Promise<Account> {
  const existing = (await loadAccounts())[sessionUserId()];
  const account: Account = {
    id: sessionUserId(),
    email,
    ...input,
    pet: existing?.pet ?? null,
    photoUrl: existing?.photoUrl ?? null,
    petColor: existing?.petColor ?? "verde",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  await saveAccount(account);
  return delay({ ...account });
}

// PUT /usuarios/me/mascota
export async function choosePet(pet: PetSpecies): Promise<Account> {
  const account = (await loadAccounts())[sessionUserId()];
  if (!account) return Promise.reject(new Error("Primero crea tu cuenta."));
  if (account.pet) return Promise.reject(new Error("Ya elegiste a tu mascota."));
  const updated = { ...account, pet };
  await saveAccount(updated);
  return delay({ ...updated });
}

// PUT /usuarios/me/cuenta — Mi perfil (RDF024 y RDF026)
export async function updateAccount(changes: AccountChanges): Promise<Account> {
  const account = (await loadAccounts())[sessionUserId()];
  if (!account) return Promise.reject(new Error("Primero crea tu cuenta."));
  if (changes.firstName !== undefined && !changes.firstName.trim()) return Promise.reject(new Error("Escribe tu nombre."));
  if (changes.lastName !== undefined && !changes.lastName.trim()) return Promise.reject(new Error("Escribe tu apellido."));
  const updated = { ...account, ...changes };
  await saveAccount(updated);
  return delay({ ...updated });
}
