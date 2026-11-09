// Constantes visuales y textos del Módulo 4 (Tienda de la mascota).

import type { PixelIconName } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";
import type { ItemIconName, PointType } from "@/models/Item";

export const SHOP_COLORS = {
  bg: theme.colors.background,
  surface: theme.colors.surface,
  surfaceAlt: theme.colors.surfaceAlt,
  border: "#2B3350",
  text: theme.colors.textPrimary,
  muted: "#8D95B2",
  amber: theme.colors.yellow,
  green: "#4CAF50",
  greenDark: "#173A2B",
  greenBorder: "#2F6B45",
  purple: theme.colors.purple,
  ink: "#0E1226", // Texto oscuro sobre botones verdes
};

export const POINT_META: Record<PointType, { label: string; icon: PixelIconName }> = {
  cultura: { label: "Cultura", icon: "book-open" },
  fisico: { label: "Físico", icon: "dumbbell" },
  enfoque: { label: "Enfoque", icon: "focus" },
};

export const POINT_TYPES: PointType[] = ["cultura", "fisico", "enfoque"];

export type ShopFilter = "todo" | PointType;

export const FILTERS: { key: ShopFilter; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "cultura", label: "Cultura" },
  { key: "fisico", label: "Físico" },
  { key: "enfoque", label: "Enfoque" },
];

// Íconos disponibles para una recompensa personalizada
export const ICON_OPTIONS: ItemIconName[] = ["star", "bell", "heart", "trophy", "moon", "bag"];

// Cuánto sube o baja el precio con los botones − y +
export const PRICE_STEP = 10;
