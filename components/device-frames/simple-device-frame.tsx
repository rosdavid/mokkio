import type React from "react";
interface SimpleDeviceFrameProps {
  children: React.ReactNode;
  width: number;
  height: number;
  borderRadius: number;
}

export function SimpleDeviceFrame({
  children,
  width,
  height,
  borderRadius,
}: SimpleDeviceFrameProps) {
  return (
    <div
      className="relative overflow-hidden bg-white shadow-2xl"
      style={{
        width: `min(${width}px, 90vw)`,
        height: `min(${height}px, 80vh)`,
        aspectRatio: `${width}/${height}`,
        borderRadius: `${borderRadius}px`,
      }}
    >
      {children}
    </div>
  );
}
