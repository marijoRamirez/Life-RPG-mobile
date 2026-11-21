import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { ui } from "@/styles/ui.styles";

// Pestañas de la sección Progreso (M05): Medallas | Tú vs. tú
export function ProgressTabs({ active }: { active: "medallas" | "comparativa" }) {
  const router = useRouter();
  const tabs = [
    { key: "medallas", label: "Medallas", route: "/area2_economia/logros/vitrina" },
    { key: "comparativa", label: "Tú vs. tú", route: "/area2_economia/logros/ranking" },
  ] as const;
  return (
    <View style={ui.segmented} accessibilityRole="tablist">
      {tabs.map((t) => {
        const on = t.key === active;
        return (
          <TouchableOpacity
            key={t.key}
            style={[ui.segment, on && ui.segmentActive]}
            onPress={() => !on && router.replace(t.route)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            <Text style={[ui.segmentText, on && ui.segmentTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
