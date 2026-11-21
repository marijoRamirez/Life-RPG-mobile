import { API_TIMEOUT_MS, DEV_USER_ID } from "@/config/env";
import { getApiUrl } from "./serverConfig";

// Cliente HTTP único de la app. Todos los servicios llaman al backend por aquí.
// Se encarga de: URL base, identificar al usuario, tiempo límite y errores.
// Contrato completo de la API: docs/API.md

// Error de la API con su código HTTP. El mensaje ya viene listo para mostrarse.
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number, // 0 = no hubo respuesta (sin red o tiempo agotado)
  ) {
    super(message);
    this.name = "ApiError";
  }
}

let authToken: string | null = null;
let tokenProvider: (() => Promise<string | null>) | null = null;

// Token fijo (opcional). Se mantiene por compatibilidad.
export function setAuthToken(token: string | null) {
  authToken = token;
}

// Lo registra la sesión (M00) con Firebase: entrega un token vigente en cada petición,
// porque el token de Firebase caduca cada hora y el SDK lo renueva solo.
export function setAuthTokenProvider(provider: (() => Promise<string | null>) | null) {
  tokenProvider = provider;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const token = authToken ?? (tokenProvider ? await tokenProvider().catch(() => null) : null);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let res: Response;
  try {
    // La dirección puede cambiarse en Ajustes › Servidor (RDF011)
    res = await fetch(`${getApiUrl()}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Con Firebase: token de la sesión. En modo de prueba: usuario de prueba.
        ...(token ? { Authorization: `Bearer ${token}` } : { "x-user-id": DEV_USER_ID }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Revisa tu conexión.", 0);
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // La respuesta no era JSON; se trata como error abajo si el código no es 2xx
  }

  if (!res.ok) {
    // Formato de error del contrato: { "error": "mensaje" }
    const message = (data as { error?: string } | null)?.error;
    throw new ApiError(message ?? `Error ${res.status} del servidor.`, res.status);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T = void>(path: string) => request<T>("DELETE", path),
};
