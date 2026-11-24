import { GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";

import { firebaseAuth } from "./firebaseAuth";

// Inicio de sesión con Google · versión WEB: ventana emergente de Firebase.
// En el celular se usa googleSignIn.native.ts.

export async function signInWithGoogleCredential(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return (await signInWithPopup(firebaseAuth, provider)).user;
}

// En web no hay sesión de Google aparte que cerrar
export async function signOutGoogle(): Promise<void> {}
