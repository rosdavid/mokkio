/**
 * Smart Guides & Snapping Utilities
 * Provides intelligent snapping and alignment helpers for canvas elements
 * Integrated with the CanvasGuides ruler system
 */

import type { Guide } from "@/components/canvas-guides";

/**
 * Represents a rectangular bounding box for an element on the canvas
 */
export interface BoundingBox {
  /** X position in pixels from left edge */
  x: number;
  /** Y position in pixels from top edge */
  y: number;
  /** Width in pixels */
  width: number;
  /** Height in pixels */
  height: number;
}

/**
 * Result of a snap calculation including adjusted position and visual guides
 */
export interface SnapResult {
  /** Adjusted X position after snapping */
  x: number;
  /** Adjusted Y position after snapping */
  y: number;
  /** Whether X position was snapped */
  snappedX: boolean;
  /** Whether Y position was snapped */
  snappedY: boolean;
  /** Visual guide lines to display */
  guides: Guide[];
  /** Distance indicators between elements */
  distanceIndicators: DistanceIndicator[];
}

/**
 * Visual indicator showing distance between elements
 */
export interface DistanceIndicator {
  /** Start X coordinate */
  x1: number;
  /** Start Y coordinate */
  y1: number;
  /** End X coordinate */
  x2: number;
  /** End Y coordinate */
  y2: number;
  /** Distance in pixels */
  distance: number;
  /** Line orientation */
  orientation: "horizontal" | "vertical";
}

/**
 * Snap threshold in pixels
 * Elements within this distance will snap to guides
 */
const SNAP_THRESHOLD = 8; // pixels

/**
 * Color for snap guide lines
 */
const SNAP_GUIDE_COLOR = "#3b82f6"; // Blue

/**
 * Creates a snap guide for visual feedback
 * @internal
 */
function createSnapGuide(
  type: "horizontal" | "vertical",
  position: number
): Guide {
  return {
    id: `snap-${type}-${position}-${Date.now()}-${Math.random()}`,
    type,
    position,
    color: SNAP_GUIDE_COLOR,
    isSmartGuide: true,
  };
}

/**
 * Calculates snap positions for an element relative to canvas boundaries and other elements.
 *
 * Snapping behavior:
 * - Snaps to canvas edges (left, right, top, bottom)
 * - Snaps to canvas center (horizontal and vertical)
 * - Snaps to other elements' edges and centers
 * - Generates visual guide lines for snapped positions
 * - Creates distance indicators for adjacent elements
 *
 * @param element - The bounding box of the element to snap
 * @param canvasWidth - Width of the canvas in pixels
 * @param canvasHeight - Height of the canvas in pixels
 * @param otherElements - Array of other elements to snap to (optional)
 * @param enableSnap - Whether snapping is enabled (default: true)
 * @returns SnapResult with adjusted position, snap flags, guides, and distance indicators
 *
 * @remarks
 * - Snap threshold is 8 pixels by default
 * - Canvas snapping takes priority over element-to-element snapping
 * - Only one snap per axis is applied (first match wins)
 * - Distance indicators are only shown for gaps < 100 pixels
 *
 * @example
 * ```typescript
 * // Snap a text overlay to canvas center
 * const element = { x: 638, y: 358, width: 200, height: 100 };
 * const result = calculateSnap(element, 1280, 720);
 * // If within 8px of center: result.x = 540, result.snappedX = true
 *
 * // Snap to another element's edge
 * const element1 = { x: 100, y: 100, width: 200, height: 150 };
 * const element2 = { x: 305, y: 100, width: 150, height: 100 };
 * const result = calculateSnap(element2, 1280, 720, [element1]);
 * // Snaps element2 to element1's right edge at x=300
 * ```
 */
