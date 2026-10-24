import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import type { Mission, MissionType, NewMissionInput } from "@/models/Mission";
import { createMission, getActiveMissions, previewReward } from "@/services/missionService";

// ViewModel de 3.1 Tablero de selección (RF010) y del formulario de nueva misión.

export type MissionFilter = MissionType | "todas";

const EMPTY_DRAFT: NewMissionInput = { title: "", type: "enfoque", durationMin: 50 };

export function useMissionBoardViewModel() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<MissionFilter>("todas");

  const [isFormOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<NewMissionInput>(EMPTY_DRAFT);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // RDF035: se recarga cada vez que la pantalla vuelve a tener foco
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setMissions(await getActiveMissions());
    } catch {
      setError("No se pudieron cargar las misiones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  // RDF036: filtro por tipo de actividad
  const visibleMissions = useMemo(
    () => (filter === "todas" ? missions : missions.filter((m) => m.type === filter)),
    [missions, filter],
  );

  const openForm = () => {
    setDraft(EMPTY_DRAFT);
    setFormError(null);
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);

  const updateDraft = (changes: Partial<NewMissionInput>) => {
    setDraft((d) => ({ ...d, ...changes }));
    setFormError(null);
  };

  // RDF037: crear misión única
  const submitDraft = async () => {
    if (!draft.title.trim()) {
      setFormError("Escribe un título para la misión.");
      return;
    }
    setSaving(true);
    try {
      const created = await createMission(draft);
      setMissions((prev) => [created, ...prev]);
      setFilter("todas");
      setFormOpen(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "No se pudo crear la misión.");
    } finally {
      setSaving(false);
    }
  };

  return {
    missions: visibleMissions,
    totalActive: missions.length,
    loading,
    error,
    reload: load,
    filter,
    setFilter,
    isFormOpen,
    openForm,
    closeForm,
    draft,
    updateDraft,
    // RDF038: vista previa de la recompensa que calcula el servidor
    draftReward: previewReward(draft.type, draft.durationMin),
    formError,
    saving,
    submitDraft,
  };
}
