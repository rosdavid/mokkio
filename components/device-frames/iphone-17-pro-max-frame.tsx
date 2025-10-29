import type React from "react";
import Image from "next/image";

interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
  showFrame?: boolean;
}

export function IPhone17ProMaxFrame({
  children,
  showFrame = false,
}: DeviceFrameProps) {
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
            borderRadius: "50px",
            zIndex: 10,
          }}
        >
          {children}
        </div>
        {/* Device Frame Image */}
        <div className="relative" style={{ zIndex: 20, pointerEvents: "none" }}>
          <Image
            src="/iphone-17-pro-max.png"
            alt="iPhone 17 Pro Max Frame"
            width={440}
            height={956}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
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
          borderRadius: "50px",
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
}
