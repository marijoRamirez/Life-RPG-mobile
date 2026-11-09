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

// Puntos por tipo con su avance (0 a 1) para las barras de la Casa
export interface AttributeProgress {
  value: number;
  progress: number;
}

export interface Attributes {
  cultura: AttributeProgress;
  fisico: AttributeProgress;
  enfoque: AttributeProgress;
}
