// Formatos de fecha en español para las pantallas nuevas (Hábitos, Logros, Perfil).

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const pad = (n: number) => String(n).padStart(2, "0");

// "Viernes 20 de noviembre"
export const longDate = (d: Date) => `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}`;

// "2 mar"
export const shortDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
};

// "septiembre 2025"
export const monthYear = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

// "2026-11"
export const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

// "2026-11" → "Noviembre 2026"
export const monthTitle = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  const name = MONTHS[m - 1];
  return `${name[0].toUpperCase()}${name.slice(1)} ${y}`;
};

// Suma meses a "2026-11"
export const addMonths = (key: string, delta: number) => {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + delta, 1));
};

export const capitalize = (text: string) => (text ? `${text[0].toUpperCase()}${text.slice(1)}` : text);
