// mockup-canvas.tsx
"use client";

import { useEffect, useId, useRef, useState, CSSProperties } from "react";
import { SimpleDeviceFrame } from "@/components/device-frames/simple-device-frame";
import { SafariFrame } from "@/components/device-frames/safari-frame";
import { ChromeFrame } from "@/components/device-frames/chrome-frame";
import { IPhone17ProFrame } from "@/components/device-frames/iphone-17-pro-frame";
import { IPhone17ProMaxFrame } from "@/components/device-frames/iphone-17-pro-max-frame";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  computeRenderSize,
  getDeviceDimensions,
  getEffectiveZoom,
} from "@/lib/mockup-utils";

interface MockupCanvasProps {
  uploadedImages: (string | null)[];
  selectedDevice: string;
  selectedTemplate: string | null;
  selectedPreset: string;
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
    | "transparent"
    | "image";
  backgroundColor: string;
  backgroundImage?: string;
  backgroundNoise: number;
  backgroundBlur: number;
  padding: number;
  shadowOpacity: number;
  borderRadius: number;
  borderType: string;
  rotation: number;
  scale: number;
  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid";
  styleEdge: number;
  shadowType: string;
  shadowMode?: "presets" | "custom";
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  shadowColor?: string;
  sceneType: "none" | "shadow" | "shapes";
  zoom: number;
  panX: number;
  panY: number;
  layoutMode: "single" | "double" | "triple";
  siteUrl?: string;
  onImageUpload?: (file: File, index?: number) => void;
  hideMockup?: boolean;
  /** NEW: dynamic canvas size */
  canvasWidth?: number;
  canvasHeight?: number;
}

const gradientPresets: Record<string, string> = {
  // Linear gradients - Ultra Modern Wallpaper Collection
  "purple-pink": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "blue-purple": "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
  "pink-orange": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "green-blue": "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "orange-red": "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  "teal-lime": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "cosmic-flow":
    "linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  "sunset-dream":
    "linear-gradient(120deg, #ff6b35 0%, #f7931e 20%, #ffb627 40%, #ff9505 60%, #f7931e 80%, #ff6b35 100%)",
  "ocean-breeze":
    "linear-gradient(60deg, #1e3a8a 0%, #3b82f6 25%, #06b6d4 50%, #10b981 75%, #34d399 100%)",
  "neon-glow":
    "linear-gradient(90deg, #ff0080 0%, #7928ca 20%, #4c1d95 40%, #06b6d4 60%, #10b981 80%, #f59e0b 100%)",
  "galaxy-wave":
    "linear-gradient(30deg, #7c3aed 0%, #a855f7 15%, #c084fc 30%, #e879f9 45%, #ec4899 60%, #f97316 75%, #f59e0b 90%, #fbbf24 100%)",
  "arctic-light":
    "linear-gradient(150deg, #06b6d4 0%, #3b82f6 20%, #8b5cf6 40%, #ec4899 60%, #f97316 80%, #f59e0b 100%)",
  // Radial gradients - Ultra Modern Wallpaper Collection
  "cosmic-dream":
    "radial-gradient(circle at 20% 50%, #ff0080 0%, #7928ca 25%, #4c1d95 50%, #1e1b4b 75%, #0f0f23 100%)",
  "sunset-blaze":
    "radial-gradient(circle at 40% 60%, #ff6b35 0%, #f7931e 20%, #ffb627 40%, #ff9505 60%, #ff6b35 80%, #d97706 100%)",
  "ocean-mystery":
    "radial-gradient(circle at 70% 30%, #1e3a8a 0%, #3b82f6 20%, #06b6d4 40%, #10b981 60%, #059669 80%, #047857 100%)",
  "neon-city":
    "radial-gradient(circle at 50% 50%, #ff0080 0%, #7928ca 25%, #4c1d95 50%, #06b6d4 75%, #10b981 100%)",
  "galaxy-spiral":
    "radial-gradient(circle at 30% 70%, #7c3aed 0%, #a855f7 15%, #c084fc 30%, #e879f9 45%, #ec4899 60%, #f97316 75%, #f59e0b 90%, #fbbf24 100%)",
  "arctic-aurora":
    "radial-gradient(circle at 60% 40%, #06b6d4 0%, #3b82f6 20%, #8b5cf6 40%, #ec4899 60%, #f97316 80%, #f59e0b 100%)",
  "lava-volcano":
    "radial-gradient(circle at 50% 80%, #dc2626 0%, #ea580c 15%, #f59e0b 30%, #fbbf24 45%, #f97316 60%, #ef4444 75%, #dc2626 90%, #b91c1c 100%)",
  "midnight-velvet":
    "radial-gradient(circle at 80% 20%, #1e1b4b 0%, #312e81 20%, #7c3aed 40%, #a855f7 60%, #ec4899 80%, #f97316 100%)",
  "emerald-paradise":
    "radial-gradient(circle at 25% 75%, #065f46 0%, #047857 20%, #059669 40%, #10b981 60%, #34d399 80%, #6ee7b7 100%)",
  "golden-sunset":
    "radial-gradient(circle at 45% 55%, #92400e 0%, #d97706 20%, #f59e0b 40%, #fbbf24 60%, #fcd34d 80%, #fef3c7 100%)",
  "cyber-punk":
    "radial-gradient(circle at 50% 50%, #ff0080 0%, #7928ca 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%)",
  "royal-purple":
    "radial-gradient(circle at 35% 65%, #581c87 0%, #7c3aed 20%, #a855f7 40%, #c084fc 60%, #e879f9 80%, #f97316 100%)",
};

