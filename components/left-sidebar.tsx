"use client";

import React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, EyeOff } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import MockupTab from "@/components/MockupTab";
import FrameTab from "@/components/FrameTab";
import { SceneBuilderPanel } from "@/components/scene-builder-panel";
import type { DeviceScene } from "@/types/scene-builder";

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
    | "texture"
    | "textures"
    | "transparent"
    | "image"
    | "magical";
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
      | "magical"
  ) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  backgroundImage?: string | undefined;
  setBackgroundImage: (img: string | undefined) => void;
  selectedPreset: string;
  setSelectedPreset: (preset: string) => void;

  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
  setDeviceStyle: (style: LeftSidebarProps["deviceStyle"]) => void;
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

  layoutMode: "single" | "double" | "triple" | "scene-builder";
  setLayoutMode: (
    mode: "single" | "double" | "triple" | "scene-builder"
  ) => void;
  siteUrl?: string;
  setSiteUrl?: (url: string) => void;
  hideMockup?: boolean;
  onToggleHideMockup?: () => void;

  /** NEW: mockup gap */
  mockupGap: number;
  setMockupGap: (gap: number) => void;

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

  /** NEW: canvas texts */
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

  /** NEW: magical gradients */
  magicalGradients?: string[];
  setMagicalGradients: (gradients: string[]) => void;

  /** NEW: hover state for media slots */
  hoveredSlot?: number | null;
  setHoveredSlot?: (slot: number | null) => void;

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
  setBranding: (
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

  /** NEW: control tab from parent (for double click) */
  activeTabFromParent?: "mockup" | "frame" | null;
  setActiveTabFromParent?: (tab: "mockup" | "frame" | null) => void;

  /** NEW: text editing from canvas double click */
  editingTextIdFromCanvas?: string | null;
  setEditingTextIdFromCanvas?: (id: string | null) => void;

  /** NEW: branding editing from canvas double click */
  editingBrandingFromCanvas?: boolean;
  setEditingBrandingFromCanvas?: (value: boolean) => void;

  /** NEW: Scene FX */
  sceneFxMode?: "default" | "shadows";
  setSceneFxMode?: (mode: "default" | "shadows") => void;
  sceneFxShadow?: string | null;
  setSceneFxShadow?: (shadow: string | null) => void;
  sceneFxOpacity?: number;
  setSceneFxOpacity?: (opacity: number) => void;
  sceneFxLayer?: "overlay" | "underlay";
  setSceneFxLayer?: (layer: "overlay" | "underlay") => void;

  /** NEW: scene builder */
  deviceScenes?: DeviceScene[];
  setDeviceScenes?: (scenes: DeviceScene[]) => void;
  onSceneImageUpload?: (
    e: React.ChangeEvent<HTMLInputElement>,
    sceneId: string
  ) => void;
}

