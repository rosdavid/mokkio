import type React from "react";
import Image from "next/image";

interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
  mode: string;
}

export function IPhone17ProMaxFrame({
  children,
  borderRadius,
  mode,
}: DeviceFrameProps) {
  const showFrame = mode !== "display";

  let frameSrc = "/iphone-17-pro-max.png";
  switch (mode) {
    case "blue":
      frameSrc = "/iphone-17-pro-max.png";
      break;
    case "silver":
      frameSrc = "/iphone-17-pro-max-silver.png";
      break;
    case "orange":
      frameSrc = "/iphone-17-pro-max-orange.png";
      break;
  }

  if (showFrame) {
    return (
      <div className="relative" style={{ width: "440px", height: "956px" }}>
        {/* Screen Content */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: "96px",
            left: "44px",
            width: "352px",
            height: "765px",
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
            alt="iPhone 17 Pro Max Frame"
            width={440}
            height={956}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: "440px", height: "956px" }}>
      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{
          top: "96px",
          left: "44px",
          width: "352px",
          height: "765px",
          borderRadius: `${borderRadius}px`,
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}
