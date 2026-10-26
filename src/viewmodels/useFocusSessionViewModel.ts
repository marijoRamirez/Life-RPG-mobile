import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, BackHandler } from "react-native";

import type { FailReason, FocusSession, Mission, SessionOutcome } from "@/models/Mission";
import { failSession, finishSession, getMission, startSession } from "@/services/missionService";

// ViewModel de 3.2 Modo concentración (RF011).
//
// Bloqueo: mientras la sesión está activa se intercepta el botón "atrás" de
// Android y, en misiones de Enfoque, salir de la app marca la sesión como
// fallida (RDF040). Fijar la pantalla de verdad (Lock Task / Screen Pinning,
// RDF039) necesita un módulo nativo y un development build; no existe en Expo Go.

export type FocusStatus = "cargando" | "activa" | "terminada" | "fallida" | "error";

const pad = (n: number) => String(n).padStart(2, "0");

const formatClock = (ms: number) => {
  const totalSec = Math.ceil(ms / 1000);
  return `${pad(Math.floor(totalSec / 60))}:${pad(totalSec % 60)}`;
};

const formatHour = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function useFocusSessionViewModel(missionId: string | undefined) {
  const [mission, setMission] = useState<Mission>();
  const [session, setSession] = useState<FocusSession>();
  const [status, setStatus] = useState<FocusStatus>("cargando");
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [failReason, setFailReason] = useState<FailReason>();
  const [outcome, setOutcome] = useState<SessionOutcome>();
  const [isGiveUpOpen, setGiveUpOpen] = useState(false);

  const startedRef = useRef(false);
  const closingRef = useRef(false);

  // RDF039: iniciar la sesión al entrar a la pantalla
  useEffect(() => {
    if (!missionId || startedRef.current) return;
    startedRef.current = true;
    (async () => {
      try {
        const found = await getMission(missionId);
        if (!found) throw new Error("La misión ya no está activa.");
        const started = await startSession(found.id);
        setMission(found);
        setSession(started);
        setNow(Date.now());
        setStatus("activa");
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo iniciar la sesión.");
        setStatus("error");
      }
    })();
  }, [missionId]);

  useEffect(() => {
    if (status !== "activa") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status]);

  const totalMs = session ? session.durationMin * 60_000 : 0;
  const elapsedMs = session ? Math.min(totalMs, Math.max(0, now - Date.parse(session.startedAt))) : 0;
  const remainingMs = totalMs - elapsedMs;

  // RDF040: rendirse o salir de la app, sin puntos
  const fail = useCallback(
    async (reason: FailReason) => {
      if (!session || closingRef.current) return;
      closingRef.current = true;
      setGiveUpOpen(false);
      await failSession(session.id, reason);
      setFailReason(reason);
      setStatus("fallida");
    },
    [session],
  );

  // RDF041: al terminar el temporizador se registra la sesión y se otorgan los puntos
  const finish = useCallback(async () => {
    if (!session || closingRef.current) return;
    closingRef.current = true;
    try {
      setOutcome(await finishSession(session.id));
      setStatus("terminada");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo finalizar la sesión.");
      setStatus("error");
    }
  }, [session]);

  useEffect(() => {
    if (status === "activa" && session && remainingMs <= 0) void finish();
  }, [status, session, remainingMs, finish]);

  useEffect(() => {
    if (status !== "activa" || !session?.locksDevice) return;
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "background") void fail("salio_app");
    });
    return () => sub.remove();
  }, [status, session, fail]);

  useEffect(() => {
    if (status !== "activa") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setGiveUpOpen(true);
      return true;
    });
    return () => sub.remove();
  }, [status]);

  const endsAt = session ? new Date(Date.parse(session.startedAt) + totalMs) : undefined;

  return {
    mission,
    status,
    error,
    locksDevice: session?.locksDevice ?? false,
    remainingLabel: formatClock(remainingMs),
    elapsedLabel: formatClock(elapsedMs),
    totalLabel: session ? formatClock(totalMs) : "--:--",
    endsAtLabel: endsAt ? formatHour(endsAt) : "",
    progress: totalMs ? elapsedMs / totalMs : 0,
    failReason,
    outcome,
    isGiveUpOpen,
    openGiveUp: () => setGiveUpOpen(true),
    closeGiveUp: () => setGiveUpOpen(false),
    giveUp: () => fail("rendicion"),
    // Solo para pruebas en desarrollo: termina la sesión sin esperar
    finishNow: finish,
  };
}
