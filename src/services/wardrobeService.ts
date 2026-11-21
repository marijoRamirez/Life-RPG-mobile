import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type { CurrentLook, SavedLook, WardrobeItem } from "@/models/Wardrobe";
import { api } from "./apiClient";
import * as mock from "./mocks/wardrobeMock";

// Servicio del vestidor y los looks (Módulo 1).
const real = usesApi("vestidor");

// GET /vestidor/articulos
export const getWardrobe = (): Promise<WardrobeItem[]> =>
  real ? api.get(ENDPOINTS.vestidor.articulos) : mock.getWardrobe();

// GET /vestidor/look-actual
export const getCurrentLook = (): Promise<CurrentLook> =>
  real ? api.get(ENDPOINTS.vestidor.lookActual) : mock.getCurrentLook();

// GET /vestidor/looks
export const getSavedLooks = (): Promise<SavedLook[]> =>
  real ? api.get(ENDPOINTS.vestidor.looks) : mock.getSavedLooks();

// POST /vestidor/looks — guarda el look actual con un nombre y lo deja en uso
export const saveLook = (name: string): Promise<SavedLook[]> =>
  real ? api.post(ENDPOINTS.vestidor.looks, { name }) : mock.saveLook(name);

// PATCH /vestidor/looks/:id/usar
export const applySavedLook = (id: string): Promise<SavedLook[]> =>
  real ? api.patch(ENDPOINTS.vestidor.usarLook(id)) : mock.applySavedLook(id);

// PATCH /vestidor/articulos/:id — RDF021 equipar / RDF022 desequipar; devuelve todo el vestuario
export const setEquipped = (id: string, equipped: boolean): Promise<WardrobeItem[]> =>
  real ? api.patch(ENDPOINTS.vestidor.articulo(id), { equipped }) : mock.setEquipped(id, equipped);
