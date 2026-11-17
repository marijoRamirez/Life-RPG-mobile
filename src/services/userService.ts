import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type { Wallet } from "@/models/common";
import type { Attributes, PrivacySettings, UserProfile } from "@/models/UserProfile";
import { api } from "./apiClient";
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
