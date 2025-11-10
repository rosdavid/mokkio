import { useRef, useCallback } from "react";
import type { RefObject } from "react";

/**
 * Configuration options for the useBranding hook
 */
export interface UseBrandingOptions {
  /**
   * The branding configuration object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  branding: any;

  /**
   * Function to update the branding configuration
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setBranding: ((branding: any) => void) | null | undefined;

  /**
   * Callback triggered when branding is double-clicked
   */
  onBrandingDoubleClick?: () => void;

  /**
   * Function to start dragging the branding element
   */
  startBrandingDrag: (offset: { x: number; y: number }) => void;

  /**
   * Scale factor of the canvas
   */
  scaleFactor: number;

  /**
   * Reference to the canvas container element
   */
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * Custom hook for managing branding interactions
 *
 * This hook provides functionality for:
 * - Double-click detection on branding elements
 * - Branding drag initiation
 * - Click count tracking
 *
 * @param options - Configuration options for branding management
 * @returns Object containing the mouse down handler
 *
 * @example
 * ```tsx
 * const { handleBrandingMouseDown } = useBranding({
 *   branding,
 *   setBranding,
 *   onBrandingDoubleClick,
 *   startBrandingDrag,
 *   scaleFactor,
 *   containerRef,
 * });
 * ```
 */
export function useBranding(options: UseBrandingOptions) {
  const {
    branding,
    setBranding,
    onBrandingDoubleClick,
    startBrandingDrag,
    scaleFactor,
    containerRef,
  } = options;

  // Click tracking for double-click detection
  const brandingClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const brandingClickCountRef = useRef(0);

  /**
   * Handle mouse down on branding element
   * Implements double-click detection with a 250ms timeout
   */
  const handleBrandingMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!branding || !setBranding) return;
      e.preventDefault();
      e.stopPropagation();

      // Increment click count
      brandingClickCountRef.current += 1;

      if (brandingClickCountRef.current === 1) {
        // First click - start drag after a delay
        brandingClickTimeoutRef.current = setTimeout(() => {
          brandingClickCountRef.current = 0;

          // Start drag operation
          // Calculate offset from mouse to branding position
          const canvasRect = containerRef.current?.getBoundingClientRect();
          if (!canvasRect) return;

          // Calculate mouse position relative to the canvas
          const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
          const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

          startBrandingDrag({
            x: mouseX - branding.x,
            y: mouseY - branding.y,
          });
        }, 250); // Wait 250ms to see if there's a second click
      } else if (brandingClickCountRef.current === 2) {
        // Second click - it's a double click!
        if (brandingClickTimeoutRef.current) {
          clearTimeout(brandingClickTimeoutRef.current);
          brandingClickTimeoutRef.current = null;
        }
        brandingClickCountRef.current = 0;

        // Trigger double click callback
        onBrandingDoubleClick?.();
      }
    },
    [
      branding,
      setBranding,
      onBrandingDoubleClick,
      startBrandingDrag,
      scaleFactor,
      containerRef,
    ]
  );

  return {
    handleBrandingMouseDown,
  };
}
