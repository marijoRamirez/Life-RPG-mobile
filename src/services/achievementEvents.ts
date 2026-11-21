// Aviso de "¡Logro desbloqueado!" (M05 · RDF062).
// Cuando una acción (p. ej. un check-in) desbloquea logros, su ViewModel llama a
// announceAchievements; el aviso (components/ui/AchievementToast) se muestra encima
// de cualquier pantalla.

type Listener = (names: string[]) => void;
const listeners = new Set<Listener>();

export function announceAchievements(names: string[]) {
  if (names.length) listeners.forEach((l) => l(names));
}

export function onAchievementsUnlocked(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
