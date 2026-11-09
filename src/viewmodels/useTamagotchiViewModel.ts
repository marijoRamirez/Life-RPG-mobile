import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { PixelIconName } from "@/components/ui/PixelIcons";
import type { Attributes, Tamagotchi } from "@/models/Tamagotchi";
import type { UserProfile } from "@/models/UserProfile";
import { getAttributes, getTamagotchi, getUserProfile } from "@/services/tamagotchiService";

// ViewModel de la Casa / HUD principal (M01).

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const percent = (value: number) => `${Math.round(value * 100)}%`;

export function useTamagotchiViewModel() {
  const [pet, setPet] = useState<Tamagotchi | null>(null);
  const [attributes, setAttributes] = useState<Attributes | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [p, a, u] = await Promise.all([getTamagotchi(), getAttributes(), getUserProfile()]);
      setPet(p);
      setAttributes(a);
      setProfile(u);
    } catch {
      setError("No se pudo cargar tu mascota.");
    }
  }, []);

  // Recarga al volver (p. ej. para ocultar la burbuja después de registrar el ánimo)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const today = new Date();
  const dateText = `${DAYS[today.getDay()]} ${today.getDate()} de ${MONTHS[today.getMonth()]}`;

  const attributeRows: { key: keyof Attributes; label: string; icon: PixelIconName; value: string; progress: string }[] =
    attributes
      ? [
          { key: "cultura", label: "Puntos de Cultura", icon: "book-open", value: String(attributes.cultura.value), progress: percent(attributes.cultura.progress) },
          { key: "fisico", label: "Puntos Físicos", icon: "dumbbell", value: String(attributes.fisico.value), progress: percent(attributes.fisico.progress) },
          { key: "enfoque", label: "Puntos de Enfoque", icon: "focus", value: String(attributes.enfoque.value), progress: percent(attributes.enfoque.progress) },
        ]
      : [];

  return {
    dateText,
    greeting: profile ? `Hola, ${profile.displayName}` : "Hola",
    // RDF017: la burbuja se muestra mientras no haya registro de ánimo del día
    showMoodBubble: profile ? !profile.hasMoodLogToday : false,
    level: pet?.level ?? 0,
    petTitle: pet ? `${pet.name} · ${pet.title}` : "",
    xpText: pet ? `${pet.xp} / ${pet.xpForNextLevel} XP para nivel ${pet.level + 1}` : "",
    hpText: pet ? `${pet.hp}/${pet.hpMax}` : "",
    hpWidth: pet ? percent(pet.hp / pet.hpMax) : "0%",
    xpPercent: pet ? percent(pet.xp / pet.xpForNextLevel) : "0%",
    habitat: pet?.habitat ?? "",
    attributeRows,
    error,
  };
}
