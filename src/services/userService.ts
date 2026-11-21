import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type { Account, AccountChanges, NewAccountInput, PetSpecies } from "@/models/Account";
import type { Wallet } from "@/models/common";
import type { Attributes, PrivacySettings, UserProfile } from "@/models/UserProfile";
import { api, ApiError } from "./apiClient";
import * as mock from "./mocks/userMock";

// Servicio del usuario actual (compartido por varios módulos).
// Única fuente de los puntos del usuario: Casa, Tienda y Vestidor leen de aquí.
const real = usesApi("usuarios");

// GET /usuarios/me
export const getUserProfile = (): Promise<UserProfile> =>
  real ? api.get(ENDPOINTS.usuarios.yo) : mock.getUserProfile();

// GET /usuarios/me/puntos
export const getPoints = (): Promise<Wallet> =>
  real ? api.get(ENDPOINTS.usuarios.puntos) : mock.getPoints();

// GET /usuarios/me/atributos
export const getAttributes = (): Promise<Attributes> =>
  real ? api.get(ENDPOINTS.usuarios.atributos) : mock.getAttributes();

// RDF071 · aplicarPrivacidadRegistro — GET /usuarios/me/privacidad
export const getPrivacy = (): Promise<PrivacySettings> =>
  real ? api.get(ENDPOINTS.usuarios.privacidad) : mock.getPrivacy();

// ── Cuenta del juego (M00) ─────────────────────────────────────────────

// GET /usuarios/me/cuenta — null (404) si todavía no llena "Crear cuenta"
export const getAccount = async (): Promise<Account | null> => {
  if (!real) return mock.getAccount();
  try {
    return await api.get<Account>(ENDPOINTS.usuarios.cuenta);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
};

// POST /usuarios/me/cuenta — RDF001 · agregarUsuario (datos del formulario)
export const createAccount = (email: string, input: NewAccountInput): Promise<Account> =>
  real ? api.post(ENDPOINTS.usuarios.cuenta, input) : mock.createAccount(email, input);

// PUT /usuarios/me/mascota — animal elegido en "Bienvenido a Life-RPG" (una sola vez por cuenta)
export const choosePet = (pet: PetSpecies): Promise<Account> =>
  real ? api.put(ENDPOINTS.usuarios.mascota, { pet }) : mock.choosePet(pet);

// PUT /usuarios/me/cuenta — Mi perfil: nombre, edad, género, metas y foto (RDF024, RDF026)
export const updateAccount = (changes: AccountChanges): Promise<Account> =>
  real ? api.put(ENDPOINTS.usuarios.cuenta, changes) : mock.updateAccount(changes);

// PUT /usuarios/me/privacidad — Ajustes › Privacidad (RDF071)
export const updatePrivacy = (visibleToViewers: boolean): Promise<PrivacySettings> =>
  real ? api.put(ENDPOINTS.usuarios.privacidad, { visibleToViewers }) : mock.updatePrivacy(visibleToViewers);
