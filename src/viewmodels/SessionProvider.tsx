import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Account, AuthUser } from "@/models/Account";
import { setAuthTokenProvider } from "@/services/apiClient";
import { getIdToken, observeAuth, signOut as authSignOut } from "@/services/authService";
import { loadServerConfig } from "@/services/serverConfig";
import { setSessionUserId } from "@/services/session";
import { getAccount } from "@/services/userService";

// Sesión del jugador (M00). Es el único lugar que sabe si hay alguien dentro y en qué
// paso va. El layout raíz (app/_layout.tsx) lo usa para decidir qué pantalla mostrar:
//
//   loading      → revisando la sesión guardada (se queda la pantalla de carga)
//   signedOut    → nadie dentro: Login, Crear cuenta (con correo) o Recuperar contraseña
//   needsAccount → entró con Firebase pero no ha llenado "Crear cuenta"
//   needsPet     → ya tiene cuenta, falta elegir su animal ("Bienvenido a Life-RPG")
//   ready        → todo listo: la app normal
//
// La sesión se guarda en el teléfono: al abrir la app de nuevo ya entra directo.
export type SessionStatus = "loading" | "signedOut" | "needsAccount" | "needsPet" | "ready";

interface SessionValue {
  status: SessionStatus;
  user: AuthUser | null;
  account: Account | null;
  error: string | null; // No se pudo leer la cuenta (p. ej. sin conexión)
  refreshAccount: () => Promise<void>; // Volver a leer la cuenta tras crearla o elegir mascota
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccount = useCallback(async () => {
    setError(null);
    try {
      setAccount(await getAccount());
    } catch {
      setAccount(null);
      setError("No se pudo cargar tu cuenta. Revisa tu conexión.");
    }
  }, []);

  useEffect(() => {
    // Primero la dirección del servidor guardada (RDF011); luego la sesión.
    // Usuario y cuenta se actualizan juntos, para que ninguna pantalla vea un paso intermedio.
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    loadServerConfig().then(() => {
      if (cancelled) return;
      unsubscribe = observeAuth(async (next) => {
      setSessionUserId(next?.uid ?? null);
      setAuthTokenProvider(next ? getIdToken : null);
      let nextAccount: Account | null = null;
      let nextError: string | null = null;
      if (next) {
        try {
          nextAccount = await getAccount();
        } catch {
          nextError = "No se pudo cargar tu cuenta. Revisa tu conexión.";
        }
      }
      setUser(next);
      setAccount(nextAccount);
      setError(nextError);
      setChecking(false);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signOut = useCallback(async () => {
    await authSignOut();
  }, []);

  const status: SessionStatus = checking
    ? "loading"
    : !user
      ? "signedOut"
      : !account
        ? "needsAccount"
        : !account.pet
          ? "needsPet"
          : "ready";

  const value = useMemo(
    () => ({ status, user, account, error, refreshAccount: loadAccount, signOut }),
    [status, user, account, error, loadAccount, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession debe usarse dentro de <SessionProvider>.");
  return value;
}
