import type { CurrentLook, SavedLook, StatPoints, WardrobeItem } from "@/models/Wardrobe";

// Servicio del vestidor y los looks (Módulo 1).
// Mientras no esté el backend, los datos viven en memoria y cada función
// simula su endpoint. Al conectar la API, sustituir el cuerpo de cada
// función por la petición indicada en su comentario usando apiClient.

const MOCK_LATENCY_MS = 250;

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const LOOK_NAME_MAX = 24;

const stats: StatPoints = { cultura: 340, fisico: 210, enfoque: 480 };

const wardrobe: WardrobeItem[] = [
  { id: 1, name: "Boina de lector", stat: "Cultura", icon: "book-open", status: "Equipado", equipped: true, category: "Cabeza" },
  { id: 2, name: "Gorro de lana", stat: "Enfoque", icon: "focus", status: "Tuyo", equipped: false, category: "Cabeza" },
  { id: 3, name: "Banda deportiva", stat: "Físico", icon: "dumbbell", status: "Tuyo", equipped: false, category: "Cabeza" },
  { id: 4, name: "Gorra de corredor", stat: "Físico", icon: "dumbbell", status: "120 pts", equipped: false, category: "Cabeza" },
  { id: 5, name: "Capucha de monje", stat: "Enfoque", icon: "focus", status: "Logro", equipped: false, category: "Cabeza" },
  { id: 6, name: "Corona de sabio", stat: "Cultura", icon: "book-open", status: "LV 18", equipped: false, category: "Cabeza" },
  { id: 7, name: "Lentes de sol", stat: "Cultura", icon: "book-open", status: "Tuyo", equipped: false, category: "Cara" },
  { id: 8, name: "Bufanda roja", stat: "Físico", icon: "dumbbell", status: "Equipado", equipped: true, category: "Cuerpo" },
  { id: 9, name: "Bosque místico", stat: "Enfoque", icon: "focus", status: "Equipado", equipped: true, category: "Fondo" },
];

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
  { id: 1, name: "Lector nocturno", details: "Boina de lector · Lentes redondos · La Casa", color: "#9C27B0", inUse: true },
  { id: 2, name: "Corredor matutino", details: "Banda deportiva · Lentes de sol · Bosque", color: "#FF5722", inUse: false },
  { id: 3, name: "Modo monje", details: "Gorro de lana · Sudadera · La Casa", color: "#03A9F4", inUse: false },
];

let nextId = 100;

// GET /api/v1/usuarios/me/puntos
export function getStatPoints(): Promise<StatPoints> {
  return delay({ ...stats });
}

// GET /api/v1/vestidor/articulos
export function getWardrobe(): Promise<WardrobeItem[]> {
  return delay(copy(wardrobe));
}

// GET /api/v1/vestidor/look-actual
export function getCurrentLook(): Promise<CurrentLook> {
  return delay(copy(currentLook));
}

// GET /api/v1/vestidor/looks
export function getSavedLooks(): Promise<SavedLook[]> {
  return delay(copy(savedLooks));
}

// POST /api/v1/vestidor/looks — guarda el look actual con un nombre y lo deja en uso
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
    savedLooks = [...savedLooks, { id: nextId++, name: clean, details, color: "#9C27B0", inUse: true }];
  }
  currentLook = { ...currentLook, name: clean };
  return delay(copy(savedLooks));
}

// PATCH /api/v1/vestidor/looks/:id/usar
export function applySavedLook(id: number): Promise<SavedLook[]> {
  savedLooks = savedLooks.map((l) => ({ ...l, inUse: l.id === id }));
  const look = savedLooks.find((l) => l.id === id);
  if (look) currentLook = { ...currentLook, name: look.name };
  return delay(copy(savedLooks));
}

