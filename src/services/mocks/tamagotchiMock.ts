import type { Tamagotchi } from "@/models/Tamagotchi";
import { delay } from "./mockUtils";

// Datos simulados del Tamagotchi (Módulo 1).
// Imitan lo que responde la API (docs/API.md) mientras el módulo no esté conectado.

const tamagotchi: Tamagotchi = {
  name: "Susi Botitas",
  title: "Guardián del Enfoque",
  level: 14,
  xp: 1240,
  xpForNextLevel: 1800,
  hp: 82,
  hpMax: 100,
  habitat: "Hábitat del bosque",
};

// GET /tamagotchi
export function getTamagotchi(): Promise<Tamagotchi> {
  return delay({ ...tamagotchi });
}
