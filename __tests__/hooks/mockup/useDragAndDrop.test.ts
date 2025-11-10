import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDragAndDrop } from "@/hooks/mockup/useDragAndDrop";

describe("useDragAndDrop", () => {
  describe("Text Dragging", () => {
    it("should initialize with no text being dragged", () => {
      const { result } = renderHook(() => useDragAndDrop());

      expect(result.current.draggingText).toBeNull();
      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
    });

    it("should start text drag with correct ID and offset", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 10, y: 20 });
      });

      expect(result.current.draggingText).toBe("text-1");
      expect(result.current.dragOffset).toEqual({ x: 10, y: 20 });
    });

    it("should stop text drag and reset state", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 10, y: 20 });
      });

      expect(result.current.draggingText).toBe("text-1");

      act(() => {
        result.current.stopTextDrag();
      });

      expect(result.current.draggingText).toBeNull();
      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
    });

    it("should update drag when dragging different text", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 10, y: 20 });
      });

      expect(result.current.draggingText).toBe("text-1");

      act(() => {
        result.current.startTextDrag("text-2", { x: 30, y: 40 });
      });

      expect(result.current.draggingText).toBe("text-2");
      expect(result.current.dragOffset).toEqual({ x: 30, y: 40 });
    });
  });

  describe("Branding Dragging", () => {
    it("should initialize with branding not being dragged", () => {
      const { result } = renderHook(() => useDragAndDrop());

      expect(result.current.draggingBranding).toBe(false);
      expect(result.current.brandingDragOffset).toEqual({ x: 0, y: 0 });
    });

    it("should start branding drag with correct offset", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startBrandingDrag({ x: 15, y: 25 });
      });

      expect(result.current.draggingBranding).toBe(true);
      expect(result.current.brandingDragOffset).toEqual({ x: 15, y: 25 });
    });

    it("should stop branding drag and reset state", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startBrandingDrag({ x: 15, y: 25 });
      });

      expect(result.current.draggingBranding).toBe(true);

      act(() => {
        result.current.stopBrandingDrag();
      });

      expect(result.current.draggingBranding).toBe(false);
      expect(result.current.brandingDragOffset).toEqual({ x: 0, y: 0 });
    });
  });

  describe("Scene Device Dragging", () => {
    it("should initialize with no scene device being dragged", () => {
      const { result } = renderHook(() => useDragAndDrop());

      expect(result.current.draggingSceneDevice).toBeNull();
      expect(result.current.sceneDeviceDragOffset).toEqual({ x: 0, y: 0 });
    });

    it("should start scene device drag with correct ID and offset", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startSceneDeviceDrag("device-1", { x: 50, y: 60 });
      });

      expect(result.current.draggingSceneDevice).toBe("device-1");
      expect(result.current.sceneDeviceDragOffset).toEqual({ x: 50, y: 60 });
    });

    it("should stop scene device drag and reset state", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startSceneDeviceDrag("device-1", { x: 50, y: 60 });
      });

      expect(result.current.draggingSceneDevice).toBe("device-1");

      act(() => {
        result.current.stopSceneDeviceDrag();
      });

      expect(result.current.draggingSceneDevice).toBeNull();
      expect(result.current.sceneDeviceDragOffset).toEqual({ x: 0, y: 0 });
    });

    it("should switch between different scene devices", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startSceneDeviceDrag("device-1", { x: 50, y: 60 });
      });

      expect(result.current.draggingSceneDevice).toBe("device-1");

      act(() => {
        result.current.startSceneDeviceDrag("device-2", { x: 70, y: 80 });
      });

      expect(result.current.draggingSceneDevice).toBe("device-2");
      expect(result.current.sceneDeviceDragOffset).toEqual({ x: 70, y: 80 });
    });
  });

  describe("Independent State Management", () => {
    it("should allow text and branding to be dragged simultaneously", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 10, y: 20 });
        result.current.startBrandingDrag({ x: 30, y: 40 });
      });

      expect(result.current.draggingText).toBe("text-1");
      expect(result.current.dragOffset).toEqual({ x: 10, y: 20 });
      expect(result.current.draggingBranding).toBe(true);
      expect(result.current.brandingDragOffset).toEqual({ x: 30, y: 40 });
    });

    it("should stop text drag without affecting branding", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 10, y: 20 });
        result.current.startBrandingDrag({ x: 30, y: 40 });
      });

      act(() => {
        result.current.stopTextDrag();
      });

      expect(result.current.draggingText).toBeNull();
      expect(result.current.draggingBranding).toBe(true);
    });

    it("should stop branding drag without affecting text", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 10, y: 20 });
        result.current.startBrandingDrag({ x: 30, y: 40 });
      });

      act(() => {
        result.current.stopBrandingDrag();
      });

      expect(result.current.draggingText).toBe("text-1");
      expect(result.current.draggingBranding).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero offset values", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 0, y: 0 });
      });

      expect(result.current.dragOffset).toEqual({ x: 0, y: 0 });
    });

    it("should handle negative offset values", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: -10, y: -20 });
      });

      expect(result.current.dragOffset).toEqual({ x: -10, y: -20 });
    });

    it("should handle large offset values", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.startTextDrag("text-1", { x: 9999, y: 9999 });
      });

      expect(result.current.dragOffset).toEqual({ x: 9999, y: 9999 });
    });

    it("should stop drag even if not dragging", () => {
      const { result } = renderHook(() => useDragAndDrop());

      act(() => {
        result.current.stopTextDrag();
        result.current.stopBrandingDrag();
        result.current.stopSceneDeviceDrag();
      });

      expect(result.current.draggingText).toBeNull();
      expect(result.current.draggingBranding).toBe(false);
      expect(result.current.draggingSceneDevice).toBeNull();
    });
  });
});
