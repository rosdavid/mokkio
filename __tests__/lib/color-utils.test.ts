import { describe, it, expect } from "vitest";
import {
  solidColors,
  blueColors,
  greenColors,
  yellowColors,
  redColors,
  orangeColors,
  pinkColors,
  purpleColors,
  colorGroups,
  rgbToHex,
  hexToRgb,
  getRandomColor,
  generateMagicalGradients,
} from "@/lib/mockup/color-utils";

describe("color-utils", () => {
  describe("Color Palettes", () => {
    it("should have solid colors palette with correct length", () => {
      expect(solidColors).toHaveLength(12);
      expect(solidColors[0]).toBe("#ffffff");
      expect(solidColors[solidColors.length - 1]).toBe("#050505");
    });

    it("should have blue colors palette", () => {
      expect(blueColors).toHaveLength(12);
      expect(blueColors[0]).toBe("#eff6ff");
      expect(blueColors).toContain("#3b82f6");
    });

    it("should have green colors palette", () => {
      expect(greenColors).toHaveLength(12);
      expect(greenColors[0]).toBe("#f0fdf4");
      expect(greenColors).toContain("#22c55e");
    });

    it("should have yellow colors palette", () => {
      expect(yellowColors).toHaveLength(12);
      expect(yellowColors[0]).toBe("#fefce8");
      expect(yellowColors).toContain("#f59e0b");
    });

    it("should have red colors palette", () => {
      expect(redColors).toHaveLength(12);
      expect(redColors[0]).toBe("#fef2f2");
      expect(redColors).toContain("#ef4444");
    });

    it("should have orange colors palette", () => {
      expect(orangeColors).toHaveLength(12);
      expect(orangeColors[0]).toBe("#fff7ed");
      expect(orangeColors).toContain("#f97316");
    });

    it("should have pink colors palette", () => {
      expect(pinkColors).toHaveLength(12);
      expect(pinkColors[0]).toBe("#fdf2f8");
      expect(pinkColors).toContain("#ec4899");
    });

    it("should have purple colors palette", () => {
      expect(purpleColors).toHaveLength(12);
      expect(purpleColors[0]).toBe("#faf5ff");
      expect(purpleColors).toContain("#a855f7");
    });

    it("should have color groups with correct structure", () => {
      expect(colorGroups).toHaveLength(8);
      expect(colorGroups[0]).toEqual({
        name: "Grays",
        colors: solidColors,
      });
      expect(colorGroups[1].name).toBe("Blues");
      expect(colorGroups[7].name).toBe("Purples");
    });

    it("should have all color groups with 12 colors each", () => {
      colorGroups.forEach((group) => {
        expect(group.colors).toHaveLength(12);
      });
    });
  });

  describe("rgbToHex", () => {
    it("should convert RGB to hex correctly", () => {
      expect(rgbToHex([255, 0, 0])).toBe("#ff0000");
      expect(rgbToHex([0, 255, 0])).toBe("#00ff00");
      expect(rgbToHex([0, 0, 255])).toBe("#0000ff");
    });

    it("should handle white color", () => {
      expect(rgbToHex([255, 255, 255])).toBe("#ffffff");
    });

    it("should handle black color", () => {
      expect(rgbToHex([0, 0, 0])).toBe("#000000");
    });

    it("should pad single digit values with zero", () => {
      expect(rgbToHex([15, 15, 15])).toBe("#0f0f0f");
      expect(rgbToHex([1, 2, 3])).toBe("#010203");
    });

    it("should handle arbitrary RGB values", () => {
      expect(rgbToHex([123, 45, 67])).toBe("#7b2d43");
      expect(rgbToHex([200, 150, 100])).toBe("#c89664");
    });
  });

  describe("hexToRgb", () => {
    it("should convert hex to RGB correctly", () => {
      expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
      expect(hexToRgb("#00ff00")).toEqual([0, 255, 0]);
      expect(hexToRgb("#0000ff")).toEqual([0, 0, 255]);
    });

    it("should handle hex without # prefix", () => {
      expect(hexToRgb("ff0000")).toEqual([255, 0, 0]);
      expect(hexToRgb("00ff00")).toEqual([0, 255, 0]);
    });

    it("should handle white color", () => {
      expect(hexToRgb("#ffffff")).toEqual([255, 255, 255]);
      expect(hexToRgb("ffffff")).toEqual([255, 255, 255]);
    });

    it("should handle black color", () => {
      expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
      expect(hexToRgb("000000")).toEqual([0, 0, 0]);
    });

    it("should handle arbitrary hex values", () => {
      expect(hexToRgb("#7b2d43")).toEqual([123, 45, 67]);
      expect(hexToRgb("#c89664")).toEqual([200, 150, 100]);
    });

    it("should handle uppercase hex values", () => {
      expect(hexToRgb("#FF0000")).toEqual([255, 0, 0]);
      expect(hexToRgb("#ABCDEF")).toEqual([171, 205, 239]);
    });

    it("should return null for invalid hex", () => {
      expect(hexToRgb("invalid")).toBeNull();
      expect(hexToRgb("#zzz")).toBeNull();
      expect(hexToRgb("#12345")).toBeNull();
    });
  });

  describe("getRandomColor", () => {
    it("should return a color from the provided array", () => {
      const testColors = ["#ff0000", "#00ff00", "#0000ff"];
      const result = getRandomColor(testColors);
      expect(testColors).toContain(result);
    });

    it("should return different colors on multiple calls", () => {
      const testColors = Array.from({ length: 20 }, (_, i) => `#color${i}`);
      const results = new Set(
        Array.from({ length: 50 }, () => getRandomColor(testColors))
      );
      // With 50 calls from 20 colors, we should get multiple different colors
      expect(results.size).toBeGreaterThan(1);
    });

    it("should work with solidColors palette", () => {
      const result = getRandomColor(solidColors);
      expect(solidColors).toContain(result);
    });

    it("should work with single color array", () => {
      const single = ["#123456"];
      expect(getRandomColor(single)).toBe("#123456");
    });
  });

  describe("generateMagicalGradients", () => {
    it("should generate default number of gradients (12)", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff"];
      const gradients = generateMagicalGradients(colors);
      expect(gradients).toHaveLength(12);
    });

    it("should generate custom number of gradients", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff"];
      const gradients = generateMagicalGradients(colors, 6);
      expect(gradients).toHaveLength(6);
    });

    it("should generate linear gradients for first 4", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
      const gradients = generateMagicalGradients(colors, 4);
      gradients.forEach((gradient) => {
        expect(gradient).toMatch(/^linear-gradient\(135deg/);
      });
    });

    it("should generate radial gradients for positions 4-7", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
      const gradients = generateMagicalGradients(colors, 8);
      gradients.slice(4, 8).forEach((gradient) => {
        expect(gradient).toMatch(/^radial-gradient\(circle at 50% 50%/);
      });
    });

    it("should generate multi-color gradients for positions 8+", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
      const gradients = generateMagicalGradients(colors, 12);
      gradients.slice(8).forEach((gradient) => {
        expect(gradient).toMatch(/^linear-gradient\(45deg/);
        // Should contain 3 colors
        expect(gradient.split("#").length - 1).toBe(3);
      });
    });

    it("should cycle through colors when count exceeds color array length", () => {
      const colors = ["#ff0000", "#00ff00"];
      const gradients = generateMagicalGradients(colors, 6);
      expect(gradients).toHaveLength(6);
      // Each gradient should contain colors from the array
      gradients.forEach((gradient) => {
        expect(gradient).toMatch(/#ff0000|#00ff00/);
      });
    });

    it("should include all provided colors in gradients", () => {
      const colors = ["#abc123", "#def456", "#789xyz"];
      const gradients = generateMagicalGradients(colors, 5);
      const allGradientsText = gradients.join(" ");
      colors.forEach((color) => {
        expect(allGradientsText).toContain(color);
      });
    });

    it("should generate valid CSS gradient strings", () => {
      const colors = ["#ff0000", "#00ff00", "#0000ff"];
      const gradients = generateMagicalGradients(colors);
      gradients.forEach((gradient) => {
        expect(gradient).toMatch(/gradient\(/);
        expect(gradient).toContain("%");
      });
    });

    it("should handle single color array", () => {
      const colors = ["#ff0000"];
      const gradients = generateMagicalGradients(colors, 3);
      expect(gradients).toHaveLength(3);
      // All gradients should use the same color
      gradients.forEach((gradient) => {
        const colorCount = (gradient.match(/#ff0000/g) || []).length;
        expect(colorCount).toBeGreaterThan(0);
      });
    });

    it("should handle empty count", () => {
      const colors = ["#ff0000", "#00ff00"];
      const gradients = generateMagicalGradients(colors, 0);
      expect(gradients).toHaveLength(0);
    });
  });

  describe("Integration Tests", () => {
    it("should convert RGB to hex and back to RGB correctly", () => {
      const original = [123, 45, 67];
      const hex = rgbToHex(original);
      const converted = hexToRgb(hex);
      expect(converted).toEqual(original);
    });

    it("should work with colors from palettes", () => {
      const color = solidColors[0];
      const rgb = hexToRgb(color);
      expect(rgb).not.toBeNull();
      if (rgb) {
        const hexBack = rgbToHex(rgb);
        expect(hexBack).toBe(color);
      }
    });

    it("should generate gradients using palette colors", () => {
      const gradients = generateMagicalGradients(Array.from(blueColors), 6);
      expect(gradients).toHaveLength(6);
      gradients.forEach((gradient) => {
        expect(gradient).toMatch(/gradient\(/);
      });
    });
  });
});
