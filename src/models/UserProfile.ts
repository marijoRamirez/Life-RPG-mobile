// Modelo del perfil del usuario (Módulo 1 · Tamagotchi y perfil).
// Solo define la forma de los datos; no contiene lógica.

export interface UserProfile {
  id: string;
  displayName: string; // Nombre con el que se le saluda en la Casa
  hasMoodLogToday: boolean; // Si ya registró su ánimo hoy (M06, RDF017)
}
