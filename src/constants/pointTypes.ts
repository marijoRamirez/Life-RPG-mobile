// Texto e ícono de cada tipo de punto. Compartido por todos los módulos.

import type { PixelIconName } from "@/components/ui/PixelIcons";
import type { PointType } from "@/models/common";

export const POINT_TYPES: PointType[] = ["cultura", "fisico", "enfoque"];

export const POINT_META: Record<PointType, { label: string; icon: PixelIconName }> = {
  cultura: { label: "Cultura", icon: "book-open" },
  fisico: { label: "Físico", icon: "dumbbell" },
  enfoque: { label: "Enfoque", icon: "focus" },
};
