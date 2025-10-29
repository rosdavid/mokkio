"use client";

import { Smartphone, Tablet, Monitor, Globe, Camera } from "lucide-react";

const mockups = [
  {
    icon: Globe,
    title: "Screenshot",
    description:
      "Adaptable to any resolution, perfect for showcasing full-page or custom size screenshots.",
    devices: ["Any resolution", "Full page", "Custom size"],
  },
  {
    icon: Smartphone,
    title: "Mobile Mockups",
    description:
      "Perfect iPhone and Android device frames with realistic shadows and reflections.",
    devices: ["iPhone 17 Pro", "iPhone 17 Pro Max"],
  },
  {
    icon: Tablet,
    title: "Tablet Mockups",
    description:
      "iPad and Android tablet frames for app and website presentations.",
    devices: ['iPad Pro 12.9"'],
  },
  {
    icon: Monitor,
    title: "Desktop Mockups",
    description:
      "MacBook and Windows laptop frames for web and software showcases.",
    devices: ['MacBook Pro 16"'],
  },
  {
    icon: Globe,
    title: "Browser Mockups",
    description: "Clean browser frames for web designs and responsive layouts.",
    devices: ["Chrome", "Safari", "Firefox", "Edge"],
  },
];

export function MockupsLayoutsSection() {
  return (
    <section
      className="relative px-8 py-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, #0f0f23 0%, #1a1a2e 50%, #0f0f23 100%)",
      }}
    >
      {/* Elementos decorativos únicos */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-20 left-20 w-24 h-24 border border-purple-500/10 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 border border-blue-500/10 rounded-full animate-spin delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-in slide-in-from-top duration-700">
            Mockups &{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Layouts
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-in fade-in duration-1000 delay-300">
            Choose from a wide variety of professional device frames and layouts
          </p>
        </div>

        {/* Bentobox grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 auto-rows-[minmax(160px,1fr)]">
          {/* Screenshot Mockup - grande horizontal */}
          <div className="group col-span-1 sm:col-span-2 md:col-span-3 row-span-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center hover:bg-white/10 hover:scale-105 hover:shadow-pink-500/20 transition-all animate-in slide-in-from-bottom duration-700">
            {/* Usar el icono Camera de Lucide React */}
            <Camera className="w-14 h-14 mb-6 text-pink-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-200 transition-colors duration-300">
              Screenshot
            </h3>
            <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
              Adaptable to any resolution, perfect for showcasing full-page or
              custom size screenshots.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-pink-400 mb-3">
                Supported:
              </h4>
              <div className="flex flex-wrap gap-2">
                {mockups[0].devices.map((device, deviceIndex) => (
                  <span
                    key={deviceIndex}
                    className="bg-pink-500/20 text-pink-200 px-3 py-1 rounded-full text-sm hover:bg-pink-500/30 transition-colors"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Mockups - vertical grande */}
          <div className="group col-span-1 sm:col-span-1 md:col-span-1 row-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-center hover:bg-white/10 hover:scale-[1.04] hover:shadow-purple-500/30 transition-all animate-in slide-in-from-bottom duration-700">
            <Smartphone className="w-12 h-12 mb-6 text-purple-400 group-hover:text-purple-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
              Mobile Mockups
            </h3>
            <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
              Perfect iPhone and Android device frames with realistic shadows
              and reflections.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-purple-400 mb-3">
                Supported:
              </h4>
              <div className="flex flex-wrap gap-2">
                {mockups[1].devices.map((device, deviceIndex) => (
                  <span
                    key={deviceIndex}
                    className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tablet Mockups - horizontal mediana */}
          <div className="group col-span-1 sm:col-span-1 md:col-span-2 row-span-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center hover:bg-white/10 hover:scale-105 hover:shadow-blue-500/20 transition-all animate-in slide-in-from-bottom duration-700">
            <Tablet className="w-12 h-12 mb-6 text-blue-400 group-hover:text-blue-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">
              Tablet Mockups
            </h3>
            <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
              iPad and Android tablet frames for app and website presentations.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-blue-400 mb-3">
                Supported:
              </h4>
              <div className="flex flex-wrap gap-2">
                {mockups[2].devices.map((device, deviceIndex) => (
                  <span
                    key={deviceIndex}
                    className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Mockups - cuadrada */}
          <div className="group col-span-1 sm:col-span-1 md:col-span-1 row-span-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center hover:bg-white/10 hover:scale-105 hover:shadow-blue-500/20 transition-all animate-in slide-in-from-bottom duration-700">
            <Monitor className="w-12 h-12 mb-6 text-blue-400 group-hover:text-blue-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">
              Desktop Mockups
            </h3>
            <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
              MacBook and Windows laptop frames for web and software showcases.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-blue-400 mb-3">
                Supported:
              </h4>
              <div className="flex flex-wrap gap-2">
                {mockups[3].devices.map((device, deviceIndex) => (
                  <span
                    key={deviceIndex}
                    className="bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm hover:bg-blue-500/30 transition-colors"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Browser Mockups - cuadrada */}
          <div className="group col-span-1 sm:col-span-1 md:col-span-1 row-span-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col items-center hover:bg-white/10 hover:scale-105 hover:shadow-purple-500/20 transition-all animate-in slide-in-from-bottom duration-700">
            <Globe className="w-12 h-12 mb-6 text-purple-400 group-hover:text-purple-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
              Browser Mockups
            </h3>
            <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
              Clean browser frames for web designs and responsive layouts.
            </p>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-purple-400 mb-3">
                Supported:
              </h4>
              <div className="flex flex-wrap gap-2">
                {mockups[4].devices.map((device, deviceIndex) => (
                  <span
                    key={deviceIndex}
                    className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
