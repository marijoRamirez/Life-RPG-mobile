import type { PixelIconName } from "@/components/ui/PixelIcons";
import { theme } from "@/constants/theme";

// Todos los íconos salen de PixelIcons.tsx
export type ItemIconName = PixelIconName;

export const COLORS = {
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
  ink: "#0E1226", // texto oscuro sobre botones verdes
};

// ---------- Puntos ----------
export type PointType = "cultura" | "fisico" | "enfoque";

export const POINT_META: Record<PointType, { label: string; icon: PixelIconName }> = {
  cultura: { label: "Cultura", icon: "book-open" },
  fisico: { label: "Físico", icon: "dumbbell" },
  enfoque: { label: "Enfoque", icon: "focus" },
};

export const POINT_TYPES: PointType[] = ["cultura", "fisico", "enfoque"];

export const FILTERS: { key: "todo" | PointType; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "cultura", label: "Cultura" },
  { key: "fisico", label: "Físico" },
  { key: "enfoque", label: "Enfoque" },
];

// Puntos actuales del usuario
export const WALLET_MOCK: Record<PointType, number> = {
  cultura: 340,
  fisico: 810,
  enfoque: 480,
};

// ---------- 4.1 Escaparate ----------
export interface ShopItem {
  id: string;
  name: string;
  icon: ItemIconName;
  price: number;
  pointType: PointType;
  isCustom?: boolean; // recompensa creada por el usuario → badge "TUYA"
}

export const SHOP_ITEMS_MOCK: ShopItem[] = [
  { id: "s1", name: "Noche de cine", icon: "star", price: 300, pointType: "cultura", isCustom: true },
  { id: "s2", name: "Libro nuevo", icon: "book-open", price: 480, pointType: "cultura" },
  { id: "s3", name: "Mancuernas 5 kg", icon: "dumbbell", price: 600, pointType: "fisico" },
  { id: "s4", name: "Día de descanso", icon: "moon", price: 280, pointType: "fisico", isCustom: true },
  { id: "s5", name: "Café de especialidad", icon: "heart", price: 180, pointType: "enfoque", isCustom: true },
  { id: "s6", name: "1 h de videojuegos", icon: "trophy", price: 200, pointType: "enfoque" },
];

// ---------- 4.2 Creador ----------
export const ICON_OPTIONS: ItemIconName[] = ["star", "bell", "heart", "trophy", "moon", "bag"];

// Rango sugerido según el nivel del usuario (por ahora fijo)
export const SUGGESTED_PRICE = { level: 14, min: 200, max: 400 };

// ---------- 4.3 Inventario ----------
export interface OwnedReward {
  id: string;
  name: string;
  icon: ItemIconName;
  subtitle: string;
}
export interface Consumable {
  id: string;
  name: string;
  icon: ItemIconName;
  quantity: number;
}
export interface ClothingItem {
  id: string;
  name: string;
  icon: ItemIconName;
  equipped: boolean;
}

export const OWNED_REWARDS_MOCK: OwnedReward[] = [
  { id: "r1", name: "Noche de cine", icon: "star", subtitle: "Comprada el 6 oct · lista para canjear" },
  { id: "r2", name: "1 h de videojuegos", icon: "trophy", subtitle: "Comprada hoy · Enfoque" },
];

export const CONSUMABLES_MOCK: Consumable[] = [
  { id: "c1", name: "Poción de HP", icon: "heart", quantity: 3 },
  { id: "c2", name: "Escudo de racha", icon: "lock", quantity: 1 },
  { id: "c3", name: "Doble XP 24 h", icon: "streak", quantity: 1 },
];

export const CLOTHING_MOCK: ClothingItem[] = [
  { id: "w1", name: "Boina", icon: "clothes", equipped: true },
  { id: "w2", name: "Gorro", icon: "clothes", equipped: false },
  { id: "w3", name: "Banda", icon: "clothes", equipped: false },
  { id: "w4", name: "Lentes", icon: "focus", equipped: true },
];