import { Stack, useRouter } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PixelIcon } from "@/components/ui/PixelIcons";
import {
    ENERGY_MAX,
    JOURNAL_PROMPTS,
    MOOD_COLORS,
    MOOD_META,
} from "@/constants/moodTypes";
import { theme } from "@/constants/theme";
import { useMoodJournalViewModel } from "@/viewmodels/useMoodJournalViewModel";
import {
    moodShared as shared,
    journalStyles as styles,
} from "../../styles/mood.styles";

// 6.3 Diario rápido (RF021)
export default function DiarioAnimoScreen() {
  const router = useRouter();
  const vm = useMoodJournalViewModel();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/area2_economia/animo/grafica");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={shared.iconButton}
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <PixelIcon
              name="chevron-left"
              size={16}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={shared.title}>Diario</Text>
            <Text style={shared.subtitle}>{vm.headerDate}</Text>
          </View>
        </View>

        {/* Registro del día al que se liga la entrada (RDF075) */}
        <View style={styles.badgesRow}>
          {vm.todayLog ? (
            <>
              <View style={[shared.chip, shared.chipActive]}>
                <Text style={[shared.chipText, shared.chipTextActive]}>
                  {MOOD_META[vm.todayLog.mood].emoji}{" "}
                  {MOOD_META[vm.todayLog.mood].label} · {vm.todayLog.mood}/5
                </Text>
              </View>
              <View style={shared.chip}>
                <Text style={shared.chipText}>
                  Energía {vm.todayLog.energy}/{ENERGY_MAX}
                </Text>
              </View>
            </>
          ) : (
            <TouchableOpacity
              style={shared.chip}
              onPress={() => router.push("/area2_economia/animo/registro")}
            >
              <Text style={shared.chipText}>
                Aún no registras tu ánimo de hoy · Registrar
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={shared.label}>
          {vm.editingId ? "Editando entrada" : "¿Cómo te sentiste hoy?"}
        </Text>
        <TextInput
          style={[shared.card, styles.textArea]}
          value={vm.text}
          onChangeText={vm.setText}
          placeholder="Escribe cómo estuvo tu día…"
          placeholderTextColor={MOOD_COLORS.muted}
          multiline
          maxLength={500}
          accessibilityLabel="Entrada del diario"
        />

        <View style={styles.promptsRow}>
          {JOURNAL_PROMPTS.map((prompt) => (
            <TouchableOpacity
              key={prompt}
              style={shared.chip}
              onPress={() => vm.addPrompt(prompt)}
            >
              <Text style={shared.chipText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Compartir con visualizadores, privada por defecto (RDF076) */}
        <View style={styles.shareRow}>
          <View style={styles.shareText}>
            <Text style={styles.shareTitle}>Compartir con visualizadores</Text>
            <Text style={shared.subtitle}>Solo lectura en su Perfil lite</Text>
          </View>
          <Switch
            value={vm.shared}
            onValueChange={vm.setShared}
            trackColor={{
              false: theme.colors.surfaceAlt,
              true: theme.colors.green,
            }}
            thumbColor={theme.colors.textPrimary}
            accessibilityLabel="Compartir con visualizadores"
          />
        </View>

        {vm.error && <Text style={shared.error}>{vm.error}</Text>}
        {vm.notice && <Text style={shared.notice}>{vm.notice}</Text>}

        <TouchableOpacity
          style={[shared.primaryButton, !vm.canSave && shared.disabled]}
          onPress={vm.save}
          disabled={!vm.canSave}
          accessibilityRole="button"
        >
          {vm.saving ? (
            <ActivityIndicator color={MOOD_COLORS.onAccent} />
          ) : (
            <Text style={shared.primaryButtonText}>
              {vm.editingId ? "Guardar cambios" : "Guardar entrada"}
            </Text>
          )}
        </TouchableOpacity>
        {vm.editingId && (
          <TouchableOpacity onPress={vm.cancelEdit} accessibilityRole="button">
            <Text style={[shared.subtitle, { textAlign: "center" }]}>
              Cancelar edición
            </Text>
          </TouchableOpacity>
        )}

        {/* Entradas anteriores (RDF077) con editar y eliminar (RDF078) */}
        <Text style={shared.label}>Entradas anteriores</Text>
        {vm.loading ? (
          <ActivityIndicator color={theme.colors.green} />
        ) : vm.entries.length === 0 ? (
          <Text style={shared.centerText}>Todavía no tienes entradas.</Text>
        ) : (
          vm.entries.map((entry) => (
            <View key={entry.id} style={styles.row}>
              <View style={styles.rowMood}>
                <Text style={styles.rowMoodText}>{entry.mood ?? "–"}</Text>
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>
                  {entry.dateText}
                  {entry.shared ? " · compartida" : ""}
                </Text>
                <Text style={styles.rowText} numberOfLines={1}>
                  {entry.preview}
                </Text>
              </View>
              <View style={styles.rowActions}>
                <TouchableOpacity
                  style={styles.smallIconButton}
                  onPress={() => vm.startEdit(entry)}
                  accessibilityRole="button"
                  accessibilityLabel="Editar entrada"
                >
                  <PixelIcon
                    name="edit"
                    size={16}
                    color={MOOD_COLORS.softText}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.smallIconButton}
                  onPress={() => vm.remove(entry.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Eliminar entrada"
                >
                  <PixelIcon
                    name="trash"
                    size={16}
                    color={MOOD_COLORS.danger}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
