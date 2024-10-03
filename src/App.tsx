import { useEffect, useState } from "react";
import "./App.css";
import { showUI } from "./setup/show-ui";
import { getColors } from "theme-colors";

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
import { findClosestColor, getTextColor } from "./lib/colors";
import { CanvasNode, framer } from "framer-plugin";

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
  const [color, setColor] = useState("hsl(43, 100%, 50%)");
  const [shades, setShades] = useState<{ [key: number]: string }>({});
  const [colorName, setColorName] = useState("");

  const selectedColor = useSelectionColor();

  useEffect(() => {
    showUI();
  }, []);

  useEffect(() => {
    if (!selectedColor) return;
    setColor(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    const shades = getColors(color);
    setShades(shades);
  }, [color]);

  return (
    <main className="flex flex-col items-center w-full gap-2 ">
      <div className="framer-divider" />
      <div className=" w-full flex justify-between items-center">
        <label className=" ">Color Name</label>
        <input
          type="text"
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
        />
      </div>
      <div className="framer-divider" />
      <FramerColorPicker initialColor={color} onChange={setColor} />
      <button className="framer-button-primary mt-4">Salvar</button>

      <Preview color={color} />
    </main>
  );
}

type FramerColorPickerProps = {
  initialColor: string;
  onChange: (color: string) => void;
};

function FramerColorPicker({ initialColor, onChange }: FramerColorPickerProps) {
  const [color, setColor] = useState(parseColor(initialColor));

  const handleChange = (color: Color | null) => {
    if (!color) return;
    setColor(color);
    const hexColor = color.toString("hex");

    onChange(hexColor);
  };

  return (
    <div className="w-full">
      <ColorPicker
        defaultValue="#5100FF"
        value={initialColor ? parseColor(initialColor) : parseColor("#ffc700")}
        onChange={handleChange}
      >
        <Label className="hidden">Seletor de Cor</Label>
        <ColorArea
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
          className="h-24 w-full rounded-lg mt-4"
        >
          <ColorThumb />
        </ColorArea>
        <ColorSlider channel="hue" colorSpace="hsb" className="w-full">
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

interface ColorShadesProps {
  shades: Record<string, string>;
  primaryColor: string;
}

const Preview: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <div>Preview</div>
      <div
        className="w-full h-24 bg-primary rounded-lg"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

const ColorShades: React.FC<ColorShadesProps> = ({ shades, primaryColor }) => {
  const closestColor = findClosestColor(primaryColor, shades);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
      {Object.entries(shades).map(([shade, color]) => (
        <div
          key={shade}
          className={`flex items-center justify-center w-16 h-16 rounded-lg ${
            color === closestColor ? "border-4 border-primary" : ""
          }`}
          style={{ backgroundColor: color, color: getTextColor(color) }}
        >
          <span className="font-bold">{shade}</span>
        </div>
      ))}
    </div>
  );
};

const saveColor = async (colorName: string, color: string) => {
  return await framer.createColorStyle({
    name: colorName,
    light: color,
  });
};
