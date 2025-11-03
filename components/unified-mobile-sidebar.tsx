"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import {
  MainNavigationBar,
  SecondaryNavigationBar,
  MediaUploader,
  BrowserStyleSelector,
} from "./unified-mobile-sidebar/index";

// Device display names and info
const deviceDisplayNames: Record<string, string> = {
  screenshot: "Screenshot - Adapts to media",
  "iphone-17-pro": "iPhone 17 Pro - 1206×2622px",
  "iphone-17-pro-max": "iPhone 17 Pro Max - 1320×2868px",
  "ipad-pro": "iPad Pro 13 - 2048×2732px",
  "macbook-pro": "MacBook Pro 16 - 2560×1600px",
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
                    unoptimized
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
                    unoptimized
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
                    unoptimized
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
                    unoptimized
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
                    unoptimized
                    loading="lazy"
                    priority={false}
                  />
                )}
                {deviceKey === "ipad-pro" && (
                  <Image
                    src="/ipad-pro-13-thumbnail.png"
                    alt="iPad Pro thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    unoptimized
                    loading="lazy"
                    priority={false}
                  />
                )}
                {deviceKey === "macbook-pro" && (
                  <Image
                    src="/macbook-pro-16-thumbnail.png"
                    alt="MacBook Pro 16 thumbnail"
                    width={96}
                    height={96}
                    className="rounded-md object-contain"
                    unoptimized
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
    | "image";
  setBackgroundType: (
    type: UnifiedMobileSidebarProps["backgroundType"]
  ) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundImage?: string | undefined;
  setBackgroundImage: (img: string | undefined) => void;
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;
  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid";
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
  layoutMode: "single" | "double" | "triple";
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

  // Control props
  isOpen: boolean;
  onClose: () => void;
}

type MainSection = "mockup" | "frame" | "layout";

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

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Device menu state management
  useEffect(() => {
    if (activeSecondarySection === "device") {
      const timer = setTimeout(() => {
        setImagesLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setImagesLoaded(false);
    }
  }, [activeSecondarySection]);

  if (!props.isOpen) return null;

  const renderSecondaryContent = (buttonId: string) => {
    switch (buttonId) {
      case "device":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Device Selection</h4>
              <button
                onClick={() => setActiveSecondarySection(null)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-white/60 hover:text-white" />
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
      default:
        return <div>Content not available</div>;
    }
  };

  const renderBorderPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Border Configuration</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-white/60 hover:text-white" />
            </button>
          )}
        </div>

        {/* Device Style */}
        <div className="space-y-2">
          <Label className="text-xs font-medium">Border Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["default", "glass-light", "glass-dark", "liquid"] as const).map(
              (style) => (
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
              )
            )}
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
            <h3 className="text-lg font-semibold">Background Settings</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-white/60 hover:text-white" />
              </button>
            )}
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
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
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
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
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
                      className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
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
                        src={`/cosmic-gradient-${num}.png`}
                        alt={`Cosmic ${num}`}
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
                    className={`h-8 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${
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
                  <div className="grid grid-cols-4 gap-2">
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
                          src={`/cosmic-gradient-${num}.png`}
                          alt={`Cosmic ${num}`}
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
                    className={`h-8 rounded border-2 cursor-pointer flex items-center justify-center transition-all duration-200 ${
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
                  <div className="grid grid-cols-4 gap-2">
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
            </TabsContent>

            {/* Image Tab */}
            <TabsContent value="image" className="mt-4">
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
          <h4 className="font-semibold text-sm">Effects</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-white/60 hover:text-white" />
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

  const renderShadowPopover = (onClose?: () => void) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Shadow Settings</h4>
          <div className="flex items-center gap-2">
            {/* Preview Mode Toggle - only show in custom mode */}
            {props.shadowMode === "custom" && (
              <button
                onClick={() => setShadowPreviewMode(!shadowPreviewMode)}
                className={`p-1 rounded-lg transition-colors ${
                  shadowPreviewMode
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-white/10 text-white/60 hover:text-white"
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
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-white/60 hover:text-white" />
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
                        : "border-white/20"
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
            <h4 className="font-semibold text-sm">Text Overlays</h4>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="h-4 w-4 text-white/60 hover:text-white" />
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
            className="w-full rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2 text-white/80" />
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
                        className="h-6 w-6 p-0 hover:bg-white/10 rounded-lg"
                      >
                        <Settings className="h-3 w-3 text-white/60 hover:text-white transition-colors" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="max-w-[calc(100vw-2rem)] w-80 max-h-[60vh] overflow-y-auto z-60 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20 rounded-2xl"
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
                                    : "border-white/20"
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
          <h4 className="font-semibold text-sm">Resolution Settings</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-white/60 hover:text-white" />
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
          <h4 className="font-semibold text-sm">Zoom Controls</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-white/60 hover:text-white" />
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
              className="h-8 w-8 p-0 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronDown className="h-4 w-4 text-white/80" />
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
              className="h-8 w-8 p-0 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronUp className="h-4 w-4 text-white/80" />
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
              className="h-10 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronUp className="h-4 w-4 text-white/80" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newX = Math.max(-1000, props.panX - 50);
                props.setPanX(newX);
              }}
              className="h-10 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-white/80" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                props.setPanX(0);
                props.setPanY(0);
              }}
              className="h-10 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4 text-white/80" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newX = Math.min(1000, props.panX + 50);
                props.setPanX(newX);
              }}
              className="h-10 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4 text-white/80" />
            </Button>
            <div></div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newY = Math.max(-1000, props.panY - 50);
                props.setPanY(newY);
              }}
              className="h-10 rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              <ChevronDown className="h-4 w-4 text-white/80" />
            </Button>
            <div></div>
          </div>
        </div>
      </div>
    );
  };

  const renderPresetsPopover = (onClose?: () => void) => {
    const layoutPresets = [
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

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Layout Presets</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-white/60 hover:text-white" />
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
          className="w-full rounded-lg bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4 mr-2 text-white/80" />
          Reset to Default
        </Button>
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
