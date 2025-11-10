/**
 * useSnapGuides Hook
 *
 * Manages smart snap guides for aligning elements in the mockup canvas.
 * Provides snap calculations and guide state management.
 *
 * @example
 * ```tsx
 * const { snapGuides, calculateSnapWithGuides, clearSnapGuides } = useSnapGuides({
 *   canvasWidth: 1920,
 *   canvasHeight: 1080,
 *   snapThreshold: 5
 * });
 * ```
 */

import { useState, useCallback } from "react";
import {
  calculateSnap,
  type BoundingBox,
  type SnapResult as LibSnapResult,
} from "@/lib/snap-utils";
import { type Guide } from "@/components/canvas-guides";

export interface UseSnapGuidesOptions {
  /**
   * Canvas width in pixels
   */
  canvasWidth: number;

  /**
   * Canvas height in pixels
   */
  canvasHeight: number;

  /**
   * Whether snap guides are enabled
   * @default true
   */
  enabled?: boolean;
}

export interface UseSnapGuidesReturn {
  /**
   * Current active snap guides
   */
  snapGuides: Guide[];

  /**
   * Calculate snap position and update guides
   */
  calculateSnapWithGuides: (
    bbox: BoundingBox,
    otherBBoxes?: BoundingBox[]
  ) => LibSnapResult;

  /**
   * Clear all active snap guides
   */
  clearSnapGuides: () => void;

  /**
   * Manually set snap guides (useful for custom snap logic)
   */
  setSnapGuides: (guides: Guide[]) => void;
}

/**
 * Hook for managing snap guides in the mockup canvas
 */
export function useSnapGuides(
  options: UseSnapGuidesOptions
): UseSnapGuidesReturn {
  const { canvasWidth, canvasHeight, enabled = true } = options;

  const [snapGuides, setSnapGuides] = useState<Guide[]>([]);

  /**
   * Calculate snap position with guides
   */
  const calculateSnapWithGuides = useCallback(
    (bbox: BoundingBox, otherBBoxes: BoundingBox[] = []): LibSnapResult => {
      if (!enabled) {
        setSnapGuides([]);
        return {
          x: bbox.x,
          y: bbox.y,
          snappedX: false,
          snappedY: false,
          guides: [],
          distanceIndicators: [],
        };
      }

      const snapResult = calculateSnap(
        bbox,
        canvasWidth,
        canvasHeight,
        otherBBoxes,
        true
      );

      // Update guides automatically
      setSnapGuides(snapResult.guides);

      return snapResult;
    },
    [canvasWidth, canvasHeight, enabled]
  );

  /**
   * Clear all snap guides
   */
  const clearSnapGuides = useCallback(() => {
    setSnapGuides([]);
  }, []);

  return {
    snapGuides,
    calculateSnapWithGuides,
    clearSnapGuides,
    setSnapGuides,
  };
}
