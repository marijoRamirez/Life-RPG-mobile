import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type { CheckInResult, Habit, NewHabitInput, StreakCalendar, TodayHabit } from "@/models/Quest";
import { api } from "./apiClient";
import * as mock from "./mocks/habitMock";

// Servicio del Módulo 2 (Hábitos diarios).
const real = usesApi("habitos");

// GET /habitos/hoy — RDF027 · consultarHabitosDelDia
export const getTodayHabits = (): Promise<TodayHabit[]> =>
  real ? api.get(ENDPOINTS.habitos.hoy) : mock.getTodayHabits();

// GET /habitos — todos, incluidos los pausados
export const getHabits = (): Promise<Habit[]> => (real ? api.get(ENDPOINTS.habitos.lista) : mock.getHabits());

// GET /habitos/:id
export const getHabit = (id: string): Promise<Habit> =>
  real ? api.get(ENDPOINTS.habitos.uno(id)) : mock.getHabit(id);

// POST /habitos — RDF031 · agregarHabito
export const createHabit = (input: NewHabitInput): Promise<Habit> =>
  real ? api.post(ENDPOINTS.habitos.lista, input) : mock.createHabit(input);

// PUT /habitos/:id — RDF034 · actualizarHabito (aplica desde el día siguiente)
export const updateHabit = (id: string, input: NewHabitInput): Promise<Habit> =>
  real ? api.put(ENDPOINTS.habitos.uno(id), input) : mock.updateHabit(id, input);

// PATCH /habitos/:id — RDF035 · archivarHabito (pausar o reactivar)
export const setHabitActive = (id: string, active: boolean): Promise<Habit> =>
  real ? api.patch(ENDPOINTS.habitos.uno(id), { active }) : mock.setHabitActive(id, active);

// POST /habitos/:id/checkin — RDF028 · completarHabito
export const checkIn = (id: string): Promise<CheckInResult> =>
  real ? api.post(ENDPOINTS.habitos.checkin(id)) : mock.checkIn(id);

// DELETE /habitos/:id/checkin — RDF029 · deshacerCheckIn
export const undoCheckIn = (id: string): Promise<CheckInResult> =>
  real ? api.delete(ENDPOINTS.habitos.checkin(id)) : mock.undoCheckIn(id);

// GET /habitos/rachas?mes=AAAA-MM[&habito=id] — RDF036 a RDF038
export const getStreakCalendar = (month: string, habitId: string | null): Promise<StreakCalendar> =>
  real ? api.get(ENDPOINTS.habitos.rachas(month, habitId)) : mock.getStreakCalendar(month, habitId);
