// Animales que el jugador puede elegir como mascota (M00 · Bienvenida, M01 · Casa).

import type { ImageSourcePropType } from "react-native";

import type { PetColor, PetSpecies } from "@/models/Account";

export const PET_OPTIONS: { key: PetSpecies; label: string; image: ImageSourcePropType }[] = [
  { key: "gato", label: "Gato", image: require("@/assets/images/gato.png") },
  { key: "perro", label: "Perro", image: require("@/assets/images/perro.png") },
  { key: "dragon", label: "Dragón", image: require("@/assets/images/dragon.png") },
  { key: "hamster", label: "Hámster", image: require("@/assets/images/hamster.png") },
  { key: "leon", label: "León", image: require("@/assets/images/leon.png") },
];

export const DEFAULT_PET: PetSpecies = "gato";

export const petImage = (species: PetSpecies | null | undefined) =>
  (PET_OPTIONS.find((p) => p.key === species) ?? PET_OPTIONS[0]).image;

export const petLabel = (species: PetSpecies | null | undefined) =>
  (PET_OPTIONS.find((p) => p.key === species) ?? PET_OPTIONS[0]).label;

// Colores de la mascota (RDF026): se aplican a su aura y a su hábitat
export const PET_COLORS: { key: PetColor; label: string; value: string }[] = [
  { key: "verde", label: "Verde", value: "#4CAF50" },
  { key: "morado", label: "Morado", value: "#9C27B0" },
  { key: "rojo", label: "Rojo", value: "#E5533D" },
  { key: "azul", label: "Azul", value: "#2F80ED" },
  { key: "naranja", label: "Naranja", value: "#F2994A" },
];

export const petColorValue = (color: PetColor | null | undefined) =>
  (PET_COLORS.find((c) => c.key === color) ?? PET_COLORS[0]).value;
