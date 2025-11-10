import ColorThief from "colorthief";
import { logger } from "./logger";

export interface MagicalGradient {
  id: string;
  gradient: string;
  name: string;
}

export interface AIGradientResponse {
  name: string;
  gradient: string;
}

export const extractDominantColors = async (
  imageSrc: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 8); // Get 8 dominant colors
        const colors = palette.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
};

export const generateMagicalGradients = (
  colors: string[]
): MagicalGradient[] => {
  const gradients: MagicalGradient[] = [];

  // Convert RGB colors to HSL for better color manipulation
  const hslColors: number[][] = colors.map((color) => {
    const rgb = color.match(/\d+/g);
    if (!rgb) return [0, 0, 0];
    const r = parseInt(rgb[0]) / 255;
    const g = parseInt(rgb[1]) / 255;
    const b = parseInt(rgb[2]) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  });

  // Generate unique, random gradients based on image colors
  const gradientNames = [
    "Cosmic Flow",
    "Aurora Dream",
    "Crystal Wave",
    "Neon Pulse",
    "Velvet Storm",
    "Electric Mist",
    "Golden Vortex",
    "Midnight Bloom",
    "Solar Flare",
    "Ocean Whisper",
    "Quantum Shift",
    "Lunar Dance",
    "Plasma Cloud",
    "Stellar Burst",
    "Void Echo",
  ];

  // Seed for consistent randomness based on colors
  const seed = hslColors.reduce((acc, [h, s, l]) => acc + h + s + l, 0);
  const seededRandom = (seedValue: number): number => {
    const x = Math.sin(seedValue) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < 12; i++) {
    const baseHue = hslColors[i % hslColors.length][0];
    const randomSeed = seed + i * 1000;

    // Generate random but aesthetically pleasing positions
    const positions: string[] = [];
    const numShapes = Math.floor(seededRandom(randomSeed + 1) * 3) + 2; // 2-4 shapes

    for (let j = 0; j < numShapes; j++) {
      const x = Math.floor(seededRandom(randomSeed + j * 2) * 80) + 10; // 10-90%
      const y = Math.floor(seededRandom(randomSeed + j * 2 + 1) * 80) + 10; // 10-90%
      const isCircle = seededRandom(randomSeed + j * 3) > 0.5;
      const size = Math.floor(seededRandom(randomSeed + j * 4) * 60) + 20; // 20-80%

      if (isCircle) {
        positions.push(`circle ${size}% at ${x}% ${y}%`);
      } else {
        const width = Math.floor(seededRandom(randomSeed + j * 5) * 80) + 20;
        const height = Math.floor(seededRandom(randomSeed + j * 6) * 60) + 20;
        positions.push(`ellipse ${width}% ${height}% at ${x}% ${y}%`);
      }
    }

    // Create harmonious color palette from image colors with variations
    const colorPalette: string[] = [];
    for (let j = 0; j < 6; j++) {
      const hueVariation =
        (j * 60 + Math.floor(seededRandom(randomSeed + j * 10) * 40) - 20) %
        360;
      const saturation =
        70 + Math.floor(seededRandom(randomSeed + j * 20) * 20); // 70-90%
      const lightness = 50 + Math.floor(seededRandom(randomSeed + j * 30) * 30); // 50-80%
      colorPalette.push(
        `hsl(${(baseHue + hueVariation) % 360}, ${saturation}%, ${lightness}%)`
      );
    }

    // Decide gradient type randomly
    const gradientType =
      seededRandom(randomSeed + 100) > 0.6 ? "conic" : "radial";

    let gradient: string;
    if (gradientType === "conic") {
      // Conic gradient with random start angle
      const startAngle = Math.floor(seededRandom(randomSeed + 200) * 360);
      const centerX = Math.floor(seededRandom(randomSeed + 300) * 60) + 20; // 20-80%
      const centerY = Math.floor(seededRandom(randomSeed + 400) * 60) + 20; // 20-80%
      gradient = `conic-gradient(from ${startAngle}deg at ${centerX}% ${centerY}%, ${colorPalette[0]}, ${colorPalette[1]}, ${colorPalette[2]}, ${colorPalette[3]})`;
    } else {
      // Complex radial gradient with multiple shapes
      const radialGradients = positions.map((pos, idx) => {
        const color1 = colorPalette[idx % colorPalette.length];
        const color2 = colorPalette[(idx + 1) % colorPalette.length];
        return `radial-gradient(${pos}, ${color1}, ${color2})`;
      });
      gradient = radialGradients.join(", ");
    }

    // Generate unique name based on gradient characteristics
    const nameIndex = Math.floor(
      seededRandom(randomSeed + 500) * gradientNames.length
    );
    const name = gradientNames[nameIndex];

    gradients.push({
      id: `magical-${i}`,
      gradient,
      name,
    });
  }

  return gradients;
};

export const generateMagicalGradientsWithAI = async (
  imageSrc: string
): Promise<MagicalGradient[]> => {
  try {
    // Optimize image size before sending to API to avoid 413 errors
    let optimizedImageSrc = imageSrc;

    // If it's a data URL, try to compress it
    if (imageSrc.startsWith("data:image/")) {
      try {
        // Create an image element to resize
        const img = new Image();
        img.src = imageSrc;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Resize to max 800px width/height to reduce payload size
        const maxSize = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          // Create canvas and resize
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to JPEG with 0.8 quality for smaller size
            optimizedImageSrc = canvas.toDataURL("image/jpeg", 0.8);
            logger.log(
              `Image optimized: ${imageSrc.length} -> ${optimizedImageSrc.length} bytes`
            );
          }
        }
      } catch (error) {
        logger.warn("Could not optimize image, using original:", error);
        // Continue with original image
      }
    }

    // Call the API route instead of making direct OpenRouter calls
    const response = await fetch("/api/generate-gradients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageSrc: optimizedImageSrc }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.gradients;
  } catch (error) {
    logger.error("Error generating AI magical gradients:", error);
    // Fallback to the original method if AI fails
    return generateMagicalGradients([
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#38f9d7",
    ]);
  }
};
