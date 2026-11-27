// Modelos del Módulo 3 (Misiones únicas y enfoque).
// Solo definen la forma de los datos; no contienen lógica.

import type { PointType } from "@/models/common";

// El tipo de una misión es el tipo de puntos que otorga
export type MissionType = PointType;

// Cómo se comprobó que la misión se cumplió (RDF041, RDF043)
export type ValidationMethod = "bloqueo" | "smartwatch" | "manual";

// Por qué una sesión terminó como fallida (RDF040)
export type FailReason = "rendicion" | "salio_app";

export interface MissionReward {
  xp: number;
  points: number; // Puntos del tipo de la misión (Cultura, Físicos o Enfoque)
}

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  durationMin: number;
  reward: MissionReward;
}

export interface NewMissionInput {
  title: string;
  type: MissionType;
  durationMin: number;
}

export interface FocusSession {
  id: string;
  missionId: string;
  startedAt: string; // ISO 8601
  durationMin: number;
  locksDevice: boolean; // Solo Enfoque muestra "Pantalla fijada"; salir de la app falla cualquier misión
}

// Datos que llegan del smartwatch / Health Connect
export interface WearableActivity {
  distanceKm: number;
  steps: number;
  activeMin: number;
}

// Resultado de terminar el temporizador, antes o después de validar
export interface SessionOutcome {
  sessionId: string;
  mission: Mission;
  validation: ValidationMethod;
  activity?: WearableActivity;
  claimed: boolean; // false mientras espera la confirmación manual
}

export interface MissionHistoryEntry {
  id: string;
  title: string;
  type: MissionType;
  durationMin: number;
  status: "completada" | "fallida";
  finishedAt: string; // ISO 8601
  validation?: ValidationMethod;
  failReason?: FailReason;
  reward: MissionReward; // En cero cuando la misión falló
}
