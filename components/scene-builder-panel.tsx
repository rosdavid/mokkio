// components/scene-builder-panel.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2, GripVertical, ChevronDown, Upload } from "lucide-react";
import type { DeviceScene } from "@/types/scene-builder";
import { getDeviceDisplayName, createDeviceScene } from "@/types/scene-builder";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Device display names and info
const deviceDisplayNames: Record<string, string> = {
  screenshot: "Screenshot - Adapts to media",
  "iphone-17-pro": "iPhone 17 Pro - 1206×2622px",
  "iphone-17-pro-max": "iPhone 17 Pro Max - 1320×2868px",
  "ipad-pro-13": "iPad Pro 13 - 2048×2732px",
  "macbook-pro-16": "MacBook Pro 16 - 2560×1600px",
  safari: "Safari - Adapts to media",
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

// Device badges configuration
const deviceBadges: Record<string, { badge?: string }> = {
  "ipad-pro-13": { badge: "NEW" },
  "iphone-17-pro": { badge: "NEW" },
  "iphone-17-pro-max": { badge: "NEW" },
  "macbook-pro-16": { badge: "NEW" },
  chrome: { badge: "NEW" },
  safari: { badge: "NEW" },
};

interface SceneBuilderPanelProps {
  scenes: DeviceScene[];
  onScenesChange: (scenes: DeviceScene[]) => void;
  availableImages: (string | null)[];
  onImageUpload?: (
    e: React.ChangeEvent<HTMLInputElement>,
    sceneId: string
  ) => void;

  // Global configuration props (for reference/defaults)
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
  borderRadius: number;
  setBorderRadius: (radius: number) => void;
  setBorderRadiusImmediate: (radius: number) => void;
}

export function SceneBuilderPanel({
  scenes,
  onScenesChange,
  // availableImages, // Not currently used
  onImageUpload,
  shadowType,
  setShadowType,
  shadowOpacity,
  setShadowOpacity,
  setShadowOpacityImmediate,
  shadowMode,
  setShadowMode,
  shadowOffsetX,
  setShadowOffsetX,
  setShadowOffsetXImmediate,
  shadowOffsetY,
  setShadowOffsetY,
  setShadowOffsetYImmediate,
  shadowBlur,
  setShadowBlur,
  setShadowBlurImmediate,
  shadowSpread,
  setShadowSpread,
  setShadowSpreadImmediate,
  shadowColor,
  setShadowColor,
  borderRadius,
  setBorderRadius,
  setBorderRadiusImmediate,
}: SceneBuilderPanelProps) {
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>(null);
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const [deviceSelectOpen, setDeviceSelectOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [deviceTab, setDeviceTab] = useState("all");
  const [expandedConfigSections, setExpandedConfigSections] = useState<
    Record<string, Record<string, boolean>>
  >({});

  const toggleConfigSection = (sceneId: string, section: string) => {
    setExpandedConfigSections((prev) => ({
      ...prev,
      [sceneId]: {
        ...(prev[sceneId] || {}),
        [section]: !(prev[sceneId]?.[section] ?? false),
      },
    }));
  };

  const isConfigSectionExpanded = (sceneId: string, section: string) => {
    return expandedConfigSections[sceneId]?.[section] ?? false;
  };

  // Load images after menu opens with a small delay
  useEffect(() => {
    if (isDeviceMenuOpen) {
      const timer = setTimeout(() => {
        setImagesLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setImagesLoaded(false);
    }
  }, [isDeviceMenuOpen]);

  // DeviceButton Component
  const DeviceButton = React.memo(
    ({
      deviceKey,
      onClick,
      shouldLoadImages = true,
    }: {
      deviceKey: string;
      onClick: () => void;
      shouldLoadImages?: boolean;
    }) => {
      const { name, resolution } = getDeviceInfo(deviceKey);
      const deviceConfig = deviceBadges[deviceKey] || {};
      return (
        <div className="relative">
          <button
            onClick={onClick}
            className="w-44 h-44 flex flex-col items-center justify-center p-3 rounded-lg border text-center cursor-pointer transition-all duration-200 border-border bg-muted hover:bg-muted/80"
          >
            <div className="flex-1 flex items-center justify-center mb-2 min-h-10">
              {shouldLoadImages && (
                <>
                  {deviceKey === "screenshot" && (
                    <Image
                      src="/davidros.vercel.app.webp"
                      alt="Screenshot thumbnail"
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
                  {deviceKey === "ipad-pro-13" && (
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
                  {deviceKey === "macbook-pro-16" && (
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
          {deviceConfig.badge && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold p-1 rounded-md border border-border pointer-events-none">
              {deviceConfig.badge}
            </div>
          )}
        </div>
      );
    }
  );
  DeviceButton.displayName = "DeviceButton";

  const handleAddDevice = (deviceType: string) => {
    const newScene = createDeviceScene(deviceType);
    onScenesChange([...scenes, newScene]);
  };

  const handleRemoveScene = (sceneId: string) => {
    onScenesChange(scenes.filter((s) => s.id !== sceneId));
  };

  const handleUpdateScene = (
    sceneId: string,
    updates: Partial<DeviceScene>
  ) => {
    onScenesChange(
      scenes.map((s) => (s.id === sceneId ? { ...s, ...updates } : s))
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Scene Builder</h2>
        <p className="text-xs text-muted-foreground">
          Create your own multi-device mockups
        </p>
      </div>

      {/* Add Device Section */}
      <div className="p-4">
        <Label className="text-sm font-medium mb-2 block">Add Device</Label>
        <Select
          onValueChange={(value) => {
            handleAddDevice(value);
            setDeviceSelectOpen(false);
            setIsDeviceMenuOpen(false);
          }}
          open={deviceSelectOpen}
          onOpenChange={(open) => {
            setDeviceSelectOpen(open);
            setIsDeviceMenuOpen(open);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select device type..." />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Tabs
                value={deviceTab}
                onValueChange={setDeviceTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-5 bg-muted overflow-hidden px-1 py-1 mb-3">
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
                </TabsList>

                {/* All Tab */}
                <TabsContent value="all" className="mt-2">
                  <div className="grid grid-cols-3 gap-2">
                    <DeviceButton
                      deviceKey="screenshot"
                      onClick={() => handleAddDevice("screenshot")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="iphone-17-pro"
                      onClick={() => handleAddDevice("iphone-17-pro")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="iphone-17-pro-max"
                      onClick={() => handleAddDevice("iphone-17-pro-max")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="ipad-pro-13"
                      onClick={() => handleAddDevice("ipad-pro-13")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="macbook-pro-16"
                      onClick={() => handleAddDevice("macbook-pro-16")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="safari"
                      onClick={() => handleAddDevice("safari")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="chrome"
                      onClick={() => handleAddDevice("chrome")}
                      shouldLoadImages={imagesLoaded}
                    />
                  </div>
                </TabsContent>

                {/* Phone Tab */}
                <TabsContent value="phone" className="mt-2">
                  <div className="grid grid-cols-3 gap-2">
                    <DeviceButton
                      deviceKey="iphone-17-pro"
                      onClick={() => handleAddDevice("iphone-17-pro")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="iphone-17-pro-max"
                      onClick={() => handleAddDevice("iphone-17-pro-max")}
                      shouldLoadImages={imagesLoaded}
                    />
                  </div>
                </TabsContent>

                {/* Tablet Tab */}
                <TabsContent value="tablet" className="mt-2">
                  <div className="grid grid-cols-3 gap-2">
                    <DeviceButton
                      deviceKey="ipad-pro-13"
                      onClick={() => handleAddDevice("ipad-pro-13")}
                      shouldLoadImages={imagesLoaded}
                    />
                  </div>
                </TabsContent>

                {/* Laptop Tab */}
                <TabsContent value="laptop" className="mt-2">
                  <div className="grid grid-cols-3 gap-2">
                    <DeviceButton
                      deviceKey="macbook-pro-16"
                      onClick={() => handleAddDevice("macbook-pro-16")}
                      shouldLoadImages={imagesLoaded}
                    />
                  </div>
                </TabsContent>

                {/* Browser Tab */}
                <TabsContent value="browser" className="mt-2">
                  <div className="grid grid-cols-3 gap-2">
                    <DeviceButton
                      deviceKey="safari"
                      onClick={() => handleAddDevice("safari")}
                      shouldLoadImages={imagesLoaded}
                    />
                    <DeviceButton
                      deviceKey="chrome"
                      onClick={() => handleAddDevice("chrome")}
                      shouldLoadImages={imagesLoaded}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </SelectContent>
        </Select>
      </div>

      {/* Global Configurations */}
      <div className="bg-card p-3 mx-4 mt-4 rounded-lg border border-border">
        <button
          onClick={() => toggleConfigSection("global", "shadow")}
          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          <span>GLOBAL CONFIGURATIONS</span>
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              isConfigSectionExpanded("global", "shadow") ? "" : "-rotate-90"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isConfigSectionExpanded("global", "shadow")
              ? "max-h-[600px] opacity-100 mt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              These settings affect all devices in the scene
            </p>

            {/* SHADOW */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <Label className="text-xs font-medium mb-2 block">SHADOW</Label>
              <div className="space-y-3">
                {/* Toggle Presets/Custom */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShadowMode?.("presets")}
                    className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
                      shadowMode === "presets"
                        ? "border-primary bg-primary/20"
                        : "border-border bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    onClick={() => setShadowMode?.("custom")}
                    className={`flex-1 h-8 rounded-lg border text-xs text-foreground cursor-pointer ${
                      shadowMode === "custom"
                        ? "border-primary bg-primary/20"
                        : "border-border bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* PRESETS */}
                {shadowMode !== "custom" ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      {["none", "spread", "hug", "adaptive"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setShadowType(type)}
                          className={`h-8 rounded-lg border text-xs capitalize text-foreground cursor-pointer ${
                            shadowType === type
                              ? "border-primary bg-primary/20"
                              : "border-border bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Opacity */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">
                          Opacity
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {shadowOpacity}%
                        </span>
                      </div>
                      <Slider
                        value={[shadowOpacity]}
                        onValueChange={([v]) => setShadowOpacityImmediate(v)}
                        onValueCommit={([v]) => setShadowOpacity(v)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </>
                ) : (
                  /* CUSTOM */
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-muted-foreground">
                          Offset X
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {shadowOffsetX ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[shadowOffsetX ?? 0]}
                        onValueChange={([v]) => setShadowOffsetXImmediate?.(v)}
                        onValueCommit={([v]) => setShadowOffsetX?.(v)}
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
                          {shadowOffsetY ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[shadowOffsetY ?? 0]}
                        onValueChange={([v]) => setShadowOffsetYImmediate?.(v)}
                        onValueCommit={([v]) => setShadowOffsetY?.(v)}
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
                          {shadowBlur ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[shadowBlur ?? 0]}
                        onValueChange={([v]) => setShadowBlurImmediate?.(v)}
                        onValueCommit={([v]) => setShadowBlur?.(v)}
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
                          {shadowSpread ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[shadowSpread ?? 0]}
                        onValueChange={([v]) => setShadowSpreadImmediate?.(v)}
                        onValueCommit={([v]) => setShadowSpread?.(v)}
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
                          {shadowOpacity}%
                        </span>
                      </div>
                      <Slider
                        value={[shadowOpacity]}
                        onValueChange={([v]) => setShadowOpacityImmediate(v)}
                        onValueCommit={([v]) => setShadowOpacity(v)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Color palette */}
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        Color
                      </Label>
                      <div className="flex flex-row flex-wrap gap-2">
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
                            onClick={() => setShadowColor?.(c)}
                            className={`h-6 w-6 rounded border cursor-pointer ${
                              (shadowColor || "#000000") === c
                                ? "border-purple-500 ring-1 ring-purple-500/50"
                                : "border-white/20"
                            }`}
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Devices List - Increased height */}
      <div
        className="overflow-y-auto p-4 space-y-2"
        style={{ minHeight: "600px", maxHeight: "calc(100vh - 400px)" }}
      >
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">
            Devices in Scene ({scenes.length})
          </Label>
        </div>

        {scenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No devices yet.
              <br />
              Add a device or choose a preset above.
            </p>
          </div>
        ) : (
          scenes.map((scene) => (
            <Collapsible
              key={scene.id}
              open={expandedSceneId === scene.id}
              onOpenChange={(open) =>
                setExpandedSceneId(open ? scene.id : null)
              }
            >
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                {/* Scene Header */}
                <div className="flex items-center gap-2 p-3 bg-muted/30">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {getDeviceDisplayName(scene.device)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Position: {Math.round(scene.position.x)},{" "}
                      {Math.round(scene.position.y)} • Scale: {scene.scale}%
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <label
                      className="inline-flex items-center justify-center h-7 w-7 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      title="Upload image"
                    >
                      <Upload className="h-3 w-3" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (onImageUpload) {
                            onImageUpload(e, scene.id);
                          }
                        }}
                      />
                    </label>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 cursor-pointer"
                      >
                        <ChevronDown
                          className={`h-3 w-3 transition-transform ${
                            expandedSceneId === scene.id ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive cursor-pointer"
                      onClick={() => handleRemoveScene(scene.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Scene Settings (Collapsible) */}
                <CollapsibleContent>
                  <div className="p-3 space-y-4 bg-background">
                    {/* Scale */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Scale</Label>
                        <span className="text-xs text-muted-foreground">
                          {scene.scale}%
                        </span>
                      </div>
                      <Slider
                        value={[scene.scale]}
                        onValueChange={([value]) =>
                          handleUpdateScene(scene.id, { scale: value })
                        }
                        min={30}
                        max={400}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    {/* Rotation */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Rotation</Label>
                        <span className="text-xs text-muted-foreground">
                          {scene.rotation}°
                        </span>
                      </div>
                      <Slider
                        value={[scene.rotation]}
                        onValueChange={([value]) =>
                          handleUpdateScene(scene.id, { rotation: value })
                        }
                        min={-45}
                        max={45}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Z-Index */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Layer Order</Label>
                        <span className="text-xs text-muted-foreground">
                          {scene.zIndex}
                        </span>
                      </div>
                      <Slider
                        value={[scene.zIndex]}
                        onValueChange={([value]) =>
                          handleUpdateScene(scene.id, { zIndex: value })
                        }
                        min={1}
                        max={10}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">X Position</Label>
                        <input
                          type="number"
                          value={Math.round(scene.position.x)}
                          onChange={(e) =>
                            handleUpdateScene(scene.id, {
                              position: {
                                ...scene.position,
                                x: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full h-8 px-2 text-xs border border-border rounded-md bg-background"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Y Position</Label>
                        <input
                          type="number"
                          value={Math.round(scene.position.y)}
                          onChange={(e) =>
                            handleUpdateScene(scene.id, {
                              position: {
                                ...scene.position,
                                y: Number(e.target.value),
                              },
                            })
                          }
                          className="w-full h-8 px-2 text-xs border border-border rounded-md bg-background"
                        />
                      </div>
                    </div>

                    {/* Device Style Section */}
                    {/* Site URL - ONLY FOR BROWSERS */}
                    {["safari", "chrome"].includes(scene.device) && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <button
                          onClick={() =>
                            toggleConfigSection(scene.id, "siteUrl")
                          }
                          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          SITE URL
                          <ChevronDown
                            className={`h-3 w-3 transition-transform duration-200 ${
                              isConfigSectionExpanded(scene.id, "siteUrl")
                                ? ""
                                : "-rotate-90"
                            }`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isConfigSectionExpanded(scene.id, "siteUrl")
                              ? "max-h-32 opacity-100 mt-2"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <input
                            type="text"
                            value={scene.siteUrl || ""}
                            onChange={(e) =>
                              handleUpdateScene(scene.id, {
                                siteUrl: e.target.value,
                              })
                            }
                            placeholder="yourwebsite.com"
                            className="w-full h-8 px-2 text-xs border border-border rounded-md bg-background"
                          />
                        </div>
                      </div>
                    )}

                    {/* Device Frame - ONLY FOR DEVICES WITH PHYSICAL FRAMES */}
                    {[
                      "safari",
                      "chrome",
                      "iphone-17-pro",
                      "iphone-17-pro-max",
                      "ipad-pro-13",
                      "macbook-pro-16",
                    ].includes(scene.device) && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <button
                          onClick={() =>
                            toggleConfigSection(scene.id, "deviceFrame")
                          }
                          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          DEVICE FRAME
                          <ChevronDown
                            className={`h-3 w-3 transition-transform duration-200 ${
                              isConfigSectionExpanded(scene.id, "deviceFrame")
                                ? ""
                                : "-rotate-90"
                            }`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isConfigSectionExpanded(scene.id, "deviceFrame")
                              ? "max-h-96 opacity-100 mt-2"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="space-y-2">
                            {/* Browser Mode / Device Color */}
                            {["safari", "chrome"].includes(scene.device) ? (
                              /* Browser Light/Dark Mode */
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "light",
                                    })
                                  }
                                  className={`h-8 rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") === "light"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  Light
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "dark",
                                    })
                                  }
                                  className={`h-8 rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") === "dark"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  Dark
                                </button>
                              </div>
                            ) : scene.device === "iphone-17-pro" ||
                              scene.device === "iphone-17-pro-max" ? (
                              /* iPhone Options */
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "display",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") ===
                                    "display"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/iphone-17-pro-display-thumbnail.png"
                                      alt="Display"
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "bottom",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Display
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "blue",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") === "blue"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/iphone-17-pro-thumbnail.png"
                                      alt="Blue"
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Blue
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "silver",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") ===
                                    "silver"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/iphone-17-pro-silver-thumbnail.png"
                                      alt="Silver"
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Silver
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "orange",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") ===
                                    "orange"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/iphone-17-pro-orange-thumbnail.png"
                                      alt="Orange"
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Orange
                                </button>
                              </div>
                            ) : scene.device === "ipad-pro-13" ? (
                              /* iPad Options */
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "display",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") ===
                                    "display"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/ipad-pro-13-display-thumbnail.png"
                                      alt="Display"
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Display
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "gray",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") === "gray"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/ipad-pro-13-thumbnail.png"
                                      alt="Gray"
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Gray
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "silver",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") ===
                                    "silver"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/ipad-pro-13-thumbnail.png"
                                      alt="Silver"
                                      width={40}
                                      height={40}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Silver
                                </button>
                              </div>
                            ) : scene.device === "macbook-pro-16" ? (
                              /* MacBook Options */
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "display",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") ===
                                    "display"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/macbook-pro-16-display-thumbnail.png"
                                      alt="Display"
                                      width={32}
                                      height={32}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Display
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      browserMode: "silver",
                                    })
                                  }
                                  className={`h-16 flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer ${
                                    (scene.browserMode || "display") ===
                                    "silver"
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  <div
                                    style={{
                                      width: 40,
                                      height: 24,
                                      overflow: "hidden",
                                    }}
                                    className="mb-1"
                                  >
                                    <Image
                                      src="/macbook-pro-16-thumbnail.png"
                                      alt="Silver"
                                      width={32}
                                      height={32}
                                      style={{
                                        objectFit: "cover",
                                        objectPosition: "top",
                                      }}
                                      unoptimized
                                    />
                                  </div>
                                  Silver
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Border Style - ONLY FOR SCREENSHOT */}
                    {scene.device === "screenshot" && (
                      <div className="space-y-2 pt-2 border-t border-border">
                        <button
                          onClick={() =>
                            toggleConfigSection(scene.id, "borderStyle")
                          }
                          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          BORDER STYLE
                          <ChevronDown
                            className={`h-3 w-3 transition-transform duration-200 ${
                              isConfigSectionExpanded(scene.id, "borderStyle")
                                ? ""
                                : "-rotate-90"
                            }`}
                          />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isConfigSectionExpanded(scene.id, "borderStyle")
                              ? "max-h-96 opacity-100 mt-2"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="space-y-2">
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
                                  onClick={() =>
                                    handleUpdateScene(scene.id, {
                                      deviceStyle: style,
                                    })
                                  }
                                  className={`h-8 rounded-lg border text-xs capitalize cursor-pointer ${
                                    (scene.deviceStyle || "default") === style
                                      ? "border-primary bg-primary/20"
                                      : "border-border bg-muted hover:bg-muted/80"
                                  }`}
                                >
                                  {style.replace("-", " ")}
                                </button>
                              ))}
                            </div>

                            {/* Edge Thickness */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs">Edge</Label>
                                <span className="text-xs text-muted-foreground">
                                  {scene.styleEdge || 16}px
                                </span>
                              </div>
                              <Slider
                                value={[scene.styleEdge || 16]}
                                onValueChange={([value]) =>
                                  handleUpdateScene(scene.id, {
                                    styleEdge: value,
                                  })
                                }
                                min={0}
                                max={64}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BORDER RADIUS - Only for browsers and screenshot */}
                    {!scene.device.includes("iphone") &&
                      scene.device !== "ipad-pro-13" &&
                      scene.device !== "macbook-pro-16" && (
                        <div className="space-y-2 pt-2 border-t border-border">
                          <button
                            onClick={() =>
                              toggleConfigSection(scene.id, "borderRadius")
                            }
                            className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
                          >
                            BORDER RADIUS
                            <ChevronDown
                              className={`h-3 w-3 transition-transform duration-200 ${
                                isConfigSectionExpanded(
                                  scene.id,
                                  "borderRadius"
                                )
                                  ? ""
                                  : "-rotate-90"
                              }`}
                            />
                          </button>

                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isConfigSectionExpanded(scene.id, "borderRadius")
                                ? "max-h-32 opacity-100 mt-2"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { type: "sharp", radius: 0 },
                                  { type: "curved", radius: 20 },
                                  { type: "round", radius: 40 },
                                ].map(({ type, radius: r }) => (
                                  <button
                                    key={type}
                                    onClick={() => setBorderRadius(r)}
                                    className={`h-8 rounded-lg border text-xs capitalize text-foreground cursor-pointer ${
                                      Math.abs(borderRadius - r) <= 10
                                        ? "border-primary bg-primary/20"
                                        : "border-border bg-muted hover:bg-muted/80"
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>

                              {/* Slider */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <Label className="text-xs text-muted-foreground">
                                    Radius
                                  </Label>
                                  <span className="text-xs text-muted-foreground">
                                    {borderRadius}px
                                  </span>
                                </div>
                                <Slider
                                  value={[borderRadius]}
                                  onValueChange={([v]) =>
                                    setBorderRadiusImmediate(v)
                                  }
                                  onValueCommit={([v]) => setBorderRadius(v)}
                                  min={0}
                                  max={40}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
}
