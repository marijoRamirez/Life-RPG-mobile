import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import type { ClothingItem, Consumable, OwnedReward } from "@/models/Item";
import { consumeItem, getInventory, redeemReward, toggleClothing } from "@/services/shopService";

// ViewModel de 4.3 Inventario.

export function useInventoryViewModel() {
  const [rewards, setRewards] = useState<OwnedReward[]>([]);
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [clothing, setClothing] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const inv = await getInventory();
      setRewards(inv.rewards);
      setConsumables(inv.consumables);
      setClothing(inv.clothing);
    } catch {
      setError("No se pudo cargar el inventario.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarga al volver (p. ej. después de comprar en el escaparate)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const totalObjects =
    rewards.length + consumables.reduce((sum, c) => sum + c.quantity, 0) + clothing.length;

  const redeem = async (reward: OwnedReward) => {
    try {
      await redeemReward(reward.id);
      setRewards((prev) => prev.filter((r) => r.id !== reward.id));
    } catch {
      setError("No se pudo canjear la recompensa.");
    }
  };

  const consume = async (item: Consumable) => {
    try {
      setConsumables(await consumeItem(item.id));
    } catch {
      setError("No se pudo usar el consumible.");
    }
  };

  const toggle = async (id: string) => {
    try {
      setClothing(await toggleClothing(id));
    } catch {
      setError("No se pudo cambiar la ropa.");
    }
  };

  return { rewards, consumables, clothing, totalObjects, redeem, consume, toggle, loading, error };
}
