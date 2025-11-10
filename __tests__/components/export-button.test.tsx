/**
 * Integration tests for ExportButton component
 * Tests the critical export flow including format conversion, UI interactions,
 * and error handling.
 *
 * Note: Full end-to-end export testing is complex due to canvas/blob generation.
 * These tests focus on UI behavior, user interactions, and critical path validation.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportButton } from "@/components/export-button";

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/export-context", () => ({
  useExport: () => ({
    setIsExporting: vi.fn(),
  }),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}));

describe("ExportButton", () => {
  beforeEach(() => {
    // Create mock canvas element for each test
    const mockCanvas = document.createElement("div");
    mockCanvas.id = "mockup-canvas";
    mockCanvas.style.width = "800px";
    mockCanvas.style.height = "600px";
    document.body.appendChild(mockCanvas);
  });

  describe("Desktop UI", () => {
    it("should render desktop export button", () => {
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it("should show dropdown menu when clicked", async () => {
      const user = userEvent.setup();
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      await user.click(button);

      // Check for all format options
      expect(screen.getByText("Export as PNG (1x)")).toBeInTheDocument();
      expect(screen.getByText("Export as PNG (2x)")).toBeInTheDocument();
      expect(screen.getByText("Export as PNG (4x)")).toBeInTheDocument();
      expect(screen.getByText("Export as PNG (8x)")).toBeInTheDocument();
      expect(screen.getByText("Export as JPG (4x)")).toBeInTheDocument();
      expect(screen.getByText("Export as WebP (4x)")).toBeInTheDocument();
    });

    it("should have correct button styles", () => {
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      expect(button).toHaveClass("bg-primary");
      expect(button).toHaveClass("text-primary-foreground");
    });
  });

  describe("Mobile UI", () => {
    it("should render mobile export button", () => {
      render(<ExportButton isMobile={true} />);

      const button = screen.getByRole("button", { name: /export/i });
      expect(button).toBeInTheDocument();
    });

    it("should show mobile dialog when clicked", async () => {
      const user = userEvent.setup();
      render(<ExportButton isMobile={true} />);

      const button = screen.getByRole("button", { name: /export/i });
      await user.click(button);

      expect(screen.getByText("Export Options")).toBeInTheDocument();
      expect(screen.getByText("PNG")).toBeInTheDocument();
      expect(screen.getByText("JPEG")).toBeInTheDocument();
      expect(screen.getByText("WebP")).toBeInTheDocument();
    });

    it("should have all scale options in mobile dialog", async () => {
      const user = userEvent.setup();
      render(<ExportButton isMobile={true} />);

      const button = screen.getByRole("button", { name: /export/i });
      await user.click(button);

      // PNG scale options
      expect(screen.getByRole("button", { name: "1x" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "2x" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "4x" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "8x" })).toBeInTheDocument();

      // Other formats - use getAllByRole since there are 2 "4x Quality" buttons (JPG and WebP)
      const qualityButtons = screen.getAllByRole("button", {
        name: "4x Quality",
      });
      expect(qualityButtons).toHaveLength(2); // JPEG and WebP
    });
  });

  describe("Export Format Options", () => {
    it("should provide PNG export at multiple scales", async () => {
      const user = userEvent.setup();
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      await user.click(button);

      // Verify all PNG scale options are available
      expect(screen.getByText("Export as PNG (1x)")).toBeInTheDocument();
      expect(screen.getByText("Export as PNG (2x)")).toBeInTheDocument();
      expect(screen.getByText("Export as PNG (4x)")).toBeInTheDocument();
      expect(screen.getByText("Export as PNG (8x)")).toBeInTheDocument();
    });

    it("should provide JPEG and WebP export options", async () => {
      const user = userEvent.setup();
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      await user.click(button);

      expect(screen.getByText("Export as JPG (4x)")).toBeInTheDocument();
      expect(screen.getByText("Export as WebP (4x)")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing canvas element gracefully", () => {
      // Remove canvas from DOM
      const canvas = document.getElementById("mockup-canvas");
      if (canvas) {
        document.body.removeChild(canvas);
      }

      // Component should still render without error
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Ref API", () => {
    it("should expose openMenu method via ref", () => {
      const ref = { current: null } as unknown as React.RefObject<{
        openMenu: () => void;
      }>;
      render(<ExportButton ref={ref} isMobile={false} />);

      expect(ref.current).toBeDefined();
      expect(ref.current?.openMenu).toBeInstanceOf(Function);
    });

    it("should support imperative handle for programmatic control", () => {
      const ref = { current: null } as unknown as React.RefObject<{
        openMenu: () => void;
      }>;
      render(<ExportButton ref={ref} isMobile={true} />);

      expect(ref.current?.openMenu).toBeDefined();
      // Verify method is callable without errors
      expect(() => ref.current?.openMenu()).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes for dropdown", () => {
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      expect(button).toHaveAttribute("aria-haspopup", "menu");
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });

      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe("Loading States", () => {
    it("should not be disabled by default", () => {
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      expect(button).not.toBeDisabled();
    });

    it("should show loading icon when exporting", async () => {
      const user = userEvent.setup();
      render(<ExportButton isMobile={false} />);

      const button = screen.getByRole("button", { name: /export 4x · png/i });
      await user.click(button);

      const png4x = screen.getByText("Export as PNG (4x)");
      await user.click(png4x);

      // Should show loading state
      expect(screen.getByText("Exporting...")).toBeInTheDocument();
    });
  });
});
