import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { assetName, DEFAULT_BACKGROUND, itemAsset } from "@/constants/itemAssets";
import { petImage } from "@/constants/petTypes";
import { WARDROBE_CATEGORIES } from "@/constants/wardrobeTypes";
import type { PointType, Wallet } from "@/models/common";
import type { WardrobeCategory, WardrobeItem } from "@/models/Wardrobe";
import { getPoints } from "@/services/userService";
import { getCurrentLook, getWardrobe, setEquipped } from "@/services/wardrobeService";
import { useSession } from "./SessionProvider";

// ViewModel del Vestidor (M01 · RF005). Tocar una prenda la previsualiza (RDF020);
// desde la vista previa se equipa (RDF021) o se quita (RDF022).

// Por qué no se puede usar una prenda que aún no es tuya
const lockedReason = (item: WardrobeItem) =>
  item.status === "Logro"
    ? "Se gana con un logro. Revisa tu Vitrina de medallas."
    : item.status.startsWith("LV")
      ? `Se desbloquea al llegar al nivel ${item.status.slice(3)}.`
      : `Cómprala en la tienda por ${item.status}.`;

export function useWardrobeViewModel() {
  const session = useSession();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<WardrobeCategory>("Cara");
  // RDF019: también se filtra por estadística (Cultura, Física, Enfoque)
  const [statFilter, setStatFilter] = useState<PointType | "todas">("todas");
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [stats, setStats] = useState<Wallet | null>(null);
  const [lookName, setLookName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, points, look] = await Promise.all([getWardrobe(), getPoints(), getCurrentLook()]);
      setItems(list);
      setStats(points);
      setLookName(look.name);
    } catch {
      setError("No se pudo cargar el vestidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga al volver de "Guardar look" para mostrar el nombre nuevo
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const filteredItems = useMemo(
    () => items.filter((i) => i.category === activeTab && (statFilter === "todas" || i.stat === statFilter)),
    [items, activeTab, statFilter],
  );

  const selected = items.find((i) => i.id === selectedId) ?? null;

  // Vista previa (RDF020): lo equipado, con la prenda elegida en lugar de la de su misma parte
  const previewItems = selected
    ? [...items.filter((i) => i.equipped && i.category !== selected.category), selected]
    : items.filter((i) => i.equipped);
  const previewBackground = previewItems.find((i) => i.category === "Fondo");

  const applySelected = async () => {
    if (!selected || !selected.owned || saving) return;
    setSaving(true);
    setError(null);
    try {
      const next = !selected.equipped;
      setItems(await setEquipped(selected.id, next));
      setLookName((await getCurrentLook()).name);
      setNotice(next ? `Equipaste ${selected.name}.` : `Quitaste ${selected.name}.`);
      setSelectedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar la prenda.");
    } finally {
      setSaving(false);
    }
  };

  return {
    categories: WARDROBE_CATEGORIES,
    activeTab,
    setActiveTab: (tab: WardrobeCategory) => {
      setActiveTab(tab);
      setSelectedId(null);
    },
    filteredItems,
    statFilter,
    setStatFilter: (f: PointType | "todas") => {
      setStatFilter(f);
      setSelectedId(null);
    },
    stats,
    lookName,
    loading,
    error,
    petImage: petImage(session.account?.pet),
    petSpecies: session.account?.pet ?? null,
    // Imagen de cada prenda para la cuadrícula (null = todavía no tiene asset)
    itemImage: (item: WardrobeItem) => itemAsset(assetName(item)),
    // Vista previa (RDF020): no guarda nada hasta tocar "Equipar"
    previewEquipped: previewItems
      .filter((i) => i.category !== "Fondo")
      .map((i) => ({ id: i.id, name: i.name, icon: i.icon, asset: i.asset })),
    previewBackground: itemAsset(previewBackground ? assetName(previewBackground) : DEFAULT_BACKGROUND),
    selected,
    select: (item: WardrobeItem) => {
      setNotice(null);
      setSelectedId((current) => (current === item.id ? null : item.id));
    },
    cancelPreview: () => setSelectedId(null),
    actionLabel: selected ? (selected.equipped ? "Quitar prenda" : "Equipar") : "",
    lockedText: selected && !selected.owned ? lockedReason(selected) : null,
    applySelected,
    saving,
    notice,
  };
}
