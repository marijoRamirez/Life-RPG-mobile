import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type {
  FailReason,
  FocusSession,
  Mission,
  MissionHistoryEntry,
  NewMissionInput,
  SessionOutcome,
} from "@/models/Mission";
import { api, ApiError } from "./apiClient";
import * as mock from "./mocks/missionMock";

// Servicio del Módulo 3 (Misiones únicas y enfoque).
const real = usesApi("misiones");

// Un 404 significa "ya no existe": se devuelve undefined en vez de lanzar error
const orUndefined = <T>(request: Promise<T>): Promise<T | undefined> =>
  request.catch((e) => {
    if (e instanceof ApiError && e.status === 404) return undefined;
    throw e;
  });

// RDF038 · Vista previa de la recompensa al crear una misión. Es solo una estimación
// local; la recompensa definitiva la calcula el servidor y llega dentro de la misión.
export { previewReward } from "./mocks/missionMock";

// RDF035 · consultarMisionesActivas — GET /misiones?estado=activa
export const getActiveMissions = (): Promise<Mission[]> =>
  real ? api.get(ENDPOINTS.misiones.activas) : mock.getActiveMissions();

// GET /misiones/:id
export const getMission = (missionId: string): Promise<Mission | undefined> =>
  real ? orUndefined(api.get<Mission>(ENDPOINTS.misiones.una(missionId))) : mock.getMission(missionId);

// RDF037 · agregarMision — POST /misiones
export const createMission = (input: NewMissionInput): Promise<Mission> =>
  real ? api.post(ENDPOINTS.misiones.lista, input) : mock.createMission(input);

// RDF039 · iniciarSesionEnfoque — POST /misiones/:id/sesiones
export const startSession = (missionId: string): Promise<FocusSession> =>
  real ? api.post(ENDPOINTS.misiones.iniciarSesion(missionId)) : mock.startSession(missionId);

// RDF040 · rendirseSesion — POST /sesiones/:id/fallar
export const failSession = (sessionId: string, reason: FailReason): Promise<void> =>
  real ? api.post(ENDPOINTS.misiones.fallarSesion(sessionId), { reason }) : mock.failSession(sessionId, reason);

// RDF041 · finalizarSesionEnfoque — POST /sesiones/:id/finalizar
export const finishSession = (sessionId: string): Promise<SessionOutcome> =>
  real ? api.post(ENDPOINTS.misiones.finalizarSesion(sessionId)) : mock.finishSession(sessionId);

// GET /sesiones/:id/resultado
export const getSessionOutcome = (sessionId: string): Promise<SessionOutcome | undefined> =>
  real
    ? orUndefined(api.get<SessionOutcome>(ENDPOINTS.misiones.resultadoSesion(sessionId)))
    : mock.getSessionOutcome(sessionId);

// RDF043 · validación manual cuando no hay smartwatch — POST /sesiones/:id/validar
export const confirmManualValidation = (sessionId: string): Promise<SessionOutcome> =>
  real ? api.post(ENDPOINTS.misiones.validarSesion(sessionId)) : mock.confirmManualValidation(sessionId);

// RDF044 · consultarHistorialMisiones — GET /misiones/historial
export const getMissionHistory = (): Promise<MissionHistoryEntry[]> =>
  real ? api.get(ENDPOINTS.misiones.historial) : mock.getMissionHistory();
