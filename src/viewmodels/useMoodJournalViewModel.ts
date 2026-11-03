import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { JournalEntry, MoodLog } from "@/models/MoodLog";
import {
  createJournalEntry,
  deleteJournalEntry,
  getJournalEntries,
  getTodayMoodLog,
  updateJournalEntry,
} from "@/services/moodService";
import { dateTimeLabel, dayLabel } from "./moodFormat";

// ViewModel de 6.3 Diario rápido (RF021).
// Crear, editar, compartir y eliminar entradas del diario.

export type JournalRow = JournalEntry & { dateText: string; preview: string };

const toRow = (e: JournalEntry): JournalRow => ({
  ...e,
  dateText: dayLabel(e.date),
  preview: e.text.length > 60 ? `${e.text.slice(0, 60)}…` : e.text,
});

export function useMoodJournalViewModel() {
  const [todayLog, setTodayLog] = useState<MoodLog | null>(null);
  const [entries, setEntries] = useState<JournalRow[]>([]);

  const [text, setText] = useState("");
  const [shared, setShared] = useState(false); // Privada por defecto (RDF076)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [log, list] = await Promise.all([getTodayMoodLog(), getJournalEntries()]);
      setTodayLog(log);
      setEntries(list.map(toRow));
    } catch {
      setError("No se pudo cargar tu diario.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga al volver (p. ej. después de registrar el ánimo de hoy)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Agrega la pregunta guía al texto para responderla
  const addPrompt = (prompt: string) =>
    setText((current) => (current.trim() ? `${current.trim()}\n${prompt} ` : `${prompt} `));

  const resetForm = () => {
    setText("");
    setShared(false);
    setEditingId(null);
  };

  const startEdit = (entry: JournalRow) => {
    setEditingId(entry.id);
    setText(entry.text);
    setShared(entry.shared);
    setNotice(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const updated = await updateJournalEntry(editingId, { text, shared });
        setEntries((list) => list.map((e) => (e.id === updated.id ? toRow(updated) : e)));
        setNotice("Entrada actualizada.");
      } else {
        const created = await createJournalEntry({ text, shared });
        setEntries((list) => [toRow(created), ...list]);
        setNotice("Entrada guardada.");
      }
      resetForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la entrada.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      await deleteJournalEntry(id);
      setEntries((list) => list.filter((e) => e.id !== id));
      if (editingId === id) resetForm();
      setNotice("Entrada eliminada.");
    } catch {
      setError("No se pudo eliminar la entrada.");
    }
  };

  return {
    headerDate: dateTimeLabel(new Date()),
    todayLog,
    entries,
    text,
    setText,
    shared,
    setShared,
    editingId,
    addPrompt,
    startEdit,
    cancelEdit: resetForm,
    save,
    remove,
    canSave: text.trim().length > 0 && !saving,
    loading,
    saving,
    error,
    notice,
  };
}