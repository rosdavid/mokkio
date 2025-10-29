import React from "react";
import {
  RefreshCcwIcon,
  ArrowLeft,
  ArrowRight,
  PuzzleIcon,
} from "lucide-react";

interface ChromeFrameProps {
  children: React.ReactNode;
  width: number;
  height: number;
  borderRadius: number;
  siteUrl?: string;
  referenceWidth?: number;
  headerScale?: number;
  fitToContainer?: boolean;
}

export function ChromeFrame({
  children,
  width,
  height,
  borderRadius,
  siteUrl,
  referenceWidth,
  headerScale,
  fitToContainer,
}: ChromeFrameProps) {
  // const { isExporting } = useExport();

  // --- Scaling tuned for Chrome proportions ---
  const baseWidth = 880; // visual design reference
  const ref = referenceWidth && referenceWidth > 0 ? referenceWidth : baseWidth;
  const rawScale = typeof headerScale === "number" ? headerScale : width / ref;
  const scale = Math.max(0.18, Math.min(1.1, rawScale));
  const isPreview = typeof headerScale === "number";

  // --- Metrics (macOS Chrome-like) ---
  const tabStripH = Math.max(30, Math.round(40 * scale));
  const toolbarH = Math.max(40, Math.round(48 * scale));
  const headerH = tabStripH + toolbarH;
  const pagePadX = Math.max(10, Math.round(14 * scale));
  const tabGap = Math.max(6, Math.round(10 * scale));
  const tabPadX = Math.max(10, Math.round(14 * scale));
  const tabRadius = Math.max(8, Math.round(10 * scale));
  const tabIcon = isPreview ? 9 : Math.max(11, Math.round(14 * scale));
  const toolIcon = isPreview ? 10 : Math.max(12, Math.round(18 * scale));
  const trafficSize = Math.max(8, Math.round(12 * scale));
  const trafficGap = Math.max(6, Math.round(8 * scale));
  const omniH = Math.max(28, Math.round(34 * scale));
  const omniPadX = Math.max(10, Math.round(14 * scale));
  const fontSm = isPreview ? 8 : Math.max(11, Math.round(13 * scale));
  const fontMd = isPreview ? 9 : Math.max(12, Math.round(14 * scale));

  // --- Colors ---
  const chromeBGTop = "#eceff3"; // tab strip background
  const hairline = "rgba(0,0,0,0.08)";
  const tabActiveBG = "#ffffff";
  const tabInactiveFG = "#5f6368";
  const iconTone = "#5f6368";
  const iconMuted = "#a1a7b0";

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
        width: fitToContainer ? "100%" : `min(${width}px, 90vw)`,
        height: fitToContainer ? "100%" : `min(${height + headerH}px, 80vh)`,
        borderRadius: `${borderRadius}px`,
        display: "flex",
        flexDirection: "column",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* ---------- HEADER (Chrome) ---------- */}
      <div style={{ position: "relative", width: "100%", height: headerH }}>
        {/* Tab strip (row 1) */}
        <div
          style={{
            height: tabStripH,
            background: chromeBGTop,
            display: "flex",
            alignItems: "center",
            padding: `0 ${pagePadX}px`,
            gap: tabGap,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* macOS traffic lights on the far left */}
          <div
            style={{
              display: "flex",
              gap: trafficGap,
              marginRight: Math.max(6, Math.round(10 * scale)),
            }}
          >
            <span
              style={{
                width: trafficSize,
                height: trafficSize,
                borderRadius: "50%",
                background: "#FF605C",
                boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
              }}
            />
            <span
              style={{
                width: trafficSize,
                height: trafficSize,
                borderRadius: "50%",
                background: "#FFBD44",
                boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
              }}
            />
            <span
              style={{
                width: trafficSize,
                height: trafficSize,
                borderRadius: "50%",
                background: "#00CA4E",
                boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)",
              }}
            />
          </div>

          {/* Tabs container */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              overflow: "hidden",
              gap: tabGap,
              flex: 1,
              minWidth: 0,
              top: 1,
              position: "relative",
            }}
          >
            {/* Active tab (overlaps the toolbar below) */}
            <div
              style={{
                height: tabStripH - 2,
                padding: `0 ${tabPadX}px`,
                display: "flex",
                alignItems: "center",
                gap: Math.max(6, Math.round(8 * scale)),
                background: tabActiveBG,
                color: "#202124",
                borderBottom: "none",
                borderRadius: `${tabRadius}px ${tabRadius}px 0 0`,
                position: "relative",
                top: 1, // subtle alignment like Chrome
                zIndex: 3,
                boxShadow: "0 -1px 0 #fff",
              }}
            >
              <span
                style={{
                  width: tabIcon,
                  height: tabIcon,
                  borderRadius: 3,
                  background: "#87bafc",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: fontSm,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: Math.round(180 * scale),
                }}
              >
                {siteUrl ?? "New Tab"}
              </span>
              <svg
                width={tabIcon}
                height={tabIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconTone}
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </div>

            {/* Another inactive tab */}
            <div
              style={{
                height: tabStripH - 6,
                padding: `0 ${tabPadX}px`,
                display: "flex",
                alignItems: "center",
                gap: Math.max(6, Math.round(8 * scale)),
                color: tabInactiveFG,
                background: "transparent",
                borderRadius: `${tabRadius}px ${tabRadius}px 0 0`,
                position: "relative",
              }}
            >
              <span
                style={{
                  width: tabIcon,
                  height: tabIcon,
                  borderRadius: 3,
                  background: "#f6a5c0",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: fontSm,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: Math.round(140 * scale),
                }}
              >
                Design system
              </span>
              <svg
                width={tabIcon}
                height={tabIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconMuted}
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </div>

            {/* New tab (+) */}
            <div
              aria-label="New Tab"
              style={{
                width: Math.max(22, Math.round(26 * scale)),
                height: Math.max(22, Math.round(26 * scale)),
                display: "grid",
                placeItems: "center",
                flex: "0 0 auto",
                cursor: "default",
                position: "relative",
                bottom: 5,
              }}
            >
              <svg
                width={tabIcon}
                height={tabIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconTone}
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  d="M12 5v14M5 12h14"
                />
              </svg>
            </div>
          </div>

          {/* Tab strip trailing space (like Chrome’s draggable area) */}
          <div style={{ width: Math.max(20, Math.round(24 * scale)) }} />
        </div>

        {/* Toolbar (row 2) */}
        <div
          style={{
            height: toolbarH,
            background: tabActiveBG,
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            padding: `0 ${pagePadX}px`,
            gap: Math.max(10, Math.round(12 * scale)),
            position: "relative",
            zIndex: 0,
          }}
        >
          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              gap: Math.max(8, Math.round(10 * scale)),
            }}
          >
            {/* Back */}
            <ArrowLeft size={toolIcon} strokeWidth={2} color={iconTone} />
            {/* Forward (muted) */}
            <ArrowRight size={toolIcon} strokeWidth={2} color={iconMuted} />
            {/* Refresh */}
            <RefreshCcwIcon size={toolIcon} strokeWidth={2} color={iconTone} />
          </div>

          {/* Omnibox */}
          <div
            style={{ display: "flex", justifyContent: "center", minWidth: 0 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: Math.max(6, Math.round(8 * scale)),
                height: omniH,
                width: "100%",
                background: "#fff",
                borderRadius: 50,
                border: `1px solid ${hairline}`,
                padding: `0 ${omniPadX}px`,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                minWidth: 0,
              }}
            >
              {/* connection/lock */}
              <svg
                width={toolIcon}
                height={toolIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconMuted}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>

              {/* URL text */}
              <span
                style={{
                  fontSize: fontMd,
                  color: "#202124",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                  userSelect: "none",
                }}
              >
                {siteUrl ?? "Search Google or type a URL"}
              </span>

              {/* page actions inside field */}
              {/* bookmark (star outline) */}
              <svg
                width={toolIcon}
                height={toolIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconMuted}
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
          </div>

          {/* Right-side tools */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.max(10, Math.round(12 * scale)),
            }}
          >
            {/* Extensions (puzzle) */}
            <PuzzleIcon size={toolIcon} strokeWidth={2} color={iconTone} />

            {/* Profile avatar */}
            <span
              style={{
                width: Math.max(20, Math.round(24 * scale)),
                height: Math.max(20, Math.round(24 * scale)),
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7dd3fc, #a78bfa)",
                display: "inline-block",
              }}
            />

            {/* Menu (three dots vertical) */}
            <svg
              width={toolIcon}
              height={toolIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke={iconTone}
            >
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ---------- CONTENT ---------- */}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}
