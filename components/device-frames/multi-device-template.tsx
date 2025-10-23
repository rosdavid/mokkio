interface MultiDeviceTemplateProps {
  template: string;
  uploadedImage: string | null;
  padding: number;
  shadow: number;
  borderRadius: number;
  inset: number;
}

import Image from "next/image";

export function MultiDeviceTemplate({
  template,
  uploadedImage,
  padding,
  shadow,
  borderRadius,
  inset,
}: MultiDeviceTemplateProps) {
  const renderContent = (customInset = inset) => {
    if (!uploadedImage) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      );
    }

    return (
      <div
        className="relative h-full w-full"
        style={{ padding: `${customInset}px` }}
      >
        <Image
          src={uploadedImage || "/placeholder.svg"}
          alt="Mockup"
          fill
          className="object-cover"
          style={{
            borderRadius:
              customInset > 0
                ? `${Math.max(0, borderRadius - customInset)}px`
                : "0",
          }}
        />
      </div>
    );
  };

  const deviceStyle = {
    filter: `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0, 0, 0, ${
      shadow / 200
    }))`,
  };

  if (template === "triple-phone") {
    return (
      <div
        className="relative flex items-center justify-center gap-8"
        style={{ padding: `${padding}px` }}
      >
        {/* Left Phone - Rotated Left */}
        <div
          className="relative overflow-hidden bg-white shadow-2xl"
          style={{
            width: "280px",
            height: "600px",
            borderRadius: `${borderRadius}px`,
            transform: "perspective(1000px) rotateY(25deg) rotateZ(-5deg)",
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>

        {/* Center Phone - Front Facing */}
        <div
          className="relative z-10 overflow-hidden bg-white shadow-2xl"
          style={{
            width: "320px",
            height: "680px",
            borderRadius: `${borderRadius}px`,
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>

        {/* Right Phone - Rotated Right */}
        <div
          className="relative overflow-hidden bg-white shadow-2xl"
          style={{
            width: "280px",
            height: "600px",
            borderRadius: `${borderRadius}px`,
            transform: "perspective(1000px) rotateY(-25deg) rotateZ(5deg)",
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  if (template === "laptop-phone") {
    return (
      <div
        className="relative flex items-end justify-center gap-12"
        style={{ padding: `${padding}px` }}
      >
        {/* Laptop */}
        <div
          className="relative overflow-hidden bg-white shadow-2xl"
          style={{
            width: "800px",
            height: "520px",
            borderRadius: `${borderRadius}px`,
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>

        {/* Phone Overlapping */}
        <div
          className="relative z-10 overflow-hidden bg-white shadow-2xl"
          style={{
            width: "280px",
            height: "600px",
            borderRadius: `${borderRadius}px`,
            marginLeft: "-200px",
            marginBottom: "40px",
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  if (template === "floating-devices") {
    return (
      <div
        className="relative"
        style={{ padding: `${padding}px`, width: "1000px", height: "700px" }}
      >
        {/* Tablet - Background */}
        <div
          className="absolute overflow-hidden bg-white shadow-2xl"
          style={{
            width: "500px",
            height: "700px",
            borderRadius: `${borderRadius}px`,
            top: "0",
            left: "50%",
            transform: "translateX(-50%) perspective(1000px) rotateY(-15deg)",
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>

        {/* Phone - Front Left */}
        <div
          className="absolute z-10 overflow-hidden bg-white shadow-2xl"
          style={{
            width: "280px",
            height: "600px",
            borderRadius: `${borderRadius}px`,
            top: "100px",
            left: "50px",
            transform: "perspective(1000px) rotateY(10deg) rotateZ(-8deg)",
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>

        {/* Laptop - Front Right */}
        <div
          className="absolute z-10 overflow-hidden bg-white shadow-2xl"
          style={{
            width: "450px",
            height: "300px",
            borderRadius: `${borderRadius}px`,
            bottom: "50px",
            right: "50px",
            transform: "perspective(1000px) rotateY(-5deg)",
            ...deviceStyle,
          }}
        >
          {renderContent()}
        </div>
      </div>
    );
  }

  return null;
}
