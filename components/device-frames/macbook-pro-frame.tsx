import type React from "react";
import Image from "next/image";

interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
  mode?: string;
}

export function MacBookProFrame({
  children,
  borderRadius,
  mode = "display",
}: DeviceFrameProps) {
  const showFrame = mode !== "display";

  let frameSrc = "/macbook-pro-16-silver.png";
  switch (mode) {
    case "silver":
      frameSrc = "/macbook-pro-16-silver.png";
      break;
  }

  if (showFrame) {
    return (
      <div className="relative" style={{ width: "2560px", height: "1600px" }}>
        {/* Screen Content */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: "267px",
            left: "452px",
            width: "1656px",
            height: "1066px",
            borderRadius: `0px`,
            zIndex: 10,
          }}
        >
          {children}
        </div>
        {/* Device Frame Image */}
        <div className="relative" style={{ zIndex: 20, pointerEvents: "none" }}>
          <Image
            src={frameSrc}
            alt="MacBook Pro 16 Frame"
            width={2560}
            height={1600}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "fixed",
            }}
            unoptimized
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: "2560px", height: "1600px" }}>
      {/* Screen */}
      <div
        className="relative overflow-hidden bg-white"
        style={{
          top: "267px",
          left: "452px",
          width: "1656px",
          height: "1066px",
          borderRadius: `${borderRadius}px`,
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}
