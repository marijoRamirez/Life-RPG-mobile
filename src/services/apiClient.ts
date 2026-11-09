// Cliente HTTP base que usan todos los servicios cuando se conecte el backend.
// Agrega la URL del servidor, el token de sesión y convierte los errores en excepciones.
// Mientras tanto, cada servicio trabaja con datos simulados (mock).

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

let authToken: string | null = null;

// Lo llama el módulo de autenticación (M00) al iniciar sesión
export function setAuthToken(token: string | null) {
  authToken = token;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiClient<T>(path: string, method: Method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Error ${res.status}`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}
