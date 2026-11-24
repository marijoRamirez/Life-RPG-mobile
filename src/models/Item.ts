// Modelos del Módulo 4 (Tienda de la mascota).
// Solo definen la forma de los datos; no contienen lógica.

import type { PixelIconName } from "@/components/ui/PixelIcons";
import type { PointType, Wallet } from "@/models/common";

export type ItemIconName = PixelIconName;

// 4.1 Escaparate
export interface ShopItem {
  id: string;
  name: string;
  icon: ItemIconName;
  price: number;
  pointType: PointType;
  isCustom?: boolean; // Recompensa creada por el usuario → badge "TUYA"
  asset?: string | null; // Fondos y accesorios: nombre de su imagen (constants/itemAssets.ts)
}

// Respuesta al comprar: puntos que quedan y la recompensa que entra al inventario
export interface PurchaseResult {
  wallet: Wallet;
  reward: OwnedReward;
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

// Recompensa personalizada completa, para editarla (RDF055)
export interface CustomReward extends NewRewardInput {
  id: string;
}

export interface SuggestedPrice {
  level: number;
  min: number; // Rango sugerido para el nivel del jugador
  max: number;
  allowedMin: number; // Rango permitido por la economía global (M14, RDF054)
  allowedMax: number;
}

// 4.3 Inventario
export interface OwnedReward {
  id: string;
  name: string;
  icon: ItemIconName;
  giftFrom?: string | null; // Alias del amigo que lo regaló (M08 · RDF057); null si lo compró
  subtitle: string;
}

export interface Consumable {
  id: string;
  name: string;
  icon: ItemIconName;
  giftFrom?: string | null; // Alias del amigo que lo regaló (M08 · RDF057); null si lo compró
  quantity: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  icon: ItemIconName;
  giftFrom?: string | null; // Alias del amigo que lo regaló (M08 · RDF057); null si lo compró
  equipped: boolean;
  asset?: string | null; // Nombre de su imagen (constants/itemAssets.ts)
}

export interface Inventory {
  rewards: OwnedReward[];
  consumables: Consumable[];
  clothing: ClothingItem[];
}

// Historial de canjes (RDF059): recompensas y consumibles ya usados
export interface RedemptionEntry {
  id: string;
  name: string;
  icon: ItemIconName;
  kind: "recompensa" | "consumible";
  redeemedAt: string; // ISO 8601
}