/* ---------- color helpers ---------- */
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const hexToRgb = (hex: string) => {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
};
const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
const mixHex = (a: string, b: string, t = 0.5) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const b2 = Math.round(A.b + (B.b - A.b) * t);
  return rgbToHex(r, g, b2);
};
const toRgba = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp01(alpha)})`;
};
const parseHexesFromGradient = (g: string): string[] => {
  const m = g.match(/#(?:[0-9a-f]{3}){1,2}/gi);
  return m && m.length ? m : ["#999999"];
};
const dominantFromBackground = (
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
    | "transparent"
    | "image",
  colorHex: string,
  preset: string
) => {
  if (type === "solid") return colorHex;
  if (type === "gradient" && gradientPresets[preset]) {
    const stops = parseHexesFromGradient(gradientPresets[preset]);
    if (stops.length === 1) return stops[0];
    return mixHex(stops[0], stops[stops.length - 1], 0.4);
  }
  return colorHex || "#888888";
};

export function MockupCanvas(props: MockupCanvasProps) {
  const {
    uploadedImages,
    selectedDevice,
    selectedTemplate,
    selectedPreset,
    backgroundType,
    backgroundColor,
    backgroundImage,
    backgroundNoise,
    backgroundBlur,
    shadowOpacity,
    borderRadius,
    borderType,
    rotation,
    scale,
    deviceStyle,
    styleEdge,
    shadowType,
    shadowMode,
    shadowOffsetX,
    shadowOffsetY,
    shadowBlur,
    shadowSpread,
    shadowColor,
    sceneType,
    zoom,
    panX,
    panY,
    layoutMode,
    siteUrl,
    onImageUpload,
    hideMockup,
    /** NEW: dynamic canvas size props */
    canvasWidth,
    canvasHeight,
  } = props;

  /** NEW: fallback to constants if not provided */
  const CW = canvasWidth ?? CANVAS_WIDTH;
  const CH = canvasHeight ?? CANVAS_HEIGHT;

  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSize, setImageSize] = useState({ width: 1920, height: 1080 });

  // ---- responsive scaling (centrado real) ----
  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  // margen lateral “de respiración”
  const SAFE_MARGIN = 16;

  useEffect(() => setIsDragging(dragCounter > 0), [dragCounter]);

  const currentImage = uploadedImages[0];

  useEffect(() => {
    if (currentImage) {
      const img = document.createElement("img");
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = currentImage;
    }
  }, [currentImage]);

  // Fit-to-container by width AND height (keeps equal vertical margin)
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      const w = rect?.width ?? CW;
      const h = rect?.height ?? CH;

      const sW = (w - SAFE_MARGIN * 2) / CW;
      const sH = (h - SAFE_MARGIN * 2) / CH;
      const s = Math.max(0.01, Math.min(1, Math.min(sW, sH)));
      setScaleFactor(s);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [CW, CH]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((p) => p + 1);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((p) => Math.max(0, p - 1));
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile && onImageUpload) onImageUpload(imageFile, 0);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/") && onImageUpload) onImageUpload(f, 0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getBackgroundStyle = (): CSSProperties => {
    if (backgroundType === "gradient" && gradientPresets[selectedPreset]) {
      return { background: gradientPresets[selectedPreset] };
    }
    if (
      backgroundType === "cosmic" &&
      selectedPreset?.startsWith("cosmic-gradient-")
    ) {
      const num = selectedPreset.replace("cosmic-gradient-", "");
      return {
        backgroundImage: `url(/cosmic-gradient-${num}.png)`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    if (backgroundType === "image" && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    return { backgroundColor };
  };

  const getBackgroundEffectsStyle = (): CSSProperties => {
    const filters: string[] = [];

    // Blur effect (0-20px)
    if (backgroundBlur > 0) {
      filters.push(`blur(${backgroundBlur}px)`);
    }

    return {
      filter: filters.length > 0 ? filters.join(" ") : undefined,
    };
  };

  const renderNoiseOverlay = () => {
    // No renderizar ni crear canvas si el noise es 0 o menor
    if (typeof backgroundNoise !== "number" || backgroundNoise <= 0) {
      return null;
    }

    // Opacidad máxima del noise: 0.5 (slider 100)
    const noiseOpacity = (backgroundNoise / 100) * 0.5;
    if (noiseOpacity === 0) {
      return null;
    }

    // Create procedural noise using canvas
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 256, 256);
    const numPoints = Math.floor(8000 * (backgroundNoise / 100));
    for (let i = 0; i < numPoints; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const gray = Math.floor(Math.random() * 256);
      ctx.fillStyle = `rgba(${gray},${gray},${gray},${noiseOpacity})`;
      ctx.fillRect(x, y, 1, 1);
    }

    const noiseDataUrl = canvas.toDataURL("image/png");

    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${noiseDataUrl}")`,
          backgroundSize: "256px 256px",
          mixBlendMode: "overlay",
        }}
      />
    );
  };

  // === (UNICA) serie de cálculos de dimensiones ===
  const dims = getDeviceDimensions(selectedDevice);
  const baseSize =
    (dims.type === "screenshot" || dims.type === "browser") && uploadedImages[0]
      ? imageSize
      : { width: dims.width, height: dims.height };
  const renderSize = computeRenderSize(baseSize.width, baseSize.height);

  const effectiveBorderRadius = (() => {
    if (selectedDevice.includes("iphone")) return 40;
    if (borderType === "sharp") return 4;
    if (borderType === "round") return 40;
    return borderRadius;
  })();

  const getDeviceContentClass = () => "";

  /* ---------- sombras del mockup ---------- */
  const getShadowStyle = (): CSSProperties => {
    if (shadowMode === "custom") {
      const opacity = Math.max(0, Math.min(1, shadowOpacity / 100));
      const color =
        shadowColor && shadowColor.startsWith("#")
          ? toRgba(shadowColor, opacity)
          : shadowColor || `rgba(0,0,0,${opacity})`;

      const offsetX = shadowOffsetX ?? 0;
      const offsetY = shadowOffsetY ?? 0;
      const blur = Math.max(0, shadowBlur ?? 0);
      const spread = shadowSpread ?? 0;

      const layers: string[] = [
        `drop-shadow(${offsetX}px ${offsetY}px ${blur}px ${color})`,
      ];
      if (spread !== 0) {
        layers.push(
          `drop-shadow(${offsetX}px ${offsetY}px ${Math.max(
            0,
            blur + spread * 0.6
          )}px ${color})`
        );
        layers.push(
          `drop-shadow(${offsetX}px ${offsetY}px ${Math.max(
            0,
            blur + spread * 1.2
          )}px ${color})`
        );
      }
      return { filter: layers.join(" ") };
    }

    if (shadowType === "none") return {};
    const opacity = Math.max(0, Math.min(1, shadowOpacity / 100));
    const y = Math.max(2, (shadowOpacity / 100) * 24);
    const blur = Math.max(6, (shadowOpacity / 100) * 48);
    switch (shadowType) {
      case "spread":
        return {
          filter: `drop-shadow(0 ${y}px ${blur}px rgba(0,0,0,${
            opacity * 0.55
          }))`,
        };
      case "hug":
        return {
          filter: `drop-shadow(0 ${Math.max(1, y / 2)}px ${Math.max(
            4,
            blur / 1.6
          )}px rgba(0,0,0,${opacity * 0.8}))`,
        };
      case "adaptive":
        return {
          filter: `drop-shadow(0 ${Math.max(1, y * 0.7)}px ${Math.max(
            4,
            blur * 0.9
          )}px rgba(0,0,0,${opacity * 0.65}))`,
        };
      default:
        return {};
    }
  };

  /* ---------- anillo/borde ---------- */
  const dominant = dominantFromBackground(
    backgroundType,
    backgroundColor,
    selectedPreset
  );

  const renderStyleRing = () => {
    if (selectedDevice.includes("iphone")) return null;
    const edge = Math.max(0, Math.round(styleEdge || 0));
    if (edge <= 0 || deviceStyle === "default") return null;

    const ringCommon: React.CSSProperties = {
      position: "absolute",
      left: -edge,
      top: -edge,
      right: -edge,
      bottom: -edge,
      borderRadius: effectiveBorderRadius + edge,
      pointerEvents: "none",
    };

    const makeHollow = (
      extra?: React.CSSProperties,
      noMask = false
    ): React.CSSProperties => {
      const maskProps = noMask
        ? {}
        : {
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude",
          };
      return { padding: edge, ...maskProps, ...extra };
    };

    if (deviceStyle === "glass-light") {
      return (
        <div
          style={{
            ...ringCommon,
            backdropFilter: "blur(14px) saturate(130%)",
            WebkitBackdropFilter: "blur(14px) saturate(130%)",
            ...makeHollow({
              background: `linear-gradient(135deg, ${toRgba(
                "#ffffff",
                0.45
              )}, ${toRgba("#ffffff", 0.18)})`,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 30px rgba(0,0,0,0.25)",
            }),
          }}
        />
      );
    }
    if (deviceStyle === "glass-dark") {
      return (
        <div
          style={{
            ...ringCommon,
            backdropFilter: "blur(14px) saturate(130%)",
            WebkitBackdropFilter: "blur(14px) saturate(130%)",
            ...makeHollow({
              background: `linear-gradient(135deg, ${toRgba(
                "#222428",
                0.55
              )}, ${toRgba("#222428", 0.18)})`,
              boxShadow:
                "inset 0 1px 0 rgba(0,0,0,0.45), 0 10px 30px rgba(0,0,0,0.45)",
            }),
          }}
        />
      );
    }

    if (deviceStyle === "liquid") {
      const base = dominant;
      const accentHi = mixHex(base, "#ffffff", 0.7);
      const accentLo = mixHex(base, "#000000", 0.6);

      return (
        <div
          style={{
            ...ringCommon,
            backdropFilter: "blur(18px) saturate(160%)",
            WebkitBackdropFilter: "blur(18px) saturate(160%)",
            boxShadow: `0 12px 40px ${toRgba(base, 0.25)}, 0 0 0 ${Math.max(
              1,
              Math.round(edge * 0.15)
            )}px ${toRgba("#ffffff", 0.06)}`,
            ...makeHollow({
              background: `
                radial-gradient(100% 140% at 20% 0%, ${toRgba(
                  accentHi,
                  0.55
                )} 0%, transparent 55%),
                radial-gradient(120% 140% at 80% 100%, ${toRgba(
                  accentLo,
                  0.35
                )} 0%, transparent 60%),
                linear-gradient(135deg, ${toRgba(base, 0.26)} 0%, ${toRgba(
                "#ffffff",
                0.16
              )} 100%)
              `,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.12)",
            }),
          }}
        />
      );
    }

    return null;
  };

  const uid = useId();
  const gradId = `${uid}-uploadGradient`;
  const fadeGradId = `${uid}-brFadeGradient`;
  const maskId = `${uid}-brFadeMask`;

  const renderContent = (idx: number, deviceType?: string) => {
    const uploadedImage = uploadedImages[idx];
    if (!uploadedImage) {
      return (
        <div
          className={`flex h-full w-full items-center justify-center bg-black relative transition-all duration-200 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/3 to-blue-500/5 rounded-lg" />
          <div className="flex flex-col text-center items-center relative z-10">
            <div className="relative">
              <svg
                width="160"
                height="160"
                viewBox="0 0 24 24"
                fill="none"
                className={`drop-shadow-lg transition-all duration-200 ${
                  isDragging
                    ? "scale-110 animate-bounce"
                    : isHovered
                    ? "scale-105 animate-bounce"
                    : ""
                }`}
              >
                <defs>
                  <linearGradient
                    id={gradId}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
                  </linearGradient>
                  <radialGradient
                    id={fadeGradId}
                    cx="24"
                    cy="24"
                    r="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="50%" stopColor="#000" />
                    <stop offset="100%" stopColor="#fff" />
                    <stop offset="100%" stopColor="#fff" />
                  </radialGradient>
                  <mask
                    id={maskId}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="24"
                      height="24"
                      fill={`url(#${fadeGradId})`}
                    />
                  </mask>
                </defs>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3zm5.5 5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m2.854 3.354L12.5 15.5l5.646-5.646a.5.5 0 0 1 .854.353V19H5v-1l4.646-4.646a.5.5 0 0 1 .708 0"
                  fill={`url(#${gradId})`}
                  mask={`url(#${maskId})`}
                />
              </svg>

              <div
                className={`absolute inset-0 bg-linear-to-t from-purple-500/20 to-transparent rounded-full blur-xl transition-all duration-200 ${
                  isDragging
                    ? "from-purple-500/40 scale-110"
                    : isHovered
                    ? "from-purple-500/30 scale-105"
                    : ""
                }`}
              />

              <div className="absolute bottom-6 right-6 z-20">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-105">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-neutral-700"
                    >
                      <path
                        d="M12 4v16m8-8H4"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md -z-10" />
                </div>
              </div>
            </div>

            <p
              className={`mt-6 text-5xl font-bold drop-shadow-sm transition-all duration-200 cursor-pointer ${
                isDragging
                  ? "text-purple-300 scale-105"
                  : isHovered
                  ? "text-purple-300 scale-102"
                  : "text-neutral-200"
              }`}
            >
              {isDragging
                ? "Drop it here!"
                : isHovered
                ? "Ready to upload"
                : "Drop or click to load your image"}
            </p>
            <p className="mt-5 text-base text-neutral-400 max-w-xs transition-all duration-200 cursor-pointer">
              {isHovered
                ? "Drag & drop or click to browse files"
                : "Choose a file to preview your beautiful mockup"}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      );
    }

    return (
      <div
        className={`relative h-full w-full overflow-hidden bg-transparent ${getDeviceContentClass()}`}
        style={{
          backgroundImage: `url(${uploadedImage})`,
          backgroundSize: deviceType === "screenshot" ? "contain" : "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: deviceType === "screenshot" ? "none" : `scale(${zoom})`,
          transformOrigin: "center",
        }}
      />
    );
  };

  /* ---------- render del “mockup” (dispositivo) ---------- */
  const renderInnerByDevice = (idx: number) => {
    if (selectedDevice === "safari") {
      return (
        <SafariFrame
          width={renderSize.width}
          height={renderSize.height}
          borderRadius={effectiveBorderRadius}
          siteUrl={siteUrl}
          referenceWidth={renderSize.width}
        >
          {renderContent(idx, dims.type)}
        </SafariFrame>
      );
    }

    if (selectedDevice === "chrome") {
      return (
        <ChromeFrame
          width={renderSize.width}
          height={renderSize.height}
          borderRadius={effectiveBorderRadius}
          siteUrl={siteUrl}
          referenceWidth={renderSize.width}
        >
          {renderContent(idx, dims.type)}
        </ChromeFrame>
      );
    }

    if (dims.type === "browser") {
      return (
        <SafariFrame
          width={renderSize.width}
          height={renderSize.height}
          borderRadius={effectiveBorderRadius}
          siteUrl={siteUrl}
          referenceWidth={renderSize.width}
        >
          {renderContent(idx, dims.type)}
        </SafariFrame>
      );
    }

    if (dims.type === "screenshot") {
      return (
        <div
          className="relative overflow-hidden"
          style={{
            width: renderSize.width,
            height: renderSize.height,
            aspectRatio: `${renderSize.width}/${renderSize.height}`,
            borderRadius: effectiveBorderRadius,
          }}
        >
          {renderContent(idx, dims.type)}
        </div>
      );
    }

    if (selectedDevice === "iphone-17-pro") {
      return (
        <IPhone17ProFrame borderRadius={effectiveBorderRadius}>
          {renderContent(idx, dims.type)}
        </IPhone17ProFrame>
      );
    }

    if (selectedDevice === "iphone-17-pro-max") {
      return (
        <IPhone17ProMaxFrame borderRadius={effectiveBorderRadius}>
          {renderContent(idx, dims.type)}
        </IPhone17ProMaxFrame>
      );
    }

    return (
      <SimpleDeviceFrame
        width={renderSize.width}
        height={renderSize.height}
        borderRadius={effectiveBorderRadius}
      >
        {renderContent(idx, dims.type)}
      </SimpleDeviceFrame>
    );
  };

  const renderMockupInstance = (
    idx: number,
    customRotation: number = rotation
  ) => {
    return (
      <div
        className="relative transition-transform duration-200"
        style={{
          transform: `rotate(${customRotation}deg) scale(${scale / 100})`,
          ...getShadowStyle(),
          willChange: "transform",
        }}
      >
        {/* anillo */}
        {renderStyleRing()}
        <div className="relative">{renderInnerByDevice(idx)}</div>
      </div>
    );
  };

  /* ---------- plantillas con transición ---------- */
  const zAbs = getEffectiveZoom(
    zoom,
    layoutMode,
    selectedDevice,
    selectedTemplate
  );

  const getTemplateTransform = (
    tpl: string | null | undefined
  ): { transform: string; origin?: string } => {
    switch (tpl) {
      case "tilt-3d-left":
        return { transform: "rotateX(8deg) rotateY(-18deg) rotateZ(-2deg)" };
      case "tilt-3d-right":
        return { transform: "rotateX(8deg) rotateY(18deg) rotateZ(2deg)" };
      case "isometric-left":
        return { transform: "rotateX(24deg) rotateY(-32deg)" };
      case "isometric-right":
        return { transform: "rotateX(24deg) rotateY(32deg)" };
      case "flat-plate":
        return { transform: "rotateX(16deg) scale(0.98)" };
      case "diamond-3d":
        return { transform: "rotateZ(45deg) rotateX(28deg) scale(0.94)" };
      case "perspective-left":
        return { transform: "rotate(-10deg)" };
      case "perspective-right":
        return { transform: "rotate(10deg)" };
      case "flat-top":
        return { transform: "rotateX(45deg) scale(0.94)" };
      case "flat-topleft":
        return {
          transform: `rotateZ(45deg) rotateY(-35deg) rotateX(20deg) translateZ(${
            selectedDevice.includes("iphone") ? 50 : 180
          }px) scale(0.90)`,
        };
      case "flat-topright":
        return {
          transform: `rotateZ(-45deg) rotateY(35deg) rotateX(20deg) translateZ(${
            selectedDevice.includes("iphone") ? 50 : 180
          }px) scale(0.90)`,
        };
      default:
        return { transform: "none" };
    }
  };

  const { transform: poseTransform, origin: poseOrigin } = getTemplateTransform(
    selectedTemplate || null
  );

  const renderMockups = () => {
    if (selectedTemplate === "hero-left") {
      return (
        <div
          className="w-full flex items-center gap-8"
          style={{ justifyContent: "center" }}
        >
          <div className="flex-1 flex items-center justify-center">
            {renderMockupInstance(0, 0)}
          </div>
          <div className="flex-1 hidden sm:flex items-center justify-center opacity-40" />
        </div>
      );
    }
    if (selectedTemplate === "hero-right") {
      return (
        <div
          className="w-full flex items-center gap-8"
          style={{ justifyContent: "center" }}
        >
          <div className="flex-1 hidden sm:flex items-center justify-center opacity-40" />
          <div className="flex-1 flex items-center justify-center">
            {renderMockupInstance(0, 0)}
          </div>
        </div>
      );
    }

    return (
      <div
        className="transform-gpu"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 50%" }}
      >
        <div
          className="will-change-transform transition-transform duration-300 ease-out"
          style={{
            transform: poseTransform,
            transformOrigin: poseOrigin || "center",
          }}
        >
          {renderMockupInstance(0, 0)}
        </div>
      </div>
    );
  };

  // ----------- RETURN (centered + scale to fit, no scroll) -----------
  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center" // <- h-full so we can fit by height too
    >
      <div
        className="relative"
        style={{
          width: CW * scaleFactor,
          height: CH * scaleFactor,
        }}
      >
        <div
          id="mockup-canvas"
          className="rounded-2xl overflow-hidden relative"
          style={{
            width: `${CW}px`,
            height: `${CH}px`,
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
            top: "-10px",
            willChange: "transform",
          }}
        >
          {/* Background layer with effects */}
          <div
            className="absolute inset-0"
            style={{
              ...getBackgroundStyle(),
              ...getBackgroundEffectsStyle(),
            }}
          >
            {renderNoiseOverlay()}
          </div>

          {/* Content layer (mockup) - positioned above background */}
          <div className="absolute inset-0">
            {sceneType === "shapes" && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
              </div>
            )}

            {/* PAN wrapper */}
            <div
              style={{
                width: "100%",
                height: "100%",
                transform: `translate(${-panX}px, ${-panY}px)`,
                transformOrigin: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                willChange: "transform",
              }}
            >
              {/* ZOOM wrapper */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `scale(${zAbs})`,
                  transformOrigin: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  willChange: "transform",
                }}
              >
                {hideMockup ? null : renderMockups()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
