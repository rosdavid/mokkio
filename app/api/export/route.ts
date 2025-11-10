import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { logger } from "@/lib/logger";
import { exportLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (export is resource-intensive, so stricter limit)
    const clientIp = getClientIp(request);
    const rateLimitResult = await exportLimiter.check(clientIp);

    if (!rateLimitResult.success) {
      logger.warn(`Export rate limit exceeded for IP: ${clientIp}`);
      return NextResponse.json(
        {
          error: "Too many export requests. Please wait before trying again.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "3",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        }
      );
    }

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

    logger.info("Starting Puppeteer browser...");

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

      logger.log(`Setting viewport to ${viewportWidth}x${viewportHeight}`);

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

      logger.log("Taking screenshot...");

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

      logger.log("Screenshot taken successfully");

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
    logger.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
