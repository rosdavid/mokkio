"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ColorThief from "colorthief";
import {
  Upload,
  RefreshCw,
  Trash2,
  Plus,
  Settings,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  Eye,
  WandSparkles,
  BetweenVerticalStart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { logger } from "@/lib/logger";
import {
  MainNavigationBar,
  SecondaryNavigationBar,
  MediaUploader,
  BrowserStyleSelector,
  LayoutModeSelector,
  SceneBuilderMobile,
} from "./unified-mobile-sidebar/index";
import { createDeviceScene } from "@/types/scene-builder";
import { generateMagicalGradientsWithAI } from "../lib/magical-utils";

// Layout presets constants
const SINGLE_LAYOUT_PRESETS = [
  { id: "centered", name: "Centered" },
  { id: "perspective-left", name: "Perspective Left" },
  { id: "perspective-right", name: "Perspective Right" },
  { id: "tilt-3d-left", name: "Tilt 3D Left" },
  { id: "tilt-3d-right", name: "Tilt 3D Right" },
  { id: "isometric-left", name: "Isometric Left" },
  { id: "isometric-right", name: "Isometric Right" },
  { id: "flat-plate", name: "Flat Plate" },
  { id: "flat-topleft", name: "Flat Top Left" },
  { id: "flat-topright", name: "Flat Top Right" },
];

const DOUBLE_LAYOUT_PRESETS = [
  { id: "double-side-by-side", name: "Side by Side" },
  { id: "double-stacked", name: "Stacked" },
  { id: "double-angled", name: "Angled" },
  { id: "double-perspective", name: "Perspective" },
  { id: "double-overlap", name: "Overlap" },
  { id: "double-depth", name: "Depth" },
  { id: "double-asymmetric", name: "Asymmetric" },
  { id: "double-mirror", name: "Mirror" },
];

// Device display names and info
const deviceDisplayNames: Record<string, string> = {
  screenshot: "Screenshot - Adapts to media",
  "iphone-17-pro": "iPhone 17 Pro - 1206×2622px",
  "iphone-17-pro-max": "iPhone 17 Pro Max - 1320×2868px",
  "ipad-pro": "iPad Pro 13 - 2048×2732px",
  "ipad-pro-13": "iPad Pro 13 - 2048×2732px",
  "macbook-pro": "MacBook Pro 16 - 2560×1600px",
  "macbook-pro-16": "MacBook Pro 16 - 2560×1600px",
  safari: "Safari - Adapts to media",
  browser: "Browser - Adapts to media",
  chrome: "Chrome - Adapts to media",
};

const getDeviceInfo = (deviceKey: string) => {
  const displayName = deviceDisplayNames[deviceKey] || deviceKey;
  const parts = displayName.split(" - ");
  return {
    name: parts[0],
    resolution: parts[1] || "Auto",
  };
};

const DeviceButton = React.memo(
  ({
    deviceKey,
    isSelected,
    onClick,
    shouldLoadImages = true,
  }: {
    deviceKey: string;
    isSelected: boolean;
    onClick: () => void;
    shouldLoadImages?: boolean;
  }) => {
    const { name, resolution } = getDeviceInfo(deviceKey);
    return (
      <div className="relative">
        <button
          onClick={onClick}
          className={`w-28 h-40 flex flex-col items-center justify-center p-3 rounded-lg border text-center cursor-pointer transition-all duration-200 ${
            isSelected
              ? "border-primary bg-primary/20"
              : "border-border bg-muted hover:bg-muted/80"
          }`}
        >
          <div className="flex-1 flex items-center justify-center mb-2 min-h-10">
            {shouldLoadImages && (
              <>
                {deviceKey === "screenshot" && (
                  <Image
                    src="/davidros.vercel.app.webp"
                    alt="David Ros thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    quality={80}
                    loading="lazy"
                    priority={false}
                  />
                )}
                {deviceKey === "chrome" && (
                  <Image
                    src="/chrome-thumbnail.webp"
                    alt="Chrome thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    quality={80}
                    loading="lazy"
                    priority={false}
                  />
                )}
                {deviceKey === "safari" && (
                  <Image
                    src="/safari-thumbnail.webp"
                    alt="Safari thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    quality={80}
                    loading="lazy"
                    priority={false}
                  />
                )}
                {deviceKey === "iphone-17-pro" && (
                  <Image
                    src="/iphone-17-pro-thumbnail.png"
                    alt="iPhone 17 Pro thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    quality={80}
                    loading="lazy"
                    priority={false}
                  />
                )}
                {deviceKey === "iphone-17-pro-max" && (
                  <Image
                    src="/iphone-17-pro-max-thumbnail.png"
                    alt="iPhone 17 Pro Max thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    quality={80}
                    loading="lazy"
                    priority={false}
                  />
                )}
                {(deviceKey === "ipad-pro" || deviceKey === "ipad-pro-13") && (
                  <Image
                    src="/ipad-pro-13-thumbnail.png"
                    alt="iPad Pro thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    quality={80}
                    loading="lazy"
                    priority={false}
                  />
                )}
                {(deviceKey === "macbook-pro" ||
                  deviceKey === "macbook-pro-16") && (
                  <Image
                    src="/macbook-pro-16-thumbnail.png"
                    alt="MacBook Pro 16 thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    quality={80}
                    loading="lazy"
                    priority={false}
                  />
                )}
              </>
            )}
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground leading-tight block">
              {resolution}
            </div>
            <div className="text-base text-foreground font-medium mt-2 leading-tight block">
              {name}
            </div>
          </div>
        </button>
      </div>
    );
  }
);
DeviceButton.displayName = "DeviceButton";

// Types for the unified mobile sidebar
interface UnifiedMobileSidebarProps {
  // Mockup props (from left sidebar)
  uploadedImages: (string | null)[];
  onImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onImageRemove: (index: number) => void;
  selectedDevice: string;
  setSelectedDevice: (device: string) => void;
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
  setBackgroundType: (
    type: UnifiedMobileSidebarProps["backgroundType"]
  ) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundImage?: string | undefined;
  setBackgroundImage: (img: string | undefined) => void;
  magicalGradients?: string[];
  setMagicalGradients: (gradients: string[]) => void;
  onGenerateMagicalGradients?: () => void;
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;
  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
  setDeviceStyle: (style: UnifiedMobileSidebarProps["deviceStyle"]) => void;
  styleEdge: number;
  setStyleEdge: (px: number) => void;
  setStyleEdgeImmediate: (px: number) => void;
  borderType: string;
  setBorderType: (type: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  setBorderRadiusImmediate: (radius: number) => void;
  shadowType: string;
  setShadowType: (type: string) => void;
  shadowOpacity: number;
  setShadowOpacity: (opacity: number) => void;
  setShadowOpacityImmediate: (opacity: number) => void;
  shadowMode?: "presets" | "custom";
  setShadowMode?: (mode: "presets" | "custom") => void;
  shadowOffsetX?: number;
  setShadowOffsetX?: (n: number) => void;
  setShadowOffsetXImmediate?: (n: number) => void;
  shadowOffsetY?: number;
  setShadowOffsetY?: (n: number) => void;
  setShadowOffsetYImmediate?: (n: number) => void;
  shadowBlur?: number;
  setShadowBlur?: (n: number) => void;
  setShadowBlurImmediate?: (n: number) => void;
  shadowSpread?: number;
  setShadowSpread?: (n: number) => void;
  setShadowSpreadImmediate?: (n: number) => void;
  shadowColor?: string;
  setShadowColor?: (c: string) => void;
  sceneType: "none" | "shadow" | "shapes";
  setSceneType: (type: "none" | "shadow" | "shapes") => void;
  layoutMode: "single" | "double" | "triple" | "scene-builder";
  setLayoutMode: (
    mode: "single" | "double" | "triple" | "scene-builder"
  ) => void;
  mockupGap: number;
  setMockupGap: (gap: number) => void;
  siteUrl?: string;
  setSiteUrl?: (url: string) => void;
  hideMockup?: boolean;
  onToggleHideMockup?: () => void;
  selectedResolution: string;
  setSelectedResolution: (id: string) => void;
  backgroundNoise: number;
  setBackgroundNoise: (value: number) => void;
  backgroundBlur: number;
  setBackgroundBlur: (value: number) => void;
  browserMode: string;
  setBrowserMode: (mode: string) => void;
  onOpenLandingPopup?: () => void;
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
        // New text styling properties
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
    }>
  ) => void;
  removeText: (id: string) => void;

  // Layout props (from right sidebar)
  zoom: number;
  setZoom: (zoom: number) => void;
  selectedTemplate: string | null;
  setSelectedTemplate: (template: string | null) => void;
  padding: number;
  panX: number;
  panY: number;
  setPanX: (x: number) => void;
  setPanY: (y: number) => void;
  setPanImmediate?: (x: number, y: number) => void;
  commitPanHistory?: () => void;
  canvasWidth: number;
  canvasHeight: number;

  // Branding props
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
  setBranding: (branding: UnifiedMobileSidebarProps["branding"]) => void;

  // Scene Builder props
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
    scenes: NonNullable<UnifiedMobileSidebarProps["deviceScenes"]>
  ) => void;
  onImageUploadForScene?: (
    e: React.ChangeEvent<HTMLInputElement>,
    sceneId: string
  ) => void;

  // Scene FX props
  sceneFxMode?: "default" | "shadows";
  setSceneFxMode?: (mode: "default" | "shadows") => void;
  sceneFxShadow?: string | null;
  setSceneFxShadow?: (shadow: string | null) => void;
  sceneFxOpacity?: number;
  setSceneFxOpacity?: (opacity: number) => void;
  sceneFxLayer?: "overlay" | "underlay";
  setSceneFxLayer?: (layer: "overlay" | "underlay") => void;

  // Double click handlers - control from parent
  editingTextIdFromCanvas?: string | null;
  setEditingTextIdFromCanvas?: (id: string | null) => void;
  editingBrandingFromCanvas?: boolean;
  setEditingBrandingFromCanvas?: (value: boolean) => void;

  // Control props
  isOpen: boolean;
  onClose: () => void;
}

