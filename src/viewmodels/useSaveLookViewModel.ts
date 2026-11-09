import { useEffect, useState } from "react";

import type { LookSlots, SavedLook, WardrobeCategory } from "@/models/Wardrobe";
import { applySavedLook, getCurrentLook, getSavedLooks, LOOK_NAME_MAX, saveLook } from "@/services/wardrobeService";

// ViewModel de Guardar look (M01).

const SLOT_ORDER: WardrobeCategory[] = ["Cabeza", "Cara", "Cuerpo", "Fondo"];

export function useSaveLookViewModel() {
  const [lookName, setLookNameState] = useState("");
  const [slots, setSlots] = useState<LookSlots | null>(null);
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getCurrentLook(), getSavedLooks()])
      .then(([look, looks]) => {
        setLookNameState(look.name);
        setSlots(look.slots);
        setSavedLooks(looks);
      })
      .catch(() => setError("No se pudieron cargar tus looks."))
      .finally(() => setLoading(false));
  }, []);

  // Respeta el límite de caracteres al escribir
  const setLookName = (text: string) => {
    if (text.length <= LOOK_NAME_MAX) setLookNameState(text);
  };

  // Filas "Cabeza / Cara / Cuerpo / Fondo" ya listas para la vista
  const slotRows = slots ? SLOT_ORDER.map((label) => ({ label, value: slots[label] })) : [];

  // Devuelve true si se guardó, para que la vista regrese al vestidor
  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      setSavedLooks(await saveLook(lookName));
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el look.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const applyLook = async (id: number) => {
    setError(null);
    try {
      setSavedLooks(await applySavedLook(id));
    } catch {
      setError("No se pudo cambiar el look.");
    }
  };

  return {
    lookName,
    setLookName,
    nameMax: LOOK_NAME_MAX,
    slotRows,
    savedLooks,
    save,
    applyLook,
    canSave: lookName.trim().length > 0 && !saving,
    loading,
    saving,
    error,
  };
}
