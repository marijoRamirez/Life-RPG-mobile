import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { PixelIconName } from "@/components/ui/PixelIcons";
import { assetName, DEFAULT_BACKGROUND, itemAsset } from "@/constants/itemAssets";
import { petColorValue, petImage } from "@/constants/petTypes";
import type { WardrobeItem } from "@/models/Wardrobe";
import type { PointType } from "@/models/common";
import type { Tamagotchi } from "@/models/Tamagotchi";
import type { Attributes, UserProfile } from "@/models/UserProfile";
import { getTamagotchi } from "@/services/tamagotchiService";
import { getAttributes, getUserProfile } from "@/services/userService";
import { getWardrobe } from "@/services/wardrobeService";
import { useSession } from "./SessionProvider";

// ViewModel de la Casa / HUD principal (M01).

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const percent = (value: number) => `${Math.round(value * 100)}%`;

export function useTamagotchiViewModel() {
  const session = useSession();
  const [pet, setPet] = useState<Tamagotchi | null>(null);
  const [attributes, setAttributes] = useState<Attributes | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [p, a, u] = await Promise.all([getTamagotchi(), getAttributes(), getUserProfile()]);
      setPet(p);
      setAttributes(a);
      setProfile(u);
      // RDF016: la ropa equipada se dibuja sobre la mascota (si falla, la mascota sale sin ropa)
      setWardrobe(await getWardrobe().catch(() => []));
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

  const equippedBackground = wardrobe.find((w) => w.equipped && w.category === "Fondo");

  const today = new Date();
  const dateText = `${DAYS[today.getDay()]} ${today.getDate()} de ${MONTHS[today.getMonth()]}`;

  const attributeRows: { key: PointType; label: string; icon: PixelIconName; value: string; progress: string }[] =
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
    // Fondo equipado (o La Casa si no hay); su nombre va en la etiqueta del hábitat
    habitat: equippedBackground?.name ?? pet?.habitat ?? "",
    background: itemAsset(equippedBackground ? assetName(equippedBackground) : DEFAULT_BACKGROUND),
    // Animal elegido en la Bienvenida (M00); el gato si la cuenta aún no tiene
    petImage: petImage(session.account?.pet),
    petSpecies: session.account?.pet ?? null,
    petColor: petColorValue(session.account?.petColor),
    hp: pet?.hp ?? 100,
    hpMax: pet?.hpMax ?? 100,
    // RDF016: prendas equipadas (PetAvatar las dibuja con su imagen de constants/itemAssets.ts)
    equipped: wardrobe
      .filter((w) => w.equipped && w.category !== "Fondo")
      .map((w) => ({ id: w.id, name: w.name, icon: w.icon, asset: w.asset })),
    // Avatar del encabezado: foto de perfil o inicial del nombre
    photoUrl: session.account?.photoUrl ?? null,
    initial: (session.account?.firstName ?? profile?.displayName ?? "?").trim().charAt(0).toUpperCase(),
    attributeRows,
    error,
  };
}
