// mockup-canvas.tsx
"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useCallback,
  CSSProperties,
} from "react";
import Image from "next/image";
import { SimpleDeviceFrame } from "@/components/device-frames/simple-device-frame";
import { SafariFrame } from "@/components/device-frames/safari-frame";
import { ChromeFrame } from "@/components/device-frames/chrome-frame";
import { IPhone17ProFrame } from "@/components/device-frames/iphone-17-pro-frame";
import { IPhone17ProMaxFrame } from "@/components/device-frames/iphone-17-pro-max-frame";
import { IPadProFrame } from "@/components/device-frames/ipad-pro-frame";
import { MacBookProFrame } from "@/components/device-frames/macbook-pro-frame";
import { CanvasGuides } from "@/components/canvas-guides";
import { type BoundingBox } from "@/lib/snap-utils";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  computeRenderSize,
  getDeviceDimensions,
  getEffectiveZoom,
} from "@/lib/mockup-utils";
import { useSnapGuides } from "@/hooks/mockup/useSnapGuides";
import { useDragAndDrop } from "@/hooks/mockup/useDragAndDrop";
import { useTextOverlay } from "@/hooks/mockup/useTextOverlay";
import { useBranding } from "@/hooks/mockup/useBranding";

interface TextOverlay {
  id: string;
  content: string;
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  x: number;
  y: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right" | "justify";
  opacity: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
  textShadowBlur: number;
  textShadowColor: string;
}

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
    | "textures"
    | "transparent"
    | "image"
    | "magical";
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
  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
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
  layoutMode: "single" | "double" | "triple" | "scene-builder";
  siteUrl?: string;
  onImageUpload?: (file: File, index?: number) => void;
  deviceScenes?: Array<{
    id: string;
    device: string;
    imageUrl: string | null;
    position: { x: number; y: number };
    scale: number;
    rotation: number;
    zIndex: number;
    browserMode?: string;
    deviceStyle?: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
    styleEdge?: number;
    siteUrl?: string;
  }>;
  onDeviceScenesChange?: (
    scenes: Array<{
      id: string;
      device: string;
      imageUrl: string | null;
      position: { x: number; y: number };
      scale: number;
      rotation: number;
      zIndex: number;
      browserMode?: string;
      deviceStyle?:
        | "default"
        | "glass-light"
        | "glass-dark"
        | "liquid"
        | "retro";
      styleEdge?: number;
      siteUrl?: string;
    }>
  ) => void;
  hideMockup?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
  browserMode: string; // "display" en iPhone para mostrar solo pantalla
  texts: TextOverlay[];
  updateText?: (id: string, updates: Partial<TextOverlay>) => void;
  mockupGap: number;
  /** NEW: hover state for media slots */
  hoveredSlot?: number | null;
  /** NEW: magical gradients from FrameTab */
  magicalGradients?: string[];
  /** NEW: guides and rulers */
  showRulers?: boolean;
  hideGuides?: boolean; // Hide guides in clones and exports
  guides?: {
    id: string;
    type: "horizontal" | "vertical";
    position: number;
    color: string;
  }[];
  onGuidesChange?: (
    guides: {
      id: string;
      type: "horizontal" | "vertical";
      position: number;
      color: string;
    }[]
  ) => void;
  /** NEW: branding/logo */
  branding?: {
    id: string;
    url?: string;
    text?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity: number;
    rotation: number;
    layout: "vertical" | "horizontal";
    background: "default" | "shadow" | "glass" | "badge";
    badgeMode?: "light" | "dark";
    badgeRadius?: number;
    glassMode?: "light" | "dark";
    glassRadius?: number;
  };
  setBranding?: (
    branding:
      | {
          id: string;
          url?: string;
          text?: string;
          x: number;
          y: number;
          width: number;
          height: number;
          opacity: number;
          rotation: number;
          layout: "vertical" | "horizontal";
          background: "default" | "shadow" | "glass" | "badge";
          badgeMode?: "light" | "dark";
          badgeRadius?: number;
          glassMode?: "light" | "dark";
          glassRadius?: number;
        }
      | undefined
  ) => void;
  /** NEW: double click handlers */
  onTextDoubleClick?: (textId: string) => void;
  onBrandingDoubleClick?: () => void;
  /** NEW: Scene FX */
  sceneFxShadow?: string | null;
  sceneFxOpacity?: number;
  sceneFxLayer?: "overlay" | "underlay";
}

const gradientPresets: Record<string, string> = {
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

const linearGradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #667eea 0%, #f093fb 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(45deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  "linear-gradient(120deg, #ff6b35 0%, #f7931e 20%, #ffb627 40%, #ff9505 60%, #f7931e 80%, #ff6b35 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
];

