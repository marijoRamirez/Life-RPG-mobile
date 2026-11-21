import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type { Achievement, ClaimResult, MonthlyComparison } from "@/models/Achievement";
import { api } from "./apiClient";
import * as mock from "./mocks/achievementMock";

// Servicio del Módulo 5 (Logros y progresión).
const real = usesApi("logros");

// GET /logros — RDF060 · consultarLogros
export const getAchievements = (): Promise<Achievement[]> =>
  real ? api.get(ENDPOINTS.logros.lista) : mock.getAchievements();

// GET /logros/:id — RDF063 · consultarDetalleLogro
export const getAchievement = (id: string): Promise<Achievement> =>
  real ? api.get(ENDPOINTS.logros.uno(id)) : mock.getAchievement(id);

// POST /logros/:id/reclamar — RDF064 · reclamarRecompensaLogro
export const claimAchievement = (id: string): Promise<ClaimResult> =>
  real ? api.post(ENDPOINTS.logros.reclamar(id)) : mock.claimAchievement(id);

// GET /progreso/comparativa — RDF065 a RDF067 · Tú vs. tú
export const getMonthlyComparison = (): Promise<MonthlyComparison> =>
  real ? api.get(ENDPOINTS.logros.comparativa) : mock.getMonthlyComparison();
