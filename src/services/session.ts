// Quién tiene la sesión abierta en este momento. Lo actualiza el SessionProvider
// (viewmodels/SessionProvider.tsx) cada vez que alguien inicia o cierra sesión.
// Lo leen los datos simulados para saber de qué usuario son los datos.

import { DEV_USER_ID } from "@/config/env";

let currentUserId: string | null = null;

export function setSessionUserId(uid: string | null) {
  currentUserId = uid;
}

// Sin sesión se usa el usuario de prueba, igual que antes de existir el login
export const sessionUserId = () => currentUserId ?? DEV_USER_ID;
