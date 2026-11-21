import { useEffect, useState } from "react";

import { ICON_OPTIONS, PRICE_STEP } from "@/constants/shopTypes";
import type { PointType } from "@/models/common";
import type { ItemIconName, SuggestedPrice } from "@/models/Item";
import {
  createCustomReward,
  deleteCustomReward,
  getCustomReward,
  getSuggestedPrice,
  updateCustomReward,
} from "@/services/shopService";

// ViewModel de 4.2 Recompensa personalizada. Sin id crea (RDF053); con id edita (RDF055)
// y permite eliminarla (RDF056).

export function useRewardCreatorViewModel(rewardId?: string) {
  const editing = Boolean(rewardId);
  const [icon, setIcon] = useState<ItemIconName>(ICON_OPTIONS[0]);
  const [name, setName] = useState("Noche de cine con amigos");
  const [description, setDescription] = useState("Película en el cine del centro, con palomitas grandes.");
  const [pointType, setPointType] = useState<PointType>("cultura");
  const [price, setPrice] = useState(300);
  const [consumable, setConsumable] = useState(true);
  const [suggested, setSuggested] = useState<SuggestedPrice | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    getSuggestedPrice().then(setSuggested).catch(() => setSuggested(null));
  }, []);

  // Al editar, carga los datos actuales de la recompensa
  useEffect(() => {
    if (!rewardId) return;
    getCustomReward(rewardId)
      .then((r) => {
        setIcon(r.icon);
        setName(r.name);
        setDescription(r.description);
        setPointType(r.pointType);
        setPrice(r.price);
        setConsumable(r.consumable);
      })
      .catch(() => setError("No se pudo cargar la recompensa."));
  }, [rewardId]);

  // Acepta solo dígitos del campo de texto del precio
  const setPriceFromText = (text: string) => {
    const n = parseInt(text.replace(/[^0-9]/g, ""), 10);
    setPrice(Number.isNaN(n) ? 0 : n);
  };
  const decreasePrice = () => setPrice((p) => Math.max(0, p - PRICE_STEP));
  const increasePrice = () => setPrice((p) => p + PRICE_STEP);

  // RDF054: el precio debe quedar dentro del rango de la economía global (M14)
  const outOfRange =
    suggested !== null && (price < suggested.allowedMin || price > suggested.allowedMax)
      ? `El precio debe estar entre ${suggested.allowedMin} y ${suggested.allowedMax} puntos.`
      : null;
  const canSave = name.trim().length > 0 && price > 0 && !outOfRange && !saving;

  // Devuelve el nombre guardado, o null si falló, para que la vista decida qué mostrar
  const save = async (): Promise<string | null> => {
    setSaving(true);
    setError(null);
    try {
      const input = { icon, name, description, pointType, price, consumable };
      const saved = rewardId ? await updateCustomReward(rewardId, input) : await createCustomReward(input);
      return saved.name;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la recompensa.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Dos toques: el primero pide confirmación. Devuelve true si se eliminó.
  const remove = async (): Promise<boolean> => {
    if (!rewardId) return false;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return false;
    }
    setSaving(true);
    setError(null);
    try {
      await deleteCustomReward(rewardId);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la recompensa.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    editing,
    remove,
    confirmDelete,
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
    outOfRange,
    canSave,
    save,
    saving,
    error,
  };
}
