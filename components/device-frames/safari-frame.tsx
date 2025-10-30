import React from "react";
import { RefreshCcwIcon } from "lucide-react";

interface SafariFrameProps {
  children: React.ReactNode;
  width: number;
  height: number;
  borderRadius: number;
  siteUrl?: string;
  referenceWidth?: number;
  headerScale?: number;
  fitToContainer?: boolean;
  theme?: string;
}

export function SafariFrame({
  children,
  width,
  height,
  borderRadius,
  siteUrl,
  referenceWidth,
  headerScale,
  fitToContainer,
  theme = "light",
}: SafariFrameProps) {
  // const { isExporting } = useExport();

  // ---------- Scaling tuned to match Safari proportions ----------
  const baseWidth = 800; // visual design reference
  const ref = referenceWidth && referenceWidth > 0 ? referenceWidth : baseWidth;
  const rawScale = typeof headerScale === "number" ? headerScale : width / ref;
  const scale = Math.max(0.18, Math.min(1.05, rawScale));
  const isPreview = typeof headerScale === "number";

  // ---------- Metrics (carefully matched to Safari) ----------
  const headerHeight = isPreview ? 20 : Math.max(44, Math.round(52 * scale)); // full titlebar height
  const hPad = Math.max(10, Math.round(14 * scale)); // horizontal page padding
  const trafficSize = Math.max(8, Math.round(12 * scale));
  const trafficGap = Math.max(5, Math.round(8 * scale));
  const groupGap = Math.max(10, Math.round(12 * scale));
  const tool = isPreview ? 9 : Math.max(12, Math.round(18 * scale)); // toolbar icon size
  const omniHeight = Math.max(24, Math.round(headerHeight - 18)); // URL pill height
  const omniPadX = Math.max(10, Math.round(14 * scale));
  const omniFont = isPreview ? 8 : Math.max(11, Math.round(14 * scale));

  // ---------- Shared styles based on theme ----------
  const isDark = theme === "dark";
  const iconTone = isDark ? "#ffffff" : "#6B7280";
  const iconMuted = isDark ? "#9CA3AF" : "#9CA3AF";
  const backgroundColor = isDark ? "#1e1e1e" : "#fff";
  const headerBackground = isDark
    ? "linear-gradient(to bottom, rgba(45,45,48,0.92), rgba(32,33,36,0.82))"
    : "linear-gradient(to bottom, rgba(250,250,252,0.92), rgba(244,245,248,0.82))";
  const headerBorder = isDark
    ? "1px solid rgba(255,255,255,0.1)"
    : "1px solid rgba(0,0,0,0.08)";
  const omniboxBackground = isDark ? "#2d2d30" : "#ffffff";
  const omniboxBorder = isDark
    ? "1px solid rgba(255,255,255,0.08)"
    : "1px solid rgba(0,0,0,0.08)";
  const omniboxShadow = isDark
    ? "inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.2)"
    : "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.04)";
  const textColor = isDark ? "#ffffff" : "#3F3F46";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: backgroundColor,
        boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
        width: fitToContainer ? "100%" : `min(${width}px, 90vw)`,
        height: fitToContainer
          ? "100%"
          : `min(${height + headerHeight}px, 80vh)`,
        borderRadius: `${borderRadius}px`,
        display: "flex",
        flexDirection: "column",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* ---------- Safari Titlebar ---------- */}
      <div
        style={{
          height: headerHeight,
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: headerBackground,
          borderBottom: headerBorder,
          backdropFilter: "blur(14px) saturate(180%)",
          WebkitBackdropFilter: "blur(14px) saturate(180%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto 1fr auto",
            alignItems: "center",
            gap: groupGap,
            padding: `0 ${hPad}px`,
            width: "100%",
          }}
        >
          {/* Traffic lights */}
          <div
            style={{ display: "flex", gap: trafficGap, alignItems: "center" }}
          >
            {/* red */}
            <span
              style={{
                width: trafficSize,
                height: trafficSize,
                borderRadius: "50%",
                background: "#FF605C",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.02)",
                display: "inline-block",
              }}
            />
            {/* yellow */}
            <span
              style={{
                width: trafficSize,
                height: trafficSize,
                borderRadius: "50%",
                background: "#FFBD44",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.02)",
                display: "inline-block",
              }}
            />
            {/* green */}
            <span
              style={{
                width: trafficSize,
                height: trafficSize,
                borderRadius: "50%",
                background: "#00CA4E",
                boxShadow:
                  "inset 0 0 0 0.5px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.02)",
                display: "inline-block",
              }}
            />
          </div>

          {/* Back/Forward (chevrons, forward looks disabled initially) */}
          <div
            style={{
              display: "flex",
              gap: Math.max(8, Math.round(10 * scale)),
            }}
          >
            {/* back */}
            <svg
              width={tool}
              height={tool}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconTone}
              style={{ display: "block" }}
            >
              {/* Chevron left */}
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {/* forward (muted) */}
            <svg
              width={tool}
              height={tool}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconMuted}
              style={{ display: "block" }}
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Omnibox centered */}
          <div
            style={{ display: "flex", justifyContent: "center", minWidth: 0 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.max(6, Math.round(8 * scale)),
                height: omniHeight,
                minHeight: 0,
                width: "min(72%, 760px)",
                background: omniboxBackground,
                borderRadius: 10,
                padding: `0 ${omniPadX}px`,
                border: omniboxBorder,
                boxShadow: omniboxShadow,
              }}
            >
              {/* left magnifier */}
              <svg
                width={tool}
                height={tool}
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconMuted}
                style={{ flex: "0 0 auto" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-5.2-5.2M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                />
              </svg>

              {/* URL / placeholder */}
              <span
                style={{
                  fontSize: omniFont,
                  color: textColor,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  lineHeight: 1,
                  flex: 1,
                  userSelect: "none",
                }}
              >
                {siteUrl ?? "Search or enter website name"}
              </span>

              {/* reload (inside field, right side) */}
              <RefreshCcwIcon size={tool} strokeWidth={2} color={iconTone} />
            </div>
          </div>

          {/* Right tools: Share, Tab Overview, New Tab */}
          <div
            style={{
              display: "flex",
              gap: Math.max(12, Math.round(14 * scale)),
            }}
          >
            {/* Share (square with arrow up) */}
            <svg
              width={tool}
              height={tool}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconTone}
              style={{ display: "block" }}
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"
              />
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16V4m0 0l-4 4m4-4l4 4"
              />
            </svg>

            {/* Tab overview (two overlapping squares) */}
            <svg
              width={tool}
              height={tool}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconTone}
              style={{ display: "block" }}
            >
              <rect x="3" y="7" width="10" height="10" rx="2" strokeWidth={2} />
              <rect
                x="11"
                y="3"
                width="10"
                height="10"
                rx="2"
                strokeWidth={2}
              />
            </svg>

            {/* New tab (+) */}
            <svg
              width={tool}
              height={tool}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconTone}
              style={{ display: "block" }}
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14M5 12h14"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ---------- Content area ---------- */}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}
