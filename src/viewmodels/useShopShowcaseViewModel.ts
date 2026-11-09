import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import type { ShopFilter } from "@/constants/shopTypes";
import type { ShopItem, Wallet } from "@/models/Item";
import { buyItem, getShopItems, getWallet } from "@/services/shopService";

// ViewModel de 4.1 Escaparate.
// Carga puntos y artículos, filtra por tipo y valida las compras.

const EMPTY_WALLET: Wallet = { cultura: 0, fisico: 0, enfoque: 0 };

export function useShopShowcaseViewModel() {
  const [filter, setFilter] = useState<ShopFilter>("todo");
  const [wallet, setWallet] = useState<Wallet>(EMPTY_WALLET);
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [w, list] = await Promise.all([getWallet(), getShopItems()]);
      setWallet(w);
      setItems(list);
    } catch {
      setError("No se pudo cargar la tienda.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga al volver (p. ej. después de crear una recompensa)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const visibleItems = useMemo(
    () => (filter === "todo" ? items : items.filter((i) => i.pointType === filter)),
    [filter, items],
  );

  // Cuántos puntos faltan para un artículo (0 si alcanza)
  const missingFor = (item: ShopItem) => Math.max(0, item.price - wallet[item.pointType]);
  const isLocked = (item: ShopItem) => missingFor(item) > 0;

  const buy = async (item: ShopItem) => {
    setError(null);
    try {
      const result = await buyItem(item.id);
      setWallet(result.wallet);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo completar la compra.");
      return false;
    }
  };

  return { filter, setFilter, wallet, visibleItems, missingFor, isLocked, buy, loading, error };
}
