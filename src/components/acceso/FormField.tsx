import type { ReactNode } from "react";
import { Text, TextInput, TouchableOpacity, View, type TextInputProps } from "react-native";

import { AUTH_COLORS, authStyles as styles } from "@/styles/auth.styles";

// Campo de formulario del acceso (M00): etiqueta, entrada y mensaje de error.

interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string | null;
  hint?: string;
  children?: ReactNode; // Contenido extra bajo el campo (p. ej. reglas de contraseña)
}

export function FormField({ label, error, hint, children, style, editable = true, ...input }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...input}
        editable={editable}
        accessibilityLabel={label}
        placeholderTextColor={AUTH_COLORS.muted}
        style={[styles.input, !editable && styles.inputDisabled, error ? styles.inputError : null, style]}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

interface PasswordFieldProps extends Omit<TextInputProps, "secureTextEntry"> {
  label?: string;
  visible: boolean;
  onToggleVisible: () => void;
  error?: string | null;
  children?: ReactNode;
}

export function PasswordField({
  label = "Contraseña",
  visible,
  onToggleVisible,
  error,
  children,
  ...input
}: PasswordFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordRow}>
        <TextInput
          {...input}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={label}
          placeholderTextColor={AUTH_COLORS.muted}
          style={[styles.input, { paddingRight: 84 }, error ? styles.inputError : null]}
        />
        <TouchableOpacity
          style={styles.showButton}
          onPress={onToggleVisible}
          accessibilityRole="button"
          accessibilityLabel={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          <Text style={styles.showText}>{visible ? "Ocultar" : "Mostrar"}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      {children}
    </View>
  );
}

// Chip seleccionable (género, metas)
export function ChoiceChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}
