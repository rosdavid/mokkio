// types/scene-builder.ts
// Tipos para el Scene Builder (Multi-Device Layouts)

export interface DeviceScene {
  id: string;
  device: string; // "iphone-17-pro", "macbook-pro-16", "ipad-pro-13", etc.
  imageUrl: string | null; // URL de la imagen específica para este device
  position: {
    x: number; // Posición X en el canvas (px)
    y: number; // Posición Y en el canvas (px)
  };
  scale: number; // Escala del device (100 = tamaño normal)
  rotation: number; // Rotación en grados
  zIndex: number; // Orden de apilamiento

  // Frame style properties
  browserMode?: string; // "display", "light", "dark", "blue", "silver", "orange", "gray"
  deviceStyle?: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
  styleEdge?: number; // Device edge thickness in px
  siteUrl?: string; // Site URL for browsers
}

export interface ScenePreset {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji o icon name
  category: "ecosystem" | "responsive" | "cross-platform" | "custom";
  devices: Omit<DeviceScene, "id" | "imageUrl">[]; // Template sin id ni imagen
  canvasSize?: {
    width: number;
    height: number;
  };
  zoom?: number;
}

// Presets predefinidos profesionales
export const SCENE_PRESETS: ScenePreset[] = [
  {
    id: "apple-ecosystem",
    name: "Apple Ecosystem",
    description: "iPhone, iPad, and MacBook together",
    icon: "🍎",
    category: "ecosystem",
    devices: [
      {
        device: "iphone-17-pro",
        position: { x: 100, y: 300 },
        scale: 90,
        rotation: 0,
        zIndex: 3,
      },
      {
        device: "ipad-pro-13",
        position: { x: 400, y: 200 },
        scale: 85,
        rotation: 0,
        zIndex: 2,
      },
      {
        device: "macbook-pro-16",
        position: { x: 800, y: 100 },
        scale: 80,
        rotation: 0,
        zIndex: 1,
      },
    ],
    canvasSize: { width: 2400, height: 1600 },
    zoom: 50,
  },
  {
    id: "responsive-design",
    name: "Responsive Design",
    description: "Desktop, tablet, and mobile views",
    icon: "📱",
    category: "responsive",
    devices: [
      {
        device: "macbook-pro-16",
        position: { x: 100, y: 100 },
        scale: 70,
        rotation: 0,
        zIndex: 1,
      },
      {
        device: "ipad-pro-13",
        position: { x: 1200, y: 200 },
        scale: 75,
        rotation: 0,
        zIndex: 2,
      },
      {
        device: "iphone-17-pro",
        position: { x: 1800, y: 300 },
        scale: 85,
        rotation: 0,
        zIndex: 3,
      },
    ],
    canvasSize: { width: 2600, height: 1400 },
    zoom: 55,
  },
  {
    id: "mobile-showcase",
    name: "Mobile Showcase",
    description: "Multiple iPhone angles",
    icon: "📲",
    category: "ecosystem",
    devices: [
      {
        device: "iphone-17-pro",
        position: { x: 300, y: 200 },
        scale: 100,
        rotation: -5,
        zIndex: 2,
      },
      {
        device: "iphone-17-pro-max",
        position: { x: 700, y: 250 },
        scale: 100,
        rotation: 0,
        zIndex: 3,
      },
      {
        device: "iphone-17-pro",
        position: { x: 1100, y: 200 },
        scale: 100,
        rotation: 5,
        zIndex: 2,
      },
    ],
    canvasSize: { width: 1800, height: 1200 },
    zoom: 70,
  },
  {
    id: "desktop-comparison",
    name: "Desktop Comparison",
    description: "Side-by-side browser views",
    icon: "💻",
    category: "cross-platform",
    devices: [
      {
        device: "safari",
        position: { x: 100, y: 200 },
        scale: 80,
        rotation: 0,
        zIndex: 1,
      },
      {
        device: "chrome",
        position: { x: 1000, y: 200 },
        scale: 80,
        rotation: 0,
        zIndex: 1,
      },
    ],
    canvasSize: { width: 2200, height: 1400 },
    zoom: 60,
  },
  {
    id: "tablet-focus",
    name: "Tablet Focus",
    description: "iPad in landscape and portrait",
    icon: "📱",
    category: "ecosystem",
    devices: [
      {
        device: "ipad-pro-13",
        position: { x: 200, y: 200 },
        scale: 90,
        rotation: 0,
        zIndex: 2,
      },
      {
        device: "ipad-pro-13",
        position: { x: 900, y: 150 },
        scale: 90,
        rotation: 90,
        zIndex: 1,
      },
    ],
    canvasSize: { width: 2000, height: 1400 },
    zoom: 65,
  },
  {
    id: "cross-platform",
    name: "Cross-Platform",
    description: "All devices, all platforms",
    icon: "🌐",
    category: "cross-platform",
    devices: [
      {
        device: "macbook-pro-16",
        position: { x: 100, y: 100 },
        scale: 65,
        rotation: 0,
        zIndex: 1,
      },
      {
        device: "ipad-pro-13",
        position: { x: 1100, y: 150 },
        scale: 70,
        rotation: 0,
        zIndex: 2,
      },
      {
        device: "iphone-17-pro",
        position: { x: 1650, y: 250 },
        scale: 80,
        rotation: 0,
        zIndex: 3,
      },
      {
        device: "chrome",
        position: { x: 100, y: 800 },
        scale: 60,
        rotation: 0,
        zIndex: 1,
      },
    ],
    canvasSize: { width: 2400, height: 1800 },
    zoom: 45,
  },
];

