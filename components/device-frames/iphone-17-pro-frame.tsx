import type React from "react";
interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
}

export function IPhone17ProFrame({ children, borderRadius }: DeviceFrameProps) {
  return (
    <div className="relative" style={{ width: "320px", height: "680px" }}>
      {/* Device Frame */}
      <div
        className="relative overflow-hidden p-2"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* Screen */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            borderRadius: `${borderRadius}px`,
            width: "calc(100% - 16px)", // adjust for padding
            height: "calc(100% - 16px)",
            margin: "8px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
