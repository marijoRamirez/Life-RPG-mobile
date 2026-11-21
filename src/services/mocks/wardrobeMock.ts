import type { CurrentLook, SavedLook, WardrobeItem } from "@/models/Wardrobe";
import { LOOK_NAME_MAX } from "@/constants/wardrobeTypes";
import { copy, delay, newId } from "./mockUtils";

// Datos simulados del vestidor y los looks (Módulo 1).
// Imitan lo que responde la API (docs/API.md) mientras el módulo no esté conectado.


let wardrobe: WardrobeItem[] = [
  { id: "w-1", name: "Boina de lector", stat: "cultura", icon: "book-open", status: "Equipado", equipped: true, owned: true, category: "Cabeza" },
  { id: "w-2", name: "Gorro de lana", stat: "enfoque", icon: "focus", status: "Tuyo", equipped: false, owned: true, category: "Cabeza" },
  { id: "w-3", name: "Banda deportiva", stat: "fisico", icon: "dumbbell", status: "Tuyo", equipped: false, owned: true, category: "Cabeza" },
  { id: "w-4", name: "Gorra de corredor", stat: "fisico", icon: "dumbbell", status: "120 pts", equipped: false, owned: false, category: "Cabeza" },
  { id: "w-5", name: "Capucha de monje", stat: "enfoque", icon: "focus", status: "Logro", equipped: false, owned: false, category: "Cabeza" },
  { id: "w-6", name: "Corona de sabio", stat: "cultura", icon: "book-open", status: "LV 18", equipped: false, owned: false, category: "Cabeza" },
  { id: "w-7", name: "Lentes de sol", stat: "cultura", icon: "book-open", status: "Tuyo", equipped: false, owned: true, category: "Cara" },
  { id: "w-8", name: "Bufanda roja", stat: "fisico", icon: "dumbbell", status: "Equipado", equipped: true, owned: true, category: "Cuerpo" },
  { id: "w-9", name: "Bosque místico", stat: "enfoque", icon: "focus", status: "Equipado", equipped: true, owned: true, category: "Fondo" },
];

// Lo que se ve en el look actual al quitar la prenda de una parte
const EMPTY_SLOT = "Nada";

let currentLook: CurrentLook = {
  name: "Lector nocturno",
  slots: {
    Cabeza: "Gorrito del lectorcito",
    Cara: "Lentes redonditos",
    Cuerpo: "Sudadera",
    Fondo: "Casita",
  },
};

let savedLooks: SavedLook[] = [
  { id: "l-1", name: "Lector nocturno", details: "Boina de lector · Lentes redondos · La Casa", color: "#9C27B0", inUse: true },
  { id: "l-2", name: "Corredor matutino", details: "Banda deportiva · Lentes de sol · Bosque", color: "#FF5722", inUse: false },
  { id: "l-3", name: "Modo monje", details: "Gorro de lana · Sudadera · La Casa", color: "#03A9F4", inUse: false },
];

// GET /vestidor/articulos
export function getWardrobe(): Promise<WardrobeItem[]> {
  return delay(copy(wardrobe));
}

// GET /vestidor/look-actual
export function getCurrentLook(): Promise<CurrentLook> {
  return delay(copy(currentLook));
}

// GET /vestidor/looks
export function getSavedLooks(): Promise<SavedLook[]> {
  return delay(copy(savedLooks));
}

// POST /vestidor/looks — guarda el look actual con un nombre y lo deja en uso
export function saveLook(name: string): Promise<SavedLook[]> {
  const clean = name.trim();
  if (!clean) return Promise.reject(new Error("Escribe un nombre para el look."));
  if (clean.length > LOOK_NAME_MAX) {
    return Promise.reject(new Error(`El nombre no puede pasar de ${LOOK_NAME_MAX} caracteres.`));
  }
  const details = [currentLook.slots.Cabeza, currentLook.slots.Cara, currentLook.slots.Fondo].join(" · ");
  const existing = savedLooks.find((l) => l.name.toLowerCase() === clean.toLowerCase());
  savedLooks = savedLooks.map((l) => ({ ...l, inUse: false }));
  if (existing) {
    savedLooks = savedLooks.map((l) => (l.id === existing.id ? { ...l, details, inUse: true } : l));
  } else {
    savedLooks = [...savedLooks, { id: newId("l"), name: clean, details, color: "#9C27B0", inUse: true }];
  }
  currentLook = { ...currentLook, name: clean };
  return delay(copy(savedLooks));
}

// PATCH /vestidor/looks/:id/usar
export function applySavedLook(id: string): Promise<SavedLook[]> {
  savedLooks = savedLooks.map((l) => ({ ...l, inUse: l.id === id }));
  const look = savedLooks.find((l) => l.id === id);
  if (look) currentLook = { ...currentLook, name: look.name };
  return delay(copy(savedLooks));
}


// PATCH /vestidor/articulos/:id — RDF021 equipar (reemplaza lo que había en esa parte)
// y RDF022 desequipar. Devuelve todo el vestuario.
export function setEquipped(id: string, equipped: boolean): Promise<WardrobeItem[]> {
  const item = wardrobe.find((w) => w.id === id);
  if (!item) return Promise.reject(new Error("La prenda ya no existe."));
  if (!item.owned) return Promise.reject(new Error("Todavía no tienes esta prenda."));
  wardrobe = wardrobe.map((w) => {
    if (w.id === id) return { ...w, equipped, status: equipped ? "Equipado" : "Tuyo" };
    if (equipped && w.category === item.category && w.equipped) return { ...w, equipped: false, status: "Tuyo" };
    return w;
  });
  currentLook = { ...currentLook, slots: { ...currentLook.slots, [item.category]: equipped ? item.name : EMPTY_SLOT } };
  return delay(copy(wardrobe));
}
