import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type {
  JournalEntry,
  JournalEntryInput,
  MoodLog,
  MoodPeriod,
  MoodRegisterResult,
  MoodReminder,
  MoodTrend,
  NewMoodLogInput,
} from "@/models/MoodLog";
import { api } from "./apiClient";
import * as mock from "./mocks/moodMock";

// Servicio del Módulo 6 (Estado de ánimo).
// La privacidad del registro (RDF071) se consulta en userService (getPrivacy).
const real = usesApi("animo");

// GET /animo/hoy — null si hoy no hay registro
export const getTodayMoodLog = (): Promise<MoodLog | null> =>
  real ? api.get(ENDPOINTS.animo.hoy) : mock.getTodayMoodLog();

// RDF068 y RDF069 · registrarEstadoAnimo — POST /animo
// Si ya hay registro hoy se actualiza y no se vuelve a dar XP.
export const registerMood = (input: NewMoodLogInput): Promise<MoodRegisterResult> =>
  real ? api.post(ENDPOINTS.animo.registrar, input) : mock.registerMood(input);

// RDF070 · programarRecordatorioAnimo — GET y PUT /animo/recordatorio
export const getMoodReminder = (): Promise<MoodReminder> =>
  real ? api.get(ENDPOINTS.animo.recordatorio) : mock.getMoodReminder();

export const updateMoodReminder = (reminder: MoodReminder): Promise<MoodReminder> =>
  real ? api.put(ENDPOINTS.animo.recordatorio, reminder) : mock.updateMoodReminder(reminder);

// RDF072 a RDF074 · consultarTendenciaAnimo — GET /animo/tendencia?periodo=semana|mes
export const getMoodTrend = (period: MoodPeriod): Promise<MoodTrend> =>
  real ? api.get(ENDPOINTS.animo.tendencia(period)) : mock.getMoodTrend(period);

// RDF077 · consultarEntradasDiario — GET /animo/diario
export const getJournalEntries = (): Promise<JournalEntry[]> =>
  real ? api.get(ENDPOINTS.animo.diario) : mock.getJournalEntries();

// RDF075 · agregarEntradaDiario — POST /animo/diario
export const createJournalEntry = (input: JournalEntryInput): Promise<JournalEntry> =>
  real ? api.post(ENDPOINTS.animo.diario, input) : mock.createJournalEntry(input);

// RDF076 y RDF078 · actualizarEntradaDiario — PUT /animo/diario/:id
export const updateJournalEntry = (id: string, input: JournalEntryInput): Promise<JournalEntry> =>
  real ? api.put(ENDPOINTS.animo.entrada(id), input) : mock.updateJournalEntry(id, input);

// RDF078 · eliminar entrada — DELETE /animo/diario/:id
export const deleteJournalEntry = (id: string): Promise<void> =>
  real ? api.delete(ENDPOINTS.animo.entrada(id)) : mock.deleteJournalEntry(id);
