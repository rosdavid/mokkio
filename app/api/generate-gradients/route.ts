import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

interface AIGradientResponse {
  name: string;
  gradient: string;
}

export async function POST(request: NextRequest) {
  try {
    logger.log("API Route called: generate-gradients");

    const { imageSrc } = await request.json();
    logger.log("Image source received:", imageSrc ? "present" : "missing");

    if (!imageSrc) {
      return NextResponse.json(
        { error: "Image source is required" },
        { status: 400 }
      );
    }

    // Check if API key is available
    const apiKey = process.env.OPENROUTER_API_KEY;
    logger.log("API Key available:", apiKey ? "yes" : "no");

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    // Convert image to base64 for potential future vision model support
    // Note: Current free models don't reliably support vision, so we use text-based generation
    logger.log("Preparing for gradient generation...");
    let imageBase64: string | null = null;
    const imageMetadata = {
      hasImage: !!imageSrc,
      type: "unknown" as string,
    };

    if (imageSrc) {
      try {
        // Extract image type and metadata for context
        if (imageSrc.startsWith("data:image/")) {
          const match = imageSrc.match(/data:image\/(\w+);/);
          imageMetadata.type = match ? match[1] : "unknown";
          imageBase64 = imageSrc.split(",")[1];
          logger.log(
            `Data URL detected, type: ${imageMetadata.type}, size: ${imageBase64?.length || 0} bytes`
          );
        } else {
          // It's a URL - extract hints from filename/path
          const url = new URL(imageSrc);
          const pathLower = url.pathname.toLowerCase();
          if (pathLower.includes(".png")) imageMetadata.type = "png";
          else if (pathLower.includes(".jpg") || pathLower.includes(".jpeg"))
            imageMetadata.type = "jpeg";
          else if (pathLower.includes(".webp")) imageMetadata.type = "webp";

          logger.log(`Image URL provided: ${imageSrc.substring(0, 100)}...`);
        }
      } catch (error) {
        logger.warn("Could not process image metadata:", error);
      }
    }

    const prompt = `You are an expert CSS gradient designer creating backgrounds for mockup presentations.

**YOUR TASK:**
Create 12 stunning, professional-grade CSS gradients perfect for modern mockup backgrounds.
The user has uploaded an image${imageMetadata.hasImage ? ` (${imageMetadata.type} format)` : ""} for their mockup.

**GRADIENT REQUIREMENTS:**
- Generate EXACTLY 12 unique, visually striking gradients
- Use modern, trending color palettes suitable for 2025 design aesthetics
- Each must be valid CSS (linear-gradient, radial-gradient, or conic-gradient)
- Mix of styles: 4 linear, 4 radial, 4 conic gradients
- Variety in complexity: simple 2-color and rich multi-stop gradients
- Professional quality suitable for product presentations, app mockups, web design

**COLOR PALETTE THEMES** (use diverse modern combinations):
1. **Tech/Modern**: Deep blues, purples, cyans (#667eea, #764ba2, #4facfe, #00f2fe)
2. **Warm/Energetic**: Oranges, reds, yellows (#ff6b6b, #ffa500, #f97316, #dc2626)
3. **Cool/Professional**: Blues, teals, greens (#0ea5e9, #22c55e, #14b8a6)
4. **Vibrant/Bold**: Magentas, pinks, purples (#ff0080, #f093fb, #f5576c, #7928ca)
5. **Natural/Organic**: Greens, earth tones (#15803d, #84cc16, #a8edea, #fed6e3)
6. **Dark/Elegant**: Deep colors with rich contrast (#1e293b, #7c3aed, #c026d3)

**DESIGN PRINCIPLES:**
- Gradients should not overpower the mockup content
- Balance between subtle and eye-catching
- Contemporary, Instagram/Dribbble-worthy aesthetics
- Smooth color transitions, avoid harsh stops
- Consider different use cases: light apps, dark apps, colorful products

**NAMING CONVENTION:**
- Creative, memorable names that evoke the gradient's character
- Examples: "Cosmic Horizon", "Digital Sunset", "Ocean Depth", "Neon Dreams", "Velvet Night"
- Avoid generic names like "Gradient 1" or "Blue Purple"
- Names should inspire and match the visual aesthetic

**GRADIENT VARIETY:**
- 4 linear gradients (varied angles: 135deg, 90deg, 180deg, 45deg)
- 4 radial gradients (different positions and shapes)
- 4 conic gradients (varied starting angles)

**OUTPUT FORMAT:**
Respond with ONLY a valid JSON array. No markdown, no code blocks, no explanations.

EXAMPLE FORMAT:
[{"name": "Cosmic Horizon", "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"},
{"name": "Ocean Depth", "gradient": "radial-gradient(circle at 30% 40%, #0ea5e9 0%, #1e3a8a 100%)"},
{"name": "Neon Pulse", "gradient": "conic-gradient(from 45deg, #ff0080, #7928ca, #4facfe)"}]

**CRITICAL:**
- JSON must be parseable (no trailing commas, valid syntax)
- Each gradient must be valid CSS
- EXACTLY 12 gradients
- NO markdown code blocks or backticks
- Names should be unique and creative`;

    logger.log("Generating gradients with professional AI models...");

    // Use reliable text-based models (vision models in free tier are unstable)
    const models = [
      "openrouter/polaris-alpha", // Primary: Excellent for creative tasks
      "meta-llama/llama-4-maverick:free", // Backup: Good free alternative
    ];
    let lastError: Error | null = null;
    let completion: {
      choices: Array<{ message: { content: string } }>;
    } | null = null;
    let successfulModel: string | null = null;

    for (const model of models) {
      try {
        logger.log(`Trying model: ${model}`);

        // Use text-only prompts (vision not reliable in free tier)
        const messages = [
          {
            role: "user",
            content: prompt,
          },
        ];

        logger.log(`Requesting gradients from ${model}...`);

        // Make direct API call to OpenRouter
        const apiResponse = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://mokkio.vercel.app",
              "X-Title": "Mokkio Mockup Generator",
            },
            body: JSON.stringify({
              model,
              messages,
              max_tokens: 2000,
              temperature: 0.7,
            }),
          }
        );

        logger.log(`${model} response status:`, apiResponse.status);

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text();
          logger.error(`${model} error response:`, errorText);
          logger.error(
            "Response headers:",
            Object.fromEntries(apiResponse.headers.entries())
          );

          // Try to parse error as JSON
          try {
            const errorJson = JSON.parse(errorText);
            logger.error("Parsed error:", errorJson);
          } catch {
            logger.error("Could not parse error as JSON");
          }

          lastError = new Error(
            `OpenRouter API error for ${model}: ${apiResponse.status} ${apiResponse.statusText} - ${errorText}`
          );
          continue; // Try next model
        }

        completion = await apiResponse.json();
        successfulModel = model;
        logger.log(`Successfully got response from ${model}`);
        break; // Success, exit loop
      } catch (error) {
        logger.error(`Error with model ${model}:`, error);
        lastError = error as Error;
        continue; // Try next model
      }
    }

    // If all models failed, throw the last error
    if (!completion) {
      throw lastError || new Error("All models failed");
    }
    logger.log("OpenRouter response received");
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      logger.error("No content in OpenRouter response");
      throw new Error("No response from OpenRouter");
    }

    logger.log("Parsing JSON response...");
    logger.log("Raw content:", content.substring(0, 200) + "...");

    // Parse the JSON response - handle markdown formatting and malformed JSON
    let jsonContent = content.trim();

    // Check if response is wrapped in markdown code blocks
    if (jsonContent.startsWith("```json")) {
      const startIndex = jsonContent.indexOf("\n") + 1;
      const endIndex = jsonContent.lastIndexOf("```");
      jsonContent = jsonContent.substring(startIndex, endIndex).trim();
    } else if (jsonContent.startsWith("```")) {
      // Handle other markdown formats
      const startIndex = jsonContent.indexOf("\n") + 1;
      const endIndex = jsonContent.lastIndexOf("```");
      jsonContent = jsonContent.substring(startIndex, endIndex).trim();
    }

    let gradients;
    try {
      gradients = JSON.parse(jsonContent);
    } catch (parseError) {
      logger.error("JSON parse error:", parseError);
      logger.error("Attempted to parse:", jsonContent.substring(0, 500));

      // Try to fix common JSON issues
      // Remove trailing commas
      const fixedJson = jsonContent.replace(/,(\s*[}\]])/g, "$1");
      try {
        gradients = JSON.parse(fixedJson);
        logger.log("Successfully parsed after fixing trailing commas");
      } catch {
        throw new Error("Could not parse AI response as valid JSON");
      }
    }

    // Validate and format the response
    if (!Array.isArray(gradients)) {
      logger.error("Invalid response format:", gradients);
      throw new Error("Invalid response format");
    }

    logger.log("Successfully generated", gradients.length, "gradients");
    const formattedGradients = gradients
      .slice(0, 12)
      .map((grad: AIGradientResponse, index: number) => ({
        id: `ai-magical-${index}`,
        gradient: grad.gradient,
        name: grad.name || `Magical Gradient ${index + 1}`,
      }));

    return NextResponse.json({
      gradients: formattedGradients,
      model: successfulModel, // Include which model was used
    });
  } catch (error) {
    logger.error("Error generating AI magical gradients:", error);

    // Return fallback gradients instead of error
    const fallbackGradients = [
      {
        id: "fallback-1",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        name: "Purple Dream",
      },
      {
        id: "fallback-2",
        gradient:
          "radial-gradient(circle at 30% 40%, #f093fb 0%, #f5576c 100%)",
        name: "Pink Nebula",
      },
      {
        id: "fallback-3",
        gradient:
          "conic-gradient(from 45deg, #4facfe, #00f2fe, #43e97b, #38f9d7)",
        name: "Ocean Breeze",
      },
      {
        id: "fallback-4",
        gradient: "linear-gradient(to right, #ff6b6b, #ffa500, #ffff00)",
        name: "Sunset Glow",
      },
      {
        id: "fallback-5",
        gradient:
          "radial-gradient(ellipse at 50% 50%, #667eea, #764ba2, #f093fb)",
        name: "Cosmic Void",
      },
      {
        id: "fallback-6",
        gradient: "linear-gradient(45deg, #ff0080, #7928ca, #4facfe)",
        name: "Neon Pulse",
      },
      {
        id: "fallback-7",
        gradient:
          "conic-gradient(from 90deg at 40% 50%, #a8edea, #fed6e3, #d299c2, #fef9d7)",
        name: "Pastel Aurora",
      },
      {
        id: "fallback-8",
        gradient:
          "linear-gradient(to bottom right, #4facfe 0%, #00f2fe 50%, #43e97b 100%)",
        name: "Azure Sky",
      },
      {
        id: "fallback-9",
        gradient:
          "radial-gradient(circle at 70% 30%, #ff6b6b, #ee5a6f, #c44569)",
        name: "Ruby Fire",
      },
      {
        id: "fallback-10",
        gradient: "linear-gradient(120deg, #667eea, #764ba2, #f5576c)",
        name: "Twilight Blend",
      },
      {
        id: "fallback-11",
        gradient: "conic-gradient(from 180deg, #43e97b, #38f9d7, #667eea)",
        name: "Emerald Wave",
      },
      {
        id: "fallback-12",
        gradient:
          "radial-gradient(ellipse at 20% 80%, #ffa500, #ff6b6b, #ee5a6f)",
        name: "Golden Ember",
      },
    ];

    logger.log("Returning fallback gradients due to API error");
    return NextResponse.json({
      gradients: fallbackGradients,
      warning:
        "Using fallback gradients. API error: " +
        (error instanceof Error ? error.message : "Unknown error"),
    });
  }
}
