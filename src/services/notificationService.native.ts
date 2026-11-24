import { Platform } from "react-native";

import type { MoodReminder } from "@/models/MoodLog";

// Recordatorio diario de ánimo (M06 · RDF070). Versión CELULAR: programa una
// notificación local todos los días a la hora elegida. No usa push ni servidor.
//
// expo-notifications se carga bajo demanda y no con un import arriba: en Expo Go
// (Android) no viene el módulo nativo "ExpoApplication" que necesita, y como
// Expo Router carga todas las pantallas al iniciar, un import directo tumbaba
// toda la app. Si el módulo no está disponible devolvemos "unsupported".

export type ReminderResult = "scheduled" | "off" | "denied" | "unsupported";

type NotificationsModule = typeof import("expo-notifications");

const REMINDER_ID = "recordatorio-animo";

let notifications: NotificationsModule | null | undefined;

function getNotifications(): NotificationsModule | null {
  if (notifications !== undefined) return notifications;
  try {
    const mod: NotificationsModule = require("expo-notifications");
    // Mostrar la notificación aunque la app esté abierta
    mod.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    notifications = mod;
  } catch (error) {
    console.warn("[notificationService] Notificaciones no disponibles en este entorno (¿Expo Go?):", error);
    notifications = null;
  }
  return notifications;
}

export async function applyMoodReminder(reminder: MoodReminder): Promise<ReminderResult> {
  const Notifications = getNotifications();
  if (!Notifications) return "unsupported";

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
