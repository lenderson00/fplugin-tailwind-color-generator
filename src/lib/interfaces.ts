interface Color {
  [key: string]: string;
}
interface HSL {
  h: number;
  s: number;
  l: number;
}
interface Palette {
  [key: string]: Color;
}

interface ColorResult {
  activeShade: string;
  palette: Palette;
}

interface Shade {
  name: string | number;
  lightness: number;
}

export type { Color, HSL, Palette, Shade, ColorResult };
