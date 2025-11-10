import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBranding } from "@/hooks/mockup/useBranding";
import type { UseBrandingOptions } from "@/hooks/mockup/useBranding";
import { createRef } from "react";
import type { Mock } from "vitest";

describe("useBranding", () => {
  let containerRef: ReturnType<typeof createRef<HTMLDivElement>>;
  let mockStartBrandingDrag: Mock;
  let mockOnBrandingDoubleClick: Mock;
  let mockSetBranding: Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    containerRef = createRef<HTMLDivElement>();
    mockStartBrandingDrag = vi.fn();
    mockOnBrandingDoubleClick = vi.fn();
    mockSetBranding = vi.fn();

    // Mock container ref with getBoundingClientRect
    Object.defineProperty(containerRef, "current", {
      value: {
        getBoundingClientRect: () => ({
          left: 100,
          top: 100,
          width: 800,
          height: 600,
        }),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  const createOptions = (
    overrides?: Partial<UseBrandingOptions>
  ): UseBrandingOptions => ({
    branding: {
      x: 50,
      y: 100,
      text: "Test Branding",
      enabled: true,
    },
    setBranding: mockSetBranding,
    onBrandingDoubleClick: mockOnBrandingDoubleClick,
    startBrandingDrag: mockStartBrandingDrag,
    scaleFactor: 1,
    containerRef,
    ...overrides,
  });

  describe("Initialization", () => {
    it("should provide handleBrandingMouseDown function", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      expect(result.current.handleBrandingMouseDown).toBeDefined();
      expect(typeof result.current.handleBrandingMouseDown).toBe("function");
    });
  });

  describe("Single Click (Drag Initiation)", () => {
    it("should start drag after 250ms delay on single click", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      // Should not drag immediately
      expect(mockStartBrandingDrag).not.toHaveBeenCalled();

      // Fast-forward 250ms
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // Should now have started drag
      expect(mockStartBrandingDrag).toHaveBeenCalledWith({
        x: 50, // (200 - 100) / 1 - 50
        y: 50, // (250 - 100) / 1 - 100
      });
    });

    it("should prevent default and stop propagation", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      expect(mouseEvent.preventDefault).toHaveBeenCalled();
      expect(mouseEvent.stopPropagation).toHaveBeenCalled();
    });

    it("should calculate offset correctly with scale factor", () => {
      const { result } = renderHook(() =>
        useBranding(createOptions({ scaleFactor: 2 }))
      );

      const mouseEvent = {
        clientX: 300,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).toHaveBeenCalledWith({
        x: 50, // (300 - 100) / 2 - 50
        y: 50, // (400 - 100) / 2 - 100
      });
    });
  });

  describe("Double Click", () => {
    it("should trigger double click callback on second click within 250ms", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // First click
      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      // Second click before 250ms
      act(() => {
        vi.advanceTimersByTime(100);
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      expect(mockOnBrandingDoubleClick).toHaveBeenCalled();
      expect(mockStartBrandingDrag).not.toHaveBeenCalled();
    });

    it("should not trigger drag when double-clicked", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // Double click
      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
        vi.advanceTimersByTime(100);
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      // Advance past the drag timeout
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).not.toHaveBeenCalled();
      expect(mockOnBrandingDoubleClick).toHaveBeenCalled();
    });

    it("should reset click count after double click", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // First double click
      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
        vi.advanceTimersByTime(100);
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      expect(mockOnBrandingDoubleClick).toHaveBeenCalledTimes(1);

      // Reset mocks
      mockOnBrandingDoubleClick.mockClear();

      // Wait for timeout to clear
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // Third click should start a new sequence
      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).toHaveBeenCalled();
      expect(mockOnBrandingDoubleClick).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should do nothing if branding is null", () => {
      const { result } = renderHook(() =>
        useBranding(createOptions({ branding: null }))
      );

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).not.toHaveBeenCalled();
      expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
    });

    it("should do nothing if setBranding is null", () => {
      const { result } = renderHook(() =>
        useBranding(createOptions({ setBranding: null }))
      );

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).not.toHaveBeenCalled();
      expect(mouseEvent.preventDefault).not.toHaveBeenCalled();
    });

    it("should do nothing if containerRef is null", () => {
      const nullRef = createRef<HTMLDivElement>();

      const { result } = renderHook(() =>
        useBranding(createOptions({ containerRef: nullRef }))
      );

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).not.toHaveBeenCalled();
    });

    it("should handle missing onBrandingDoubleClick callback", () => {
      const { result } = renderHook(() =>
        useBranding(createOptions({ onBrandingDoubleClick: undefined }))
      );

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // Should not throw when double-clicking
      expect(() => {
        act(() => {
          result.current.handleBrandingMouseDown(mouseEvent);
          vi.advanceTimersByTime(100);
          result.current.handleBrandingMouseDown(mouseEvent);
        });
      }).not.toThrow();
    });

    it("should handle zero coordinates", () => {
      const { result } = renderHook(() =>
        useBranding(
          createOptions({
            branding: { x: 0, y: 0, text: "Test", enabled: true },
          })
        )
      );

      const mouseEvent = {
        clientX: 100,
        clientY: 100,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).toHaveBeenCalledWith({
        x: 0, // (100 - 100) / 1 - 0
        y: 0, // (100 - 100) / 1 - 0
      });
    });

    it("should handle negative coordinates", () => {
      const { result } = renderHook(() =>
        useBranding(
          createOptions({
            branding: { x: -50, y: -100, text: "Test", enabled: true },
          })
        )
      );

      const mouseEvent = {
        clientX: 50,
        clientY: 50,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).toHaveBeenCalledWith({
        x: 0, // (50 - 100) / 1 - (-50)
        y: 50, // (50 - 100) / 1 - (-100)
      });
    });
  });

  describe("Click Timing", () => {
    it("should trigger drag if second click comes after 250ms", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // First click
      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      // Wait for drag to trigger
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).toHaveBeenCalledTimes(1);

      // Second click after timeout should start new sequence
      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
        vi.advanceTimersByTime(250);
      });

      expect(mockStartBrandingDrag).toHaveBeenCalledTimes(2);
    });

    it("should handle rapid triple clicks correctly", () => {
      const { result } = renderHook(() => useBranding(createOptions()));

      const mouseEvent = {
        clientX: 200,
        clientY: 250,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // Triple click
      act(() => {
        result.current.handleBrandingMouseDown(mouseEvent);
        vi.advanceTimersByTime(50);
        result.current.handleBrandingMouseDown(mouseEvent);
        vi.advanceTimersByTime(50);
        result.current.handleBrandingMouseDown(mouseEvent);
      });

      // Double click should have triggered
      expect(mockOnBrandingDoubleClick).toHaveBeenCalledTimes(1);

      // Third click shouldn't trigger anything yet
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // Drag might trigger from third click
      // This behavior depends on implementation
    });
  });
});
