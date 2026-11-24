import { Image } from "react-native";

import { PixelIcon, type PixelIconName } from "@/components/ui/PixelIcons";
import { assetName, itemAsset } from "@/constants/itemAssets";

type Props = {
item: { id: string; asset?: string | null; icon: PixelIconName };
size?: number;
color: string; // Color del ícono de respaldo
};

// Imagen del artículo (M01 · assets del vestidor). Si no existe, el ícono de siempre.
export function ItemThumb({ item, size = 32, color }: Props) {
const asset = itemAsset(assetName(item));
if (!asset) return <PixelIcon name={item.icon} size={size} color={color} />;
const isBackground = asset.category === "Fondo";
return (
    <Image
    source={asset.source}
    style={isBackground ? { width: size * 2, height: size * 1.2, borderRadius: 6 } : { width: size * 1.4, height: size }}
    resizeMode={isBackground ? "cover" : "contain"}
    accessibilityIgnoresInvertColors
    />
);
}