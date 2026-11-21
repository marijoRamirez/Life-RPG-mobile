import { AUTH_MODE } from "@/config/env";
import type { AuthUser } from "@/models/Account";
import { setAuthTokenProvider } from "./apiClient";
import type * as FirebaseImpl from "./firebase/authFirebase";
import * as mock from "./mocks/authMock";
import { setSessionUserId } from "./session";

// Servicio de inicio de sesión (M00). Elige Firebase o el modo de prueba según
// EXPO_PUBLIC_AUTH_MODE (ver config/env.ts). Las pantallas no saben cuál se usa.
// Firebase solo se carga en modo "firebase"; en los modos de prueba no se toca.

type Gateway = typeof mock;
// Comprobación de tipos: Firebase debe tener las mismas funciones que el modo de prueba
// (import type: no carga Firebase).
type SameShape<T extends Gateway> = T;
export type FirebaseGateway = SameShape<typeof FirebaseImpl>;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const impl: Gateway = AUTH_MODE === "firebase" ? require("./firebase/authFirebase") : mock;

export { AuthError } from "./authErrors";

export const googleSupported = impl.googleSupported;

// Avisa cada vez que cambia la sesión (al abrir la app, al entrar y al salir)
export const observeAuth = (callback: (user: AuthUser | null) => void) =>
  AUTH_MODE === "mock" ? mock.observeAuth(callback, true) : impl.observeAuth(callback);

// Deja lista la sesión para las siguientes peticiones en cuanto alguien entra
// (sin esperar el aviso de observeAuth, que puede llegar un instante después)
const adopt = async (promise: Promise<AuthUser>) => {
  const user = await promise;
  setSessionUserId(user.uid);
  setAuthTokenProvider(impl.getIdToken);
  return user;
};

// RDF006 · iniciarSesion
export const signInWithEmail = (email: string, password: string) => adopt(impl.signInWithEmail(email, password));
// RDF001 · agregarUsuario (parte de autenticación)
export const signUpWithEmail = (email: string, password: string) => adopt(impl.signUpWithEmail(email, password));
export const signInWithGoogle = () => adopt(impl.signInWithGoogle());
// Contraseña para quien entró con Google (ruta B)
export const addPassword = (password: string) => impl.addPassword(password);
// RDF009 · recuperarContrasena (Firebase envía el correo)
export const sendPasswordReset = (email: string) => impl.sendPasswordReset(email);
// RDF008 · cerrarSesion
export const signOut = () => impl.signOut();
export const getIdToken = () => impl.getIdToken();
// RDF025 · cambiarContrasena
export const changePassword = (current: string, next: string) => impl.changePassword(current, next);
// RDF024 · cambiar correo (Firebase confirma con un enlace al correo nuevo)
export const changeEmail = (newEmail: string) => impl.changeEmail(newEmail);
