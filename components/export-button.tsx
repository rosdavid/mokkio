"use client";

import { useState } from "react";
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

export function ExportButton({ isMobile = false }: { isMobile?: boolean }) {
  const [isExporting, setIsExporting] = useState(false);
  const { setIsExporting: setGlobalIsExporting } = useExport();

  const handleExport = async (format: "png" | "jpg" | "webp", scale = 4) => {
    const canvas = document.getElementById("mockup-canvas");
    if (!canvas) {
      toast.error("Canvas not found. Please try again.");
      return;
    }

    setIsExporting(true);
    setGlobalIsExporting(true);

    // Esperar un tick para que el componente se re-renderice con isExporting=true
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      // Clone the canvas node so we can sanitize CSS (inline computed styles)
      const clone = canvas.cloneNode(true) as HTMLElement;

      // Get the original background style before cloning
      const originalComputed = window.getComputedStyle(canvas);
      const originalBackground =
        originalComputed.getPropertyValue("background");

      // Create an offscreen container to host the clone
      const offscreen = document.createElement("div");
      offscreen.style.position = "fixed";
      offscreen.style.left = "-9999px";
      offscreen.style.top = "-9999px";
      offscreen.style.pointerEvents = "none";
      offscreen.style.opacity = "0";
      document.body.appendChild(offscreen);
      offscreen.appendChild(clone);

      // Walk nodes and inline computed styles to avoid unsupported functions (lab, oklch, color-mix, color())
      const sanitizeNode = (node: Element) => {
        const computed = window.getComputedStyle(node as Element);
        // inline style object not needed; we'll set properties directly on the element

        // Special handling for mockup-canvas background gradients
        if (node.id === "mockup-canvas") {
          // Force inline the background gradient from the original element
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

        // Inline common visual properties that html2canvas parses and that may contain modern color functions
        const propsToInline = [
          "background",
          "background-color",
          "color",
          "border-color",
          "box-shadow",
          "filter",
          "outline-color",
          "text-shadow",
        ];

        propsToInline.forEach((prop) => {
          try {
            const value = computed.getPropertyValue(prop);
            if (value) {
              // For color properties, be more careful - don't replace with transparent
              if (
                prop === "color" ||
                prop === "border-color" ||
                prop === "outline-color"
              ) {
                // Only replace modern color functions with a fallback gray, not transparent
                const sanitized = value
                  .replace(/oklch\([^)]*\)/gi, "#666666")
                  .replace(/color\([^)]*\)/gi, "#666666")
                  .replace(/lab\([^)]*\)/gi, "#666666")
                  .replace(/lch\([^)]*\)/gi, "#666666")
                  .replace(/color-mix\([^)]*\)/gi, "#666666");
                if (sanitized !== value) {
                  (node as HTMLElement).style.setProperty(prop, sanitized);
                }
              } else {
                // For other properties, replace with transparent as before
                const sanitized = value
                  .replace(/oklch\([^)]*\)/gi, "rgba(0,0,0,0)")
                  .replace(/color\([^)]*\)/gi, "rgba(0,0,0,0)")
                  .replace(/lab\([^)]*\)/gi, "rgba(0,0,0,0)")
                  .replace(/lch\([^)]*\)/gi, "rgba(0,0,0,0)")
                  .replace(/color-mix\([^)]*\)/gi, "rgba(0,0,0,0)")
                  // Don't replace linear-gradient, radial-gradient, or conic-gradient
                  .replace(/linear-gradient\([^)]*\)/gi, (match) => match)
                  .replace(/radial-gradient\([^)]*\)/gi, (match) => match)
                  .replace(/conic-gradient\([^)]*\)/gi, (match) => match);

                (node as HTMLElement).style.setProperty(prop, sanitized);
              }
            }
          } catch {
            // ignore any access errors
          }
        });

        // Recurse
        node.childNodes.forEach((child) => {
          if (child.nodeType === 1) sanitizeNode(child as Element);
        });
      };

      sanitizeNode(clone as Element);

      // Remove rounded corners for export
      clone.classList.remove("rounded-2xl");

      // Use html-to-image for better CSS support including drop-shadow
      const blob = await htmlToImage.toBlob(clone as HTMLElement, {
        quality: 1,
        pixelRatio: scale,
        // Don't set backgroundColor to transparent if the canvas has a gradient background
        backgroundColor:
          originalBackground && originalBackground.includes("linear-gradient")
            ? undefined
            : "transparent",
        filter: (node) => {
          // Skip elements that are not visible or cause rendering issues
          try {
            if (!(node instanceof Element)) return true;
            const style = getComputedStyle(node);
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0"
            );
          } catch (error) {
            console.warn("Could not get computed style for node:", error);
            return true;
          }
        },
      });

      // Clean up offscreen clone
      document.body.removeChild(offscreen);

      if (!blob) {
        toast.error("Failed to generate image blob. Please try again.");
        return;
      }

      const link = document.createElement("a");
      link.download = `mockup-${Date.now()}.${format}`;
      link.href = URL.createObjectURL(blob);
      link.click();

      // Clean up the object URL after download
      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      toast.success(
        `Your mockup has been downloaded as ${format.toUpperCase()}.`
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("An error occurred while exporting. Please try again.");
    } finally {
      setIsExporting(false);
      setGlobalIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
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
        className="w-48 bg-[#1a1a1a] border-white/10"
      >
        <DropdownMenuItem
          onClick={() => handleExport("png", 1)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          Export as PNG (1x)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("png", 2)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          Export as PNG (2x)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("png", 4)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          Export as PNG (4x)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("png", 8)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          Export as PNG (8x)
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          onClick={() => handleExport("jpg", 4)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          Export as JPG (4x)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("webp", 4)}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          Export as WebP (4x)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
