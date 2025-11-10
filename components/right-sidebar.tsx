"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Layers, EyeOff } from "lucide-react";
import { getEffectiveZoom as getEffectiveZoomUtil } from "@/lib/mockup-utils"; // <- remove CANVAS_WIDTH import
import { MockupCanvas } from "@/components/mockup-canvas";

interface RightSidebarProps {
  uploadedImages: (string | null)[];
  selectedDevice: string;

  zoom: number;
  setZoom: (zoom: number) => void;

  siteUrl: string;
  setSiteUrl: (url: string) => void;

  selectedTemplate: string | null;
  setSelectedTemplate: (template: string | null) => void;

  layoutMode: "single" | "double" | "triple" | "scene-builder";
  setLayoutMode: (m: "single" | "double" | "triple" | "scene-builder") => void;

  padding: number;
  shadowOpacity: number;
  borderRadius: number;
  borderType: string;
  rotation: number;
  scale: number;

  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
  /** grosor del borde */
  styleEdge: number;

  shadowType: string;

  backgroundType?:
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
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundNoise?: number;
  backgroundBlur?: number;
  selectedPreset?: string;

  panX: number;
  panY: number;

  /** setters históricos (fallback si no pasamos los "immediate") */
  setPanX: (x: number) => void;
  setPanY: (y: number) => void;

  /** nuevos: mover sin historial y commitear al soltar */
  setPanImmediate?: (x: number, y: number) => void;
  commitPanHistory?: () => void;

  sceneType?: "none" | "shadow" | "shapes";

  /** NEW: dynamic canvas size */
  canvasWidth: number;
  canvasHeight: number;

  /** NEW: browser mode for theme switching */
  browserMode?: string;

  /** NEW: magical gradients */
  magicalGradients?: string[];

  /** NEW: Scene FX */
  sceneFxMode?: "default" | "shadows";
  setSceneFxMode?: (mode: "default" | "shadows") => void;
  sceneFxShadow?: string | null;
  setSceneFxShadow?: (shadow: string | null) => void;
  sceneFxOpacity?: number;
  setSceneFxOpacity?: (opacity: number) => void;
  sceneFxLayer?: "overlay" | "underlay";
  setSceneFxLayer?: (layer: "overlay" | "underlay") => void;
}

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

