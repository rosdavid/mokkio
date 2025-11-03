"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDown, RefreshCw, Trash2, Upload } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface MockupTabProps {
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

  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid";
  setDeviceStyle: (style: MockupTabProps["deviceStyle"]) => void;
  /** grosor exacto del borde en px */
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

  /** NEW: frame resolution preset */
  selectedResolution: string;
  setSelectedResolution: (id: string) => void;

  /** NEW: background effects */
  backgroundNoise: number;
  setBackgroundNoise: (value: number) => void;
  backgroundBlur: number;
  setBackgroundBlur: (value: number) => void;

  /** NEW: browser theme mode */
  browserMode: string;
  setBrowserMode: (mode: string) => void;

  /** NEW: open landing popup */
  onOpenLandingPopup?: () => void;

  /** NEW: open side menu */
  onOpenSideMenu?: () => void;
}

const MockupTab: React.FC<MockupTabProps> = (props) => {
  const [deviceTab, setDeviceTab] = useState("all");
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const [deviceSelectOpen, setDeviceSelectOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Close device menu when device changes
  useEffect(() => {
    if (deviceSelectOpen) {
      setDeviceSelectOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedDevice]);

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

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    media: true,
    siteUrl: true,
    style: true,
    border: true,
    shadow: true,
    background: true,
    effects: true,
    browserStyle: true,
    text: true,
  });

  const toggleSection = (s: string) =>
    setExpandedSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const getImageSlotCount = () => 1;
  const getRecommendedResolution = () => {
    switch (props.selectedDevice) {
      case "browser":
        return "Any resolution";
      case "iphone-17-pro":
        return "1206×2622px";
      case "iphone-17-pro-max":
        return "1320×2868px";
      case "macbook-pro":
        return "2560×1600px";
      case "ipad-pro":
        return "2048×2732px";
      case "safari":
        return "Any resolution";
      case "chrome":
        return "Any resolution";
      default:
        return "Any resolution";
    }
  };

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
      const deviceConfig = deviceBadges[deviceKey] || {};
      return (
        <div className="relative">
          <button
            onClick={onClick}
            className={`w-44 h-44 flex flex-col items-center justify-center p-3 rounded-lg border text-center cursor-pointer transition-all duration-200 ${
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

  const getEffectiveBorderType = () => {
    const radius = props.borderRadius;
    if (radius <= 10) return "sharp";
    if (radius <= 30) return "curved";
    return "round";
  };

  return (
    <div className="space-y-4 p-4">
      {/* Device */}
      <div>
        <Select
          value={props.selectedDevice}
          onValueChange={props.setSelectedDevice}
          open={deviceSelectOpen}
          onOpenChange={(open) => {
            setDeviceSelectOpen(open);
            setIsDeviceMenuOpen(open);
          }}
        >
          <SelectTrigger
            className="w-full bg-muted border-border text-foreground text-sm"
            style={{ height: "64px" }}
          >
            <SelectValue>
              {props.selectedDevice ? (
                props.selectedDevice === "screenshot" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/davidros.vercel.app.webp"
                      alt="David Ros thumbnail"
                      width={64}
                      height={64}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className="text-sm text-foreground font-medium">
                        {getDeviceInfo(props.selectedDevice).name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getDeviceInfo(props.selectedDevice).resolution}
                      </span>
                    </div>
                  </div>
                ) : props.selectedDevice === "chrome" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/chrome-thumbnail.webp"
                      alt="Chrome thumbnail"
                      width={64}
                      height={64}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className="text-sm text-foreground font-medium">
                        {getDeviceInfo(props.selectedDevice).name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getDeviceInfo(props.selectedDevice).resolution}
                      </span>
                    </div>
                  </div>
                ) : props.selectedDevice === "safari" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/safari-thumbnail.webp"
                      alt="Safari thumbnail"
                      width={64}
                      height={64}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className="text-sm text-foreground font-medium">
                        {getDeviceInfo(props.selectedDevice).name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getDeviceInfo(props.selectedDevice).resolution}
                      </span>
                    </div>
                  </div>
                ) : props.selectedDevice === "iphone-17-pro" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/iphone-17-pro-thumbnail.png"
                      alt="iPhone 17 Pro thumbnail"
                      width={40}
                      height={40}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className="text-sm text-foreground font-medium">
                        {getDeviceInfo(props.selectedDevice).name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getDeviceInfo(props.selectedDevice).resolution}
                      </span>
                    </div>
                  </div>
                ) : props.selectedDevice === "iphone-17-pro-max" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/iphone-17-pro-max-thumbnail.png"
                      alt="iPhone 17 Pro Max thumbnail"
                      width={40}
                      height={40}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className="text-sm text-foreground font-medium">
                        {getDeviceInfo(props.selectedDevice).name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getDeviceInfo(props.selectedDevice).resolution}
                      </span>
                    </div>
                  </div>
                ) : props.selectedDevice === "ipad-pro" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/ipad-pro-13-thumbnail.png"
                      alt="iPad Pro 13 thumbnail"
                      width={40}
                      height={40}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className="text-sm text-white font-medium">
                        {getDeviceInfo(props.selectedDevice).name}
                      </span>
                      <span className="text-xs text-white/60">
                        {getDeviceInfo(props.selectedDevice).resolution}
                      </span>
                    </div>
                  </div>
                ) : props.selectedDevice === "macbook-pro" ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src="/macbook-pro-16-thumbnail.png"
                      alt="MacBook Pro 16 thumbnail"
                      width={40}
                      height={40}
                      className="rounded-md object-contain"
                      unoptimized
                    />
                    <div className="flex flex-col items-start justify-center">
                      <span className="text-sm text-white font-medium">
                        {getDeviceInfo(props.selectedDevice).name}
                      </span>
                      <span className="text-xs text-white/60">
                        {getDeviceInfo(props.selectedDevice).resolution}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-sm text-white font-medium">
                      {getDeviceInfo(props.selectedDevice).name}
                    </span>
                    <span className="text-xs text-white/60">
                      {getDeviceInfo(props.selectedDevice).resolution}
                    </span>
                  </div>
                )
              ) : (
                "Select device"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
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
                      onClick={() =>
                        props.setSelectedDevice("iphone-17-pro-max")
                      }
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
                      onClick={() =>
                        props.setSelectedDevice("iphone-17-pro-max")
                      }
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
          </SelectContent>
        </Select>
        {props.selectedDevice === "screenshot" && (
          <p className="text-xs text-muted-foreground mt-1">Adapts to media</p>
        )}
      </div>

      {/* Media */}
      <div className="bg-card p-2.5 rounded-lg">
        <button
          onClick={() => toggleSection("media")}
          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          MEDIA
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              expandedSections.media ? "" : "-rotate-90"
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.media
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 pt-1">
            {Array.from({ length: getImageSlotCount() }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium">
                    Mockup {index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getRecommendedResolution()}
                  </p>
                </div>
                <div className="relative group">
                  <label className="flex flex-col items-center justify-center cursor-pointer relative aspect-video bg-muted border border-border border-dashed rounded-lg hover:bg-muted/80 transition-colors">
                    {props.uploadedImages[index] ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            props.uploadedImages[index] || "/placeholder.svg"
                          }
                          alt={`Preview ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 220px"
                          className="object-cover rounded-lg"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">
                          Drop or click to upload
                        </span>
                      </>
                    )}
                    <input
                      id={`file-input-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => props.onImageUpload(e, index)}
                      className="hidden"
                    />
                  </label>
                  {props.uploadedImages[index] && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          props.onImageRemove(index);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          document
                            .getElementById(`file-input-${index}`)
                            ?.click();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer"
                        title="Replace image"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide Mockup Checkbox */}
      <div className="bg-card p-2.5 rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hide-mockup"
            checked={props.hideMockup || false}
            onCheckedChange={props.onToggleHideMockup}
            className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 cursor-pointer"
          />
          <label
            htmlFor="hide-mockup"
            className="text-xs text-muted-foreground cursor-pointer"
          >
            Hide Mockup
          </label>
        </div>
      </div>

      {/* Site URL */}
      {["safari", "browser", "chrome"].includes(props.selectedDevice) && (
        <div className="bg-card p-2.5 rounded-lg">
          <button
            onClick={() => toggleSection("siteUrl")}
            className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            SITE URL
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                expandedSections.siteUrl ? "" : "-rotate-90"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expandedSections.siteUrl
                ? "max-h-64 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <input
              type="text"
              value={props.siteUrl}
              onChange={(e) => props.setSiteUrl?.(e.target.value)}
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground"
              placeholder="yourwebsite.com"
            />
          </div>
        </div>
      )}

      {/* STYLE */}
      {(["safari", "browser", "chrome"].includes(props.selectedDevice) ||
        ["iphone-17-pro", "iphone-17-pro-max"].includes(
          props.selectedDevice
        )) && (
        <div className="bg-card p-2.5 rounded-lg">
          <button
            onClick={() => toggleSection("browserStyle")}
            className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            STYLE
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                expandedSections.browserStyle ? "" : "-rotate-90"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expandedSections.browserStyle
                ? "max-h-64 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Browser devices: Light/Dark mode */}
              {["safari", "browser", "chrome"].includes(
                props.selectedDevice
              ) && (
                <>
                  <button
                    onClick={() => props.setBrowserMode("light")}
                    className={`h-10 rounded-lg border text-xs text-foreground cursor-pointer ${
                      props.browserMode === "light"
                        ? "border-primary bg-primary/20"
                        : "border-border bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Light Mode
                  </button>
                  <button
                    onClick={() => props.setBrowserMode("dark")}
                    className={`h-10 rounded-lg border text-xs text-foreground cursor-pointer ${
                      props.browserMode === "dark"
                        ? "border-primary bg-primary/20"
                        : "border-border bg-muted hover:bg-muted/80"
                    }`}
                  >
                    Dark Mode
                  </button>
                </>
              )}

              {/* Mobile devices: Display/Device Frame */}
              {["iphone-17-pro", "iphone-17-pro-max"].includes(
                props.selectedDevice
              ) && (
                <>
                  {props.selectedDevice === "iphone-17-pro" ? (
                    <>
                      <button
                        onClick={() => props.setBrowserMode("display")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "display"
                            ? "border-primary bg-primary/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-display-thumbnail.png"
                            alt="Display"
                            width={96}
                            height={96}
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
                        onClick={() => props.setBrowserMode("blue")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "blue"
                            ? "border-primary bg-primary/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-thumbnail.png"
                            alt="Blue"
                            width={96}
                            height={96}
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
                        onClick={() => props.setBrowserMode("silver")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "silver"
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-silver-thumbnail.png"
                            alt="Silver"
                            width={96}
                            height={96}
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
                        onClick={() => props.setBrowserMode("orange")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "orange"
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-orange-thumbnail.png"
                            alt="Orange"
                            width={96}
                            height={96}
                            style={{
                              objectFit: "cover",
                              objectPosition: "top",
                            }}
                            unoptimized
                          />
                        </div>
                        Orange
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => props.setBrowserMode("display")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "display"
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-display-thumbnail.png"
                            alt="Display"
                            width={96}
                            height={96}
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
                        onClick={() => props.setBrowserMode("blue")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "blue"
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-thumbnail.png"
                            alt="Blue"
                            width={96}
                            height={96}
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
                        onClick={() => props.setBrowserMode("silver")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "silver"
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-silver-thumbnail.png"
                            alt="Silver"
                            width={96}
                            height={96}
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
                        onClick={() => props.setBrowserMode("orange")}
                        className={`h-20 flex flex-col items-center justify-center rounded-lg border text-xs text-foreground cursor-pointer ${
                          props.browserMode === "orange"
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-border bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <div
                          style={{
                            width: 96,
                            height: 48,
                            overflow: "hidden",
                          }}
                          className="mb-1 rounded"
                        >
                          <Image
                            src="/iphone-17-pro-orange-thumbnail.png"
                            alt="Orange"
                            width={96}
                            height={96}
                            style={{
                              objectFit: "cover",
                              objectPosition: "top",
                            }}
                            unoptimized
                          />
                        </div>
                        Orange
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STYLE */}
      <div className="bg-card p-2.5 rounded-lg">
        <button
          onClick={() => toggleSection("style")}
          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          BORDER STYLE
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              expandedSections.style ? "" : "-rotate-90"
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.style
              ? "max-h-64 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-3 gap-2 pt-1">
            {(["default", "glass-light", "glass-dark", "liquid"] as const).map(
              (style) => (
                <button
                  key={style}
                  onClick={() => props.setDeviceStyle(style)}
                  className={`h-12 rounded-lg border text-xs capitalize text-foreground cursor-pointer ${
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

          {/* Grosor (1:1 px) */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs text-muted-foreground">Edge</Label>
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
        </div>
      </div>

      {/* BORDER RADIUS */}
      {props.selectedDevice.includes("iphone") ? null : (
        <div className="bg-card p-2.5 rounded-lg">
          <button
            onClick={() => toggleSection("border")}
            className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            BORDER RADIUS
            <ChevronDown
              className={`h-3 w-3 transition-transform duration-200 ${
                expandedSections.border ? "" : "-rotate-90"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              expandedSections.border
                ? "max-h-48 opacity-100 mt-2"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: "sharp", radius: 0 },
                  { type: "curved", radius: 20 },
                  { type: "round", radius: 40 },
                ].map(({ type, radius }) => (
                  <button
                    key={type}
                    onClick={() => {
                      props.setBorderType(type);
                      props.setBorderRadius(radius);
                    }}
                    className={`h-10 rounded-lg border text-xs capitalize text-foreground cursor-pointer ${
                      getEffectiveBorderType() === type
                        ? "border-primary bg-primary/20"
                        : "border-border bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-muted-foreground">
                    Radius
                  </Label>
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
          </div>
        </div>
      )}

      {/* SHADOW */}
      <div className="bg-card p-2.5 rounded-lg">
        <button
          onClick={() => toggleSection("shadow")}
          className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider"
        >
          SHADOW
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              expandedSections.shadow ? "" : "-rotate-90"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            expandedSections.shadow
              ? "max-h-[560px] opacity-100 mt-2"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-3 pt-1">
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
            ) : (
              /* CUSTOM */
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

                {/* Color palette */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Configuración de badges para dispositivos
const deviceBadges: Record<string, { badge?: string }> = {
  "ipad-pro": { badge: "NEW" },
  "iphone-17-pro": { badge: "NEW" },
  "iphone-17-pro-max": { badge: "NEW" },
  "macbook-pro": { badge: "NEW" },
  chrome: { badge: "NEW" },
  safari: { badge: "NEW" },
};

export default MockupTab;
