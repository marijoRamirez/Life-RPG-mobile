// Constantes visuales del Módulo 3 (Misiones únicas y enfoque).
// Los colores por tipo coinciden con los de la Tienda (POINT_META).

import type { PixelIconName } from "@/components/ui/PixelIcons";
import type { MissionType } from "@/models/Mission";

export const MISSION_COLORS = {
  border: "#3A3A48",
  muted: "#9A9AAE",
  softText: "#C9C9D6",
  danger: "#FF6B5E",
  onAccent: "#12121A", // Texto sobre botones de color (contraste AA)
  greenShadow: "#2E7D32",
};

export const MISSION_TYPES: MissionType[] = ["cultura", "fisico", "enfoque"];

export const MISSION_TYPE_META: Record<
  MissionType,
  {
    label: string; // "Física"
    pointsLabel: string; // "Físicos"
    color: string;
    icon: PixelIconName;
  }
> = {
  cultura: { label: "Cultura", pointsLabel: "Cultura", color: "#B56CFF", icon: "book-open" },
  fisico: { label: "Física", pointsLabel: "Físicos", color: "#FF7043", icon: "dumbbell" },
  enfoque: { label: "Enfoque", pointsLabel: "Enfoque", color: "#29B6F6", icon: "focus" },
};

export const MISSION_DURATIONS = [15, 30, 50, 90];
