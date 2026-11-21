import type { AuthUser } from "@/models/Account";
import { AuthError } from "../authErrors";
import { delay } from "./mockUtils";

// Inicio de sesión SIMULADO (modos "mock" y "mock-login"). Mismas funciones que
// firebase/authFirebase.ts, para probar las pantallas sin Firebase.
//   Cuenta de prueba con cuenta completa: yess@liferpg.mx / Prueba123
//   "Continuar con Google" entra como Valeria Méndez, que aún no tiene cuenta del juego.

interface MockUser extends AuthUser {
  password: string | null;
}

const users = new Map<string, MockUser>([
  ["yess@liferpg.mx", { uid: "u-1", email: "yess@liferpg.mx", displayName: "Yess", provider: "password", password: "Prueba123" }],
]);

const GOOGLE_USER: MockUser = {
  uid: "g-valeria",
  email: "valeria.mendez@gmail.com",
  displayName: "Valeria Méndez",
  provider: "google",
  password: null,
};

let current: MockUser | null = null;
const listeners = new Set<(user: AuthUser | null) => void>();

const publicUser = (u: MockUser | null): AuthUser | null =>
  u && { uid: u.uid, email: u.email, displayName: u.displayName, provider: u.provider };

function setCurrent(user: MockUser | null) {
  current = user;
  listeners.forEach((l) => l(publicUser(user)));
}

let nextUid = 1;

export const googleSupported: boolean = true;

// startSignedIn: en modo "mock" la sesión ya está abierta con el usuario de prueba
export function observeAuth(callback: (user: AuthUser | null) => void, startSignedIn = false) {
  if (startSignedIn && !current) current = users.get("yess@liferpg.mx")!;
  listeners.add(callback);
  setTimeout(() => callback(publicUser(current)), 0);
  return () => {
    listeners.delete(callback);
  };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const user = users.get(email.trim().toLowerCase());
  await delay(null);
  if (!user || user.password !== password) throw new AuthError("El correo o la contraseña no son correctos.");
  setCurrent(user);
  return publicUser(user)!;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthUser> {
  const key = email.trim().toLowerCase();
  await delay(null);
  if (users.has(key)) throw new AuthError("Ya existe una cuenta con ese correo. Inicia sesión.");
  const user: MockUser = { uid: `m-${nextUid++}`, email: key, displayName: null, provider: "password", password };
  users.set(key, user);
  setCurrent(user);
  return publicUser(user)!;
}

export async function signInWithGoogle(): Promise<AuthUser> {
  await delay(null);
  users.set(GOOGLE_USER.email, users.get(GOOGLE_USER.email) ?? { ...GOOGLE_USER });
  const user = users.get(GOOGLE_USER.email)!;
  setCurrent(user);
  return publicUser(user)!;
}

export async function addPassword(password: string): Promise<void> {
  await delay(null);
  if (current) current.password = current.password ?? password;
}

export async function sendPasswordReset(email: string): Promise<void> {
  await delay(null);
  if (!email.trim()) throw new AuthError("Escribe tu correo.");
}

export async function signOut(): Promise<void> {
  await delay(null);
  setCurrent(null);
}

export async function changePassword(current: string, next: string): Promise<void> {
  await delay(null);
  if (!current || current !== currentPassword()) throw new AuthError("La contraseña actual no es correcta.");
  setPassword(next);
}

export async function changeEmail(newEmail: string): Promise<void> {
  await delay(null);
  if (!newEmail.trim()) throw new AuthError("Escribe un correo válido.");
}

const currentPassword = () => current?.password ?? null;
const setPassword = (value: string) => {
  if (current) current.password = value;
};

export const getIdToken = async (): Promise<string | null> => null; // Sin token: la API recibe x-user-id
