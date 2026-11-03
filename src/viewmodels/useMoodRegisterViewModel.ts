import { useCallback, useEffect, useState } from "react";

import type { MoodFactor, MoodLevel, MoodPrivacy, MoodReminder } from "@/models/MoodLog";
import {
  getMoodPrivacy,
  getMoodReminder,
  getTodayMoodLog,
  registerMood,
} from "@/services/moodService";

// ViewModel de 6.1 Registro rápido (RF019).
// Maneja la selección de ánimo, energía y factores, y el envío del registro.

export function useMoodRegisterViewModel() {
  const [mood, setMood] = useState<MoodLevel | null>(null);
  const [energy, setEnergy] = useState(5);
  const [factors, setFactors] = useState<MoodFactor[]>([]);

  const [reminder, setReminder] = useState<MoodReminder | null>(null);
  const [privacy, setPrivacy] = useState<MoodPrivacy | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [today, rem, priv] = await Promise.all([
        getTodayMoodLog(),
        getMoodReminder(),
        getMoodPrivacy(),
      ]);
      setReminder(rem);
      setPrivacy(priv);
      // Si ya registró hoy, se precarga para poder corregirlo
      if (today) {
        setMood(today.mood);
        setEnergy(today.energy);
        setFactors(today.factors);
        setAlreadyRegistered(true);
      }
    } catch {
      setError("No se pudo cargar tu registro de hoy.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFactor = (factor: MoodFactor) =>
    setFactors((current) =>
      current.includes(factor) ? current.filter((f) => f !== factor) : [...current, factor],
    );

  const canSubmit = mood !== null && !saving;

  // Devuelve true si se guardó, para que la vista decida a dónde navegar
  const submit = async (): Promise<boolean> => {
    if (mood === null) {
      setError("Elige cómo te sientes antes de registrar.");
      return false;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await registerMood({ mood, energy, factors });
      setXpAwarded(result.xpAwarded);
      setAlreadyRegistered(true);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el registro.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    mood,
    setMood,
    energy,
    setEnergy,
    factors,
    toggleFactor,
    reminder,
    privacy,
    alreadyRegistered,
    loading,
    saving,
    error,
    xpAwarded,
    canSubmit,
    submit,
  };
}