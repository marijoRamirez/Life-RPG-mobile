// Modelos del Tamagotchi (Módulo 1 · Tamagotchi y perfil).
// Solo definen la forma de los datos; no contienen lógica.

export interface Tamagotchi {
  name: string; // "Susi Botitas"
  title: string; // "Guardián del Enfoque"
  level: number;
  xp: number;
  xpForNextLevel: number;
  hp: number;
  hpMax: number;
  habitat: string; // "Hábitat del bosque"
}
