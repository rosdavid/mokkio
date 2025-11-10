import { describe, it, expect } from "vitest";
import {
  calculateSnap,
  distance,
  doBoxesOverlap,
  calculateOverlapArea,
  type BoundingBox,
} from "@/lib/snap-utils";

describe("snap-utils", () => {
  const canvasWidth = 1280;
  const canvasHeight = 720;

  describe("calculateSnap", () => {
    it("should not snap when snap is disabled", () => {
      const element: BoundingBox = { x: 100, y: 100, width: 200, height: 150 };
      const result = calculateSnap(
        element,
        canvasWidth,
        canvasHeight,
        [],
        false
      );

      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
      expect(result.snappedX).toBe(false);
      expect(result.snappedY).toBe(false);
      expect(result.guides).toHaveLength(0);
      expect(result.distanceIndicators).toHaveLength(0);
    });

    it("should snap to canvas left edge", () => {
      const element: BoundingBox = { x: 5, y: 100, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.x).toBe(0);
      expect(result.snappedX).toBe(true);
      expect(
        result.guides.some((g) => g.type === "vertical" && g.position === 0)
      ).toBe(true);
    });

    it("should snap to canvas right edge", () => {
      const element: BoundingBox = { x: 1075, y: 100, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.x).toBe(canvasWidth - 200);
      expect(result.snappedX).toBe(true);
      expect(
        result.guides.some(
          (g) => g.type === "vertical" && g.position === canvasWidth
        )
      ).toBe(true);
    });

    it("should snap to canvas center X", () => {
      const element: BoundingBox = { x: 535, y: 100, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.x).toBe(canvasWidth / 2 - 100);
      expect(result.snappedX).toBe(true);
      expect(
        result.guides.some(
          (g) => g.type === "vertical" && g.position === canvasWidth / 2
        )
      ).toBe(true);
    });

    it("should snap to canvas top edge", () => {
      const element: BoundingBox = { x: 100, y: 3, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.y).toBe(0);
      expect(result.snappedY).toBe(true);
      expect(
        result.guides.some((g) => g.type === "horizontal" && g.position === 0)
      ).toBe(true);
    });

    it("should snap to canvas bottom edge", () => {
      const element: BoundingBox = { x: 100, y: 565, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.y).toBe(canvasHeight - 150);
      expect(result.snappedY).toBe(true);
      expect(
        result.guides.some(
          (g) => g.type === "horizontal" && g.position === canvasHeight
        )
      ).toBe(true);
    });

    it("should snap to canvas center Y", () => {
      const element: BoundingBox = { x: 100, y: 285, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.y).toBe(canvasHeight / 2 - 75);
      expect(result.snappedY).toBe(true);
      expect(
        result.guides.some(
          (g) => g.type === "horizontal" && g.position === canvasHeight / 2
        )
      ).toBe(true);
    });

    it("should snap to other element left edge", () => {
      const element: BoundingBox = { x: 103, y: 100, width: 200, height: 150 };
      const otherElement: BoundingBox = {
        x: 100,
        y: 200,
        width: 150,
        height: 100,
      };
      const result = calculateSnap(element, canvasWidth, canvasHeight, [
        otherElement,
      ]);

      expect(result.x).toBe(100);
      expect(result.snappedX).toBe(true);
      expect(
        result.guides.some((g) => g.type === "vertical" && g.position === 100)
      ).toBe(true);
    });

    it("should snap to other element right edge", () => {
      const element: BoundingBox = { x: 103, y: 100, width: 200, height: 150 };
      const otherElement: BoundingBox = {
        x: 50,
        y: 200,
        width: 50,
        height: 100,
      };
      const result = calculateSnap(element, canvasWidth, canvasHeight, [
        otherElement,
      ]);

      expect(result.x).toBe(100);
      expect(result.snappedX).toBe(true);
      expect(
        result.guides.some((g) => g.type === "vertical" && g.position === 100)
      ).toBe(true);
    });

    it("should snap to other element center X", () => {
      const element: BoundingBox = { x: 45, y: 100, width: 200, height: 150 };
      const otherElement: BoundingBox = {
        x: 50,
        y: 200,
        width: 200,
        height: 100,
      };
      const result = calculateSnap(element, canvasWidth, canvasHeight, [
        otherElement,
      ]);

      // Other element center X = 50 + 200/2 = 150
      // Element should snap to 150 - 200/2 = 50
      // Element center X initially: 45 + 200/2 = 145
      // Distance to other center: |145 - 150| = 5 pixels (within threshold)
      expect(result.x).toBe(50);
      expect(result.snappedX).toBe(true);
      // Verify that at least one vertical guide exists (snap occurred)
      const hasVerticalGuide = result.guides.some((g) => g.type === "vertical");
      expect(hasVerticalGuide).toBe(true);
    });

    it("should snap to other element top edge", () => {
      const element: BoundingBox = { x: 100, y: 103, width: 200, height: 150 };
      const otherElement: BoundingBox = {
        x: 300,
        y: 100,
        width: 150,
        height: 100,
      };
      const result = calculateSnap(element, canvasWidth, canvasHeight, [
        otherElement,
      ]);

      expect(result.y).toBe(100);
      expect(result.snappedY).toBe(true);
      expect(
        result.guides.some((g) => g.type === "horizontal" && g.position === 100)
      ).toBe(true);
    });

    it("should snap to other element center Y", () => {
      const element: BoundingBox = { x: 100, y: 123, width: 200, height: 150 };
      const otherElement: BoundingBox = {
        x: 300,
        y: 100,
        width: 150,
        height: 200,
      };
      const result = calculateSnap(element, canvasWidth, canvasHeight, [
        otherElement,
      ]);

      // Other element center Y = 100 + 200/2 = 200
      // Element should snap to 200 - 150/2 = 125
      expect(result.y).toBe(125);
      expect(result.snappedY).toBe(true);
      expect(
        result.guides.some((g) => g.type === "horizontal" && g.position === 200)
      ).toBe(true);
    });

    it("should not snap when beyond threshold", () => {
      const element: BoundingBox = { x: 20, y: 20, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.x).toBe(20);
      expect(result.y).toBe(20);
      expect(result.snappedX).toBe(false);
      expect(result.snappedY).toBe(false);
      expect(result.guides).toHaveLength(0);
    });

    it("should generate guides with correct properties", () => {
      const element: BoundingBox = { x: 5, y: 3, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      result.guides.forEach((guide) => {
        expect(guide).toHaveProperty("id");
        expect(guide).toHaveProperty("type");
        expect(guide).toHaveProperty("position");
        expect(guide).toHaveProperty("color");
        expect(guide).toHaveProperty("isSmartGuide");
        expect(guide.isSmartGuide).toBe(true);
      });
    });

    it("should snap both X and Y simultaneously", () => {
      const element: BoundingBox = { x: 5, y: 3, width: 200, height: 150 };
      const result = calculateSnap(element, canvasWidth, canvasHeight);

      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.snappedX).toBe(true);
      expect(result.snappedY).toBe(true);
      expect(result.guides.length).toBeGreaterThan(0);
    });
  });

  describe("distance", () => {
    it("should calculate distance between two points correctly", () => {
      const result = distance(0, 0, 3, 4);
      expect(result).toBe(5); // 3-4-5 triangle
    });

    it("should return 0 for same point", () => {
      const result = distance(10, 20, 10, 20);
      expect(result).toBe(0);
    });

    it("should handle negative coordinates", () => {
      const result = distance(-3, -4, 0, 0);
      expect(result).toBe(5);
    });

    it("should calculate horizontal distance", () => {
      const result = distance(0, 5, 10, 5);
      expect(result).toBe(10);
    });

    it("should calculate vertical distance", () => {
      const result = distance(5, 0, 5, 10);
      expect(result).toBe(10);
    });

    it("should be symmetric", () => {
      const dist1 = distance(1, 2, 4, 6);
      const dist2 = distance(4, 6, 1, 2);
      expect(dist1).toBe(dist2);
    });
  });

  describe("doBoxesOverlap", () => {
    it("should detect overlapping boxes", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 50, y: 50, width: 100, height: 100 };

      expect(doBoxesOverlap(box1, box2)).toBe(true);
    });

    it("should detect non-overlapping boxes (separated horizontally)", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 150, y: 0, width: 100, height: 100 };

      expect(doBoxesOverlap(box1, box2)).toBe(false);
    });

    it("should detect non-overlapping boxes (separated vertically)", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 0, y: 150, width: 100, height: 100 };

      expect(doBoxesOverlap(box1, box2)).toBe(false);
    });

    it("should detect boxes touching at edge", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 100, y: 0, width: 100, height: 100 };

      // Touching at edge is not considered overlapping
      expect(doBoxesOverlap(box1, box2)).toBe(false);
    });

    it("should detect fully contained box", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 200, height: 200 };
      const box2: BoundingBox = { x: 50, y: 50, width: 50, height: 50 };

      expect(doBoxesOverlap(box1, box2)).toBe(true);
    });

    it("should be symmetric", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 50, y: 50, width: 100, height: 100 };

      expect(doBoxesOverlap(box1, box2)).toBe(doBoxesOverlap(box2, box1));
    });
  });

  describe("calculateOverlapArea", () => {
    it("should calculate overlap area correctly", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 50, y: 50, width: 100, height: 100 };

      // Overlap is 50x50 = 2500
      expect(calculateOverlapArea(box1, box2)).toBe(2500);
    });

    it("should return 0 for non-overlapping boxes", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 150, y: 0, width: 100, height: 100 };

      expect(calculateOverlapArea(box1, box2)).toBe(0);
    });

    it("should calculate area for fully contained box", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 200, height: 200 };
      const box2: BoundingBox = { x: 50, y: 50, width: 50, height: 50 };

      // Overlap is entire smaller box = 50x50 = 2500
      expect(calculateOverlapArea(box1, box2)).toBe(2500);
    });

    it("should handle partial overlap horizontally", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 75, y: 0, width: 100, height: 100 };

      // Overlap is 25x100 = 2500
      expect(calculateOverlapArea(box1, box2)).toBe(2500);
    });

    it("should handle partial overlap vertically", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 0, y: 75, width: 100, height: 100 };

      // Overlap is 100x25 = 2500
      expect(calculateOverlapArea(box1, box2)).toBe(2500);
    });

    it("should be symmetric", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 50, y: 50, width: 100, height: 100 };

      expect(calculateOverlapArea(box1, box2)).toBe(
        calculateOverlapArea(box2, box1)
      );
    });

    it("should return 0 for boxes touching at edge", () => {
      const box1: BoundingBox = { x: 0, y: 0, width: 100, height: 100 };
      const box2: BoundingBox = { x: 100, y: 0, width: 100, height: 100 };

      expect(calculateOverlapArea(box1, box2)).toBe(0);
    });
  });
});
