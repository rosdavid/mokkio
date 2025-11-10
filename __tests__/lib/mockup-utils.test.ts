import { describe, it, expect } from "vitest";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  STANDARD_SCALE,
  computeRenderSize,
  getDeviceDimensions,
  getEffectiveZoom,
} from "@/lib/mockup-utils";

describe("mockup-utils", () => {
  describe("constants", () => {
    it("should have correct canvas dimensions", () => {
      expect(CANVAS_WIDTH).toBe(1280);
      expect(CANVAS_HEIGHT).toBe(720);
    });

    it("should have correct standard scale", () => {
      expect(STANDARD_SCALE).toBe(0.7);
    });
  });

  describe("computeRenderSize", () => {
    it("should compute render size for landscape device within canvas bounds", () => {
      const result = computeRenderSize(1200, 800);

      expect(result.width).toBeLessThanOrEqual(CANVAS_WIDTH);
      expect(result.height).toBeLessThanOrEqual(CANVAS_HEIGHT);
      expect(result.width / result.height).toBeCloseTo(1200 / 800);
    });

    it("should compute render size for portrait device within canvas bounds", () => {
      const result = computeRenderSize(800, 1200);

      expect(result.width).toBeLessThanOrEqual(CANVAS_WIDTH);
      expect(result.height).toBeLessThanOrEqual(CANVAS_HEIGHT);
      expect(result.width / result.height).toBeCloseTo(800 / 1200);
    });

    it("should scale down device larger than canvas", () => {
      const result = computeRenderSize(2000, 1500);

      expect(result.width).toBeLessThanOrEqual(CANVAS_WIDTH);
      expect(result.height).toBeLessThanOrEqual(CANVAS_HEIGHT);
    });

    it("should maintain aspect ratio", () => {
      const deviceW = 1440;
      const deviceH = 900;
      const result = computeRenderSize(deviceW, deviceH);

      const originalRatio = deviceW / deviceH;
      const computedRatio = result.width / result.height;

      expect(computedRatio).toBeCloseTo(originalRatio, 2);
    });

    it("should handle very tall devices", () => {
      const result = computeRenderSize(400, 2000);

      expect(result.width).toBeLessThanOrEqual(CANVAS_WIDTH);
      expect(result.height).toBeLessThanOrEqual(CANVAS_HEIGHT);
      expect(result.height).toBe(CANVAS_HEIGHT);
    });

    it("should handle very wide devices", () => {
      const result = computeRenderSize(2000, 400);

      expect(result.width).toBeLessThanOrEqual(CANVAS_WIDTH);
      expect(result.height).toBeLessThanOrEqual(CANVAS_HEIGHT);
      expect(result.width).toBe(CANVAS_WIDTH);
    });

    it("should return integer values", () => {
      const result = computeRenderSize(1234, 567);

      expect(Number.isInteger(result.width)).toBe(true);
      expect(Number.isInteger(result.height)).toBe(true);
    });
  });

  describe("getDeviceDimensions", () => {
    it("should return correct dimensions for screenshot", () => {
      const result = getDeviceDimensions("screenshot");

      expect(result).toEqual({
        width: 1200,
        height: 800,
        type: "screenshot",
      });
    });

    it("should return correct dimensions for safari browser", () => {
      const result = getDeviceDimensions("safari");

      expect(result).toEqual({
        width: 1440,
        height: 900,
        type: "browser",
      });
    });

    it("should return correct dimensions for chrome browser", () => {
      const result = getDeviceDimensions("chrome");

      expect(result).toEqual({
        width: 1440,
        height: 900,
        type: "browser",
      });
    });

    it("should return correct dimensions for iPhone 17 Pro", () => {
      const result = getDeviceDimensions("iphone-17-pro");

      expect(result).toEqual({
        width: 402,
        height: 874,
        type: "mobile",
      });
    });

    it("should return correct dimensions for iPhone 17 Pro Max", () => {
      const result = getDeviceDimensions("iphone-17-pro-max");

      expect(result).toEqual({
        width: 440,
        height: 956,
        type: "mobile",
      });
    });

    it("should return correct dimensions for MacBook Pro 16", () => {
      const result = getDeviceDimensions("macbook-pro-16");

      expect(result).toEqual({
        width: 1512,
        height: 982,
        type: "desktop",
      });
    });

    it("should return correct dimensions for iPad Pro 13", () => {
      const result = getDeviceDimensions("ipad-pro-13");

      expect(result).toEqual({
        width: 1024,
        height: 1366,
        type: "tablet",
      });
    });

    it("should handle device aliases correctly", () => {
      const macbook = getDeviceDimensions("macbook-pro");
      const macbook16 = getDeviceDimensions("macbook-pro-16");

      expect(macbook).toEqual(macbook16);
    });

    it("should return screenshot as default for unknown device", () => {
      const result = getDeviceDimensions("unknown-device");

      expect(result).toEqual({
        width: 1200,
        height: 800,
        type: "screenshot",
      });
    });

    it("should return screenshot as default when no device provided", () => {
      const result = getDeviceDimensions();

      expect(result).toEqual({
        width: 1200,
        height: 800,
        type: "screenshot",
      });
    });
  });

  describe("getEffectiveZoom", () => {
    it("should calculate base zoom correctly", () => {
      const zoom = 100;
      const result = getEffectiveZoom(zoom, "single", "screenshot");

      // Base zoom should be (100 / 100) * 0.7 = 0.7
      expect(result).toBe(0.7);
    });

    it("should apply mobile device multiplier", () => {
      const zoom = 100;
      const result = getEffectiveZoom(zoom, "single", "iphone-17-pro");

      // Mobile: 0.7 * 1.2 = 0.84
      expect(result).toBeCloseTo(0.84, 2);
    });

    it("should apply desktop device multiplier", () => {
      const zoom = 100;
      const result = getEffectiveZoom(zoom, "single", "macbook-pro-16");

      // Desktop: 0.7 * 0.8 = 0.56
      expect(result).toBeCloseTo(0.56, 2);
    });

    it("should scale with zoom parameter", () => {
      const zoom = 150;
      const result = getEffectiveZoom(zoom, "single", "screenshot");

      // (150 / 100) * 0.7 = 1.05
      expect(result).toBeCloseTo(1.05, 2);
    });

    it("should handle double layout mode", () => {
      const zoom = 100;
      const resultSingle = getEffectiveZoom(zoom, "single", "screenshot");
      const resultDouble = getEffectiveZoom(zoom, "double", "screenshot");

      // Layout mode adjustments removed in implementation
      expect(resultDouble).toBe(resultSingle);
    });

    it("should handle triple layout mode", () => {
      const zoom = 100;
      const resultSingle = getEffectiveZoom(zoom, "single", "screenshot");
      const resultTriple = getEffectiveZoom(zoom, "triple", "screenshot");

      // Layout mode adjustments removed in implementation
      expect(resultTriple).toBe(resultSingle);
    });

    it("should handle scene-builder mode", () => {
      const zoom = 100;
      const result = getEffectiveZoom(zoom, "scene-builder", "screenshot");

      expect(result).toBeGreaterThan(0);
    });

    it("should handle zero zoom", () => {
      const result = getEffectiveZoom(0, "single", "screenshot");

      expect(result).toBe(0);
    });

    it("should handle very high zoom", () => {
      const zoom = 500;
      const result = getEffectiveZoom(zoom, "single", "screenshot");

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(10); // Sanity check
    });
  });
});
