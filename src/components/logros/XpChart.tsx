import { useState } from "react";
import { Text, View } from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";

import { theme } from "@/constants/theme";
import { UI_COLORS } from "@/styles/ui.styles";

// Gráfica de XP acumulada por día: este mes (línea verde) contra el anterior (punteada).
const HEIGHT = 140;
const PAD = 8;

export function XpChart({ current, previous, toDay }: { current: number[]; previous: number[]; toDay: number }) {
  const [width, setWidth] = useState(0);
  const max = Math.max(1, ...current, ...previous);
  const points = (values: number[]) =>
    values
      .map((v, i) => {
        const x = PAD + (values.length > 1 ? (i / (values.length - 1)) * (width - PAD * 2) : 0);
        const y = HEIGHT - PAD - (v / max) * (HEIGHT - PAD * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityLabel="XP acumulada por día">
      {width > 0 && (
        <Svg width={width} height={HEIGHT}>
          {[0.25, 0.5, 0.75].map((f) => (
            <Line key={f} x1={PAD} x2={width - PAD} y1={HEIGHT * f} y2={HEIGHT * f} stroke={UI_COLORS.border} strokeWidth={1} />
          ))}
          <Polyline points={points(previous)} fill="none" stroke={UI_COLORS.muted} strokeWidth={2} strokeDasharray="5,4" />
          <Polyline points={points(current)} fill="none" stroke={theme.colors.green} strokeWidth={3} />
        </Svg>
      )}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 11, color: UI_COLORS.muted }}>Día 1</Text>
        <Text style={{ fontSize: 11, color: UI_COLORS.muted }}>Día {toDay}</Text>
      </View>
    </View>
  );
}
