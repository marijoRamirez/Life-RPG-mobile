import { usesApi } from "@/config/env";
import { ENDPOINTS } from "@/constants/endpoints";
import type {
  ClothingItem,
  Consumable,
  CustomReward,
  Inventory,
  NewRewardInput,
  PurchaseResult,
  RedemptionEntry,
  ShopItem,
  SuggestedPrice,
} from "@/models/Item";
import { api } from "./apiClient";
import * as mock from "./mocks/shopMock";

// Servicio del Módulo 4 (Tienda de la mascota).
// Los puntos del usuario se consultan en userService (getPoints).
const real = usesApi("tienda");

// GET /tienda/articulos
export const getShopItems = (): Promise<ShopItem[]> =>
  real ? api.get(ENDPOINTS.tienda.articulos) : mock.getShopItems();

// POST /tienda/compras — el servidor valida que alcancen los puntos y los descuenta
export const buyItem = (itemId: string): Promise<PurchaseResult> =>
  real ? api.post(ENDPOINTS.tienda.compras, { itemId }) : mock.buyItem(itemId);

// GET /tienda/precio-sugerido — depende del nivel y de la economía global (M14)
export const getSuggestedPrice = (): Promise<SuggestedPrice> =>
  real ? api.get(ENDPOINTS.tienda.precioSugerido) : mock.getSuggestedPrice();

// POST /tienda/recompensas
export const createCustomReward = (input: NewRewardInput): Promise<ShopItem> =>
  real ? api.post(ENDPOINTS.tienda.recompensas, input) : mock.createCustomReward(input);

// GET /inventario
export const getInventory = (): Promise<Inventory> =>
  real ? api.get(ENDPOINTS.tienda.inventario) : mock.getInventory();

// POST /inventario/recompensas/:id/canjear
export const redeemReward = (id: string): Promise<void> =>
  real ? api.post(ENDPOINTS.tienda.canjear(id)) : mock.redeemReward(id);

// POST /inventario/consumibles/:id/usar — devuelve los consumibles que quedan
export const consumeItem = (id: string): Promise<Consumable[]> =>
  real ? api.post(ENDPOINTS.tienda.usarConsumible(id)) : mock.consumeItem(id);

// PATCH /inventario/ropa/:id — pone o quita la prenda; devuelve toda la ropa
export const toggleClothing = (id: string): Promise<ClothingItem[]> =>
  real ? api.patch(ENDPOINTS.tienda.ropa(id)) : mock.toggleClothing(id);

// GET /tienda/recompensas/:id — datos completos de una recompensa propia, para editarla
export const getCustomReward = (id: string): Promise<CustomReward> =>
  real ? api.get(ENDPOINTS.tienda.recompensa(id)) : mock.getCustomReward(id);

// PUT /tienda/recompensas/:id — RDF055 · actualizarRecompensaPersonalizada
export const updateCustomReward = (id: string, input: NewRewardInput): Promise<ShopItem> =>
  real ? api.put(ENDPOINTS.tienda.recompensa(id), input) : mock.updateCustomReward(id, input);

// DELETE /tienda/recompensas/:id — RDF056 · eliminarRecompensaPersonalizada
export const deleteCustomReward = (id: string): Promise<void> =>
  real ? api.delete(ENDPOINTS.tienda.recompensa(id)) : mock.deleteCustomReward(id);

// GET /inventario/canjes — RDF059 · consultarHistorialCanjes
export const getRedemptions = (): Promise<RedemptionEntry[]> =>
  real ? api.get(ENDPOINTS.tienda.canjes) : mock.getRedemptions();
