import type {
  Consumable,
  CustomReward,
  Inventory,
  NewRewardInput,
  OwnedReward,
  PurchaseResult,
  RedemptionEntry,
  ShopItem,
  SuggestedPrice,
} from "@/models/Item";
import { copy, delay, newId } from "./mockUtils";
import { peekPoints, spendPoints } from "./userMock";

// Datos simulados del Módulo 4 (Tienda de la mascota).
// Imitan lo que responde la API (docs/API.md) mientras el módulo no esté conectado.


let shopItems: ShopItem[] = [
  { id: "s1", name: "Noche de cine", icon: "star", price: 300, pointType: "cultura", isCustom: true },
  { id: "s2", name: "Libro nuevo", icon: "book-open", price: 480, pointType: "cultura" },
  { id: "s3", name: "Mancuernas 5 kg", icon: "dumbbell", price: 600, pointType: "fisico" },
  { id: "s4", name: "Día de descanso", icon: "moon", price: 280, pointType: "fisico", isCustom: true },
  { id: "s5", name: "Café de especialidad", icon: "heart", price: 180, pointType: "enfoque", isCustom: true },
  { id: "s6", name: "1 h de videojuegos", icon: "trophy", price: 200, pointType: "enfoque" },
];

// Rango de precio permitido por la economía global (M14). En el servidor sale de su configuración.
const ALLOWED = { min: 50, max: 1500 };
const rangeError = () => `El precio debe estar entre ${ALLOWED.min} y ${ALLOWED.max} puntos.`;

// Detalles de las recompensas creadas por el jugador (para editarlas)
const customDetails = new Map<string, { description: string; consumable: boolean }>([
  ["s1", { description: "Película en el cine del centro, con palomitas grandes.", consumable: true }],
  ["s4", { description: "Un día sin entrenar para recuperarme.", consumable: true }],
  ["s5", { description: "Un café de la cafetería de la esquina.", consumable: true }],
]);

let redemptions: RedemptionEntry[] = [
  { id: "x1", name: "Café de especialidad", icon: "heart", kind: "recompensa", redeemedAt: "2026-11-02T17:20:00.000Z" },
  { id: "x2", name: "Poción de HP", icon: "heart", kind: "consumible", redeemedAt: "2026-10-28T09:05:00.000Z" },
  { id: "x3", name: "Noche de cine", icon: "star", kind: "recompensa", redeemedAt: "2026-10-18T21:30:00.000Z" },
];

let inventory: Inventory = {
  rewards: [
    { id: "r1", name: "Noche de cine", icon: "star", subtitle: "Comprada el 6 oct · lista para canjear" },
    { id: "r2", name: "1 h de videojuegos", icon: "trophy", subtitle: "Comprada hoy · Enfoque" },
    { id: "r3", name: "Libro de cuentos", icon: "book-open", subtitle: "Recibida el 18 nov · lista para canjear", giftFrom: "Ana" },
  ],
  consumables: [
    { id: "c1", name: "Poción de HP", icon: "heart", quantity: 3 },
    { id: "c2", name: "Escudo de racha", icon: "lock", quantity: 1 },
    { id: "c3", name: "Doble XP 24 h", icon: "streak", quantity: 1, giftFrom: "Leo" },
  ],
  clothing: [
    { id: "w1", name: "Boina", icon: "clothes", equipped: true },
    { id: "w2", name: "Gorro", icon: "clothes", equipped: false },
    { id: "w3", name: "Banda", icon: "clothes", equipped: false },
    { id: "w4", name: "Lentes", icon: "focus", equipped: true },
  ],
};

// GET /tienda/articulos
export function getShopItems(): Promise<ShopItem[]> {
  return delay(copy(shopItems));
}

// POST /tienda/compras
// Valida que alcancen los puntos del tipo del artículo y los descuenta.
export function buyItem(itemId: string): Promise<PurchaseResult> {
  const item = shopItems.find((i) => i.id === itemId);
  if (!item) return Promise.reject(new Error("El artículo ya no está disponible."));
  if (peekPoints()[item.pointType] < item.price) {
    return Promise.reject(new Error("No tienes puntos suficientes."));
  }
  const wallet = spendPoints(item.pointType, item.price);
  const reward: OwnedReward = { id: newId("r"), name: item.name, icon: item.icon, subtitle: "Comprada hoy · lista para canjear" };
  inventory = { ...inventory, rewards: [...inventory.rewards, reward] };
  return delay({ wallet, reward });
}

