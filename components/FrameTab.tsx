"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  Upload,
  RefreshCw,
  Trash2,
  Plus,
  ImageIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";

interface FrameTabProps {
  selectedResolution: string;
  setSelectedResolution: (id: string) => void;

  backgroundNoise: number;
  setBackgroundNoise: (value: number) => void;
  backgroundBlur: number;
  setBackgroundBlur: (value: number) => void;

  texts: Array<{
    id: string;
    content: string;
    color: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
    letterSpacing: number;
    textAlign: "left" | "center" | "right" | "justify";
    opacity: number;
    x: number;
    y: number;
    textShadowOffsetX: number;
    textShadowOffsetY: number;
    textShadowBlur: number;
    textShadowColor: string;
  }>;
  addText: (
    text: Omit<
      {
        id: string;
        content: string;
        color: string;
        fontFamily: string;
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
        letterSpacing: number;
        textAlign: "left" | "center" | "right" | "justify";
        opacity: number;
        x: number;
        y: number;
        textShadowOffsetX: number;
        textShadowOffsetY: number;
        textShadowBlur: number;
        textShadowColor: string;
      },
      "id"
    >
  ) => void;
  updateText: (
    id: string,
    updates: Partial<{
      content: string;
      color: string;
      fontFamily: string;
      fontSize: number;
      fontWeight: string;
      lineHeight: number;
      letterSpacing: number;
      textAlign: "left" | "center" | "right" | "justify";
      opacity: number;
      x: number;
      y: number;
      textShadowOffsetX: number;
      textShadowOffsetY: number;
      textShadowBlur: number;
      textShadowColor: string;
    }>
  ) => void;
  removeText: (id: string) => void;

  backgroundType:
    | "solid"
    | "gradient"
    | "cosmic"
    | "mystic"
    | "desktop"
    | "abstract"
    | "earth"
    | "radiant"
    | "texture"
    | "textures"
    | "transparent"
    | "image";
  setBackgroundType: (
    type:
      | "solid"
      | "gradient"
      | "cosmic"
      | "mystic"
      | "desktop"
      | "abstract"
      | "earth"
      | "radiant"
      | "texture"
      | "textures"
      | "transparent"
      | "image"
  ) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundImage?: string | undefined;
  setBackgroundImage: (img: string | undefined) => void;
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;
}

const gradientPresets = [
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
];

const radialGradientPresets = [
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
];

const solidColors = [
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
];

const blueColors = [
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
];

const greenColors = [
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
];

const yellowColors = [
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
];

const redColors = [
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
];

const orangeColors = [
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
];

const pinkColors = [
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
];

const purpleColors = [
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
];

const colorGroups = [
  { name: "Grays", colors: solidColors },
  { name: "Blues", colors: blueColors },
  { name: "Greens", colors: greenColors },
  { name: "Yellows", colors: yellowColors },
  { name: "Reds", colors: redColors },
  { name: "Oranges", colors: orangeColors },
  { name: "Pinks", colors: pinkColors },
  { name: "Purples", colors: purpleColors },
];

