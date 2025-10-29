// page.tsx
"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MockupCanvas } from "@/components/mockup-canvas";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { TopBar } from "@/components/top-bar";
import { ExportProvider } from "@/lib/export-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { LandingPopup } from "@/components/landing-page/LandingPopup";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/mockup-utils";

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
    | "texture"
    | "transparent"
    | "image";
  backgroundColor: string;
  backgroundImage?: string;
  selectedPreset: string;
  backgroundNoise: number;
  backgroundBlur: number;

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
  hideMockup: boolean;

  /** NEW: canvas size and preset id */
  canvasWidth: number;
  canvasHeight: number;
  selectedResolution: string;
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
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(
    undefined
  );
  const [selectedPreset, setSelectedPreset] = useState("purple-pink");
  const [backgroundNoise, setBackgroundNoise] = useState(0);
  const [backgroundBlur, setBackgroundBlur] = useState(0);

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
  const [siteUrl, setSiteUrl] = useState<string>("https://mokkio.me");
  const [hideMockup, setHideMockup] = useState(false);

  // ---- Landing Popup
  const [isLandingOpen, setIsLandingOpen] = useState(true);

  // ---- History
  const [history, setHistory] = useState<AppState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // ---- NEW: canvas size and preset id
  const [canvasWidth, setCanvasWidth] = useState(CANVAS_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState(CANVAS_HEIGHT);
  const [selectedResolution, setSelectedResolution] = useState("hd-720p");

  /** Map preset id -> width/height */
  const RESOLUTIONS = useMemo(
    (): Record<string, { w: number; h: number }> => ({
      "hd-720p": { w: 1280, h: 720 },
      "hd-3-2": { w: 1920, h: 1280 },
      "hd-4-3": { w: 1920, h: 1440 },
      "hd-1080p": { w: 1920, h: 1080 },
      "ig-square": { w: 1080, h: 1080 },
      "ig-portrait-45": { w: 1080, h: 1350 },
      "story-1080x1920": { w: 1080, h: 1920 },
      "twitter-1500x500": { w: 1500, h: 500 },
      "twitter-1200x675": { w: 1200, h: 675 },
      "4k-uhd": { w: 3840, h: 2160 },
    }),
    []
  );

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
  const saveToHistory = useCallback(
    (updates: Partial<AppState> = {}) => {
      const currentState: AppState = {
        uploadedImages,
        selectedDevice,
        selectedTemplate,
        backgroundType,
        backgroundColor,
        backgroundImage,
        selectedPreset,
        backgroundNoise,
        backgroundBlur,
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
        hideMockup,
        /** NEW */
        canvasWidth,
        canvasHeight,
        selectedResolution,
        ...updates,
      };
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        const sliced = newHistory.slice(-50);
        setHistoryIndex(sliced.length - 1);
        return sliced;
      });
    },
    [
      uploadedImages,
      selectedDevice,
      selectedTemplate,
      backgroundType,
      backgroundColor,
      backgroundImage,
      selectedPreset,
      backgroundNoise,
      backgroundBlur,
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
      hideMockup,
      /** NEW */
      canvasWidth,
      canvasHeight,
      selectedResolution,
      historyIndex,
    ]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0 && history[historyIndex - 1]) {
      const s = history[historyIndex - 1];
      setUploadedImages(s.uploadedImages);
      setSelectedDevice(s.selectedDevice);
      setSelectedTemplate(s.selectedTemplate);
      setBackgroundType(s.backgroundType);
      setBackgroundColor(s.backgroundColor);
      setBackgroundImage(s.backgroundImage);
      setSelectedPreset(s.selectedPreset);
      setBackgroundNoise(s.backgroundNoise);
      setBackgroundBlur(s.backgroundBlur);
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
      setHideMockup(s.hideMockup);
      /** NEW */
      setCanvasWidth(s.canvasWidth);
      setCanvasHeight(s.canvasHeight);
      setSelectedResolution(s.selectedResolution);
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
      setBackgroundImage(s.backgroundImage);
      setSelectedPreset(s.selectedPreset);
      setBackgroundNoise(s.backgroundNoise);
      setBackgroundBlur(s.backgroundBlur);
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
      setHideMockup(s.hideMockup);
      /** NEW */
      setCanvasWidth(s.canvasWidth);
      setCanvasHeight(s.canvasHeight);
      setSelectedResolution(s.selectedResolution);
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
      backgroundImage: undefined,
      selectedPreset: "purple-pink",
      backgroundNoise: 0,
      backgroundBlur: 0,
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
      siteUrl: "https://mokkio.me",
      hideMockup: false,
      /** NEW defaults */
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      selectedResolution: "hd-720p",
    };
    setHistory([initialState]);
    setHistoryIndex(0);
  }, []);

  // ---- Landing Popup: disable body scroll when open
  useEffect(() => {
    if (isLandingOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLandingOpen]);

  // Setters con history
  const setUploadedImagesWithHistory = useCallback(
    (
      value:
        | (string | null)[]
        | ((prev: (string | null)[]) => (string | null)[])
    ) => {
      const newValue =
        typeof value === "function" ? value(uploadedImages) : value;
      setUploadedImages(newValue);
      saveToHistory({ uploadedImages: newValue });
    },
    [saveToHistory, uploadedImages]
  );
  const setSelectedDeviceWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      const newValue = typeof v === "function" ? v(selectedDevice) : v;
      setSelectedDevice(newValue);
      saveToHistory({ selectedDevice: newValue });
    },
    [saveToHistory, selectedDevice]
  );
  const setSelectedTemplateWithHistory = useCallback(
    (v: string | null | ((p: string | null) => string | null)) => {
      const newValue = typeof v === "function" ? v(selectedTemplate) : v;
      setSelectedTemplate(newValue);
      saveToHistory({ selectedTemplate: newValue });
    },
    [saveToHistory, selectedTemplate]
  );
  const setBackgroundTypeWithHistory = useCallback(
    (
      v:
        | AppState["backgroundType"]
        | ((p: AppState["backgroundType"]) => AppState["backgroundType"])
    ) => {
      const newValue = typeof v === "function" ? v(backgroundType) : v;
      setBackgroundType(newValue);
      saveToHistory({ backgroundType: newValue });
    },
    [saveToHistory, backgroundType]
  );
  const setBackgroundColorWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      const newValue = typeof v === "function" ? v(backgroundColor) : v;
      setBackgroundColor(newValue);
      saveToHistory({ backgroundColor: newValue });
    },
    [saveToHistory, backgroundColor]
  );
  const setBackgroundImageWithHistory = useCallback(
    (
      v: string | undefined | ((p: string | undefined) => string | undefined)
    ) => {
      const newValue = typeof v === "function" ? v(backgroundImage) : v;
      setBackgroundImage(newValue);
      saveToHistory({ backgroundImage: newValue });
    },
    [saveToHistory, backgroundImage]
  );
  const setSelectedPresetWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      const newValue = typeof v === "function" ? v(selectedPreset) : v;
      setSelectedPreset(newValue);
      saveToHistory({ selectedPreset: newValue });
    },
    [saveToHistory, selectedPreset]
  );
  const setBackgroundNoiseWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(backgroundNoise) : v;
      setBackgroundNoise(newValue);
      saveToHistory({ backgroundNoise: newValue });
    },
    [saveToHistory, backgroundNoise]
  );
  const setBackgroundBlurWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(backgroundBlur) : v;
      setBackgroundBlur(newValue);
      saveToHistory({ backgroundBlur: newValue });
    },
    [saveToHistory, backgroundBlur]
  );
  const setDeviceStyleWithHistory = useCallback(
    (
      v:
        | AppState["deviceStyle"]
        | ((p: AppState["deviceStyle"]) => AppState["deviceStyle"])
    ) => {
      const newValue = typeof v === "function" ? v(deviceStyle) : v;
      setDeviceStyle(newValue);
      saveToHistory({ deviceStyle: newValue });
    },
    [saveToHistory, deviceStyle]
  );
  const setStyleEdgeWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(styleEdge) : v;
      setStyleEdge(newValue);
      saveToHistory({ styleEdge: newValue });
    },
    [saveToHistory, styleEdge]
  );

  const setBorderTypeWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      const newValue = typeof v === "function" ? v(borderType) : v;
      setBorderType(newValue);
      saveToHistory({ borderType: newValue });
    },
    [saveToHistory, borderType]
  );
  const setBorderRadiusWithHistory = useCallback(
    (value: number | ((prev: number) => number)) => {
      const newRadius =
        typeof value === "function" ? value(borderRadius) : value;
      setBorderRadius(newRadius);
      const radiusToType: Record<number, string> = {
        0: "sharp",
        20: "curved",
        40: "round",
      };
      const newType = radiusToType[newRadius] || "";
      setBorderType(newType);
      saveToHistory({ borderRadius: newRadius, borderType: newType });
    },
    [saveToHistory, borderRadius]
  );

  // Immediate setters for real-time updates without history
  const setBorderRadiusImmediate = useCallback((value: number) => {
    setBorderRadius(value);
  }, []);
  const setStyleEdgeImmediate = useCallback((value: number) => {
    setStyleEdge(value);
  }, []);
  const setShadowOpacityImmediate = useCallback((value: number) => {
    setShadowOpacity(value);
  }, []);
  const setShadowOffsetXImmediate = useCallback((value: number) => {
    setShadowOffsetX(value);
  }, []);
  const setShadowOffsetYImmediate = useCallback((value: number) => {
    setShadowOffsetY(value);
  }, []);
  const setShadowBlurImmediate = useCallback((value: number) => {
    setShadowBlur(value);
  }, []);
  const setShadowSpreadImmediate = useCallback((value: number) => {
    setShadowSpread(value);
  }, []);

  const setShadowTypeWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      const newValue = typeof v === "function" ? v(shadowType) : v;
      setShadowType(newValue);
      saveToHistory({ shadowType: newValue });
    },
    [saveToHistory, shadowType]
  );
  const setShadowOpacityWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(shadowOpacity) : v;
      setShadowOpacity(newValue);
      saveToHistory({ shadowOpacity: newValue });
    },
    [saveToHistory, shadowOpacity]
  );
  const setShadowModeWithHistory = useCallback(
    (
      v:
        | "presets"
        | "custom"
        | ((p: "presets" | "custom") => "presets" | "custom")
    ) => {
      const newValue = typeof v === "function" ? v(shadowMode) : v;
      setShadowMode(newValue);
      saveToHistory({ shadowMode: newValue });
    },
    [saveToHistory, shadowMode]
  );
  const setShadowOffsetXWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(shadowOffsetX) : v;
      setShadowOffsetX(newValue);
      saveToHistory({ shadowOffsetX: newValue });
    },
    [saveToHistory, shadowOffsetX]
  );
  const setShadowOffsetYWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(shadowOffsetY) : v;
      setShadowOffsetY(newValue);
      saveToHistory({ shadowOffsetY: newValue });
    },
    [saveToHistory, shadowOffsetY]
  );
  const setShadowBlurWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(shadowBlur) : v;
      setShadowBlur(newValue);
      saveToHistory({ shadowBlur: newValue });
    },
    [saveToHistory, shadowBlur]
  );
  const setShadowSpreadWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(shadowSpread) : v;
      setShadowSpread(newValue);
      saveToHistory({ shadowSpread: newValue });
    },
    [saveToHistory, shadowSpread]
  );
  const setShadowColorWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      const newValue = typeof v === "function" ? v(shadowColor) : v;
      setShadowColor(newValue);
      saveToHistory({ shadowColor: newValue });
    },
    [saveToHistory, shadowColor]
  );

  const setSceneTypeWithHistory = useCallback(
    (
      v:
        | AppState["sceneType"]
        | ((p: AppState["sceneType"]) => AppState["sceneType"])
    ) => {
      const newValue = typeof v === "function" ? v(sceneType) : v;
      setSceneType(newValue);
      saveToHistory({ sceneType: newValue });
    },
    [saveToHistory, sceneType]
  );
  const setZoomWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(zoom) : v;
      setZoom(newValue);
      saveToHistory({ zoom: newValue });
    },
    [saveToHistory, zoom]
  );
  const setPanXWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(panX) : v;
      setPanX(newValue);
      saveToHistory({ panX: newValue });
    },
    [saveToHistory, panX]
  );
  const setPanYWithHistory = useCallback(
    (v: number | ((p: number) => number)) => {
      const newValue = typeof v === "function" ? v(panY) : v;
      setPanY(newValue);
      saveToHistory({ panY: newValue });
    },
    [saveToHistory, panY]
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
      const newValue = typeof v === "function" ? v(layoutMode) : v;
      setLayoutMode(newValue);
      saveToHistory({ layoutMode: newValue });
    },
    [saveToHistory, layoutMode]
  );
  const setSiteUrlWithHistory = useCallback(
    (v: string | ((p: string) => string)) => {
      const newValue = typeof v === "function" ? v(siteUrl) : v;
      setSiteUrl(newValue);
      saveToHistory({ siteUrl: newValue });
    },
    [saveToHistory, siteUrl]
  );

  const onToggleHideMockup = () => setHideMockup(!hideMockup);

  // setter para el preset con history
  const setSelectedResolutionWithHistory = useCallback(
    (id: string) => {
      const r = RESOLUTIONS[id] ?? RESOLUTIONS["hd-720p"];
      setSelectedResolution(id);
      setCanvasWidth(r.w);
      setCanvasHeight(r.h);
      saveToHistory({
        selectedResolution: id,
        canvasWidth: r.w,
        canvasHeight: r.h,
      });
    },
    [saveToHistory, RESOLUTIONS]
  );

  const resetToDefaults = () => {
    const s: AppState = {
      uploadedImages: [null, null, null, null],
      selectedDevice: "screenshot",
      selectedTemplate: null,
      backgroundType: "gradient",
      backgroundColor: "#6366f1",
      backgroundImage: undefined,
      selectedPreset: "purple-pink",
      backgroundNoise: 0,
      backgroundBlur: 0,
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
      siteUrl: "https://mokkio.me",
      hideMockup: false,
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
      selectedResolution: "hd-720p",
    };

    setUploadedImages(s.uploadedImages);
    setSelectedDevice(s.selectedDevice);
    setSelectedTemplate(s.selectedTemplate);
    setBackgroundType(s.backgroundType);
    setBackgroundColor(s.backgroundColor);
    setBackgroundImage(s.backgroundImage);
    setSelectedPreset(s.selectedPreset);
    setBackgroundNoise(s.backgroundNoise);
    setBackgroundBlur(s.backgroundBlur);
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
    setHideMockup(s.hideMockup);
    setCanvasWidth(s.canvasWidth);
    setCanvasHeight(s.canvasHeight);
    setSelectedResolution(s.selectedResolution);

    setHistory([s]);
    setHistoryIndex(0);
  };

  // ====== NUEVO: drag con commit al historial ======
  const setPanImmediate = useCallback((x: number, y: number) => {
    setPanX(x);
    setPanY(y);
  }, []);

  const commitPanHistory = useCallback(() => {
    saveToHistory();
  }, [saveToHistory]);
  // ================================================

  return (
    <ExportProvider>
      {isLandingOpen && (
        <LandingPopup onClose={() => setIsLandingOpen(false)} />
      )}
      <div className="flex h-screen w-full overflow-hidden bg-[#0d0d0d]">
        {isMobile ? (
          <>
            <div className="flex h-screen w-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0d0d0d] p-4">
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

              {/* ⬇️ Wrapper centrado + overflow-auto (móvil) */}
              <div className="flex-1 overflow-auto">
                <div className="h-full w-full flex items-center justify-center">
                  <MockupCanvas
                    uploadedImages={uploadedImages}
                    selectedDevice={selectedDevice}
                    selectedTemplate={selectedTemplate}
                    siteUrl={siteUrl}
                    borderType={borderType}
                    selectedPreset={selectedPreset}
                    backgroundType={backgroundType}
                    backgroundColor={backgroundColor}
                    backgroundImage={backgroundImage}
                    backgroundNoise={backgroundNoise}
                    backgroundBlur={backgroundBlur}
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
                    hideMockup={hideMockup}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                  />
                </div>
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
                    backgroundImage={backgroundImage}
                    setBackgroundImage={setBackgroundImageWithHistory}
                    selectedPreset={selectedPreset}
                    setSelectedPreset={setSelectedPresetWithHistory}
                    backgroundNoise={backgroundNoise}
                    setBackgroundNoise={setBackgroundNoiseWithHistory}
                    backgroundBlur={backgroundBlur}
                    setBackgroundBlur={setBackgroundBlurWithHistory}
                    deviceStyle={deviceStyle}
                    setDeviceStyle={setDeviceStyleWithHistory}
                    styleEdge={styleEdge}
                    setStyleEdge={setStyleEdgeWithHistory}
                    setStyleEdgeImmediate={setStyleEdgeImmediate}
                    borderType={borderType}
                    setBorderType={setBorderTypeWithHistory}
                    borderRadius={borderRadius}
                    setBorderRadius={setBorderRadiusWithHistory}
                    setBorderRadiusImmediate={setBorderRadiusImmediate}
                    shadowType={shadowType}
                    setShadowType={setShadowTypeWithHistory}
                    shadowOpacity={shadowOpacity}
                    setShadowOpacity={setShadowOpacityWithHistory}
                    setShadowOpacityImmediate={setShadowOpacityImmediate}
                    shadowMode={shadowMode}
                    setShadowMode={setShadowModeWithHistory}
                    shadowOffsetX={shadowOffsetX}
                    setShadowOffsetX={setShadowOffsetXWithHistory}
                    setShadowOffsetXImmediate={setShadowOffsetXImmediate}
                    shadowOffsetY={shadowOffsetY}
                    setShadowOffsetY={setShadowOffsetYWithHistory}
                    setShadowOffsetYImmediate={setShadowOffsetYImmediate}
                    shadowBlur={shadowBlur}
                    setShadowBlur={setShadowBlurWithHistory}
                    setShadowBlurImmediate={setShadowBlurImmediate}
                    shadowSpread={shadowSpread}
                    setShadowSpread={setShadowSpreadWithHistory}
                    setShadowSpreadImmediate={setShadowSpreadImmediate}
                    shadowColor={shadowColor}
                    setShadowColor={setShadowColorWithHistory}
                    sceneType={sceneType}
                    setSceneType={setSceneTypeWithHistory}
                    layoutMode={layoutMode}
                    siteUrl={siteUrl}
                    setSiteUrl={setSiteUrlWithHistory}
                    hideMockup={hideMockup}
                    onToggleHideMockup={onToggleHideMockup}
                    selectedResolution={selectedResolution}
                    setSelectedResolution={setSelectedResolutionWithHistory}
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
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
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
              backgroundImage={backgroundImage}
              setBackgroundImage={setBackgroundImageWithHistory}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPresetWithHistory}
              backgroundNoise={backgroundNoise}
              setBackgroundNoise={setBackgroundNoiseWithHistory}
              backgroundBlur={backgroundBlur}
              setBackgroundBlur={setBackgroundBlurWithHistory}
              deviceStyle={deviceStyle}
              setDeviceStyle={setDeviceStyleWithHistory}
              styleEdge={styleEdge}
              setStyleEdge={setStyleEdgeWithHistory}
              setStyleEdgeImmediate={setStyleEdgeImmediate}
              borderType={borderType}
              setBorderType={setBorderTypeWithHistory}
              borderRadius={borderRadius}
              setBorderRadius={setBorderRadiusWithHistory}
              setBorderRadiusImmediate={setBorderRadiusImmediate}
              shadowType={shadowType}
              setShadowType={setShadowTypeWithHistory}
              shadowOpacity={shadowOpacity}
              setShadowOpacity={setShadowOpacityWithHistory}
              setShadowOpacityImmediate={setShadowOpacityImmediate}
              shadowMode={shadowMode}
              setShadowMode={setShadowModeWithHistory}
              shadowOffsetX={shadowOffsetX}
              setShadowOffsetX={setShadowOffsetXWithHistory}
              setShadowOffsetXImmediate={setShadowOffsetXImmediate}
              shadowOffsetY={shadowOffsetY}
              setShadowOffsetY={setShadowOffsetYWithHistory}
              setShadowOffsetYImmediate={setShadowOffsetYImmediate}
              shadowBlur={shadowBlur}
              setShadowBlur={setShadowBlurWithHistory}
              setShadowBlurImmediate={setShadowBlurImmediate}
              shadowSpread={shadowSpread}
              setShadowSpread={setShadowSpreadWithHistory}
              setShadowSpreadImmediate={setShadowSpreadImmediate}
              shadowColor={shadowColor}
              setShadowColor={setShadowColorWithHistory}
              sceneType={sceneType}
              setSceneType={setSceneTypeWithHistory}
              layoutMode={layoutMode}
              siteUrl={siteUrl}
              setSiteUrl={setSiteUrlWithHistory}
              hideMockup={hideMockup}
              onToggleHideMockup={onToggleHideMockup}
              selectedResolution={selectedResolution}
              setSelectedResolution={setSelectedResolutionWithHistory}
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

              {/* ⬇️ Wrapper centrado + overflow-auto (desktop) */}
              <div className="flex-1 overflow-auto">
                <div className="h-full w-full flex items-center justify-center">
                  <MockupCanvas
                    uploadedImages={uploadedImages}
                    selectedDevice={selectedDevice}
                    selectedTemplate={selectedTemplate}
                    siteUrl={siteUrl}
                    borderType={borderType}
                    selectedPreset={selectedPreset}
                    backgroundType={backgroundType}
                    backgroundColor={backgroundColor}
                    backgroundImage={backgroundImage}
                    backgroundNoise={backgroundNoise}
                    backgroundBlur={backgroundBlur}
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
                    hideMockup={hideMockup}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                  />
                </div>
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
              backgroundImage={backgroundImage}
              backgroundNoise={backgroundNoise}
              backgroundBlur={backgroundBlur}
              selectedPreset={selectedPreset}
              panX={panX}
              panY={panY}
              setPanX={setPanXWithHistory}
              setPanY={setPanYWithHistory}
              /* NUEVO: drag con historial */
              setPanImmediate={setPanImmediate}
              commitPanHistory={commitPanHistory}
              sceneType={sceneType}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />
          </>
        )}
      </div>
    </ExportProvider>
  );
}
