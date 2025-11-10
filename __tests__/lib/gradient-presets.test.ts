import { describe, it, expect } from "vitest";
import {
  linearGradientPresets,
  radialGradientPresets,
  allGradientPresets,
  getGradientPresetById,
  getLinearGradients,
  getRadialGradients,
  type GradientPreset,
} from "@/lib/mockup/gradient-presets";

describe("gradient-presets", () => {
  describe("linearGradientPresets", () => {
    it("should have 12 linear gradient presets", () => {
      expect(linearGradientPresets).toHaveLength(12);
    });

    it("should have correct structure for each preset", () => {
      linearGradientPresets.forEach((preset) => {
        expect(preset).toHaveProperty("id");
        expect(preset).toHaveProperty("name");
        expect(preset).toHaveProperty("gradient");
        expect(typeof preset.id).toBe("string");
        expect(typeof preset.name).toBe("string");
        expect(typeof preset.gradient).toBe("string");
      });
    });

    it("should have all linear-gradient CSS strings", () => {
      linearGradientPresets.forEach((preset) => {
        expect(preset.gradient).toMatch(/^linear-gradient\(/);
      });
    });

    it("should have known presets with correct IDs", () => {
      const ids = linearGradientPresets.map((p) => p.id);
      expect(ids).toContain("purple-pink");
      expect(ids).toContain("blue-purple");
      expect(ids).toContain("cosmic-flow");
      expect(ids).toContain("neon-glow");
    });

    it("should have purple-pink preset with correct gradient", () => {
      const preset = linearGradientPresets.find((p) => p.id === "purple-pink");
      expect(preset).toBeDefined();
      expect(preset?.name).toBe("Purple Pink");
      expect(preset?.gradient).toContain("#667eea");
      expect(preset?.gradient).toContain("#764ba2");
    });

    it("should have cosmic-flow with multiple colors", () => {
      const preset = linearGradientPresets.find((p) => p.id === "cosmic-flow");
      expect(preset).toBeDefined();
      expect(preset?.name).toBe("Cosmic Flow");
      // Should have at least 4 color stops
      const colorMatches = preset?.gradient.match(/#[a-fA-F0-9]{6}/g);
      expect(colorMatches?.length).toBeGreaterThanOrEqual(4);
    });

    it("should have unique IDs", () => {
      const ids = linearGradientPresets.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have descriptive names", () => {
      linearGradientPresets.forEach((preset) => {
        expect(preset.name.length).toBeGreaterThan(0);
        expect(preset.name).not.toBe(preset.id);
      });
    });
  });

  describe("radialGradientPresets", () => {
    it("should have 12 radial gradient presets", () => {
      expect(radialGradientPresets).toHaveLength(12);
    });

    it("should have correct structure for each preset", () => {
      radialGradientPresets.forEach((preset) => {
        expect(preset).toHaveProperty("id");
        expect(preset).toHaveProperty("name");
        expect(preset).toHaveProperty("gradient");
      });
    });

    it("should have all radial-gradient CSS strings", () => {
      radialGradientPresets.forEach((preset) => {
        expect(preset.gradient).toMatch(/^radial-gradient\(/);
      });
    });

    it("should have known presets with correct IDs", () => {
      const ids = radialGradientPresets.map((p) => p.id);
      expect(ids).toContain("cosmic-dream");
      expect(ids).toContain("sunset-blaze");
      expect(ids).toContain("cyber-punk");
    });

    it("should have cosmic-dream preset with circle positioning", () => {
      const preset = radialGradientPresets.find((p) => p.id === "cosmic-dream");
      expect(preset).toBeDefined();
      expect(preset?.gradient).toContain("circle at");
    });

    it("should have unique IDs", () => {
      const ids = radialGradientPresets.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have different circle positions", () => {
      const positions = radialGradientPresets.map((p) => {
        const match = p.gradient.match(/circle at (\d+%\s+\d+%)/);
        return match ? match[1] : null;
      });
      const uniquePositions = new Set(positions.filter(Boolean));
      // Should have variety in circle positions
      expect(uniquePositions.size).toBeGreaterThan(1);
    });
  });

  describe("allGradientPresets", () => {
    it("should combine linear and radial presets", () => {
      expect(allGradientPresets).toHaveLength(24);
      expect(allGradientPresets).toEqual([
        ...linearGradientPresets,
        ...radialGradientPresets,
      ]);
    });

    it("should maintain all unique IDs", () => {
      const ids = allGradientPresets.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(24);
    });

    it("should have both linear and radial gradients", () => {
      const hasLinear = allGradientPresets.some((p) =>
        p.gradient.startsWith("linear-gradient")
      );
      const hasRadial = allGradientPresets.some((p) =>
        p.gradient.startsWith("radial-gradient")
      );
      expect(hasLinear).toBe(true);
      expect(hasRadial).toBe(true);
    });
  });

  describe("getGradientPresetById", () => {
    it("should find preset by ID from linear gradients", () => {
      const preset = getGradientPresetById("purple-pink");
      expect(preset).toBeDefined();
      expect(preset?.id).toBe("purple-pink");
      expect(preset?.name).toBe("Purple Pink");
    });

    it("should find preset by ID from radial gradients", () => {
      const preset = getGradientPresetById("cosmic-dream");
      expect(preset).toBeDefined();
      expect(preset?.id).toBe("cosmic-dream");
      expect(preset?.name).toBe("Cosmic Dream");
    });

    it("should return undefined for non-existent ID", () => {
      const preset = getGradientPresetById("non-existent-preset");
      expect(preset).toBeUndefined();
    });

    it("should return undefined for empty string", () => {
      const preset = getGradientPresetById("");
      expect(preset).toBeUndefined();
    });

    it("should be case-sensitive", () => {
      const preset = getGradientPresetById("PURPLE-PINK");
      expect(preset).toBeUndefined();
    });

    it("should find all linear presets by ID", () => {
      linearGradientPresets.forEach((expected) => {
        const found = getGradientPresetById(expected.id);
        expect(found).toEqual(expected);
      });
    });

    it("should find all radial presets by ID", () => {
      radialGradientPresets.forEach((expected) => {
        const found = getGradientPresetById(expected.id);
        expect(found).toEqual(expected);
      });
    });
  });

  describe("getLinearGradients", () => {
    it("should return all linear gradients", () => {
      const gradients = getLinearGradients();
      expect(gradients).toEqual(linearGradientPresets);
      expect(gradients).toHaveLength(12);
    });

    it("should return readonly array", () => {
      const gradients = getLinearGradients();
      expect(Array.isArray(gradients)).toBe(true);
    });

    it("should return all linear-gradient types", () => {
      const gradients = getLinearGradients();
      gradients.forEach((gradient) => {
        expect(gradient.gradient).toMatch(/^linear-gradient/);
      });
    });
  });

  describe("getRadialGradients", () => {
    it("should return all radial gradients", () => {
      const gradients = getRadialGradients();
      expect(gradients).toEqual(radialGradientPresets);
      expect(gradients).toHaveLength(12);
    });

    it("should return readonly array", () => {
      const gradients = getRadialGradients();
      expect(Array.isArray(gradients)).toBe(true);
    });

    it("should return all radial-gradient types", () => {
      const gradients = getRadialGradients();
      gradients.forEach((gradient) => {
        expect(gradient.gradient).toMatch(/^radial-gradient/);
      });
    });
  });

  describe("Type Safety", () => {
    it("should have proper GradientPreset type", () => {
      const preset: GradientPreset = {
        id: "test-id",
        name: "Test Name",
        gradient: "linear-gradient(90deg, #fff 0%, #000 100%)",
      };
      expect(preset.id).toBe("test-id");
      expect(preset.name).toBe("Test Name");
      expect(preset.gradient).toContain("linear-gradient");
    });
  });

  describe("Gradient Quality", () => {
    it("should have valid hex colors in all gradients", () => {
      allGradientPresets.forEach((preset) => {
        const hexColors = preset.gradient.match(/#[a-fA-F0-9]{6}/g);
        expect(hexColors).toBeTruthy();
        expect(hexColors!.length).toBeGreaterThan(0);
      });
    });

    it("should have percentage values in all gradients", () => {
      allGradientPresets.forEach((preset) => {
        expect(preset.gradient).toMatch(/\d+%/);
      });
    });

    it("should have properly formatted gradients", () => {
      allGradientPresets.forEach((preset) => {
        expect(preset.gradient).toMatch(/gradient\([^)]+\)/);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle searching for null/undefined safely", () => {
      // @ts-expect-error - Testing runtime behavior
      expect(getGradientPresetById(null)).toBeUndefined();
      // @ts-expect-error - Testing runtime behavior
      expect(getGradientPresetById(undefined)).toBeUndefined();
    });

    it("should not mutate original arrays", () => {
      const originalLinearCount = linearGradientPresets.length;
      const originalRadialCount = radialGradientPresets.length;

      getLinearGradients();
      getRadialGradients();
      getGradientPresetById("purple-pink");

      expect(linearGradientPresets).toHaveLength(originalLinearCount);
      expect(radialGradientPresets).toHaveLength(originalRadialCount);
    });
  });

  describe("Real-world Usage", () => {
    it("should support iteration over all presets", () => {
      let count = 0;
      for (const preset of allGradientPresets) {
        expect(preset.id).toBeTruthy();
        count++;
      }
      expect(count).toBe(24);
    });

    it("should support filtering by gradient type", () => {
      const linear = allGradientPresets.filter((p) =>
        p.gradient.startsWith("linear-gradient")
      );
      const radial = allGradientPresets.filter((p) =>
        p.gradient.startsWith("radial-gradient")
      );
      expect(linear).toHaveLength(12);
      expect(radial).toHaveLength(12);
    });

    it("should support mapping to UI components", () => {
      const uiData = allGradientPresets.map((preset) => ({
        key: preset.id,
        label: preset.name,
        style: { background: preset.gradient },
      }));
      expect(uiData).toHaveLength(24);
      uiData.forEach((item) => {
        expect(item.key).toBeTruthy();
        expect(item.label).toBeTruthy();
        expect(item.style.background).toMatch(/gradient/);
      });
    });
  });
});
