import { useState } from "react";

import { isValidPassword, PASSWORD_RULES } from "@/constants/accountOptions";
import { AuthError, changePassword } from "@/services/authService";

// ViewModel de "Cambiar contraseña" (M01 · RDF025): pide la actual y aplica las reglas.

export function useChangePasswordViewModel() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== next;
  const canSave = current.length > 0 && isValidPassword(next) && confirm === next && next !== current && !saving;

  const save = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await changePassword(current, next);
      setDone(true);
    } catch (e) {
      setError(e instanceof AuthError ? e.message : "No se pudo cambiar la contraseña.");
    } finally {
      setSaving(false);
    }
  };

  return {
    current,
    setCurrent,
    next,
    setNext,
    confirm,
    setConfirm,
    visible,
    toggleVisible: () => setVisible((v) => !v),
    rules: PASSWORD_RULES.map((r) => ({ label: r.label, ok: r.test(next) })),
    mismatch,
    sameAsCurrent: next.length > 0 && next === current,
    canSave,
    saving,
    error,
    done,
    save,
  };
}
