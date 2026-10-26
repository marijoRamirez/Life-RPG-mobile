import type {
  FailReason,
  FocusSession,
  Mission,
  MissionHistoryEntry,
  MissionReward,
  MissionType,
  NewMissionInput,
  SessionOutcome,
  WearableActivity,
} from "@/models/Mission";

// Servicio del Módulo 3 (Misiones únicas y enfoque).
// Mientras no esté el backend, los datos viven en memoria y cada función
// simula su endpoint. Al conectar la API, sustituir el cuerpo de cada
// función por la petición indicada en su comentario usando apiClient.

const MOCK_LATENCY_MS = 250;
// Cambiar a false para probar la validación manual de misiones físicas
const MOCK_WEARABLE_CONNECTED = true;

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));

let nextId = 100;
const newId = (prefix: string) => `${prefix}-${nextId++}`;

// RDF038 · calcularRecompensaMision. En producción la calcula el servidor
// según la fórmula de M14; aquí solo se imita para el mock.
// El tipo no cambia el monto en el mock, pero se recibe porque el servidor sí lo usa.
export function previewReward(_type: MissionType, durationMin: number): MissionReward {
  return { xp: Math.round(durationMin * 1.2), points: durationMin };
}

const mission = (id: string, title: string, type: MissionType, durationMin: number): Mission => ({
  id,
  title,
  type,
  durationMin,
  reward: previewReward(type, durationMin),
});

let activeMissions: Mission[] = [
  mission("m-1", "Terminar ensayo de historia", "enfoque", 50),
  mission("m-2", "Correr 5 km", "fisico", 40),
  mission("m-3", "Ver un documental de ciencia", "cultura", 90),
  mission("m-4", "Visitar el museo de la ciudad", "cultura", 120),
  mission("m-5", "Ordenar escritorio y planear semana", "enfoque", 30),
  mission("m-6", "Clase de natación", "fisico", 60),
];

const daysAgo = (days: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

let history: MissionHistoryEntry[] = [
  { id: "h-1", title: "Repasar álgebra", type: "enfoque", durationMin: 45, status: "completada", finishedAt: daysAgo(1, 18), validation: "bloqueo", reward: previewReward("enfoque", 45) },
  { id: "h-2", title: "Terminar novela", type: "cultura", durationMin: 60, status: "completada", finishedAt: daysAgo(3, 21), validation: "manual", reward: previewReward("cultura", 60) },
  { id: "h-3", title: "Preparar exposición", type: "enfoque", durationMin: 50, status: "fallida", finishedAt: daysAgo(4, 17), failReason: "rendicion", reward: { xp: 0, points: 0 } },
  { id: "h-4", title: "Bici 12 km", type: "fisico", durationMin: 45, status: "completada", finishedAt: daysAgo(5, 8), validation: "smartwatch", reward: previewReward("fisico", 45) },
  { id: "h-5", title: "Meditación guiada", type: "enfoque", durationMin: 15, status: "fallida", finishedAt: daysAgo(6, 22), failReason: "salio_app", reward: { xp: 0, points: 0 } },
];

const sessions = new Map<string, FocusSession>();
const outcomes = new Map<string, SessionOutcome>();

// RDF035 · consultarMisionesActivas — GET /misiones?estado=activa
export function getActiveMissions(): Promise<Mission[]> {
  return delay([...activeMissions]);
}

export function getMission(missionId: string): Promise<Mission | undefined> {
  return delay(activeMissions.find((m) => m.id === missionId));
}

// RDF037 · agregarMision — POST /misiones
export function createMission(input: NewMissionInput): Promise<Mission> {
  const title = input.title.trim();
  if (!title) return Promise.reject(new Error("Escribe un título para la misión."));
  const created = mission(newId("m"), title, input.type, input.durationMin);
  activeMissions = [created, ...activeMissions];
  return delay(created);
}

// RDF039 · iniciarSesionEnfoque — POST /misiones/{id}/sesiones
export async function startSession(missionId: string): Promise<FocusSession> {
  const found = activeMissions.find((m) => m.id === missionId);
  if (!found) throw new Error("La misión ya no está activa.");
  const session: FocusSession = {
    id: newId("s"),
    missionId,
    startedAt: new Date().toISOString(),
    durationMin: found.durationMin,
    locksDevice: found.type === "enfoque",
  };
  sessions.set(session.id, session);
  return delay(session);
}

const closeMission = (session: FocusSession) => {
  const found = activeMissions.find((m) => m.id === session.missionId);
  activeMissions = activeMissions.filter((m) => m.id !== session.missionId);
  sessions.delete(session.id);
  return found;
};

// RDF040 · rendirseSesion — POST /sesiones/{id}/fallar
export async function failSession(sessionId: string, reason: FailReason): Promise<void> {
  const session = sessions.get(sessionId);
  if (!session) return;
  const found = closeMission(session);
  if (found) {
    history = [
      {
        id: newId("h"),
        title: found.title,
        type: found.type,
        durationMin: found.durationMin,
        status: "fallida",
        finishedAt: new Date().toISOString(),
        failReason: reason,
        reward: { xp: 0, points: 0 },
      },
      ...history,
    ];
  }
  await delay(undefined);
}

// RDF043 · validarMisionFisica — lectura de Health Connect en segundo plano.
// Requiere un módulo nativo (development build); en Expo Go se simula.
function readWearable(found: Mission): WearableActivity | undefined {
  if (!MOCK_WEARABLE_CONNECTED) return undefined;
  return { distanceKm: 5.2, steps: 6840, activeMin: found.durationMin };
}

const recordCompleted = (outcome: SessionOutcome) => {
  const { mission: m } = outcome;
  history = [
    {
      id: newId("h"),
      title: m.title,
      type: m.type,
      durationMin: m.durationMin,
      status: "completada",
      finishedAt: new Date().toISOString(),
      validation: outcome.validation,
      reward: m.reward,
    },
    ...history,
  ];
};

// RDF041 · finalizarSesionEnfoque — POST /sesiones/{id}/finalizar
export async function finishSession(sessionId: string): Promise<SessionOutcome> {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("La sesión ya terminó.");
  const found = closeMission(session);
  if (!found) throw new Error("La misión ya no está activa.");

  let outcome: SessionOutcome;
  if (found.type === "enfoque") {
    outcome = { sessionId, mission: found, validation: "bloqueo", claimed: true };
  } else {
    const activity = found.type === "fisico" ? readWearable(found) : undefined;
    outcome = activity
      ? { sessionId, mission: found, validation: "smartwatch", activity, claimed: true }
      : { sessionId, mission: found, validation: "manual", claimed: false };
  }
  if (outcome.claimed) recordCompleted(outcome);
  outcomes.set(sessionId, outcome);
  return delay(outcome);
}

export function getSessionOutcome(sessionId: string): Promise<SessionOutcome | undefined> {
  return delay(outcomes.get(sessionId));
}

// RDF043 · validación manual cuando no hay smartwatch
export async function confirmManualValidation(sessionId: string): Promise<SessionOutcome> {
  const outcome = outcomes.get(sessionId);
  if (!outcome) throw new Error("No se encontró la sesión.");
  if (!outcome.claimed) {
    outcome.claimed = true;
    recordCompleted(outcome);
  }
  return delay({ ...outcome });
}

// RDF044 · consultarHistorialMisiones — GET /misiones/historial
export function getMissionHistory(): Promise<MissionHistoryEntry[]> {
  return delay([...history]);
}
