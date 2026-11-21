import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { RedemptionEntry } from "@/models/Item";
import { getRedemptions } from "@/services/shopService";
import { shortDate } from "./dateFormat";

// ViewModel del Historial de canjes (M04 · RDF059).

export function useRedemptionHistoryViewModel() {
  const [items, setItems] = useState<RedemptionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      getRedemptions()
        .then(setItems)
        .catch(() => setError("No se pudo cargar tu historial."))
        .finally(() => setLoading(false));
    }, []),
  );

  return {
    loading,
    error,
    rows: items.map((r) => ({
      ...r,
      kindText: r.kind === "recompensa" ? "Recompensa" : "Consumible",
      dateText: shortDate(r.redeemedAt),
    })),
  };
}
