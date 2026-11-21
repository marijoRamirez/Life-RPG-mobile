// Modelos del vestidor y los looks (Módulo 1 · Tamagotchi y perfil).
// Solo definen la forma de los datos; no contienen lógica.

import type { PixelIconName } from "@/components/ui/PixelIcons";
import type { PointType } from "@/models/common";

export type WardrobeCategory = "Cabeza" | "Cara" | "Cuerpo" | "Fondo";

export interface WardrobeItem {
  id: string;
  name: string;
  stat: PointType; // Tipo de puntos al que pertenece
  icon: PixelIconName;
  status: string; // "Equipado", "Tuyo", "120 pts", "Logro", "LV 18"…
  equipped: boolean;
  owned: boolean; // false = se compra en la tienda, se gana con un logro o se desbloquea por nivel
  category: WardrobeCategory;
}

// Lo que lleva puesto la mascota en cada parte
export type LookSlots = Record<WardrobeCategory, string>;

export interface CurrentLook {
  name: string;
  slots: LookSlots;
}

export interface SavedLook {
  id: string;
  name: string;
  details: string;
  color: string;
  inUse: boolean;
}
