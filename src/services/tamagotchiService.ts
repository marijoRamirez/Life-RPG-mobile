import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type { Tamagotchi } from "@/models/Tamagotchi";
import { api } from "./apiClient";
import * as mock from "./mocks/tamagotchiMock";

// Servicio del Tamagotchi (Módulo 1).
const real = usesApi("tamagotchi");

// GET /tamagotchi
export const getTamagotchi = (): Promise<Tamagotchi> =>
  real ? api.get(ENDPOINTS.tamagotchi.actual) : mock.getTamagotchi();