export function LeftSidebar(props: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<"mockup" | "frame" | "scene">(
    "mockup"
  );
  const [deviceSelectOpen, setDeviceSelectOpen] = useState(false);

  // Handle tab control from parent (double click)
  useEffect(() => {
    if (props.activeTabFromParent) {
      setActiveTab(props.activeTabFromParent);
      // Clear the flag after setting
      if (props.setActiveTabFromParent) {
        props.setActiveTabFromParent(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.activeTabFromParent]);

  // Close device menu when device changes
  useEffect(() => {
    if (deviceSelectOpen) {
      setDeviceSelectOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedDevice]);

  // Auto-switch to "mockup" tab when leaving scene-builder mode
  useEffect(() => {
    if (props.layoutMode !== "scene-builder" && activeTab === "scene") {
      setActiveTab("mockup");
    }
    // Auto-switch to "scene" tab when entering scene-builder mode
    if (props.layoutMode === "scene-builder" && activeTab !== "scene") {
      setActiveTab("scene");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.layoutMode]);

  return (
    <div
      className="w-full md:w-[280px] bg-background overflow-y-auto sticky top-0 h-screen"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* Tabs */}
      <div className="sticky top-0 z-30 supports-backdrop-filter:border-border p-4 flex flex-col items-center space-y-4 supports-backdrop-filter:bg-background/10 backdrop-blur-xl supports-backdrop-filter:backdrop-saturate-150">
        <div className="flex items-center gap-3">
          <ChevronLeft
            className="text-foreground cursor-pointer"
            onClick={props.onOpenSideMenu}
          />
          <div className="flex h-9 w-9 items-center justify-center">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="266.667"
              height="266.667"
              viewBox="0 0 200 200"
            >
              <path
                d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground">Mokkio</span>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "mockup" | "frame" | "scene")
          }
          className="w-full"
        >
          <TabsList
            className={`relative grid w-full ${props.layoutMode === "scene-builder" ? "grid-cols-3" : "grid-cols-2"} bg-muted overflow-hidden px-1 py-1`}
          >
            {/* Active tab indicator */}
            <span
              className="absolute top-1 h-[calc(100%-0.5rem)] bg-muted-foreground/20 rounded-lg transition-all duration-300 pointer-events-none"
              style={{
                width:
                  props.layoutMode === "scene-builder"
                    ? "calc(33.333% - 0.25rem)"
                    : "calc(50% - 0.25rem)",
                left:
                  activeTab === "frame"
                    ? props.layoutMode === "scene-builder"
                      ? "calc(33.333% + 0.125rem)"
                      : "calc(50% + 0rem)"
                    : activeTab === "scene"
                      ? "calc(66.666% + 0.00rem)"
                      : "0.25rem",
              }}
            />
            <TabsTrigger
              value="mockup"
              className="text-xs text-foreground bg-transparent cursor-pointer z-10"
            >
              Mockup
            </TabsTrigger>
            <TabsTrigger
              value="frame"
              className="text-xs text-foreground cursor-pointer z-10"
            >
              Frame
            </TabsTrigger>
            {props.layoutMode === "scene-builder" && (
              <TabsTrigger
                value="scene"
                className="text-xs text-foreground cursor-pointer z-10"
              >
                Scene
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>

      {/* ---- MOCKUP TAB ---- */}
      {activeTab === "mockup" && (
        <div
          className={`relative flex-1 ${props.layoutMode === "scene-builder" ? "overflow-hidden" : "overflow-auto"}`}
        >
          <MockupTab
            uploadedImages={props.uploadedImages}
            onImageUpload={props.onImageUpload}
            onImageRemove={props.onImageRemove}
            selectedDevice={props.selectedDevice}
            setSelectedDevice={props.setSelectedDevice}
            backgroundType={props.backgroundType}
            setBackgroundType={props.setBackgroundType}
            backgroundColor={props.backgroundColor}
            setBackgroundColor={props.setBackgroundColor}
            backgroundImage={props.backgroundImage}
            setBackgroundImage={props.setBackgroundImage}
            selectedPreset={props.selectedPreset}
            setSelectedPreset={props.setSelectedPreset}
            deviceStyle={props.deviceStyle}
            setDeviceStyle={props.setDeviceStyle}
            styleEdge={props.styleEdge}
            setStyleEdge={props.setStyleEdge}
            setStyleEdgeImmediate={props.setStyleEdgeImmediate}
            borderType={props.borderType}
            setBorderType={props.setBorderType}
            borderRadius={props.borderRadius}
            setBorderRadius={props.setBorderRadius}
            setBorderRadiusImmediate={props.setBorderRadiusImmediate}
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
            sceneType={props.sceneType}
            setSceneType={props.setSceneType}
            layoutMode={props.layoutMode}
            setLayoutMode={props.setLayoutMode}
            siteUrl={props.siteUrl}
            setSiteUrl={props.setSiteUrl}
            hideMockup={props.hideMockup}
            onToggleHideMockup={props.onToggleHideMockup}
            selectedResolution={props.selectedResolution}
            setSelectedResolution={props.setSelectedResolution}
            backgroundNoise={props.backgroundNoise}
            setBackgroundNoise={props.setBackgroundNoise}
            backgroundBlur={props.backgroundBlur}
            setBackgroundBlur={props.setBackgroundBlur}
            browserMode={props.browserMode}
            setBrowserMode={props.setBrowserMode}
            onOpenLandingPopup={props.onOpenLandingPopup}
            onOpenSideMenu={props.onOpenSideMenu}
            mockupGap={props.mockupGap}
            setMockupGap={props.setMockupGap}
            hoveredSlot={props.hoveredSlot}
            setHoveredSlot={props.setHoveredSlot}
          />

          {/* Overlay when Scene Builder is selected */}
          {props.layoutMode === "scene-builder" && (
            <div className="absolute inset-0 flex items-start justify-center pt-96 bg-black/60 backdrop-blur-sm z-20">
              <div className="text-center px-8 py-6 max-w-xs">
                <div className="flex justify-center mb-3">
                  <EyeOff className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    Scene Builder Active
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mockup tab is not available in Scene Builder mode
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- FRAME TAB ---- */}
      {activeTab === "frame" && (
        <FrameTab
          selectedResolution={props.selectedResolution}
          setSelectedResolution={props.setSelectedResolution}
          backgroundNoise={props.backgroundNoise}
          setBackgroundNoise={props.setBackgroundNoise}
          backgroundBlur={props.backgroundBlur}
          setBackgroundBlur={props.setBackgroundBlur}
          texts={props.texts}
          addText={props.addText}
          updateText={props.updateText}
          removeText={props.removeText}
          backgroundType={props.backgroundType}
          setBackgroundType={props.setBackgroundType}
          backgroundColor={props.backgroundColor}
          setBackgroundColor={props.setBackgroundColor}
          backgroundImage={props.backgroundImage}
          setBackgroundImage={props.setBackgroundImage}
          selectedPreset={props.selectedPreset}
          setSelectedPreset={props.setSelectedPreset}
          layoutMode={props.layoutMode}
          uploadedImages={props.uploadedImages}
          magicalGradients={props.magicalGradients}
          setMagicalGradients={props.setMagicalGradients}
          branding={props.branding}
          setBranding={props.setBranding}
          editingTextIdFromCanvas={props.editingTextIdFromCanvas}
          setEditingTextIdFromCanvas={props.setEditingTextIdFromCanvas}
          editingBrandingFromCanvas={props.editingBrandingFromCanvas}
          setEditingBrandingFromCanvas={props.setEditingBrandingFromCanvas}
          sceneFxMode={props.sceneFxMode}
          setSceneFxMode={props.setSceneFxMode}
          sceneFxShadow={props.sceneFxShadow}
          setSceneFxShadow={props.setSceneFxShadow}
          sceneFxOpacity={props.sceneFxOpacity}
          setSceneFxOpacity={props.setSceneFxOpacity}
          sceneFxLayer={props.sceneFxLayer}
          setSceneFxLayer={props.setSceneFxLayer}
        />
      )}

      {/* ---- SCENE BUILDER TAB ---- */}
      {activeTab === "scene" && props.layoutMode === "scene-builder" && (
        <SceneBuilderPanel
          scenes={props.deviceScenes || []}
          onScenesChange={props.setDeviceScenes || (() => {})}
          availableImages={props.uploadedImages}
          onImageUpload={props.onSceneImageUpload}
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
        />
      )}
    </div>
  );
}
