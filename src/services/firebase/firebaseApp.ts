import { getApp, getApps, initializeApp } from "firebase/app";

import { FIREBASE_CONFIG } from "@/config/env";

// Proyecto de Firebase de Life-RPG. Se inicia una sola vez.
// La configuración viene del .env (variables EXPO_PUBLIC_FIREBASE_*).
// Analytics no se usa: no funciona en React Native.
export const firebaseApp = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
