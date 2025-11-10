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

    logger.log("Converting image to base64...");
    // Convert image to base64 (not used with DeepSeek, but kept for compatibility)
    const response = await fetch(imageSrc);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = `data:${
      response.headers.get("content-type") || "image/png"
    };base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    logger.log("Image converted to base64, length:", base64Image.length);

    const prompt = `You are a CSS gradient design expert. Create 12 stunning, professional-grade CSS gradients that would complement mockup backgrounds.

**REQUIREMENTS:**
- Generate EXACTLY 12 unique gradients
- Each gradient must be a valid CSS gradient (linear-gradient, radial-gradient, or conic-gradient)
- Use modern, trending color combinations suitable for design mockups
- Create visually striking, contemporary gradients
- Include a mix of gradient types: linear, radial, and conic gradients
- Vary the complexity: some simple 2-color, some complex multi-stop gradients

**GRADIENT QUALITY CRITERIA:**
- **Modern**: Use contemporary gradient techniques and trending color palettes
- **Impact**: Create gradients that are visually bold, dynamic, and attention-grabbing
- **Versatility**: Suitable for modern design contexts (apps, websites, presentations, social media)
- **CSS Compatibility**: Must work in all modern browsers (Chrome, Firefox, Safari, Edge)

**COLOR PALETTE TRENDS:**
Use these modern color combinations:
- Purple to pink gradients (#667eea, #764ba2, #f093fb, #f5576c)
- Blue to cyan gradients (#4facfe, #00f2fe, #43e97b, #38f9d7)
- Warm sunset gradients (#ff6b6b, #ffa500, #ffff00, #90ee90)
- Cool ocean gradients (#667eea, #764ba2, #f093fb)
- Neon cyberpunk gradients (#ff0080, #7928ca, #4facfe)
- Earthy natural gradients (#a8edea, #fed6e3, #d299c2, #fef9d7)

**NAMING CONVENTION:**
- Use creative, evocative names that suggest the gradient's character
- Themes: cosmic, ethereal, vibrant, mystical, geometric, fluid, energetic
- Examples: "Cosmic Nebula", "Aurora Borealis", "Crystal Prism", "Neon Pulse"

**GRADIENT VARIETY:**
- 4 linear gradients (different angles and directions)
- 4 radial gradients (circles, ellipses, complex shapes)
- 4 conic gradients (different start angles and positions)

**OUTPUT FORMAT:**
Respond with ONLY a valid JSON array. No explanations, no markdown, no code blocks, no additional text.

[{"name": "Cosmic Nebula", "gradient": "radial-gradient(circle at 30% 40%, #667eea 0%, #764ba2 50%, #f093fb 100%)"},
{"name": "Aurora Borealis", "gradient": "conic-gradient(from 45deg at 50% 50%, #ff0080, #7928ca, #4facfe, #00f2fe)"},
{"name": "Crystal Prism", "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"}]

**IMPORTANT:**
- JSON must be parseable without any modifications
- Each gradient must be syntactically correct CSS
- Names should be unique and creative
- Focus on gradients that would make stunning mockup backgrounds
- DO NOT wrap the JSON in markdown code blocks or backticks`;

    logger.log("Making API call to OpenRouter...");
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
          model: "deepseek/deepseek-chat-v3.1:free",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      }
    );

    logger.log("OpenRouter response status:", apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      logger.error("OpenRouter error response:", errorText);
      throw new Error(
        `OpenRouter API error: ${apiResponse.status} ${apiResponse.statusText}`
      );
    }

    const completion = await apiResponse.json();
    logger.log("OpenRouter response received");
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      logger.error("No content in OpenRouter response");
      throw new Error("No response from OpenRouter");
    }

    logger.log("Parsing JSON response...");
    // Parse the JSON response - handle markdown formatting from DeepSeek
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

    const gradients = JSON.parse(jsonContent);

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

    return NextResponse.json({ gradients: formattedGradients });
  } catch (error) {
    logger.error("Error generating AI magical gradients:", error);
    return NextResponse.json(
      {
        error: "Failed to generate gradients",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
