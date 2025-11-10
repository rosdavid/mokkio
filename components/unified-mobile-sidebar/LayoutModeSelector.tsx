"use client";

import React from "react";
import { X } from "lucide-react";

interface LayoutModeSelectorProps {
  layoutMode: "single" | "double" | "triple" | "scene-builder";
  setLayoutMode: (
    mode: "single" | "double" | "triple" | "scene-builder"
  ) => void;
  onClose?: () => void;
}

export function LayoutModeSelector({
  layoutMode,
  setLayoutMode,
  onClose,
}: LayoutModeSelectorProps) {
  const layoutOptions = [
    {
      id: "single" as const,
      label: "Single Mockup",
      description: "One mockup display",
    },
    {
      id: "double" as const,
      label: "Double Mockup",
      description: "Two mockups side by side",
    },
    {
      id: "scene-builder" as const,
      label: "Scene Builder",
      description: "Multi-device layouts",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm">Mockup Layout</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-accent transition-colors"
            title="Close"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {layoutOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setLayoutMode(option.id)}
            className={`w-full p-3 rounded-lg border text-left transition-colors ${
              layoutMode === option.id
                ? "border-primary bg-primary/10"
                : "border-border hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">{option.label}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