export function calculateSnap(
  element: BoundingBox,
  canvasWidth: number,
  canvasHeight: number,
  otherElements: BoundingBox[] = [],
  enableSnap: boolean = true
): SnapResult {
  if (!enableSnap) {
    return {
      x: element.x,
      y: element.y,
      snappedX: false,
      snappedY: false,
      guides: [],
      distanceIndicators: [],
    };
  }

  const guides: Guide[] = [];
  const distanceIndicators: DistanceIndicator[] = [];
  let snappedX = element.x;
  let snappedY = element.y;
  let hasSnappedX = false;
  let hasSnappedY = false;

  // Calcular puntos de referencia del elemento
  const elementLeft = element.x;
  const elementRight = element.x + element.width;
  const elementCenterX = element.x + element.width / 2;
  const elementTop = element.y;
  const elementBottom = element.y + element.height;
  const elementCenterY = element.y + element.height / 2;

  // Canvas snap points
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;
  const canvasRight = canvasWidth;
  const canvasBottom = canvasHeight;

  // --- SNAP TO CANVAS EDGES ---

  // Snap left edge to canvas left
  if (Math.abs(elementLeft - 0) < SNAP_THRESHOLD) {
    snappedX = 0;
    hasSnappedX = true;
    guides.push(createSnapGuide("vertical", 0));
  }

  // Snap right edge to canvas right
  if (Math.abs(elementRight - canvasRight) < SNAP_THRESHOLD) {
    snappedX = canvasRight - element.width;
    hasSnappedX = true;
    guides.push(createSnapGuide("vertical", canvasRight));
  }

  // Snap center to canvas center X
  if (Math.abs(elementCenterX - canvasCenterX) < SNAP_THRESHOLD) {
    snappedX = canvasCenterX - element.width / 2;
    hasSnappedX = true;
    guides.push(createSnapGuide("vertical", canvasCenterX));
  }

  // Snap top edge to canvas top
  if (Math.abs(elementTop - 0) < SNAP_THRESHOLD) {
    snappedY = 0;
    hasSnappedY = true;
    guides.push(createSnapGuide("horizontal", 0));
  }

  // Snap bottom edge to canvas bottom
  if (Math.abs(elementBottom - canvasBottom) < SNAP_THRESHOLD) {
    snappedY = canvasBottom - element.height;
    hasSnappedY = true;
    guides.push(createSnapGuide("horizontal", canvasBottom));
  }

  // Snap center to canvas center Y
  if (Math.abs(elementCenterY - canvasCenterY) < SNAP_THRESHOLD) {
    snappedY = canvasCenterY - element.height / 2;
    hasSnappedY = true;
    guides.push(createSnapGuide("horizontal", canvasCenterY));
  }

  // --- SNAP TO OTHER ELEMENTS ---

  for (const other of otherElements) {
    const otherLeft = other.x;
    const otherRight = other.x + other.width;
    const otherCenterX = other.x + other.width / 2;
    const otherTop = other.y;
    const otherBottom = other.y + other.height;
    const otherCenterY = other.y + other.height / 2;

    // Snap left to other's left
    if (!hasSnappedX && Math.abs(elementLeft - otherLeft) < SNAP_THRESHOLD) {
      snappedX = otherLeft;
      hasSnappedX = true;
      guides.push(createSnapGuide("vertical", otherLeft));
    }

    // Snap left to other's right
    if (!hasSnappedX && Math.abs(elementLeft - otherRight) < SNAP_THRESHOLD) {
      snappedX = otherRight;
      hasSnappedX = true;
      guides.push(createSnapGuide("vertical", otherRight));

      // Show distance if elements are adjacent
      const distance = Math.abs(elementLeft - otherRight);
      if (distance > 0 && distance < 100) {
        distanceIndicators.push({
          x1: otherRight,
          y1: Math.min(elementTop, otherTop),
          x2: elementLeft,
          y2: Math.min(elementTop, otherTop),
          distance,
          orientation: "horizontal",
        });
      }
    }

    // Snap right to other's left
    if (!hasSnappedX && Math.abs(elementRight - otherLeft) < SNAP_THRESHOLD) {
      snappedX = otherLeft - element.width;
      hasSnappedX = true;
      guides.push(createSnapGuide("vertical", otherLeft));

      // Show distance
      const distance = Math.abs(elementRight - otherLeft);
      if (distance > 0 && distance < 100) {
        distanceIndicators.push({
          x1: elementRight,
          y1: Math.min(elementTop, otherTop),
          x2: otherLeft,
          y2: Math.min(elementTop, otherTop),
          distance,
          orientation: "horizontal",
        });
      }
    }

    // Snap right to other's right
    if (!hasSnappedX && Math.abs(elementRight - otherRight) < SNAP_THRESHOLD) {
      snappedX = otherRight - element.width;
      hasSnappedX = true;
      guides.push(createSnapGuide("vertical", otherRight));
    }

    // Snap center X to other's center X
    if (
      !hasSnappedX &&
      Math.abs(elementCenterX - otherCenterX) < SNAP_THRESHOLD
    ) {
      snappedX = otherCenterX - element.width / 2;
      hasSnappedX = true;
      guides.push(createSnapGuide("vertical", otherCenterX));
    }

    // Snap top to other's top
    if (!hasSnappedY && Math.abs(elementTop - otherTop) < SNAP_THRESHOLD) {
      snappedY = otherTop;
      hasSnappedY = true;
      guides.push(createSnapGuide("horizontal", otherTop));
    }

    // Snap top to other's bottom
    if (!hasSnappedY && Math.abs(elementTop - otherBottom) < SNAP_THRESHOLD) {
      snappedY = otherBottom;
      hasSnappedY = true;
      guides.push(createSnapGuide("horizontal", otherBottom));

      // Show distance
      const distance = Math.abs(elementTop - otherBottom);
      if (distance > 0 && distance < 100) {
        distanceIndicators.push({
          x1: Math.min(elementLeft, otherLeft),
          y1: otherBottom,
          x2: Math.min(elementLeft, otherLeft),
          y2: elementTop,
          distance,
          orientation: "vertical",
        });
      }
    }

    // Snap bottom to other's top
    if (!hasSnappedY && Math.abs(elementBottom - otherTop) < SNAP_THRESHOLD) {
      snappedY = otherTop - element.height;
      hasSnappedY = true;
      guides.push(createSnapGuide("horizontal", otherTop));

      // Show distance
      const distance = Math.abs(elementBottom - otherTop);
      if (distance > 0 && distance < 100) {
        distanceIndicators.push({
          x1: Math.min(elementLeft, otherLeft),
          y1: elementBottom,
          x2: Math.min(elementLeft, otherLeft),
          y2: otherTop,
          distance,
          orientation: "vertical",
        });
      }
    }

    // Snap bottom to other's bottom
    if (
      !hasSnappedY &&
      Math.abs(elementBottom - otherBottom) < SNAP_THRESHOLD
    ) {
      snappedY = otherBottom - element.height;
      hasSnappedY = true;
      guides.push(createSnapGuide("horizontal", otherBottom));
    }

    // Snap center Y to other's center Y
    if (
      !hasSnappedY &&
      Math.abs(elementCenterY - otherCenterY) < SNAP_THRESHOLD
    ) {
      snappedY = otherCenterY - element.height / 2;
      hasSnappedY = true;
      guides.push(createSnapGuide("horizontal", otherCenterY));
    }
  }

  return {
    x: snappedX,
    y: snappedY,
    snappedX: hasSnappedX,
    snappedY: hasSnappedY,
    guides,
    distanceIndicators,
  };
}

