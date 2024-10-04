import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { showUI } from "./setup/show-ui";

import { parseColor } from "react-aria-components";

import { tailwindcssPaletteGenerator } from "./lib";
import { ColorResult } from "./lib/interfaces";
import namer from "color-namer";
import { FramerColorPicker } from "./components/framer-color-picker";
import { Preview } from "./components/preview";
import {
  addColorShadeInFramer,
  generateRandomColor,
  saveColor,
} from "./framer/utils";
import { useSelection } from "./hooks/use-selection";

export function App() {
  const [color, setColor] = useState(parseColor(generateRandomColor()));
  const [shades, setShades] = useState<ColorResult>(
    tailwindcssPaletteGenerator(color.toString("hex"))
  );
  const [colorName, setColorName] = useState("");
  const selection = useSelection();

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
          return;
        }

        if (typeof color === "string") {
          setColor(parseColor(color));
        } else {
          setColor(parseColor(color.light));
        }
      }
    };

    getColor();
  }, [selection]);

  return (
    <main className="flex  flex-row w-full gap-4 ">
      <div className="w-full max-w-[275px] flex flex-col gap-2">
        <div className=" w-full flex justify-between items-center">
          <label className=" ">Color Name</label>
          <input
            type="text"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
          />
        </div>
        <FramerColorPicker color={color} onChange={setColor} />
        <button
          className="framer-button-primary mt-4"
          onClick={() => {
            saveColor(colorName, shades);
          }}
        >
          Save as Style
        </button>
        <button
          className=""
          onClick={() => {
            addColorShadeInFramer(shades);
          }}
        >
          Add Shades on Framer
        </button>
        <footer className="mt-[54px]">
          <p>
            Made with ❤️ by{" "}
            <a target="_blank" href="https://instagram.com/lenderson.macedo">
              Lenderson Macedo
            </a>
          </p>
        </footer>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Preview result={shades} />
      </div>
    </main>
  );
}
