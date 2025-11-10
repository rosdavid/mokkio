import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTextOverlay } from "@/hooks/mockup/useTextOverlay";
import type { UseTextOverlayOptions } from "@/hooks/mockup/useTextOverlay";
import { createRef } from "react";
import type { Mock } from "vitest";

describe("useTextOverlay", () => {
  let containerRef: ReturnType<typeof createRef<HTMLDivElement>>;
  let mockStartTextDrag: Mock;
  let mockOnTextDoubleClick: Mock;

  beforeEach(() => {
    vi.useFakeTimers();
    containerRef = createRef<HTMLDivElement>();
    mockStartTextDrag = vi.fn();
    mockOnTextDoubleClick = vi.fn();

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
    overrides?: Partial<UseTextOverlayOptions>
  ): UseTextOverlayOptions => ({
    texts: [
      { id: "text-1", x: 100, y: 200, content: "Test 1" },
      { id: "text-2", x: 300, y: 400, content: "Test 2" },
    ],
    onTextDoubleClick: mockOnTextDoubleClick,
    startTextDrag: mockStartTextDrag,
    scaleFactor: 1,
    containerRef,
    ...overrides,
  });

  describe("Initialization", () => {
    it("should initialize with no text selected", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      expect(result.current.selectedTextId).toBeNull();
    });

    it("should provide setSelectedTextId function", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      act(() => {
        result.current.setSelectedTextId("text-1");
      });

      expect(result.current.selectedTextId).toBe("text-1");
    });
  });

  describe("Single Click (Drag Initiation)", () => {
    it("should start drag after 250ms delay on single click", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      // Should not drag immediately
      expect(mockStartTextDrag).not.toHaveBeenCalled();

      // Fast-forward 250ms
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // Should now have started drag
      expect(mockStartTextDrag).toHaveBeenCalledWith("text-1", {
        x: 50, // (250 - 100) / 1 - 100
        y: 50, // (350 - 100) / 1 - 200
      });

      expect(result.current.selectedTextId).toBe("text-1");
    });

    it("should prevent default and stop propagation", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      expect(mouseEvent.preventDefault).toHaveBeenCalled();
      expect(mouseEvent.stopPropagation).toHaveBeenCalled();
    });

    it("should calculate offset correctly with scale factor", () => {
      const { result } = renderHook(() =>
        useTextOverlay(createOptions({ scaleFactor: 2 }))
      );

      const mouseEvent = {
        clientX: 300,
        clientY: 400,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartTextDrag).toHaveBeenCalledWith("text-1", {
        x: 0, // (300 - 100) / 2 - 100
        y: -50, // (400 - 100) / 2 - 200
      });
    });
  });

  describe("Double Click", () => {
    it("should trigger double click callback on second click within 250ms", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // First click
      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      // Second click before 250ms
      act(() => {
        vi.advanceTimersByTime(100);
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      expect(mockOnTextDoubleClick).toHaveBeenCalledWith("text-1");
      expect(mockStartTextDrag).not.toHaveBeenCalled();
    });

    it("should not trigger drag when double-clicked", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // Double click
      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
        vi.advanceTimersByTime(100);
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      // Advance past the drag timeout
      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartTextDrag).not.toHaveBeenCalled();
      expect(mockOnTextDoubleClick).toHaveBeenCalledWith("text-1");
    });

    it("should reset click count after double click", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // First double click
      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
        vi.advanceTimersByTime(100);
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      expect(mockOnTextDoubleClick).toHaveBeenCalledTimes(1);

      // Reset mocks
      mockOnTextDoubleClick.mockClear();

      // Wait for timeout to clear
      act(() => {
        vi.advanceTimersByTime(250);
      });

      // Third click should start a new sequence
      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
        vi.advanceTimersByTime(250);
      });

      expect(mockStartTextDrag).toHaveBeenCalled();
      expect(mockOnTextDoubleClick).not.toHaveBeenCalled();
    });
  });

  describe("Multiple Text Elements", () => {
    it("should handle clicks on different texts independently", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent1 = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      const mouseEvent2 = {
        clientX: 450,
        clientY: 550,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // Click on text-1
      act(() => {
        result.current.handleTextMouseDown(mouseEvent1, "text-1");
        vi.advanceTimersByTime(250);
      });

      expect(mockStartTextDrag).toHaveBeenCalledWith(
        "text-1",
        expect.any(Object)
      );

      mockStartTextDrag.mockClear();

      // Click on text-2
      act(() => {
        result.current.handleTextMouseDown(mouseEvent2, "text-2");
        vi.advanceTimersByTime(250);
      });

      expect(mockStartTextDrag).toHaveBeenCalledWith(
        "text-2",
        expect.any(Object)
      );
    });

    it("should track double clicks separately for each text", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // Double click text-1
      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
        vi.advanceTimersByTime(100);
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      expect(mockOnTextDoubleClick).toHaveBeenCalledWith("text-1");

      mockOnTextDoubleClick.mockClear();

      // Single click text-2 (should not trigger double click)
      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-2");
        vi.advanceTimersByTime(250);
      });

      expect(mockOnTextDoubleClick).not.toHaveBeenCalled();
      expect(mockStartTextDrag).toHaveBeenCalledWith(
        "text-2",
        expect.any(Object)
      );
    });
  });

  describe("Edge Cases", () => {
    it("should do nothing if text is not found", () => {
      const { result } = renderHook(() => useTextOverlay(createOptions()));

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "non-existent-text");
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartTextDrag).not.toHaveBeenCalled();
    });

    it("should do nothing if containerRef is null", () => {
      const nullRef = createRef<HTMLDivElement>();

      const { result } = renderHook(() =>
        useTextOverlay(createOptions({ containerRef: nullRef }))
      );

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleTextMouseDown(mouseEvent, "text-1");
      });

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(mockStartTextDrag).not.toHaveBeenCalled();
    });

    it("should handle missing onTextDoubleClick callback", () => {
      const { result } = renderHook(() =>
        useTextOverlay(createOptions({ onTextDoubleClick: undefined }))
      );

      const mouseEvent = {
        clientX: 250,
        clientY: 350,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      } as unknown as React.MouseEvent;

      // Should not throw when double-clicking
      expect(() => {
        act(() => {
          result.current.handleTextMouseDown(mouseEvent, "text-1");
          vi.advanceTimersByTime(100);
          result.current.handleTextMouseDown(mouseEvent, "text-1");
        });
      }).not.toThrow();
    });
  });
});
