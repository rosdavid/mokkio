import React from "react";

interface BrowserMockupProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  siteUrl?: string;
  children?: React.ReactNode;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  width = 1200,
  height = 800,
  borderRadius = 16,
  siteUrl = "https://mock.io",
  children,
}) => {
  const headerHeight = 44;
  const searchBarHeight = 32;
  const dotSize = 10;
  const iconSize = 18;
  const paddingX = 16;

  return (
    <div
      id="mockup-canvas"
      style={{
        width,
        height,
        borderRadius,
        background: "#fff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: headerHeight,
          background: "#f5f6fa",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          padding: `0 ${paddingX}px`,
        }}
      >
        {/* Window controls */}
        <div style={{ display: "flex", gap: 6 }}>
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: "#ff5f57",
            }}
          />
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: "#febc2e",
            }}
          />
          <div
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: "#28c940",
            }}
          />
        </div>
        {/* Spacer */}
        <div style={{ flex: 1 }} />
      </div>
      {/* Search bar */}
      <div
        style={{
          height: searchBarHeight,
          background: "#f5f6fa",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: `0 ${paddingX}px`,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {/* Lock icon */}
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          style={{ marginRight: 8 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span
          style={{
            fontSize: 15,
            color: "#4b5563",
            background: "#fff",
            borderRadius: 8,
            padding: "4px 12px",
            border: "1px solid #e5e7eb",
            flex: 1,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
          }}
        >
          {siteUrl}
        </span>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          style={{ marginLeft: 8 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      {/* Content */}
      <div style={{ flex: 1, background: "#fff", position: "relative" }}>
        {children}
      </div>
    </div>
  );
};
