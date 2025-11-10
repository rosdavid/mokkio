"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { DeviceScene } from "@/types/scene-builder";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Device display names and info with resolutions
const deviceDisplayNames: Record<string, string> = {
  screenshot: "Screenshot - Adapts to media",
  "iphone-17-pro": "iPhone 17 Pro - 1206×2622px",
  "iphone-17-pro-max": "iPhone 17 Pro Max - 1320×2868px",
  "ipad-pro-13": "iPad Pro 13 - 2048×2732px",
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

interface SceneBuilderMobileProps {
  scenes: DeviceScene[];
  onScenesChange: (scenes: DeviceScene[]) => void;
  availableImages: (string | null)[];
  onImageUpload?: (
    e: React.ChangeEvent<HTMLInputElement>,
    sceneId: string
  ) => void;
  onClose: () => void;

  // Global configuration props
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
  siteUrl?: string;
  setSiteUrl?: (url: string) => void;
}

export function SceneBuilderMobile({
  scenes,
  onScenesChange,
  // availableImages, // Not currently used - devices added via separate "Devices" section
  // onImageUpload, // Not currently used
  onClose,
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
  // shadowColor, // Not currently used
  // setShadowColor, // Not currently used
  borderRadius,
  setBorderRadius,
  setBorderRadiusImmediate,
  siteUrl,
  setSiteUrl,
}: SceneBuilderMobileProps) {
  const [expandedConfigSections, setExpandedConfigSections] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [showGlobalConfig, setShowGlobalConfig] = useState(false);
  const [expandedDevices, setExpandedDevices] = useState<
    Record<string, boolean>
  >({});

  const toggleDeviceExpansion = (sceneId: string) => {
    setExpandedDevices((prev) => ({
      ...prev,
      [sceneId]: prev[sceneId] === false ? true : false,
    }));
  };

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

  const handleRemoveDevice = (sceneId: string) => {
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

  // Global Configurations Section
  const renderGlobalConfig = () => (
    <Collapsible
      open={showGlobalConfig}
      onOpenChange={setShowGlobalConfig}
      className="mb-4 rounded-lg border border-border bg-muted/30"
    >
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
          <span className="text-sm font-semibold">Global Configurations</span>
          {showGlobalConfig ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 space-y-4">
        {/* Shadow Configuration */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">Shadow</Label>
          <Tabs
            value={shadowMode || "presets"}
            onValueChange={(val) =>
              setShadowMode?.(val as "presets" | "custom")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="presets" className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-2">
                {["none", "spread", "hug", "adaptive"].map((type) => (
                  <Button
                    key={type}
                    variant={shadowType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShadowType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
              {shadowType !== "none" && (
                <div>
                  <Label className="text-xs">Opacity</Label>
                  <Slider
                    value={[shadowOpacity]}
                    onValueChange={(vals) => setShadowOpacity(vals[0])}
                    onValueCommit={(vals) => setShadowOpacityImmediate(vals[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {shadowOpacity}%
                  </span>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-3 mt-3">
              <div>
                <Label className="text-xs">Offset X</Label>
                <Slider
                  value={[shadowOffsetX || 0]}
                  onValueChange={(vals) => setShadowOffsetX?.(vals[0])}
                  onValueCommit={(vals) => setShadowOffsetXImmediate?.(vals[0])}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {shadowOffsetX || 0}px
                </span>
              </div>
              <div>
                <Label className="text-xs">Offset Y</Label>
                <Slider
                  value={[shadowOffsetY || 0]}
                  onValueChange={(vals) => setShadowOffsetY?.(vals[0])}
                  onValueCommit={(vals) => setShadowOffsetYImmediate?.(vals[0])}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {shadowOffsetY || 0}px
                </span>
              </div>
              <div>
                <Label className="text-xs">Blur</Label>
                <Slider
                  value={[shadowBlur || 0]}
                  onValueChange={(vals) => setShadowBlur?.(vals[0])}
                  onValueCommit={(vals) => setShadowBlurImmediate?.(vals[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {shadowBlur || 0}px
                </span>
              </div>
              <div>
                <Label className="text-xs">Spread</Label>
                <Slider
                  value={[shadowSpread || 0]}
                  onValueChange={(vals) => setShadowSpread?.(vals[0])}
                  onValueCommit={(vals) => setShadowSpreadImmediate?.(vals[0])}
                  min={-100}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {shadowSpread || 0}px
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  // Device Configuration Section
  const renderDeviceConfig = (scene: DeviceScene) => {
    const isBrowser =
      scene.device === "chrome" ||
      scene.device === "safari" ||
      scene.device === "browser";
    const isScreenshot = scene.device === "screenshot";
    const isIPhone =
      scene.device === "iphone-17-pro" || scene.device === "iphone-17-pro-max";
    const isIPad = scene.device === "ipad-pro";
    const isMacBook = scene.device === "macbook-pro";
    const canHaveBorderRadius = isBrowser || isScreenshot;

    // Check if this device is expanded
    const isDeviceExpanded = expandedDevices[scene.id] !== false; // Default to true

    return (
      <div
        key={scene.id}
        className="mb-4 rounded-lg border border-border bg-muted/30"
      >
        {/* Device Header with Collapse Toggle */}
        <button
          onClick={() => toggleDeviceExpansion(scene.id)}
          className="w-full flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {isDeviceExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">
                {getDeviceInfo(scene.device).name}
              </span>
              <span className="text-xs text-muted-foreground">
                {getDeviceInfo(scene.device).resolution}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveDevice(scene.id);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </button>

        {/* Device Configurations - Collapsible */}
        {isDeviceExpanded && (
          <div className="p-4 space-y-3">
            {/* Site URL - Only for browsers */}
            {isBrowser && (
              <Collapsible
                open={isConfigSectionExpanded(scene.id, "siteUrl")}
                onOpenChange={() => toggleConfigSection(scene.id, "siteUrl")}
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between py-2">
                    <span className="text-xs font-medium">Site URL</span>
                    {isConfigSectionExpanded(scene.id, "siteUrl") ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <input
                    type="text"
                    value={siteUrl || ""}
                    onChange={(e) => setSiteUrl?.(e.target.value)}
                    placeholder="Enter website URL"
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                  />
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Device Frame - Using browserMode property */}
            <Collapsible
              open={isConfigSectionExpanded(scene.id, "frame")}
              onOpenChange={() => toggleConfigSection(scene.id, "frame")}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between py-2">
                  <span className="text-xs font-medium">Device Frame</span>
                  {isConfigSectionExpanded(scene.id, "frame") ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="grid grid-cols-2 gap-2">
                  {isBrowser ? (
                    <>
                      {["display", "light", "dark"].map((mode) => (
                        <Button
                          key={mode}
                          variant={
                            scene.browserMode === mode ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateScene(scene.id, { browserMode: mode })
                          }
                          className="capitalize text-xs"
                        >
                          {mode}
                        </Button>
                      ))}
                    </>
                  ) : isIPhone ? (
                    <>
                      {["display", "blue", "silver", "orange"].map((mode) => (
                        <Button
                          key={mode}
                          variant={
                            scene.browserMode === mode ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateScene(scene.id, { browserMode: mode })
                          }
                          className="capitalize text-xs"
                        >
                          {mode}
                        </Button>
                      ))}
                    </>
                  ) : isIPad || isMacBook ? (
                    <>
                      {["display", "gray", "silver"].map((mode) => (
                        <Button
                          key={mode}
                          variant={
                            scene.browserMode === mode ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleUpdateScene(scene.id, { browserMode: mode })
                          }
                          className="capitalize text-xs"
                        >
                          {mode}
                        </Button>
                      ))}
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground col-span-2">
                      Device frame options available for physical devices
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Border Style - Only for screenshots, using deviceStyle property */}
            {isScreenshot && (
              <Collapsible
                open={isConfigSectionExpanded(scene.id, "borderStyle")}
                onOpenChange={() =>
                  toggleConfigSection(scene.id, "borderStyle")
                }
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between py-2">
                    <span className="text-xs font-medium">Border Style</span>
                    {isConfigSectionExpanded(scene.id, "borderStyle") ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-3">
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
                      <Button
                        key={style}
                        variant={
                          scene.deviceStyle === style ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleUpdateScene(scene.id, { deviceStyle: style })
                        }
                        className="capitalize text-xs"
                      >
                        {style.replace("-", " ")}
                      </Button>
                    ))}
                  </div>
                  {scene.deviceStyle && scene.deviceStyle !== "default" && (
                    <div>
                      <Label className="text-xs">Edge Size</Label>
                      <Slider
                        value={[scene.styleEdge || 8]}
                        onValueChange={(vals) =>
                          handleUpdateScene(scene.id, { styleEdge: vals[0] })
                        }
                        min={0}
                        max={64}
                        step={1}
                        className="mt-2"
                      />
                      <span className="text-xs text-muted-foreground">
                        {scene.styleEdge || 8}px
                      </span>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Border Radius - For browsers and screenshots */}
            {canHaveBorderRadius && (
              <Collapsible
                open={isConfigSectionExpanded(scene.id, "borderRadius")}
                onOpenChange={() =>
                  toggleConfigSection(scene.id, "borderRadius")
                }
              >
                <CollapsibleTrigger asChild>
                  <button className="w-full flex items-center justify-between py-2">
                    <span className="text-xs font-medium">Border Radius</span>
                    {isConfigSectionExpanded(scene.id, "borderRadius") ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <Slider
                    value={[borderRadius]}
                    onValueChange={(vals) => setBorderRadius(vals[0])}
                    onValueCommit={(vals) => setBorderRadiusImmediate(vals[0])}
                    min={0}
                    max={48}
                    step={1}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {borderRadius}px
                  </span>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Position - X and Y coordinates */}
            <Collapsible
              open={isConfigSectionExpanded(scene.id, "position")}
              onOpenChange={() => toggleConfigSection(scene.id, "position")}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between py-2">
                  <span className="text-xs font-medium">Position</span>
                  {isConfigSectionExpanded(scene.id, "position") ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3">
                <div>
                  <Label className="text-xs">X Position</Label>
                  <Slider
                    value={[scene.position.x]}
                    onValueChange={(vals) =>
                      handleUpdateScene(scene.id, {
                        position: { ...scene.position, x: vals[0] },
                      })
                    }
                    min={0}
                    max={3000}
                    step={10}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {scene.position.x}px
                  </span>
                </div>
                <div>
                  <Label className="text-xs">Y Position</Label>
                  <Slider
                    value={[scene.position.y]}
                    onValueChange={(vals) =>
                      handleUpdateScene(scene.id, {
                        position: { ...scene.position, y: vals[0] },
                      })
                    }
                    min={0}
                    max={3000}
                    step={10}
                    className="mt-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {scene.position.y}px
                  </span>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Scale */}
            <Collapsible
              open={isConfigSectionExpanded(scene.id, "scale")}
              onOpenChange={() => toggleConfigSection(scene.id, "scale")}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between py-2">
                  <span className="text-xs font-medium">Scale</span>
                  {isConfigSectionExpanded(scene.id, "scale") ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Slider
                  value={[scene.scale]}
                  onValueChange={(vals) =>
                    handleUpdateScene(scene.id, { scale: vals[0] })
                  }
                  min={10}
                  max={400}
                  step={5}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {scene.scale}%
                </span>
              </CollapsibleContent>
            </Collapsible>

            {/* Rotation */}
            <Collapsible
              open={isConfigSectionExpanded(scene.id, "rotation")}
              onOpenChange={() => toggleConfigSection(scene.id, "rotation")}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between py-2">
                  <span className="text-xs font-medium">Rotation</span>
                  {isConfigSectionExpanded(scene.id, "rotation") ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Slider
                  value={[scene.rotation]}
                  onValueChange={(vals) =>
                    handleUpdateScene(scene.id, { rotation: vals[0] })
                  }
                  min={-180}
                  max={180}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  {scene.rotation}°
                </span>
              </CollapsibleContent>
            </Collapsible>

            {/* Z-Index */}
            <Collapsible
              open={isConfigSectionExpanded(scene.id, "zIndex")}
              onOpenChange={() => toggleConfigSection(scene.id, "zIndex")}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between py-2">
                  <span className="text-xs font-medium">
                    Layer Order (Z-Index)
                  </span>
                  {isConfigSectionExpanded(scene.id, "zIndex") ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <Slider
                  value={[scene.zIndex]}
                  onValueChange={(vals) =>
                    handleUpdateScene(scene.id, { zIndex: vals[0] })
                  }
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
                <span className="text-xs text-muted-foreground">
                  Layer {scene.zIndex}
                </span>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with close button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Scene Builder</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white/80 hover:text-white"
        >
          Close
        </Button>
      </div>

      {/* Global Configurations */}
      {renderGlobalConfig()}

      {/* Devices List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {scenes.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No devices added yet. Use &quot;Devices&quot; button to add one.
          </div>
        ) : (
          scenes.map((scene) => renderDeviceConfig(scene))
        )}
      </div>
    </div>
  );
}
