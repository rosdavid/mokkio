/**
 * Canvas dimensions constants
 * These define the virtual canvas size for mockup rendering
 */
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;

/**
 * Standard scale factor for mockup rendering
 * Base zoom multiplier applied to all devices before device-specific adjustments
 */
export const STANDARD_SCALE = 0.7;

/**
 * Computes the optimal render size for a device to fit within the canvas bounds
 * while maintaining its aspect ratio.
 *
 * @param deviceW - The original width of the device in pixels
 * @param deviceH - The original height of the device in pixels
 * @returns An object containing the computed width and height (rounded to integers)
 *
 * @example
 * ```typescript
 * // iPhone 17 Pro dimensions
 * const size = computeRenderSize(402, 874);
 * // Returns: { width: 402, height: 874 } (fits within canvas)
 *
 * // MacBook Pro dimensions (larger than canvas)
 * const size = computeRenderSize(1512, 982);
 * // Returns scaled down version maintaining aspect ratio
 * ```
 */
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

/**
 * Device type classification for rendering and zoom calculations
 */
type DeviceType = "screenshot" | "browser" | "mobile" | "desktop" | "tablet";

/**
 * Device dimension information including size and type classification
 */
interface DeviceDimension {
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
  /** Device type classification for zoom adjustments */
  type: DeviceType;
}

/**
 * Retrieves the dimensions and type information for a given device.
 * Supports device aliases (e.g., 'macbook-pro' and 'macbook-pro-16' return the same dimensions).
 *
 * @param selectedDevice - The device identifier (optional, defaults to 'screenshot')
 * @returns Device dimensions object with width, height, and type
 *
 * @example
 * ```typescript
 * // Get iPhone dimensions
 * const iphone = getDeviceDimensions('iphone-17-pro');
 * // Returns: { width: 402, height: 874, type: 'mobile' }
 *
 * // Get browser dimensions
 * const safari = getDeviceDimensions('safari');
 * // Returns: { width: 1440, height: 900, type: 'browser' }
 *
 * // Unknown device defaults to screenshot
 * const unknown = getDeviceDimensions('unknown');
 * // Returns: { width: 1200, height: 800, type: 'screenshot' }
 * ```
 */
export const getDeviceDimensions = (
  selectedDevice?: string
): DeviceDimension => {
  const devices: Record<string, DeviceDimension> = {
    screenshot: { width: 1200, height: 800, type: "screenshot" },
    safari: { width: 1440, height: 900, type: "browser" },
    chrome: { width: 1440, height: 900, type: "browser" },
    browser: { width: 1440, height: 900, type: "browser" },
    "iphone-17-pro": { width: 402, height: 874, type: "mobile" },
    "iphone-17-pro-max": { width: 440, height: 956, type: "mobile" },
    "macbook-pro": { width: 1512, height: 982, type: "desktop" },
    "macbook-pro-16": { width: 1512, height: 982, type: "desktop" }, // Alias with model number
    "ipad-pro": { width: 1024, height: 1366, type: "tablet" },
    "ipad-pro-13": { width: 1024, height: 1366, type: "tablet" }, // Alias with model number
  };
  return devices[selectedDevice || "screenshot"] || devices["screenshot"];
};

/**
 * Layout mode type definition
 */
type LayoutMode = "single" | "double" | "triple" | "scene-builder";

/**
 * Calculates the effective zoom level for a device based on multiple factors:
 * - Base zoom percentage
 * - Device type (mobile devices need more zoom, desktop needs less)
 * - Layout mode (scene-builder reduces zoom for multi-device layouts)
 * - Template-specific adjustments
 *
 * @param zoom - Base zoom percentage (100 = standard, 150 = 1.5x, etc.)
 * @param layoutMode - Current layout mode
 * @param selectedDevice - Device identifier for type-based adjustments
 * @param selectedTemplate - Template name for template-specific zoom adjustments
 * @returns Calculated zoom multiplier (e.g., 0.7, 1.2, etc.)
 *
 * @remarks
 * Device type multipliers:
 * - Mobile: 1.2x (devices appear larger for better visibility)
 * - Tablet: 1.0x (standard size)
 * - Desktop: 0.8x (larger devices need less zoom)
 * - Browser: 0.9x (wide frames)
 *
 * Layout mode multipliers:
 * - scene-builder: 0.7x (needs space for multiple devices)
 *
 * @example
 * ```typescript
 * // iPhone at 100% zoom in single mode
 * const zoom1 = getEffectiveZoom(100, 'single', 'iphone-17-pro');
 * // Returns: (100/100) * 0.7 * 1.2 = 0.84
 *
 * // MacBook at 150% zoom in scene-builder
 * const zoom2 = getEffectiveZoom(150, 'scene-builder', 'macbook-pro-16');
 * // Returns: (150/100) * 0.7 * 0.8 * 0.7 = 0.588
 *
 * // Browser with floating template
 * const zoom3 = getEffectiveZoom(100, 'single', 'safari', 'floating');
 * // Returns: (100/100) * 0.7 * 0.9 * 1.1 = 0.693
 * ```
 */
export const getEffectiveZoom = (
  zoom: number,
  layoutMode: LayoutMode,
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

  // Scene builder mode adjustment
  if (layoutMode === "scene-builder") {
    baseZoom *= 0.7; // Scene builder needs more space for multiple devices
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
