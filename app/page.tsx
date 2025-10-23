"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { MockupCanvas } from "@/components/mockup-canvas";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { TopBar } from "@/components/top-bar";
import { ExportProvider } from "@/lib/export-context";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppState {
  uploadedImages: (string | null)[];
  selectedDevice: string;
  selectedTemplate: string | null;
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
  backgroundColor: string;
  selectedPreset: string;

  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid";
  /** NUEVO: grosor del borde (px) */
  styleEdge: number;

  borderType: string;
  borderRadius: number;
  shadowType: string;
  shadowOpacity: number;
  shadowPosition: "underlay" | "overlay";
  shadowMode: "presets" | "custom";
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;

  sceneType: "none" | "shadow" | "shapes";
  zoom: number;
  panX: number;
  panY: number;
  layoutMode: "single" | "double" | "triple";
  siteUrl: string;
}

export default function MockupEditorPage() {
  const isMobile = useIsMobile();
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const toggleLeftSidebar = () => {
    if (showLeftSidebar) setShowLeftSidebar(false);
    else {
      setShowLeftSidebar(true);
      setShowRightSidebar(false);
    }
  };
  const toggleRightSidebar = () => {
    if (showRightSidebar) setShowRightSidebar(false);
    else {
      setShowRightSidebar(true);
      setShowLeftSidebar(false);
    }
  };

  useEffect(() => {
    if (isMobile && (showLeftSidebar || showRightSidebar)) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => document.body.classList.remove("sidebar-open");
  }, [isMobile, showLeftSidebar, showRightSidebar]);

  // ---- Media
  const [uploadedImages, setUploadedImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [selectedDevice, setSelectedDevice] = useState("screenshot");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // ---- Background
  const [backgroundType, setBackgroundType] =
    useState<AppState["backgroundType"]>("gradient");
  const [backgroundColor, setBackgroundColor] = useState("#6366f1");
  const [selectedPreset, setSelectedPreset] = useState("purple-pink");

  // ---- Style (borde/anillo)
  const [deviceStyle, setDeviceStyle] =
    useState<AppState["deviceStyle"]>("default");
  const [styleEdge, setStyleEdge] = useState(12); // px

  // ---- Border radius
  const [borderType, setBorderType] = useState("");
  const [borderRadius, setBorderRadius] = useState(20);

  // ---- Shadow
  const [shadowType, setShadowType] = useState("spread");
  const [shadowOpacity, setShadowOpacity] = useState(40);
  const [shadowPosition, setShadowPosition] = useState<"underlay" | "overlay">(
    "underlay"
  );
  const [shadowMode, setShadowMode] = useState<"presets" | "custom">("presets");
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState("#000000");

  // ---- Scene
  const [sceneType, setSceneType] = useState<"none" | "shadow" | "shapes">(
    "shadow"
  );

  // ---- Transform
  const [zoom, setZoom] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const [layoutMode, setLayoutMode] = useState<"single" | "double" | "triple">(
    "single"
  );
  const [siteUrl, setSiteUrl] = useState<string>("https://mokk.io");

  // ---- History
  const [history, setHistory] = useState<AppState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (layoutMode === "triple") setZoom(60);
    else if (layoutMode === "double") setZoom(70);
    else setZoom(100);
  }, [layoutMode]);

  const handleImageUpload = (
    fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    index = 0
  ) => {
    let file: File | undefined;
    if (fileOrEvent instanceof File) file = fileOrEvent;
    else file = fileOrEvent.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newImages = [...uploadedImages];
      newImages[index] = event.target?.result as string;
      setUploadedImagesWithHistory(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (index: number) => {
    const newImages = [...uploadedImages];
    newImages[index] = null;
    setUploadedImagesWithHistory(newImages);
  };

  // ---- History helpers
  const saveToHistory = useCallback(() => {
    const currentState: AppState = {
      uploadedImages,
      selectedDevice,
      selectedTemplate,
      backgroundType,
      backgroundColor,
      selectedPreset,
      deviceStyle,
      styleEdge,
      borderType,
      borderRadius,
      shadowType,
      shadowOpacity,
      shadowPosition,
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
    };
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      return newHistory.slice(-50);
    });
    setHistoryIndex((prev) => prev + 1);
  }, [
    uploadedImages,
    selectedDevice,
    selectedTemplate,
    backgroundType,
    backgroundColor,
    selectedPreset,
    deviceStyle,
    styleEdge,
    borderType,
    borderRadius,
    shadowType,
    shadowOpacity,
    shadowPosition,
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
    historyIndex,
  ]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && history[historyIndex - 1]) {
      const s = history[historyIndex - 1];
      setUploadedImages(s.uploadedImages);
      setSelectedDevice(s.selectedDevice);
      setSelectedTemplate(s.selectedTemplate);
      setBackgroundType(s.backgroundType);
      setBackgroundColor(s.backgroundColor);
      setSelectedPreset(s.selectedPreset);
      setDeviceStyle(s.deviceStyle);
      setStyleEdge(s.styleEdge);
      setBorderType(s.borderType);
      setBorderRadius(s.borderRadius);
      setShadowType(s.shadowType);
      setShadowOpacity(s.shadowOpacity);
      setShadowPosition(s.shadowPosition);
      setShadowMode(s.shadowMode);
      setShadowOffsetX(s.shadowOffsetX);
      setShadowOffsetY(s.shadowOffsetY);
      setShadowBlur(s.shadowBlur);
      setShadowSpread(s.shadowSpread);
      setShadowColor(s.shadowColor);
      setSceneType(s.sceneType);
      setZoom(s.zoom);
      setPanX(s.panX);
      setPanY(s.panY);
      setLayoutMode(s.layoutMode);
      setSiteUrl(s.siteUrl);
      setHistoryIndex((p) => p - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && history[historyIndex + 1]) {
      const s = history[historyIndex + 1];
      setUploadedImages(s.uploadedImages);
      setSelectedDevice(s.selectedDevice);
      setSelectedTemplate(s.selectedTemplate);
      setBackgroundType(s.backgroundType);
      setBackgroundColor(s.backgroundColor);
      setSelectedPreset(s.selectedPreset);
      setDeviceStyle(s.deviceStyle);
      setStyleEdge(s.styleEdge);
      setBorderType(s.borderType);
      setBorderRadius(s.borderRadius);
      setShadowType(s.shadowType);
      setShadowOpacity(s.shadowOpacity);
      setShadowPosition(s.shadowPosition);
      setShadowMode(s.shadowMode);
      setShadowOffsetX(s.shadowOffsetX);
      setShadowOffsetY(s.shadowOffsetY);
      setShadowBlur(s.shadowBlur);
      setShadowSpread(s.shadowSpread);
      setShadowColor(s.shadowColor);
      setSceneType(s.sceneType);
      setZoom(s.zoom);
      setPanX(s.panX);
      setPanY(s.panY);
      setLayoutMode(s.layoutMode);
      setSiteUrl(s.siteUrl);
      setHistoryIndex((p) => p + 1);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    setCanUndo(historyIndex > 0);
    setCanRedo(historyIndex < history.length - 1);
  }, [historyIndex, history.length]);

  useEffect(() => {
    const initialState: AppState = {
      uploadedImages: [null, null, null, null],
      selectedDevice: "screenshot",
      selectedTemplate: null,
      backgroundType: "gradient",
      backgroundColor: "#6366f1",
      selectedPreset: "purple-pink",
      deviceStyle: "default",
      styleEdge: 12,
      borderType: "",
      borderRadius: 20,
      shadowType: "spread",
      shadowOpacity: 40,
      shadowPosition: "underlay",
      shadowMode: "presets",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      sceneType: "shadow",
      zoom: 100,
      panX: 0,
      panY: 0,
      layoutMode: "single",
      siteUrl: "https://mokk.io",
    };
    setHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  // Setters con history
  const setUploadedImagesWithHistory = useCallback(
    (
      value:
        | (string | null)[]
        | ((prev: (string | null)[]) => (string | null)[])
    ) => {
      saveToHistory();
      setUploadedImages(value);
    },
    [saveToHistory]
  );
  const setSelectedDeviceWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      saveToHistory();
      setSelectedDevice(v);
    },
    [saveToHistory]
  );
  const setSelectedTemplateWithHistory = useCallback(
    (v: string | null | ((p: string | null) => string | null)) => {
      saveToHistory();
      setSelectedTemplate(v);
    },
    [saveToHistory]
  );
  const setBackgroundTypeWithHistory = useCallback(
    (
      v:
        | AppState["backgroundType"]
        | ((p: AppState["backgroundType"]) => AppState["backgroundType"])
    ) => {
      saveToHistory();
      setBackgroundType(v);
    },
    [saveToHistory]
  );
  const setBackgroundColorWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      saveToHistory();
      setBackgroundColor(v);
    },
    [saveToHistory]
  );
  const setSelectedPresetWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      saveToHistory();
      setSelectedPreset(v);
    },
    [saveToHistory]
  );
  const setDeviceStyleWithHistory = useCallback(
    (
      v:
        | AppState["deviceStyle"]
        | ((p: AppState["deviceStyle"]) => AppState["deviceStyle"])
    ) => {
      saveToHistory();
      setDeviceStyle(v);
    },
    [saveToHistory]
  );
  const setStyleEdgeWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setStyleEdge(typeof v === "function" ? v(styleEdge) : v);
    },
    [saveToHistory, styleEdge]
  );

  const setBorderTypeWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      saveToHistory();
      setBorderType(v);
    },
    [saveToHistory]
  );
  const setBorderRadiusWithHistory = useCallback(
    (value: number | ((prev: number) => number)) => {
      saveToHistory();
      const newRadius =
        typeof value === "function" ? value(borderRadius) : value;
      setBorderRadius(newRadius);
      const radiusToType: Record<number, string> = {
        0: "sharp",
        20: "curved",
        40: "round",
      };
      if (!radiusToType[newRadius] || radiusToType[newRadius] !== borderType)
        setBorderType("");
    },
    [saveToHistory, borderRadius, borderType]
  );

  const setShadowTypeWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      saveToHistory();
      setShadowType(v);
    },
    [saveToHistory]
  );
  const setShadowOpacityWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setShadowOpacity(v);
    },
    [saveToHistory]
  );
  const setShadowModeWithHistory = useCallback(
    (
      v:
        | "presets"
        | "custom"
        | ((p: "presets" | "custom") => "presets" | "custom")
    ) => {
      saveToHistory();
      setShadowMode(v as "presets" | "custom");
    },
    [saveToHistory]
  );
  const setShadowOffsetXWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setShadowOffsetX(v);
    },
    [saveToHistory]
  );
  const setShadowOffsetYWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setShadowOffsetY(v);
    },
    [saveToHistory]
  );
  const setShadowBlurWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setShadowBlur(v);
    },
    [saveToHistory]
  );
  const setShadowSpreadWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setShadowSpread(v);
    },
    [saveToHistory]
  );
  const setShadowColorWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      saveToHistory();
      setShadowColor(v);
    },
    [saveToHistory]
  );

  const setSceneTypeWithHistory = useCallback(
    (
      v:
        | AppState["sceneType"]
        | ((p: AppState["sceneType"]) => AppState["sceneType"])
    ) => {
      saveToHistory();
      setSceneType(v);
    },
    [saveToHistory]
  );
  const setZoomWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setZoom(v);
    },
    [saveToHistory]
  );
  const setPanXWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setPanX(v);
    },
    [saveToHistory]
  );
  const setPanYWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      saveToHistory();
      setPanY(v);
    },
    [saveToHistory]
  );
  const setLayoutModeWithHistory = useCallback(
    (
      v:
        | "single"
        | "double"
        | "triple"
        | ((
            p: "single" | "double" | "triple"
          ) => "single" | "double" | "triple")
    ) => {
      saveToHistory();
      setLayoutMode(v as "single" | "double" | "triple");
    },
    [saveToHistory]
  );
  const setSiteUrlWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      saveToHistory();
      setSiteUrl(v);
    },
    [saveToHistory]
  );

  const resetToDefaults = () => {
    const s: AppState = {
      uploadedImages: [null, null, null, null],
      selectedDevice: "screenshot",
      selectedTemplate: null,
      backgroundType: "gradient",
      backgroundColor: "#6366f1",
      selectedPreset: "purple-pink",
      deviceStyle: "default",
      styleEdge: 12,
      borderType: "",
      borderRadius: 20,
      shadowType: "spread",
      shadowOpacity: 40,
      shadowPosition: "underlay",
      shadowMode: "presets",
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowSpread: 0,
      shadowColor: "#000000",
      sceneType: "shadow",
      zoom: 100,
      panX: 0,
      panY: 0,
      layoutMode: "single",
      siteUrl: "https://mokk.io",
    };

    setUploadedImages(s.uploadedImages);
    setSelectedDevice(s.selectedDevice);
    setSelectedTemplate(s.selectedTemplate);
    setBackgroundType(s.backgroundType);
    setBackgroundColor(s.backgroundColor);
    setSelectedPreset(s.selectedPreset);
    setDeviceStyle(s.deviceStyle);
    setStyleEdge(s.styleEdge);
    setBorderType(s.borderType);
    setBorderRadius(s.borderRadius);
    setShadowType(s.shadowType);
    setShadowOpacity(s.shadowOpacity);
    setShadowPosition(s.shadowPosition);
    setShadowMode(s.shadowMode);
    setShadowOffsetX(s.shadowOffsetX);
    setShadowOffsetY(s.shadowOffsetY);
    setShadowBlur(s.shadowBlur);
    setShadowSpread(s.shadowSpread);
    setShadowColor(s.shadowColor);
    setSceneType(s.sceneType);
    setZoom(s.zoom);
    setPanX(s.panX);
    setPanY(s.panY);
    setLayoutMode(s.layoutMode);
    setSiteUrl(s.siteUrl);

    setHistory([s]);
    setHistoryIndex(0);
  };

  // ====== NUEVO: drag con commit al historial ======
  const setPanImmediate = useCallback((x: number, y: number) => {
    // mover en tiempo real SIN guardar historial
    setPanX(x);
    setPanY(y);
  }, []);

  const commitPanHistory = useCallback(() => {
    // al soltar el drag guardamos una entrada con el estado actual (post-drag)
    saveToHistory();
  }, [saveToHistory]);
  // ================================================

  return (
    <ExportProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#0d0d0d]">
        {isMobile ? (
          <>
            <div className="flex h-screen w-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 bg-[##0d0d0d] p-4">
                <TopBar
                  onStartOver={resetToDefaults}
                  onUndo={undo}
                  onRedo={redo}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onToggleLeftSidebar={toggleLeftSidebar}
                  onToggleRightSidebar={toggleRightSidebar}
                  showLeftSidebar={showLeftSidebar}
                  showRightSidebar={showRightSidebar}
                  isMobile={isMobile}
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <MockupCanvas
                  uploadedImages={uploadedImages}
                  selectedDevice={selectedDevice}
                  selectedTemplate={selectedTemplate}
                  siteUrl={siteUrl}
                  borderType={borderType}
                  selectedPreset={selectedPreset}
                  backgroundType={backgroundType}
                  backgroundColor={backgroundColor}
                  padding={60}
                  shadowOpacity={shadowOpacity}
                  borderRadius={borderRadius}
                  rotation={0}
                  scale={100}
                  deviceStyle={deviceStyle}
                  styleEdge={styleEdge}
                  shadowType={shadowType}
                  shadowMode={shadowMode}
                  shadowOffsetX={shadowOffsetX}
                  shadowOffsetY={shadowOffsetY}
                  shadowBlur={shadowBlur}
                  shadowSpread={shadowSpread}
                  shadowColor={shadowColor}
                  sceneType={sceneType}
                  zoom={zoom}
                  panX={panX}
                  panY={panY}
                  layoutMode={layoutMode}
                  onImageUpload={handleImageUpload}
                />
              </div>

              {(showLeftSidebar || showRightSidebar) && (
                <div
                  className="absolute inset-0 top-24 bg-black/50 z-40 transition-opacity duration-300"
                  onClick={() => {
                    setShowLeftSidebar(false);
                    setShowRightSidebar(false);
                  }}
                />
              )}

              <div
                className={`absolute left-0 top-24 z-50 h-[calc(100vh-6rem)] w-full max-w-sm bg-[#0d0d0d] border-r border-white/10 overflow-hidden transition-all duration-300 ease-out ${
                  showLeftSidebar
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0 pointer-events-none"
                }`}
              >
                <div className="h-full overflow-y-auto">
                  <LeftSidebar
                    uploadedImages={uploadedImages}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                    selectedDevice={selectedDevice}
                    setSelectedDevice={setSelectedDeviceWithHistory}
                    backgroundType={backgroundType}
                    setBackgroundType={setBackgroundTypeWithHistory}
                    backgroundColor={backgroundColor}
                    setBackgroundColor={setBackgroundColorWithHistory}
                    selectedPreset={selectedPreset}
                    setSelectedPreset={setSelectedPresetWithHistory}
                    deviceStyle={deviceStyle}
                    setDeviceStyle={setDeviceStyleWithHistory}
                    styleEdge={styleEdge}
                    setStyleEdge={setStyleEdgeWithHistory}
                    borderType={borderType}
                    setBorderType={setBorderTypeWithHistory}
                    borderRadius={borderRadius}
                    setBorderRadius={setBorderRadiusWithHistory}
                    shadowType={shadowType}
                    setShadowType={setShadowTypeWithHistory}
                    shadowOpacity={shadowOpacity}
                    setShadowOpacity={setShadowOpacityWithHistory}
                    shadowMode={shadowMode}
                    setShadowMode={setShadowModeWithHistory}
                    shadowOffsetX={shadowOffsetX}
                    setShadowOffsetX={setShadowOffsetXWithHistory}
                    shadowOffsetY={shadowOffsetY}
                    setShadowOffsetY={setShadowOffsetYWithHistory}
                    shadowBlur={shadowBlur}
                    setShadowBlur={setShadowBlurWithHistory}
                    shadowSpread={shadowSpread}
                    setShadowSpread={setShadowSpreadWithHistory}
                    shadowColor={shadowColor}
                    setShadowColor={setShadowColorWithHistory}
                    sceneType={sceneType}
                    setSceneType={setSceneTypeWithHistory}
                    layoutMode={layoutMode}
                    siteUrl={siteUrl}
                    setSiteUrl={setSiteUrlWithHistory}
                  />
                </div>
              </div>

              <div
                className={`absolute right-0 top-24 z-50 h-[calc(100vh-6rem)] w-full max-w-sm bg-[#0d0d0d] border-l border-white/10 overflow-hidden transition-all duration-300 ease-out ${
                  showRightSidebar
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0 pointer-events-none"
                }`}
              >
                <div className="h-full overflow-y-auto">
                  <RightSidebar
                    uploadedImages={uploadedImages}
                    selectedDevice={selectedDevice}
                    zoom={zoom}
                    setZoom={setZoomWithHistory}
                    siteUrl={siteUrl}
                    setSiteUrl={setSiteUrlWithHistory}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplateWithHistory}
                    layoutMode={layoutMode}
                    setLayoutMode={setLayoutModeWithHistory}
                    padding={60}
                    shadowOpacity={shadowOpacity}
                    borderRadius={borderRadius}
                    borderType={borderType}
                    rotation={0}
                    scale={100}
                    deviceStyle={deviceStyle}
                    styleEdge={styleEdge}
                    shadowType={shadowType}
                    backgroundType={backgroundType}
                    backgroundColor={backgroundColor}
                    selectedPreset={selectedPreset}
                    panX={panX}
                    panY={panY}
                    setPanX={setPanXWithHistory}
                    setPanY={setPanYWithHistory}
                    /* NUEVO: drag con historial */
                    setPanImmediate={setPanImmediate}
                    commitPanHistory={commitPanHistory}
                    sceneType={sceneType}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <LeftSidebar
              uploadedImages={uploadedImages}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              selectedDevice={selectedDevice}
              setSelectedDevice={setSelectedDeviceWithHistory}
              backgroundType={backgroundType}
              setBackgroundType={setBackgroundTypeWithHistory}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColorWithHistory}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPresetWithHistory}
              deviceStyle={deviceStyle}
              setDeviceStyle={setDeviceStyleWithHistory}
              styleEdge={styleEdge}
              setStyleEdge={setStyleEdgeWithHistory}
              borderType={borderType}
              setBorderType={setBorderTypeWithHistory}
              borderRadius={borderRadius}
              setBorderRadius={setBorderRadiusWithHistory}
              shadowType={shadowType}
              setShadowType={setShadowTypeWithHistory}
              shadowOpacity={shadowOpacity}
              setShadowOpacity={setShadowOpacityWithHistory}
              shadowMode={shadowMode}
              setShadowMode={setShadowModeWithHistory}
              shadowOffsetX={shadowOffsetX}
              setShadowOffsetX={setShadowOffsetXWithHistory}
              shadowOffsetY={shadowOffsetY}
              setShadowOffsetY={setShadowOffsetYWithHistory}
              shadowBlur={shadowBlur}
              setShadowBlur={setShadowBlurWithHistory}
              shadowSpread={shadowSpread}
              setShadowSpread={setShadowSpreadWithHistory}
              shadowColor={shadowColor}
              setShadowColor={setShadowColorWithHistory}
              sceneType={sceneType}
              setSceneType={setSceneTypeWithHistory}
              layoutMode={layoutMode}
              siteUrl={siteUrl}
              setSiteUrl={setSiteUrlWithHistory}
            />

            <div className="flex flex-1 flex-col min-w-0 gap-8">
              <TopBar
                onStartOver={resetToDefaults}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onToggleLeftSidebar={toggleLeftSidebar}
                onToggleRightSidebar={toggleRightSidebar}
                showLeftSidebar={showLeftSidebar}
                showRightSidebar={showRightSidebar}
                isMobile={isMobile}
              />

              <div className="flex-1 overflow-hidden">
                <MockupCanvas
                  uploadedImages={uploadedImages}
                  selectedDevice={selectedDevice}
                  selectedTemplate={selectedTemplate}
                  siteUrl={siteUrl}
                  borderType={borderType}
                  selectedPreset={selectedPreset}
                  backgroundType={backgroundType}
                  backgroundColor={backgroundColor}
                  padding={60}
                  shadowOpacity={shadowOpacity}
                  borderRadius={borderRadius}
                  rotation={0}
                  scale={100}
                  deviceStyle={deviceStyle}
                  styleEdge={styleEdge}
                  shadowType={shadowType}
                  shadowMode={shadowMode}
                  shadowOffsetX={shadowOffsetX}
                  shadowOffsetY={shadowOffsetY}
                  shadowBlur={shadowBlur}
                  shadowSpread={shadowSpread}
                  shadowColor={shadowColor}
                  sceneType={sceneType}
                  zoom={zoom}
                  panX={panX}
                  panY={panY}
                  layoutMode={layoutMode}
                  onImageUpload={handleImageUpload}
                />
              </div>
            </div>

            <RightSidebar
              uploadedImages={uploadedImages}
              selectedDevice={selectedDevice}
              zoom={zoom}
              setZoom={setZoomWithHistory}
              siteUrl={siteUrl}
              setSiteUrl={setSiteUrlWithHistory}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplateWithHistory}
              layoutMode={layoutMode}
              setLayoutMode={setLayoutModeWithHistory}
              padding={60}
              shadowOpacity={shadowOpacity}
              borderRadius={borderRadius}
              borderType={borderType}
              rotation={0}
              scale={100}
              deviceStyle={deviceStyle}
              styleEdge={styleEdge}
              shadowType={shadowType}
              backgroundType={backgroundType}
              backgroundColor={backgroundColor}
              selectedPreset={selectedPreset}
              panX={panX}
              panY={panY}
              setPanX={setPanXWithHistory}
              setPanY={setPanYWithHistory}
              /* NUEVO: drag con historial */
              setPanImmediate={setPanImmediate}
              commitPanHistory={commitPanHistory}
              sceneType={sceneType}
            />
          </>
        )}
      </div>
    </ExportProvider>
  );
}
