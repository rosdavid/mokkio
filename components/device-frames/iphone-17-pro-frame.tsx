import type React from "react";
import Image from "next/image";

interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
  showFrame?: boolean;
}

export function IPhone17ProFrame({
  children,
  borderRadius,
  showFrame = false,
}: DeviceFrameProps) {
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
            src="/iphone-17-pro.png"
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
