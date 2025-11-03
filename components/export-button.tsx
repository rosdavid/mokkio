// export-buttonn.tsx
"use client";

import {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
} from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Download, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useExport } from "@/lib/export-context";
import * as htmlToImage from "html-to-image";

type ExportFormat = "png" | "jpg" | "webp";

export const ExportButton = forwardRef<
  { openMenu: () => void },
  { isMobile?: boolean }
>(({ isMobile = false }, ref) => {
  const [isExporting, setIsExporting] = useState(false);
  const [open, setOpen] = useState(false);
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const { setIsExporting: setGlobalIsExporting } = useExport();

  useImperativeHandle(
    ref,
    () => ({
      openMenu: () => {
        if (isMobile) {
          setShowMobileDialog(true);
        } else {
          setOpen(true);
        }
      },
    }),
    [isMobile]
  );

  /* ---------------------- iOS / WebKit helpers ---------------------- */

  // iOS / iPadOS on WebKit detection (also covers iPadOS reporting as Mac with touch)
  const isIOSWebKit = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    const isTouchMac = navigator.maxTouchPoints > 2 && /Macintosh/.test(ua);
    const isIOSFamily = /iPad|iPhone|iPod/.test(ua) || isTouchMac;
    const isWebKit = /WebKit/i.test(ua) && !/Edge|OPR|Chromium/i.test(ua);
    return isIOSFamily && isWebKit;
  };

  // Clamp scale to avoid Safari canvas memory limits (~16–20MP is a safe target)
  const clampScaleForIOS = (
    baseW: number,
    baseH: number,
    desiredScale: number
  ) => {
    const MAX_PIXELS = 16_000_000; // conservative threshold
    const maxScale = Math.sqrt(MAX_PIXELS / (baseW * baseH));
    return Math.max(
      0.5,
      Math.min(desiredScale, isFinite(maxScale) ? maxScale : desiredScale)
    );
  };

  /* ---------------------- Size estimation helpers ---------------------- */

  // Human-readable byte formatter
  const prettyBytes = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let n = bytes;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(n >= 100 || i === 0 ? 0 : n >= 10 ? 1 : 2)} ${
      units[i]
    }`;
  };

  // Read base canvas width/height in CSS pixels (unaffected by transforms)
  const getCanvasBaseSize = useCallback(() => {
    const el = document.getElementById("mockup-canvas") as HTMLElement | null;
    if (!el) return null;
    const w =
      parseFloat(el.style.width) ||
      el.clientWidth ||
      el.getBoundingClientRect().width;
    const h =
      parseFloat(el.style.height) ||
      el.clientHeight ||
      el.getBoundingClientRect().height;
    if (!w || !h) return null;
    return { w: Math.round(w), h: Math.round(h), el };
  }, []);

  // Very lightweight “entropy” check based on DOM + styles
  type Entropy = "transparent" | "flat" | "medium" | "medium-high" | "high";
  const detectEntropy = useCallback((root: HTMLElement): Entropy => {
    try {
      const style = getComputedStyle(root);
      const bg = style.getPropertyValue("background");
      const bgColor = style.getPropertyValue("background-color");

      const hasTransparentBg =
        bg.includes("transparent") || bgColor.includes("rgba(0, 0, 0, 0)");

      const hasGradient = /gradient\(/i.test(bg);
      const hasImg = !!root.querySelector("img");

      // Noise overlay heuristic
      const hasNoiseOverlay = Array.from(
        root.querySelectorAll<HTMLElement>("*")
      ).some((n) => {
        const s = getComputedStyle(n);
        const bi = s.getPropertyValue("background-image");
        const blend = s.getPropertyValue("mix-blend-mode");
        return bi.includes("data:image/png") && blend === "overlay";
      });

      if (hasTransparentBg && !hasImg) return "transparent";
      if (hasImg && hasNoiseOverlay) return "high";
      if (hasImg) return "medium-high";
      if (hasGradient) return "medium";
      return "flat";
    } catch {
      return "medium";
    }
  }, []);

  // Bytes-per-pixel heuristics
  const BPP_TABLE = useMemo(
    () => ({
      png: {
        transparent: 0.1,
        flat: 0.22,
        medium: 0.33,
        "medium-high": 0.75,
        high: 0.95,
      },
      jpg: {
        transparent: 0.08,
        flat: 0.12,
        medium: 0.2,
        "medium-high": 0.5,
        high: 0.62,
      },
      webp: {
        transparent: 0.06,
        flat: 0.1,
        medium: 0.17,
        "medium-high": 0.36,
        high: 0.42,
      },
    }),
    []
  );

  const OVERHEAD = useMemo(
    () => ({
      png: 20_000,
      jpg: 8_000,
      webp: 12_000,
    }),
    []
  );

  const estimateBytes = useCallback(
    (format: ExportFormat, scale: number) => {
      const base = getCanvasBaseSize();
      if (!base) return null;
      const { w, h, el } = base;
      const pixels = w * h * (scale * scale);
      const entropy = detectEntropy(el);
      const bpp = BPP_TABLE[format][entropy];
      return Math.max(OVERHEAD[format] + pixels * bpp, OVERHEAD[format]);
    },
    [getCanvasBaseSize, detectEntropy, BPP_TABLE, OVERHEAD]
  );

  /* ---------------------- DOM sanitizers for export ---------------------- */

  // Inline/normalize computed styles that html-to-image cares about
  const sanitizeNode = (node: Element) => {
    const computed = window.getComputedStyle(node as Element);

    const propsToInline = [
      "background",
      "background-color",
      "color",
      "border-color",
      "border-radius",
      "box-shadow",
      "filter",
      "outline-color",
      "text-shadow",
      "mix-blend-mode",
      "background-image",
      "opacity",
    ] as const;

    propsToInline.forEach((prop) => {
      try {
        const value = computed.getPropertyValue(prop);
        if (value && value !== "none" && value !== "normal") {
          if (
            prop === "color" ||
            prop === "border-color" ||
            prop === "outline-color"
          ) {
            const sanitized = value
              .replace(/oklch\([^)]*\)/gi, "#666666")
              .replace(/color\([^)]*\)/gi, "#666666")
              .replace(/lab\([^)]*\)/gi, "#666666")
              .replace(/lch\([^)]*\)/gi, "#666666")
              .replace(/color-mix\([^)]*\)/gi, "#666666");
            (node as HTMLElement).style.setProperty(prop, sanitized);
          } else if (
            prop === "filter" ||
            prop === "mix-blend-mode" ||
            prop === "background-image" ||
            prop === "opacity" ||
            prop === "border-radius"
          ) {
            (node as HTMLElement).style.setProperty(prop, value);
          } else {
            const sanitized = value
              .replace(/oklch\([^)]*\)/gi, "rgba(0,0,0,0)")
              .replace(/color\([^)]*\)/gi, "rgba(0,0,0,0)")
              .replace(/lab\([^)]*\)/gi, "rgba(0,0,0,0)")
              .replace(/lch\([^)]*\)/gi, "rgba(0,0,0,0)")
              .replace(/color-mix\([^)]*\)/gi, "rgba(0,0,0,0)")
              .replace(/linear-gradient\([^)]*\)/gi, (m) => m)
              .replace(/radial-gradient\([^)]*\)/gi, (m) => m)
              .replace(/conic-gradient\([^)]*\)/gi, (m) => m);
            (node as HTMLElement).style.setProperty(prop, sanitized);
          }
        }
      } catch {
        /* ignore */
      }
    });

    node.childNodes.forEach((child) => {
      if (child.nodeType === 1) sanitizeNode(child as Element);
    });
  };

  // Extra: make relative bg URLs absolute to avoid oddities on iOS
  const absolutizeBackgroundUrls = (root: HTMLElement) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const base = window.location.origin;
    while (walker.nextNode()) {
      const el = walker.currentNode as HTMLElement;
      const cs = getComputedStyle(el);
      const bi = cs.backgroundImage || "";
      const m = bi.match(/url\(["']?(.*?)["']?\)/i);
      if (m && m[1]) {
        const url = m[1];
        if (url.startsWith("/")) {
          const abs = new URL(url, base).href;
          el.style.backgroundImage = `url("${abs}")`;
        }
      }
    }
  };

  // iOS-only: neutralize CSS that tends to break foreignObject
  const stripProblematicCssForIOS = (root: HTMLElement) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode as HTMLElement;
      const cs = getComputedStyle(el);

      // Noise overlay => kill blend mode (we also support hard-removal by data attribute)
      if (el.hasAttribute("data-noise-overlay")) {
        // Easiest path: remove it completely for export on iOS
        el.remove();
        continue;
      }

      const bgImg = cs.getPropertyValue("background-image") || "";
      const blend = cs.getPropertyValue("mix-blend-mode") || "";
      if (bgImg.includes("data:image") && blend === "overlay") {
        el.style.setProperty("mix-blend-mode", "normal", "important");
        el.style.setProperty("opacity", "0.35", "important");
      }

      // Filters / backdrop-filter → neutralize
      const filter = cs.getPropertyValue("filter");
      if (filter && filter !== "none") {
        el.style.setProperty("filter", "none", "important");
      }
      const backdrop =
        (cs as CSSStyleDeclaration).getPropertyValue?.(
          "-webkit-backdrop-filter"
        ) || cs.getPropertyValue("backdrop-filter");
      if (backdrop && backdrop !== "none") {
        el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        el.style.setProperty("backdrop-filter", "none", "important");
      }

      // Masks / clip-path → neutralize
      const mask =
        cs.getPropertyValue("mask") ||
        (cs as CSSStyleDeclaration).getPropertyValue?.("-webkit-mask");
      if (mask && mask !== "none") {
        el.style.setProperty("mask", "none", "important");
        el.style.setProperty("-webkit-mask", "none", "important");
      }
      const clipPath = cs.getPropertyValue("clip-path");
      if (clipPath && clipPath !== "none") {
        el.style.setProperty("clip-path", "none", "important");
      }
    }
  };

  /* ---------------------- Export (real) ---------------------- */

  const toBlobByFormat = async (
    node: HTMLElement,
    format: ExportFormat,
    scale: number,
    backgroundColor?: string
  ): Promise<Blob | null> => {
    try {
      const canvas = await htmlToImage.toCanvas(node, {
        width: node.offsetWidth * scale,
        height: node.offsetHeight * scale,
        style: {
          transform: "scale(" + scale + ")",
          transformOrigin: "top left",
        },
        canvasWidth: node.offsetWidth * scale,
        canvasHeight: node.offsetHeight * scale,
        backgroundColor: backgroundColor || "transparent",
        pixelRatio: 1,
      });

      const QUALITY = 0.92;
      const mime =
        format === "png"
          ? "image/png"
          : format === "jpg"
          ? "image/jpeg"
          : "image/webp";

      return await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b),
          mime,
          format === "png" ? undefined : QUALITY
        );
      });
    } catch (error) {
      console.error("Error in toBlobByFormat:", error);
      return null;
    }
  };

  const handleExport = async (format: ExportFormat, scale = 4) => {
    const canvas = document.getElementById("mockup-canvas");
    if (!canvas) {
      toast.error("Canvas not found. Please try again.");
      return;
    }

    setIsExporting(true);
    setGlobalIsExporting(true);
    await Promise.resolve(); // allow UI to render spinner

    try {
      // Clone target node
      const clone = canvas.cloneNode(true) as HTMLElement;

      // Get original background (to decide forced bg)
      const originalComputed = window.getComputedStyle(canvas as Element);
      const originalBackground =
        originalComputed.getPropertyValue("background");

      // Strip transforms on clone
      clone.style.transform = "none";
      clone.style.transformOrigin = "initial";

      // Offscreen container to host the clone
      const offscreen = document.createElement("div");
      offscreen.style.position = "fixed";
      offscreen.style.left = "-9999px";
      offscreen.style.top = "-9999px";
      offscreen.style.width = `${canvas.offsetWidth}px`;
      offscreen.style.height = `${canvas.offsetHeight}px`;
      offscreen.style.pointerEvents = "none";
      offscreen.style.zIndex = "-9999";
      offscreen.style.overflow = "hidden";
      offscreen.style.isolation = "isolate";
      offscreen.style.contain = "layout style paint";
      offscreen.style.willChange = "transform";
      offscreen.style.transform = "translateZ(0)";
      document.body.appendChild(offscreen);
      offscreen.appendChild(clone);

      // Force layout
      void offscreen.offsetHeight;
      void clone.offsetHeight;

      // Give a tick for styles to settle
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Inline critical styles to clone
      sanitizeNode(clone);

      // Remove outer rounding in exported root (only container, not mockups)
      clone.classList.remove("rounded-2xl");
      if (clone.id === "mockup-canvas") {
        clone.style.borderRadius = "0";
      }

      // Normalize relative bg URLs to absolute
      absolutizeBackgroundUrls(clone);

      // iOS-specific CSS neutralization (in the clone only)
      const onIOS = isIOSWebKit();
      if (onIOS) {
        stripProblematicCssForIOS(clone);
      }

      // Extra settle time
      await new Promise((resolve) => setTimeout(resolve, 120));

      // Compute effective scale (iOS may clamp)
      const base = getCanvasBaseSize();
      let effScale = scale;
      if (onIOS && base) {
        effScale = clampScaleForIOS(base.w, base.h, scale);
      }

      // Use modern-screenshot on iOS if available; fallback to html-to-image
      let blob: Blob | null = null;

      if (onIOS) {
        try {
          const mod = await import("modern-screenshot");
          const type =
            format === "png"
              ? "image/png"
              : format === "jpg"
              ? "image/jpeg"
              : "image/webp";
          const quality = format === "png" ? undefined : 0.92;

          const msBlob: Blob | null = await (
            mod as typeof import("modern-screenshot")
          ).domToBlob(clone, {
            scale: effScale,
            type,
            quality,
            backgroundColor:
              originalBackground &&
              originalBackground.includes("linear-gradient")
                ? undefined
                : format === "png" || format === "webp"
                ? "transparent"
                : "#000000",
          });
          blob = msBlob;
        } catch (e) {
          console.warn(
            "modern-screenshot not available; falling back to html-to-image on iOS.",
            e
          );
          blob = await toBlobByFormat(
            clone,
            format,
            effScale,
            originalBackground && originalBackground.includes("linear-gradient")
              ? undefined
              : format === "png" || format === "webp"
              ? "transparent"
              : "#000000"
          );
        }
      } else {
        // Desktop / non-iOS route (html-to-image)
        blob = await toBlobByFormat(
          clone,
          format,
          effScale,
          originalBackground && originalBackground.includes("linear-gradient")
            ? undefined
            : format === "png" || format === "webp"
            ? "transparent"
            : "#000000"
        );
      }

      // Cleanup offscreen host
      document.body.removeChild(offscreen);

      if (!blob) {
        toast.error("Failed to generate image blob. Please try again.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `mokkio.me-${Date.now()}.${format}`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);

      const bytesHint = estimateBytes(format, effScale);
      const outW = base ? Math.round(base.w * effScale) : undefined;
      const outH = base ? Math.round(base.h * effScale) : undefined;

      toast.success(
        `Saved ${format.toUpperCase()} · ${outW ?? "?"}×${outH ?? "?"}${
          bytesHint ? ` · ${prettyBytes(blob.size)}` : ""
        }`
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("An error occurred while exporting. Please try again.");
    } finally {
      setIsExporting(false);
      setGlobalIsExporting(false);
    }
  };

  /* ---------------------- UI ---------------------- */

  return (
    <>
      {/* Desktop Dropdown */}
      {!isMobile && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              className={`gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium ${
                isMobile ? "h-8 px-3 text-sm" : ""
              }`}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isMobile ? "..." : "Exporting..."}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {isMobile ? "Export" : "Export 4x · PNG"}
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-60 bg-popover border-border"
          >
            {/* PNG */}
            <DropdownMenuItem
              onClick={() => handleExport("png", 1)}
              className="text-popover-foreground hover:bg-accent cursor-pointer"
            >
              <span>Export as PNG (1x)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport("png", 2)}
              className="text-popover-foreground hover:bg-accent cursor-pointer"
            >
              <span>Export as PNG (2x)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport("png", 4)}
              className="text-popover-foreground hover:bg-accent cursor-pointer"
            >
              <span>Export as PNG (4x)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleExport("png", 8)}
              className="text-popover-foreground hover:bg-accent cursor-pointer"
            >
              <span>Export as PNG (8x)</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-border" />

            {/* JPEG */}
            <DropdownMenuItem
              onClick={() => handleExport("jpg", 4)}
              className="text-popover-foreground hover:bg-accent cursor-pointer"
            >
              <span>Export as JPG (4x)</span>
            </DropdownMenuItem>

            {/* WebP */}
            <DropdownMenuItem
              onClick={() => handleExport("webp", 4)}
              className="text-popover-foreground hover:bg-accent cursor-pointer"
            >
              <span>Export as WebP (4x)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Mobile Button */}
      {isMobile && (
        <Button
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-8 px-3 text-sm"
          disabled={isExporting}
          onClick={() => setShowMobileDialog(true)}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              ...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export
            </>
          )}
        </Button>
      )}

      {/* Mobile Export Dialog */}
      <Dialog open={showMobileDialog} onOpenChange={setShowMobileDialog}>
        <DialogContent className="bg-popover border-border max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center">
              Export Options
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {/* PNG Options */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">PNG</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleExport("png", 1);
                    setShowMobileDialog(false);
                  }}
                  className="text-xs"
                  disabled={isExporting}
                >
                  1x
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleExport("png", 2);
                    setShowMobileDialog(false);
                  }}
                  className="text-xs"
                  disabled={isExporting}
                >
                  2x
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleExport("png", 4);
                    setShowMobileDialog(false);
                  }}
                  className="text-xs"
                  disabled={isExporting}
                >
                  4x
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleExport("png", 8);
                    setShowMobileDialog(false);
                  }}
                  className="text-xs"
                  disabled={isExporting}
                >
                  8x
                </Button>
              </div>
            </div>

            {/* JPEG Option */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                JPEG
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleExport("jpg", 4);
                  setShowMobileDialog(false);
                }}
                className="w-full text-xs"
                disabled={isExporting}
              >
                4x Quality
              </Button>
            </div>

            {/* WebP Option */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                WebP
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleExport("webp", 4);
                  setShowMobileDialog(false);
                }}
                className="w-full text-xs"
                disabled={isExporting}
              >
                4x Quality
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

ExportButton.displayName = "ExportButton";