/** Mini clon 1:1 del canvas para una tarjeta de preset. */
function PresetThumb(props: {
  presetId: string;
  isActive: boolean;
  onClick: () => void;
  uploadedImages: (string | null)[];
  selectedDevice: string;
  layoutMode: "single" | "double" | "triple" | "scene-builder";
  backgroundType?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundNoise?: number;
  backgroundBlur?: number;
  selectedPreset?: string;
  padding: number;
  shadowOpacity: number;
  borderRadius: number;
  borderType: string;
  rotation: number;
  scale: number;
  deviceStyle: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
  styleEdge: number;
  shadowType: string;
  siteUrl: string;
  sceneType?: "none" | "shadow" | "shapes";
  /** NEW */
  canvasWidth: number;
  canvasHeight: number;
  browserMode?: string;
  /** NEW: magical gradients */
  magicalGradients?: string[];
}) {
  const {
    presetId,
    isActive,
    onClick,
    uploadedImages,
    selectedDevice,
    layoutMode,
    backgroundType,
    backgroundColor,
    backgroundImage,
    backgroundNoise,
    backgroundBlur,
    selectedPreset,
    padding,
    shadowOpacity,
    borderRadius,
    borderType,
    rotation,
    scale,
    deviceStyle,
    styleEdge,
    shadowType,
    siteUrl,
    sceneType = "none",
    /** NEW */
    canvasWidth,
    canvasHeight,
    browserMode = "light",
    /** NEW: magical gradients */
    magicalGradients,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  useEffect(() => {
    const measure = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r) {
        setW(r.width);
        setH(r.height);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /** NEW: scale to fit by both dimensions */
  const K = useMemo(
    () => Math.min((w || 0) / canvasWidth, (h || 0) / canvasHeight),
    [w, h, canvasWidth, canvasHeight]
  );

  const cloneW = canvasWidth * K;
  const cloneH = canvasHeight * K;
  const cloneLeft = (w - cloneW) / 2;
  const cloneTop = (h - cloneH) / 2;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg overflow-hidden border transition-colors cursor-pointer ${
        isActive
          ? "border-primary ring-2 ring-primary/50"
          : "border-border hover:border-border/80"
      }`}
    >
      <div ref={ref} className="relative aspect-video bg-transparent">
        <div
          className="absolute"
          style={{
            left: cloneLeft,
            top: cloneTop,
            width: cloneW,
            height: cloneH,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: canvasWidth,
              height: canvasHeight,
              transform: `scale(${K})`,
              transformOrigin: "top left",
            }}
          >
            <MockupCanvas
              uploadedImages={uploadedImages}
              selectedDevice={selectedDevice}
              selectedTemplate={presetId}
              selectedPreset={selectedPreset || "purple-pink"}
              backgroundType={
                (backgroundType as
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
                  | "image"
                  | "magical") || "solid"
              }
              backgroundColor={backgroundColor || "#000"}
              backgroundImage={backgroundImage}
              backgroundNoise={backgroundNoise || 0}
              backgroundBlur={backgroundBlur || 0}
              padding={padding}
              shadowOpacity={shadowOpacity}
              borderRadius={borderRadius}
              borderType={borderType}
              rotation={rotation}
              scale={scale}
              deviceStyle={deviceStyle}
              styleEdge={styleEdge}
              shadowType={shadowType}
              sceneType={sceneType}
              zoom={100}
              panX={0}
              panY={0}
              layoutMode={layoutMode}
              siteUrl={siteUrl}
              /** NEW */
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              browserMode={browserMode}
              /** NEW: magical gradients */
              magicalGradients={magicalGradients}
              texts={[]}
              mockupGap={0}
              hideGuides={true}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

export function RightSidebar(props: RightSidebarProps) {
  const {
    uploadedImages,
    selectedDevice,
    zoom,
    setZoom,
    selectedTemplate,
    layoutMode,
    padding,
    shadowOpacity,
    borderRadius,
    borderType,
    rotation,
    scale,
    deviceStyle,
    styleEdge,
    shadowType,
    backgroundType,
    backgroundColor,
    backgroundImage,
    backgroundNoise,
    backgroundBlur,
    selectedPreset,
    panX,
    panY,
    setPanX,
    setPanY,
    setPanImmediate, // 👈 nuevos (opc.)
    commitPanHistory, // 👈 nuevos (opc.)
    siteUrl,
    sceneType = "none",
    /** NEW */
    canvasWidth,
    canvasHeight,
    browserMode = "light",
    /** NEW: magical gradients */
    magicalGradients,
  } = props;

  const LAYOUT_PRESETS =
    layoutMode === "double" ? DOUBLE_LAYOUT_PRESETS : SINGLE_LAYOUT_PRESETS;

  // ---------- Preview de ZOOM ----------
  const previewRef = useRef<HTMLDivElement>(null);
  const [pw, setPw] = useState(0);
  const [ph, setPh] = useState(0);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const dragHappenedRef = useRef(false);
  const [start, setStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const measure = () => {
      const r = previewRef.current?.getBoundingClientRect();
      if (r) {
        setPw(r.width);
        setPh(r.height);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const zAbs = useMemo(
    () =>
      getEffectiveZoomUtil(zoom, layoutMode, selectedDevice, selectedTemplate),
    [zoom, layoutMode, selectedDevice, selectedTemplate]
  );

  /** NEW: generic scale (no 16:9 assumption) */
  const K = useMemo(
    () => Math.min((pw || 0) / canvasWidth, (ph || 0) / canvasHeight),
    [pw, ph, canvasWidth, canvasHeight]
  );

  const cloneW = canvasWidth * K;
  const cloneH = canvasHeight * K;
  const cloneLeft = (pw - cloneW) / 2;
  const cloneTop = (ph - cloneH) / 2;

  const viewportW = cloneW * (96 / zoom);
  const viewportH = cloneH * (96 / zoom);

  // pan mapping to preview coordinates
  const viewportL =
    cloneLeft +
    cloneW / 2 -
    viewportW / 2 +
    panX * (cloneW / canvasWidth) * (96 / zoom);
  const viewportT =
    cloneTop +
    cloneH / 2 -
    viewportH / 2 +
    panY * (cloneH / canvasHeight) * (96 / zoom) -
    2;

  // limits
  const clampPanX = useCallback(
    (x: number) => {
      const max = (canvasWidth / 2) * (zoom / 100);
      return Math.min(max, Math.max(-max, x));
    },
    [zoom, canvasWidth]
  );
  const clampPanY = useCallback(
    (y: number) => {
      const max = (canvasHeight / 2) * (zoom / 100);
      return Math.min(max, Math.max(-max, y));
    },
    [zoom, canvasHeight]
  );

  // rueda: zoom anclado al cursor (histórico ya existente)
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const r = previewRef.current?.getBoundingClientRect();
    if (!r) return;

    const mx = Math.min(Math.max(e.clientX - r.left - cloneLeft, 0), cloneW);
    const my = Math.min(Math.max(e.clientY - r.top - cloneTop, 0), cloneH);

    const ax = (mx - cloneW / 2) / (K || 1);
    const ay = (my - cloneH / 2) / (K || 1);

    const nz = Math.min(800, Math.max(75, Math.round(zoom + -e.deltaY * 0.12)));
    if (nz === zoom) return;

    const zNewAbs = getEffectiveZoomUtil(
      nz,
      layoutMode,
      selectedDevice,
      selectedTemplate
    );
    const rRatio = zAbs / zNewAbs;

    let nx = rRatio * panX + (1 - rRatio) * ax;
    let ny = rRatio * panY + (1 - rRatio) * ay;
    nx = clampPanX(nx);
    ny = clampPanY(ny);

    setZoom(nz); // ⬅️ histórico (tu setter ya lo guarda)
    // mover pan igual que antes
    if (setPanImmediate) setPanImmediate(nx, ny);
    else {
      setPanX(nx);
      setPanY(ny);
    }
    // Como cambiamos pan durante wheel, lo dejamos sin commit extra:
    // setZoomWithHistory ya empuja al historial.
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragHappenedRef.current) {
      dragHappenedRef.current = false;
      return;
    }
    const r = previewRef.current?.getBoundingClientRect();
    if (!r) return;
    const mx = Math.min(Math.max(e.clientX - r.left - cloneLeft, 0), cloneW);
    const my = Math.min(Math.max(e.clientY - r.top - cloneTop, 0), cloneH);
    const nx = clampPanX((mx - cloneW / 2) / (K || 1));
    const ny = clampPanY((my - cloneH / 2) / (K || 1));

    // Click único: queremos historial (como un salto de pan)
    if (setPanImmediate && commitPanHistory) {
      setPanImmediate(nx, ny);
      commitPanHistory();
    } else {
      // fallback: tus setters quizá ya guardan historial
      setPanX(nx);
      setPanY(ny);
    }
  };

  const onDoubleClick = () => {
    setZoom(100);
    if (setPanImmediate && commitPanHistory) {
      setPanImmediate(0, 0);
      commitPanHistory();
    } else {
      setPanX(0);
      setPanY(0);
    }
  };

  // DRAG: mueve sin historial y commitea UNA vez en mouseup
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      const factor = (1 / (K || 1)) * (zoom / 100);
      const nx = clampPanX(panX + dx * factor);
      const ny = clampPanY(panY + dy * factor);

      if (setPanImmediate) setPanImmediate(nx, ny);
      else {
        // fallback: mover tal cual (puede guardar historial si así están tus setters)
        setPanX(nx);
        setPanY(ny);
      }

      // reanclar
      start.x = e.clientX;
      start.y = e.clientY;
      dragHappenedRef.current = true;
    };

    const up = () => {
      draggingRef.current = false;
      setDragging(false);
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);

      // Commit único al historial con la posición final
      if (commitPanHistory) commitPanHistory();
      // en fallback no hacemos nada: si tus setters guardan historial, ya habrá entradas;
      // si no, considera pasar commitPanHistory para consolidar.
    };

    if (dragging) {
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    }
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [
    dragging,
    start,
    panX,
    panY,
    K,
    zoom,
    clampPanX,
    clampPanY,
    setPanX,
    setPanY,
    setPanImmediate,
    commitPanHistory,
  ]);

  const handleSelectTemplate = (id: string) => {
    const next = id === selectedTemplate ? null : id;
    props.setSelectedTemplate(next);
    setZoom(100);
    if (setPanImmediate && commitPanHistory) {
      setPanImmediate(0, 0);
      commitPanHistory();
    } else {
      setPanX(0);
      setPanY(0);
    }
  };

  return (
    <div
      className="w-full md:w-[280px] bg-background overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {/* LAYOUT MODE */}
      <div className="p-4">
        <div className="relative grid grid-cols-3 bg-muted overflow-hidden px-1 py-1 rounded-xl gap-1">
          {/* Active tab indicator */}
          <span
            className="absolute top-1 h-[calc(100%-0.5rem)] bg-muted-foreground/20 rounded-lg transition-all duration-300 pointer-events-none"
            style={{
              width: "calc(33.333% - 0.375rem)",
              left:
                layoutMode === "double"
                  ? "calc(33.333% + 0.25rem)"
                  : layoutMode === "scene-builder"
                    ? "calc(66.666% + 0.10rem)"
                    : "0.25rem",
            }}
          />
          <button
            onClick={() => props.setLayoutMode("single")}
            className="text-xs text-foreground bg-transparent cursor-pointer z-10 h-8 flex items-center justify-center"
            title="Single Mockup"
          >
            <div
              className={`w-3 h-5 rounded-[3px] transition-opacity ${
                layoutMode === "single"
                  ? "bg-foreground/70"
                  : "bg-foreground/40"
              }`}
            ></div>
          </button>
          <button
            onClick={() => props.setLayoutMode("double")}
            className="text-xs text-foreground bg-transparent cursor-pointer z-10 h-8 flex items-center justify-center gap-1"
            title="Double Mockup"
          >
            <div
              className={`w-3 h-5 rounded-[3px] transition-opacity ${
                layoutMode === "double"
                  ? "bg-foreground/70"
                  : "bg-foreground/40"
              }`}
            ></div>
            <div
              className={`w-3 h-5 rounded-[3px] transition-opacity ${
                layoutMode === "double"
                  ? "bg-foreground/70"
                  : "bg-foreground/40"
              }`}
            ></div>
          </button>
          <button
            onClick={() => props.setLayoutMode("scene-builder")}
            className="text-xs text-foreground bg-transparent cursor-pointer z-10 h-8 flex items-center justify-center"
            title="Scene Builder - Multi-Device Layouts"
          >
            <Layers
              className={`w-5 h-5 transition-opacity ${
                layoutMode === "scene-builder"
                  ? "text-foreground/70"
                  : "text-foreground/40"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ZOOM */}
      <div className="p-4 relative">
        {/* Scene Builder Overlay */}
        {layoutMode === "scene-builder" && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-start pt-8 gap-3 p-4"></div>
        )}
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            ZOOM
          </Label>
          <span className="text-xs text-muted-foreground">{zoom}%</span>
        </div>

        <div
          ref={previewRef}
          className="mb-3 rounded-lg aspect-video relative overflow-hidden bg-transparent border border-border"
          onWheel={onWheel}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
        >
          <div
            className="absolute"
            style={{
              left: cloneLeft,
              top: cloneTop,
              width: cloneW,
              height: cloneH,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: canvasWidth,
                height: canvasHeight,
                transform: `scale(${K})`,
                transformOrigin: "top left",
              }}
            >
              <MockupCanvas
                uploadedImages={uploadedImages}
                selectedDevice={selectedDevice}
                selectedTemplate={selectedTemplate}
                selectedPreset={selectedPreset || "purple-pink"}
                backgroundType={
                  (backgroundType as
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
                    | "image"
                    | "magical") || "solid"
                }
                backgroundColor={backgroundColor || "#000"}
                backgroundNoise={backgroundNoise || 0}
                backgroundBlur={backgroundBlur || 0}
                padding={padding}
                shadowOpacity={shadowOpacity}
                borderRadius={borderRadius}
                borderType={borderType}
                rotation={rotation}
                scale={scale}
                deviceStyle={deviceStyle}
                styleEdge={styleEdge}
                shadowType={shadowType}
                sceneType={sceneType}
                zoom={100}
                panX={0}
                panY={0}
                layoutMode={layoutMode}
                siteUrl={siteUrl}
                /** NEW */
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                browserMode={browserMode}
                /** NEW: magical gradients */
                magicalGradients={magicalGradients}
                texts={[]}
                mockupGap={0}
                hideGuides={true}
              />
            </div>
          </div>

          {/* viewport */}
          <div
            className="absolute cursor-grab active:cursor-grabbing"
            style={{
              left: viewportL,
              top: viewportT,
              width: viewportW,
              height: viewportH,
              boxSizing: "content-box",
              borderRadius: 12,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              setDragging(true);
              draggingRef.current = true;
              dragHappenedRef.current = false;
              setStart({ x: e.clientX, y: e.clientY });
            }}
          >
            <div
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 20,
                height: 20,
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 0 0 2px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
            onClick={() => setZoom(Math.max(75, zoom - 1))}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </Button>
          <Slider
            value={[zoom]}
            onValueChange={([v]) => setZoom(v)}
            min={75}
            max={564}
            step={1}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-muted hover:bg-muted/80 text-foreground cursor-pointer"
            onClick={() => setZoom(Math.min(564, zoom + 1))}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* LAYOUT PRESETS */}
      <div className="p-4 relative">
        {/* Scene Builder Overlay */}
        {layoutMode === "scene-builder" && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-sm rounded-lg z-10 flex flex-col items-center justify-start pt-24 gap-3 p-4">
            <EyeOff className="w-8 h-8 text-muted-foreground" />
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Scene Builder Active
              </p>
              <p className="text-xs text-muted-foreground">
                Layout presets are not available in Scene Builder mode
              </p>
            </div>
          </div>
        )}

        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
          LAYOUT PRESETS
        </Label>

        <div className="space-y-2">
          {LAYOUT_PRESETS.map((p) => (
            <PresetThumb
              key={p.id}
              presetId={p.id}
              isActive={selectedTemplate === p.id}
              onClick={() => handleSelectTemplate(p.id)}
              uploadedImages={uploadedImages}
              selectedDevice={selectedDevice}
              layoutMode={layoutMode}
              backgroundType={backgroundType}
              backgroundColor={backgroundColor}
              backgroundImage={backgroundImage}
              backgroundNoise={backgroundNoise}
              backgroundBlur={backgroundBlur}
              selectedPreset={selectedPreset}
              padding={padding}
              shadowOpacity={shadowOpacity}
              borderRadius={borderRadius}
              borderType={borderType}
              rotation={rotation}
              scale={scale}
              deviceStyle={deviceStyle}
              styleEdge={styleEdge}
              shadowType={shadowType}
              siteUrl={siteUrl}
              sceneType={sceneType}
              /** NEW */
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
              browserMode={browserMode}
              /** NEW: magical gradients */
              magicalGradients={magicalGradients}
            />
          ))}
        </div>
      </div>

      <div className="h-0" />
      <div
        className="sticky left-0 right-0 bottom-0 h-12 w-full pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, hsl(var(--background)) 80%)",
        }}
      />
    </div>
  );
}
