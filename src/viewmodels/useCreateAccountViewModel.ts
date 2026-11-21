import { useState } from "react";

import {
  AGE_MAX,
  AGE_MIN,
  CUSTOM_GOAL_MAX,
  isValidEmail,
  isValidPassword,
  NAME_MAX,
  PASSWORD_RULES,
} from "@/constants/accountOptions";
import type { Gender, Goal, NewAccountInput } from "@/models/Account";
import { addPassword, AuthError, signUpWithEmail } from "@/services/authService";
import { createAccount } from "@/services/userService";
import { useSession } from "./SessionProvider";

// ViewModel de "Crear cuenta" (M00 · RDF001 agregarUsuario), ruta B de la propuesta:
//
//   nueva    → sin sesión: pide correo y contraseña, y crea la cuenta en Firebase
//   google   → entró con Google: nombre y apellido vienen de Google (editables) y define
//              una contraseña para poder entrar también con su correo
//   completar→ entró con correo pero nunca llenó sus datos: solo pide los datos
//
// Al terminar, el layout raíz lo lleva a "Bienvenido a Life-RPG" para elegir su animal.

export type CreateAccountMode = "nueva" | "google" | "completar";

// "Valeria Méndez López" → nombre "Valeria", apellido "Méndez López"
const splitName = (full: string | null | undefined) => {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
};

type Field = "email" | "password" | "firstName" | "lastName" | "age" | "gender" | "goals";

export function useCreateAccountViewModel() {
  const session = useSession();

  // El modo se fija al abrir la pantalla: al crear el usuario en Firebase la sesión
  // cambia a mitad del envío y el formulario no debe cambiar de forma.
  const [mode] = useState<CreateAccountMode>(() =>
    !session.user ? "nueva" : session.user.provider === "google" ? "google" : "completar",
  );
  const fromGoogle = splitName(session.user?.displayName);

  const [email, setEmail] = useState(session.user?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState(fromGoogle.first);
  const [lastName, setLastName] = useState(fromGoogle.last);
  const [ageText, setAgeText] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [customGoalOn, setCustomGoalOn] = useState(false);
  const [customGoal, setCustomGoal] = useState("");
  const [submitted, setSubmitted] = useState(false); // Mostrar errores hasta el primer intento
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsEmail = mode === "nueva";
  const needsPassword = mode !== "completar";
  const age = Number(ageText);

  const errors: Partial<Record<Field, string>> = {};
  if (needsEmail && !isValidEmail(email)) errors.email = "Escribe un correo válido.";
  if (needsPassword && !isValidPassword(password)) errors.password = "La contraseña no cumple las reglas.";
  if (!firstName.trim()) errors.firstName = "Escribe tu nombre.";
  if (!lastName.trim()) errors.lastName = "Escribe tu apellido.";
  if (!/^\d+$/.test(ageText) || age < AGE_MIN || age > AGE_MAX) errors.age = `Edad de ${AGE_MIN} a ${AGE_MAX}.`;
  if (!gender) errors.gender = "Elige una opción.";
  if (goals.length === 0 && !(customGoalOn && customGoal.trim())) errors.goals = "Elige al menos una meta o escribe la tuya.";

  const isValid = Object.keys(errors).length === 0;

  const toggleGoal = (goal: Goal) =>
    setGoals((current) => (current.includes(goal) ? current.filter((g) => g !== goal) : [...current, goal]));

  const submit = async () => {
    setSubmitted(true);
    if (!isValid || saving) return;
    setSaving(true);
    setError(null);
    try {
      let accountEmail = session.user?.email ?? email.trim();
      if (mode === "nueva" && !session.user) {
        // Si un intento anterior ya creó el usuario en Firebase, no se vuelve a crear
        accountEmail = (await signUpWithEmail(email, password)).email;
      }
      if (mode === "google") await addPassword(password);

      const input: NewAccountInput = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age,
        gender: gender!,
        goals,
        customGoal: customGoalOn && customGoal.trim() ? customGoal.trim() : null,
      };
      await createAccount(accountEmail, input);
      await session.refreshAccount(); // El layout lleva a la Bienvenida
    } catch (e) {
      setError(e instanceof AuthError || e instanceof Error ? e.message : "No se pudo crear tu cuenta.");
      setSaving(false);
    }
  };

  const fieldError = (field: Field) => (submitted ? errors[field] ?? null : null);

  return {
    mode,
    needsEmail,
    needsPassword,
    title: mode === "completar" ? "Completa tu cuenta" : "Crear cuenta",
    subtitle:
      mode === "google"
        ? "Tomamos tu nombre de Google. Puedes cambiarlo. Crea también una contraseña para entrar con tu correo en otro celular."
        : mode === "completar"
          ? "Solo faltan tus datos para empezar a jugar."
          : "Con esta cuenta guardas tu progreso aunque cambies de celular.",
    email,
    setEmail,
    emailLocked: mode !== "nueva",
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    passwordRules: PASSWORD_RULES.map((r) => ({ label: r.label, ok: r.test(password) })),
    firstName,
    setFirstName: (v: string) => setFirstName(v.slice(0, NAME_MAX)),
    lastName,
    setLastName: (v: string) => setLastName(v.slice(0, NAME_MAX)),
    ageText,
    setAgeText: (v: string) => setAgeText(v.replace(/\D/g, "").slice(0, 3)),
    gender,
    setGender,
    goals,
    toggleGoal,
    customGoalOn,
    toggleCustomGoal: () => setCustomGoalOn((v) => !v),
    customGoal,
    setCustomGoal: (v: string) => setCustomGoal(v.slice(0, CUSTOM_GOAL_MAX)),
    fieldError,
    saving,
    error,
    submit,
    // Salir: sin sesión regresa al Login; con sesión la cierra para usar otra cuenta
    canGoBack: mode === "nueva",
    useAnotherAccount: session.signOut,
  };
}
