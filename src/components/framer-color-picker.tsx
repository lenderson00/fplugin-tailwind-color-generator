import {
  Color,
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSwatch,
  ColorThumb,
  Input,
  Label,
  parseColor,
} from "react-aria-components";
import { ColorSlider, SliderTrack } from "react-aria-components";
import { generateRandomColor } from "../framer/utils";
import { Repeat2 } from "lucide-react";

type FramerColorPickerProps = {
  color: Color;
  onChange: (color: Color) => void;
};

export function FramerColorPicker({ color, onChange }: FramerColorPickerProps) {
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
        <div className="flex items-center justify-center mt-4 relative w-full gap-2">
          <ColorField className="max-w-full w-full first:[input]:w-full ">
            <Label className="hidden">Valor da Cor</Label>
            <Input />
          </ColorField>

          <ColorSwatch className="w-[30px] h-[30px] shrink-0 rounded-lg" />
          <button
            className="w-[30px] h-[30px] bg-neutral-600 hover:bg-neutral-700 flex items-center justify-center rounded-lg"
            onClick={() => onChange(parseColor(generateRandomColor()))}
          >
            <Repeat2 size={16} />
          </button>
        </div>
      </ColorPicker>
    </div>
  );
}