type MainSection = "mockup" | "frame" | "layout" | "scene";

export function UnifiedMobileSidebar(props: UnifiedMobileSidebarProps) {
  const [activeMainSection, setActiveMainSection] =
    useState<MainSection | null>(null);
  const [activeSecondarySection, setActiveSecondarySection] = useState<
    string | null
  >(null);
  const [backgroundTab, setBackgroundTab] = useState("color");
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [deviceTab, setDeviceTab] = useState("all");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [backgroundExpandedSections, setBackgroundExpandedSections] = useState<
    Record<string, boolean>
  >({
    solid: false,
    linear: false,
    radial: false,
    cosmic: false,
    textures: false,
  });
  const [shadowPreviewMode, setShadowPreviewMode] = useState(false);
  const [sceneFxExpandedShadows, setSceneFxExpandedShadows] = useState(false);

  // Handle double click from canvas
  useEffect(() => {
    if (props.editingTextIdFromCanvas) {
      setEditingTextId(props.editingTextIdFromCanvas);
      setActiveMainSection("layout");
      setActiveSecondarySection("text");
      // Clear the flag after opening
      if (props.setEditingTextIdFromCanvas) {
        props.setEditingTextIdFromCanvas(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editingTextIdFromCanvas]);

  useEffect(() => {
    if (props.editingBrandingFromCanvas) {
      setActiveMainSection("frame");
      setActiveSecondarySection("frame");
      // Clear the flag after opening
      if (props.setEditingBrandingFromCanvas) {
        props.setEditingBrandingFromCanvas(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.editingBrandingFromCanvas]);

  // Estado local para gradientes mágicos generados
  const [localMagicalGradients, setLocalMagicalGradients] = useState<string[]>(
    []
  );
  // Estado para controlar el loading del botón de generar
  const [isGeneratingMagical, setIsGeneratingMagical] = useState(false);

  // Desestructurar props para el useEffect
  const { uploadedImages, setMagicalGradients } = props;

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Device menu state management
  useEffect(() => {
    if (
      activeSecondarySection === "device" ||
      activeSecondarySection === "devices"
    ) {
      const timer = setTimeout(() => {
        setImagesLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setImagesLoaded(false);
    }
  }, [activeSecondarySection]);

  // Reiniciar gradientes mágicos cuando cambia la imagen subida
  useEffect(() => {
    if (uploadedImages && uploadedImages[0]) {
      // Si hay una nueva imagen, reiniciar los gradientes
      setLocalMagicalGradients([]);
      if (setMagicalGradients) {
        setMagicalGradients([]);
      }
    }
  }, [uploadedImages, setMagicalGradients]);

  // Función para generar gradientes mágicos desde colores
  const generateMagicalGradients = (colors: string[]): string[] => {
    const gradients: string[] = [];

    for (let i = 0; i < 12; i++) {
      const color1 = colors[i % colors.length];
      const color2 = colors[(i + 1) % colors.length];
      const color3 = colors[(i + 2) % colors.length];

      // Crear diferentes tipos de gradientes
      if (i < 4) {
        // Gradientes lineales
        gradients.push(`linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`);
      } else if (i < 8) {
        // Gradientes radiales
        gradients.push(
          `radial-gradient(circle at 50% 50%, ${color1} 0%, ${color2} 100%)`
        );
      } else {
        // Gradientes con 3 colores
        gradients.push(
          `linear-gradient(45deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`
        );
      }
    }

    return gradients;
  };

  // Función para generar gradientes mágicos desde la imagen subida
  const handleGenerateMagicalGradients = async () => {
    if (!props.uploadedImages[0]) return;

    setIsGeneratingMagical(true);
    try {
      // Usar la nueva función de AI para generar gradientes
      const aiGradients = await generateMagicalGradientsWithAI(
        props.uploadedImages[0]
      );
      const gradients = aiGradients.map((g) => g.gradient);

      setLocalMagicalGradients(gradients);

      // Actualizar el estado global también
      if (props.setMagicalGradients) {
        props.setMagicalGradients(gradients);
      }

      // Llamar al callback si existe
      if (props.onGenerateMagicalGradients) {
        props.onGenerateMagicalGradients();
      }
    } catch (error) {
      logger.error("Error generating AI magical gradients:", error);
      // Fallback a la función original si la AI falla
      try {
        const img = document.createElement("img") as HTMLImageElement;
        img.crossOrigin = "anonymous";
        img.src = props.uploadedImages[0];

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 8); // Obtener 8 colores dominantes

        // Convertir colores RGB a hex
        const hexColors = colors.map(
          (color) =>
            `#${color.map((c) => c.toString(16).padStart(2, "0")).join("")}`
        );

        const gradients = generateMagicalGradients(hexColors);
        setLocalMagicalGradients(gradients);

        // Actualizar el estado global también
        if (props.setMagicalGradients) {
          props.setMagicalGradients(gradients);
        }

        // Llamar al callback si existe
        if (props.onGenerateMagicalGradients) {
          props.onGenerateMagicalGradients();
        }
      } catch (fallbackError) {
        logger.error("Fallback generation also failed:", fallbackError);
      }
    } finally {
      setIsGeneratingMagical(false);
    }
  };

  if (!props.isOpen) return null;

  const renderSecondaryContent = (buttonId: string) => {
    switch (buttonId) {
      case "device":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground">
                Device Selection
              </h4>
              <button
                onClick={() => setActiveSecondarySection(null)}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            {renderDevicePopover()}
          </div>
        );
      case "media":
        return (
          <MediaUploader
            uploadedImages={props.uploadedImages}
            onImageUpload={props.onImageUpload}
            onImageRemove={props.onImageRemove}
            hideMockup={props.hideMockup}
            onToggleHideMockup={props.onToggleHideMockup}
            onClose={() => setActiveSecondarySection(null)}
            layoutMode={props.layoutMode}
          />
        );
      case "browser":
        return (
          <BrowserStyleSelector
            activeSection={activeMainSection}
            selectedDevice={props.selectedDevice}
            browserMode={props.browserMode}
            siteUrl={props.siteUrl}
            onBrowserModeChange={props.setBrowserMode}
            onSiteUrlChange={props.setSiteUrl}
            onClose={() => setActiveSecondarySection(null)}
          />
        );
      case "border":
        return renderBorderPopover(() => setActiveSecondarySection(null));
      case "background":
        return renderBackgroundPopover(() => setActiveSecondarySection(null));
      case "shadow":
        return renderShadowPopover(() => setActiveSecondarySection(null));
      case "scene-fx":
        return renderSceneFxPopover(() => setActiveSecondarySection(null));
      case "effects":
        return renderEffectsPopover(() => setActiveSecondarySection(null));
      case "text":
        return renderTextPopover(() => setActiveSecondarySection(null));
      case "resolution":
        return renderResolutionPopover(() => setActiveSecondarySection(null));
      case "zoom":
        return renderZoomPopover(() => setActiveSecondarySection(null));
      case "presets":
        return renderPresetsPopover(() => setActiveSecondarySection(null));
      case "spacing":
        return renderSpacingPopover(() => setActiveSecondarySection(null));
      case "branding":
        return renderBrandingPopover(() => setActiveSecondarySection(null));
      case "mockups":
        return (
          <div className="space-y-4">
            {/* Layout Mode Selector */}
            <LayoutModeSelector
              layoutMode={props.layoutMode}
              setLayoutMode={props.setLayoutMode}
              onClose={() => setActiveSecondarySection(null)}
            />

            {/* Mockup Spacing */}
            {props.layoutMode === "double" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Mockup Spacing</Label>
                  <span className="text-sm text-muted-foreground">
                    {props.mockupGap}px
                  </span>
                </div>
                <Slider
                  value={[props.mockupGap]}
                  onValueChange={([v]) => props.setMockupGap(v)}
                  min={-500}
                  max={500}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  Negative values bring mockups closer, positive values separate
                  them
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-xs text-muted-foreground">
                  Select two mockups to use spacing feature
                </div>
              </div>
            )}
          </div>
        );
      case "devices":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-foreground">
                Add Device to Scene
              </h4>
              <button
                onClick={() => setActiveSecondarySection(null)}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <div
              className="w-full max-h-[80vh] overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="p-2">
                <Tabs
                  value={deviceTab}
                  onValueChange={setDeviceTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-6 bg-muted overflow-hidden px-1 py-1 mb-3">
                    <TabsTrigger
                      value="all"
                      className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                        deviceTab === "all"
                          ? "bg-primary/20 border-primary"
                          : "bg-transparent"
                      }`}
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="phone"
                      className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                        deviceTab === "phone"
                          ? "bg-primary/20 border-primary"
                          : "bg-transparent"
                      }`}
                    >
                      Phone
                    </TabsTrigger>
                    <TabsTrigger
                      value="tablet"
                      className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                        deviceTab === "tablet"
                          ? "bg-primary/20 border-primary"
                          : "bg-transparent"
                      }`}
                    >
                      Tablet
                    </TabsTrigger>
                    <TabsTrigger
                      value="laptop"
                      className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                        deviceTab === "laptop"
                          ? "bg-primary/20 border-primary"
                          : "bg-transparent"
                      }`}
                    >
                      Laptop
                    </TabsTrigger>
                    <TabsTrigger
                      value="desktop"
                      className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                        deviceTab === "desktop"
                          ? "bg-primary/20 border-primary"
                          : "bg-transparent"
                      }`}
                    >
                      Desktop
                    </TabsTrigger>
                    <TabsTrigger
                      value="browser"
                      className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                        deviceTab === "browser"
                          ? "bg-primary/20 border-primary"
                          : "bg-transparent"
                      }`}
                    >
                      Browser
                    </TabsTrigger>
                  </TabsList>

                  {/* All Tab */}
                  <TabsContent value="all" className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <DeviceButton
                        deviceKey="screenshot"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "screenshot",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="iphone-17-pro"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "iphone-17-pro",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="iphone-17-pro-max"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "iphone-17-pro-max",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="ipad-pro"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "ipad-pro-13",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="macbook-pro"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "macbook-pro-16",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="safari"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "safari",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="chrome"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "chrome",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                    </div>
                  </TabsContent>

                  {/* Phone Tab */}
                  <TabsContent value="phone" className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <DeviceButton
                        deviceKey="iphone-17-pro"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "iphone-17-pro",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="iphone-17-pro-max"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "iphone-17-pro-max",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                    </div>
                  </TabsContent>

                  {/* Tablet Tab */}
                  <TabsContent value="tablet" className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <DeviceButton
                        deviceKey="ipad-pro"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "ipad-pro-13",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                    </div>
                  </TabsContent>

                  {/* Laptop Tab */}
                  <TabsContent value="laptop" className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <DeviceButton
                        deviceKey="macbook-pro"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "macbook-pro-16",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                    </div>
                  </TabsContent>

                  {/* Desktop Tab */}
                  <TabsContent value="desktop" className="mt-2">
                    <div className="text-xs text-muted-foreground text-center py-4">
                      No desktop devices available yet
                    </div>
                  </TabsContent>

                  {/* Browser Tab */}
                  <TabsContent value="browser" className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <DeviceButton
                        deviceKey="safari"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "safari",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                      <DeviceButton
                        deviceKey="chrome"
                        isSelected={false}
                        onClick={() => {
                          const newScene = createDeviceScene(
                            "chrome",
                            props.uploadedImages[0] || null
                          );
                          props.onDeviceScenesChange?.([
                            ...(props.deviceScenes || []),
                            newScene,
                          ]);
                          setActiveSecondarySection(null);
                        }}
                        shouldLoadImages={imagesLoaded}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        );
      case "scene-builder":
        return (
          <SceneBuilderMobile
            scenes={props.deviceScenes || []}
            onScenesChange={props.onDeviceScenesChange || (() => {})}
            availableImages={props.uploadedImages}
            onImageUpload={props.onImageUploadForScene}
            onClose={() => setActiveSecondarySection(null)}
            shadowType={props.shadowType}
            setShadowType={props.setShadowType}
            shadowOpacity={props.shadowOpacity}
            setShadowOpacity={props.setShadowOpacity}
            setShadowOpacityImmediate={props.setShadowOpacityImmediate}
            shadowMode={props.shadowMode}
            setShadowMode={props.setShadowMode}
            shadowOffsetX={props.shadowOffsetX}
            setShadowOffsetX={props.setShadowOffsetX}
            setShadowOffsetXImmediate={props.setShadowOffsetXImmediate}
            shadowOffsetY={props.shadowOffsetY}
            setShadowOffsetY={props.setShadowOffsetY}
            setShadowOffsetYImmediate={props.setShadowOffsetYImmediate}
            shadowBlur={props.shadowBlur}
            setShadowBlur={props.setShadowBlur}
            setShadowBlurImmediate={props.setShadowBlurImmediate}
            shadowSpread={props.shadowSpread}
            setShadowSpread={props.setShadowSpread}
            setShadowSpreadImmediate={props.setShadowSpreadImmediate}
            shadowColor={props.shadowColor}
            setShadowColor={props.setShadowColor}
            borderRadius={props.borderRadius}
            setBorderRadius={props.setBorderRadius}
            setBorderRadiusImmediate={props.setBorderRadiusImmediate}
            siteUrl={props.siteUrl}
            setSiteUrl={props.setSiteUrl}
          />
        );
      default:
        return <div>Content not available</div>;
    }
  };

  const renderBorderPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground">
            Border Configuration
          </h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Device Style */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Border Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                "default",
                "glass-light",
                "glass-dark",
                "liquid",
                "retro",
              ] as const
            ).map((style) => (
              <button
                key={style}
                onClick={() => props.setDeviceStyle(style)}
                className={`h-8 rounded border text-xs capitalize text-foreground cursor-pointer ${
                  props.deviceStyle === style
                    ? "border-primary bg-primary/20"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
              >
                {style.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Border Edge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Edge</Label>
            <span className="text-xs text-muted-foreground">
              {props.styleEdge}px
            </span>
          </div>
          <Slider
            value={[props.styleEdge]}
            onValueChange={([v]) => props.setStyleEdgeImmediate(v)}
            onValueCommit={([v]) => props.setStyleEdge(v)}
            min={0}
            max={64}
            step={1}
            className="w-full"
          />
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Border Radius</Label>
            <span className="text-xs text-muted-foreground">
              {props.borderRadius}
            </span>
          </div>
          <Slider
            value={[props.borderRadius]}
            onValueChange={([v]) => props.setBorderRadiusImmediate(v)}
            onValueCommit={([v]) => props.setBorderRadius(v)}
            min={0}
            max={40}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    );
  };

  const renderBackgroundPopover = (onClose?: () => void) => {
    return (
      <div
        className="w-full max-h-[80vh] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Background Settings
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Magical Backgrounds Section - always visible */}
          <div className="mb-4 p-3 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <div className="flex flex-col items-center gap-3">
              <div className="text-center">
                <h3 className="text-sm font-medium text-foreground mb-1 gap-2 flex justify-center items-center">
                  <WandSparkles className="inline-block w-4 h-4 mr-1 text-purple-500" />
                  Magic Backgrounds AI
                </h3>
                <p className="text-xs text-muted-foreground">
                  Generate the perfect backgrounds for your mockups
                </p>
              </div>
              <button
                onClick={handleGenerateMagicalGradients}
                disabled={
                  isGeneratingMagical ||
                  !props.uploadedImages ||
                  !props.uploadedImages[0]
                }
                className="w-full h-10 rounded-lg bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
              >
                {isGeneratingMagical ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary/50 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>Generate</>
                )}
              </button>
              {!props.uploadedImages || !props.uploadedImages[0] ? (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Upload a mockup image to generate magical backgrounds
                  </p>
                </div>
              ) : (props.magicalGradients &&
                  props.magicalGradients.length > 0) ||
                (localMagicalGradients && localMagicalGradients.length > 0) ? (
                <div className="w-full">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Generated Backgrounds
                  </h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(props.magicalGradients &&
                    props.magicalGradients.length > 0
                      ? props.magicalGradients
                      : localMagicalGradients
                    ).map((gradient, i) => (
                      <button
                        key={`magical-${i}`}
                        onClick={() => {
                          props.setBackgroundType("magical");
                          props.setSelectedPreset(`magical-${i}`);
                          const gradientsToUse =
                            props.magicalGradients &&
                            props.magicalGradients.length > 0
                              ? props.magicalGradients
                              : localMagicalGradients;
                          if (props.setMagicalGradients) {
                            props.setMagicalGradients(gradientsToUse);
                          }
                        }}
                        className={`h-8 rounded border cursor-pointer ${
                          props.selectedPreset === `magical-${i}` &&
                          props.backgroundType === "magical"
                            ? "border-purple-500 ring-2 ring-purple-500/50"
                            : "border-white/10"
                        }`}
                        style={{ background: gradient }}
                        title={`Gradiente Mágico ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Background Type Tabs */}
          <Tabs
            value={backgroundTab}
            onValueChange={setBackgroundTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transparent" className="text-xs">
                Transparent
              </TabsTrigger>
              <TabsTrigger value="color" className="text-xs">
                Color
              </TabsTrigger>
              <TabsTrigger value="image" className="text-xs">
                Image
              </TabsTrigger>
            </TabsList>

            {/* Transparent Tab */}
            <TabsContent value="transparent" className="mt-4">
              <div className="flex flex-col items-center justify-center py-6">
                <Button
                  onClick={() => {
                    props.setBackgroundType("transparent");
                    props.setBackgroundColor("rgba(0,0,0,0)");
                  }}
                  variant={
                    props.backgroundType === "transparent"
                      ? "default"
                      : "outline"
                  }
                  className="w-32"
                >
                  No Background
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Export transparent PNG
                </p>
              </div>
            </TabsContent>

            {/* Color Tab */}
            <TabsContent value="color" className="mt-4 space-y-4">
              {/* Solid Colors */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Solid Colors
                </Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {["#ffffff", "#f5f5f5", "#d4d4d4"]
                    .slice(0, 3)
                    .map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          props.setBackgroundType("solid");
                          props.setBackgroundColor(color);
                        }}
                        className={`h-8 rounded border-2 cursor-pointer ${
                          props.backgroundColor === color &&
                          props.backgroundType === "solid"
                            ? "border-primary"
                            : "border-border"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        solid: !prev.solid,
                      }))
                    }
                    className={`h-8 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.solid
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        backgroundExpandedSections.solid ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.solid && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      // Grays
                      "#a3a3a3",
                      "#737373",
                      "#525252",
                      "#404040",
                      "#262626",
                      "#171717",
                      "#0a0a0a",
                      "#0f0f0f",
                      "#050505",
                      // Blues
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
                      // Greens
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
                      // Yellows
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
                      // Reds
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
                      // Oranges
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
                    ].map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          props.setBackgroundType("solid");
                          props.setBackgroundColor(color);
                        }}
                        className={`h-8 rounded border-2 cursor-pointer ${
                          props.backgroundColor === color &&
                          props.backgroundType === "solid"
                            ? "border-primary"
                            : "border-border"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Linear Gradients */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Linear Gradients
                </Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
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
                  ]
                    .slice(0, 3)
                    .map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          props.setBackgroundType("gradient");
                          props.setSelectedPreset(`linear-${index}`);
                        }}
                        className={`h-8 rounded border-2 cursor-pointer ${
                          props.selectedPreset === `linear-${index}` &&
                          props.backgroundType === "gradient"
                            ? "border-primary"
                            : "border-border"
                        }`}
                        style={{ background: gradient }}
                        title={`Gradient ${index + 1}`}
                      />
                    ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        linear: !prev.linear,
                      }))
                    }
                    className={`h-8 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.linear
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        backgroundExpandedSections.linear ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.linear && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
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
                    ]
                      .slice(3)
                      .map((gradient, index) => (
                        <button
                          key={index + 3}
                          onClick={() => {
                            props.setBackgroundType("gradient");
                            props.setSelectedPreset(`linear-${index + 3}`);
                          }}
                          className={`h-8 rounded border-2 cursor-pointer ${
                            props.selectedPreset === `linear-${index + 3}` &&
                            props.backgroundType === "gradient"
                              ? "border-primary"
                              : "border-border"
                          }`}
                          style={{ background: gradient }}
                          title={`Gradient ${index + 4}`}
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Radial Gradients */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Radial Gradients
                </Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
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
                  ]
                    .slice(0, 3)
                    .map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          props.setBackgroundType("gradient");
                          props.setSelectedPreset(`radial-${index}`);
                        }}
                        className={`h-8 rounded border-2 cursor-pointer ${
                          props.selectedPreset === `radial-${index}` &&
                          props.backgroundType === "gradient"
                            ? "border-primary"
                            : "border-border"
                        }`}
                        style={{ background: gradient }}
                        title={`Radial ${index + 1}`}
                      />
                    ))}
                  <button
                    onClick={() =>
                      setBackgroundExpandedSections((prev) => ({
                        ...prev,
                        radial: !prev.radial,
                      }))
                    }
                    className={`h-8 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${
                      backgroundExpandedSections.radial
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        backgroundExpandedSections.radial ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.radial && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
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
                    ]
                      .slice(3)
                      .map((gradient, index) => (
                        <button
                          key={index + 3}
                          onClick={() => {
                            props.setBackgroundType("gradient");
                            props.setSelectedPreset(`radial-${index + 3}`);
                          }}
                          className={`h-8 rounded border-2 cursor-pointer ${
                            props.selectedPreset === `radial-${index + 3}` &&
                            props.backgroundType === "gradient"
                              ? "border-primary"
                              : "border-border"
                          }`}
                          style={{ background: gradient }}
                          title={`Radial ${index + 4}`}
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Cosmic Gradients */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Cosmic Gradients
                </Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, 3).map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        props.setBackgroundType("cosmic");
                        props.setSelectedPreset(`cosmic-gradient-${num}`);
                      }}
                      className={`h-8 rounded border-2 cursor-pointer overflow-hidden ${
                        props.selectedPreset === `cosmic-gradient-${num}` &&
                        props.backgroundType === "cosmic"
                          ? "border-primary"
                          : "border-border"
                      }`}
                    >
                      <Image
                        src={`/thumbnails/cosmic/cosmic-gradient-thumbnail-${num}.webp`}
                        alt={`Cosmic ${num}`}
                        width={120}
                        height={64}
                        className="w-full h-full object-cover"
                        quality={75}
                        loading="lazy"
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
                    className="h-8 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200 bg-muted hover:bg-muted/80"
                  >
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        backgroundExpandedSections.cosmic ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.cosmic && (
                  <div className="grid grid-cols-4 gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(3).map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          props.setBackgroundType("cosmic");
                          props.setSelectedPreset(`cosmic-gradient-${num}`);
                        }}
                        className={`h-8 rounded border-2 cursor-pointer overflow-hidden ${
                          props.selectedPreset === `cosmic-gradient-${num}` &&
                          props.backgroundType === "cosmic"
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        <Image
                          src={`/thumbnails/cosmic/cosmic-gradient-thumbnail-${num}.webp`}
                          alt={`Cosmic ${num}`}
                          width={120}
                          height={64}
                          className="w-full h-full object-cover"
                          quality={75}
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Textures */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Textures
                </Label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                    .slice(0, 3)
                    .map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          props.setBackgroundType("textures");
                          props.setSelectedPreset(`textures-${num}`);
                        }}
                        className={`h-8 rounded border-2 cursor-pointer overflow-hidden ${
                          props.selectedPreset === `textures-${num}` &&
                          props.backgroundType === "textures"
                            ? "border-primary"
                            : "border-border"
                        }`}
                      >
                        <Image
                          src={`/thumbnails/textures/textures-thumbnail-${num}.webp`}
                          alt={`Texture ${num}`}
                          width={120}
                          height={64}
                          className="w-full h-full object-cover"
                          quality={75}
                          loading="lazy"
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
                    className="h-8 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200 bg-muted hover:bg-muted/80"
                  >
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        backgroundExpandedSections.textures ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {backgroundExpandedSections.textures && (
                  <div className="grid grid-cols-4 gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                      .slice(3)
                      .map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            props.setBackgroundType("textures");
                            props.setSelectedPreset(`textures-${num}`);
                          }}
                          className={`h-8 rounded border-2 cursor-pointer overflow-hidden ${
                            props.selectedPreset === `textures-${num}` &&
                            props.backgroundType === "textures"
                              ? "border-primary"
                              : "border-border"
                          }`}
                        >
                          <Image
                            src={`/thumbnails/textures/textures-thumbnail-${num}.webp`}
                            alt={`Texture ${num}`}
                            width={120}
                            height={64}
                            className="w-full h-full object-cover"
                            quality={75}
                            loading="lazy"
                          />
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Image Tab */}
            <TabsContent value="image" className="mt-4">
              <div className="flex flex-col items-center justify-center py-6">
                {props.backgroundImage ? (
                  <div className="relative group">
                    <Image
                      src={props.backgroundImage}
                      alt="Background image"
                      width={400}
                      height={300}
                      className="rounded-lg object-cover"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      {isClient && (
                        <>
                          <Button
                            size="sm"
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
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              props.setBackgroundImage(undefined);
                              props.setBackgroundType("transparent");
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer relative aspect-video bg-muted border border-border border-dashed rounded-lg hover:bg-muted/80 transition-colors p-4">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground text-center">
                      Drop or click to upload background image
                    </span>
                    {isClient && (
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
                    )}
                  </label>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  const renderEffectsPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground">Effects</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Background Effects */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Noise</Label>
              <span className="text-sm text-muted-foreground">
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
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Blur</Label>
              <span className="text-sm text-muted-foreground">
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
      </div>
    );
  };

  const renderSceneFxPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground">Scene FX</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Mode Toggle: Default / Shadows */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              props.setSceneFxMode?.("default");
              props.setSceneFxShadow?.(null);
            }}
            className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
              props.sceneFxMode === "default"
                ? "border-primary bg-primary/20"
                : "border-border bg-muted hover:bg-muted/80"
            }`}
          >
            Default
          </button>
          <button
            onClick={() => props.setSceneFxMode?.("shadows")}
            className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
              props.sceneFxMode === "shadows"
                ? "border-primary bg-primary/20"
                : "border-border bg-muted hover:bg-muted/80"
            }`}
          >
            Shadows
          </button>
        </div>

        {/* Shadow Grid - only show when mode is shadows */}
        {props.sceneFxMode === "shadows" && (
          <div className="space-y-3">
            {/* Shadow Thumbnails Grid */}
            <div className="grid grid-cols-4 gap-2">
              {/* First 3 shadows */}
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    props.setSceneFxShadow?.(`/shadows/shadow-${num}.png`)
                  }
                  className={`h-8 rounded border cursor-pointer overflow-hidden transition-all ${
                    props.sceneFxShadow === `/shadows/shadow-${num}.png`
                      ? "border-primary ring-2 ring-primary/50"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image
                    src={`/thumbnails/shadows/shadow-thumbnail-${num}.webp`}
                    alt={`Shadow ${num}`}
                    width={120}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </button>
              ))}

              {/* Expand Button */}
              <button
                onClick={() =>
                  setSceneFxExpandedShadows(!sceneFxExpandedShadows)
                }
                className="h-8 rounded border border-border bg-muted hover:bg-muted/80 cursor-pointer flex items-center justify-center transition-all"
              >
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    sceneFxExpandedShadows ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Expanded Shadows (4-20) */}
            {sceneFxExpandedShadows && (
              <div className="grid grid-cols-4 gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                {Array.from({ length: 17 }, (_, i) => i + 4).map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      props.setSceneFxShadow?.(`/shadows/shadow-${num}.png`)
                    }
                    className={`h-8 rounded border cursor-pointer overflow-hidden transition-all ${
                      props.sceneFxShadow === `/shadows/shadow-${num}.png`
                        ? "border-primary ring-2 ring-primary/50"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={`/thumbnails/shadows/shadow-thumbnail-${num}.webp`}
                      alt={`Shadow ${num}`}
                      width={120}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Opacity Slider */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-muted-foreground">Opacity</Label>
                <span className="text-xs text-muted-foreground">
                  {props.sceneFxOpacity ?? 100}%
                </span>
              </div>
              <Slider
                value={[props.sceneFxOpacity ?? 100]}
                onValueChange={([v]) => props.setSceneFxOpacity?.(v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Layer Mode: Underlay / Overlay */}
            <div className="flex gap-2">
              <button
                onClick={() => props.setSceneFxLayer?.("underlay")}
                className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
                  props.sceneFxLayer === "underlay"
                    ? "border-primary bg-primary/20"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
              >
                Underlay
              </button>
              <button
                onClick={() => props.setSceneFxLayer?.("overlay")}
                className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
                  props.sceneFxLayer === "overlay"
                    ? "border-primary bg-primary/20"
                    : "border-border bg-muted hover:bg-muted/80"
                }`}
              >
                Overlay
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderShadowPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground">
            Shadow Settings
          </h4>
          <div className="flex items-center gap-2">
            {/* Preview Mode Toggle - only show in custom mode */}
            {props.shadowMode === "custom" && (
              <button
                onClick={() => setShadowPreviewMode(!shadowPreviewMode)}
                className={`p-1 rounded-lg transition-colors ${
                  shadowPreviewMode
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                }`}
                title={
                  shadowPreviewMode ? "Exit preview mode" : "Enter preview mode"
                }
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle Presets/Custom */}
        <div className="flex gap-2">
          <button
            onClick={() => props.setShadowMode?.("presets")}
            className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
              props.shadowMode === "presets"
                ? "border-primary bg-primary/20"
                : "border-border bg-muted hover:bg-muted/80"
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => props.setShadowMode?.("custom")}
            className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
              props.shadowMode === "custom"
                ? "border-primary bg-primary/20"
                : "border-border bg-muted hover:bg-muted/80"
            }`}
          >
            Custom
          </button>
        </div>

        {/* PRESETS */}
        {props.shadowMode !== "custom" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              {["none", "spread", "hug", "adaptive"].map((type) => (
                <button
                  key={type}
                  onClick={() => props.setShadowType(type)}
                  className={`h-10 rounded-lg border text-xs capitalize text-foreground cursor-pointer ${
                    props.shadowType === type
                      ? "border-primary bg-primary/20"
                      : "border-border bg-muted hover:bg-muted/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Opacity (compartida) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-muted-foreground">Opacity</Label>
                <span className="text-xs text-muted-foreground">
                  {props.shadowOpacity}%
                </span>
              </div>
              <Slider
                value={[props.shadowOpacity]}
                onValueChange={([v]) => props.setShadowOpacityImmediate(v)}
                onValueCommit={([v]) => props.setShadowOpacity(v)}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </>
        ) : (
          /* CUSTOM */
          <div className={`space-y-3 ${shadowPreviewMode ? "opacity-70" : ""}`}>
            {/* Compact layout for preview mode */}
            {shadowPreviewMode ? (
              <div className="grid grid-cols-2 gap-3">
                {/* Offset X & Y in one row */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">
                    X
                  </Label>
                  <Slider
                    value={[props.shadowOffsetX ?? 0]}
                    onValueChange={([v]) =>
                      props.setShadowOffsetXImmediate?.(v)
                    }
                    onValueCommit={([v]) => props.setShadowOffsetX?.(v)}
                    min={-80}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">
                    Y
                  </Label>
                  <Slider
                    value={[props.shadowOffsetY ?? 0]}
                    onValueChange={([v]) =>
                      props.setShadowOffsetYImmediate?.(v)
                    }
                    onValueCommit={([v]) => props.setShadowOffsetY?.(v)}
                    min={-80}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>
                {/* Blur & Spread in one row */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">
                    Blur
                  </Label>
                  <Slider
                    value={[props.shadowBlur ?? 0]}
                    onValueChange={([v]) => props.setShadowBlurImmediate?.(v)}
                    onValueCommit={([v]) => props.setShadowBlur?.(v)}
                    min={0}
                    max={160}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">
                    Spread
                  </Label>
                  <Slider
                    value={[props.shadowSpread ?? 0]}
                    onValueChange={([v]) => props.setShadowSpreadImmediate?.(v)}
                    onValueCommit={([v]) => props.setShadowSpread?.(v)}
                    min={-40}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>
                {/* Opacity */}
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground mb-1">
                    Opacity
                  </Label>
                  <Slider
                    value={[props.shadowOpacity]}
                    onValueChange={([v]) => props.setShadowOpacityImmediate(v)}
                    onValueCommit={([v]) => props.setShadowOpacity(v)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              /* Full layout for normal mode */
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-muted-foreground">
                      Offset X
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {props.shadowOffsetX ?? 0}px
                    </span>
                  </div>
                  <Slider
                    value={[props.shadowOffsetX ?? 0]}
                    onValueChange={([v]) =>
                      props.setShadowOffsetXImmediate?.(v)
                    }
                    onValueCommit={([v]) => props.setShadowOffsetX?.(v)}
                    min={-80}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-muted-foreground">
                      Offset Y
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {props.shadowOffsetY ?? 0}px
                    </span>
                  </div>
                  <Slider
                    value={[props.shadowOffsetY ?? 0]}
                    onValueChange={([v]) =>
                      props.setShadowOffsetYImmediate?.(v)
                    }
                    onValueCommit={([v]) => props.setShadowOffsetY?.(v)}
                    min={-80}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-muted-foreground">
                      Blur
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {props.shadowBlur ?? 0}px
                    </span>
                  </div>
                  <Slider
                    value={[props.shadowBlur ?? 0]}
                    onValueChange={([v]) => props.setShadowBlurImmediate?.(v)}
                    onValueCommit={([v]) => props.setShadowBlur?.(v)}
                    min={0}
                    max={160}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-muted-foreground">
                      Spread
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {props.shadowSpread ?? 0}px
                    </span>
                  </div>
                  <Slider
                    value={[props.shadowSpread ?? 0]}
                    onValueChange={([v]) => props.setShadowSpreadImmediate?.(v)}
                    onValueCommit={([v]) => props.setShadowSpread?.(v)}
                    min={-40}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-muted-foreground">
                      Opacity
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {props.shadowOpacity}%
                    </span>
                  </div>
                  <Slider
                    value={[props.shadowOpacity]}
                    onValueChange={([v]) => props.setShadowOpacityImmediate(v)}
                    onValueCommit={([v]) => props.setShadowOpacity(v)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Color palette - always visible */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Color
              </Label>
              <div className="flex flex-row flex-wrap gap-4">
                {[
                  "#000000",
                  "#ffffff",
                  "#666666",
                  "#ff0000",
                  "#00ff00",
                  "#0000ff",
                  "#ffff00",
                  "#ff00ff",
                  "#00ffff",
                  "#ffa500",
                  "#800080",
                  "#008000",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => props.setShadowColor?.(c)}
                    className={`h-6 w-6 rounded border cursor-pointer ${
                      (props.shadowColor || "#000000") === c
                        ? "border-purple-500 ring-1 ring-purple-500/50"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTextPopover = (onClose?: () => void) => {
    return (
      <div
        className="w-full max-h-[80vh] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-foreground">
              Text Overlays
            </h4>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-accent transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <Button
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
                // New text styling properties
                textShadowOffsetX: 0,
                textShadowOffsetY: 0,
                textShadowBlur: 0,
                textShadowColor: "#000000",
              })
            }
            className="w-full rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2 text-foreground/80" />
            Add Text
          </Button>

          {/* Text List */}
          {props.texts.length > 0 && (
            <div
              className="space-y-2 max-h-60 overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
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
                      {text.fontSize}px • {text.fontFamily}
                    </div>
                  </div>
                  <Popover
                    open={editingTextId === text.id}
                    onOpenChange={(open) => {
                      setEditingTextId(open ? text.id : null);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-accent rounded-lg"
                      >
                        <Settings className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="max-w-[calc(100vw-2rem)] w-80 max-h-[60vh] overflow-y-auto z-60 bg-card backdrop-blur-xl border border-border shadow-2xl shadow-black/20 rounded-2xl"
                      style={{ scrollbarWidth: "none" }}
                      side="top"
                      align="start"
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
                            className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground resize-none"
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
                            <SelectContent className="bg-popover text-popover-foreground border-border z-100">
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
                              <SelectItem value="Roboto">Roboto</SelectItem>
                              <SelectItem value="Open Sans">
                                Open Sans
                              </SelectItem>
                              <SelectItem value="Lato">Lato</SelectItem>
                              <SelectItem value="Montserrat">
                                Montserrat
                              </SelectItem>
                              <SelectItem value="Poppins">Poppins</SelectItem>
                              <SelectItem value="Nunito">Nunito</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Font Size
                            </Label>
                            <input
                              type="number"
                              value={text.fontSize}
                              onChange={(e) =>
                                props.updateText(text.id, {
                                  fontSize: parseInt(e.target.value),
                                })
                              }
                              min=""
                              max={500}
                              step={1}
                              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
                            />
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
                              <SelectContent className="bg-popover text-popover-foreground border-border z-100">
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Line Height
                            </Label>
                            <input
                              type="number"
                              value={text.lineHeight}
                              onChange={(e) =>
                                props.updateText(text.id, {
                                  lineHeight: parseFloat(e.target.value) || 1.2,
                                })
                              }
                              min={0.5}
                              max={3}
                              step={0.1}
                              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              Letter Spacing
                            </Label>
                            <input
                              type="number"
                              value={text.letterSpacing}
                              onChange={(e) =>
                                props.updateText(text.id, {
                                  letterSpacing:
                                    parseFloat(e.target.value) || 0,
                                })
                              }
                              min={-5}
                              max={10}
                              step={0.1}
                              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Text Align
                          </Label>
                          <Select
                            value={text.textAlign}
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
                            <SelectContent className="bg-popover text-popover-foreground border-border z-100">
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
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Color
                          </Label>
                          <div className="grid grid-cols-6 gap-2">
                            {[
                              "#ffffff",
                              "#f8f9fa",
                              "#e9ecef",
                              "#dee2e6",
                              "#ced4da",
                              "#adb5bd",
                              "#6c757d",
                              "#495057",
                              "#343a40",
                              "#212529",
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
                              "#ffc107",
                              "#dc3545",
                              "#28a745",
                              "#007bff",
                              "#6f42c1",
                              "#e83e8c",
                              "#fd7e14",
                              "#20c997",
                              "#17a2b8",
                            ].map((c) => (
                              <button
                                key={c}
                                onClick={() =>
                                  props.updateText(text.id, { color: c })
                                }
                                className={`h-6 w-6 rounded border cursor-pointer ${
                                  text.color === c
                                    ? "border-primary ring-1 ring-primary/50"
                                    : "border-border"
                                }`}
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                          {/* Manual color input */}
                          <div className="mt-3 space-y-2">
                            <Label className="text-xs text-muted-foreground block">
                              Custom Color
                            </Label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={text.color || "#ffffff"}
                                onChange={(e) =>
                                  props.updateText(text.id, {
                                    color: e.target.value,
                                  })
                                }
                                className="h-8 w-8 rounded border border-border cursor-pointer"
                                title="Color picker"
                              />
                              <input
                                type="text"
                                value={text.color || ""}
                                onChange={(e) =>
                                  props.updateText(text.id, {
                                    color: e.target.value,
                                  })
                                }
                                placeholder="#ffffff, rgb(255,255,255), hsl(0,0%,100%)"
                                className="flex-1 h-8 rounded-md border border-border bg-input px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground"
                                title="Enter color value (hex, rgb, hsl, etc.)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => props.removeText(text.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
    );
  };

  const renderResolutionPopover = (onClose?: () => void) => {
    const resolutionOptions = [
      { id: "hd-720p", name: "HD 1280×720 (16:9)" },
      { id: "hd-1080p", name: "HD 1920×1080 (16:9)" },
      { id: "hd-3-2", name: "HD 1920×1280 (3:2)" },
      { id: "hd-4-3", name: "HD 1920×1440 (4:3)" },
      { id: "4k-uhd", name: "4K UHD 3840×2160 (16:9)" },
      { id: "ig-square", name: "Instagram Square 1080×1080 (1:1)" },
      { id: "ig-portrait-45", name: "Instagram Portrait 1080×1350 (4:5)" },
      {
        id: "story-1080x1920",
        name: "Instagram Stories/Reel 1080×1920 (9:16)",
      },
      { id: "twitter-1500x500", name: "X/Twitter Cover 1500×500 (3:1)" },
      { id: "twitter-1200x675", name: "X/Twitter Post 1200×675 (16:9)" },
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground">
            Resolution Settings
          </h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {resolutionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => props.setSelectedResolution(option.id)}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                props.selectedResolution === option.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="text-sm font-medium">{option.name}</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderZoomPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground">
            Zoom Controls
          </h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Zoom Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Zoom</Label>
            <span className="text-sm text-muted-foreground">{props.zoom}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => props.setZoom(Math.max(75, props.zoom - 10))}
              className="h-8 w-8 p-0 rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            >
              <ChevronDown className="h-4 w-4 text-foreground/80" />
            </Button>
            <Slider
              value={[props.zoom]}
              onValueChange={([v]) => props.setZoom(v)}
              min={75}
              max={564}
              step={1}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => props.setZoom(Math.min(564, props.zoom + 10))}
              className="h-8 w-8 p-0 rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            >
              <ChevronUp className="h-4 w-4 text-foreground/80" />
            </Button>
          </div>
        </div>

        {/* Pan Controls */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Pan Position</Label>
          <div className="text-xs text-muted-foreground">
            X: {props.panX.toFixed(1)}, Y: {props.panY.toFixed(1)}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newY = Math.min(1000, props.panY + 50);
                props.setPanY(newY);
              }}
              className="h-10 rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            >
              <ChevronUp className="h-4 w-4 text-foreground/80" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newX = Math.max(-1000, props.panX - 50);
                props.setPanX(newX);
              }}
              className="h-10 rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-foreground/80" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                props.setPanX(0);
                props.setPanY(0);
              }}
              className="h-10 rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 text-foreground/80" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newX = Math.min(1000, props.panX + 50);
                props.setPanX(newX);
              }}
              className="h-10 rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4 text-foreground/80" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newY = Math.max(-1000, props.panY - 50);
                props.setPanY(newY);
              }}
              className="h-10 rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
            >
              <ChevronDown className="h-4 w-4 text-foreground/80" />
            </Button>
            <div></div>
          </div>
        </div>
      </div>
    );
  };

  const renderPresetsPopover = (onClose?: () => void) => {
    const layoutPresets =
      props.layoutMode === "double"
        ? DOUBLE_LAYOUT_PRESETS
        : SINGLE_LAYOUT_PRESETS;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground">
            Layout Presets
          </h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        <div className="space-y-2">
          {layoutPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                props.setSelectedTemplate(
                  preset.id === props.selectedTemplate ? null : preset.id
                );
                props.setZoom(100);
                props.setPanX(0);
                props.setPanY(0);
              }}
              className={`w-full p-3 rounded-lg border text-left transition-colors ${
                props.selectedTemplate === preset.id
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-muted"
              }`}
            >
              <div className="text-sm font-medium">{preset.name}</div>
            </button>
          ))}
        </div>

        {/* Reset to default */}
        <Button
          variant="outline"
          onClick={() => {
            props.setSelectedTemplate(null);
            props.setZoom(100);
            props.setPanX(0);
            props.setPanY(0);
          }}
          className="w-full rounded-lg bg-muted border-border hover:bg-accent hover:border-primary/50 transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4 mr-2 text-foreground/80" />
          Reset to Default
        </Button>
      </div>
    );
  };

  const renderSpacingPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2">
          <h4 className="font-semibold text-sm text-foreground">
            Canvas Spacing
          </h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Canvas Padding Info */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Canvas Padding
          </Label>
          <div className="p-4 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-2 mb-2">
              <BetweenVerticalStart className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Current: {props.padding}px
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Canvas padding controls the space around your mockup. This setting
              is currently fixed at 60px.
            </p>
          </div>
        </div>

        {/* Mockup Spacing Reference */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground mb-2 block">
            Mockup Spacing
          </Label>
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">
              To adjust spacing between multiple mockups, go to{" "}
              <span className="font-medium text-foreground">
                Layout → Mockups
              </span>{" "}
              and select two mockups layout mode.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderBrandingPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4 max-h-[75vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2">
          <h4 className="font-semibold text-sm text-foreground">Branding</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Upload Image */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Logo / Image
          </Label>
          {props.branding?.url ? (
            <div className="relative group">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={props.branding.url}
                  alt="Branding"
                  width={300}
                  height={169}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <button
                onClick={() => {
                  if (props.branding) {
                    props.setBranding({
                      ...props.branding,
                      url: undefined,
                    });
                  }
                }}
                className="absolute top-2 right-2 h-7 w-7 rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <label
                htmlFor="branding-upload-mobile"
                className="w-full h-24 rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 hover:border-primary/50 text-xs text-foreground cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Logo</span>
              </label>
              <input
                id="branding-upload-mobile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const url = event.target?.result as string;
                      props.setBranding({
                        id: `branding-${Date.now()}`,
                        url,
                        x: 50,
                        y: 50,
                        width: 200,
                        height: 60,
                        opacity: 1,
                        rotation: 0,
                        layout: "vertical",
                        background: "default",
                        badgeMode: "dark",
                        badgeRadius: 12,
                        glassMode: "light",
                        glassRadius: 12,
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </>
          )}
        </div>

        {/* Text Field */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Text (optional)
          </Label>
          <input
            type="text"
            value={props.branding?.text || ""}
            onChange={(e) => {
              if (props.branding) {
                props.setBranding({
                  ...props.branding,
                  text: e.target.value,
                });
              } else if (e.target.value) {
                props.setBranding({
                  id: `branding-${Date.now()}`,
                  text: e.target.value,
                  x: 50,
                  y: 50,
                  width: 200,
                  height: 60,
                  opacity: 1,
                  rotation: 0,
                  layout: "vertical",
                  background: "default",
                  badgeMode: "dark",
                  badgeRadius: 12,
                  glassMode: "light",
                  glassRadius: 12,
                });
              }
            }}
            placeholder="Enter text..."
            className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Layout */}
        {props.branding && (
          <>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Layout
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    props.setBranding({
                      ...props.branding!,
                      layout: "vertical",
                    })
                  }
                  className={`h-16 rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${
                    props.branding.layout === "vertical"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="text-xs font-medium">Vertical</div>
                  <div className="text-xs text-muted-foreground">
                    Image on top
                  </div>
                </button>
                <button
                  onClick={() =>
                    props.setBranding({
                      ...props.branding!,
                      layout: "horizontal",
                    })
                  }
                  className={`h-16 rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center gap-1 transition-colors ${
                    props.branding.layout === "horizontal"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted hover:bg-muted/80"
                  }`}
                >
                  <div className="text-xs font-medium">Horizontal</div>
                  <div className="text-xs text-muted-foreground">
                    Image on left
                  </div>
                </button>
              </div>
            </div>

            {/* Background Style */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Background
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "default", name: "Default", desc: "No background" },
                  { id: "shadow", name: "Shadow", desc: "Subtle shadow" },
                  { id: "glass", name: "Glass", desc: "Glassmorphism" },
                  { id: "badge", name: "Badge", desc: "Solid badge" },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() =>
                      props.setBranding({
                        ...props.branding!,
                        background: bg.id as
                          | "default"
                          | "shadow"
                          | "glass"
                          | "badge",
                      })
                    }
                    className={`h-14 rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center transition-colors ${
                      props.branding && props.branding.background === bg.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <div className="text-xs font-medium">{bg.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {bg.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Badge Configuration */}
            {props.branding.background === "badge" && (
              <div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border">
                <Label className="text-xs text-muted-foreground">
                  Badge Configuration
                </Label>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Mode
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        props.setBranding({
                          ...props.branding!,
                          badgeMode: "light",
                        })
                      }
                      className={`h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-colors ${
                        props.branding.badgeMode === "light"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="text-xs font-medium">Light</div>
                    </button>
                    <button
                      onClick={() =>
                        props.setBranding({
                          ...props.branding!,
                          badgeMode: "dark",
                        })
                      }
                      className={`h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-colors ${
                        !props.branding.badgeMode ||
                        props.branding.badgeMode === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="text-xs font-medium">Dark</div>
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Border Radius
                  </Label>
                  <Slider
                    value={[props.branding.badgeRadius ?? 12]}
                    onValueChange={([v]) =>
                      props.setBranding({
                        ...props.branding!,
                        badgeRadius: v,
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {props.branding.badgeRadius ?? 12}px
                  </div>
                </div>
              </div>
            )}

            {/* Glass Configuration */}
            {props.branding.background === "glass" && (
              <div className="space-y-3 p-3 rounded-lg bg-muted/50 border border-border">
                <Label className="text-xs text-muted-foreground">
                  Glass Configuration
                </Label>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Mode
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        props.setBranding({
                          ...props.branding!,
                          glassMode: "light",
                        })
                      }
                      className={`h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-colors ${
                        !props.branding.glassMode ||
                        props.branding.glassMode === "light"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="text-xs font-medium">Light</div>
                    </button>
                    <button
                      onClick={() =>
                        props.setBranding({
                          ...props.branding!,
                          glassMode: "dark",
                        })
                      }
                      className={`h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center transition-colors ${
                        props.branding.glassMode === "dark"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-muted hover:bg-muted/80"
                      }`}
                    >
                      <div className="text-xs font-medium">Dark</div>
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Border Radius
                  </Label>
                  <Slider
                    value={[props.branding.glassRadius ?? 12]}
                    onValueChange={([v]) =>
                      props.setBranding({
                        ...props.branding!,
                        glassRadius: v,
                      })
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {props.branding.glassRadius ?? 12}px
                  </div>
                </div>
              </div>
            )}

            {/* Opacity */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Opacity
              </Label>
              <Slider
                value={[props.branding.opacity * 100]}
                onValueChange={([v]) =>
                  props.setBranding({
                    ...props.branding!,
                    opacity: v / 100,
                  })
                }
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round(props.branding.opacity * 100)}%
              </div>
            </div>

            {/* Rotation */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Rotation
              </Label>
              <Slider
                value={[props.branding.rotation]}
                onValueChange={([v]) =>
                  props.setBranding({
                    ...props.branding!,
                    rotation: v,
                  })
                }
                min={-180}
                max={180}
                step={1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1">
                {props.branding.rotation}°
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => props.setBranding(undefined)}
              className="w-full h-10 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span className="text-sm font-medium">Remove Branding</span>
            </button>
          </>
        )}

        {!props.branding && (
          <div className="text-center py-8">
            <div className="text-sm text-muted-foreground">
              Upload an image or add text to get started
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDevicePopover = () => {
    return (
      <div
        className="w-full max-h-[80vh] overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="p-2">
          <Tabs
            value={deviceTab}
            onValueChange={setDeviceTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-6 bg-muted overflow-hidden px-1 py-1 mb-3">
              <TabsTrigger
                value="all"
                className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                  deviceTab === "all"
                    ? "bg-primary/20 border-primary"
                    : "bg-transparent"
                }`}
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="phone"
                className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                  deviceTab === "phone"
                    ? "bg-primary/20 border-primary"
                    : "bg-transparent"
                }`}
              >
                Phone
              </TabsTrigger>
              <TabsTrigger
                value="tablet"
                className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                  deviceTab === "tablet"
                    ? "bg-primary/20 border-primary"
                    : "bg-transparent"
                }`}
              >
                Tablet
              </TabsTrigger>
              <TabsTrigger
                value="laptop"
                className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                  deviceTab === "laptop"
                    ? "bg-primary/20 border-primary"
                    : "bg-transparent"
                }`}
              >
                Laptop
              </TabsTrigger>
              <TabsTrigger
                value="desktop"
                className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                  deviceTab === "desktop"
                    ? "bg-primary/20 border-primary"
                    : "bg-transparent"
                }`}
              >
                Desktop
              </TabsTrigger>
              <TabsTrigger
                value="browser"
                className={`text-xs text-foreground cursor-pointer z-10 transition-colors ${
                  deviceTab === "browser"
                    ? "bg-primary/20 border-primary"
                    : "bg-transparent"
                }`}
              >
                Browser
              </TabsTrigger>
            </TabsList>

            {/* All Tab */}
            <TabsContent value="all" className="mt-2">
              <div className="grid grid-cols-3 gap-2">
                <DeviceButton
                  deviceKey="screenshot"
                  isSelected={props.selectedDevice === "screenshot"}
                  onClick={() => props.setSelectedDevice("screenshot")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="iphone-17-pro"
                  isSelected={props.selectedDevice === "iphone-17-pro"}
                  onClick={() => props.setSelectedDevice("iphone-17-pro")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="iphone-17-pro-max"
                  isSelected={props.selectedDevice === "iphone-17-pro-max"}
                  onClick={() => props.setSelectedDevice("iphone-17-pro-max")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="ipad-pro"
                  isSelected={props.selectedDevice === "ipad-pro"}
                  onClick={() => props.setSelectedDevice("ipad-pro")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="macbook-pro"
                  isSelected={props.selectedDevice === "macbook-pro"}
                  onClick={() => props.setSelectedDevice("macbook-pro")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="safari"
                  isSelected={props.selectedDevice === "safari"}
                  onClick={() => props.setSelectedDevice("safari")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="chrome"
                  isSelected={props.selectedDevice === "chrome"}
                  onClick={() => props.setSelectedDevice("chrome")}
                  shouldLoadImages={imagesLoaded}
                />
              </div>
            </TabsContent>

            {/* Phone Tab */}
            <TabsContent value="phone" className="mt-2">
              <div className="grid grid-cols-3 gap-2">
                <DeviceButton
                  deviceKey="iphone-17-pro"
                  isSelected={props.selectedDevice === "iphone-17-pro"}
                  onClick={() => props.setSelectedDevice("iphone-17-pro")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="iphone-17-pro-max"
                  isSelected={props.selectedDevice === "iphone-17-pro-max"}
                  onClick={() => props.setSelectedDevice("iphone-17-pro-max")}
                  shouldLoadImages={imagesLoaded}
                />
              </div>
            </TabsContent>

            {/* Tablet Tab */}
            <TabsContent value="tablet" className="mt-2">
              <div className="grid grid-cols-3 gap-2">
                <DeviceButton
                  deviceKey="ipad-pro"
                  isSelected={props.selectedDevice === "ipad-pro"}
                  onClick={() => props.setSelectedDevice("ipad-pro")}
                  shouldLoadImages={imagesLoaded}
                />
              </div>
            </TabsContent>

            {/* Laptop Tab */}
            <TabsContent value="laptop" className="mt-2">
              <div className="grid grid-cols-3 gap-2">
                <DeviceButton
                  deviceKey="macbook-pro"
                  isSelected={props.selectedDevice === "macbook-pro"}
                  onClick={() => props.setSelectedDevice("macbook-pro")}
                  shouldLoadImages={imagesLoaded}
                />
              </div>
            </TabsContent>

            {/* Desktop Tab */}
            <TabsContent value="desktop" className="mt-2">
              <div className="text-xs text-muted-foreground text-center py-4">
                No desktop devices available yet
              </div>
            </TabsContent>

            {/* Browser Tab */}
            <TabsContent value="browser" className="mt-2">
              <div className="grid grid-cols-3 gap-2">
                <DeviceButton
                  deviceKey="safari"
                  isSelected={props.selectedDevice === "safari"}
                  onClick={() => props.setSelectedDevice("safari")}
                  shouldLoadImages={imagesLoaded}
                />
                <DeviceButton
                  deviceKey="chrome"
                  isSelected={props.selectedDevice === "chrome"}
                  onClick={() => props.setSelectedDevice("chrome")}
                  shouldLoadImages={imagesLoaded}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      suppressHydrationWarning
    >
      {/* Main Navigation Bar - Base layer */}
      <MainNavigationBar
        activeMainSection={activeMainSection}
        onSectionClick={setActiveMainSection}
        layoutMode={props.layoutMode}
      />

      {/* Secondary Navigation Bar - Above main bar in position */}
      <div
        className="absolute bottom-12 left-0 right-0"
        suppressHydrationWarning
      >
        <SecondaryNavigationBar
          activeMainSection={activeMainSection}
          activeSecondarySection={activeSecondarySection}
          onSecondaryClick={setActiveSecondarySection}
          renderSecondaryContent={renderSecondaryContent}
          isShadowPreviewMode={
            activeSecondarySection === "shadow" && shadowPreviewMode
          }
        />
      </div>
    </div>
  );
}
