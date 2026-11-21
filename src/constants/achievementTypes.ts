// Constantes del Módulo 5 (Logros y progresión).

import type { AchievementArea, Rarity } from "@/models/Achievement";

export const RARITY_META: Record<Rarity, { label: string; color: string }> = {
  comun: { label: "COMÚN", color: "#9A9AAE" },
  raro: { label: "RARO", color: "#29B6F6" },
  epico: { label: "ÉPICO", color: "#B56CFF" },
  legendario: { label: "LEGENDARIO", color: "#FFC107" },
};

// A dónde lleva el botón de la ficha para avanzar en el logro
export const AREA_ACTION: Record<AchievementArea, { label: string; route: string }> = {
  habitos: { label: "Ir a mis hábitos", route: "/area1_jugabilidad/habitos/checkin" },
  misiones: { label: "Ir a misiones", route: "/area1_jugabilidad/misiones/tablero" },
  enfoque: { label: "Iniciar una sesión", route: "/area1_jugabilidad/misiones/tablero" },
  tienda: { label: "Ir a la tienda", route: "/area2_economia/tienda/escaparate" },
  animo: { label: "Registrar mi ánimo", route: "/area2_economia/animo/registro" },
};
