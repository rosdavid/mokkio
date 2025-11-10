"use client";

import { useState, useRef, useEffect } from "react";

export interface Guide {
  id: string;
  type: "horizontal" | "vertical";
  position: number;
  color: string;
  isSmartGuide?: boolean; // Auto-generated guides (center, element edges)
}

interface CanvasGuidesProps {
  guides: Guide[];
  onGuidesChange: (guides: Guide[]) => void;
  showRulers: boolean;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  panX: number;
  panY: number;
  snapGuides?: Guide[]; // Guías dinámicas de snapping durante drag
  texts?: Array<{
    id: string;
    x: number;
    y: number;
    fontSize: number;
    content: string;
  }>;
  mockupPositions?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

const RULER_SIZE = 40; // px - Aumentado para mejor visibilidad
const SNAP_THRESHOLD = 8; // px - Aumentado para mejor UX
const SMART_GUIDE_COLOR = "#ef4444"; // Rojo para guías inteligentes
const USER_GUIDE_COLOR = "#ef4444"; // Rojo para guías de usuario

export function CanvasGuides({
  guides,
  onGuidesChange,
  showRulers,
  canvasWidth,
  canvasHeight,
  // zoom, panX, panY not used
  snapGuides = [], // Guías dinámicas de snapping
  texts = [],
  mockupPositions = [],
}: CanvasGuidesProps) {
  const [draggingGuide, setDraggingGuide] = useState<string | null>(null);
  const [draggingFromRuler, setDraggingFromRuler] = useState<
    "horizontal" | "vertical" | null
  >(null);
  const [smartGuides, setSmartGuides] = useState<Guide[]>([]);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate smart guides (center, element edges)
  useEffect(() => {
    if (!showRulers) {
      setSmartGuides([]);
      return;
    }

    const newSmartGuides: Guide[] = [];

    // Canvas center guides
    newSmartGuides.push({
      id: "smart-center-h",
      type: "horizontal",
      position: canvasHeight / 2,
      color: SMART_GUIDE_COLOR,
      isSmartGuide: true,
    });

    newSmartGuides.push({
      id: "smart-center-v",
      type: "vertical",
      position: canvasWidth / 2,
      color: SMART_GUIDE_COLOR,
      isSmartGuide: true,
    });

    // Text element guides
    texts.forEach((text, idx) => {
      const textWidth = text.content.length * (text.fontSize * 0.6); // Approximate
      const textHeight = text.fontSize * 1.2;

      // Top edge
      newSmartGuides.push({
        id: `smart-text-${idx}-top`,
        type: "horizontal",
        position: text.y,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      // Bottom edge
      newSmartGuides.push({
        id: `smart-text-${idx}-bottom`,
        type: "horizontal",
        position: text.y + textHeight,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      // Left edge
      newSmartGuides.push({
        id: `smart-text-${idx}-left`,
        type: "vertical",
        position: text.x,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      // Right edge
      newSmartGuides.push({
        id: `smart-text-${idx}-right`,
        type: "vertical",
        position: text.x + textWidth,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });
    });

    // Mockup guides
    mockupPositions.forEach((mockup, idx) => {
      // Top edge
      newSmartGuides.push({
        id: `smart-mockup-${idx}-top`,
        type: "horizontal",
        position: mockup.y,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      // Bottom edge
      newSmartGuides.push({
        id: `smart-mockup-${idx}-bottom`,
        type: "horizontal",
        position: mockup.y + mockup.height,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      // Left edge
      newSmartGuides.push({
        id: `smart-mockup-${idx}-left`,
        type: "vertical",
        position: mockup.x,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      // Right edge
      newSmartGuides.push({
        id: `smart-mockup-${idx}-right`,
        type: "vertical",
        position: mockup.x + mockup.width,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      // Center guides for mockups
      newSmartGuides.push({
        id: `smart-mockup-${idx}-center-h`,
        type: "horizontal",
        position: mockup.y + mockup.height / 2,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });

      newSmartGuides.push({
        id: `smart-mockup-${idx}-center-v`,
        type: "vertical",
        position: mockup.x + mockup.width / 2,
        color: SMART_GUIDE_COLOR,
        isSmartGuide: true,
      });
    });

    setSmartGuides(newSmartGuides);
  }, [showRulers, canvasWidth, canvasHeight, texts, mockupPositions]);

  const handleRulerMouseDown = (
    e: React.MouseEvent,
    type: "horizontal" | "vertical"
  ) => {
    e.preventDefault();
    setDraggingFromRuler(type);

    // Top ruler creates HORIZONTAL guides (top to bottom - vertical line visually)
    // Left ruler creates VERTICAL guides (left to right - horizontal line visually)
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Set initial cursor position
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    const newGuide: Guide = {
      id: `guide-${Date.now()}`,
      type,
      // Horizontal guides use X position (top ruler → vertical line)
      // Vertical guides use Y position (left ruler → horizontal line)
      position:
        type === "horizontal"
          ? e.clientX - rect.left - RULER_SIZE
          : e.clientY - rect.top - RULER_SIZE,
      color: USER_GUIDE_COLOR,
      isSmartGuide: false,
    };

    onGuidesChange([...guides, newGuide]);
    setDraggingGuide(newGuide.id);
  };

  const handleGuideMouseDown = (e: React.MouseEvent, guideId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingGuide(guideId);

    // Set initial cursor position
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleGuideDoubleClick = (guideId: string) => {
    onGuidesChange(guides.filter((g) => g.id !== guideId));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingGuide && !draggingFromRuler) return;

      // Prevent all other events while dragging
      e.preventDefault();
      e.stopPropagation();

      const guide = guides.find((g) => g.id === draggingGuide);
      if (!guide) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      // Update cursor position for tooltip
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      let newPosition: number;

      // Horizontal guides track X position (top to bottom - vertical line visually)
      // Vertical guides track Y position (left to right - horizontal line visually)
      if (guide.type === "horizontal") {
        newPosition = e.clientX - rect.left - RULER_SIZE;
      } else {
        newPosition = e.clientY - rect.top - RULER_SIZE;
      }

      // Clamp position within canvas bounds
      const maxPosition =
        guide.type === "horizontal" ? canvasWidth : canvasHeight;
      newPosition = Math.max(0, Math.min(newPosition, maxPosition));

      // No snap - pixel by pixel movement
      let finalPosition = newPosition;

      // Only snap to smart guides (alignment with other elements)
      const snapToSmart = smartGuides.find((sg) => {
        if (sg.type !== guide.type) return false;
        return Math.abs(sg.position - newPosition) < SNAP_THRESHOLD;
      });

      if (snapToSmart) {
        finalPosition = snapToSmart.position;
      }

      onGuidesChange(
        guides.map((g) =>
          g.id === draggingGuide ? { ...g, position: finalPosition } : g
        )
      );
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!draggingGuide && !draggingFromRuler) return;

      // Prevent all other events
      e.preventDefault();
      e.stopPropagation();

      // Clear cursor position
      setCursorPosition(null);

      if (draggingFromRuler && draggingGuide) {
        const guide = guides.find((g) => g.id === draggingGuide);
        if (guide) {
          const container = containerRef.current;
          if (container) {
            const rect = container.getBoundingClientRect();

            // Check if guide is outside canvas area (considering rulers)
            const canvasWidth = rect.width - RULER_SIZE;
            const canvasHeight = rect.height - RULER_SIZE;

            const isOutside =
              (guide.type === "horizontal" &&
                (guide.position < 0 || guide.position > canvasWidth)) ||
              (guide.type === "vertical" &&
                (guide.position < 0 || guide.position > canvasHeight));

            if (isOutside) {
              onGuidesChange(guides.filter((g) => g.id !== draggingGuide));
            }
          }
        }
      }

      setDraggingGuide(null);
      setDraggingFromRuler(null);
    };

    if (draggingGuide || draggingFromRuler) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    draggingGuide,
    draggingFromRuler,
    guides,
    onGuidesChange,
    smartGuides,
    canvasWidth,
    canvasHeight,
  ]);

  if (!showRulers) return null;

  // All guides combined (user + smart + snap)
  const allGuides = [...guides, ...smartGuides, ...snapGuides];

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none"
      style={{
        inset: `-${RULER_SIZE}px`,
        zIndex: 1000,
        cursor: draggingGuide || draggingFromRuler ? "grabbing" : "default",
        userSelect: draggingGuide || draggingFromRuler ? "none" : "auto",
      }}
    >
      {/* Top Ruler - Outside canvas */}
      <div
        className="absolute pointer-events-auto cursor-crosshair"
        style={{
          top: 0,
          left: RULER_SIZE,
          right: 0,
          height: RULER_SIZE,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
        onMouseDown={(e) => handleRulerMouseDown(e, "vertical")}
      >
        <div className="relative w-full h-full flex items-center px-2">
          {/* Ruler marks */}
          <div className="absolute inset-0">
            {Array.from({ length: Math.ceil(canvasWidth / 50) }).map((_, i) => {
              const pos = i * 50;
              const isMainMark = i % 2 === 0;
              return (
                <div
                  key={`v-mark-${i}`}
                  className="absolute bottom-0 flex flex-col items-center justify-end"
                  style={{ left: pos }}
                >
                  <div
                    className={`w-px ${isMainMark ? "h-4 bg-foreground/40" : "h-2 bg-foreground/20"}`}
                  />
                  {isMainMark && (
                    <span className="text-[10px] font-medium text-foreground/60 absolute -bottom-5">
                      {pos}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Decorative gradient */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.1) 50%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* Left Ruler - Outside canvas */}
      <div
        className="absolute pointer-events-auto cursor-crosshair"
        style={{
          top: RULER_SIZE,
          left: 0,
          bottom: 0,
          width: RULER_SIZE,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
        onMouseDown={(e) => handleRulerMouseDown(e, "horizontal")}
      >
        <div className="relative w-full h-full flex flex-col items-center py-2">
          {/* Ruler marks */}
          <div className="absolute inset-0">
            {Array.from({ length: Math.ceil(canvasHeight / 50) }).map(
              (_, i) => {
                const pos = i * 50;
                const isMainMark = i % 2 === 0;
                return (
                  <div
                    key={`h-mark-${i}`}
                    className="absolute right-0 flex items-center justify-end"
                    style={{ top: pos }}
                  >
                    <div
                      className={`h-px ${isMainMark ? "w-4 bg-foreground/40" : "w-2 bg-foreground/20"}`}
                    />
                    {isMainMark && (
                      <span
                        className="text-[10px] font-medium text-foreground/60 absolute -right-6"
                        style={{
                          transform: "rotate(-90deg)",
                          transformOrigin: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pos}
                      </span>
                    )}
                  </div>
                );
              }
            )}
          </div>

          {/* Decorative gradient */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.1) 50%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* Corner - Modern design */}
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          top: 0,
          left: 0,
          width: RULER_SIZE,
          height: RULER_SIZE,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.03) 100%)",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className="text-foreground/30"
        >
          <path
            d="M3 3L17 17M3 17L17 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Guides - Smart guides (red) always visible, user guides (blue) when dragging */}
      {allGuides.map((guide) => {
        const isHorizontal = guide.type === "horizontal";
        const isActive = draggingGuide === guide.id;
        const isSmartGuide = guide.isSmartGuide;

        return (
          <div
            key={guide.id}
            className={`absolute pointer-events-auto ${
              isActive ? "" : "transition-all duration-150"
            } ${
              isSmartGuide
                ? "opacity-0 hover:opacity-100"
                : "opacity-80 hover:opacity-100"
            } ${isActive ? "opacity-100 z-50 scale-105" : ""}`}
            style={{
              cursor: isSmartGuide ? "default" : isActive ? "grabbing" : "grab",
              ...(isHorizontal
                ? {
                    // Horizontal guide = vertical line (top to bottom)
                    left: guide.position + RULER_SIZE,
                    top: RULER_SIZE,
                    bottom: 0,
                    width: isSmartGuide ? 1 : isActive ? 3 : 2,
                    background: isSmartGuide
                      ? `linear-gradient(180deg, transparent 0%, ${guide.color} 20%, ${guide.color} 80%, transparent 100%)`
                      : guide.color,
                    boxShadow: isSmartGuide
                      ? `0 0 8px ${guide.color}80, 0 0 2px ${guide.color}`
                      : isActive
                        ? `0 0 12px ${guide.color}80, 0 0 4px ${guide.color}`
                        : `0 0 4px ${guide.color}40`,
                  }
                : {
                    // Vertical guide = horizontal line (left to right)
                    top: guide.position + RULER_SIZE,
                    left: RULER_SIZE,
                    right: 0,
                    height: isSmartGuide ? 1 : isActive ? 3 : 2,
                    background: isSmartGuide
                      ? `linear-gradient(90deg, transparent 0%, ${guide.color} 20%, ${guide.color} 80%, transparent 100%)`
                      : guide.color,
                    boxShadow: isSmartGuide
                      ? `0 0 8px ${guide.color}80, 0 0 2px ${guide.color}`
                      : isActive
                        ? `0 0 12px ${guide.color}80, 0 0 4px ${guide.color}`
                        : `0 0 4px ${guide.color}40`,
                  }),
            }}
            onMouseDown={(e) =>
              !isSmartGuide && handleGuideMouseDown(e, guide.id)
            }
            onDoubleClick={() =>
              !isSmartGuide && handleGuideDoubleClick(guide.id)
            }
          >
            {/* Guide label - Only for user guides or when active */}
            {(!isSmartGuide || isActive) && (
              <div
                className={`absolute text-[10px] px-2 py-1 rounded-md pointer-events-none whitespace-nowrap ${
                  isSmartGuide
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                    : "bg-red-500 text-white shadow-lg shadow-red-500/50"
                } ${isActive ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100 transition-all duration-200"}`}
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  ...(isActive && cursorPosition
                    ? {
                        // Position tooltip near cursor when dragging (fixed offset)
                        left:
                          cursorPosition.x -
                          (isHorizontal ? guide.position + RULER_SIZE : 0) +
                          15,
                        top:
                          cursorPosition.y -
                          (isHorizontal ? 0 : guide.position + RULER_SIZE) -
                          35,
                      }
                    : isHorizontal
                      ? {
                          // Horizontal guide: position tooltip on top, or bottom if too close to top
                          left: 8,
                          ...(guide.position < 40
                            ? { top: 8 }
                            : { bottom: -28 }),
                        }
                      : {
                          // Vertical guide: position tooltip on left, or right if too close to left
                          top: 8,
                          ...(guide.position < 80 ? { left: 8 } : { right: 8 }),
                          writingMode: "vertical-rl" as const,
                        }),
                }}
              >
                {Math.round(guide.position)}px
                {isSmartGuide && " (snap)"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
