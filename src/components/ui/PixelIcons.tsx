// Pixel retro icons — requires: npm i react-native-svg (or expo install react-native-svg)
import Svg, { Path } from "react-native-svg";

export const ICON_PATHS = {
  home: "M7 1h2v1h-2zM6 2h4v1h-4zM5 3h6v1h-6zM4 4h8v1h-8zM3 5h10v1h-10zM2 6h12v1h-12zM1 7h14v1h-14zM2 8h12v1h-12zM2 9h12v1h-12zM2 10h5v1h-5zM9 10h5v1h-5zM2 11h4v1h-4zM10 11h4v1h-4zM2 12h4v1h-4zM10 12h4v1h-4zM2 13h4v1h-4zM10 13h4v1h-4zM2 14h4v1h-4zM10 14h4v1h-4z",
  check:
    "M13 3h2v1h-2zM12 4h3v1h-3zM11 5h3v1h-3zM10 6h3v1h-3zM1 7h2v1h-2zM9 7h3v1h-3zM1 8h3v1h-3zM8 8h3v1h-3zM2 9h3v1h-3zM7 9h3v1h-3zM3 10h6v1h-6zM4 11h4v1h-4zM5 12h2v1h-2z",
  flag: "M1 1h2v1h-2zM1 2h13v1h-13zM1 3h13v1h-13zM1 4h2v1h-2zM4 4h8v1h-8zM1 5h2v1h-2zM4 5h7v1h-7zM1 6h2v1h-2zM4 6h8v1h-8zM1 7h13v1h-13zM1 8h13v1h-13zM1 9h2v1h-2zM1 10h2v1h-2zM1 11h2v1h-2zM1 12h2v1h-2zM1 13h2v1h-2zM0 14h4v1h-4z",
  shop: "M2 1h12v1h-12zM1 2h14v1h-14zM0 3h16v1h-16zM0 4h16v1h-16zM1 5h2v1h-2zM4 5h2v1h-2zM7 5h2v1h-2zM10 5h2v1h-2zM13 5h2v1h-2zM1 7h14v1h-14zM1 8h2v1h-2zM8 8h7v1h-7zM1 9h2v1h-2zM8 9h1v1h-1zM13 9h2v1h-2zM1 10h2v1h-2zM8 10h1v1h-1zM13 10h2v1h-2zM1 11h8v1h-8zM13 11h2v1h-2zM1 12h8v1h-8zM13 12h2v1h-2zM1 13h8v1h-8zM13 13h2v1h-2zM1 14h8v1h-8zM13 14h2v1h-2z",
  trophy:
    "M2 1h12v1h-12zM2 2h12v1h-12zM0 3h2v1h-2zM3 3h10v1h-10zM14 3h2v1h-2zM0 4h1v1h-1zM3 4h2v1h-2zM6 4h7v1h-7zM15 4h1v1h-1zM0 5h1v1h-1zM3 5h2v1h-2zM6 5h7v1h-7zM15 5h1v1h-1zM0 6h2v1h-2zM3 6h10v1h-10zM14 6h2v1h-2zM3 7h10v1h-10zM4 8h8v1h-8zM5 9h6v1h-6zM7 10h2v1h-2zM7 11h2v1h-2zM5 12h6v1h-6zM4 13h8v1h-8zM4 14h8v1h-8z",
  "book-open":
    "M1 2h4v1h-4zM11 2h4v1h-4zM0 3h1v1h-1zM5 3h2v1h-2zM9 3h2v1h-2zM15 3h1v1h-1zM0 4h1v1h-1zM7 4h2v1h-2zM15 4h1v1h-1zM0 5h1v1h-1zM2 5h3v1h-3zM7 5h2v1h-2zM11 5h3v1h-3zM15 5h1v1h-1zM0 6h1v1h-1zM7 6h2v1h-2zM15 6h1v1h-1zM0 7h1v1h-1zM2 7h3v1h-3zM7 7h2v1h-2zM11 7h3v1h-3zM15 7h1v1h-1zM0 8h1v1h-1zM7 8h2v1h-2zM15 8h1v1h-1zM0 9h1v1h-1zM2 9h3v1h-3zM7 9h2v1h-2zM11 9h3v1h-3zM15 9h1v1h-1zM0 10h1v1h-1zM7 10h2v1h-2zM15 10h1v1h-1zM0 11h1v1h-1zM7 11h2v1h-2zM15 11h1v1h-1zM1 12h6v1h-6zM9 12h6v1h-6zM7 13h2v1h-2z",
  dumbbell:
    "M2 4h3v1h-3zM11 4h3v1h-3zM2 5h3v1h-3zM11 5h3v1h-3zM0 6h5v1h-5zM11 6h5v1h-5zM0 7h16v1h-16zM0 8h16v1h-16zM0 9h5v1h-5zM11 9h5v1h-5zM2 10h3v1h-3zM11 10h3v1h-3zM2 11h3v1h-3zM11 11h3v1h-3z",
  focus:
    "M1 1h4v1h-4zM11 1h4v1h-4zM1 2h4v1h-4zM11 2h4v1h-4zM1 3h2v1h-2zM13 3h2v1h-2zM1 4h2v1h-2zM13 4h2v1h-2zM7 6h2v1h-2zM6 7h4v1h-4zM6 8h4v1h-4zM7 9h2v1h-2zM1 11h2v1h-2zM13 11h2v1h-2zM1 12h2v1h-2zM13 12h2v1h-2zM1 13h4v1h-4zM11 13h4v1h-4zM1 14h4v1h-4zM11 14h4v1h-4z",
  add: "M6 2h4v1h-4zM6 3h4v1h-4zM6 4h4v1h-4zM6 5h4v1h-4zM2 6h12v1h-12zM2 7h12v1h-12zM2 8h12v1h-12zM2 9h12v1h-12zM6 10h4v1h-4zM6 11h4v1h-4zM6 12h4v1h-4zM6 13h4v1h-4z",
  star: "M7 1h2v1h-2zM6 2h4v1h-4zM6 3h4v1h-4zM5 4h6v1h-6zM0 5h16v1h-16zM1 6h14v1h-14zM2 7h12v1h-12zM3 8h10v1h-10zM4 9h8v1h-8zM4 10h8v1h-8zM3 11h4v1h-4zM9 11h4v1h-4zM3 12h3v1h-3zM10 12h3v1h-3zM2 13h3v1h-3zM11 13h3v1h-3zM2 14h2v1h-2zM12 14h2v1h-2z",
  streak:
    "M7 0h1v1h-1zM7 1h2v1h-2zM6 2h3v1h-3zM6 3h4v1h-4zM5 4h5v1h-5zM5 5h6v1h-6zM4 6h7v1h-7zM12 6h1v1h-1zM4 7h9v1h-9zM3 8h11v1h-11zM3 9h11v1h-11zM2 10h6v1h-6zM9 10h5v1h-5zM2 11h5v1h-5zM10 11h4v1h-4zM2 12h4v1h-4zM11 12h3v1h-3zM3 13h3v1h-3zM11 13h3v1h-3zM4 14h3v1h-3zM10 14h3v1h-3zM5 15h7v1h-7z",
  "arrow-left":
    "M6 3h1v1h-1zM5 4h2v1h-2zM4 5h3v1h-3zM3 6h4v1h-4zM2 7h12v1h-12zM2 8h12v1h-12zM3 9h4v1h-4zM4 10h3v1h-3zM5 11h2v1h-2zM6 12h1v1h-1z",
  "arrow-right":
    "M9 3h1v1h-1zM9 4h2v1h-2zM9 5h3v1h-3zM9 6h4v1h-4zM2 7h12v1h-12zM2 8h12v1h-12zM9 9h4v1h-4zM9 10h3v1h-3zM9 11h2v1h-2zM9 12h1v1h-1z",
  "arrow-up":
    "M7 2h2v1h-2zM6 3h4v1h-4zM5 4h6v1h-6zM4 5h8v1h-8zM3 6h10v1h-10zM7 7h2v1h-2zM7 8h2v1h-2zM7 9h2v1h-2zM7 10h2v1h-2zM7 11h2v1h-2zM7 12h2v1h-2zM7 13h2v1h-2z",
  "arrow-down":
    "M7 2h2v1h-2zM7 3h2v1h-2zM7 4h2v1h-2zM7 5h2v1h-2zM7 6h2v1h-2zM7 7h2v1h-2zM7 8h2v1h-2zM3 9h10v1h-10zM4 10h8v1h-8zM5 11h6v1h-6zM6 12h4v1h-4zM7 13h2v1h-2z",
  "chevron-left":
    "M9 2h3v1h-3zM8 3h3v1h-3zM7 4h3v1h-3zM6 5h3v1h-3zM5 6h3v1h-3zM4 7h3v1h-3zM4 8h3v1h-3zM5 9h3v1h-3zM6 10h3v1h-3zM7 11h3v1h-3zM8 12h3v1h-3zM9 13h3v1h-3z",
  "chevron-right":
    "M4 2h3v1h-3zM5 3h3v1h-3zM6 4h3v1h-3zM7 5h3v1h-3zM8 6h3v1h-3zM9 7h3v1h-3zM9 8h3v1h-3zM8 9h3v1h-3zM7 10h3v1h-3zM6 11h3v1h-3zM5 12h3v1h-3zM4 13h3v1h-3z",
  "chevron-up":
    "M7 4h2v1h-2zM6 5h4v1h-4zM5 6h6v1h-6zM4 7h3v1h-3zM9 7h3v1h-3zM3 8h3v1h-3zM10 8h3v1h-3zM2 9h3v1h-3zM11 9h3v1h-3zM2 10h2v1h-2zM12 10h2v1h-2zM2 11h1v1h-1zM13 11h1v1h-1z",
  "chevron-down":
    "M2 4h1v1h-1zM13 4h1v1h-1zM2 5h2v1h-2zM12 5h2v1h-2zM2 6h3v1h-3zM11 6h3v1h-3zM3 7h3v1h-3zM10 7h3v1h-3zM4 8h3v1h-3zM9 8h3v1h-3zM5 9h6v1h-6zM6 10h4v1h-4zM7 11h2v1h-2z",
  close:
    "M2 2h2v1h-2zM12 2h2v1h-2zM2 3h3v1h-3zM11 3h3v1h-3zM3 4h3v1h-3zM10 4h3v1h-3zM4 5h3v1h-3zM9 5h3v1h-3zM5 6h6v1h-6zM6 7h4v1h-4zM6 8h4v1h-4zM5 9h6v1h-6zM4 10h3v1h-3zM9 10h3v1h-3zM3 11h3v1h-3zM10 11h3v1h-3zM2 12h3v1h-3zM11 12h3v1h-3zM2 13h2v1h-2zM12 13h2v1h-2z",
  menu: "M2 3h12v1h-12zM2 4h12v1h-12zM2 7h12v1h-12zM2 8h12v1h-12zM2 11h12v1h-12zM2 12h12v1h-12z",
  search:
    "M3 1h6v1h-6zM2 2h8v1h-8zM1 3h3v1h-3zM8 3h3v1h-3zM1 4h2v1h-2zM9 4h2v1h-2zM1 5h2v1h-2zM9 5h2v1h-2zM1 6h2v1h-2zM9 6h2v1h-2zM1 7h2v1h-2zM9 7h2v1h-2zM1 8h3v1h-3zM8 8h3v1h-3zM2 9h8v1h-8zM3 10h6v1h-6zM10 10h3v1h-3zM11 11h3v1h-3zM12 12h3v1h-3zM13 13h2v1h-2z",
  settings:
    "M6 1h4v1h-4zM2 2h2v1h-2zM5 2h6v1h-6zM12 2h2v1h-2zM2 3h12v1h-12zM3 4h10v1h-10zM1 5h14v1h-14zM0 6h6v1h-6zM10 6h6v1h-6zM0 7h6v1h-6zM10 7h6v1h-6zM0 8h6v1h-6zM10 8h6v1h-6zM0 9h6v1h-6zM10 9h6v1h-6zM1 10h14v1h-14zM3 11h10v1h-10zM2 12h12v1h-12zM2 13h2v1h-2zM5 13h6v1h-6zM12 13h2v1h-2zM6 14h4v1h-4z",
  user: "M5 1h6v1h-6zM4 2h8v1h-8zM4 3h8v1h-8zM4 4h8v1h-8zM4 5h8v1h-8zM5 6h6v1h-6zM3 8h10v1h-10zM2 9h12v1h-12zM1 10h14v1h-14zM1 11h14v1h-14zM1 12h14v1h-14zM1 13h14v1h-14z",
  bell: "M7 1h2v1h-2zM5 2h6v1h-6zM4 3h8v1h-8zM3 4h10v1h-10zM3 5h10v1h-10zM3 6h10v1h-10zM3 7h10v1h-10zM3 8h10v1h-10zM2 9h12v1h-12zM1 10h14v1h-14zM1 11h14v1h-14zM6 13h4v1h-4zM7 14h2v1h-2z",
  heart:
    "M2 2h4v1h-4zM10 2h4v1h-4zM1 3h6v1h-6zM9 3h6v1h-6zM0 4h16v1h-16zM0 5h16v1h-16zM0 6h16v1h-16zM1 7h14v1h-14zM2 8h12v1h-12zM3 9h10v1h-10zM4 10h8v1h-8zM5 11h6v1h-6zM6 12h4v1h-4zM7 13h2v1h-2z",
  lock: "M5 1h6v1h-6zM4 2h8v1h-8zM3 3h3v1h-3zM10 3h3v1h-3zM3 4h2v1h-2zM11 4h2v1h-2zM3 5h2v1h-2zM11 5h2v1h-2zM3 6h2v1h-2zM11 6h2v1h-2zM1 7h14v1h-14zM1 8h14v1h-14zM1 9h6v1h-6zM9 9h6v1h-6zM1 10h6v1h-6zM9 10h6v1h-6zM1 11h6v1h-6zM9 11h6v1h-6zM1 12h14v1h-14zM1 13h14v1h-14zM1 14h14v1h-14z",
  trash:
    "M6 1h4v1h-4zM1 2h14v1h-14zM1 3h14v1h-14zM2 5h12v1h-12zM2 6h2v1h-2zM5 6h2v1h-2zM9 6h2v1h-2zM12 6h2v1h-2zM2 7h2v1h-2zM5 7h2v1h-2zM9 7h2v1h-2zM12 7h2v1h-2zM2 8h2v1h-2zM5 8h2v1h-2zM9 8h2v1h-2zM12 8h2v1h-2zM2 9h2v1h-2zM5 9h2v1h-2zM9 9h2v1h-2zM12 9h2v1h-2zM2 10h2v1h-2zM5 10h2v1h-2zM9 10h2v1h-2zM12 10h2v1h-2zM2 11h2v1h-2zM5 11h2v1h-2zM9 11h2v1h-2zM12 11h2v1h-2zM2 12h12v1h-12zM3 13h10v1h-10z",
  edit: "M13 1h1v1h-1zM12 2h3v1h-3zM12 3h3v1h-3zM10 4h2v1h-2zM13 4h1v1h-1zM9 5h4v1h-4zM8 6h4v1h-4zM7 7h4v1h-4zM6 8h4v1h-4zM5 9h4v1h-4zM4 10h4v1h-4zM3 11h4v1h-4zM3 12h3v1h-3zM2 13h2v1h-2z",
  minus: "M2 6h12v1h-12zM2 7h12v1h-12zM2 8h12v1h-12zM2 9h12v1h-12z",
  more: "M2 7h2v1h-2zM7 7h2v1h-2zM12 7h2v1h-2zM2 8h2v1h-2zM7 8h2v1h-2zM12 8h2v1h-2z",
  info: "M5 1h6v1h-6zM3 2h10v1h-10zM2 3h5v1h-5zM9 3h5v1h-5zM1 4h6v1h-6zM9 4h6v1h-6zM1 5h14v1h-14zM1 6h6v1h-6zM9 6h6v1h-6zM1 7h6v1h-6zM9 7h6v1h-6zM1 8h6v1h-6zM9 8h6v1h-6zM1 9h6v1h-6zM9 9h6v1h-6zM1 10h6v1h-6zM9 10h6v1h-6zM1 11h6v1h-6zM9 11h6v1h-6zM2 12h12v1h-12zM3 13h10v1h-10zM5 14h6v1h-6z",
  calendar:
    "M4 1h2v1h-2zM10 1h2v1h-2zM1 2h14v1h-14zM1 3h14v1h-14zM1 4h14v1h-14zM1 5h2v1h-2zM13 5h2v1h-2zM1 6h2v1h-2zM4 6h2v1h-2zM7 6h2v1h-2zM10 6h2v1h-2zM13 6h2v1h-2zM1 7h2v1h-2zM4 7h2v1h-2zM7 7h2v1h-2zM10 7h2v1h-2zM13 7h2v1h-2zM1 8h2v1h-2zM13 8h2v1h-2zM1 9h2v1h-2zM4 9h2v1h-2zM7 9h2v1h-2zM10 9h2v1h-2zM13 9h2v1h-2zM1 10h2v1h-2zM4 10h2v1h-2zM7 10h2v1h-2zM10 10h2v1h-2zM13 10h2v1h-2zM1 11h2v1h-2zM13 11h2v1h-2zM1 12h14v1h-14zM1 13h14v1h-14z",
  moon: "M6 1h4v1h-4zM4 2h5v1h-5zM3 3h5v1h-5zM2 4h5v1h-5zM2 5h4v1h-4zM1 6h5v1h-5zM1 7h5v1h-5zM1 8h5v1h-5zM1 9h6v1h-6zM1 10h7v1h-7zM13 10h1v1h-1zM2 11h9v1h-9zM12 11h2v1h-2zM2 12h11v1h-11zM3 13h9v1h-9zM5 14h5v1h-5z",
  clothes:
    "M4 1h3v1h-3zM9 1h3v1h-3zM2 2h5v1h-5zM9 2h5v1h-5zM1 3h6v1h-6zM9 3h6v1h-6zM0 4h16v1h-16zM0 5h3v1h-3zM4 5h8v1h-8zM13 5h3v1h-3zM1 6h2v1h-2zM4 6h8v1h-8zM13 6h2v1h-2zM4 7h8v1h-8zM4 8h8v1h-8zM4 9h8v1h-8zM4 10h8v1h-8zM4 11h8v1h-8zM4 12h8v1h-8zM4 13h8v1h-8zM4 14h8v1h-8z",
  bag: "M6 1h4v1h-4zM5 2h2v1h-2zM9 2h2v1h-2zM5 3h1v1h-1zM10 3h1v1h-1zM3 4h10v1h-10zM2 5h12v1h-12zM2 6h3v1h-3zM6 6h4v1h-4zM11 6h3v1h-3zM2 7h12v1h-12zM2 8h12v1h-12zM2 9h12v1h-12zM2 10h12v1h-12zM2 11h12v1h-12zM2 12h12v1h-12zM2 13h12v1h-12zM3 14h10v1h-10z",
} as const;

