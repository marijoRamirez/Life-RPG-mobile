import type { PixelIconName } from "@/components/ui/PixelIcons";

// Datos de ejemplo y constantes del módulo 4 (Tienda de la Mascota).
// Cuando esté el backend, sustituir los MOCK por llamadas a la API.

export const COLORS = {
  bg: "#14141B",
  surface: "#1F1F29",
  surfaceAlt: "#2A2A35",
  border: "#3A3A48",
  text: "#FFFFFF",
  muted: "#9A9AAE",
  green: "#4CAF50",
  amber: "#FFC107",
  purple: "#9C27B0",
  danger: "#F44336",
};

export type PointType = "cultura" | "fisico" | "enfoque";
export type Category = "cultura" | "fisico" | "enfoque" | "ropa";

export const POINT_META: Record<
  PointType,
  {
    label: string; // "Cultura"
    color: string;
    icon: PixelIconName;
  }
> = {
  cultura: { label: "Cultura", color: "#B56CFF", icon: "book-open" },
  fisico: { label: "Físicos", color: "#FF7043", icon: "dumbbell" },
  enfoque: { label: "Enfoque", color: "#29B6F6", icon: "focus" },
};

export const POINT_TYPES: PointType[] = ["cultura", "fisico", "enfoque"];

export const CATEGORIES: { key: Category | "todo"; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "cultura", label: "Cultura" },
  { key: "fisico", label: "Físico" },
  { key: "enfoque", label: "Enfoque" },
  { key: "ropa", label: "Ropa" },
];

// Puntos actuales del usuario (mismos valores que el HUD principal)
export const WALLET_MOCK: Record<PointType, number> = {
  cultura: 340,
  fisico: 210,
  enfoque: 480,
};

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: PixelIconName;
  price: number;
  pointType: PointType;
  category: Category;
}

export const SHOP_ITEMS_MOCK: ShopItem[] = [
  {
    id: "s1",
    name: "Noche de cine",
    description: "Una película completa sin culpa.",
    icon: "moon",
    price: 120,
    pointType: "cultura",
    category: "cultura",
  },
  {
    id: "s2",
    name: "Libro nuevo",
    description: "Compra el libro que querías leer.",
    icon: "book-open",
    price: 200,
    pointType: "cultura",
    category: "cultura",
  },
  {
    id: "s3",
    name: "Mancuernas",
    description: "Equipo para tu rutina en casa.",
    icon: "dumbbell",
    price: 150,
    pointType: "fisico",
    category: "fisico",
  },
  {
    id: "s4",
    name: "Batido proteico",
    description: "Recupera energía después de entrenar.",
    icon: "heart",
    price: 60,
    pointType: "fisico",
    category: "fisico",
  },
  {
    id: "s5",
    name: "Café especial",
    description: "Tu bebida favorita para enfocarte.",
    icon: "focus",
    price: 80,
    pointType: "enfoque",
    category: "enfoque",
  },
  {
    id: "s6",
    name: "Hora libre",
    description: "Una hora sin misiones ni bloqueos.",
    icon: "calendar",
    price: 300,
    pointType: "enfoque",
    category: "enfoque",
  },
  {
    id: "s7",
    name: "Gorro de lectura",
    description: "Accesorio exclusivo de Cultura.",
    icon: "clothes",
    price: 250,
    pointType: "cultura",
    category: "ropa",
  },
  {
    id: "s8",
    name: "Banda deportiva",
    description: "Accesorio exclusivo de Físicos.",
    icon: "star",
    price: 180,
    pointType: "fisico",
    category: "ropa",
  },
];

export type InventoryKind = "recompensa" | "consumible" | "ropa";

export interface InventoryItem {
  id: string;
  name: string;
  icon: PixelIconName;
  kind: InventoryKind;
  quantity: number;
  pointType?: PointType;
  equipped?: boolean;
}

export const INVENTORY_TABS: { key: InventoryKind; label: string }[] = [
  { key: "recompensa", label: "Recompensas" },
  { key: "consumible", label: "Consumibles" },
  { key: "ropa", label: "Ropa" },
];

export const INVENTORY_MOCK: InventoryItem[] = [
  { id: "i1", name: "Noche de cine", icon: "moon", kind: "recompensa", quantity: 1, pointType: "cultura" },
  { id: "i2", name: "Café especial", icon: "focus", kind: "recompensa", quantity: 2, pointType: "enfoque" },
  { id: "i3", name: "Postre sin culpa", icon: "star", kind: "recompensa", quantity: 1, pointType: "fisico" },
  { id: "i4", name: "Poción de HP", icon: "heart", kind: "consumible", quantity: 3 },
  { id: "i5", name: "Doble XP (1h)", icon: "star", kind: "consumible", quantity: 1 },
  { id: "i6", name: "Escudo de racha", icon: "lock", kind: "consumible", quantity: 2 },
  { id: "i7", name: "Botas de aventura", icon: "clothes", kind: "ropa", quantity: 1, pointType: "fisico", equipped: true },
  { id: "i8", name: "Gorro de lectura", icon: "clothes", kind: "ropa", quantity: 1, pointType: "cultura" },
  { id: "i9", name: "Lentes de enfoque", icon: "focus", kind: "ropa", quantity: 1, pointType: "enfoque" },
];

// Íconos disponibles en el creador de recompensas
export const ICON_OPTIONS: PixelIconName[] = [
  "star", "heart", "trophy", "bag", "shop", "flag", "bell", "moon",
];
