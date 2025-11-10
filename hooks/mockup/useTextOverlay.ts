/**
 * useTextOverlay Hook
 *
 * Manages text overlay selection and double-click detection.
 * Handles the interaction logic for text elements on the canvas.
 *
 * @example
 * ```tsx
 * const {
 *   selectedTextId,
 *   setSelectedTextId,
 *   handleTextMouseDown,
 * } = useTextOverlay({
 *   texts,
 *   onTextDoubleClick,
 *   startTextDrag,
 *   scaleFactor,
 *   containerRef,
 * });
 * ```
 */

import { useState, useRef, useCallback, RefObject } from "react";

export interface TextOverlayItem {
  id: string;
  x: number;
  y: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}

export interface DragOffset {
  x: number;
  y: number;
}

export interface UseTextOverlayOptions {
  /**
   * Array of text overlay items
   */
  texts: TextOverlayItem[];

  /**
   * Callback when text is double-clicked
   */
  onTextDoubleClick?: (textId: string) => void;

  /**
   * Function to start dragging text
   */
  startTextDrag: (textId: string, offset: DragOffset) => void;

  /**
   * Scale factor for canvas coordinates
   */
  scaleFactor: number;

  /**
   * Reference to the canvas container
   */
  containerRef: RefObject<HTMLDivElement | null>;
}

export interface UseTextOverlayReturn {
  /**
   * Currently selected text ID
   */
  selectedTextId: string | null;

  /**
   * Set the selected text ID
   */
  setSelectedTextId: (id: string | null) => void;

  /**
   * Handle mouse down on text element
   */
  handleTextMouseDown: (e: React.MouseEvent, textId: string) => void;
}

/**
 * Hook for managing text overlay interactions
 */
export function useTextOverlay(
  options: UseTextOverlayOptions
): UseTextOverlayReturn {
  const { texts, onTextDoubleClick, startTextDrag, scaleFactor, containerRef } =
    options;

  // Selection state
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Double click detection refs
  const textClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textClickCountRef = useRef<{ [key: string]: number }>({});

  /**
   * Handle mouse down on text element with double-click detection
   */
  const handleTextMouseDown = useCallback(
    (e: React.MouseEvent, textId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const text = texts.find((t) => t.id === textId);
      if (!text) return;

      // Double click detection
      if (!textClickCountRef.current[textId]) {
        textClickCountRef.current[textId] = 0;
      }

      textClickCountRef.current[textId] += 1;

      if (textClickCountRef.current[textId] === 1) {
        // First click - start drag after a delay
        textClickTimeoutRef.current = setTimeout(() => {
          textClickCountRef.current[textId] = 0;

          // Start drag operation
          setSelectedTextId(textId);

          // Calculate offset from mouse to text position
          const canvasRect = containerRef.current?.getBoundingClientRect();
          if (!canvasRect) return;

          // Calculate mouse position relative to the canvas
          const mouseX = (e.clientX - canvasRect.left) / scaleFactor;
          const mouseY = (e.clientY - canvasRect.top) / scaleFactor;

          startTextDrag(textId, {
            x: mouseX - text.x,
            y: mouseY - text.y,
          });
        }, 250); // Wait 250ms to see if there's a second click
      } else if (textClickCountRef.current[textId] === 2) {
        // Second click - it's a double click!
        if (textClickTimeoutRef.current) {
          clearTimeout(textClickTimeoutRef.current);
          textClickTimeoutRef.current = null;
        }
        textClickCountRef.current[textId] = 0;

        // Trigger double click callback
        onTextDoubleClick?.(textId);
      }
    },
    [texts, onTextDoubleClick, startTextDrag, scaleFactor, containerRef]
  );

  return {
    selectedTextId,
    setSelectedTextId,
    handleTextMouseDown,
  };
}