export type PixelIconName = keyof typeof ICON_PATHS;

type Props = { name: PixelIconName; size?: number; color?: string };

/** Use sizes multiple of 16 (16, 32, 48) for perfectly sharp pixels. */
export function PixelIcon({ name, size = 32, color = "#FFFFFF" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path d={ICON_PATHS[name]} fill={color} />
    </Svg>
  );
}

export const HomeIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="home" {...p} />
);
export const CheckIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="check" {...p} />
);
export const FlagIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="flag" {...p} />
);
export const ShopIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="shop" {...p} />
);
export const TrophyIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="trophy" {...p} />
);
export const BookOpenIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="book-open" {...p} />
);
export const DumbbellIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="dumbbell" {...p} />
);
export const FocusIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="focus" {...p} />
);
export const AddIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="add" {...p} />
);
export const StarIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="star" {...p} />
);
export const StreakIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="streak" {...p} />
);
export const ArrowLeftIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="arrow-left" {...p} />
);
export const ArrowRightIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="arrow-right" {...p} />
);
export const ArrowUpIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="arrow-up" {...p} />
);
export const ArrowDownIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="arrow-down" {...p} />
);
export const ChevronLeftIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="chevron-left" {...p} />
);
export const ChevronRightIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="chevron-right" {...p} />
);
export const ChevronUpIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="chevron-up" {...p} />
);
export const ChevronDownIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="chevron-down" {...p} />
);
export const CloseIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="close" {...p} />
);
export const MenuIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="menu" {...p} />
);
export const SearchIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="search" {...p} />
);
export const SettingsIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="settings" {...p} />
);
export const UserIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="user" {...p} />
);
export const BellIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="bell" {...p} />
);
export const HeartIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="heart" {...p} />
);
export const LockIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="lock" {...p} />
);
export const TrashIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="trash" {...p} />
);
export const EditIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="edit" {...p} />
);
export const MinusIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="minus" {...p} />
);
export const MoreIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="more" {...p} />
);
export const InfoIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="info" {...p} />
);
export const CalendarIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="calendar" {...p} />
);
export const MoonIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="moon" {...p} />
);
export const ClothesIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="clothes" {...p} />
);
export const BagIcon = (p: Omit<Props, "name">) => (
  <PixelIcon name="bag" {...p} />
);
