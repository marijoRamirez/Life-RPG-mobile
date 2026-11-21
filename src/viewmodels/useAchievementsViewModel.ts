import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { Achievement } from "@/models/Achievement";
import { getAchievements } from "@/services/achievementService";
import { shortDate } from "./dateFormat";

// ViewModel de la Vitrina de medallas (M05 · RF016 · RDF060).

export function useAchievementsViewModel() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await getAchievements());
    } catch {
      setError("No se pudieron cargar tus logros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const unlocked = items.filter((a) => a.unlockedAt);
  // Primero los desbloqueados (más recientes primero), luego los bloqueados más avanzados
  const sorted = [
    ...unlocked.sort((a, b) => (b.unlockedAt ?? "").localeCompare(a.unlockedAt ?? "")),
    ...items.filter((a) => !a.unlockedAt).sort((a, b) => b.current / b.target - a.current / a.target),
  ];
  const closest = items.filter((a) => !a.unlockedAt).sort((a, b) => b.current / b.target - a.current / a.target)[0];
  const toClaim = unlocked.filter((a) => a.reward && !a.claimed).length;

  return {
    percent: items.length ? `${Math.round((unlocked.length / items.length) * 100)}%` : "0%",
    countText: `${unlocked.length} de ${items.length} desbloqueados`,
    closestText: closest ? `Más cerca: ${closest.name} · ${closest.current}/${closest.target}` : null,
    closestId: closest?.id ?? null,
    toClaimText: toClaim ? `${toClaim} recompensa${toClaim > 1 ? "s" : ""} por reclamar` : null,
    cards: sorted.map((a) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      unlocked: Boolean(a.unlockedAt),
      caption: a.unlockedAt ? shortDate(a.unlockedAt) : `${a.current}/${a.target}`,
      progress: `${Math.min(100, Math.round((a.current / a.target) * 100))}%`,
      pendingClaim: Boolean(a.unlockedAt && a.reward && !a.claimed),
    })),
    loading,
    error,
  };
}
