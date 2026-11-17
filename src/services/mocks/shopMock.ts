import type {
  Consumable,
  Inventory,
  NewRewardInput,
  OwnedReward,
  PurchaseResult,
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

let inventory: Inventory = {
  rewards: [
    { id: "r1", name: "Noche de cine", icon: "star", subtitle: "Comprada el 6 oct · lista para canjear" },
    { id: "r2", name: "1 h de videojuegos", icon: "trophy", subtitle: "Comprada hoy · Enfoque" },
  ],
  consumables: [
    { id: "c1", name: "Poción de HP", icon: "heart", quantity: 3 },
    { id: "c2", name: "Escudo de racha", icon: "lock", quantity: 1 },
    { id: "c3", name: "Doble XP 24 h", icon: "streak", quantity: 1 },
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
  return delay({ level: 14, min: 200, max: 400 });
}

// POST /tienda/recompensas
export function createCustomReward(input: NewRewardInput): Promise<ShopItem> {
  if (!input.name.trim()) return Promise.reject(new Error("Escribe el nombre de la recompensa."));
  if (!(input.price > 0)) return Promise.reject(new Error("El precio debe ser mayor a 0."));
  const item: ShopItem = {
    id: newId("s"),
    name: input.name.trim(),
    icon: input.icon,
    price: input.price,
    pointType: input.pointType,
    isCustom: true,
  };
  shopItems = [...shopItems, item];
  return delay(copy(item));
}

// GET /inventario
export function getInventory(): Promise<Inventory> {
  return delay(copy(inventory));
}

// POST /inventario/recompensas/:id/canjear
export function redeemReward(id: string): Promise<void> {
  inventory = { ...inventory, rewards: inventory.rewards.filter((r) => r.id !== id) };
  return delay(undefined);
}

// POST /inventario/consumibles/:id/usar
export function consumeItem(id: string): Promise<Consumable[]> {
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

