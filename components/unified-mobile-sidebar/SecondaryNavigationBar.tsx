"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  MonitorSmartphone,
  ImageIcon,
  Monitor,
  Square,
  Palette,
  Sparkles,
  SquaresExclude,
  Maximize,
  Type,
  ZoomIn,
  Grid3X3,
} from "lucide-react";

type MainSection = "mockup" | "frame" | "layout";

interface SecondaryNavigationBarProps {
  activeMainSection: MainSection | null;
  activeSecondarySection: string | null;
  onSecondaryClick: (sectionId: string) => void;
  renderSecondaryContent: (sectionId: string) => React.ReactNode;
  onBackToPrimary?: () => void;
  isShadowPreviewMode?: boolean;
}

const getSecondaryButtons = (section: MainSection) => {
  switch (section) {
    case "mockup":
      return [
        { id: "device", label: "Device", iconName: "MonitorSmartphone" },
        { id: "media", label: "Media", iconName: "ImageIcon" },
        { id: "browser", label: "Style", iconName: "Monitor" },
        { id: "border", label: "Border", iconName: "Square" },
        { id: "background", label: "Background", iconName: "Palette" },
        { id: "shadow", label: "Shadow", iconName: "SquaresExclude" },
      ];
    case "frame":
      return [
        { id: "resolution", label: "Resolution", iconName: "Maximize" },
        { id: "effects", label: "Effects", iconName: "Sparkles" },
        { id: "text", label: "Text", iconName: "Type" },
      ];
    case "layout":
      return [
        { id: "zoom", label: "Zoom", iconName: "ZoomIn" },
        { id: "presets", label: "Presets", iconName: "Grid3X3" },
      ];
    default:
      return [];
  }
};

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "Smartphone":
      return MonitorSmartphone;
    case "ImageIcon":
      return ImageIcon;
    case "Monitor":
      return Monitor;
    case "Square":
      return Square;
    case "Palette":
      return Palette;
    case "Sparkles":
      return Sparkles;
    case "SquaresExclude":
      return SquaresExclude;
    case "Maximize":
      return Maximize;
    case "Type":
      return Type;
    case "ZoomIn":
      return ZoomIn;
    case "Grid3X3":
      return Grid3X3;
    default:
      return MonitorSmartphone;
  }
};

export function SecondaryNavigationBar({
  activeMainSection,
  activeSecondarySection,
  onSecondaryClick,
  renderSecondaryContent,
  isShadowPreviewMode = false,
}: SecondaryNavigationBarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!activeMainSection) return null;

  const secondaryButtons = getSecondaryButtons(activeMainSection);

  if (activeSecondarySection) {
    // Full-screen container for mobile device selection
    if (isMobile && activeSecondarySection === "device") {
      return (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 export-exclude">
          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border-t border-white/20 rounded-t-3xl shadow-2xl shadow-black/50 animate-in slide-in-from-bottom duration-300">
            <div className="p-4">
              {renderSecondaryContent(activeSecondarySection)}
            </div>
          </div>
        </div>
      );
    }

    // Regular popover for other cases
    return (
      <div
        className={`mx-4 mb-5 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20 animate-in slide-in-from-bottom-2 duration-300 z-50 ${
          isShadowPreviewMode ? "opacity-60 pointer-events-auto" : ""
        } export-exclude`}
      >
        {renderSecondaryContent(activeSecondarySection)}
      </div>
    );
  }

  return (
    <div className="mx-4 mb-5 p-4 rounded-2xl animate-in slide-in-from-bottom-2 duration-300 z-50 export-exclude">
      <div className="relative">
        {/* Contenedor scrollable con padding izquierdo para el chevron */}
        <div
          className="flex gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {secondaryButtons.map((button) => {
            const IconComponent = getIconComponent(button.iconName);
            return (
              <Button
                key={button.id}
                variant="ghost"
                size="sm"
                onClick={() => onSecondaryClick(button.id)}
                className={`shrink-0 w-24 min-h-12 px-4 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-white/10 backdrop-blur-sm group ${
                  activeSecondarySection === button.id
                    ? "bg-primary/20 border border-primary shadow-lg shadow-primary/20"
                    : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <IconComponent
                    className={`w-5 h-5 transition-colors ${
                      activeSecondarySection === button.id
                        ? "text-primary"
                        : "text-white/90 group-hover:text-white"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors text-center ${
                      activeSecondarySection === button.id
                        ? "text-primary"
                        : "text-white/90 group-hover:text-white"
                    }`}
                  >
                    {button.label}
                  </span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
