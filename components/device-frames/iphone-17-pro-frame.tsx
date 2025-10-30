import type React from "react";
import Image from "next/image";

interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
  mode: string;
}

export function IPhone17ProFrame({
  children,
  borderRadius,
  mode,
}: DeviceFrameProps) {
  const showFrame = mode !== "display";

  let frameSrc = "/iphone-17-pro.png";
  switch (mode) {
    case "blue":
      frameSrc = "/iphone-17-pro.png";
      break;
    case "silver":
      frameSrc = "/iphone-17-pro-silver.png";
      break;
    case "orange":
      frameSrc = "/iphone-17-pro-orange.png";
      break;
  }

  if (showFrame) {
    return (
      <div className="relative" style={{ width: "402px", height: "874px" }}>
        {/* Screen Content */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: "87px", // Adjusted by 1px up
            left: "40px",
            width: "322px",
            height: "700px", // Increased to fill the remaining space
            borderRadius: `${borderRadius}px`,
            zIndex: 10,
          }}
        >
          {children}
        </div>
        {/* Device Frame Image */}
        <div className="relative" style={{ zIndex: 20, pointerEvents: "none" }}>
          <Image
            src={frameSrc}
            alt="iPhone 17 Pro Frame"
            width={402}
            height={874}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill", // Changed from "contain" to "fill" to ensure exact fit
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: "402px", height: "874px" }}>
      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{
          top: "87px",
          left: "40px",
          width: "322px",
          height: "700px",
          borderRadius: `${borderRadius}px`,
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}
