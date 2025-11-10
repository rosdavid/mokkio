"use client";

import React from "react";

type MainSection = "mockup" | "frame" | "layout" | "scene";

interface MainNavigationBarProps {
  activeMainSection: MainSection | null;
  onSectionClick: (section: MainSection | null) => void;
  layoutMode?: "single" | "double" | "triple" | "scene-builder";
}

const mainSections = [
  {
    id: "mockup" as const,
    label: "Mockup",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "frame" as const,
    label: "Frame",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "layout" as const,
    label: "Layout",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "scene" as const,
    label: "Scene",
    color: "from-orange-500 to-red-500",
  },
];

export function MainNavigationBar({
  activeMainSection,
  onSectionClick,
  layoutMode,
}: MainNavigationBarProps) {
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevenir efectos visuales no deseados durante el touch
    e.preventDefault();
  };

  const handleClick = (sectionId: MainSection) => {
    onSectionClick(activeMainSection === sectionId ? null : sectionId);
  };

  // Filter sections based on layoutMode
  const visibleSections = mainSections.filter((section) => {
    // Hide "Scene" when single/double/triple is active
    if (
      section.id === "scene" &&
      layoutMode &&
      ["single", "double", "triple"].includes(layoutMode)
    ) {
      return false;
    }
    // Hide "Mockup" when scene-builder is active
    if (section.id === "mockup" && layoutMode === "scene-builder") {
      return false;
    }
    return true;
  });

  // Dynamic button width based on number of visible sections
  const buttonWidth = visibleSections.length === 4 ? "w-20" : "w-28";

  return (
    <div className="mx-2 mb-5 p-0.5 rounded-2xl shadow-2xl shadow-black/20 export-exclude">
      <div className="flex gap-2 justify-center">
        {visibleSections.map((section) => (
          <button
            key={section.id}
            onTouchStart={handleTouchStart}
            onClick={() => handleClick(section.id)}
            className={`${buttonWidth} min-h-10 rounded-xl relative overflow-hidden select-none active:scale-100 active:shadow-none active:transition-none active:transform-none active:text-current touch-manipulation focus:outline-none focus:ring-0 border ${
              activeMainSection === section.id
                ? `bg-linear-to-br ${section.color} text-white shadow-lg shadow-black/30 border-white/30`
                : "bg-muted hover:bg-accent border-border hover:border-primary/50 text-foreground/80 hover:text-foreground"
            }`}
            style={{
              WebkitTapHighlightColor: "transparent",
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
              userSelect: "none",
              touchAction: "manipulation",
              background:
                activeMainSection === section.id
                  ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`
                  : undefined,
            }}
          >
            {/* Animated background gradient for active state */}
            {activeMainSection === section.id && (
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent animate-pulse" />
            )}

            <div className="relative z-10 flex flex-col items-center gap-1">
              <span
                className={`text-xs font-medium transition-colors duration-200 ${
                  activeMainSection === section.id
                    ? "text-white"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {section.label}
              </span>
            </div>

            {/* Subtle glow effect */}
            {activeMainSection === section.id && (
              <div
                className={`absolute inset-0 rounded-xl bg-linear-to-br ${section.color} opacity-20 blur-xl -z-10`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