// GET /tienda/precio-sugerido — en producción depende del nivel y de la economía global (M14)
export function getSuggestedPrice(): Promise<SuggestedPrice> {
  return delay({ level: 14, min: 200, max: 400, allowedMin: 50, allowedMax: 1500 });
}

// POST /tienda/recompensas
export function createCustomReward(input: NewRewardInput): Promise<ShopItem> {
  if (!input.name.trim()) return Promise.reject(new Error("Escribe el nombre de la recompensa."));
  if (!(input.price > 0)) return Promise.reject(new Error("El precio debe ser mayor a 0."));
  if (input.price < ALLOWED.min || input.price > ALLOWED.max) return Promise.reject(new Error(rangeError()));
  const item: ShopItem = {
    id: newId("s"),
    name: input.name.trim(),
    icon: input.icon,
    price: input.price,
    pointType: input.pointType,
    isCustom: true,
  };
  shopItems = [...shopItems, item];
  customDetails.set(item.id, { description: input.description, consumable: input.consumable });
  return delay(copy(item));
}

const findCustom = (id: string) => shopItems.find((i) => i.id === id && i.isCustom);

// GET /tienda/recompensas/:id — para editarla
export function getCustomReward(id: string): Promise<CustomReward> {
  const item = findCustom(id);
  if (!item) return Promise.reject(new Error("La recompensa ya no existe."));
  const details = customDetails.get(id) ?? { description: "", consumable: true };
  return delay({ id, icon: item.icon, name: item.name, pointType: item.pointType, price: item.price, ...details });
}

// PUT /tienda/recompensas/:id — RDF055 · actualizarRecompensaPersonalizada
export function updateCustomReward(id: string, input: NewRewardInput): Promise<ShopItem> {
  if (!findCustom(id)) return Promise.reject(new Error("La recompensa ya no existe."));
  if (!input.name.trim()) return Promise.reject(new Error("Escribe el nombre de la recompensa."));
  if (!(input.price > 0)) return Promise.reject(new Error("El precio debe ser mayor a 0."));
  if (input.price < ALLOWED.min || input.price > ALLOWED.max) return Promise.reject(new Error(rangeError()));
  shopItems = shopItems.map((i) =>
    i.id === id ? { ...i, name: input.name.trim(), icon: input.icon, price: input.price, pointType: input.pointType } : i,
  );
  customDetails.set(id, { description: input.description, consumable: input.consumable });
  return delay(copy(findCustom(id)!));
}

// DELETE /tienda/recompensas/:id — RDF056 · eliminarRecompensaPersonalizada
export function deleteCustomReward(id: string): Promise<void> {
  if (!findCustom(id)) return Promise.reject(new Error("La recompensa ya no existe."));
  shopItems = shopItems.filter((i) => i.id !== id);
  customDetails.delete(id);
  return delay(undefined);
}

// GET /inventario/canjes — RDF059 · de lo más reciente a lo más antiguo
export function getRedemptions(): Promise<RedemptionEntry[]> {
  return delay(copy([...redemptions].sort((a, b) => b.redeemedAt.localeCompare(a.redeemedAt))));
}

// GET /inventario
export function getInventory(): Promise<Inventory> {
  return delay(copy(inventory));
}

// POST /inventario/recompensas/:id/canjear
export function redeemReward(id: string): Promise<void> {
  const reward = inventory.rewards.find((r) => r.id === id);
  if (reward) {
    redemptions = [{ id: newId("x"), name: reward.name, icon: reward.icon, kind: "recompensa", redeemedAt: new Date().toISOString() }, ...redemptions];
  }
  inventory = { ...inventory, rewards: inventory.rewards.filter((r) => r.id !== id) };
  return delay(undefined);
}

// POST /inventario/consumibles/:id/usar
export function consumeItem(id: string): Promise<Consumable[]> {
  const item = inventory.consumables.find((c) => c.id === id);
  if (item) {
    redemptions = [{ id: newId("x"), name: item.name, icon: item.icon, kind: "consumible", redeemedAt: new Date().toISOString() }, ...redemptions];
  }
  inventory = {
    ...inventory,
    consumables: inventory.consumables
      .map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
      .filter((c) => c.quantity > 0),
  };
  return delay(copy(inventory.consumables));
}

// PATCH /inventario/ropa/:id
export function toggleClothing(id: string): Promise<Inventory["clothing"]> {
  inventory = {
    ...inventory,
    clothing: inventory.clothing.map((c) => (c.id === id ? { ...c, equipped: !c.equipped } : c)),
  };
  return delay(copy(inventory.clothing));
}

