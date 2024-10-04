import { framer } from "framer-plugin";
import { ColorResult } from "../lib/interfaces";
import slugify from "slugify";

export const saveColor = async (colorName: string, color: ColorResult) => {
  const colorShades = color.palette.primary;

  Object.entries(colorShades).forEach(async ([key, shade]) => {
    await framer.createColorStyle({
      name: slugify(colorName, { lower: true }) + "-" + key,
      light: shade,
    });
  });

  framer.notify(`${colorName} saved on Framer`, {
    durationMs: 3000,
    variant: "success", // Or 'success', 'warning', 'error'
  });
};

const SHADE_URL = "https://framer.com/m/Color-Shades-9VbF.js";

export const addColorShadeInFramer = async (color: ColorResult) => {
  const colorShades = color.palette.primary;

  const attributes = Object.entries(colorShades).reduce(
    (acc, [key, shade]) => ({
      ...acc,
      [`c${key}`]: shade,
      [`t${key}`]: shade,
    }),
    {}
  );

  await framer.addDetachedComponentLayers({
    url: SHADE_URL,
    attributes: {
      controls: {
        ...attributes,
      },
    },
  });

  framer.notify(`${Object.keys(colorShades).length} colors added on Framer`, {
    durationMs: 3000,
    variant: "success", // Or 'success', 'warning', 'error'
  });
};

export const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
