import { useState } from "react";

import { isValidEmail } from "@/constants/accountOptions";
import { AuthError, sendPasswordReset } from "@/services/authService";

// ViewModel de Recuperar contraseña (M00 · RDF009).
// Firebase envía un correo con el enlace para crear una contraseña nueva.

export function useRecoverPasswordViewModel(initialEmail = "") {
  const [email, setEmail] = useState(initialEmail);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSend = isValidEmail(email) && !sending;

  const send = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      await sendPasswordReset(email);
      setSentTo(email.trim());
    } catch (e) {
      setError(e instanceof AuthError ? e.message : "No se pudo enviar el correo. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return { email, setEmail, sending, sentTo, error, canSend, send };
}
