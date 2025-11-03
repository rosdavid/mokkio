"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface DeviceSelectorProps {
  selectedDevice: string;
  onDeviceSelect: (device: string) => void;
  onClose?: () => void;
}

const deviceDisplayNames: Record<string, string> = {
  screenshot: "Screenshot - Adapts to media",
  "iphone-17-pro": "iPhone 17 Pro - 1206×2622px",
  "iphone-17-pro-max": "iPhone 17 Pro Max - 1320×2868px",
  "ipad-pro": "iPad Pro 13 - 2048×2732px",
  "macbook-pro": "MacBook Pro 16 - 2560×1600px",
  safari: "Safari - Adapts to media",
  browser: "Browser - Adapts to media",
  chrome: "Chrome - Adapts to media",
};

const devices = [
  { key: "screenshot", thumbnail: "/davidros.vercel.app.webp" },
  { key: "iphone-17-pro", thumbnail: "/iphone-17-pro-thumbnail.png" },
  {
    key: "iphone-17-pro-max",
    thumbnail: "/iphone-17-pro-max-thumbnail.png",
  },
  { key: "ipad-pro", thumbnail: "/ipad-pro-13-thumbnail.png" },
  { key: "macbook-pro", thumbnail: "/macbook-pro-16-thumbnail.png" },
  { key: "safari", thumbnail: "/safari-thumbnail.webp" },
  { key: "chrome", thumbnail: "/chrome-thumbnail.webp" },
];

export function DeviceSelector({
  selectedDevice,
  onDeviceSelect,
  onClose,
}: DeviceSelectorProps) {
  const getDeviceInfo = (deviceKey: string) => {
    const displayName = deviceDisplayNames[deviceKey] || deviceKey;
    const parts = displayName.split(" - ");
    return {
      name: parts[0],
      resolution: parts[1] || "Auto",
    };
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm text-foreground/90">
          Device Selection
        </h4>
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
        {devices.map((device) => {
          const { name, resolution } = getDeviceInfo(device.key);
          return (
            <button
              key={device.key}
              onClick={() => onDeviceSelect(device.key)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] backdrop-blur-sm ${
                selectedDevice === device.key
                  ? "border-blue-400/50 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Image
                    src={device.thumbnail}
                    alt={name}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover shadow-md"
                    unoptimized
                  />
                  {selectedDevice === device.key && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {resolution}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
