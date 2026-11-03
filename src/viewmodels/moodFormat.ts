// Formatos de fecha compartidos por los ViewModels del Módulo 6.

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const pad = (n: number) => String(n).padStart(2, "0");

// "2026-11-02" → Date local (sin desfase de zona horaria)
export const fromDateKey = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// "Lunes"
export const weekdayName = (key: string) => DAYS[fromDateKey(key).getDay()];

// "Lunes 2 nov"
export const dayLabel = (key: string) => {
  const d = fromDateKey(key);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

// "28 sep al 4 oct"
export const rangeLabel = (from: string, to: string) => {
  const a = fromDateKey(from);
  const b = fromDateKey(to);
  return `${a.getDate()} ${MONTHS[a.getMonth()]} al ${b.getDate()} ${MONTHS[b.getMonth()]}`;
};

// "Lunes 2 nov · 21:40"
export const dateTimeLabel = (date: Date) =>
  `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;