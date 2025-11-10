/**
 * Gradient preset configurations for mockup backgrounds
 * Extracted from FrameTab.tsx to improve modularity and reusability
 */

export interface GradientPreset {
  id: string;
  name: string;
  gradient: string;
}

/**
 * Linear gradient presets
 */
export const linearGradientPresets: readonly GradientPreset[] = [
  {
    id: "purple-pink",
    name: "Purple Pink",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "blue-purple",
    name: "Blue Purple",
    gradient: "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
  },
  {
    id: "pink-orange",
    name: "Pink Orange",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: "green-blue",
    name: "Green Blue",
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
  {
    id: "orange-red",
    name: "Orange Red",
    gradient: "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  },
  {
    id: "teal-lime",
    name: "Teal Lime",
    gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  },
  {
    id: "cosmic-flow",
    name: "Cosmic Flow",
    gradient:
      "linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  },
  {
    id: "sunset-dream",
    name: "Sunset Dream",
    gradient:
      "linear-gradient(120deg, #ff6b35 0%, #f7931e 20%, #ffb627 40%, #ff9505 60%, #f7931e 80%, #ff6b35 100%)",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    gradient:
      "linear-gradient(60deg, #1e3a8a 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #34d399 100%)",
  },
  {
    id: "neon-glow",
    name: "Neon Glow",
    gradient:
      "linear-gradient(90deg, #ff0080 0%, #7928ca 20%, #4c1d95 40%, #06b6d4 60%, #10b981 80%, #f59e0b 100%)",
  },
  {
    id: "galaxy-wave",
    name: "Galaxy Wave",
    gradient:
      "linear-gradient(30deg, #7c3aed 0%, #a855f7 15%, #c084fc 30%, #e879f9 45%, #ec4899 60%, #f97316 75%, #f59e0b 90%, #fbbf24 100%)",
  },
  {
    id: "arctic-light",
    name: "Arctic Light",
    gradient:
      "linear-gradient(150deg, #06b6d4 0%, #3b82f6 20%, #8b5cf6 40%, #ec4899 60%, #f97316 80%, #f59e0b 100%)",
  },
] as const;

/**
 * Radial gradient presets
 */
export const radialGradientPresets: readonly GradientPreset[] = [
  {
    id: "cosmic-dream",
    name: "Cosmic Dream",
    gradient:
      "radial-gradient(circle at 20% 50%, #ff0080 0%, #7928ca 25%, #4c1d95 50%, #1e1b4b 75%, #0f0f23 100%)",
  },
  {
    id: "sunset-blaze",
    name: "Sunset Blaze",
    gradient:
      "radial-gradient(circle at 40% 60%, #ff6b35 0%, #f7931e 20%, #ffb627 40%, #ff9505 60%, #ff6b35 80%, #d97706 100%)",
  },
  {
    id: "ocean-mystery",
    name: "Ocean Mystery",
    gradient:
      "radial-gradient(circle at 70% 30%, #1e3a8a 0%, #3b82f6 20%, #06b6d4 40%, #10b981 60%, #059669 80%, #047857 100%)",
  },
  {
    id: "neon-city",
    name: "Neon City",
    gradient:
      "radial-gradient(circle at 50% 50%, #ff0080 0%, #7928ca 25%, #4c1d95 50%, #06b6d4 75%, #10b981 100%)",
  },
  {
    id: "galaxy-spiral",
    name: "Galaxy Spiral",
    gradient:
      "radial-gradient(circle at 30% 70%, #7c3aed 0%, #a855f7 15%, #c084fc 30%, #e879f9 45%, #ec4899 60%, #f97316 75%, #f59e0b 90%, #fbbf24 100%)",
  },
  {
    id: "arctic-aurora",
    name: "Arctic Aurora",
    gradient:
      "radial-gradient(circle at 60% 40%, #06b6d4 0%, #3b82f6 20%, #8b5cf6 40%, #ec4899 60%, #f97316 80%, #f59e0b 100%)",
  },
  {
    id: "lava-volcano",
    name: "Lava Volcano",
    gradient:
      "radial-gradient(circle at 50% 80%, #dc2626 0%, #ea580c 15%, #f59e0b 30%, #fbbf24 45%, #f97316 60%, #ef4444 75%, #dc2626 90%, #b91c1c 100%)",
  },
  {
    id: "midnight-velvet",
    name: "Midnight Velvet",
    gradient:
      "radial-gradient(circle at 80% 20%, #1e1b4b 0%, #312e81 20%, #7c3aed 40%, #a855f7 60%, #ec4899 80%, #f97316 100%)",
  },
  {
    id: "emerald-paradise",
    name: "Emerald Paradise",
    gradient:
      "radial-gradient(circle at 25% 75%, #065f46 0%, #047857 20%, #059669 40%, #10b981 60%, #34d399 80%, #6ee7b7 100%)",
  },
  {
    id: "golden-sunset",
    name: "Golden Sunset",
    gradient:
      "radial-gradient(circle at 45% 55%, #92400e 0%, #d97706 20%, #f59e0b 40%, #fbbf24 60%, #fcd34d 80%, #fef3c7 100%)",
  },
  {
    id: "cyber-punk",
    name: "Cyber Punk",
    gradient:
      "radial-gradient(circle at 50% 50%, #ff0080 0%, #7928ca 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%)",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    gradient:
      "radial-gradient(circle at 35% 65%, #581c87 0%, #7c3aed 20%, #a855f7 40%, #c084fc 60%, #e879f9 80%, #f97316 100%)",
  },
] as const;

/**
 * All gradient presets combined
 */
export const allGradientPresets: readonly GradientPreset[] = [
  ...linearGradientPresets,
  ...radialGradientPresets,
] as const;

/**
 * Get gradient preset by ID
 * @param id - Preset ID
 * @returns GradientPreset or undefined if not found
 */
export function getGradientPresetById(id: string): GradientPreset | undefined {
  return allGradientPresets.find((preset) => preset.id === id);
}

/**
 * Get all linear gradient presets
 * @returns Array of linear gradient presets
 */
export function getLinearGradients(): readonly GradientPreset[] {
  return linearGradientPresets;
}

/**
 * Get all radial gradient presets
 * @returns Array of radial gradient presets
 */
export function getRadialGradients(): readonly GradientPreset[] {
  return radialGradientPresets;
}
