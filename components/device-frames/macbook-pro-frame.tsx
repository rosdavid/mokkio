import type React from "react";
interface DeviceFrameProps {
  children: React.ReactNode;
  borderRadius: number;
}

export function MacBookProFrame({ children, borderRadius }: DeviceFrameProps) {
  return (
    <div className="relative">
      {/* Screen Frame */}
      <div
        className="relative overflow-hidden bg-[#1d1d1f] p-3"
        style={{
          borderRadius: `${borderRadius + 4}px`,
          boxShadow: "0 0 0 1px #000",
        }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-6 w-48 -translate-x-1/2 rounded-b-2xl bg-black" />

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

      {/* Base/Keyboard */}
      <div className="relative mt-1 h-3 w-full">
        <div
          className="h-full w-full bg-linear-to-b from-[#2d2d2d] to-[#1a1a1a]"
          style={{
            borderRadius: "0 0 8px 8px",
          }}
        />
        {/* Trackpad indicator */}
        <div className="absolute bottom-0 left-1/2 h-1 w-32 -translate-x-1/2 rounded-t-sm bg-[#0a0a0a]" />
      </div>
    </div>
  );
}
