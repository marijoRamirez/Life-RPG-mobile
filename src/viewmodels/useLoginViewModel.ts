import { useState } from "react";

import { AUTH_MODE } from "@/config/env";
import { isValidEmail } from "@/constants/accountOptions";
import { AuthError, googleSupported, signInWithEmail, signInWithGoogle } from "@/services/authService";

// ViewModel del Login (M00 · RDF006 iniciarSesion).
// Al entrar, el layout raíz lleva al jugador a donde le toca (Crear cuenta, Bienvenida o Casa).

export function useLoginViewModel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = isValidEmail(email) && password.length > 0 && busy === null;

  const run = async (kind: "email" | "google", action: () => Promise<unknown>) => {
    setBusy(kind);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof AuthError ? e.message : "No se pudo iniciar sesión. Intenta de nuevo.");
      setBusy(null);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    busy,
    error,
    canSubmit,
    signIn: () => canSubmit && run("email", () => signInWithEmail(email, password)),
    signInWithGoogle: () => busy === null && run("google", signInWithGoogle),
    googleSupported,
    // Solo en modo de prueba: recordatorio de la cuenta de prueba
    testAccountHint: AUTH_MODE === "mock-login" ? "Modo de prueba · yess@liferpg.mx / Prueba123 · Google entra como Valeria" : null,
  };
}
