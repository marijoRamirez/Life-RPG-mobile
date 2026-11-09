// Modelos del Módulo 4 (Tienda de la mascota).
// Solo definen la forma de los datos; no contienen lógica.

import type { PixelIconName } from "@/components/ui/PixelIcons";

export type ItemIconName = PixelIconName;

// Tipos de puntos con los que se paga
export type PointType = "cultura" | "fisico" | "enfoque";

// Puntos actuales del usuario por tipo
export type Wallet = Record<PointType, number>;

// 4.1 Escaparate
export interface ShopItem {
  id: string;
  name: string;
  icon: ItemIconName;
  price: number;
  pointType: PointType;
  isCustom?: boolean; // Recompensa creada por el usuario → badge "TUYA"
}

// 4.2 Recompensa personalizada
export interface NewRewardInput {
  icon: ItemIconName;
  name: string;
  description: string;
  pointType: PointType;
  price: number;
  consumable: boolean;
}

export interface SuggestedPrice {
  level: number;
  min: number;
  max: number;
}

// 4.3 Inventario
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

export interface Inventory {
  rewards: OwnedReward[];
  consumables: Consumable[];
  clothing: ClothingItem[];
}
