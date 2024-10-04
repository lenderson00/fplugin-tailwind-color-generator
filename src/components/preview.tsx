import { getContrastColor } from "../lib";
import { ColorResult } from "../lib/interfaces";

export const Preview: React.FC<{ result: ColorResult }> = ({ result }) => {
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
            className="w-full h-[36px] flex items-center justify-between px-4 font-bold relative"
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
