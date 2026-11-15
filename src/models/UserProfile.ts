// Modelos del usuario actual (compartidos por varios módulos).
// Solo definen la forma de los datos; no contienen lógica.

import type { PointType } from "@/models/common";

export interface UserProfile {
  id: string;
  displayName: string; // Nombre con el que se le saluda en la Casa
  hasMoodLogToday: boolean; // Si ya registró su ánimo hoy (M06, RDF017)
}

// Puntos por tipo con su avance (0 a 1) para las barras de la Casa
export interface AttributeProgress {
  value: number;
  progress: number;
}

export type Attributes = Record<PointType, AttributeProgress>;

// Ajustes › Privacidad: quién ve el ánimo y el diario del usuario (RDF071)
export interface PrivacySettings {
  visibleToViewers: boolean;
  viewersCount: number;
}
