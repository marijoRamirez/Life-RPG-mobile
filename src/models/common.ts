// Tipos compartidos por todos los módulos. Si un dato aparece en más de un
// módulo, su tipo se define aquí una sola vez.

// Los tres tipos de puntos / áreas del juego. Siempre en minúsculas y sin acento;
// el texto que ve el usuario ("Físico") sale de constants/pointTypes.ts.
export type PointType = "cultura" | "fisico" | "enfoque";

// Puntos actuales del usuario por tipo
export type Wallet = Record<PointType, number>;
