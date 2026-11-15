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
// Claves válidas: usuarios, tamagotchi, vestidor, misiones, tienda, animo
export type ApiModule = "usuarios" | "tamagotchi" | "vestidor" | "misiones" | "tienda" | "animo";

const connected = (process.env.EXPO_PUBLIC_API_MODULES ?? "")
  .split(",")
  .map((m) => m.trim().toLowerCase())
  .filter(Boolean);

// true si el módulo ya está conectado al backend ("todos" conecta todo)
export const usesApi = (module: ApiModule) => connected.includes("todos") || connected.includes(module);
