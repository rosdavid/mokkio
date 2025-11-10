/**
 * useDragAndDrop Hook
 *
 * Manages drag and drop state for text overlays, branding, and scene devices.
 * Centralizes all dragging logic and offset calculations.
 *
 * @example
 * ```tsx
 * const {
 *   // Text dragging
 *   draggingText,
 *   dragOffset,
 *   startTextDrag,
 *   stopTextDrag,
 *
 *   // Branding dragging
 *   draggingBranding,
 *   brandingDragOffset,
 *   startBrandingDrag,
 *   stopBrandingDrag,
 *
 *   // Scene device dragging
 *   draggingSceneDevice,
 *   sceneDeviceDragOffset,
 *   startSceneDeviceDrag,
 *   stopSceneDeviceDrag,
 * } = useDragAndDrop();
 * ```
 */

import { useState, useCallback } from "react";

export interface DragOffset {
  x: number;
  y: number;
}

export interface UseDragAndDropReturn {
  // Text dragging state
  draggingText: string | null;
  dragOffset: DragOffset;
  startTextDrag: (textId: string, offset: DragOffset) => void;
  stopTextDrag: () => void;

  // Branding dragging state
  draggingBranding: boolean;
  brandingDragOffset: DragOffset;
  startBrandingDrag: (offset: DragOffset) => void;
  stopBrandingDrag: () => void;

  // Scene device dragging state
  draggingSceneDevice: string | null;
  sceneDeviceDragOffset: DragOffset;
  startSceneDeviceDrag: (sceneId: string, offset: DragOffset) => void;
  stopSceneDeviceDrag: () => void;
}

/**
 * Hook for managing drag and drop operations across all canvas elements
 */
export function useDragAndDrop(): UseDragAndDropReturn {
  // Text dragging state
  const [draggingText, setDraggingText] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });

  // Branding dragging state
  const [draggingBranding, setDraggingBranding] = useState(false);
  const [brandingDragOffset, setBrandingDragOffset] = useState<DragOffset>({
    x: 0,
    y: 0,
  });

  // Scene device dragging state
  const [draggingSceneDevice, setDraggingSceneDevice] = useState<string | null>(
    null
  );
  const [sceneDeviceDragOffset, setSceneDeviceDragOffset] =
    useState<DragOffset>({ x: 0, y: 0 });

  /**
   * Start dragging a text overlay
   */
  const startTextDrag = useCallback((textId: string, offset: DragOffset) => {
    setDraggingText(textId);
    setDragOffset(offset);
  }, []);

  /**
   * Stop dragging text overlay
   */
  const stopTextDrag = useCallback(() => {
    setDraggingText(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  /**
   * Start dragging branding
   */
  const startBrandingDrag = useCallback((offset: DragOffset) => {
    setDraggingBranding(true);
    setBrandingDragOffset(offset);
  }, []);

  /**
   * Stop dragging branding
   */
  const stopBrandingDrag = useCallback(() => {
    setDraggingBranding(false);
    setBrandingDragOffset({ x: 0, y: 0 });
  }, []);

  /**
   * Start dragging a scene device
   */
  const startSceneDeviceDrag = useCallback(
    (sceneId: string, offset: DragOffset) => {
      setDraggingSceneDevice(sceneId);
      setSceneDeviceDragOffset(offset);
    },
    []
  );

  /**
   * Stop dragging scene device
   */
  const stopSceneDeviceDrag = useCallback(() => {
    setDraggingSceneDevice(null);
    setSceneDeviceDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    // Text dragging
    draggingText,
    dragOffset,
    startTextDrag,
    stopTextDrag,

    // Branding dragging
    draggingBranding,
    brandingDragOffset,
    startBrandingDrag,
    stopBrandingDrag,

    // Scene device dragging
    draggingSceneDevice,
    sceneDeviceDragOffset,
    startSceneDeviceDrag,
    stopSceneDeviceDrag,
  };
}
