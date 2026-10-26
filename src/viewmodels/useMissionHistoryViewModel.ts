import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { MissionHistoryEntry, MissionType, SessionOutcome } from "@/models/Mission";
import {
  confirmManualValidation,
  getMissionHistory,
  getSessionOutcome,
} from "@/services/missionService";

// ViewModel de 3.3 Validación e historial (RF012).
// Si llega un sessionId, primero se muestra la pantalla de victoria.

export type HistoryStatusFilter = "todas" | "completada" | "fallida";
export type HistoryTypeFilter = MissionType | "todos";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const pad = (n: number) => String(n).padStart(2, "0");

const formatWhen = (iso: string) => {
  const date = new Date(iso);
  const today = new Date();
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startOf(today) - startOf(date)) / 86_400_000);
  if (diffDays === 0) return `Hoy ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (diffDays === 1) return "Ayer";
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

const describe = (entry: MissionHistoryEntry) => {
  if (entry.status === "fallida") {
    return entry.failReason === "salio_app" ? "saliste de la app" : "te rendiste";
  }
  if (entry.validation === "bloqueo") return `bloqueo ${entry.durationMin} min`;
  return entry.validation === "smartwatch" ? "smartwatch" : "manual";
};

export type HistoryRow = MissionHistoryEntry & { whenLabel: string; detailLabel: string };

export function useMissionHistoryViewModel(sessionId: string | undefined) {
  const [entries, setEntries] = useState<MissionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilter>("todas");
  const [typeFilter, setTypeFilter] = useState<HistoryTypeFilter>("todos");

  const [outcome, setOutcome] = useState<SessionOutcome>();
  const [isVictoryOpen, setVictoryOpen] = useState(false);
  const [manualConfirmed, setManualConfirmed] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await getMissionHistory());
    } catch {
      setError("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  // RDF042: mostrar la victoria de la sesión recién terminada
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    getSessionOutcome(sessionId).then((found) => {
      if (cancelled || !found) return;
      setOutcome(found);
      setManualConfirmed(false);
      setVictoryOpen(true);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // RDF044: historial con filtros por estado y tipo
  const rows = useMemo<HistoryRow[]>(
    () =>
      entries
        .filter((e) => statusFilter === "todas" || e.status === statusFilter)
        .filter((e) => typeFilter === "todos" || e.type === typeFilter)
        .map((e) => ({ ...e, whenLabel: formatWhen(e.finishedAt), detailLabel: describe(e) })),
    [entries, statusFilter, typeFilter],
  );

  const summary = useMemo(
    () => ({
      completed: entries.filter((e) => e.status === "completada").length,
      failed: entries.filter((e) => e.status === "fallida").length,
      xp: entries.reduce((total, e) => total + e.reward.xp, 0),
    }),
    [entries],
  );

  // RDF043: validación manual cuando no hay smartwatch
  const claimManual = async () => {
    if (!outcome || !manualConfirmed) return;
    setClaiming(true);
    try {
      setOutcome(await confirmManualValidation(outcome.sessionId));
      await load();
    } finally {
      setClaiming(false);
    }
  };

  return {
    rows,
    summary,
    loading,
    error,
    reload: load,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    outcome,
    isVictoryOpen,
    dismissVictory: () => setVictoryOpen(false),
    manualConfirmed,
    toggleManualConfirmed: () => setManualConfirmed((v) => !v),
    claiming,
    claimManual,
  };
}
