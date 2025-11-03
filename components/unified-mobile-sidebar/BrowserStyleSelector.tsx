"use client";

import React from "react";
import Image from "next/image";
import { Label } from "../ui/label";
import { X } from "lucide-react";

type MainSection = "mockup" | "frame" | "layout";

interface BrowserStyleSelectorProps {
  activeSection: MainSection | null;
  selectedDevice: string;
  browserMode: string;
  siteUrl?: string;
  onBrowserModeChange: (mode: string) => void;
  onSiteUrlChange?: (url: string) => void;
  onClose?: () => void;
}

export function BrowserStyleSelector({
  activeSection,
  selectedDevice,
  browserMode,
  siteUrl,
  onBrowserModeChange,
  onSiteUrlChange,
  onClose,
}: BrowserStyleSelectorProps) {
  const isMobileSection = activeSection === "mockup";
  const title = isMobileSection ? "Device Style" : "Browser Style";
  const isBrowserDevice = ["safari", "browser", "chrome"].includes(
    selectedDevice
  );
  const isIPhoneDevice = ["iphone-17-pro", "iphone-17-pro-max"].includes(
    selectedDevice
  );

  if (!isBrowserDevice && !isIPhoneDevice) {
    return (
      <div className="space-y-4 p-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground/90">{title}</h4>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <X className="h-4 w-4 text-white/60 hover:text-white" />
            </button>
          )}
        </div>
        <div className="text-center py-4">
          <div className="text-xs text-muted-foreground">
            Select a browser or phone device to access style options
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-foreground/90">{title}</h4>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4 text-white/60 hover:text-white" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-3">
        {/* Browser devices: Light/Dark mode */}
        {isBrowserDevice && (
          <>
            <button
              onClick={() => onBrowserModeChange("light")}
              className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                browserMode === "light"
                  ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    Light Mode
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Bright interface
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => onBrowserModeChange("dark")}
              className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                browserMode === "dark"
                  ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    Dark Mode
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Dark interface
                  </div>
                </div>
              </div>
            </button>

            {/* Site URL Configuration for Browser Devices */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Site URL
              </Label>
              <input
                type="text"
                value={siteUrl || ""}
                onChange={(e) => onSiteUrlChange?.(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="text-xs text-muted-foreground">
                Enter the website URL to display in the browser
              </div>
            </div>
          </>
        )}

        {/* Mobile devices: Display/Device Frame */}
        {isIPhoneDevice && (
          <>
            <button
              onClick={() => onBrowserModeChange("display")}
              className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                browserMode === "display"
                  ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src="/iphone-17-pro-display-thumbnail.png"
                    alt="Display"
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">
                    Display Only
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Screen without frame
                  </div>
                </div>
              </div>
            </button>

            {/* Color options for iPhone */}
            {selectedDevice === "iphone-17-pro" ? (
              <>
                <button
                  onClick={() => onBrowserModeChange("blue")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                    browserMode === "blue"
                      ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src="/iphone-17-pro-thumbnail.png"
                        alt="Blue"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">
                        Blue Titanium
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Complete device frame
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onBrowserModeChange("silver")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                    browserMode === "silver"
                      ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src="/iphone-17-pro-silver-thumbnail.png"
                        alt="Silver"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">
                        Silver Titanium
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Complete device frame
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onBrowserModeChange("orange")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                    browserMode === "orange"
                      ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src="/iphone-17-pro-orange-thumbnail.png"
                        alt="Orange"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">
                        Orange Titanium
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Complete device frame
                      </div>
                    </div>
                  </div>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onBrowserModeChange("blue")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                    browserMode === "blue"
                      ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src="/iphone-17-pro-thumbnail.png"
                        alt="Blue"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">
                        Blue Titanium
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Complete device frame
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onBrowserModeChange("silver")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                    browserMode === "silver"
                      ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src="/iphone-17-pro-silver-thumbnail.png"
                        alt="Silver"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">
                        Silver Titanium
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Complete device frame
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onBrowserModeChange("orange")}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                    browserMode === "orange"
                      ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src="/iphone-17-pro-orange-thumbnail.png"
                        alt="Orange"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground">
                        Orange Titanium
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Complete device frame
                      </div>
                    </div>
                  </div>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
