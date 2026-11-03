import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import type { MoodPeriod, MoodTrend } from "@/models/MoodLog";
import { getMoodTrend } from "@/services/moodService";
import { fromDateKey, rangeLabel, weekdayName } from "./moodFormat";

// ViewModel de 6.2 Gráfica de ánimo (RF020).

// Letra de cada día empezando en domingo (getDay() = 0)
const DAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

export function useMoodChartViewModel() {
  const [period, setPeriod] = useState<MoodPeriod>("semana");
  const [trend, setTrend] = useState<MoodTrend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (p: MoodPeriod) => {
    setLoading(true);
    setError(null);
    try {
      setTrend(await getMoodTrend(p));
    } catch {
      setError("No se pudo cargar tu gráfica.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga al volver a la pantalla (p. ej. después de registrar)
  useFocusEffect(
    useCallback(() => {
      load(period);
    }, [load, period]),
  );

  // Etiquetas del eje X: letra del día en semana, número cada 5 días en mes
  const xLabels = useMemo(() => {
    if (!trend) return [];
    return trend.points.map((p, i) => {
      const date = fromDateKey(p.date);
      if (trend.period === "semana") return DAY_LETTERS[date.getDay()];
      // En el mes solo se muestra el número cada 5 días para que no se amontone
      return i % 5 === 0 ? String(date.getDate()) : "";
    });
  }, [trend]);

  const summary = trend?.summary;

  return {
    period,
    setPeriod,
    trend,
    xLabels,
    rangeText: trend ? rangeLabel(trend.from, trend.to) : "",
    averageText: summary?.average != null ? summary.average.toFixed(1) : "—",
    bestText: summary?.bestDate ? weekdayName(summary.bestDate) : "—",
    worstText: summary?.worstDate ? weekdayName(summary.worstDate) : "—",
    patternText: summary?.pattern ?? "",
    patternTitle: period === "semana" ? "Patrón de la semana" : "Patrón del mes",
    loading,
    error,
    retry: () => load(period),
  };
}