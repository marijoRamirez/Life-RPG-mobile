import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { MonthlyComparison } from "@/models/Achievement";
import { getMonthlyComparison } from "@/services/achievementService";
import { capitalize } from "./dateFormat";

// ViewModel de "Tú vs. tú" (M05 · RF018): el mes actual contra el mismo tramo del anterior.
// El porcentaje de mejora (RDF066) se calcula aquí para mostrarlo.

export function useMonthlyComparisonViewModel() {
  const [data, setData] = useState<MonthlyComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      getMonthlyComparison()
        .then(setData)
        .catch(() => setError("No se pudo cargar tu comparativa."))
        .finally(() => setLoading(false));
    }, []),
  );

  const format = (value: number, decimals: number) =>
    value.toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return {
    loading,
    error,
    rangeText: data ? `Días ${data.fromDay} al ${data.toDay} de cada mes` : "",
    currentLabel: data ? capitalize(data.currentMonth) : "",
    previousLabel: data ? capitalize(data.previousMonth) : "",
    metrics: (data?.metrics ?? []).map((m) => {
      const change = m.previous ? Math.round(((m.current - m.previous) / m.previous) * 100) : 0;
      return {
        key: m.key,
        label: m.label,
        current: format(m.current, m.decimals),
        previous: format(m.previous, m.decimals),
        changeText: `${change > 0 ? "+" : ""}${change} %`,
        improved: change >= 0,
        currentShare: Math.max(m.current, m.previous) ? m.current / Math.max(m.current, m.previous) : 0,
        previousShare: Math.max(m.current, m.previous) ? m.previous / Math.max(m.current, m.previous) : 0,
      };
    }),
    improvedCount: (data?.metrics ?? []).filter((m) => m.current >= m.previous).length,
    totalMetrics: data?.metrics.length ?? 0,
    dailyXp: data?.dailyXp ?? { current: [], previous: [] },
    toDay: data?.toDay ?? 0,
  };
}
