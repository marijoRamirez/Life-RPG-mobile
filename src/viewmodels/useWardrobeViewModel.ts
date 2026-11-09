import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import type { StatPoints, WardrobeCategory, WardrobeItem } from "@/models/Wardrobe";
import { getCurrentLook, getStatPoints, getWardrobe } from "@/services/wardrobeService";

// ViewModel del Vestidor (M01).

export const WARDROBE_CATEGORIES: WardrobeCategory[] = ["Cabeza", "Cara", "Cuerpo", "Fondo"];

export function useWardrobeViewModel() {
  const [activeTab, setActiveTab] = useState<WardrobeCategory>("Cara");
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [stats, setStats] = useState<StatPoints | null>(null);
  const [lookName, setLookName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, points, look] = await Promise.all([getWardrobe(), getStatPoints(), getCurrentLook()]);
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

  const filteredItems = useMemo(() => items.filter((i) => i.category === activeTab), [items, activeTab]);

  return { categories: WARDROBE_CATEGORIES, activeTab, setActiveTab, filteredItems, stats, lookName, loading, error };
}
