import { Stack } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav, useBottomNavSpace } from "@/components/ui/BottomNav";
import { PixelIcon } from "@/components/ui/PixelIcons";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { theme } from "@/constants/theme";
import { ui, UI_COLORS } from "@/styles/ui.styles";
import { useRedemptionHistoryViewModel } from "@/viewmodels/useRedemptionHistoryViewModel";

// 4.3 Inventario › Historial de canjes (M04 · RDF059)
export default function CanjesScreen() {
  const navSpace = useBottomNavSpace();
  const vm = useRedemptionHistoryViewModel();

  return (
    <SafeAreaView style={ui.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={[ui.content, { paddingBottom: navSpace }]}>
        <ScreenHeader title="Historial de canjes" />
        <Text style={ui.subtitle}>Las recompensas y consumibles que ya disfrutaste.</Text>
        {vm.loading && <ActivityIndicator color={theme.colors.green} />}
        {vm.error && <Text style={ui.error}>{vm.error}</Text>}
        {!vm.loading && !vm.rows.length && <Text style={ui.centerText}>Todavía no canjeas nada.</Text>}
        {vm.rows.map((r) => (
          <View key={r.id} style={[ui.card, { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 }]}>
            <View style={[ui.iconButton, { borderWidth: 0 }]}>
              <PixelIcon name={r.icon} size={20} color={theme.colors.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: theme.colors.textPrimary }}>{r.name}</Text>
              <Text style={{ fontSize: 12, color: UI_COLORS.muted }}>{r.kindText}</Text>
            </View>
            <Text style={{ fontSize: 13, color: UI_COLORS.softText }}>{r.dateText}</Text>
          </View>
        ))}
      </ScrollView>
      <BottomNav activeTab="shop" />
    </SafeAreaView>
  );
}
