"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { ChevronDown, RefreshCw, Trash2, Upload } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeftSidebarProps {
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
    | "texture";
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
  ) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;

  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid";
  setDeviceStyle: (style: LeftSidebarProps["deviceStyle"]) => void;
  /** grosor exacto del borde en px */
  styleEdge: number;
  setStyleEdge: (px: number) => void;

  borderType: string;
  setBorderType: (type: string) => void;
  borderRadius: number;
  setBorderRadius: (radius: number) => void;

  shadowType: string;
  setShadowType: (type: string) => void;
  shadowOpacity: number;
  setShadowOpacity: (opacity: number) => void;
  shadowMode?: "presets" | "custom";
  setShadowMode?: (mode: "presets" | "custom") => void;
  shadowOffsetX?: number;
  setShadowOffsetX?: (n: number) => void;
  shadowOffsetY?: number;
  setShadowOffsetY?: (n: number) => void;
  shadowBlur?: number;
  setShadowBlur?: (n: number) => void;
  shadowSpread?: number;
  setShadowSpread?: (n: number) => void;
  shadowColor?: string;
  setShadowColor?: (c: string) => void;

  sceneType: "none" | "shadow" | "shapes";
  setSceneType: (type: "none" | "shadow" | "shapes") => void;

  layoutMode: "single" | "double" | "triple";
  siteUrl?: string;
  setSiteUrl?: (url: string) => void;
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
];