const radialGradients = [
  "radial-gradient(circle at 20% 50%, #ff0080 0%, #7928ca 25%, #4c1d95 50%, #1e1b4b 75%, #0f0f23 100%)",
  "radial-gradient(circle at 40% 60%, #ff6b35 0%, #f7931e 20%, #ffb627 40%, #ff9505 60%, #ff6b35 80%, #d97706 100%)",
  "radial-gradient(circle at 70% 30%, #1e3a8a 0%, #3b82f6 20%, #06b6d4 40%, #10b981 60%, #059669 80%, #047857 100%)",
  "radial-gradient(circle at 50% 50%, #ff0080 0%, #7928ca 25%, #4c1d95 50%, #06b6d4 75%, #10b981 100%)",
  "radial-gradient(circle at 30% 40%, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  "radial-gradient(circle at 60% 30%, #fa709a 0%, #fee140 50%, #ffb627 100%)",
  "radial-gradient(circle at 40% 60%, #a8edea 0%, #fed6e3 50%, #ffecd2 100%)",
  "radial-gradient(circle at 50% 50%, #ff9a9e 0%, #fecfef 50%, #ffdde1 100%)",
  "radial-gradient(circle at 25% 75%, #667eea 0%, #764ba2 100%)",
  "radial-gradient(circle at 75% 25%, #f093fb 0%, #f5576c 100%)",
  "radial-gradient(circle at 50% 50%, #4facfe 0%, #00f2fe 100%)",
  "radial-gradient(circle at 30% 70%, #43e97b 0%, #38f9d7 100%)",
];

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
    | "textures"
    | "transparent"
    | "image"
    | "magical",
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

// Función para extraer colores predominantes de una imagen (removida, ahora se hace en FrameTab)
// const extractDominantColors = async (imageSrc: string): Promise<string[]> => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.crossOrigin = "Anonymous";
//     img.onload = () => {
//       const colorThief = new ColorThief();
//       try {
//         const palette = colorThief.getPalette(img, 5); // Extraer 5 colores
//         const colors = palette.map(([r, g, b]) => rgbToHex(r, g, b));
//         resolve(colors);
//       } catch (error) {
//         console.error("Error extracting colors:", error);
//         resolve(["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"]); // Fallback
//       }
//     };
//     img.onerror = () => {
//       resolve(["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"]); // Fallback
//     };
//     img.src = imageSrc;
//   });
// };

// Función para generar 12 gradientes basados en colores extraídos (removida, ahora se hace en FrameTab)
// const generateMagicalGradients = (colors: string[]): string[] => {
//   const gradients: string[] = [];
//
//   // Mezclar colores para crear variaciones
//   for (let i = 0; i < 12; i++) {
//     let gradient: string;
//     if (i < 4) {
//       // Gradientes lineales
//       const angle = (i * 45) % 180;
//       const color1 = colors[i % colors.length];
//       const color2 = colors[(i + 1) % colors.length];
//       gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
//     } else if (i < 8) {
//       // Gradientes radiales
//       const position = ["circle at 20% 50%", "circle at 80% 20%", "circle at 40% 80%", "circle at 60% 30%"][i - 4];
//       const color1 = colors[i % colors.length];
//       const color2 = colors[(i + 2) % colors.length];
//       gradient = `radial-gradient(${position}, ${color1}, ${color2})`;
//     } else {
//       // Gradientes con más colores
//       const color1 = colors[i % colors.length];
//       const color2 = colors[(i + 1) % colors.length];
//       const color3 = colors[(i + 2) % colors.length];
//       gradient = `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
//     }
//     gradients.push(gradient);
//   }
//
//   return gradients;
// };

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
    canvasWidth,
    canvasHeight,
    browserMode,
    texts,
    updateText,
    mockupGap,
    /** NEW: hover state for media slots */
    hoveredSlot,
    /** NEW: magical gradients from FrameTab */
    magicalGradients,
    /** NEW: guides and rulers & smart guides */
    showRulers = false, // Smart guides disabled by default
    hideGuides = false, // Hide guides in clones and exports
    guides = [],
    onGuidesChange,
    /** NEW: branding/logo */
    branding,
    setBranding,
    /** NEW: scene builder */
    onDeviceScenesChange,
    /** NEW: double click handlers */
    onTextDoubleClick,
    onBrandingDoubleClick,
    /** NEW: Scene FX */
    sceneFxShadow,
    sceneFxOpacity,
    sceneFxLayer,
  } = props;

  const CW = canvasWidth ?? CANVAS_WIDTH;
  const CH = canvasHeight ?? CANVAS_HEIGHT;

  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Drag and drop state with custom hook
  const {
    // Text dragging
    draggingText,
    dragOffset,
    startTextDrag,
    stopTextDrag,
    // Branding dragging
    draggingBranding,
    brandingDragOffset,
    startBrandingDrag,
    stopBrandingDrag,
    // Scene device dragging
    draggingSceneDevice,
    sceneDeviceDragOffset,
    startSceneDeviceDrag,
    stopSceneDeviceDrag,
  } = useDragAndDrop();

  // Branding resize state (kept separate as it's not part of drag)
  const [resizingBranding, setResizingBranding] = useState<string | null>(null); // 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({
    width: 0,
    height: 0,
  });
  const [resizeStartBrandingPos, setResizeStartBrandingPos] = useState({
    x: 0,
    y: 0,
  });

  const [imageSizes, setImageSizes] = useState<
    { width: number; height: number }[]
  >([]);

  useEffect(() => {
    const calculateSizes = async () => {
      const sizes: { width: number; height: number }[] = [];
      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i];
        if (image) {
          await new Promise<void>((resolve) => {
            const img = document.createElement("img");
            img.onload = () => {
              sizes[i] = { width: img.naturalWidth, height: img.naturalHeight };
              resolve();
            };
            img.src = image;
          });
        } else {
          sizes[i] = { width: 1920, height: 1080 };
        }
      }
      setImageSizes(sizes);
    };
    calculateSizes();
  }, [uploadedImages]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const SAFE_MARGIN = 16;

  // Estado para gradientes mágicos (removido, ahora viene de props)
  // const [magicalGradients, setMagicalGradients] = useState<string[]>([]);

  // Text overlay management with custom hook
  const { selectedTextId, setSelectedTextId, handleTextMouseDown } =
    useTextOverlay({
      texts,
      onTextDoubleClick,
      startTextDrag,
      scaleFactor,
      containerRef,
    });

  // Branding management with custom hook
  const { handleBrandingMouseDown } = useBranding({
    branding,
    setBranding,
    onBrandingDoubleClick,
    startBrandingDrag,
    scaleFactor,
    containerRef,
  });

  // Smart guides state with custom hook
  const { snapGuides, calculateSnapWithGuides, clearSnapGuides } =
    useSnapGuides({
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      enabled: true,
    });

  useEffect(() => setIsDragging(dragCounter > 0), [dragCounter]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Check if the click was on a text element or its children
      const target = e.target as HTMLElement;
      const isTextElement = target.closest("[data-text-element]");

      if (!isTextElement) {
        setSelectedTextId(null);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [setSelectedTextId]);

  // const firstUploadedImage = uploadedImages[0]; // Removido, no se usa

  // Efecto para generar gradientes mágicos (removido, ahora vienen de props)
  // useEffect(() => {
  //   if (backgroundType === "magical" && firstUploadedImage) {
  //     extractDominantColors(firstUploadedImage).then((colors) => {
  //       const gradients = generateMagicalGradients(colors);
  //       setMagicalGradients(gradients);
  //     });
  //   }
  // }, [firstUploadedImage, backgroundType]);

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
  const handleDrop = (e: React.DragEvent, index: number = 0) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile && onImageUpload) onImageUpload(imageFile, index);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = (index: number = 0) => {
    // Create a temporary file input for this specific index
    const tempInput = document.createElement("input");
    tempInput.type = "file";
    tempInput.accept = "image/*";
    tempInput.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (f && f.type.startsWith("image/") && onImageUpload)
        onImageUpload(f, index);
    };
    tempInput.click();
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number = 0
  ) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/") && onImageUpload)
      onImageUpload(f, index);
  };

  // Text drag and drop handlers
  // handleTextMouseDown is now provided by useTextOverlay hook

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingText || !containerRef.current) return;

    const canvasRect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
    const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

    let newX = mouseX - dragOffset.x;
    let newY = mouseY - dragOffset.y;

    // Get current text for dimensions
    const currentText = texts.find((t) => t.id === draggingText);
    if (!currentText || !updateText) return;

    // Calculate approximate text dimensions
    const textWidth = currentText.fontSize * currentText.content.length * 0.6;
    const textHeight = currentText.fontSize * currentText.lineHeight;

    // Prepare bounding box for current element
    const elementBox: BoundingBox = {
      x: newX,
      y: newY,
      width: textWidth,
      height: textHeight,
    };

    // Prepare other elements (excluding current dragging text)
    const otherElements: BoundingBox[] = [];

    // Add other texts
    texts.forEach((text) => {
      if (text.id !== draggingText) {
        const w = text.fontSize * text.content.length * 0.6;
        const h = text.fontSize * text.lineHeight;
        otherElements.push({
          x: text.x,
          y: text.y,
          width: w,
          height: h,
        });
      }
    });

    // Add branding if exists
    if (branding) {
      otherElements.push({
        x: branding.x,
        y: branding.y,
        width: branding.width,
        height: branding.height,
      });
    }

    // Calculate snap with guides (hold Cmd/Ctrl to disable snapping)
    const shouldSnap = showRulers && !e.metaKey && !e.ctrlKey;

    let snapResult;
    if (shouldSnap) {
      snapResult = calculateSnapWithGuides(elementBox, otherElements);
    } else {
      snapResult = { x: newX, y: newY, guides: [] };
    }

    // Update position with snap
    newX = snapResult.x;
    newY = snapResult.y;

    updateText(draggingText, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  const handleMouseUp = () => {
    stopTextDrag();
    // Clear guides when drag ends
    clearSnapGuides();
  };

  // Touch handlers for mobile dragging
  const handleTextTouchStart = (e: React.TouchEvent, textId: string) => {
    e.preventDefault(); // Prevent default touch behavior like scrolling
    e.stopPropagation();

    const text = texts.find((t) => t.id === textId);
    if (!text) return;

    setSelectedTextId(textId);

    // Calculate offset from touch to text position
    const canvasRect = containerRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const touch = e.touches[0];
    // Calculate touch position relative to the canvas
    const touchX = (touch.clientX - canvasRect.left) / scaleFactor;
    const touchY = (touch.clientY - canvasRect.top) / scaleFactor;

    startTextDrag(textId, {
      x: touchX - text.x,
      y: touchY - text.y,
    });
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!draggingText || !containerRef.current || !updateText) return;

      // Only prevent default if the event is cancelable
      if (e.cancelable) {
        e.preventDefault();
      }

      const canvasRect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const touchX = (touch.clientX - canvasRect.left) / scaleFactor;
      const touchY = (touch.clientY - canvasRect.top) / scaleFactor;

      let newX = touchX - dragOffset.x;
      let newY = touchY - dragOffset.y;

      // Get current text for dimensions
      const currentText = texts.find((t) => t.id === draggingText);
      if (!currentText) return;

      // Calculate approximate text dimensions
      const textWidth = currentText.fontSize * currentText.content.length * 0.6;
      const textHeight = currentText.fontSize * currentText.lineHeight;

      // Prepare bounding box for current element
      const elementBox: BoundingBox = {
        x: newX,
        y: newY,
        width: textWidth,
        height: textHeight,
      };

      // Prepare other elements (excluding current dragging text)
      const otherElements: BoundingBox[] = [];

      // Add other texts
      texts.forEach((text) => {
        if (text.id !== draggingText) {
          const w = text.fontSize * text.content.length * 0.6;
          const h = text.fontSize * text.lineHeight;
          otherElements.push({
            x: text.x,
            y: text.y,
            width: w,
            height: h,
          });
        }
      });

      // Add branding if exists
      if (branding) {
        otherElements.push({
          x: branding.x,
          y: branding.y,
          width: branding.width,
          height: branding.height,
        });
      }

      // Apply snapping if rulers/guides are enabled
      if (showRulers && !hideGuides) {
        const snapResult = calculateSnapWithGuides(elementBox, otherElements);

        newX = snapResult.x;
        newY = snapResult.y;
      } else {
        clearSnapGuides();
      }

      updateText(draggingText, {
        x: Math.max(0, newX),
        y: Math.max(0, newY),
      });
    },
    [
      draggingText,
      dragOffset,
      scaleFactor,
      updateText,
      texts,
      branding,
      showRulers,
      hideGuides,
      calculateSnapWithGuides,
      clearSnapGuides,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    stopTextDrag();
    // Clear guides when drag ends
    clearSnapGuides();
  }, [stopTextDrag, clearSnapGuides]);

  useEffect(() => {
    if (draggingText) {
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd, { passive: false });
      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [draggingText, handleTouchMove, handleTouchEnd]);

  const getBackgroundStyle = (): CSSProperties => {
    if (backgroundType === "gradient" && gradientPresets[selectedPreset]) {
      return { background: gradientPresets[selectedPreset] };
    }
    if (
      backgroundType === "gradient" &&
      selectedPreset?.startsWith("linear-")
    ) {
      const index = parseInt(selectedPreset.replace("linear-", ""));
      if (index >= 0 && index < linearGradients.length) {
        return { background: linearGradients[index] };
      }
    }
    if (
      backgroundType === "gradient" &&
      selectedPreset?.startsWith("radial-")
    ) {
      const index = parseInt(selectedPreset.replace("radial-", ""));
      if (index >= 0 && index < radialGradients.length) {
        return { background: radialGradients[index] };
      }
    }
    if (
      backgroundType === "cosmic" &&
      selectedPreset?.startsWith("cosmic-gradient-")
    ) {
      const num = selectedPreset.replace("cosmic-gradient-", "");
      return {
        backgroundImage: `url(/backgrounds/cosmic/cosmic-gradient-${num}.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    if (
      backgroundType === "textures" &&
      selectedPreset?.startsWith("textures-")
    ) {
      const num = selectedPreset.replace("textures-", "");
      return {
        backgroundImage: `url(/backgrounds/textures/textures-${num}.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    if (backgroundType === "image" && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    if (
      backgroundType === "magical" &&
      magicalGradients &&
      magicalGradients.length > 0 &&
      selectedPreset?.startsWith("magical-")
    ) {
      const index = parseInt(selectedPreset.replace("magical-", ""));
      if (index >= 0 && index < magicalGradients.length) {
        return { background: magicalGradients[index] };
      }
    }
    if (backgroundType === "solid") {
      return { backgroundColor: backgroundColor };
    }
    if (backgroundType === "transparent") {
      return { backgroundColor: "transparent" };
    }
    return { backgroundColor };
  };

  const getBackgroundEffectsStyle = (): CSSProperties => {
    const filters: string[] = [];
    if (backgroundBlur > 0) filters.push(`blur(${backgroundBlur}px)`);
    return { filter: filters.length > 0 ? filters.join(" ") : undefined };
  };

  // Cache for noise overlays to prevent memory leaks
  const noiseCacheRef = useRef<Map<string, string>>(new Map());

  const renderNoiseOverlay = useCallback(() => {
    if (typeof backgroundNoise !== "number" || backgroundNoise <= 0)
      return null;
    const noiseOpacity = (backgroundNoise / 100) * 0.5;
    if (noiseOpacity === 0) return null;

    // Create a unique key for caching based on noise settings
    const noiseKey = `noise-${backgroundNoise}-${CW}-${CH}`;

    if (noiseCacheRef.current.has(noiseKey)) {
      const cachedDataUrl = noiseCacheRef.current.get(noiseKey)!;
      return (
        <div
          data-noise-overlay
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("${cachedDataUrl}")`,
            backgroundSize: "256px 256px",
            mixBlendMode: "overlay",
          }}
        />
      );
    }

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

    // Cache the result
    noiseCacheRef.current.set(noiseKey, noiseDataUrl);

    // Limit cache size to prevent unlimited growth
    if (noiseCacheRef.current.size > 10) {
      const firstKey = noiseCacheRef.current.keys().next().value;
      if (firstKey) {
        noiseCacheRef.current.delete(firstKey);
      }
    }

    return (
      <div
        data-noise-overlay
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${noiseDataUrl}")`,
          backgroundSize: "256px 256px",
          mixBlendMode: "overlay",
        }}
      />
    );
  }, [backgroundNoise, CW, CH]);

  const renderTexts = () => {
    return texts.map((text) => (
      <div
        key={text.id}
        data-text-element
        className={`absolute select-none ${
          selectedTextId === text.id
            ? "ring-2 ring-red-500 ring-offset-2 ring-offset-transparent"
            : ""
        } ${draggingText === text.id ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          left: `${text.x}px`,
          top: `${text.y}px`,
          zIndex: draggingText === text.id ? 20 : 10,
          userSelect: "none",
          transition:
            draggingText === text.id
              ? "none"
              : "box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: draggingText === text.id ? "transform" : "auto",
        }}
        onMouseDown={(e) => handleTextMouseDown(e, text.id)}
        onTouchStart={(e) => handleTextTouchStart(e, text.id)}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Main text layer with stroke and shadow */}
          <div
            style={{
              color: text.color,
              fontFamily:
                text.fontFamily === "Bricolage Grotesque"
                  ? "var(--font-bricolage-grotesque, 'Bricolage Grotesque', Arial, sans-serif)"
                  : text.fontFamily,
              fontSize: `${text.fontSize}px`,
              fontWeight: text.fontWeight,
              lineHeight: text.lineHeight || 1.2,
              letterSpacing: `${text.letterSpacing || 0}px`,
              textAlign: text.textAlign || "left",
              textShadow: `${text.textShadowOffsetX}px ${text.textShadowOffsetY}px ${text.textShadowBlur}px ${text.textShadowColor}`,
              whiteSpace: "pre-wrap",
              opacity: text.opacity || 1,
              position: "relative",
              zIndex: 1,
            }}
          >
            {text.content}
          </div>
        </div>
      </div>
    ));
  };

  const isIphone =
    selectedDevice === "iphone-17-pro" ||
    selectedDevice === "iphone-17-pro-max";
  const isIphoneDisplayMode = isIphone && browserMode === "display";

  const getDeviceContentClass = () => "";

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
      const effectiveBlur = Math.max(0, blur + (spread > 0 ? spread * 0.8 : 0));

      return {
        filter: `drop-shadow(${offsetX}px ${offsetY}px ${effectiveBlur}px ${color})`,
      };
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

  const dominant = dominantFromBackground(
    backgroundType,
    backgroundColor,
    selectedPreset
  );

  const renderStyleRing = (
    dims: { width: number; height: number; type: string },
    effectiveBorderRadius: number
  ) => {
    // Border Style SOLO funciona para screenshots
    if (dims.type !== "screenshot") return null;

    const edge = Math.max(0, Math.round(styleEdge || 0));
    // Escalar el borde proporcionalmente al zoom del mockup
    const scaledEdge = Math.max(1, Math.round(edge * (scale / 100)));
    if (scaledEdge <= 0 || deviceStyle === "default") return null;

    const ringCommon: React.CSSProperties = {
      position: "absolute",
      left: -scaledEdge,
      top: -scaledEdge,
      right: -scaledEdge,
      bottom: -scaledEdge,
      borderRadius: effectiveBorderRadius + scaledEdge,
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
      return { padding: scaledEdge, ...maskProps, ...extra };
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
              Math.round(scaledEdge * 0.15)
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

    if (deviceStyle === "retro") {
      return (
        <div
          style={{
            ...ringCommon,
            ...makeHollow({
              background: `repeating-linear-gradient(45deg, ${toRgba(
                "#000000",
                0.8
              )} 0px, ${toRgba("#000000", 0.8)} 2px, ${toRgba(
                "#ffffff",
                0.6
              )} 2px, ${toRgba("#ffffff", 0.6)} 4px)`,
              border: `2px solid ${toRgba("#000000", 0.9)}`,
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

  const renderContent = (
    idx: number,
    deviceType?: string,
    effectiveBorderRadius: number = 0
  ) => {
    const uploadedImage = uploadedImages[idx];
    // Solo aplicar border radius al contenido para screenshots, y nunca para Chrome
    const contentBorderRadius =
      deviceType === "screenshot" && selectedDevice !== "chrome"
        ? effectiveBorderRadius
        : 0;
    if (!uploadedImage) {
      return (
        <div
          className="flex h-full w-full items-center justify-center bg-black relative transition-all duration-200 cursor-pointer"
          style={{ borderRadius: contentBorderRadius }}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, idx)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(idx)}
        >
          <div
            className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/3 to-blue-500/5 rounded-lg"
            style={{ borderRadius: effectiveBorderRadius }}
          />
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
                style={{ borderRadius: effectiveBorderRadius }}
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
                  <div
                    className="absolute inset-0 bg-white/20 rounded-full blur-md -z-10"
                    style={{ borderRadius: effectiveBorderRadius }}
                  />
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
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, idx)}
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
          backgroundSize:
            deviceType === "mobile"
              ? "cover"
              : deviceType === "screenshot"
                ? "contain"
                : selectedDevice === "safari"
                  ? "cover"
                  : selectedDevice === "chrome"
                    ? "100% 100%"
                    : "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform:
            deviceType === "screenshot" ||
            deviceType === "mobile" ||
            deviceType === "desktop" ||
            deviceType === "tablet" ||
            selectedDevice === "safari"
              ? "none"
              : `scale(${zoom})`,
          transformOrigin: "center",
          width: "100%",
          height: "100%",
          borderRadius: contentBorderRadius,
        }}
      />
    );
  };

  const renderInnerByDevice = (idx: number) => {
    const currentImageSize = imageSizes[idx] || { width: 1920, height: 1080 };
    const dims = getDeviceDimensions(selectedDevice);
    const baseSize =
      (dims.type === "screenshot" || dims.type === "browser") &&
      uploadedImages[idx]
        ? currentImageSize
        : { width: dims.width, height: dims.height };
    const renderSize = computeRenderSize(baseSize.width, baseSize.height);
    const borderRadiusScale = renderSize.width / dims.width;
    const effectiveBorderRadius = (() => {
      if (dims.type === "screenshot") {
        if (borderType === "sharp") return Math.round(4 * borderRadiusScale);
        if (borderType === "round") return Math.round(40 * borderRadiusScale);
        return Math.round(borderRadius * borderRadiusScale);
      }
      return 0;
    })();
    if (isIphoneDisplayMode) {
      return (
        <div
          className="relative"
          style={{
            width: renderSize.width,
            height: renderSize.height,
          }}
        >
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              borderRadius: 25, // Sin border radius para iPhone display mode
              background: "#000",
            }}
          >
            {renderContent(idx, "mobile", effectiveBorderRadius)}
          </div>
        </div>
      );
    }

    if (selectedDevice === "safari") {
      return (
        <SafariFrame
          width={renderSize.width}
          height={renderSize.height}
          siteUrl={siteUrl}
          referenceWidth={renderSize.width}
          theme={browserMode}
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
          siteUrl={siteUrl}
          referenceWidth={renderSize.width}
          theme={browserMode}
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
          siteUrl={siteUrl}
          referenceWidth={renderSize.width}
          theme={browserMode}
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
          {renderContent(idx, dims.type, effectiveBorderRadius)}
        </div>
      );
    }

    if (selectedDevice === "iphone-17-pro") {
      return (
        <IPhone17ProFrame borderRadius={25} mode={browserMode}>
          {renderContent(idx, dims.type)}
        </IPhone17ProFrame>
      );
    }

    if (selectedDevice === "iphone-17-pro-max") {
      return (
        <IPhone17ProMaxFrame borderRadius={25} mode={browserMode}>
          {renderContent(idx, dims.type)}
        </IPhone17ProMaxFrame>
      );
    }

    if (selectedDevice === "ipad-pro") {
      return (
        <IPadProFrame borderRadius={0} mode={browserMode}>
          {renderContent(idx, dims.type)}
        </IPadProFrame>
      );
    }

    if (selectedDevice === "macbook-pro") {
      return (
        <div style={{ transform: "scale(0.8)" }}>
          <MacBookProFrame borderRadius={8} mode={browserMode}>
            {renderContent(idx, dims.type)}
          </MacBookProFrame>
        </div>
      );
    }

    return (
      <SimpleDeviceFrame
        width={renderSize.width}
        height={renderSize.height}
        borderRadius={0}
      >
        {renderContent(idx, dims.type)}
      </SimpleDeviceFrame>
    );
  };

  const renderMockupInstance = (
    idx: number,
    customRotation: number = rotation
  ) => {
    const currentImageSize = imageSizes[idx] || { width: 1920, height: 1080 };
    const dims = getDeviceDimensions(selectedDevice);
    const baseSize =
      (dims.type === "screenshot" || dims.type === "browser") &&
      uploadedImages[idx]
        ? currentImageSize
        : { width: dims.width, height: dims.height };
    const renderSize = computeRenderSize(baseSize.width, baseSize.height);
    const borderRadiusScale = renderSize.width / dims.width;
    const effectiveBorderRadius = (() => {
      if (dims.type === "screenshot") {
        if (borderType === "sharp") return Math.round(4 * borderRadiusScale);
        if (borderType === "round") return Math.round(40 * borderRadiusScale);
        return Math.round(borderRadius * borderRadiusScale);
      }
      return 0;
    })();

    const isHovered = hoveredSlot === idx;
    return (
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          isHovered ? "mockup-hover-glow" : ""
        }`}
        style={{
          transform: `rotate(${customRotation}deg) scale(${scale / 100})`,
          ...getShadowStyle(),
          willChange: isHovered ? "transform, filter" : "auto",
        }}
      >
        {renderStyleRing(dims, effectiveBorderRadius)}
        <div className="relative overflow-hidden">
          {renderInnerByDevice(idx)}
        </div>
      </div>
    );
  };

  const zAbs = getEffectiveZoom(
    zoom,
    layoutMode,
    selectedDevice,
    selectedTemplate
  );

  const getTemplateTransform = (
    tpl: string | null | undefined,
    mockupIndex?: number
  ): { transform: string; origin?: string } => {
    // Handle double mode presets
    if (layoutMode === "double" && mockupIndex !== undefined) {
      switch (tpl) {
        case "double-side-by-side":
          return { transform: "none" };
        case "double-stacked":
          return mockupIndex === 0
            ? { transform: "translateY(-100px)" }
            : { transform: "translateY(100px)" };
        case "double-angled":
          return mockupIndex === 0
            ? {
                transform:
                  "rotateX(15deg) rotateY(-25deg) rotateZ(-8deg) scale(1.1) translateX(-30px) translateY(-20px) translateZ(40px)",
              }
            : {
                transform:
                  "rotateX(15deg) rotateY(25deg) rotateZ(8deg) scale(1.1) translateX(30px) translateY(20px) translateZ(40px)",
              };
        case "double-perspective":
          return mockupIndex === 0
            ? {
                transform:
                  "rotateX(20deg) rotateY(-35deg) rotateZ(-5deg) scale(1.15) translateX(-50px) translateY(-15px) translateZ(60px)",
              }
            : {
                transform:
                  "rotateX(20deg) rotateY(35deg) rotateZ(5deg) scale(0.9) translateX(50px) translateY(15px) translateZ(-30px)",
              };
        case "double-overlap":
          return mockupIndex === 0
            ? {
                transform:
                  "rotateX(10deg) rotateY(-15deg) rotateZ(-3deg) scale(1.2) translateX(-20px) translateY(-10px) translateZ(80px)",
              }
            : {
                transform:
                  "rotateX(10deg) rotateY(15deg) rotateZ(3deg) scale(0.95) translateX(20px) translateY(10px) translateZ(-20px)",
              };
        case "double-depth":
          return mockupIndex === 0
            ? { transform: "scale(1.05) translateZ(15px)" }
            : { transform: "scale(0.95) translateZ(-15px)" };
        case "double-asymmetric":
          return mockupIndex === 0
            ? { transform: "rotate(-8deg) scale(1.02)" }
            : { transform: "rotate(12deg) scale(0.98)" };
        case "double-mirror":
          return mockupIndex === 0
            ? {
                transform:
                  "rotateX(12deg) rotateY(-20deg) scaleX(1) scale(1.05) translateX(-40px) translateY(-5px) translateZ(50px)",
              }
            : {
                transform:
                  "rotateX(12deg) rotateY(20deg) scaleX(-1) scale(1.05) translateX(40px) translateY(5px) translateZ(50px)",
              };
        default:
          return { transform: "none" };
      }
    }

    // Single mode presets
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

  // Helper function to render a device frame for Scene Builder mode
  const renderDeviceFrame = (
    deviceId: string,
    imageUrl: string | null,
    width: number,
    height: number,
    sceneOptions?: {
      browserMode?: string;
      deviceStyle?:
        | "default"
        | "glass-light"
        | "glass-dark"
        | "liquid"
        | "retro";
      styleEdge?: number;
      siteUrl?: string;
    }
  ) => {
    const dims = getDeviceDimensions(deviceId);
    const borderRadiusScale = width / dims.width;
    const effectiveBorderRadius = (() => {
      if (dims.type === "screenshot") {
        if (borderType === "sharp") return Math.round(4 * borderRadiusScale);
        if (borderType === "round") return Math.round(40 * borderRadiusScale);
        return Math.round(borderRadius * borderRadiusScale);
      }
      // Para dispositivos físicos, usar su border radius nativo
      if (dims.type === "mobile") return Math.round(25 * borderRadiusScale); // iPhone radius
      if (dims.type === "tablet") return Math.round(18 * borderRadiusScale); // iPad radius
      if (dims.type === "desktop") return Math.round(12 * borderRadiusScale); // MacBook radius
      if (dims.type === "browser") {
        if (borderType === "sharp") return Math.round(4 * borderRadiusScale);
        if (borderType === "round") return Math.round(40 * borderRadiusScale);
        return Math.round(borderRadius * borderRadiusScale);
      }
      return 0;
    })();

    // Use scene-specific options or fall back to global props
    const effectiveBrowserMode = sceneOptions?.browserMode || browserMode;
    const effectiveDeviceStyle = sceneOptions?.deviceStyle || "default";
    const effectiveStyleEdge =
      sceneOptions?.styleEdge !== undefined ? sceneOptions.styleEdge : 16;
    const effectiveSiteUrl = sceneOptions?.siteUrl || siteUrl;

    // Helper to render style ring for scene builder
    const renderSceneStyleRing = () => {
      // Border Style SOLO funciona para screenshots
      if (dims.type !== "screenshot") return null;

      const edge = Math.max(0, Math.round(effectiveStyleEdge));
      const scaledEdge = Math.max(1, edge);
      if (scaledEdge <= 0 || effectiveDeviceStyle === "default") return null;

      const ringCommon: React.CSSProperties = {
        position: "absolute",
        left: -scaledEdge,
        top: -scaledEdge,
        right: -scaledEdge,
        bottom: -scaledEdge,
        borderRadius: effectiveBorderRadius + scaledEdge,
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
        return { padding: scaledEdge, ...maskProps, ...extra };
      };

      if (effectiveDeviceStyle === "glass-light") {
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

      if (effectiveDeviceStyle === "glass-dark") {
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

      if (effectiveDeviceStyle === "liquid") {
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
                Math.round(scaledEdge * 0.15)
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

      if (effectiveDeviceStyle === "retro") {
        return (
          <div
            style={{
              ...ringCommon,
              ...makeHollow({
                background: `repeating-linear-gradient(45deg, ${toRgba(
                  "#000000",
                  0.8
                )} 0px, ${toRgba("#000000", 0.8)} 2px, ${toRgba(
                  "#ffffff",
                  0.6
                )} 2px, ${toRgba("#ffffff", 0.6)} 4px)`,
                border: `2px solid ${toRgba("#000000", 0.9)}`,
              }),
            }}
          />
        );
      }

      return null;
    };

    // Render content for this specific device
    const content = (
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
          background: imageUrl ? "transparent" : "#f0f0f0",
        }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Device content"
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
    );

    // Render device-specific frame
    if (deviceId === "safari") {
      return (
        <div className="relative">
          <SafariFrame
            width={width}
            height={height}
            siteUrl={effectiveSiteUrl}
            referenceWidth={width}
            theme={effectiveBrowserMode}
          >
            {content}
          </SafariFrame>
          {renderSceneStyleRing()}
        </div>
      );
    }

    if (deviceId === "chrome") {
      return (
        <div className="relative">
          <ChromeFrame
            width={width}
            height={height}
            siteUrl={effectiveSiteUrl}
            referenceWidth={width}
            theme={effectiveBrowserMode}
          >
            {content}
          </ChromeFrame>
          {renderSceneStyleRing()}
        </div>
      );
    }

    if (deviceId === "iphone-17-pro") {
      return (
        <div className="relative">
          <IPhone17ProFrame borderRadius={25} mode={effectiveBrowserMode}>
            {content}
          </IPhone17ProFrame>
          {renderSceneStyleRing()}
        </div>
      );
    }

    if (deviceId === "iphone-17-pro-max") {
      return (
        <div className="relative">
          <IPhone17ProMaxFrame borderRadius={25} mode={effectiveBrowserMode}>
            {content}
          </IPhone17ProMaxFrame>
          {renderSceneStyleRing()}
        </div>
      );
    }

    if (deviceId === "ipad-pro-13") {
      return (
        <div className="relative">
          <IPadProFrame borderRadius={0} mode={effectiveBrowserMode}>
            {content}
          </IPadProFrame>
          {renderSceneStyleRing()}
        </div>
      );
    }

    if (deviceId === "macbook-pro-16") {
      return (
        <div className="relative">
          <MacBookProFrame borderRadius={0} mode={effectiveBrowserMode}>
            {content}
          </MacBookProFrame>
          {renderSceneStyleRing()}
        </div>
      );
    }

    // Default: screenshot/simple device
    return (
      <div className="relative">
        <div
          className="relative overflow-hidden"
          style={{
            width,
            height,
            borderRadius: effectiveBorderRadius,
          }}
        >
          {content}
        </div>
        {renderSceneStyleRing()}
      </div>
    );
  };

  const renderMockups = () => {
    // Scene Builder mode: render multiple devices
    if (layoutMode === "scene-builder" && props.deviceScenes) {
      const scenes = props.deviceScenes;

      return (
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {scenes.map((scene) => {
            const deviceDims = getDeviceDimensions(scene.device);

            // Find the image index for this scene
            const imageIndex = scene.imageUrl
              ? uploadedImages.findIndex((img) => img === scene.imageUrl)
              : -1;

            // Get the actual image size if available
            const currentImageSize =
              imageIndex >= 0 && imageSizes[imageIndex]
                ? imageSizes[imageIndex]
                : { width: 1920, height: 1080 };

            // For screenshot and browser, use the actual image size as base
            // For other devices, use fixed device dimensions
            const baseSize =
              (deviceDims.type === "screenshot" ||
                deviceDims.type === "browser") &&
              scene.imageUrl
                ? currentImageSize
                : { width: deviceDims.width, height: deviceDims.height };

            const { width: baseWidth, height: baseHeight } = computeRenderSize(
              baseSize.width,
              baseSize.height
            );

            // Apply scene-specific transforms
            const sceneScale = (scene.scale / 100) * (scale / 100);
            const isDragging = draggingSceneDevice === scene.id;

            return (
              <div
                key={scene.id}
                className={`absolute cursor-move transition-all duration-75 ${
                  isDragging
                    ? "ring-2 ring-red-500 ring-offset-2 ring-offset-transparent shadow-2xl shadow-red-500/20 z-50 cursor-grabbing scale-105"
                    : "hover:ring-2 hover:ring-red-500/50 hover:shadow-lg"
                }`}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `
                    translate(-50%, -50%)
                    translate(${scene.position.x}px, ${scene.position.y}px)
                    rotate(${scene.rotation}deg)
                    scale(${sceneScale})
                  `,
                  transformOrigin: "center center",
                  zIndex: isDragging ? 9999 : scene.zIndex,
                  willChange: isDragging ? "transform" : "auto",
                  pointerEvents: isDragging ? "none" : "auto",
                  ...getShadowStyle(),
                }}
                onMouseDown={(e) => handleSceneDeviceMouseDown(e, scene.id)}
                onTouchStart={(e) => handleSceneDeviceTouchStart(e, scene.id)}
              >
                {renderDeviceFrame(
                  scene.device,
                  scene.imageUrl,
                  baseWidth,
                  baseHeight,
                  {
                    browserMode: scene.browserMode,
                    deviceStyle: scene.deviceStyle,
                    styleEdge: scene.styleEdge,
                    siteUrl: scene.siteUrl,
                  }
                )}
              </div>
            );
          })}
        </div>
      );
    }

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

    if (layoutMode === "double") {
      const isDoublePreset = selectedTemplate?.startsWith("double-");
      if (isDoublePreset) {
        return (
          <div
            className="w-full flex items-center"
            style={{
              justifyContent: "center",
              gap: mockupGap >= 0 ? `${mockupGap}px` : "0px",
            }}
          >
            <div className="flex items-center justify-center shrink-0">
              <div
                className="transform-gpu"
                style={{
                  perspective: "1600px",
                  perspectiveOrigin: "50% 50%",
                  transform: `scale(0.70) ${
                    mockupGap < 0
                      ? `translateX(${Math.abs(mockupGap) / 2}px)`
                      : ""
                  }`,
                }}
              >
                <div
                  className="will-change-transform transition-transform duration-300 ease-out"
                  style={{
                    transform: getTemplateTransform(selectedTemplate, 0)
                      .transform,
                    transformOrigin:
                      getTemplateTransform(selectedTemplate, 0).origin ||
                      "center",
                  }}
                >
                  {renderMockupInstance(0, 0)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0">
              <div
                className="transform-gpu"
                style={{
                  perspective: "1600px",
                  perspectiveOrigin: "50% 50%",
                  transform: `scale(0.70) ${
                    mockupGap < 0
                      ? `translateX(${-Math.abs(mockupGap) / 2}px)`
                      : ""
                  }`,
                }}
              >
                <div
                  className="will-change-transform transition-transform duration-300 ease-out"
                  style={{
                    transform: getTemplateTransform(selectedTemplate, 1)
                      .transform,
                    transformOrigin:
                      getTemplateTransform(selectedTemplate, 1).origin ||
                      "center",
                  }}
                >
                  {renderMockupInstance(1, 0)}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // Default double mode without specific preset
        return (
          <div
            className="w-full flex items-center"
            style={{
              justifyContent: "center",
              gap: mockupGap >= 0 ? `${mockupGap}px` : "0px",
            }}
          >
            <div className="flex items-center justify-center shrink-0">
              <div
                className="transform-gpu"
                style={{
                  transform: `scale(0.70) ${
                    mockupGap < 0
                      ? `translateX(${Math.abs(mockupGap) / 2}px)`
                      : ""
                  }`,
                }}
              >
                {renderMockupInstance(0, 0)}
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0">
              <div
                className="transform-gpu"
                style={{
                  transform: `scale(0.70) ${
                    mockupGap < 0
                      ? `translateX(${-Math.abs(mockupGap) / 2}px)`
                      : ""
                  }`,
                }}
              >
                {renderMockupInstance(1, 0)}
              </div>
            </div>
          </div>
        );
      }
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

  // Watermark drag handlers
  // handleBrandingMouseDown is now provided by useBranding hook

  const handleBrandingMouseMove = (e: React.MouseEvent) => {
    if (!draggingBranding || !branding || !setBranding || !containerRef.current)
      return;

    const canvasRect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
    const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

    let newX = mouseX - brandingDragOffset.x;
    let newY = mouseY - brandingDragOffset.y;

    // Prepare bounding box for branding
    const elementBox: BoundingBox = {
      x: newX,
      y: newY,
      width: branding.width,
      height: branding.height,
    };

    // Prepare other elements (all texts)
    const otherElements: BoundingBox[] = texts.map((text) => {
      const w = text.fontSize * text.content.length * 0.6;
      const h = text.fontSize * text.lineHeight;
      return {
        x: text.x,
        y: text.y,
        width: w,
        height: h,
      };
    });

    // Calculate snap with guides (hold Cmd/Ctrl to disable snapping)
    const shouldSnap = showRulers && !e.metaKey && !e.ctrlKey;

    let snapResult;
    if (shouldSnap) {
      snapResult = calculateSnapWithGuides(elementBox, otherElements);
    } else {
      snapResult = { x: newX, y: newY, guides: [] };
    }

    // Update position with snap
    newX = snapResult.x;
    newY = snapResult.y;

    setBranding({
      ...branding,
      x: Math.max(0, newX),
      y: Math.max(0, newY),
    });
  };

  const handleBrandingMouseUp = () => {
    stopBrandingDrag();
    setResizingBranding(null);
    // Clear guides when drag ends
    clearSnapGuides();
  };

  // Scene Builder device drag handlers
  const handleSceneDeviceMouseDown = useCallback(
    (e: React.MouseEvent, sceneId: string) => {
      if (layoutMode !== "scene-builder" || !props.deviceScenes) return;
      e.preventDefault();
      e.stopPropagation();

      const scene = props.deviceScenes.find((s) => s.id === sceneId);
      if (!scene || !containerRef.current) return;

      // Calculate offset from mouse to device position (in canvas space)
      const canvasRect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
      const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

      // Device position in canvas space (accounting for zoom and pan)
      const zoomFactor = getEffectiveZoom(zoom, layoutMode, scene.device, null);
      const centerX = CW / 2;
      const centerY = CH / 2;

      // The device is rendered at center + position - pan, then scaled by zoom
      const deviceScreenX =
        (centerX + scene.position.x - panX) * zoomFactor +
        centerX * (1 - zoomFactor);
      const deviceScreenY =
        (centerY + scene.position.y - panY) * zoomFactor +
        centerY * (1 - zoomFactor);

      startSceneDeviceDrag(sceneId, {
        x: mouseX - deviceScreenX,
        y: mouseY - deviceScreenY,
      });
    },
    [
      layoutMode,
      props.deviceScenes,
      scaleFactor,
      zoom,
      CW,
      CH,
      panX,
      panY,
      startSceneDeviceDrag,
    ]
  );

  const handleSceneDeviceMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (
        !draggingSceneDevice ||
        layoutMode !== "scene-builder" ||
        !props.deviceScenes ||
        !containerRef.current ||
        !onDeviceScenesChange
      )
        return;

      const canvasRect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
      const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

      const scene = props.deviceScenes.find(
        (s) => s.id === draggingSceneDevice
      );
      if (!scene) return;

      const zoomFactor = getEffectiveZoom(zoom, layoutMode, scene.device, null);
      const centerX = CW / 2;
      const centerY = CH / 2;

      // Calculate device position in canvas space
      const deviceScreenX = mouseX - sceneDeviceDragOffset.x;
      const deviceScreenY = mouseY - sceneDeviceDragOffset.y;

      // Convert back to device position
      const newX =
        (deviceScreenX - centerX * (1 - zoomFactor)) / zoomFactor -
        centerX +
        panX;
      const newY =
        (deviceScreenY - centerY * (1 - zoomFactor)) / zoomFactor -
        centerY +
        panY;

      // Update the device scene position
      const updatedScenes = props.deviceScenes.map((s) => {
        if (s.id === draggingSceneDevice) {
          return {
            ...s,
            position: { x: newX, y: newY },
          };
        }
        return s;
      });

      // Call parent update
      onDeviceScenesChange(updatedScenes);
    },
    [
      draggingSceneDevice,
      layoutMode,
      props.deviceScenes,
      scaleFactor,
      sceneDeviceDragOffset,
      onDeviceScenesChange,
      zoom,
      CW,
      CH,
      panX,
      panY,
    ]
  );

  const handleSceneDeviceMouseUp = useCallback(() => {
    stopSceneDeviceDrag();
    clearSnapGuides();
  }, [stopSceneDeviceDrag, clearSnapGuides]);

  // Touch handlers for mobile scene device dragging
  const handleSceneDeviceTouchStart = useCallback(
    (e: React.TouchEvent, sceneId: string) => {
      if (layoutMode !== "scene-builder" || !props.deviceScenes) return;
      e.preventDefault();
      e.stopPropagation();

      const scene = props.deviceScenes.find((s) => s.id === sceneId);
      if (!scene || !containerRef.current) return;

      const touch = e.touches[0];
      const canvasRect = containerRef.current.getBoundingClientRect();
      const touchX = (touch.clientX - canvasRect.left) / scaleFactor;
      const touchY = (touch.clientY - canvasRect.top) / scaleFactor;

      const zoomFactor = getEffectiveZoom(zoom, layoutMode, scene.device, null);
      const centerX = CW / 2;
      const centerY = CH / 2;

      const deviceScreenX =
        (centerX + scene.position.x - panX) * zoomFactor +
        centerX * (1 - zoomFactor);
      const deviceScreenY =
        (centerY + scene.position.y - panY) * zoomFactor +
        centerY * (1 - zoomFactor);

      startSceneDeviceDrag(sceneId, {
        x: touchX - deviceScreenX,
        y: touchY - deviceScreenY,
      });
    },
    [
      layoutMode,
      props.deviceScenes,
      scaleFactor,
      zoom,
      CW,
      CH,
      panX,
      panY,
      startSceneDeviceDrag,
    ]
  );

  const handleSceneDeviceTouchMove = useCallback(
    (e: TouchEvent) => {
      if (
        !draggingSceneDevice ||
        layoutMode !== "scene-builder" ||
        !props.deviceScenes ||
        !containerRef.current ||
        !onDeviceScenesChange
      )
        return;

      if (e.cancelable) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      const canvasRect = containerRef.current.getBoundingClientRect();
      const touchX = (touch.clientX - canvasRect.left) / scaleFactor;
      const touchY = (touch.clientY - canvasRect.top) / scaleFactor;

      const scene = props.deviceScenes.find(
        (s) => s.id === draggingSceneDevice
      );
      if (!scene) return;

      const zoomFactor = getEffectiveZoom(zoom, layoutMode, scene.device, null);
      const centerX = CW / 2;
      const centerY = CH / 2;

      const deviceScreenX = touchX - sceneDeviceDragOffset.x;
      const deviceScreenY = touchY - sceneDeviceDragOffset.y;

      const newX =
        (deviceScreenX - centerX * (1 - zoomFactor)) / zoomFactor -
        centerX +
        panX;
      const newY =
        (deviceScreenY - centerY * (1 - zoomFactor)) / zoomFactor -
        centerY +
        panY;

      const updatedScenes = props.deviceScenes.map((s) => {
        if (s.id === draggingSceneDevice) {
          return {
            ...s,
            position: { x: newX, y: newY },
          };
        }
        return s;
      });

      onDeviceScenesChange(updatedScenes);
    },
    [
      draggingSceneDevice,
      layoutMode,
      props.deviceScenes,
      scaleFactor,
      sceneDeviceDragOffset,
      onDeviceScenesChange,
      zoom,
      CW,
      CH,
      panX,
      panY,
    ]
  );

  const handleSceneDeviceTouchEnd = useCallback(() => {
    stopSceneDeviceDrag();
    clearSnapGuides();
  }, [stopSceneDeviceDrag, clearSnapGuides]);

  // Effect to attach scene device touch handlers to document
  useEffect(() => {
    if (draggingSceneDevice && layoutMode === "scene-builder") {
      document.addEventListener("touchmove", handleSceneDeviceTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleSceneDeviceTouchEnd, {
        passive: false,
      });
      return () => {
        document.removeEventListener("touchmove", handleSceneDeviceTouchMove);
        document.removeEventListener("touchend", handleSceneDeviceTouchEnd);
      };
    }
  }, [
    draggingSceneDevice,
    layoutMode,
    handleSceneDeviceTouchMove,
    handleSceneDeviceTouchEnd,
  ]);

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!branding || !containerRef.current) return;

    const canvasRect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
    const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

    setResizingBranding(handle);
    setResizeStartPos({ x: mouseX, y: mouseY });
    setResizeStartSize({ width: branding.width, height: branding.height });
    setResizeStartBrandingPos({ x: branding.x, y: branding.y });
  };

  // Handle resize move
  const handleResizeMove = (e: React.MouseEvent) => {
    if (!resizingBranding || !branding || !setBranding || !containerRef.current)
      return;

    const canvasRect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
    const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

    const deltaX = mouseX - resizeStartPos.x;
    const deltaY = mouseY - resizeStartPos.y;

    let newWidth = resizeStartSize.width;
    let newHeight = resizeStartSize.height;
    let newX = resizeStartBrandingPos.x;
    let newY = resizeStartBrandingPos.y;

    // Minimum size
    const minSize = 50;

    // Calculate new dimensions based on handle
    switch (resizingBranding) {
      case "se": // bottom-right
        newWidth = Math.max(minSize, resizeStartSize.width + deltaX);
        newHeight = Math.max(minSize, resizeStartSize.height + deltaY);
        break;
      case "sw": // bottom-left
        newWidth = Math.max(minSize, resizeStartSize.width - deltaX);
        newHeight = Math.max(minSize, resizeStartSize.height + deltaY);
        newX = resizeStartBrandingPos.x + (resizeStartSize.width - newWidth);
        break;
      case "ne": // top-right
        newWidth = Math.max(minSize, resizeStartSize.width + deltaX);
        newHeight = Math.max(minSize, resizeStartSize.height - deltaY);
        newY = resizeStartBrandingPos.y + (resizeStartSize.height - newHeight);
        break;
      case "nw": // top-left
        newWidth = Math.max(minSize, resizeStartSize.width - deltaX);
        newHeight = Math.max(minSize, resizeStartSize.height - deltaY);
        newX = resizeStartBrandingPos.x + (resizeStartSize.width - newWidth);
        newY = resizeStartBrandingPos.y + (resizeStartSize.height - newHeight);
        break;
      case "e": // right
        newWidth = Math.max(minSize, resizeStartSize.width + deltaX);
        break;
      case "w": // left
        newWidth = Math.max(minSize, resizeStartSize.width - deltaX);
        newX = resizeStartBrandingPos.x + (resizeStartSize.width - newWidth);
        break;
      case "s": // bottom
        newHeight = Math.max(minSize, resizeStartSize.height + deltaY);
        break;
      case "n": // top
        newHeight = Math.max(minSize, resizeStartSize.height - deltaY);
        newY = resizeStartBrandingPos.y + (resizeStartSize.height - newHeight);
        break;
    }

    setBranding({
      ...branding,
      width: newWidth,
      height: newHeight,
      x: Math.max(0, newX),
      y: Math.max(0, newY),
    });
  };

  const renderBranding = () => {
    if (!branding) return null;

    // Configurar estilos de fondo con modos light/dark profesionales
    const backgroundStyles: Record<string, CSSProperties> = {
      default: {},
      shadow: {
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)",
      },
      glass: {
        backdropFilter: "blur(16px) saturate(100%)",
        WebkitBackdropFilter: "blur(16px) saturate(100%)",
        border:
          branding.glassMode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(255, 255, 255, 0.4)",
        borderRadius: `${branding.glassRadius ?? 12}px`,
        padding: "16px 20px",
        boxShadow:
          branding.glassMode === "dark"
            ? "0 8px 32px rgba(0, 0, 0, 0.4)"
            : "0 8px 32px rgba(31, 38, 135, 0.2)",
      },
      badge: {
        background:
          branding.badgeMode === "light"
            ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)"
            : "linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.75) 100%)",
        padding: "14px 20px",
        borderRadius: `${branding.badgeRadius ?? 12}px`,
        boxShadow:
          branding.badgeMode === "light"
            ? "0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
            : "0 4px 16px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        border:
          branding.badgeMode === "light"
            ? "1px solid rgba(0, 0, 0, 0.08)"
            : "1px solid rgba(255, 255, 255, 0.1)",
      },
    };

    const containerStyle: CSSProperties = {
      position: "absolute",
      left: `${branding.x}px`,
      top: `${branding.y}px`,
      // Usar width/height auto para que se adapte al contenido
      width: "auto",
      height: "auto",
      maxWidth: `${branding.width}px`,
      maxHeight: `${branding.height}px`,
      opacity: branding.opacity,
      transform: `rotate(${branding.rotation}deg)`,
      transformOrigin: "center",
      display: "flex",
      flexDirection: branding.layout === "vertical" ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      pointerEvents: "auto",
      cursor: draggingBranding ? "grabbing" : "grab",
      zIndex: draggingBranding ? 20 : 10,
      userSelect: "none",
      transition:
        draggingBranding || resizingBranding
          ? "none"
          : "box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      willChange: draggingBranding || resizingBranding ? "transform" : "auto",
      ...backgroundStyles[branding.background],
    };

    // Resize handle styles
    const handleSize = 10;
    const handleStyle: CSSProperties = {
      position: "absolute",
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      background: "#3b82f6",
      border: "2px solid white",
      borderRadius: "50%",
      pointerEvents: "auto",
      zIndex: 30,
      boxShadow:
        "0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)",
      transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    return (
      <>
        <div
          style={containerStyle}
          onMouseDown={handleBrandingMouseDown}
          className="select-none group"
        >
          {branding.url && (
            <div
              style={{
                position: "relative",
                width: branding.layout === "vertical" ? "auto" : "auto",
                height: branding.layout === "vertical" ? "auto" : "auto",
                maxWidth:
                  branding.layout === "vertical"
                    ? `${branding.width}px`
                    : `${branding.width * 0.6}px`,
                maxHeight:
                  branding.layout === "vertical"
                    ? `${branding.height * 0.6}px`
                    : `${branding.height}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={branding.url}
                alt="Branding"
                width={
                  branding.layout === "vertical"
                    ? branding.width
                    : branding.width * 0.6
                }
                height={
                  branding.layout === "vertical"
                    ? branding.height * 0.6
                    : branding.height
                }
                style={{
                  objectFit: "contain",
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          )}
          {branding.text && (
            <span
              style={{
                color:
                  branding.background === "badge"
                    ? branding.badgeMode === "light"
                      ? "#1a1a1a"
                      : "#ffffff"
                    : branding.background === "glass"
                      ? branding.glassMode === "dark"
                        ? "#ffffff"
                        : "#1a1a1a"
                      : "#1a1a1a",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
                textShadow:
                  branding.background === "badge" &&
                  branding.badgeMode === "dark"
                    ? "0 1px 2px rgba(0, 0, 0, 0.3)"
                    : branding.background === "glass" &&
                        branding.glassMode === "dark"
                      ? "0 1px 2px rgba(0, 0, 0, 0.3)"
                      : "0 1px 2px rgba(255, 255, 255, 0.5)",
              }}
            >
              {branding.text}
            </span>
          )}

          {/* Resize handles - Only show on hover */}
          {["nw", "ne", "se", "sw", "n", "s", "e", "w"].map((handle) => {
            const handlePositions: Record<string, CSSProperties> = {
              nw: {
                top: `-${handleSize / 2}px`,
                left: `-${handleSize / 2}px`,
                cursor: "nwse-resize",
              },
              ne: {
                top: `-${handleSize / 2}px`,
                right: `-${handleSize / 2}px`,
                cursor: "nesw-resize",
              },
              se: {
                bottom: `-${handleSize / 2}px`,
                right: `-${handleSize / 2}px`,
                cursor: "nwse-resize",
              },
              sw: {
                bottom: `-${handleSize / 2}px`,
                left: `-${handleSize / 2}px`,
                cursor: "nesw-resize",
              },
              n: {
                top: `-${handleSize / 2}px`,
                left: "50%",
                marginLeft: `-${handleSize / 2}px`,
                cursor: "ns-resize",
              },
              s: {
                bottom: `-${handleSize / 2}px`,
                left: "50%",
                marginLeft: `-${handleSize / 2}px`,
                cursor: "ns-resize",
              },
              e: {
                top: "50%",
                right: `-${handleSize / 2}px`,
                marginTop: `-${handleSize / 2}px`,
                cursor: "ew-resize",
              },
              w: {
                top: "50%",
                left: `-${handleSize / 2}px`,
                marginTop: `-${handleSize / 2}px`,
                cursor: "ew-resize",
              },
            };

            return (
              <div
                key={handle}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out hover:scale-125"
                style={{
                  ...handleStyle,
                  ...handlePositions[handle],
                }}
                onMouseDown={(e) => handleResizeStart(e, handle)}
              />
            );
          })}
        </div>
      </>
    );
  };

  // Render Scene FX Shadow
  const renderSceneFxShadow = () => {
    if (!sceneFxShadow) return null;

    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: (sceneFxOpacity ?? 100) / 100,
          zIndex: sceneFxLayer === "overlay" ? 1000 : 0,
        }}
      >
        <Image
          src={sceneFxShadow}
          alt="Scene FX Shadow"
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <div
        className="relative"
        style={{ width: CW * scaleFactor, height: CH * scaleFactor }}
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
            cursor: draggingSceneDevice ? "grabbing" : "default",
          }}
          onMouseMove={(e) => {
            handleMouseMove(e);
            handleBrandingMouseMove(e);
            handleResizeMove(e);
            handleSceneDeviceMouseMove(e);
          }}
          onMouseUp={() => {
            handleMouseUp();
            handleBrandingMouseUp();
            handleSceneDeviceMouseUp();
          }}
          onMouseLeave={() => {
            handleMouseUp();
            handleBrandingMouseUp();
            handleSceneDeviceMouseUp();
          }}
        >
          {/* Background layer with effects */}
          <div
            className="absolute inset-0"
            style={Object.assign(
              {},
              getBackgroundStyle(),
              getBackgroundEffectsStyle()
            )}
          >
            {renderNoiseOverlay()}
          </div>

          {/* Scene FX Shadow - Underlay (behind mockup) */}
          {sceneFxLayer === "underlay" && renderSceneFxShadow()}

          {/* Content layer */}
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

            {/* Texts positioned on the entire canvas */}
            {renderTexts()}

            {/* Watermark/Logo */}
            {renderBranding()}
          </div>

          {/* Scene FX Shadow - Overlay (above everything) */}
          {sceneFxLayer === "overlay" && renderSceneFxShadow()}

          {/* Guides and Rulers */}
          {!hideGuides && (
            <CanvasGuides
              guides={guides}
              onGuidesChange={onGuidesChange || (() => {})}
              showRulers={showRulers}
              snapGuides={snapGuides}
              canvasWidth={CW}
              canvasHeight={CH}
              zoom={zoom}
              panX={panX}
              panY={panY}
              texts={texts.map((t) => ({
                id: t.id,
                x: t.x,
                y: t.y,
                fontSize: t.fontSize,
                content: t.content,
              }))}
              mockupPositions={[
                // This would need to be calculated based on actual mockup positions
                // For now, we'll use canvas center as example
                {
                  x: CW / 2 - 200,
                  y: CH / 2 - 200,
                  width: 400,
                  height: 400,
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
