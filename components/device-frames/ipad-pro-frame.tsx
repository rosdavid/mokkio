import type React from "react";
interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
}

export function IPadProFrame({ children, borderRadius }: DeviceFrameProps) {
  return (
    <div className="relative">
      {/* Device Frame */}
      <div
        className="relative overflow-hidden bg-[#1d1d1f] p-3"
        style={{
          borderRadius: `${borderRadius + 6}px`,
          boxShadow: "0 0 0 2px #1d1d1f, 0 0 0 3px #3a3a3c",
        }}
      >
        {/* Camera */}
        <div className="absolute right-6 top-6 z-10 h-3 w-3 rounded-full bg-black ring-2 ring-[#2d2d2d]" />

        {/* Screen */}
        <div
          className="relative overflow-hidden bg-white"
          style={{
            borderRadius: `${borderRadius}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
