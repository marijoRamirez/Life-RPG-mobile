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
