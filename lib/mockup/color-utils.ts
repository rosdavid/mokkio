/**
 * Color utilities for mockup backgrounds and styling
 * Extracted from mockup-canvas.tsx to improve modularity
 */

/**
 * Solid color palettes organized by color family
 */
export const solidColors = [
  "#ffffff",
  "#f5f5f5",
  "#d4d4d4",
  "#a3a3a3",
  "#737373",
  "#525252",
  "#404040",
  "#262626",
  "#171717",
  "#0a0a0a",
  "#0f0f0f",
  "#050505",
] as const;

export const blueColors = [
  "#eff6ff",
  "#dbeafe",
  "#bfdbfe",
  "#93c5fd",
  "#60a5fa",
  "#3b82f6",
  "#2563eb",
  "#1d4ed8",
  "#1e40af",
  "#1e3a8a",
  "#172554",
  "#0f172a",
] as const;

export const greenColors = [
  "#f0fdf4",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  "#0f5132",
  "#052e16",
] as const;

export const yellowColors = [
  "#fefce8",
  "#fef3c7",
  "#fde68a",
  "#fcd34d",
  "#fbbf24",
  "#f59e0b",
  "#d97706",
  "#b45309",
  "#92400e",
  "#78350f",
  "#451a03",
  "#2d1206",
] as const;

export const redColors = [
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d",
  "#450a0a",
  "#2d0606",
] as const;

export const orangeColors = [
  "#fff7ed",
  "#ffedd5",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#9a3412",
  "#7c2d12",
  "#431407",
  "#2d0f06",
] as const;

export const pinkColors = [
  "#fdf2f8",
  "#fce7f3",
  "#fbcfe8",
  "#f9a8d4",
  "#f472b6",
  "#ec4899",
  "#db2777",
  "#be185d",
  "#9d174d",
  "#831843",
  "#500724",
  "#350318",
] as const;

export const purpleColors = [
  "#faf5ff",
  "#f3e8ff",
  "#e9d5ff",
  "#d8b4fe",
  "#c084fc",
  "#a855f7",
  "#9333ea",
  "#7c3aed",
  "#6b21a8",
  "#581c87",
  "#3b0764",
  "#240b3b",
] as const;

/**
 * Grouped color palettes for UI display
 */
export const colorGroups = [
  { name: "Grays", colors: solidColors },
  { name: "Blues", colors: blueColors },
  { name: "Greens", colors: greenColors },
  { name: "Yellows", colors: yellowColors },
  { name: "Reds", colors: redColors },
  { name: "Oranges", colors: orangeColors },
  { name: "Pinks", colors: pinkColors },
  { name: "Purples", colors: purpleColors },
] as const;

/**
 * Convert RGB array to hex color string
 * @param rgb - Array of [r, g, b] values (0-255)
 * @returns Hex color string (e.g., "#ff0000")
 */
export function rgbToHex(rgb: number[]): string {
  return `#${rgb.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Convert hex color to RGB array
 * @param hex - Hex color string (e.g., "#ff0000" or "ff0000")
 * @returns Array of [r, g, b] values (0-255)
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

/**
 * Get a random color from a color palette
 * @param colors - Array of color strings
 * @returns Random color from the array
 */
export function getRandomColor(colors: readonly string[]): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Generate magical gradients from extracted dominant colors
 * @param colors - Array of hex color strings
 * @param count - Number of gradients to generate (default: 12)
 * @returns Array of CSS gradient strings
 */
export function generateMagicalGradients(
  colors: string[],
  count: number = 12
): string[] {
  const gradients: string[] = [];

  for (let i = 0; i < count; i++) {
    const color1 = colors[i % colors.length];
    const color2 = colors[(i + 1) % colors.length];
    const color3 = colors[(i + 2) % colors.length];

    if (i < 4) {
      // Linear gradients
      gradients.push(`linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`);
    } else if (i < 8) {
      // Radial gradients
      gradients.push(
        `radial-gradient(circle at 50% 50%, ${color1} 0%, ${color2} 100%)`
      );
    } else {
      // Multi-color gradients
      gradients.push(
        `linear-gradient(45deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
      );
    }
  }

  return gradients;
}
