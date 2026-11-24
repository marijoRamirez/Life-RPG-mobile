import { GoogleAuthProvider, signInWithCredential, type User } from "firebase/auth";

import { GOOGLE_WEB_CLIENT_ID } from "@/config/env";
import { AuthError } from "../authErrors";
import { firebaseAuth } from "./firebaseAuth";

// Inicio de sesión con Google · versión CELULAR (M00).
// La librería nativa de Google muestra el selector de cuentas y devuelve un idToken;
// con él se entra a Firebase (signInWithCredential). Necesita la app compilada
// (development build: `npx expo run:android`), no Expo Go: ahí no existe el módulo
// nativo, por eso la librería se carga bajo demanda y no con un import arriba.

type GoogleSigninModule = typeof import("@react-native-google-signin/google-signin");

let google: GoogleSigninModule | null | undefined;

function getGoogle(): GoogleSigninModule | null {
  if (google !== undefined) return google;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod: GoogleSigninModule = require("@react-native-google-signin/google-signin");
    // webClientId = ID de cliente WEB de Firebase: sin él Google no entrega el idToken
    mod.GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });
    google = mod;
  } catch (error) {
    console.warn("[googleSignIn] Módulo nativo de Google no disponible (¿Expo Go?):", error);
    google = null;
  }
  return google;
}

export async function signInWithGoogleCredential(): Promise<User> {
  const mod = getGoogle();
  if (!mod) {
    throw new AuthError("Google necesita la versión instalada de la app (no Expo Go). Por ahora entra con tu correo.");
  }
  const { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } = mod;

  let idToken: string | null;
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      throw new AuthError("Cerraste la ventana de Google antes de terminar.");
    }
    idToken = response.data.idToken;
  } catch (error) {
    if (error instanceof AuthError) throw error;
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.IN_PROGRESS) throw new AuthError("Ya se está iniciando sesión con Google.");
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new AuthError("Este celular no tiene Google Play Services actualizado.");
      }
      // DEVELOPER_ERROR (código 10): falta registrar la huella SHA-1 / el paquete en Firebase
      console.warn("[googleSignIn] Error de Google:", error.code, error.message);
    }
    throw error;
  }

  if (!idToken) {
    throw new AuthError("Google no devolvió el token. Revisa EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.");
  }
  const credential = GoogleAuthProvider.credential(idToken);
  return (await signInWithCredential(firebaseAuth, credential)).user;
}

// Al cerrar sesión también se cierra la de Google, para que la próxima vez pregunte la cuenta
export async function signOutGoogle(): Promise<void> {
  await getGoogle()?.GoogleSignin.signOut().catch(() => undefined);
}
