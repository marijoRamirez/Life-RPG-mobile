import type { MoodReminder } from "@/models/MoodLog";

// Recordatorio diario de ánimo (M06 · RDF070). Versión WEB: el navegador no programa
// notificaciones locales; la hora se guarda igual. En el celular se usa
// notificationService.native.ts.

export type ReminderResult = "scheduled" | "off" | "denied" | "unsupported";

export async function applyMoodReminder(_reminder: MoodReminder): Promise<ReminderResult> {
  return "unsupported";
}
