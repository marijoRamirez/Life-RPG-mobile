import { useFonts } from "expo-font";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { AchievementToast } from "@/components/ui/AchievementToast";
import { theme } from "@/constants/theme";
import { SessionProvider, useSession } from "@/viewmodels/SessionProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    RetroTech: require("../../assets/fonts/RETROTECH.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <SessionProvider>
      <SessionGate />
    </SessionProvider>
  );
}

// M00: lleva a cada quien a la pantalla que le toca según su sesión
// (ver viewmodels/SessionProvider.tsx). La app normal solo se ve con la sesión lista.
function SessionGate() {
  const session = useSession();
  const segments = useSegments();
  const router = useRouter();
  const navReady = Boolean(useRootNavigationState()?.key);

  const inAccess = segments[0] === "acceso";
  const page = segments[1] as string | undefined;

  useEffect(() => {
    if (session.status !== "loading") SplashScreen.hideAsync();
  }, [session.status]);

  useEffect(() => {
    if (!navReady || session.error) return;
    switch (session.status) {
      case "signedOut":
        // Sin sesión puede estar en Login, Crear cuenta (con correo) o Recuperar contraseña
        if (!inAccess || page === "bienvenida") router.replace("/acceso/login");
        break;
      case "needsAccount":
        if (page !== "crearCuenta") router.replace("/acceso/crearCuenta");
        break;
      case "needsPet":
        if (page !== "bienvenida") router.replace("/acceso/bienvenida");
        break;
      case "ready":
        if (inAccess) router.replace("/");
        break;
    }
  }, [navReady, session.status, session.error, inAccess, page, router]);

  // Primera revisión de la sesión guardada: se queda la pantalla de carga
  if (session.status === "loading") return null;

  if (session.error) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: "center", justifyContent: "center", gap: 16, padding: 24 }}>
        <Text style={{ color: theme.colors.textPrimary, fontSize: 15, textAlign: "center" }}>{session.error}</Text>
        <TouchableOpacity
          onPress={session.refreshAccount}
          accessibilityRole="button"
          style={{ backgroundColor: theme.colors.surfaceAlt, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}
        >
          <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fonts.retro }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="acceso" options={{ headerShown: false }} />
      </Stack>
      {session.status === "ready" && <AchievementToast />}
    </>
  );
}
