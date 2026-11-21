// Modelos de la cuenta del jugador (M00 · Usuarios y autenticación).
// Solo definen la forma de los datos; no contienen lógica.

// Animales que se pueden elegir al crear la cuenta (imágenes en assets/images)
export type PetSpecies = "gato" | "perro" | "dragon" | "hamster" | "leon";

// Color de la mascota (RDF026). Los sprites son pixel art fijos, así que el color se
// aplica a su aura y a su hábitat en la Casa.
export type PetColor = "verde" | "morado" | "rojo" | "azul" | "naranja";

export type Gender = "mujer" | "hombre" | "no_binario" | "prefiero_no_decir";

// Metas sugeridas al crear la cuenta; además el jugador puede escribir una propia
export type Goal = "lectura" | "ejercicio" | "enfoque" | "sueno" | "animo";

// Con qué inició sesión: correo y contraseña o Google
export type AuthProvider = "password" | "google";

// Usuario autenticado (lo da Firebase o el modo de prueba). No es la cuenta del juego.
export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null; // Nombre completo que trae Google, si entró con Google
  provider: AuthProvider;
}

// Cuenta del juego, guardada en el backend. null hasta que llene "Crear cuenta".
export interface Account {
  id: string; // Mismo uid de Firebase
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  goals: Goal[];
  customGoal: string | null; // Meta escrita por el jugador
  pet: PetSpecies | null; // null hasta que elija su animal en "Bienvenido a Life-RPG"
  photoUrl: string | null; // Foto de perfil (RDF026); null = se muestra la inicial
  petColor: PetColor; // Color de la mascota (RDF026); "verde" por defecto
  createdAt: string; // ISO 8601
}

// Cambios desde "Mi perfil" (RDF024 y RDF026). El correo se cambia aparte (Firebase).
export type AccountChanges = Partial<NewAccountInput> & { photoUrl?: string | null; petColor?: PetColor };

// Datos del formulario "Crear cuenta" (la contraseña la maneja Firebase, no el backend)
export interface NewAccountInput {
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  goals: Goal[];
  customGoal: string | null;
}
