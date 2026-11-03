import { useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import Svg, { Line, Polyline, Rect } from "react-native-svg";

import { ENERGY_MAX, MOOD_COLORS } from "@/constants/moodTypes";
import { theme } from "@/constants/theme";
import type { MoodDayPoint } from "@/models/MoodLog";

// Gráfica del Módulo 6: barras de ánimo (1 a 5) y línea punteada de energía (0 a 10).
// Los días sin registro se quedan vacíos.

const HEIGHT = 170;
const PADDING_TOP = 8;
const MOOD_MAX = 5;

export function MoodChart({ points }: { points: MoodDayPoint[] }) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const slot = points.length ? width / points.length : 0;
  const barWidth = Math.max(2, slot * 0.6);
  const usable = HEIGHT - PADDING_TOP;
  const yFor = (value: number, max: number) => PADDING_TOP + usable - (value / max) * usable;

  // La línea se corta en los días sin registro: se dibuja por tramos continuos
  const segments: string[] = [];
  let current: string[] = [];
  points.forEach((p, i) => {
    if (p.energy === null) {
      if (current.length > 1) segments.push(current.join(" "));
      current = [];
      return;
    }
    current.push(`${slot * i + slot / 2},${yFor(p.energy, ENERGY_MAX)}`);
  });
  if (current.length > 1) segments.push(current.join(" "));

  return (
    <View onLayout={onLayout} style={{ height: HEIGHT }}>
      {width > 0 && (
        <Svg width={width} height={HEIGHT}>
          {[1, 2, 3, 4].map((g) => (
            <Line
              key={g}
              x1={0}
              x2={width}
              y1={yFor(g, MOOD_MAX)}
              y2={yFor(g, MOOD_MAX)}
              stroke={theme.colors.surfaceAlt}
              strokeWidth={1}
              strokeDasharray="2 4"
            />
          ))}
          {points.map((p, i) =>
            p.mood === null ? null : (
              <Rect
                key={p.date}
                x={slot * i + (slot - barWidth) / 2}
                y={yFor(p.mood, MOOD_MAX)}
                width={barWidth}
                height={(p.mood / MOOD_MAX) * usable}
                rx={Math.min(4, barWidth / 3)}
                fill={theme.colors.green}
              />
            ),
          )}
          {segments.map((pts, i) => (
            <Polyline
              key={i}
              points={pts}
              fill="none"
              stroke={MOOD_COLORS.energy}
              strokeWidth={2}
              strokeDasharray="5 4"
            />
          ))}
        </Svg>
      )}
    </View>
  );
}