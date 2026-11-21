import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, type Persistence } from "firebase/auth";

import { firebaseApp } from "./firebaseApp";

// Versión CELULAR (Android/iOS). La sesión se guarda en el teléfono con AsyncStorage:
// el jugador inicia sesión una vez y la app ya abre con su cuenta (como Pokémon GO).
// getReactNativePersistence solo existe en la versión React Native de Firebase y sus
// tipos de TypeScript no lo incluyen, por eso se toma con require.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getReactNativePersistence } = require("firebase/auth") as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

export const firebaseAuth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
