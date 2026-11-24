// Imágenes de los fondos y accesorios del vestidor (M01, también los usa la Tienda M04).
//
// Cómo funciona:
//   - Cada imagen vive en assets/vestidor/<fondos|accesorios>/<nombre>.png y su nombre es
//     el ID del artículo (minúsculas y con guiones: "boina-lector", "fondo-bosque-mistico").
//   - La base de datos solo guarda ese nombre (campo `asset` del artículo; si no viene, se usa su `id`).
//   - La app lo convierte en imagen con itemAsset(nombre). React Native solo puede empaquetar
//     imágenes con require() fijos, por eso la lista está escrita aquí y no se arma con el texto.
//
// Para agregar uno nuevo: copia el PNG con el nombre del ID y agrega su línea abajo.

import type { ImageSourcePropType } from "react-native";

import type { WardrobeCategory } from "@/models/Wardrobe";

export interface ItemAsset {
  source: ImageSourcePropType;
  category: WardrobeCategory;
  // Accesorios: ancho y distancia desde arriba, como fracción del tamaño de la mascota,
  // y proporción de la imagen (ancho / alto) para calcular su alto
  width?: number;
  top?: number;
  aspect?: number;
}

export const ITEM_ASSETS: Record<string, ItemAsset> = {
  // Cabeza
  "boina-lector": { source: require("@/assets/vestidor/accesorios/boina-lector.png"), category: "Cabeza", width: 0.56, top: 0.03, aspect: 32 / 16 },
  "gorro-lana": { source: require("@/assets/vestidor/accesorios/gorro-lana.png"), category: "Cabeza", width: 0.56, top: -0.02, aspect: 32 / 22 },
  "banda-deportiva": { source: require("@/assets/vestidor/accesorios/banda-deportiva.png"), category: "Cabeza", width: 0.56, top: 0.13, aspect: 32 / 10 },
  "gorra-corredor": { source: require("@/assets/vestidor/accesorios/gorra-corredor.png"), category: "Cabeza", width: 0.6, top: 0, aspect: 32 / 18 },
  "capucha-monje": { source: require("@/assets/vestidor/accesorios/capucha-monje.png"), category: "Cabeza", width: 0.78, top: -0.04, aspect: 36 / 30 },
  "corona-sabio": { source: require("@/assets/vestidor/accesorios/corona-sabio.png"), category: "Cabeza", width: 0.5, top: -0.03, aspect: 32 / 18 },
  // Cara
  "lentes-sol": { source: require("@/assets/vestidor/accesorios/lentes-sol.png"), category: "Cara", width: 0.46, top: 0.34, aspect: 32 / 12 },
  "lentes-redondos": { source: require("@/assets/vestidor/accesorios/lentes-redondos.png"), category: "Cara", width: 0.46, top: 0.33, aspect: 32 / 14 },
  // Cuerpo
  "bufanda-roja": { source: require("@/assets/vestidor/accesorios/bufanda-roja.png"), category: "Cuerpo", width: 0.42, top: 0.58, aspect: 32 / 18 },
  sudadera: { source: require("@/assets/vestidor/accesorios/sudadera.png"), category: "Cuerpo", width: 0.46, top: 0.6, aspect: 32 / 22 },
  // Fondos (cubren la tarjeta de la mascota en la Casa)
  "fondo-casa": { source: require("@/assets/vestidor/fondos/fondo-casa.png"), category: "Fondo" },
  "fondo-bosque-mistico": { source: require("@/assets/vestidor/fondos/fondo-bosque-mistico.png"), category: "Fondo" },
};

// Fondo de la Casa cuando no hay ninguno equipado
export const DEFAULT_BACKGROUND = "fondo-casa";

// Busca la imagen por su nombre; null si todavía no existe (la app muestra el ícono de siempre)
export const itemAsset = (name: string | null | undefined): ItemAsset | null =>
  (name && ITEM_ASSETS[name]) || null;

// Nombre de la imagen de un artículo: su campo `asset` o, si no viene, su `id`
export const assetName = (item: { id: string; asset?: string | null }) => item.asset ?? item.id;
