import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "@/config/env";

// Dirección del servidor (M00 · RF003 · RDF011): URL pública en la nube o IP y puerto
// de una computadora de la red local (modo LAN). Se cambia en Ajustes › Servidor y se
// guarda en el teléfono; si no hay una guardada, se usa EXPO_PUBLIC_API_URL del .env.

const STORAGE_KEY = "liferpg.apiUrl";
const TEST_TIMEOUT_MS = 5000;

let apiUrl = API_URL;

export const getApiUrl = () => apiUrl;
export const defaultApiUrl = API_URL;

// "192.168.0.10:3000" → "http://192.168.0.10:3000/api/v1"
export function normalizeApiUrl(input: string): string {
  let url = input.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(url)) url = `http://${url}`;
  if (!/\/api\/v1$/i.test(url)) url = `${url}/api/v1`;
  return url;
}

export const isValidApiUrl = (url: string) => /^https?:\/\/[^\s/:]+(:\d{2,5})?(\/[^\s]*)?$/i.test(url);

// Se llama una vez al abrir la app, antes de cualquier petición
export async function loadServerConfig() {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) apiUrl = saved;
  } catch {
    // Sin almacenamiento: se queda la del .env
  }
}

export async function saveApiUrl(url: string) {
  apiUrl = url;
  await AsyncStorage.setItem(STORAGE_KEY, url).catch(() => undefined);
}

export async function resetApiUrl() {
  apiUrl = API_URL;
  await AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined);
}

// Prueba la conexión con GET /estado (el backend responde { "status": "ok" })
export async function testServer(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${url}/estado`, { signal: controller.signal });
    const data = (await res.json().catch(() => null)) as { status?: string } | null;
    return res.ok && data?.status === "ok";
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
