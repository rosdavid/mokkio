/**
 * Type definitions for the Mockup Canvas component
 * 
 * This file contains all interfaces, types, and type guards
 * used by the mockup canvas system.
 */

/**
 * Text overlay configuration
 */
export interface TextOverlay {
  id: string;
  content: string;
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  x: number;
  y: number;
  lineHeight: number;
  letterSpacing: number;
  textAlign: "left" | "center" | "right" | "justify";
  opacity: number;
  textShadowOffsetX: number;
  textShadowOffsetY: number;
  textShadowBlur: number;
  textShadowColor: string;
}

/**
 * Device scene configuration for scene builder mode
 */
export interface DeviceScene {
  id: string;
  device: string;
  imageUrl: string | null;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  zIndex: number;
  browserMode?: string;
  deviceStyle?: "default" | "glass-light" | "glass-dark" | "liquid" | "retro";
  styleEdge?: number;
  siteUrl?: string;
}

/**
 * Guide configuration for canvas rulers
 */
export interface CanvasGuide {
  id: string;
  type: "horizontal" | "vertical";
  position: number;
  color: string;
}

/**
 * Background types supported by the canvas
 */
export type BackgroundType =
  | "solid"
  | "gradient"
  | "cosmic"
  | "mystic"
  | "desktop"
  | "abstract"
  | "earth"
  | "radiant"
  | "texture"
  | "textures"
  | "transparent"
  | "image"
  | "magical";

/**
 * Device style variants
 */
export type DeviceStyle =
  | "default"
  | "glass-light"
  | "glass-dark"
  | "liquid"
  | "retro";

/**
 * Shadow modes
 */
export type ShadowMode = "presets" | "custom";

/**
 * Scene types
 */
export type SceneType = "none" | "shadow" | "shapes";

/**
 * Layout modes
 */
export type LayoutMode = "single" | "double" | "triple" | "scene-builder";

/**
 * Main props for the MockupCanvas component
 */
export interface MockupCanvasProps {
  // Image and device configuration
  uploadedImages: (string | null)[];
  selectedDevice: string;
  selectedTemplate: string | null;
  browserMode: string;
  
  // Background configuration
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundNoise: number;
  backgroundBlur: number;
  selectedPreset: string;
  
  // Styling configuration
  padding: number;
  borderRadius: number;
  borderType: string;
  deviceStyle: DeviceStyle;
  styleEdge: number;
  
  // Shadow configuration
  shadowOpacity: number;
  shadowType: string;
  shadowMode?: ShadowMode;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowSpread?: number;
  shadowColor?: string;
  
  // Transform configuration
  rotation: number;
  scale: number;
  zoom: number;
  panX: number;
  panY: number;
  
  // Layout configuration
  layoutMode: LayoutMode;
  mockupGap: number;
  sceneType: SceneType;
  
  // Canvas configuration
  canvasWidth?: number;
  canvasHeight?: number;
  hideMockup?: boolean;
  
  // Text overlays
  texts: TextOverlay[];
  updateText?: (id: string, updates: Partial<TextOverlay>) => void;
  
  // Scene builder
  deviceScenes?: DeviceScene[];
  onDeviceScenesChange?: (scenes: DeviceScene[]) => void;
  
  // URL configuration
  siteUrl?: string;
  
  // Callbacks
  onImageUpload?: (file: File, index?: number) => void;
  
  // UI state
  hoveredSlot?: number | null;
  
  // Magical gradients
  magicalGradients?: string[];
  
  // Guides and rulers
  showRulers?: boolean;
  hideGuides?: boolean;
  guides?: CanvasGuide[];
  onGuidesChange?: (guides: CanvasGuide[]) => void;
  
  // Branding
  showBranding?: boolean;
  brandingText?: string;
  brandingPosition?: { x: number; y: number };
  brandingSize?: { width: number; height: number };
  onBrandingPositionChange?: (position: { x: number; y: number }) => void;
  onBrandingSizeChange?: (size: { width: number; height: number }) => void;
  brandingFontSize?: number;
  brandingOpacity?: number;
  brandingColor?: string;
}

/**
 * Image size state
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Drag state for text overlays
 */
export interface TextDragState {
  draggingTextId: string | null;
  dragOffset: { x: number; y: number };
  selectedTextId: string | null;
}

/**
 * Drag state for branding
 */
export interface BrandingDragState {
  draggingBranding: boolean;
  brandingDragOffset: { x: number; y: number };
  resizingBranding: string | null;
  resizeStartPos: { x: number; y: number };
  resizeStartSize: { width: number; height: number };
  resizeStartBrandingPos: { x: number; y: number };
}

/**
 * Drag state for scene devices
 */
export interface SceneDeviceDragState {
  draggingSceneDevice: string | null;
  sceneDeviceDragOffset: { x: number; y: number };
}

/**
 * Mouse position
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Touch position with identifier
 */
export interface TouchPosition {
  identifier: number;
  x: number;
  y: number;
}

/**
 * Snap result from snap calculations
 */
export interface SnapResult {
  x: number;
  y: number;
  snappedX: boolean;
  snappedY: boolean;
}

/**
 * Type guard to check if a value is a valid DeviceStyle
 */
export function isDeviceStyle(value: string): value is DeviceStyle {
  return ["default", "glass-light", "glass-dark", "liquid", "retro"].includes(
    value
  );
}

/**
 * Type guard to check if a value is a valid BackgroundType
 */
export function isBackgroundType(value: string): value is BackgroundType {
  return [
    "solid",
    "gradient",
    "cosmic",
    "mystic",
    "desktop",
    "abstract",
    "earth",
    "radiant",
    "texture",
    "textures",
    "transparent",
    "image",
    "magical",
  ].includes(value);
}

/**
 * Type guard to check if a value is a valid LayoutMode
 */
export function isLayoutMode(value: string): value is LayoutMode {
  return ["single", "double", "triple", "scene-builder"].includes(value);
}

/**
 * Default text overlay values
 */
export const DEFAULT_TEXT_OVERLAY: Omit<TextOverlay, "id"> = {
  content: "New Text",
  color: "#FFFFFF",
  fontFamily: "Inter",
  fontSize: 24,
  fontWeight: "400",
  x: 0,
  y: 0,
  lineHeight: 1.5,
  letterSpacing: 0,
  textAlign: "left",
  opacity: 1,
  textShadowOffsetX: 0,
  textShadowOffsetY: 0,
  textShadowBlur: 0,
  textShadowColor: "#000000",
};

/**
 * Default device scene values
 */
export const DEFAULT_DEVICE_SCENE: Omit<DeviceScene, "id"> = {
  device: "iphone-17-pro",
  imageUrl: null,
  position: { x: 0, y: 0 },
  scale: 1,
  rotation: 0,
  zIndex: 1,
  browserMode: "display",
  deviceStyle: "default",
  styleEdge: 20,
  siteUrl: "",
};

/**
 * Default branding configuration
 */
export const DEFAULT_BRANDING = {
  text: "mokkio.me",
  position: { x: 20, y: 20 },
  size: { width: 200, height: 50 },
  fontSize: 16,
  opacity: 0.5,
  color: "#FFFFFF",
};