/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns Distance in pixels
 *
 * @example
 * ```typescript
 * // Calculate distance of a 3-4-5 triangle
 * const dist = distance(0, 0, 3, 4);
 * // Returns: 5
 *
 * // Calculate horizontal distance
 * const dist = distance(10, 50, 100, 50);
 * // Returns: 90
 * ```
 */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Checks if two bounding boxes overlap (collision detection).
 *
 * @param box1 - First bounding box
 * @param box2 - Second bounding box
 * @returns True if boxes overlap, false otherwise
 *
 * @remarks
 * Boxes touching at the edge (0 overlap) are NOT considered overlapping.
 *
 * @example
 * ```typescript
 * const box1 = { x: 0, y: 0, width: 100, height: 100 };
 * const box2 = { x: 50, y: 50, width: 100, height: 100 };
 *
 * doBoxesOverlap(box1, box2); // true (50x50 overlap)
 *
 * const box3 = { x: 100, y: 0, width: 100, height: 100 };
 * doBoxesOverlap(box1, box3); // false (touching at edge)
 * ```
 */
export function doBoxesOverlap(box1: BoundingBox, box2: BoundingBox): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
}

/**
 * Calculates the area of overlap between two bounding boxes.
 *
 * @param box1 - First bounding box
 * @param box2 - Second bounding box
 * @returns Overlap area in square pixels (0 if no overlap)
 *
 * @example
 * ```typescript
 * const box1 = { x: 0, y: 0, width: 100, height: 100 };
 * const box2 = { x: 50, y: 50, width: 100, height: 100 };
 *
 * calculateOverlapArea(box1, box2); // 2500 (50x50 overlap)
 *
 * // Fully contained box
 * const small = { x: 25, y: 25, width: 50, height: 50 };
 * calculateOverlapArea(box1, small); // 2500 (entire small box)
 *
 * // No overlap
 * const box3 = { x: 150, y: 0, width: 100, height: 100 };
 * calculateOverlapArea(box1, box3); // 0
 * ```
 */
export function calculateOverlapArea(
  box1: BoundingBox,
  box2: BoundingBox
): number {
  if (!doBoxesOverlap(box1, box2)) return 0;

  const overlapX =
    Math.min(box1.x + box1.width, box2.x + box2.width) -
    Math.max(box1.x, box2.x);
  const overlapY =
    Math.min(box1.y + box1.height, box2.y + box2.height) -
    Math.max(box1.y, box2.y);

  return overlapX * overlapY;
}
