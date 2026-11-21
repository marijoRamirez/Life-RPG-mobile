import { useEffect, useState } from "react";

import { AREA_ACTION, RARITY_META } from "@/constants/achievementTypes";
import { POINT_META } from "@/constants/pointTypes";
import type { Achievement } from "@/models/Achievement";
import { claimAchievement, getAchievement } from "@/services/achievementService";
import { shortDate } from "./dateFormat";

// ViewModel de la Ficha de logro (M05 · RF017 · RDF063 y RDF064).

export function useAchievementDetailViewModel(id: string | undefined) {
  const [item, setItem] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getAchievement(id)
      .then(setItem)
      .catch(() => setError("No se pudo cargar el logro."))
      .finally(() => setLoading(false));
  }, [id]);

  const claim = async () => {
    if (!item || claiming) return;
    setClaiming(true);
    setError(null);
    try {
      const result = await claimAchievement(item.id);
      setItem(result.achievement);
      if (item.reward) {
        setNotice(`+${item.reward.points} ${POINT_META[item.reward.pointType].label} agregados a tus puntos.`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo reclamar la recompensa.");
    } finally {
      setClaiming(false);
    }
  };

  const remaining = item ? Math.max(0, item.target - item.current) : 0;

  return {
    item,
    loading,
    rarity: item ? RARITY_META[item.rarity] : null,
    progressText: item ? `${Math.min(item.current, item.target)} / ${item.target}` : "",
    progress: item ? `${Math.min(100, Math.round((item.current / item.target) * 100))}%` : "0%",
    statusText: !item
      ? ""
      : item.unlockedAt
        ? `Desbloqueado el ${shortDate(item.unlockedAt)}`
        : `Te faltan ${remaining} ${item.unit}`,
    rewardText: item?.reward
      ? `+${item.reward.points} ${POINT_META[item.reward.pointType].label}${item.reward.item ? ` · ${item.reward.item}` : ""}`
      : null,
    canClaim: Boolean(item?.unlockedAt && item.reward && !item.claimed),
    claimed: Boolean(item?.claimed),
    action: item && !item.unlockedAt ? AREA_ACTION[item.area] : null,
    claiming,
    error,
    notice,
    claim,
  };
}