// Helper para crear un nuevo DeviceScene
export function createDeviceScene(
  device: string,
  imageUrl: string | null = null
): DeviceScene {
  // Set default browserMode based on device type
  let defaultBrowserMode = "display";

  // Browsers use "light" mode by default
  if (device === "safari" || device === "chrome" || device === "browser") {
    defaultBrowserMode = "light";
  }

  return {
    id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    device,
    imageUrl,
    position: { x: 400, y: 300 },
    scale: 100,
    rotation: 0,
    zIndex: 1,
    browserMode: defaultBrowserMode,
    deviceStyle: "default",
    styleEdge: 16,
  };
}

// Helper para aplicar un preset
export function applyScenePreset(
  preset: ScenePreset,
  availableImages: (string | null)[]
): DeviceScene[] {
  return preset.devices.map((deviceTemplate, index) => ({
    id: `scene-${Date.now()}-${index}`,
    device: deviceTemplate.device,
    imageUrl: availableImages[index] || null,
    position: deviceTemplate.position,
    scale: deviceTemplate.scale,
    rotation: deviceTemplate.rotation,
    zIndex: deviceTemplate.zIndex,
  }));
}

// Helper para obtener el nombre display de un device
export function getDeviceDisplayName(deviceId: string): string {
  const deviceNames: Record<string, string> = {
    "iphone-17-pro": "iPhone 17 Pro",
    "iphone-17-pro-max": "iPhone 17 Pro Max",
    "ipad-pro-13": 'iPad Pro 13"',
    "macbook-pro-16": 'MacBook Pro 16"',
    safari: "Safari Browser",
    chrome: "Chrome Browser",
    browser: "Generic Browser",
    screenshot: "Screenshot",
  };

  return deviceNames[deviceId] || deviceId;
}

// Helper para obtener categorías de devices
export const DEVICE_CATEGORIES = {
  mobile: {
    label: "Mobile",
    devices: ["iphone-17-pro", "iphone-17-pro-max"],
  },
  tablet: {
    label: "Tablet",
    devices: ["ipad-pro-13"],
  },
  desktop: {
    label: "Desktop",
    devices: ["macbook-pro-16"],
  },
  browser: {
    label: "Browser",
    devices: ["safari", "chrome", "browser"],
  },
  other: {
    label: "Other",
    devices: ["screenshot"],
  },
} as const;
