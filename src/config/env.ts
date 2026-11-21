// Configuración de la app leída del archivo .env (ver .env.example).
// Es el ÚNICO lugar donde se lee process.env; el resto importa de aquí.

// URL base del backend (Node + Express), ya con /api/v1
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

// Usuario de prueba mientras no exista el inicio de sesión (M00).
// Se envía en el encabezado x-user-id; cuando haya login se usa el token JWT.
export const DEV_USER_ID = process.env.EXPO_PUBLIC_DEV_USER_ID ?? "u-1";

// Tiempo máximo de espera de una petición
export const API_TIMEOUT_MS = 10_000;

// Módulos que ya consumen la API real. Los que no estén en la lista usan datos simulados.
// Claves válidas: usuarios, tamagotchi, vestidor, habitos, misiones, tienda, logros, animo
export type ApiModule =
  | "usuarios"
  | "tamagotchi"
  | "vestidor"
  | "habitos"
  | "misiones"
  | "tienda"
  | "logros"
  | "animo";

const connected = (process.env.EXPO_PUBLIC_API_MODULES ?? "")
  .split(",")
  .map((m: string) => m.trim().toLowerCase())
  .filter(Boolean);

// Lista tal como está en el .env (se muestra en Ajustes › Servidor)
export const CONNECTED_MODULES = connected;

// true si el módulo ya está conectado al backend ("todos" conecta todo)
export const usesApi = (module: ApiModule) => connected.includes("todos") || connected.includes(module);

// ── Inicio de sesión (M00) ─────────────────────────────────────────────
// mock       → datos simulados y sesión ya iniciada con el usuario de prueba (por defecto).
//              La app abre directo en la Casa, como siempre.
// mock-login → datos simulados, pero empieza sin sesión para probar Login, Crear cuenta
//              y Bienvenida sin Firebase. Cuenta de prueba: yess@liferpg.mx / Prueba123
// firebase   → Firebase Authentication real (necesita las variables EXPO_PUBLIC_FIREBASE_*)
export type AuthMode = "mock" | "mock-login" | "firebase";

export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
};

// ID de cliente web de Google (Firebase › Authentication › Google › Configuración del SDK web)
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

const requestedMode = (process.env.EXPO_PUBLIC_AUTH_MODE ?? "mock").trim().toLowerCase();

// Sin las variables de Firebase no se puede usar el modo firebase: se cae a "mock"
export const AUTH_MODE: AuthMode =
  requestedMode === "firebase"
    ? FIREBASE_CONFIG.apiKey
      ? "firebase"
      : "mock"
    : requestedMode === "mock-login"
      ? "mock-login"
      : "mock";
