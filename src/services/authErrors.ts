// Error al iniciar sesión o crear la cuenta. El mensaje ya viene en español y listo
// para mostrarse en pantalla (los códigos de Firebase se traducen en authFirebase.ts).
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
