import { useEffect, useState } from "react";

import { ICON_OPTIONS, PRICE_STEP } from "@/constants/shopTypes";
import type { ItemIconName, PointType, SuggestedPrice } from "@/models/Item";
import { createCustomReward, getSuggestedPrice } from "@/services/shopService";

// ViewModel de 4.2 Recompensa personalizada.

export function useRewardCreatorViewModel() {
  const [icon, setIcon] = useState<ItemIconName>(ICON_OPTIONS[0]);
  const [name, setName] = useState("Noche de cine con amigos");
  const [description, setDescription] = useState("Película en el cine del centro, con palomitas grandes.");
  const [pointType, setPointType] = useState<PointType>("cultura");
  const [price, setPrice] = useState(300);
  const [consumable, setConsumable] = useState(true);
  const [suggested, setSuggested] = useState<SuggestedPrice | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSuggestedPrice().then(setSuggested).catch(() => setSuggested(null));
  }, []);

  // Acepta solo dígitos del campo de texto del precio
  const setPriceFromText = (text: string) => {
    const n = parseInt(text.replace(/[^0-9]/g, ""), 10);
    setPrice(Number.isNaN(n) ? 0 : n);
  };
  const decreasePrice = () => setPrice((p) => Math.max(0, p - PRICE_STEP));
  const increasePrice = () => setPrice((p) => p + PRICE_STEP);

  const canSave = name.trim().length > 0 && price > 0 && !saving;

  // Devuelve el nombre guardado, o null si falló, para que la vista decida qué mostrar
  const save = async (): Promise<string | null> => {
    setSaving(true);
    setError(null);
    try {
      const created = await createCustomReward({ icon, name, description, pointType, price, consumable });
      return created.name;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la recompensa.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    icon,
    setIcon,
    name,
    setName,
    description,
    setDescription,
    pointType,
    setPointType,
    price,
    setPriceFromText,
    decreasePrice,
    increasePrice,
    consumable,
    setConsumable,
    suggested,
    canSave,
    save,
    saving,
    error,
  };
}
