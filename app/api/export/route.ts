import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    const {
      html,
      width,
      height,
      scale = 1,
      format = "png",
    } = await request.json();

    if (!html || !width || !height) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    console.log("Starting Puppeteer browser...");

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ],
    });

    try {
      const page = await browser.newPage();

      // Set viewport to match the canvas size
      const viewportWidth = Math.round(width * scale);
      const viewportHeight = Math.round(height * scale);

      await page.setViewport({
        width: viewportWidth,
        height: viewportHeight,
        deviceScaleFactor: 1,
      });

      console.log(`Setting viewport to ${viewportWidth}x${viewportHeight}`);

      // Create a minimal HTML document with the canvas content
      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                margin: 0;
                padding: 0;
                width: ${viewportWidth}px;
                height: ${viewportHeight}px;
                overflow: hidden;
              }
              #canvas-container {
                width: ${viewportWidth}px;
                height: ${viewportHeight}px;
                position: relative;
              }
            </style>
          </head>
          <body>
            <div id="canvas-container">
              ${html}
            </div>
          </body>
        </html>
      `;

      await page.setContent(fullHtml, { waitUntil: "networkidle0" });

      // Wait a bit for images to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Taking screenshot...");

      // Take screenshot
      const screenshot = await page.screenshot({
        type: format === "jpg" ? "jpeg" : "png",
        quality: format === "png" ? undefined : 90,
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: viewportWidth,
          height: viewportHeight,
        },
      });

      console.log("Screenshot taken successfully");

      const mimeType =
        format === "png"
          ? "image/png"
          : format === "jpg" || format === "jpeg"
          ? "image/jpeg"
          : "image/webp";

      return new NextResponse(Buffer.from(screenshot), {
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `attachment; filename="mokkio.${format}"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
