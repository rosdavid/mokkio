import React from "react";
import { useExport } from "@/lib/export-context";

interface BrowserFrameProps {
  children: React.ReactNode;
  width: number;
  height: number;
  borderRadius: number;
  siteUrl?: string;
  referenceWidth?: number;
  headerScale?: number;
  fitToContainer?: boolean;
}

export function BrowserFrame({
  children,
  width,
  height,
  borderRadius,
  siteUrl,
  referenceWidth,
  headerScale,
  fitToContainer,
}: BrowserFrameProps) {
  const { isExporting } = useExport();
  // Scale sizes for preview vs canvas.
  // If a referenceWidth (canvas render width) is provided, compute scale relative to it
  // so previews match the proportions used on the canvas.
  const baseWidth = 600; // fallback design reference width
  const ref = referenceWidth && referenceWidth > 0 ? referenceWidth : baseWidth;
  // If headerScale is provided (from preview), use it. Otherwise compute from width/ref.
  const rawScale = typeof headerScale === "number" ? headerScale : width / ref;
  // Allow smaller scales down to ~0.18 so previews can match canvas proportions
  const scale = Math.max(0.18, Math.min(1.05, rawScale));

  const isPreview = typeof headerScale === "number";

  // Make the header slightly smaller (base 36px) and reduce minima for a compact look
  const headerHeight = isPreview ? 12 : Math.max(24, Math.round(34 * scale)); // base mínima 24px, más compacto
  const controlDotSize = Math.max(1, Math.round(10 * scale));
  const controlGap = Math.max(1, Math.round(6 * scale));
  const iconSize = isPreview ? 5 : Math.max(7, Math.round(16 * scale));
  // Ajusta el padding vertical para margen pero sin ocultar la URL
  const inputPaddingX = Math.max(3, Math.round(10 * scale));
  // const inputPaddingY = Math.max(2, Math.round(6 * scale)); // Eliminado, no se usa

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
        width: fitToContainer ? "100%" : `min(${width}px, 90vw)`,
        height: fitToContainer
          ? "100%"
          : `min(${height + headerHeight}px, 80vh)`,
        borderRadius: `${borderRadius}px`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#f3f3f3",
          borderBottom: "1px solid #e0e0e0",
          height: `${headerHeight}px`,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${controlGap}px`,
            height: `${headerHeight}px`,
            padding: `0 ${inputPaddingX}px`,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: `${controlGap}px` }}>
            <div
              style={{
                width: `${controlDotSize}px`,
                height: `${controlDotSize}px`,
                borderRadius: "50%",
                background: "#ff5f57",
              }}
            />
            <div
              style={{
                width: `${controlDotSize}px`,
                height: `${controlDotSize}px`,
                borderRadius: "50%",
                background: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: `${controlDotSize}px`,
                height: `${controlDotSize}px`,
                borderRadius: "50%",
                background: "#28ca42",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: isExporting ? "center" : "center",
              gap: `${Math.round(controlGap / 2)}px`,
              background: "white",
              borderRadius: 9999,
              padding: isExporting
                ? `0 ${inputPaddingX}px`
                : `2px ${inputPaddingX}px`,
              border: "1px solid #e5e7eb",
              flex: 1,
              minHeight: 0,
              height: isPreview
                ? `${headerHeight}px`
                : `calc(${headerHeight}px - 8px)`,
            }}
          >
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: "#9ca3af" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                height: isPreview ? "auto" : "100%",
                overflow: "hidden",
              }}
            >
              {/* El log ahora se ejecuta solo en useEffect, no aquí */}
              <span
                style={{
                  fontSize: isPreview ? 5 : Math.max(8, Math.round(14 * scale)),
                  color: "#4b5563",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textAlign: "left",
                  width: "100%",
                  display: "inline-block",
                  verticalAlign: "middle",
                  lineHeight: isExporting ? 1.5 : 1.2,
                  height: "100%",
                  marginTop: isExporting ? "4px" : "0px",
                  paddingTop: isPreview
                    ? "0px"
                    : isExporting === true
                    ? "0px"
                    : "2px",
                  paddingBottom: "0px",
                }}
              >
                {siteUrl ?? "https://mock.io"}
              </span>
            </div>
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: "#9ca3af" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Additional browser icons for realism */}
          <div
            style={{
              display: "flex",
              gap: `${controlGap}px`,
              alignItems: "center",
            }}
          >
            {/* Refresh icon */}
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: "#9ca3af", cursor: "pointer" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>

            {/* Home icon */}
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: "#9ca3af", cursor: "pointer" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>

            {/* Star/Favorites icon */}
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: "#9ca3af", cursor: "pointer" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>

            {/* Menu dots */}
            <svg
              width={iconSize}
              height={iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              style={{ color: "#9ca3af", cursor: "pointer" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}
