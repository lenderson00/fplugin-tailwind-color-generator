import { generateColor } from "./generateColor";
import type { Color, ColorResult, Palette, Shade } from "./interfaces";

const tailwindcssPaletteGenerator = (
  options:
    | string
    | string[]
    | {
        colors?: string[];
        names?: string[];
        preserve?: boolean;
        shades?: Shade[];
      }
): ColorResult => {
  // defaults
  let colors: string[] = [];
  let names: string[] = [
    "primary",
    "secondary",
    "tertiary",
    "quaternary",
    "quinary",
    "senary",
    "septenary",
    "octonary",
    "nonary",
    "denary",
  ];
  let preserve: boolean = true;
  let shades: Shade[] = [
    { name: "50", lightness: 98 },
    { name: "100", lightness: 95 },
    { name: "200", lightness: 90 },
    { name: "300", lightness: 82 },
    { name: "400", lightness: 64 },
    { name: "500", lightness: 46 },
    { name: "600", lightness: 33 },
    { name: "700", lightness: 24 },
    { name: "800", lightness: 14 },
    { name: "900", lightness: 7 },
    { name: "950", lightness: 4 },
  ];

  // check options type
  if (typeof options === "string")
    options = { colors: [options], names, preserve, shades };
  if (typeof options === "object" && Array.isArray(options))
    options = { colors: options, names, preserve, shades };
  if (typeof options === "object" && !Array.isArray(options))
    options = Object.assign({ colors, names, preserve, shades }, options);

  // initiate palette
  const palette: Palette = {};

  // destructure options
  ({
    colors = colors,
    names = names,
    preserve = preserve,
    shades = shades,
  } = options);

  // loop through palette
  colors.forEach((hex: string, i: number) => {
    const name: string = names[i];
    const color: Color = generateColor({ hex, preserve, shades });
    palette[name] = color;
  });

  const colorPallete = palette.primary;

  const colorShade = Object.values(colorPallete).findIndex((shade) => {
    return shade === options.colors![0];
  });

  const colorShadeName = Object.keys(colorPallete)[colorShade];

  const colorResult: ColorResult = {
    activeShade: colorShadeName,
    palette,
  };

  return colorResult;
};

export { tailwindcssPaletteGenerator };

export function getContrastColor(hexcolor: string): string {
  // Remove o símbolo de hashtag (#) se presente
  const color = hexcolor.replace("#", "");

  // Converte o hex para componentes RGB
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calcula a luminância relativa usando a fórmula YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Retorna "black" se a luminância for maior que 128, senão "white"
  return yiq >= 128 ? "black" : "white";
}
