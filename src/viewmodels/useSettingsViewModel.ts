import { useEffect, useState } from "react";

import { AUTH_MODE, CONNECTED_MODULES } from "@/config/env";
import type { MoodReminder } from "@/models/MoodLog";
import type { PrivacySettings } from "@/models/UserProfile";
import { getMoodReminder, updateMoodReminder } from "@/services/moodService";
import { applyMoodReminder } from "@/services/notificationService";
import {
  defaultApiUrl,
  getApiUrl,
  isValidApiUrl,
  normalizeApiUrl,
  resetApiUrl,
  saveApiUrl,
  testServer,
} from "@/services/serverConfig";
import { getPrivacy, updatePrivacy } from "@/services/userService";
import { useSession } from "./SessionProvider";

// ViewModel de Ajustes: privacidad del ánimo (RDF071), recordatorio diario (RDF070)
// y cerrar sesión (RDF008).

const pad = (n: number) => String(n).padStart(2, "0");
const MINUTE_STEP = 15;

export function useSettingsViewModel() {
  const session = useSession();
  const [privacy, setPrivacy] = useState<PrivacySettings | null>(null);
  const [reminder, setReminder] = useState<MoodReminder | null>(null);
  const [savingReminder, setSavingReminder] = useState(false);
  const [reminderNotice, setReminderNotice] = useState<string | null>(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // RDF011: dirección del servidor (nube o red local)
  const [serverInput, setServerInput] = useState(getApiUrl());
  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [testingServer, setTestingServer] = useState(false);

  useEffect(() => {
    Promise.all([getPrivacy(), getMoodReminder()])
      .then(([p, r]) => {
        setPrivacy(p);
        setReminder(r);
      })
      .catch(() => setError("No se pudieron cargar tus ajustes."));
  }, []);

  const togglePrivacy = async (visible: boolean) => {
    if (!privacy) return;
    setPrivacy({ ...privacy, visibleToViewers: visible }); // Respuesta inmediata
    try {
      setPrivacy(await updatePrivacy(visible));
    } catch {
      setPrivacy(privacy);
      setError("No se pudo guardar tu privacidad.");
    }
  };

  const [hour, minute] = (reminder?.time ?? "20:00").split(":").map(Number);
  const setTime = (h: number, m: number) =>
    reminder && setReminder({ ...reminder, time: `${pad((h + 24) % 24)}:${pad((m + 60) % 60)}` });

  const saveReminder = async () => {
    if (!reminder || savingReminder) return;
    setSavingReminder(true);
    setReminderNotice(null);
    try {
      const saved = await updateMoodReminder(reminder);
      const result = await applyMoodReminder(saved).catch(() => "unsupported" as const);
      setReminderNotice(
        !saved.enabled
          ? "Recordatorio desactivado."
          : result === "scheduled"
            ? `Listo: te recordaremos todos los días a las ${saved.time}.`
            : result === "denied"
              ? "Hora guardada, pero el celular no dio permiso de notificaciones. Actívalo en los ajustes del teléfono."
              : `Hora guardada (${saved.time}). Las notificaciones solo funcionan en el celular.`,
      );
    } catch {
      setReminderNotice("No se pudo guardar el recordatorio.");
    } finally {
      setSavingReminder(false);
    }
  };

  const serverUrl = normalizeApiUrl(serverInput);
  const serverValid = isValidApiUrl(serverUrl);

  const checkServer = async () => {
    if (!serverValid) {
      setServerStatus("Escribe una dirección válida, p. ej. 192.168.0.10:3000");
      return;
    }
    setTestingServer(true);
    setServerStatus(null);
    const ok = await testServer(serverUrl);
    setServerStatus(ok ? `Conectado a ${serverUrl}` : `No hubo respuesta de ${serverUrl}. Revisa la IP, el puerto y que el backend esté encendido.`);
    setTestingServer(false);
  };

  const saveServer = async () => {
    if (!serverValid) {
      setServerStatus("Escribe una dirección válida, p. ej. 192.168.0.10:3000");
      return;
    }
    await saveApiUrl(serverUrl);
    setServerInput(serverUrl);
    setServerStatus(`Guardado. La app usará ${serverUrl}.`);
  };

  const resetServer = async () => {
    await resetApiUrl();
    setServerInput(defaultApiUrl);
    setServerStatus("Se restableció la dirección del archivo .env.");
  };

  return {
    serverInput,
    setServerInput,
    serverStatus,
    testingServer,
    checkServer,
    saveServer,
    resetServer,
    connectedText: CONNECTED_MODULES.length
      ? `Módulos conectados al backend: ${CONNECTED_MODULES.join(", ")}`
      : "Ningún módulo está conectado al backend todavía: la app usa datos simulados (EXPO_PUBLIC_API_MODULES).",
    email: session.user?.email ?? session.account?.email ?? "",
    privacy,
    togglePrivacy,
    reminder,
    setReminderEnabled: (enabled: boolean) => {
      if (reminder) setReminder({ ...reminder, enabled });
    },
    timeText: reminder?.time ?? "--:--",
    hourUp: () => setTime(hour + 1, minute),
    hourDown: () => setTime(hour - 1, minute),
    minuteUp: () => setTime(hour, minute + MINUTE_STEP - (minute % MINUTE_STEP)),
    minuteDown: () => setTime(hour, minute % MINUTE_STEP ? minute - (minute % MINUTE_STEP) : minute - MINUTE_STEP),
    saveReminder,
    savingReminder,
    reminderNotice,
    confirmSignOut,
    // Dos toques: el primero pide confirmación, el segundo cierra la sesión
    signOut: () => (confirmSignOut ? session.signOut() : setConfirmSignOut(true)),
    cancelSignOut: () => setConfirmSignOut(false),
    modeText:
      AUTH_MODE === "firebase" ? "Cuenta con Firebase" : "Modo de prueba (datos simulados, sin Firebase)",
    error,
  };
}