export function LeftSidebar(props: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("mockup");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    media: true,
    style: true,
    border: true,
    shadow: true,
  });

  const toggleSection = (s: string) =>
    setExpandedSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const getImageSlotCount = () => 1;
  const getRecommendedResolution = () => {
    switch (props.selectedDevice) {
      case "browser":
        return "1920×1080px";
      case "iphone-15-pro":
        return "1179×2556px";
      case "macbook-pro":
        return "2560×1600px";
      case "ipad-pro":
        return "2048×2732px";
      default:
        return "Any resolution";
    }
  };

  const getBorderTypeFromRadius = (r: number) =>
    r === 0 ? "sharp" : r === 20 ? "curved" : r === 40 ? "round" : null;
  const getEffectiveBorderType = () => {
    if (["sharp", "curved", "round"].includes(props.borderType))
      return props.borderType;
    return getBorderTypeFromRadius(props.borderRadius);
  };

  return (
    <div
      className="w-full md:w-[220px] border-r border-white/10 bg-[#0a0a0a] overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Tabs */}
      <div className="border-b border-white/10 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="relative grid w-full grid-cols-2 bg-white/5 overflow-hidden px-1 py-1">
            {/* Indicador de pestaña activa */}
            <span
              className="absolute top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.5rem)] bg-white/10 rounded-lg transition-all duration-300 pointer-events-none"
              style={{
                left: activeTab === "frame" ? "calc(50% + 0.25rem)" : "0.25rem",
              }}
            />
            <TabsTrigger
              value="mockup"
              className="text-xs text-white bg-transparent cursor-pointer z-10"
            >
              Mockup
            </TabsTrigger>
            <TabsTrigger
              value="frame"
              className="text-xs text-white cursor-pointer z-10"
            >
              Frame
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ---- MOCKUP TAB ---- */}
      {activeTab === "mockup" && (
        <div className="space-y-4 p-4">
          {/* Device */}
          <div>
            <Select
              value={props.selectedDevice}
              onValueChange={props.setSelectedDevice}
            >
              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] text-white border-white/10">
                <SelectItem className="cursor-pointer" value="screenshot">
                  Screenshot - Adapts to media
                </SelectItem>
                <SelectItem className="cursor-pointer" value="browser">
                  Browser - 1920×1080px
                </SelectItem>
                <SelectItem className="cursor-pointer" value="iphone-15-pro">
                  iPhone 15 Pro - 1179×2556px
                </SelectItem>
                <SelectItem className="cursor-pointer" value="macbook-pro">
                  MacBook Pro - 2560×1600px
                </SelectItem>
                <SelectItem className="cursor-pointer" value="ipad-pro">
                  iPad Pro - 2048×2732px
                </SelectItem>
              </SelectContent>
            </Select>
            {props.selectedDevice === "screenshot" && (
              <p className="text-xs text-white/40 mt-1">Adapts to media</p>
            )}
          </div>

          {/* Media */}
          <div className="bg-white/10 p-2.5 rounded-lg">
            <button
              onClick={() => toggleSection("media")}
              className="flex w-full items-center justify-between text-xs font-medium text-white/60 uppercase tracking-wider"
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
                      <p className="text-xs text-white/60 font-medium">
                        Mockup {index + 1}
                      </p>
                      <p className="text-xs text-white/40">
                        {getRecommendedResolution()}
                      </p>
                    </div>
                    <div className="relative group">
                      <label className="flex flex-col items-center justify-center cursor-pointer relative aspect-video bg-white/5 border border-white/10 border-dashed rounded-lg hover:bg-white/10 transition-colors">
                        {props.uploadedImages[index] ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={
                                props.uploadedImages[index] ||
                                "/placeholder.svg"
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
                            <Upload className="h-6 w-6 text-white/40 mb-2" />
                            <span className="text-xs text-white/40">
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
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
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
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
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

          {/* Site URL */}
          {props.selectedDevice === "browser" && (
            <div className="bg-white/10 p-2.5 rounded-lg">
              <button
                onClick={() => toggleSection("siteUrl")}
                className="flex w-full items-center justify-between text-xs font-medium text-white/60 uppercase tracking-wider"
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
                  className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                  placeholder="yourwebsite.com"
                />
              </div>
            </div>
          )}

          {/* STYLE */}
          <div className="bg-white/10 p-2.5 rounded-lg">
            <button
              onClick={() => toggleSection("style")}
              className="flex w-full items-center justify-between text-xs font-medium text-white/60 uppercase tracking-wider"
            >
              STYLE
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
                {(
                  ["default", "glass-light", "glass-dark", "liquid"] as const
                ).map((style) => (
                  <button
                    key={style}
                    onClick={() => props.setDeviceStyle(style)}
                    className={`h-12 rounded-lg border text-xs capitalize text-white cursor-pointer ${
                      props.deviceStyle === style
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {style.replace("-", " ")}
                  </button>
                ))}
              </div>

              {/* Grosor (1:1 px) */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-xs text-white/60">Edge</Label>
                  <span className="text-xs text-white/40">
                    {props.styleEdge}px
                  </span>
                </div>
                <Slider
                  value={[props.styleEdge]}
                  onValueChange={([v]) => props.setStyleEdge(v)}
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
            <div className="bg-white/10 p-2.5 rounded-lg">
              <button
                onClick={() => toggleSection("border")}
                className="flex w-full items-center justify-between text-xs font-medium text-white/60 uppercase tracking-wider"
              >
                BORDER
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
                        className={`h-10 rounded-lg border text-xs capitalize text-white cursor-pointer ${
                          getEffectiveBorderType() === type
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs text-white/60">Radius</Label>
                      <span className="text-xs text-white/40">
                        {props.borderRadius}
                      </span>
                    </div>
                    <Slider
                      value={[props.borderRadius]}
                      onValueChange={([v]) => props.setBorderRadius(v)}
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
          <div className="bg-white/10 p-2.5 rounded-lg">
            <button
              onClick={() => toggleSection("shadow")}
              className="flex w-full items-center justify-between text-xs font-medium text-white/60 uppercase tracking-wider"
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
                    className={`flex-1 h-8 rounded-lg border text-xs text-white cursor-pointer ${
                      props.shadowMode === "presets"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    onClick={() => props.setShadowMode?.("custom")}
                    className={`flex-1 h-8 rounded-lg border text-xs text-white cursor-pointer ${
                      props.shadowMode === "custom"
                        ? "border-purple-500 bg-purple-500/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
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
                          className={`h-10 rounded-lg border text-xs capitalize text-white cursor-pointer ${
                            props.shadowType === type
                              ? "border-purple-500 bg-purple-500/20"
                              : "border-white/10 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* Opacity (compartida) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-white/60">Opacity</Label>
                        <span className="text-xs text-white/40">
                          {props.shadowOpacity}%
                        </span>
                      </div>
                      <Slider
                        value={[props.shadowOpacity]}
                        onValueChange={([v]) => props.setShadowOpacity(v)}
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
                        <Label className="text-xs text-white/60">
                          Offset X
                        </Label>
                        <span className="text-xs text-white/40">
                          {props.shadowOffsetX ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[props.shadowOffsetX ?? 0]}
                        onValueChange={([v]) => props.setShadowOffsetX?.(v)}
                        min={-80}
                        max={80}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-white/60">
                          Offset Y
                        </Label>
                        <span className="text-xs text-white/40">
                          {props.shadowOffsetY ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[props.shadowOffsetY ?? 0]}
                        onValueChange={([v]) => props.setShadowOffsetY?.(v)}
                        min={-80}
                        max={80}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-white/60">Blur</Label>
                        <span className="text-xs text-white/40">
                          {props.shadowBlur ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[props.shadowBlur ?? 0]}
                        onValueChange={([v]) => props.setShadowBlur?.(v)}
                        min={0}
                        max={160}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-white/60">Spread</Label>
                        <span className="text-xs text-white/40">
                          {props.shadowSpread ?? 0}px
                        </span>
                      </div>
                      <Slider
                        value={[props.shadowSpread ?? 0]}
                        onValueChange={([v]) => props.setShadowSpread?.(v)}
                        min={-40}
                        max={80}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <Label className="text-xs text-white/60">Opacity</Label>
                        <span className="text-xs text-white/40">
                          {props.shadowOpacity}%
                        </span>
                      </div>
                      <Slider
                        value={[props.shadowOpacity]}
                        onValueChange={([v]) => props.setShadowOpacity(v)}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Color palette */}
                    <div>
                      <Label className="text-xs text-white/60 mb-2 block">
                        Color
                      </Label>
                      <div className="grid grid-cols-6 gap-1">
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
      )}

      {/* ---- FRAME TAB ---- */}
      {activeTab === "frame" && (
        <div className="space-y-4 p-4">
          <div className="bg-white/10 p-2.5 rounded-lg">
            <button
              onClick={() => toggleSection("background")}
              className="flex w-full items-center justify-between text-xs font-medium text-white/60 uppercase tracking-wider"
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
                  ? "max-h-[560px] opacity-100 mt-2"
                  : "max-h-0 opacity-0"
              }`}
            >
              {/* Solid */}
              <div className="mb-3">
                <p className="text-xs text-white/40 mb-2">Solid Color</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {solidColors.map((c) => (
                    <button
                      key={c}
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
              </div>

              {/* Gradient */}
              <div>
                <p className="text-xs text-white/40 mb-2">Gradient</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {gradientPresets.map((p) => (
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
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-5" />
      {/* Gradiente sticky en el bottom */}
      <div
        className="sticky left-0 right-0 bottom-0 h-12 w-full pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #0a0a0a 99%)",
        }}
      />
    </div>
  );
}
