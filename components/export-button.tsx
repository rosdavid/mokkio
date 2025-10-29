"use client";

import {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown, Loader2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import { toast } from "sonner";
import { useExport } from "@/lib/export-context";

type ExportFormat = "png" | "jpg" | "webp";

export const ExportButton = forwardRef<
  { openMenu: () => void },
  { isMobile?: boolean }
>(({ isMobile = false }, ref) => {
  const [isExporting, setIsExporting] = useState(false);
  const [open, setOpen] = useState(false);
  const { setIsExporting: setGlobalIsExporting } = useExport();

  useImperativeHandle(
    ref,
    () => ({
      openMenu: () => setOpen(true),
    }),
    []
  );

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
    // Prefer explicit style width/height if present, fall back to client metrics
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

      // Heuristic: the noise overlay is a div with background-image:data URL + mix-blend overlay
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

  // Bytes-per-pixel heuristics for each format and entropy level (empirical midpoints)
  const BPP_TABLE = useMemo(
    () => ({
      png: {
        transparent: 0.1, // large transparent areas compress extremely well
        flat: 0.22, // solid/clean UI
        medium: 0.33, // gradients/shapes
        "medium-high": 0.75, // screenshot/photo inside frame
        high: 0.95, // photo + noise/texture
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
      png: 20_000, // container + chunk headers
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

  const [sizeHints, setSizeHints] = useState<Record<string, string>>({});

  const recomputeSizeHints = useCallback(() => {
    const entries: Array<[ExportFormat, number, string]> = [
      ["png", 1, "png@1"],
      ["png", 2, "png@2"],
      ["png", 4, "png@4"],
      ["png", 8, "png@8"],
      ["jpg", 4, "jpg@4"],
      ["webp", 4, "webp@4"],
    ];
    const next: Record<string, string> = {};
    for (const [fmt, scale, key] of entries) {
      const bytes = estimateBytes(fmt, scale);
      if (bytes != null) next[key] = prettyBytes(bytes);
    }
    setSizeHints(next);
  }, [estimateBytes]);

  // Recalculate whenever the menu opens (cheap, reflects latest canvas state)
  useEffect(() => {
    if (open) recomputeSizeHints();
  }, [open, recomputeSizeHints]);

  /* ---------------------- Export (real) ---------------------- */

  const toBlobByFormat = async (
    node: HTMLElement,
    format: ExportFormat,
    scale: number,
    backgroundColor?: string,
    filter?: (node: HTMLElement) => boolean
  ): Promise<Blob | null> => {
    // Use toCanvas for full control over output MIME and quality via canvas.toBlob
    const canvas = await htmlToImage.toCanvas(node, {
      pixelRatio: scale,
      backgroundColor,
      filter,
    });

    // Quality: keep PNG lossless; use ~0.92 for JPEG/WEBP for good balance
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
  };

  const handleExport = async (format: ExportFormat, scale = 4) => {
    const canvas = document.getElementById("mockup-canvas");
    if (!canvas) {
      toast.error("Canvas not found. Please try again.");
      return;
    }

    setIsExporting(true);
    setGlobalIsExporting(true);

    // Wait one microtask so UI can re-render exporting state
    await new Promise((r) => setTimeout(r, 0));

    try {
      // Clone the node we will rasterize
      const clone = canvas.cloneNode(true) as HTMLElement;

      // Capture original background before any sanitization
      const originalComputed = window.getComputedStyle(canvas as Element);
      const originalBackground =
        originalComputed.getPropertyValue("background");

      // Strip transforms for the clone
      clone.style.transform = "none";
      clone.style.transformOrigin = "initial";

      // Offscreen container
      const offscreen = document.createElement("div");
      offscreen.style.position = "fixed";
      offscreen.style.left = "-9999px";
      offscreen.style.top = "-9999px";
      offscreen.style.pointerEvents = "none";
      offscreen.style.opacity = "0";
      document.body.appendChild(offscreen);
      offscreen.appendChild(clone);

      // Inline critical styles (your original sanitization)
      const sanitizeNode = (node: Element) => {
        const computed = window.getComputedStyle(node as Element);

        if (node.id === "mockup-canvas") {
          if (
            originalBackground &&
            originalBackground.includes("linear-gradient")
          ) {
            (node as HTMLElement).style.setProperty(
              "background",
              originalBackground
            );
          }
        }

        const propsToInline = [
          "background",
          "background-color",
          "color",
          "border-color",
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
                if (sanitized !== value)
                  (node as HTMLElement).style.setProperty(prop, sanitized);
              } else if (
                prop === "filter" ||
                prop === "mix-blend-mode" ||
                prop === "background-image" ||
                prop === "opacity"
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
            /* swallow */
          }
        });

        node.childNodes.forEach((child) => {
          if (child.nodeType === 1) sanitizeNode(child as Element);
        });
      };
      sanitizeNode(clone as Element);

      // Remove rounded corners for export
      clone.classList.remove("rounded-2xl");

      // Use toCanvas -> toBlob for correct MIME and quality per format
      const bytesHint = estimateBytes(format, scale); // pre-estimate
      const base = getCanvasBaseSize();
      const outW = base ? Math.round(base.w * scale) : undefined;
      const outH = base ? Math.round(base.h * scale) : undefined;

      const blob = await toBlobByFormat(
        clone as HTMLElement,
        format,
        scale,
        // Only force transparent BG when original is not a gradient
        originalBackground && originalBackground.includes("linear-gradient")
          ? undefined
          : format === "png" || format === "webp"
          ? "transparent"
          : "#000000", // JPEG cannot be transparent; pick a safe default
        (node) => {
          try {
            if (!(node instanceof Element)) return true;
            const style = getComputedStyle(node);
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0"
            );
          } catch {
            return true;
          }
        }
      );

      // Cleanup
      document.body.removeChild(offscreen);

      if (!blob) {
        toast.error("Failed to generate image blob. Please try again.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `mokkio-${Date.now()}.${format}`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);

      // Show final, real size + resolution
      toast.success(
        `Saved ${format.toUpperCase()} · ${outW ?? "?"}×${
          outH ?? "?"
        } · ${prettyBytes(blob.size)}${
          bytesHint ? ` (est. ${prettyBytes(bytesHint)})` : ""
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

  // Helper to show default button hint (PNG 4×) on desktop

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className={`gap-2 bg-white text-black hover:bg-white/90 font-medium ${
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
        className="w-60 bg-[#1a1a1a] border-white/10"
      >
        {/* PNG */}
        <DropdownMenuItem
          onClick={() => handleExport("png", 1)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <span>Export as PNG (1x)</span>
          <span className="ml-auto text-white/40">
            {sizeHints["png@1"] ? `~${sizeHints["png@1"]}` : ""}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("png", 2)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <span>Export as PNG (2x)</span>
          <span className="ml-auto text-white/40">
            {sizeHints["png@2"] ? `~${sizeHints["png@2"]}` : ""}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("png", 4)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <span>Export as PNG (4x)</span>
          <span className="ml-auto text-white/40">
            {sizeHints["png@4"] ? `~${sizeHints["png@4"]}` : ""}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("png", 8)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <span>Export as PNG (8x)</span>
          <span className="ml-auto text-white/40">
            {sizeHints["png@8"] ? `~${sizeHints["png@8"]}` : ""}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        {/* JPEG */}
        <DropdownMenuItem
          onClick={() => handleExport("jpg", 4)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <span>Export as JPG (4x)</span>
          <span className="ml-auto text-white/40">
            {sizeHints["jpg@4"] ? `~${sizeHints["jpg@4"]}` : ""}
          </span>
        </DropdownMenuItem>

        {/* WebP */}
        <DropdownMenuItem
          onClick={() => handleExport("webp", 4)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <span>Export as WebP (4x)</span>
          <span className="ml-auto text-white/40">
            {sizeHints["webp@4"] ? `~${sizeHints["webp@4"]}` : ""}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ExportButton.displayName = "ExportButton";
