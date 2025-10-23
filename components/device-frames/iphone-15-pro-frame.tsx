import type React from "react"
interface DeviceFrameProps {
  children: React.ReactNode
  borderRadius: number
}

export function IPhone15ProFrame({ children, borderRadius }: DeviceFrameProps) {
  return (
    <div className="relative">
      {/* Device Frame */}
      <div
        className="relative overflow-hidden bg-[#1d1d1f] p-2"
        style={{
          borderRadius: `${borderRadius + 8}px`,
          boxShadow: "0 0 0 2px #1d1d1f, 0 0 0 3px #3a3a3c",
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-2 z-10 h-8 w-28 -translate-x-1/2 rounded-full bg-black" />

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
  )
}
