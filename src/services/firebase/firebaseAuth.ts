import { browserLocalPersistence, initializeAuth } from "firebase/auth";

import { firebaseApp } from "./firebaseApp";

// Versión WEB (Expo con "w"). La sesión se guarda en el navegador y sigue abierta
// al recargar. En el celular se usa firebaseAuth.native.ts.
export const firebaseAuth = initializeAuth(firebaseApp, { persistence: browserLocalPersistence });
