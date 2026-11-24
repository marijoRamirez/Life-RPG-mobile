import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  signOut as firebaseSignOut,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updatePassword,
  verifyBeforeUpdateEmail,
  type User,
} from "firebase/auth";

import type { AuthUser } from "@/models/Account";
import { AuthError } from "../authErrors";
import { firebaseAuth } from "./firebaseAuth";
import { signInWithGoogleCredential, signOutGoogle } from "./googleSignIn";

// Inicio de sesión con Firebase Authentication (modo "firebase").
// Mismas funciones que mocks/authMock.ts; authService.ts elige cuál usar.

// Códigos de Firebase → mensaje para el jugador
const MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "El correo o la contraseña no son correctos.",
  "auth/wrong-password": "El correo o la contraseña no son correctos.",
  "auth/user-not-found": "El correo o la contraseña no son correctos.",
  "auth/invalid-email": "Escribe un correo válido.",
  "auth/email-already-in-use":
    "Ya existe una cuenta con ese correo. Inicia sesión.",
  "auth/weak-password": "La contraseña es muy débil.",
  "auth/too-many-requests":
    "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
  "auth/network-request-failed": "No hay conexión. Revisa tu internet.",
  "auth/user-disabled": "Esta cuenta está desactivada.",
  "auth/operation-not-allowed":
    "Este método de inicio de sesión no está activado en Firebase.",
  "auth/popup-closed-by-user":
    "Cerraste la ventana de Google antes de terminar.",
  "auth/cancelled-popup-request":
    "Cerraste la ventana de Google antes de terminar.",
  "auth/popup-blocked":
    "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes.",
  "auth/credential-already-in-use": "Ese correo ya está ligado a otra cuenta.",
  "auth/requires-recent-login":
    "Por seguridad, vuelve a iniciar sesión e inténtalo otra vez.",
  "auth/email-already-exists": "Ese correo ya está en uso.",
};

const toAuthError = (error: unknown) => {
  const code = (error as { code?: string })?.code ?? "";
  return new AuthError(
    MESSAGES[code] ?? "No se pudo completar. Intenta de nuevo.",
  );
};

const toAuthUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email ?? "",
  displayName: user.displayName,
  provider: user.providerData.some((p) => p.providerId === "google.com")
    ? "google"
    : "password",
});

async function run<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    throw toAuthError(error);
  }
}

// Google funciona en web y en la app instalada (development build). En Expo Go
// googleSignIn.native.ts responde con un mensaje claro en vez de fallar.
export const googleSupported = true;

export function observeAuth(callback: (user: AuthUser | null) => void) {
  return onAuthStateChanged(firebaseAuth, (user) =>
    callback(user ? toAuthUser(user) : null),
  );
}

export const signInWithEmail = (email: string, password: string) =>
  run(async () =>
    toAuthUser(
      (await signInWithEmailAndPassword(firebaseAuth, email.trim(), password))
        .user,
    ),
  );

export const signUpWithEmail = (email: string, password: string) =>
  run(async () =>
    toAuthUser(
      (
        await createUserWithEmailAndPassword(
          firebaseAuth,
          email.trim(),
          password,
        )
      ).user,
    ),
  );

// Web: ventana emergente. Celular: librería nativa de Google (ver googleSignIn.native.ts)
export function signInWithGoogle(): Promise<AuthUser> {
  return run(async () => toAuthUser(await signInWithGoogleCredential()));
}

// Ruta B: quien entró con Google define también una contraseña, para poder entrar
// con su correo en otro celular. Liga la contraseña a la misma cuenta de Firebase.
export async function addPassword(password: string): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user?.email)
    throw new AuthError("Vuelve a iniciar sesión e inténtalo otra vez.");
  if (user.providerData.some((p) => p.providerId === "password")) return;
  await run(() =>
    linkWithCredential(
      user,
      EmailAuthProvider.credential(user.email!, password),
    ),
  );
}

export const sendPasswordReset = (email: string) =>
  run(() => sendPasswordResetEmail(firebaseAuth, email.trim()));

export const signOut = () =>
  run(async () => {
    await signOutGoogle();
    await firebaseSignOut(firebaseAuth);
  });

// Token vigente para la API (Authorization: Bearer). Firebase lo renueva solo.
export const getIdToken = async () =>
  firebaseAuth.currentUser ? firebaseAuth.currentUser.getIdToken() : null;

// RDF025 · cambiarContrasena: pide la actual (Firebase exige volver a autenticarse)
export async function changePassword(
  current: string,
  next: string,
): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user?.email)
    throw new AuthError("Vuelve a iniciar sesión e inténtalo otra vez.");
  await run(async () => {
    await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email!, current),
    );
    await updatePassword(user, next);
  });
}

// RDF024 · cambiar correo: Firebase envía un enlace al correo nuevo y lo cambia al confirmarlo
export async function changeEmail(newEmail: string): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user)
    throw new AuthError("Vuelve a iniciar sesión e inténtalo otra vez.");
  await run(() => verifyBeforeUpdateEmail(user, newEmail.trim()));
}