const FrameTab: React.FC<FrameTabProps> = (props) => {
  const [backgroundTab, setBackgroundTab] = useState("color");
  const [backgroundExpandedSections, setBackgroundExpandedSections] = useState<
    Record<string, boolean>
  >({
    solid: false,
    linear: false,
    radial: false,
    cosmic: false,
    textures: false,
  });

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    effects: true,
    text: true,
    background: true,
  });

  const toggleSection = (s: string) =>
    setExpandedSections((prev) => ({ ...prev, [s]: !prev[s] }));

  return (
    <div className="space-y-4 p-4">
      <div className="bg-card p-2.5 rounded-lg">
        <div className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
          RESOLUTION
        </div>
        <div className="mt-2">
          <Select
            value={props.selectedResolution}
            onValueChange={props.setSelectedResolution}
          >
            <SelectTrigger className="w-full bg-muted border-border text-foreground text-sm">
              <SelectValue placeholder="Choose resolution" />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground border-border">
              {/* General Section */}
              <SelectItem className="cursor-pointer" value="hd-720p">
                HD 1280×720 (16:9)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="hd-1080p">
                HD 1920×1080 (16:9)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="hd-3-2">
                HD 1920×1280 (3:2)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="hd-4-3">
                HD 1920×1440 (4:3)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="4k-uhd">
                4K UHD 3840×2160 (16:9)
              </SelectItem>

              {/* Divider */}
              <div className="h-px bg-white/10 my-1" />

              {/* Instagram Section */}
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 2500 2500"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient
                        id="a"
                        cx="332.14"
                        cy="2511.81"
                        r="3263.54"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset=".09" stopColor="#fa8f21" />
                        <stop offset=".78" stopColor="#d82d7e" />
                      </radialGradient>
                      <radialGradient
                        id="b"
                        cx="1516.14"
                        cy="2623.81"
                        r="2572.12"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop
                          offset=".64"
                          stopColor="#8c3aaa"
                          stopOpacity="0"
                        />
                        <stop offset="1" stopColor="#8c3aaa" />
                      </radialGradient>
                    </defs>
                    <path
                      d="M833.4 1250c0-230.11 186.49-416.7 416.6-416.7s416.7 186.59 416.7 416.7-186.59 416.7-416.7 416.7-416.6-186.59-416.6-416.7m-225.26 0c0 354.5 287.36 641.86 641.86 641.86s641.86-287.36 641.86-641.86S1604.5 608.14 1250 608.14 608.14 895.5 608.14 1250m1159.13-667.31a150 150 0 1 0 150.06-149.94h-.06a150.07 150.07 0 0 0-150 149.94M745 2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28 7.27-505.15c5.55-121.87 26-188 43-232.13 22.72-58.36 49.78-100 93.5-143.78s85.32-70.88 143.78-93.5c44-17.16 110.26-37.46 232.13-43 131.76-6.06 171.34-7.27 505-7.27s373.28 1.31 505.15 7.27c121.87 5.55 188 26 232.13 43 58.36 22.62 100 49.78 143.78 93.5s70.78 85.42 93.5 143.78c17.16 44 37.46 110.26 43 232.13 6.06 131.87 7.27 171.34 7.27 505.15s-1.21 373.28-7.27 505.15c-5.55 121.87-25.95 188.11-43 232.13-22.72 58.36-49.78 100-93.5 143.68s-85.42 70.78-143.78 93.5c-44 17.16-110.26 37.46-232.13 43-131.76 6.06-171.34 7.27-505.15 7.27s-373.28-1.21-505-7.27M734.65 7.57c-133.07 6.06-224 27.16-303.41 58.06C349 97.54 279.38 140.35 209.81 209.81S97.54 349 65.63 431.24c-30.9 79.46-52 170.34-58.06 303.41C1.41 867.93 0 910.54 0 1250s1.41 382.07 7.57 515.35c6.06 133.08 27.16 223.95 58.06 303.41 31.91 82.19 74.62 152 144.18 221.43S349 2402.37 431.24 2434.37c79.56 30.9 170.34 52 303.41 58.06C868 2498.49 910.54 2500 1250 2500s382.07-1.41 515.35-7.57c133.08-6.06 223.95-27.16 303.41-58.06 82.19-32 151.86-74.72 221.43-144.18s112.18-139.24 144.18-221.43c30.9-79.46 52.1-170.34 58.06-303.41 6.06-133.38 7.47-175.89 7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95 97.54 2068.86 65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17 1.51 1589.56 0 1250.1 0S868 1.41 734.65 7.57"
                      fill="url(#a)"
                    />
                    <path
                      d="M833.4 1250c0-230.11 186.49-416.7 416.6-416.7s416.7 186.59 416.7 416.7-186.59 416.7-416.7 416.7-416.6-186.59-416.6-416.7m-225.26 0c0 354.5 287.36 641.86 641.86 641.86s641.86-287.36 641.86-641.86S1604.5 608.14 1250 608.14 608.14 895.5 608.14 1250m1159.13-667.31a150 150 0 1 0 150.06-149.94h-.06a150.07 150.07 0 0 0-150 149.94M745 2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28 7.27-505.15c5.55-121.87 26-188 43-232.13 22.72-58.36 49.78-100 93.5-143.78s85.32-70.88 143.78-93.5c44-17.16 110.26-37.46 232.13-43 131.76-6.06 171.34-7.27 505-7.27s373.28 1.31 505.15 7.27c121.87 5.55 188 26 232.13 43 58.36 22.62 100 49.78 143.78 93.5s70.78 85.42 93.5 143.78c17.16 44 37.46 110.26 43 232.13 6.06 131.87 7.27 171.34 7.27 505.15s-1.21 373.28-7.27 505.15c-5.55 121.87-25.95 188.11-43 232.13-22.72 58.36-49.78 100-93.5 143.68s-85.42 70.78-143.78 93.5c-44 17.16-110.26 37.46-232.13 43-131.76 6.06-171.34 7.27-505.15 7.27s-373.28-1.21-505-7.27M734.65 7.57c-133.07 6.06-224 27.16-303.41 58.06C349 97.54 279.38 140.35 209.81 209.81S97.54 349 65.63 431.24c-30.9 79.46-52 170.34-58.06 303.41C1.41 867.93 0 910.54 0 1250s1.41 382.07 7.57 515.35c6.06 133.08 27.16 223.95 58.06 303.41 31.91 82.19 74.62 152 144.18 221.43S349 2402.37 431.24 2434.37c79.56 30.9 170.34 52 303.41 58.06C868 2498.49 910.54 2500 1250 2500s382.07-1.41 515.35-7.57c133.08-6.06 223.95-27.16 303.41-58.06 82.19-32 151.86-74.72 221.43-144.18s112.18-139.24 144.18-221.43c30.9-79.46 52.1-170.34 58.06-303.41 6.06-133.38 7.47-175.89 7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95 97.54 2068.86 65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17 1.51 1589.56 0 1250.1 0S868 1.41 734.65 7.57"
                      fill="url(#b)"
                    />
                  </svg>
                  INSTAGRAM
                </div>
              </div>
              <SelectItem className="cursor-pointer" value="ig-square">
                Instagram Square 1080×1080 (1:1)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="ig-portrait-45">
                Instagram Portrait 1080×1350 (4:5)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="story-1080x1920">
                Instagram Stories/Reel 1080×1920 (9:16)
              </SelectItem>

              {/* Divider */}
              <div className="h-px bg-white/10 my-1" />

              {/* Twitter/X Section */}
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <svg
                    width="15"
                    height="15"
                    viewBox="-0.25 -104.25 1109.5 1109.5"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M741 .2V0h52l19 3.8q19 3.7 34.5 9.7t30 14 26.301 16.3q11.7 8.2 21 17.4 9.198 9.3 28.699 4.8c19.501-4.5 27-7.167 42-12.5s29.834-11.333 44.5-18q22-10 26.801-12.7 4.7-2.799 5-3l.199-.3 1-.5 1-.5 1-.5 1-.5.2-.3.3-.2.301-.2.199-.3 1-.3 1-.2-.199 1.5-.301 1.5-.5 1.5-.5 1.5-.5 1-.5 1-.5 1.5q-.5 1.5-1 4t-9.5 20C1055.5 67 1051 73 1042 85s-17.066 21.066-24.199 27.2q-10.8 9.3-14.301 13-3.5 3.8-8.5 7l-5 3.3-1 .5-1 .5-.199.3-.301.2-.3.2-.2.3-1 .5-1 .5-.199.3-.301.2-.3.2-.2.3-.199.3-.301.2-.3.2-.2.3h5l28-6q28-6 53.5-14.5l27-9 3-1 1.5-.5 1-.5 1-.5 1-.5 1-.5 2-.3 2-.2v2l-.5.2-.5.3-.199.3-.301.2-.3.2-.2.3-.199.3-.301.2-.3.2-.2.3-.199.3-.301.2-.5 1-.5 1-.3.2q-.2.3-12.7 17-12.5 16.8-13.5 17-1 .3-2.8 3-1.7 2.8-21.2 22.3c-19.5 19.5-25.732 24.566-38.199 34.7q-18.8 15.3-19 37.6-.3 22.2-2.301 50.2-2 28-7.5 60.5T970 430t-28 80c-16.5 39-22.5 49.333-34.5 70s-23 38.167-33 52.5-20.166 27.833-30.5 40.5q-15.5 19-39.199 42.8-23.8 23.7-26 26-2.299 2.2-19.601 16.4-17.2 14.3-37 28.6-19.7 14.2-36.2 23.7c-16.5 9.5-24.266 13.566-39.8 21.7Q623 844.5 596 855c-27 10.5-37 13.5-57 19.5s-39.333 10.667-58 14q-28 5-63.5 8.5l-35.5 3.5v.5h-65v-.5l-8.5-.5q-8.5-.5-14-1t-41.5-5.5c-36-5-42.833-6.667-56.5-10q-20.5-5-61-19c-40.5-14-50.1-18.767-69.3-28.3q-28.7-14.2-36-18Q23 814.5 14 809l-9-5.5-.199-.3-.301-.2-.3-.2-.2-.3-1-.5-1-.5-.199-.3-.301-.2-.3-.2-.2-.3-.199-.3L.5 800H0v-2l1 .2 1 .3 4.5.5q4.5.5 24.5 1.5t42.5 0c22.5-1 30.334-2.167 46-4.5q23.5-3.5 55.5-12t58.801-20.2q26.7-11.8 38-17.6 11.2-5.7 34.199-21.2l23-15.5.2-.3.3-.2.301-.2.199-.3.2-.3.3-.2.301-.2.199-.3 1-.3 1-.2.2-1 .3-1 .301-.2.199-.3-8-.5q-8-.5-15.5-1c-7.5-.5-12.833-1.833-23.5-4.5q-15.999-4-34.5-12t-36-19-25.3-18.3q-7.7-7.2-20-20.4-12.2-13.3-21.2-27.3c-9-14-11.733-20.101-17.199-32.3L124.5 551l-.5-1.5-.5-1.5-.3-1-.2-1 1.5.2 1.5.3 11 1.5q11.001 1.5 34.5 1t32.5-2c9-1.5 9.667-1.667 11-2l2-.5 2.5-.5 2.5-.5.2-.3.3-.2.301-.2.199-.3-2-.5-2-.5-2-.5-2-.5-2-.5q-2-.5-7-2t-27-11-35-18.5a242 242 0 0 1-24.8-19.7Q107.5 478 93.5 461t-25-39.5-16.5-43a232 232 0 0 1-7.199-41.5L43 316l1 .2 1 .3 1 .5 1 .5 1 .5 1 .5 15.5 7q15.5 7 38.5 12t27.5 5.5l4.5.5h9l-.199-.3-.301-.2-.3-.2-.2-.3-.199-.3-.301-.2-.3-.2-.2-.3-1-.5-1-.5-.199-.3-.301-.2-.3-.2-.2-.3-1-.5-1-.5-.199-.3q-.3-.2-8.601-6.4-8.2-6.3-17.2-16.3c-9-10-12-13.667-18-21A162 162 0 0 1 77 271q-7-12.5-14.8-31.8-7.7-19.2-11.7-38.7T46 162t1-32.5c1.5-13.5 3-19.167 6-30.5s7.334-23.333 13-36l8.5-19 .5-1.5.5-1.5.301-.2.199-.3.2-.3.3-.2.301.2.199.3.2.3.3.2.301.2.199.3.2.3.3.2.5 1 .5 1 .301.2.199.3 13.5 15q13.5 15 32 33.5t20.5 19.2q2 .8 5 4.6 3 3.7 20 17.7t44.5 32.5 61 36.5 72 32.5 54 19 53 11.5c37.5 7 43.834 7.667 56.5 9q19 2 26 2.3l7 .2-.199-1.5-.301-1.5-2-12.5q-2-12.5-2-35c0-22.5 1.167-28.833 3.5-41.5q3.501-19 10.5-38.5t13.7-31.3q6.8-11.7 17.8-26.7t28.5-31 40-28.5C677 17.5 683.334 15.333 696 11q19-6.5 32-8.5t13-2.3z"
                      fill="#5da8dc"
                      stroke="#5da8dc"
                      strokeWidth=".5"
                    />
                  </svg>
                  X/TWITTER
                </div>
              </div>
              <SelectItem className="cursor-pointer" value="twitter-1500x500">
                X/Twitter Cover 1500×500 (3:1)
              </SelectItem>
              <SelectItem className="cursor-pointer" value="twitter-1200x675">
                X/Twitter Post 1200×675 (16:9)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Effects Section */}
      <div className="bg-card p-2.5 rounded-lg">
        <button
          onClick={() => toggleSection("effects")}
          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          EFFECTS
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              expandedSections.effects ? "" : "-rotate-90"
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.effects
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              {/* Effects Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-20 h-15 flex flex-col items-center justify-center rounded-lg bg-muted hover:bg-muted/80 border border-border text-xs text-foreground cursor-pointer">
                    <span className="font-medium">Effects</span>
                    <span
                      className={`text-sm mt-1 ${
                        props.backgroundNoise > 0 || props.backgroundBlur > 0
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {props.backgroundNoise > 0 || props.backgroundBlur > 0
                        ? "On"
                        : "Off"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="right"
                  sideOffset={173}
                  className="w-64 bg-popover border-border text-popover-foreground"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-foreground">
                      Background Effects
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-xs text-muted-foreground flex items-center justify-between">
                        <span>Noise</span>
                        <span className="text-foreground">
                          {props.backgroundNoise}%
                        </span>
                      </div>
                      <Slider
                        value={[props.backgroundNoise]}
                        onValueChange={([v]) => props.setBackgroundNoise(v)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <div className="mb-2 text-xs text-muted-foreground flex items-center justify-between">
                        <span>Blur</span>
                        <span className="text-foreground">
                          {Math.round((props.backgroundBlur / 20) * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[props.backgroundBlur]}
                        onValueChange={([v]) => props.setBackgroundBlur(v)}
                        min={0}
                        max={20}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* TEXT Section */}
      <div className="bg-card p-2.5 rounded-lg">
        <button
          onClick={() => toggleSection("text")}
          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          TEXT
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              expandedSections.text ? "" : "-rotate-90"
            }`}
          />
        </button>
        <div
          className={`transition-all duration-300 ${
            expandedSections.text
              ? "max-h-96 opacity-100 mt-2 overflow-y-auto"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="space-y-4">
            {/* Add Text Button */}
            <button
              onClick={() =>
                props.addText({
                  content: "New Text",
                  color: "#ffffff",
                  fontFamily: "Arial",
                  fontSize: 24,
                  fontWeight: "400",
                  lineHeight: 1.2,
                  letterSpacing: 0,
                  textAlign: "left",
                  opacity: 1.0,
                  x: 200,
                  y: 200,
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 0,
                  textShadowBlur: 0,
                  textShadowColor: "#000000",
                })
              }
              className="w-full h-10 rounded-lg border border-border bg-muted hover:bg-muted/80 text-xs text-foreground cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Text
            </button>

            {/* Text List */}
            {props.texts.length > 0 && (
              <div className="space-y-2">
                {props.texts.map((text) => (
                  <div
                    key={text.id}
                    className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground truncate">
                        {text.content}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {text.fontSize}px • {text.fontFamily} •{" "}
                        {text.fontWeight}
                      </div>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="h-6 w-6 rounded border border-border bg-muted hover:bg-primary/20 hover:border-primary/50 text-muted-foreground hover:text-primary cursor-pointer flex items-center justify-center"
                          title="Edit text"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        side="right"
                        sideOffset={65}
                        className="w-64 max-h-[calc(100vh)] overflow-y-auto bg-popover border-border text-popover-foreground"
                      >
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Content
                            </Label>
                            <textarea
                              value={text.content}
                              onChange={(e) =>
                                props.updateText(text.id, {
                                  content: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                // Allow default behavior for Enter key to create new lines
                                if (e.key === "Enter") {
                                  e.stopPropagation();
                                }
                              }}
                              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                              rows={3}
                              placeholder="Enter your text here..."
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Font Family
                            </Label>
                            <Select
                              value={text.fontFamily}
                              onValueChange={(value) =>
                                props.updateText(text.id, {
                                  fontFamily: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full bg-input border-border text-foreground text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover text-popover-foreground border-border">
                                <SelectItem value="Bricolage Grotesque">
                                  Bricolage Grotesque
                                </SelectItem>
                                <SelectItem value="Arial">Arial</SelectItem>
                                <SelectItem value="Helvetica">
                                  Helvetica
                                </SelectItem>
                                <SelectItem value="Times New Roman">
                                  Times New Roman
                                </SelectItem>
                                <SelectItem value="Georgia">Georgia</SelectItem>
                                <SelectItem value="Verdana">Verdana</SelectItem>
                                <SelectItem value="Courier New">
                                  Courier New
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Font Weight
                            </Label>
                            <Select
                              value={text.fontWeight}
                              onValueChange={(value) =>
                                props.updateText(text.id, {
                                  fontWeight: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full bg-input border-border text-foreground text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover text-popover-foreground border-border">
                                <SelectItem value="100">Thin (100)</SelectItem>
                                <SelectItem value="200">
                                  Extra Light (200)
                                </SelectItem>
                                <SelectItem value="300">Light (300)</SelectItem>
                                <SelectItem value="400">
                                  Regular (400)
                                </SelectItem>
                                <SelectItem value="500">
                                  Medium (500)
                                </SelectItem>
                                <SelectItem value="600">
                                  Semi Bold (600)
                                </SelectItem>
                                <SelectItem value="700">Bold (700)</SelectItem>
                                <SelectItem value="800">
                                  Extra Bold (800)
                                </SelectItem>
                                <SelectItem value="900">Black (900)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Font Size
                            </Label>
                            <input
                              type="number"
                              value={text.fontSize}
                              onChange={(e) =>
                                props.updateText(text.id, {
                                  fontSize: parseInt(e.target.value) || 8,
                                })
                              }
                              min={8}
                              max={500}
                              step={1}
                              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              px
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Line Height
                            </Label>
                            <Slider
                              value={[text.lineHeight || 1.2]}
                              onValueChange={([v]) =>
                                props.updateText(text.id, { lineHeight: v })
                              }
                              min={0.8}
                              max={3.0}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {(text.lineHeight || 1.2).toFixed(1)}
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Letter Spacing
                            </Label>
                            <Slider
                              value={[text.letterSpacing || 0]}
                              onValueChange={([v]) =>
                                props.updateText(text.id, {
                                  letterSpacing: v,
                                })
                              }
                              min={-2}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {(text.letterSpacing || 0).toFixed(1)}px
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Text Align
                            </Label>
                            <Select
                              value={text.textAlign || "left"}
                              onValueChange={(
                                value: "left" | "center" | "right" | "justify"
                              ) =>
                                props.updateText(text.id, {
                                  textAlign: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-full bg-input border-border text-foreground text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover text-popover-foreground border-border">
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                                <SelectItem value="justify">Justify</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Opacity
                            </Label>
                            <Slider
                              value={[text.opacity * 100 || 100]}
                              onValueChange={([v]) =>
                                props.updateText(text.id, {
                                  opacity: v / 100,
                                })
                              }
                              min={0}
                              max={100}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {Math.round((text.opacity || 1) * 100)}%
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Color
                            </Label>
                            <div className="flex flex-row flex-wrap gap-2">
                              {[
                                "#ffffff",
                                "#000000",
                                "#ff0000",
                                "#00ff00",
                                "#0000ff",
                                "#ffff00",
                                "#ff00ff",
                                "#00ffff",
                                "#ffa500",
                                "#800080",
                                "#008000",
                                "#808080",
                              ].map((c) => (
                                <button
                                  key={c}
                                  onClick={() =>
                                    props.updateText(text.id, { color: c })
                                  }
                                  className={`h-6 w-6 rounded border cursor-pointer ${
                                    text.color === c
                                      ? "border-purple-500 ring-1 ring-purple-500/50"
                                      : "border-white/20"
                                  }`}
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>
                            <div className="mt-3 space-y-2">
                              <Label className="text-xs text-muted-foreground block">
                                Custom Color
                              </Label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={
                                    text.color.startsWith("#")
                                      ? text.color
                                      : "#000000"
                                  }
                                  onChange={(e) =>
                                    props.updateText(text.id, {
                                      color: e.target.value,
                                    })
                                  }
                                  className="h-8 w-12 rounded border border-border bg-input cursor-pointer"
                                  title="Color picker"
                                />
                                <input
                                  type="text"
                                  value={text.color}
                                  onChange={(e) =>
                                    props.updateText(text.id, {
                                      color: e.target.value,
                                    })
                                  }
                                  placeholder="#000000, rgb(0,0,0), hsl(0,0%,0%)"
                                  className="flex-1 h-8 rounded border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                  title="Enter color (hex, rgb, hsl, etc.)"
                                />
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Text Shadow
                            </Label>
                            <div className="space-y-2">
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Offset X
                                </Label>
                                <Slider
                                  value={[text.textShadowOffsetX || 0]}
                                  onValueChange={([v]) =>
                                    props.updateText(text.id, {
                                      textShadowOffsetX: v,
                                    })
                                  }
                                  min={-20}
                                  max={20}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-xs text-muted-foreground mt-1">
                                  {text.textShadowOffsetX || 0}px
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Offset Y
                                </Label>
                                <Slider
                                  value={[text.textShadowOffsetY || 0]}
                                  onValueChange={([v]) =>
                                    props.updateText(text.id, {
                                      textShadowOffsetY: v,
                                    })
                                  }
                                  min={-20}
                                  max={20}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-xs text-muted-foreground mt-1">
                                  {text.textShadowOffsetY || 0}px
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">
                                  Blur
                                </Label>
                                <Slider
                                  value={[text.textShadowBlur || 0]}
                                  onValueChange={([v]) =>
                                    props.updateText(text.id, {
                                      textShadowBlur: v,
                                    })
                                  }
                                  min={0}
                                  max={20}
                                  step={1}
                                  className="w-full"
                                />
                                <div className="text-xs text-muted-foreground mt-1">
                                  {text.textShadowBlur || 0}px
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground mb-2 block">
                                  Color
                                </Label>
                                <div className="flex flex-row flex-wrap gap-2">
                                  {[
                                    "#000000",
                                    "#ffffff",
                                    "#ff0000",
                                    "#00ff00",
                                    "#0000ff",
                                    "#ffff00",
                                    "#ff00ff",
                                    "#00ffff",
                                    "#ffa500",
                                    "#800080",
                                    "#008000",
                                    "#808080",
                                  ].map((c) => (
                                    <button
                                      key={c}
                                      onClick={() =>
                                        props.updateText(text.id, {
                                          textShadowColor: c,
                                        })
                                      }
                                      className={`h-6 w-6 rounded border cursor-pointer ${
                                        (text.textShadowColor || "#000000") ===
                                        c
                                          ? "border-purple-500 ring-1 ring-purple-500/50"
                                          : "border-white/20"
                                      }`}
                                      style={{ backgroundColor: c }}
                                      title={c}
                                    />
                                  ))}
                                </div>
                                <div className="mt-2">
                                  <input
                                    type="color"
                                    value={
                                      (
                                        text.textShadowColor || "#000000"
                                      ).startsWith("#")
                                        ? text.textShadowColor || "#000000"
                                        : "#000000"
                                    }
                                    onChange={(e) =>
                                      props.updateText(text.id, {
                                        textShadowColor: e.target.value,
                                      })
                                    }
                                    className="h-8 w-12 rounded border border-border bg-input cursor-pointer"
                                    title="Text shadow color picker"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <button
                      onClick={() => props.removeText(text.id)}
                      className="h-6 w-6 rounded border border-border bg-muted hover:bg-destructive/20 hover:border-destructive/50 text-muted-foreground hover:text-destructive cursor-pointer flex items-center justify-center"
                      title="Remove text"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {props.texts.length === 0 && (
              <div className="text-center py-4">
                <div className="text-xs text-muted-foreground">
                  No texts added yet
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card p-2.5 rounded-lg">
        <button
          onClick={() => toggleSection("background")}
          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          BACKGROUND
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              expandedSections.background ? "" : "-rotate-90"
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.background
              ? "max-h-[2500px] opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          {/* Tabs para fondo */}
          <div className="mb-4">
            <Tabs
              value={backgroundTab}
              onValueChange={setBackgroundTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-white/5 overflow-hidden px-1 py-1">
                <TabsTrigger
                  value="transparent"
                  className={`flex items-center gap-2 text-xs text-foreground cursor-pointer z-10 transition-colors ${
                    backgroundTab === "transparent"
                      ? "bg-primary/20 border-primary"
                      : "bg-transparent"
                  }`}
                  onClick={() => {
                    setBackgroundTab("transparent");
                    props.setBackgroundType("transparent");
                    props.setBackgroundColor("rgba(0,0,0,0)");
                  }}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {/* Icono SVG para Transparent */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      width="15"
                      height="15"
                      fill="none"
                    >
                      <rect
                        width="15"
                        height="15"
                        fill="url(#transparent_svg__a)"
                        fillOpacity="0.4"
                        rx="6"
                      ></rect>
                      <rect
                        width="14"
                        height="14"
                        x="0.5"
                        y="0.5"
                        stroke="#fff"
                        strokeOpacity="0.16"
                        rx="5.5"
                      ></rect>
                      <defs>
                        <pattern
                          id="transparent_svg__a"
                          width="1"
                          height="1"
                          patternContentUnits="objectBoundingBox"
                        >
                          <use
                            xlinkHref="#transparent_svg__b"
                            transform="scale(.01563)"
                          ></use>
                        </pattern>
                        <image
                          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA40lEQVR4Xu3bQQ6EQAhEUbj/oXsO8Sdh4XOvJAi/qkF3Zt6E6710++xuiD6T40uACtACqYlzD2IACFKBkoHcgmSQDJJBMngKIT6ADygF6DSYfcCLTzg/z0eGrASogDbT0gKxB2MB5pkiBoBgrEEMwIBjLx9fAAiCIAhygmkkRgYjhWMHditsL2AvYC+QIHjdwzk+BmAABmBAWc1kCF0bKRAEQRAEQRAMGaACbaCUz/P5BRiKxhQaiV07uRjfYgQDMKDpGAhGCMUCzD4CBEEw1iAGYIBPZMJh+g8/P8cKpAJfV4EfMee/sLtaEFIAAAAASUVORK5CYII="
                          id="transparent_svg__b"
                          width="64"
                          height="64"
                        ></image>
                      </defs>
                    </svg>
                  </span>
                  Tran...
                </TabsTrigger>
                <TabsTrigger
                  value="color"
                  className={`flex items-center gap-2 text-xs text-foreground cursor-pointer z-10 transition-colors ${
                    backgroundTab === "color"
                      ? "bg-primary/20 border-primary"
                      : "bg-transparent"
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {/* Icono círculo blanco para Color */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="#fff"
                        fillOpacity="0.8"
                        stroke="#fff"
                        strokeOpacity="0.2"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  Color
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className={`flex items-center gap-2 text-xs text-foreground cursor-pointer z-10 transition-colors ${
                    backgroundTab === "image"
                      ? "bg-primary/20 border-primary"
                      : "bg-transparent"
                  }`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {/* Icono para Image */}
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </span>
                  Image
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Tab: Transparent */}
          {backgroundTab === "transparent" && (
            <div className="flex flex-col items-center justify-center py-6">
              <button
                onClick={() => {
                  props.setBackgroundType("transparent");
                  props.setBackgroundColor("rgba(0,0,0,0)");
                }}
                className={`h-10 w-32 rounded-lg border text-xs text-foreground cursor-pointer ${
                  props.backgroundType === "transparent"
                    ? "border-primary bg-primary/20"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
              >
                No Background
              </button>
              <span className="text-xs text-muted-foreground mt-2">
                Export transparent PNG
              </span>
            </div>
          )}
          {/* Tab: Color */}
          {backgroundTab === "color" && (
            <div className="space-y-6">
              {/* Solid Colors Section */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Solid Colors
                </h3>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {colorGroups
                    .flatMap((group) => group.colors)
                    .slice(0, 3)
                    .map((c, index) => (
                      <button
                        key={`solid-${index}`}
                        onClick={() => {
                          props.setBackgroundType("solid");
                          props.setBackgroundColor(c);
                        }}
                        className={`h-8 rounded border cursor-pointer ${
                          props.backgroundColor === c &&
                          props.backgroundType === "solid"
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-white/10"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        solid: !prev.solid,
                      }))
                    }
                    className={`h-8 rounded border border-border cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.solid
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                        backgroundExpandedSections.solid ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.solid && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {colorGroups
                      .flatMap((group) => group.colors)
                      .slice(3)
                      .map((c, index) => (
                        <button
                          key={`solid-expanded-${index}`}
                          onClick={() => {
                            props.setBackgroundType("solid");
                            props.setBackgroundColor(c);
                          }}
                          className={`h-8 rounded border cursor-pointer ${
                            props.backgroundColor === c &&
                            props.backgroundType === "solid"
                              ? "border-purple-500 ring-2 ring-purple-500/50"
                              : "border-white/10"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Linear Gradients Section */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Linear Gradients
                </h3>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {gradientPresets.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        props.setBackgroundType("gradient");
                        props.setSelectedPreset(p.id);
                      }}
                      className={`h-8 rounded border cursor-pointer ${
                        props.selectedPreset === p.id &&
                        props.backgroundType === "gradient"
                          ? "border-purple-500 ring-2 ring-purple-500/50"
                          : "border-white/10"
                      }`}
                      style={{ background: p.gradient }}
                    />
                  ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        linear: !prev.linear,
                      }))
                    }
                    className={`h-8 rounded border border-border cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.linear
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                        backgroundExpandedSections.linear ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.linear && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {gradientPresets.slice(3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          props.setBackgroundType("gradient");
                          props.setSelectedPreset(p.id);
                        }}
                        className={`h-8 rounded border cursor-pointer ${
                          props.selectedPreset === p.id &&
                          props.backgroundType === "gradient"
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-white/10"
                        }`}
                        style={{ background: p.gradient }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Radial Gradients Section */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Radial Gradients
                </h3>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {radialGradientPresets.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        props.setBackgroundType("gradient");
                        props.setSelectedPreset(p.id);
                      }}
                      className={`h-8 rounded border cursor-pointer ${
                        props.selectedPreset === p.id &&
                        props.backgroundType === "gradient"
                          ? "border-purple-500 ring-2 ring-purple-500/50"
                          : "border-white/10"
                      }`}
                      style={{ background: p.gradient }}
                    />
                  ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        radial: !prev.radial,
                      }))
                    }
                    className={`h-8 rounded border border-border cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.radial
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                        backgroundExpandedSections.radial ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.radial && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {radialGradientPresets.slice(3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          props.setBackgroundType("gradient");
                          props.setSelectedPreset(p.id);
                        }}
                        className={`h-8 rounded border cursor-pointer ${
                          props.selectedPreset === p.id &&
                          props.backgroundType === "gradient"
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-white/10"
                        }`}
                        style={{ background: p.gradient }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Cosmic Gradients Section */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Cosmic Gradients
                </h3>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {Array.from({ length: 3 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={`cosmic-${num}`}
                      onClick={() => {
                        props.setBackgroundType("cosmic");
                        props.setSelectedPreset(`cosmic-gradient-${num}`);
                      }}
                      className={`h-8 rounded border cursor-pointer overflow-hidden ${
                        props.selectedPreset === `cosmic-gradient-${num}` &&
                        props.backgroundType === "cosmic"
                          ? "border-purple-500 ring-2 ring-purple-500/50"
                          : "border-white/10"
                      }`}
                    >
                      <Image
                        src={`/cosmic-gradient-${num}.png`}
                        alt={`Cosmic Gradient ${num}`}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        cosmic: !prev.cosmic,
                      }))
                    }
                    className={`h-8 rounded border border-border cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.cosmic
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                        backgroundExpandedSections.cosmic ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.cosmic && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 7 }, (_, i) => i + 4).map((num) => (
                      <button
                        key={`cosmic-${num}`}
                        onClick={() => {
                          props.setBackgroundType("cosmic");
                          props.setSelectedPreset(`cosmic-gradient-${num}`);
                        }}
                        className={`h-8 rounded border cursor-pointer overflow-hidden ${
                          props.selectedPreset === `cosmic-gradient-${num}` &&
                          props.backgroundType === "cosmic"
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-white/10"
                        }`}
                      >
                        <Image
                          src={`/cosmic-gradient-${num}.png`}
                          alt={`Cosmic Gradient ${num}`}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Textures Section */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  Textures
                </h3>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {Array.from({ length: 3 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={`texture-${num}`}
                      onClick={() => {
                        props.setBackgroundType("textures");
                        props.setSelectedPreset(`textures-${num}`);
                      }}
                      className={`h-8 rounded border cursor-pointer overflow-hidden ${
                        props.selectedPreset === `textures-${num}` &&
                        props.backgroundType === "textures"
                          ? "border-purple-500 ring-2 ring-purple-500/50"
                          : "border-white/10"
                      }`}
                    >
                      <Image
                        src={`/textures-${num}.jpg`}
                        alt={`Texture ${num}`}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        textures: !prev.textures,
                      }))
                    }
                    className={`h-8 rounded border border-border cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.textures
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                        backgroundExpandedSections.textures ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.textures && (
                  <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: 9 }, (_, i) => i + 4).map((num) => (
                      <button
                        key={`texture-${num}`}
                        onClick={() => {
                          props.setBackgroundType("textures");
                          props.setSelectedPreset(`textures-${num}`);
                        }}
                        className={`h-8 rounded border cursor-pointer overflow-hidden ${
                          props.selectedPreset === `textures-${num}` &&
                          props.backgroundType === "textures"
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-white/10"
                        }`}
                      >
                        <Image
                          src={`/textures-${num}.jpg`}
                          alt={`Texture ${num}`}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {backgroundTab === "image" && (
            <div className="flex flex-col items-center justify-center py-6">
              {props.backgroundImage ? (
                <div className="relative group">
                  <Image
                    src={props.backgroundImage}
                    alt="Background image"
                    width={200}
                    height={150}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              props.setBackgroundImage(
                                event.target?.result as string
                              );
                              props.setBackgroundType("image");
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer"
                      title="Replace image"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        props.setBackgroundImage(undefined);
                        props.setBackgroundType("transparent");
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer relative aspect-video bg-muted border border-border border-dashed rounded-lg hover:bg-muted/80 transition-colors p-4">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground text-center">
                    Drop or click to upload background image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          props.setBackgroundImage(
                            event.target?.result as string
                          );
                          props.setBackgroundType("image");
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrameTab;
