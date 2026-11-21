import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import type { MoodReminder } from "@/models/MoodLog";

// Recordatorio diario de ánimo (M06 · RDF070). Versión CELULAR: programa una
// notificación local todos los días a la hora elegida. No usa push ni servidor.

export type ReminderResult = "scheduled" | "off" | "denied" | "unsupported";

const REMINDER_ID = "recordatorio-animo";

// Mostrar la notificación aunque la app esté abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function applyMoodReminder(reminder: MoodReminder): Promise<ReminderResult> {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => undefined);
  if (!reminder.enabled) return "off";

  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return "denied";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("recordatorios", {
      name: "Recordatorios",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const [hour, minute] = reminder.time.split(":").map(Number);
  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: { title: "¿Cómo te sientes hoy?", body: "Registra tu ánimo en Life-RPG y gana +5 XP." },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: "recordatorios" },
  });
  return "scheduled";
}
