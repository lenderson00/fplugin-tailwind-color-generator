import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { showUI } from "./setup/show-ui";

import {
  Color,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSwatch,
  ColorThumb,
  Input,
  parseColor,
  Label,
} from "react-aria-components";
import { ColorSlider, SliderTrack } from "react-aria-components";
import { CanvasNode, framer } from "framer-plugin";
import { getContrastColor, tailwindcssPaletteGenerator } from "./lib";
import { ColorResult } from "./lib/interfaces";
import namer from "color-namer";

const colorShaderURL =
  "https://framer.com/m/Color-Shades-9VbF.js@drqgej0EYi2KWdFgxXcB";

const useSelectionColor = () => {
  const [selection, setSelection] = useState<CanvasNode[]>([]);
  const [color, setColor] = useState<any>(null);

  useEffect(() => {
    return framer.subscribeToSelection(setSelection);
  }, []);

  useEffect(() => {
    if (!selection[0]) return;
    const selectedNode = selection.length === 1 ? selection[0] : null;

    const getColor = async () => {
      if (selectedNode) {
        const nodes = await selectedNode.getNodesWithAttribute(
          "backgroundColor"
        );
        const color = nodes[0].backgroundColor;

        if (!color) {
          setColor(null);
          return;
        }

        if (typeof color === "string") {
          setColor(color);
        } else {
          setColor(color.light);
        }
      }
    };

    getColor();
  }, [selection]);

  return color;
};

export function App() {
  const [color, setColor] = useState(parseColor("#FFC700"));
  const [shades, setShades] = useState<ColorResult>(
    tailwindcssPaletteGenerator(color.toString("hex"))
  );
  const [colorName, setColorName] = useState("");

  useEffect(() => {
    showUI();
  }, []);

  const getColorName = useCallback((color: string) => {
    return namer(color, { pick: ["ntc"] }).ntc[0].name;
  }, []);

  useEffect(() => {
    const shades = tailwindcssPaletteGenerator(color.toString("hex"));
    setColorName(getColorName(color.toString("hex")));
    setShades(shades);
  }, [color, getColorName]);

  return (
    <main className="flex  flex-row w-full gap-4 ">
      <div className="w-full flex flex-col gap-2">
        <Preview result={shades} />
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className=" w-full flex justify-between items-center">
          <label className=" ">Color Name</label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
          />
        </div>
        <FramerColorPicker color={color} onChange={setColor} />
        <button className="framer-button-primary mt-4">Save as Style</button>
        <button
          className="framer-button-primary"
          onClick={() => {
            addColorShadeInFramer(shades);
          }}
        >
          Add Shades on Framer
        </button>
      </div>
    </main>
  );
}

type FramerColorPickerProps = {
  color: Color;
  onChange: (color: Color) => void;
};

function FramerColorPicker({ color, onChange }: FramerColorPickerProps) {
  return (
    <div className="w-full">
      <ColorPicker defaultValue="#5100FF" value={color} onChange={onChange}>
        <Label className="hidden">Seletor de Cor</Label>
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          className="h-24 w-full rounded-lg mt-4"
        >
          <ColorThumb />
        </ColorArea>
        <ColorSlider colorSpace="hsb" channel="hue" className="w-full">
          <SliderTrack className="h-2 mt-4 rounded-full relative">
            <ColorThumb className="border-2 border-white shadow-[0_0_0_1px_black_inset_0_0_0_1px_black] w-5 h-5 rounded-full box-border data-[focus-visible]:w-6 data-[focus-visible]:h-6 top-1/2" />
          </SliderTrack>
        </ColorSlider>
        <div className="flex items-center justify-center mt-4 relative w-full gap-4">
          <ColorField className="max-w-full w-full first:[input]:w-full ">
            <Label className="hidden">Valor da Cor</Label>
            <Input />
          </ColorField>
          <ColorSwatch className="w-[30px] h-[30px] shrink-0 rounded-lg" />
        </div>
      </ColorPicker>
    </div>
  );
}

const Preview: React.FC<{ result: ColorResult }> = ({ result }) => {
  const colorShades = result.palette.primary;
  const activeShade = result.activeShade;
  return (
    <div className="w-full flex flex-col gap-0 overflow-hidden rounded-lg">
      {Object.values(colorShades).map((shade) => {
        const colorShadeNumber = Object.keys(colorShades).find(
          (key) => colorShades[key] === shade
        );

        return (
          <div
            key={shade}
            className="w-full h-10 flex items-center justify-between px-4 font-bold relative"
            style={{
              backgroundColor: shade,
              color: getContrastColor(shade),
            }}
          >
            <div
              data-visible={activeShade === colorShadeNumber}
              className={`w-1 h-1 rounded-full absolute left-1/2 -translate-x-1/2 bg-black data-[visible=true]:block hidden`}
              style={{
                backgroundColor: getContrastColor(shade),
              }}
            />
            <span>{colorShadeNumber}</span>
            <span>{shade}</span>
          </div>
        );
      })}
    </div>
  );
};

const saveColor = async (colorName: string, color: string) => {
  return await framer.createColorStyle({
    name: colorName,
    light: color,
  });
};

const addColorShadeInFramer = async (color: ColorResult) => {
  const colorShades = color.palette.primary;

  const attributes = Object.entries(colorShades).reduce(
    (acc, [key, shade]) => ({
      ...acc,
      [`c${key}`]: shade,
      [`t${key}`]: shade,
    }),
    {}
  );

  console.log(attributes);

  await framer.addDetachedComponentLayers({
    url: colorShaderURL,
    attributes: {
      controls: {
        ...attributes,
      },
    },
  });
};
