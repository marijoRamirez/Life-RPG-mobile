// Utilidades compartidas por los datos simulados (mocks).

const MOCK_LATENCY_MS = 250;

// Responde después de una pausa corta, como lo haría una petición real
export const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));

// Copia profunda, para que nadie modifique los datos del mock por referencia
export const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value));

let nextId = 100;
// Los ids siempre son texto, igual que en la API
export const newId = (prefix: string) => `${prefix}-${nextId++}`;

const pad = (n: number) => String(n).padStart(2, "0");

// Fecha local en formato AAAA-MM-DD
export const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Fecha de hace N días (0 = hoy)
export const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

// Día ISO de la semana: 1 lunes … 7 domingo
export const isoWeekday = (d: Date) => (((d.getDay() + 6) % 7) + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
