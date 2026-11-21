import { useState } from "react";

import { PET_OPTIONS } from "@/constants/petTypes";
import type { PetSpecies } from "@/models/Account";
import { choosePet } from "@/services/userService";
import { useSession } from "./SessionProvider";

// ViewModel de "Bienvenido a Life-RPG" (M00): el jugador elige su animal una sola vez
// por cuenta. Se guarda en la cuenta (backend), así que en otro celular ya no se pregunta.

export function useChoosePetViewModel() {
  const session = useSession();
  const [selected, setSelected] = useState<PetSpecies | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedOption = PET_OPTIONS.find((p) => p.key === selected) ?? null;

  const confirm = async () => {
    if (!selected || saving) return;
    setSaving(true);
    setError(null);
    try {
      await choosePet(selected);
      await session.refreshAccount(); // El layout lleva a la Casa
    } catch {
      setError("No se pudo guardar tu mascota. Intenta de nuevo.");
      setSaving(false);
    }
  };

  // Saludo según el género que eligió al crear la cuenta
  const name = session.account?.firstName ? `, ${session.account.firstName}` : "";
  const gender = session.account?.gender;
  const greeting =
    gender === "mujer"
      ? `¡Bienvenida a Life-RPG${name}!`
      : gender === "hombre"
        ? `¡Bienvenido a Life-RPG${name}!`
        : `¡Te damos la bienvenida a Life-RPG${name}!`;

  return {
    greeting,
    options: PET_OPTIONS,
    selected,
    selectedOption,
    select: setSelected,
    saving,
    error,
    confirm,
  };
}
