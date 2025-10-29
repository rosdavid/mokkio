export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const STANDARD_SCALE = 0.7;

export const computeRenderSize = (deviceW: number, deviceH: number) => {
  const canvasW = CANVAS_WIDTH;
  const canvasH = CANVAS_HEIGHT;

  let targetW = Math.min(deviceW, canvasW);
  let targetH = (targetW * deviceH) / deviceW;

  if (targetH > canvasH) {
    targetH = canvasH;
    targetW = (targetH * deviceW) / deviceH;
  }
  return { width: Math.round(targetW), height: Math.round(targetH) };
};

export const getDeviceDimensions = (selectedDevice?: string) => {
  const devices: Record<
    string,
    { width: number; height: number; type: string }
  > = {
    screenshot: { width: 1200, height: 800, type: "screenshot" },
    safari: { width: 1440, height: 900, type: "browser" },
    "iphone-17-pro": { width: 402, height: 874, type: "mobile" },
    "iphone-17-pro-max": { width: 440, height: 956, type: "mobile" },
    "macbook-pro": { width: 1512, height: 982, type: "desktop" },
    "ipad-pro": { width: 1024, height: 1366, type: "tablet" },
  };
  return devices[selectedDevice || "screenshot"] || devices["screenshot"];
};

export const getEffectiveZoom = (
  zoom: number,
  layoutMode: "single" | "double" | "triple",
  selectedDevice?: string,
  selectedTemplate?: string | null
) => {
  let baseZoom = (zoom / 100) * STANDARD_SCALE;

  // Adjust based on device type
  const deviceType = getDeviceDimensions(selectedDevice).type;
  if (deviceType === "mobile") {
    baseZoom *= 1.2; // Mobile devices need more zoom to be visible
  } else if (deviceType === "tablet") {
    baseZoom *= 1.0; // Tablet is standard
  } else if (deviceType === "desktop") {
    baseZoom *= 0.8; // Desktop devices are larger, need less zoom
  } else if (deviceType === "browser") {
    baseZoom *= 0.9; // Browser frames are wide
  }

  // layoutMode adjustments removed — single-only app

  // Adjust based on specific templates
  if (selectedTemplate) {
    switch (selectedTemplate) {
      case "floating":
        baseZoom *= 1.1; // Floating needs slight boost
        break;
      case "hero-left":
      case "hero-right":
        baseZoom *= 0.9; // Hero layouts are wider
        break;
      case "overlapping":
        baseZoom *= 0.95; // Slight adjustment for overlapping
        break;
      case "perspective-duo":
      case "perspective-left":
      case "perspective-right":
        baseZoom *= 1.05; // Perspective effects need slight zoom
        break;
      case "device-with-browser":
        baseZoom *= 0.85; // Mixed device/browser layout
        break;
      case "fan-layout":
      case "isometric-trio":
        baseZoom *= 0.9; // Multi-device layouts
        break;
      // Add more template adjustments as needed
    }
  }

  return baseZoom;
};
