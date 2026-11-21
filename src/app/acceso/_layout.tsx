import { Stack } from "expo-router";

// Pantallas de acceso (M00): sin encabezado de navegación; cada una dibuja el suyo.
export default function AccessLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
