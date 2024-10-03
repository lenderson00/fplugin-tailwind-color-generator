const hexToRgb = (hex: string) => {
  const parsedHex = hex.replace("#", "");
  const bigint = parseInt(parsedHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

// Função para calcular o contraste de luminosidade relativa
const calculateLuminance = (color: string) => {
  const { r, g, b } = hexToRgb(color);
  const [R, G, B] = [r, g, b].map((value) => {
    const scaled = value / 255;
    return scaled <= 0.03928
      ? scaled / 12.92
      : Math.pow((scaled + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

// Função para calcular a razão de contraste entre duas cores
const calculateContrast = (color1: string, color2: string) => {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

// Função para definir a cor do texto com base no contraste com o fundo
export const getTextColor = (backgroundColor: string) => {
  const whiteContrast = calculateContrast(backgroundColor, "#FFFFFF");
  const blackContrast = calculateContrast(backgroundColor, "#000000");
  return whiteContrast > blackContrast ? "#FFFFFF" : "#000000";
};

const colorDistance = (color1: string, color2: string) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
};

// Função para encontrar a cor mais próxima da primaryColor
export const findClosestColor = (
  primaryColor: string,
  shades: Record<string, string>
) => {
  let closestColor = "";
  let minDistance = Infinity;

  Object.entries(shades).forEach(([, color]) => {
    const distance = colorDistance(primaryColor, color);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
};
