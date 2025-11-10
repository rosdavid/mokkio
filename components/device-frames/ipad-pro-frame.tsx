import type React from "react";
import Image from "next/image";

interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
  mode: string;
}

export function IPadProFrame({ children, mode }: DeviceFrameProps) {
  const showFrame = mode !== "display";

  let frameSrc = "/ipad-pro-13-gray.png";
  switch (mode) {
    case "gray":
      frameSrc = "/ipad-pro-13-gray.png";
      break;
    case "silver":
      frameSrc = "/ipad-pro-13-silver.png";
      break;
  }

  if (showFrame) {
    return (
      <div className="relative" style={{ width: "1024px", height: "768px" }}>
        {/* Screen Content */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: "76px",
            left: "281px",
            width: "462px",
            height: "616px",
            borderRadius: `10px`,
            zIndex: 10,
          }}
        >
          {children}
        </div>
        {/* Device Frame Image */}
        <div className="relative" style={{ zIndex: 20, pointerEvents: "none" }}>
          <Image
            src={frameSrc}
            alt="iPad Pro 13 Frame"
            width={402}
            height={874}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "fixed",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: "1024px", height: "768px" }}>
      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{
          top: "76px",
          left: "281px",
          width: "462px",
          height: "616px",
          borderRadius: `10px`,
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}
