// Modelos del vestidor y los looks (Módulo 1 · Tamagotchi y perfil).
// Solo definen la forma de los datos; no contienen lógica.

import type { PixelIconName } from "@/components/ui/PixelIcons";

export type WardrobeCategory = "Cabeza" | "Cara" | "Cuerpo" | "Fondo";

export type StatName = "Cultura" | "Físico" | "Enfoque";

export interface WardrobeItem {
  id: number;
  name: string;
  stat: StatName;
  icon: PixelIconName;
  status: string; // "Equipado", "Tuyo", "120 pts", "Logro", "LV 18"…
  equipped: boolean;
  category: WardrobeCategory;
}

// Puntos que se muestran arriba del vestidor
export interface StatPoints {
  cultura: number;
  fisico: number;
  enfoque: number;
}

// Lo que lleva puesto la mascota en cada parte
export type LookSlots = Record<WardrobeCategory, string>;

export interface CurrentLook {
  name: string;
  slots: LookSlots;
}

export interface SavedLook {
  id: number;
  name: string;
  details: string;
  color: string;
  inUse: boolean;
}
