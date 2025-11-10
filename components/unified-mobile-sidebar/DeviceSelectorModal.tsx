"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Device display names and info with resolutions
const deviceDisplayNames: Record<string, string> = {
  screenshot: "Screenshot - Adapts to media",
  "iphone-17-pro": "iPhone 17 Pro - 1206×2622px",
  "iphone-17-pro-max": "iPhone 17 Pro Max - 1320×2868px",
  "ipad-pro-13": "iPad Pro 13 - 2048×2732px",
  "macbook-pro-16": "MacBook Pro 16 - 2560×1600px",
  safari: "Safari - Adapts to media",
  browser: "Browser - Adapts to media",
  chrome: "Chrome - Adapts to media",
};

const getDeviceInfo = (deviceKey: string) => {
  const displayName = deviceDisplayNames[deviceKey] || deviceKey;
  const parts = displayName.split(" - ");
  return {
    name: parts[0],
    resolution: parts[1] || "Auto",
  };
};

const deviceThumbnails: Record<string, string> = {
  screenshot: "/mokkio-app.png",
  "iphone-17-pro": "/iphone-17-pro-thumbnail.png",
  "iphone-17-pro-max": "/iphone-17-pro-max-thumbnail.png",
  "ipad-pro-13": "/ipad-pro-13-thumbnail.png",
  "macbook-pro-16": "/macbook-pro-16-thumbnail.png",
  safari: "/safari-thumbnail.webp",
  browser: "/chrome-thumbnail.webp",
  chrome: "/chrome-thumbnail.webp",
};

type DeviceCategory = "all" | "phone" | "tablet" | "laptop" | "browser";

const deviceCategories: Record<string, DeviceCategory> = {
  screenshot: "all",
  "iphone-17-pro": "phone",
  "iphone-17-pro-max": "phone",
  "ipad-pro-13": "tablet",
  "macbook-pro-16": "laptop",
  safari: "browser",
  browser: "browser",
  chrome: "browser",
};

interface DeviceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceSelect: (deviceKey: string) => void;
}

export function DeviceSelectorModal({
  isOpen,
  onClose,
  onDeviceSelect,
}: DeviceSelectorModalProps) {
  const [deviceTab, setDeviceTab] = useState<DeviceCategory>("all");
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setImagesLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const availableDevices = Object.keys(deviceDisplayNames);

  const devicesToShow =
    deviceTab === "all"
      ? availableDevices
      : availableDevices.filter((d) => deviceCategories[d] === deviceTab);

  const handleDeviceClick = (deviceKey: string) => {
    onDeviceSelect(deviceKey);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10000 bg-black/80 backdrop-blur-sm">
      <div
        className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl overflow-hidden flex flex-col"
        style={{ height: "min(600px, 75vh)" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h3 className="text-base font-semibold">Select Device</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Device Category Tabs */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <Tabs
            value={deviceTab}
            onValueChange={(v) => setDeviceTab(v as DeviceCategory)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="phone" className="text-xs">
                Phone
              </TabsTrigger>
              <TabsTrigger value="tablet" className="text-xs">
                Tablet
              </TabsTrigger>
              <TabsTrigger value="laptop" className="text-xs">
                Laptop
              </TabsTrigger>
              <TabsTrigger value="browser" className="text-xs">
                Browser
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Device Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0">
          <div className="grid grid-cols-3 gap-3 pb-safe">
            {devicesToShow.map((deviceKey) => {
              const { name, resolution } = getDeviceInfo(deviceKey);
              const thumbnail =
                deviceThumbnails[deviceKey] || "/mokkio-app.png";

              return (
                <button
                  key={deviceKey}
                  onClick={() => handleDeviceClick(deviceKey)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-border/50 bg-card hover:bg-accent hover:border-primary/50 transition-all active:scale-95 min-h-[120px]"
                >
                  {imagesLoaded && (
                    <div className="flex-1 flex items-center justify-center mb-2">
                      <Image
                        src={thumbnail}
                        alt={name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="w-full px-1">
                    <span className="text-xs font-medium text-center block truncate">
                      {name}
                    </span>
                    <span className="text-[10px] text-muted-foreground text-center block">
                      {resolution}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
