import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

import { AGE_MAX, AGE_MIN, CUSTOM_GOAL_MAX, isValidEmail, NAME_MAX } from "@/constants/accountOptions";
import { PET_COLORS, petImage, petLabel } from "@/constants/petTypes";
import type { Gender, Goal, PetColor } from "@/models/Account";
import { AuthError, changeEmail } from "@/services/authService";
import { getTamagotchi } from "@/services/tamagotchiService";
import { updateAccount } from "@/services/userService";
import { monthYear } from "./dateFormat";
import { useSession } from "./SessionProvider";

// ViewModel de "Mi perfil" (M01 · RF006): datos de la cuenta, foto y correo.
// La contraseña se cambia en su propia pantalla (cambioContrasenia).

export function useProfileViewModel() {
  const session = useSession();
  const account = session.account;

  const [firstName, setFirstName] = useState(account?.firstName ?? "");
  const [lastName, setLastName] = useState(account?.lastName ?? "");
  const [ageText, setAgeText] = useState(account ? String(account.age) : "");
  const [gender, setGender] = useState<Gender | null>(account?.gender ?? null);
  const [goals, setGoals] = useState<Goal[]>(account?.goals ?? []);
  const [customGoal, setCustomGoal] = useState(account?.customGoal ?? "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(account?.photoUrl ?? null);
  const [petColor, setPetColor] = useState<PetColor>(account?.petColor ?? "verde");
  const [email, setEmail] = useState(session.user?.email ?? account?.email ?? "");
  const [level, setLevel] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    getTamagotchi()
      .then((t) => setLevel(t.level))
      .catch(() => setLevel(null));
  }, []);

  const age = Number(ageText);
  const originalEmail = session.user?.email ?? account?.email ?? "";
  const emailChanged = email.trim().toLowerCase() !== originalEmail.toLowerCase();

  const problem = !firstName.trim()
    ? "Escribe tu nombre."
    : !lastName.trim()
      ? "Escribe tu apellido."
      : !/^\d+$/.test(ageText) || age < AGE_MIN || age > AGE_MAX
        ? `La edad debe ser de ${AGE_MIN} a ${AGE_MAX}.`
        : emailChanged && !isValidEmail(email)
          ? "Escribe un correo válido."
          : null;

  // RDF026: elegir foto de la galería (en producción se sube al servidor)
  const pickPhoto = async () => {
    setError(null);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });
      if (!result.canceled && result.assets[0]) setPhotoUrl(result.assets[0].uri);
    } catch {
      setError("No se pudo abrir tu galería.");
    }
  };

  const toggleGoal = (goal: Goal) =>
    setGoals((current) => (current.includes(goal) ? current.filter((g) => g !== goal) : [...current, goal]));

  const save = async () => {
    if (problem || saving) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await updateAccount({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age,
        gender: gender ?? undefined,
        goals,
        customGoal: customGoal.trim() || null,
        photoUrl,
        petColor,
      });
      if (emailChanged) await changeEmail(email);
      await session.refreshAccount();
      setNotice(
        emailChanged
          ? `Cambios guardados. Te enviamos un enlace a ${email.trim()} para confirmar tu correo nuevo.`
          : "Cambios guardados.",
      );
    } catch (e) {
      setError(e instanceof AuthError || e instanceof Error ? e.message : "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${firstName} ${lastName}`.trim();

  return {
    fullName: fullName || "Tu nombre",
    initial: (firstName.trim()[0] ?? "?").toUpperCase(),
    photoUrl,
    pickPhoto,
    sinceText: account
      ? `Jugador${account.gender === "mujer" ? "a" : ""} desde ${monthYear(new Date(account.createdAt))}${level ? ` · LV ${level}` : ""}`
      : "",
    firstName,
    setFirstName: (v: string) => setFirstName(v.slice(0, NAME_MAX)),
    lastName,
    setLastName: (v: string) => setLastName(v.slice(0, NAME_MAX)),
    email,
    setEmail,
    ageText,
    setAgeText: (v: string) => setAgeText(v.replace(/\D/g, "").slice(0, 3)),
    gender,
    setGender,
    goals,
    toggleGoal,
    customGoal,
    setCustomGoal: (v: string) => setCustomGoal(v.slice(0, CUSTOM_GOAL_MAX)),
    petImage: petImage(account?.pet),
    petLabel: petLabel(account?.pet),
    petColors: PET_COLORS,
    petColor,
    setPetColor,
    saving,
    error,
    notice,
    save,
  };
}
