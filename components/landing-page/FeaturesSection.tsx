"use client";

import {
  Smartphone,
  Palette,
  Star,
  RotateCcw,
  Download,
  Zap,
  UserCheck,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="relative px-4 py-16 overflow-hidden">
      {/* Background visual animado y gradiente */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Gradiente principal apagado */}
        <div className="absolute inset-0 bg-linear-to-br from-neutral-900/90 via-gray-900/80 to-neutral-800/95"></div>
      </div>
      <div className="relative max-w-5xl mx-auto z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Features for <span className="text-purple-400">Mockups</span>
          </h2>
          <p className="text-base text-white/70 max-w-2xl mx-auto">
            Everything you need to create beautiful device mockups, simply and
            instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-7 auto-rows-[minmax(160px,1fr)]">
          {/* Caja principal grande, ocupa 2 columnas y 2 filas */}
          <div className="group col-span-1 sm:col-span-2 md:col-span-2 row-span-2 bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col justify-center items-center shadow-md transition-all duration-400 hover:scale-[1.04] hover:shadow-purple-500/30 hover:bg-white/10 hover:backdrop-blur-md hover:border-purple-400/40 relative overflow-hidden">
            {/* Background decorativo de la caja */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-br from-purple-800/30 via-blue-800/20 to-indigo-800/30 opacity-60 blur-md"></div>
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
              <Smartphone className="w-10 h-10 mb-3 text-purple-300 group-hover:text-purple-200 transition-all duration-300" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Multiple Devices
              </h3>
              <p className="text-white/70 text-center text-sm">
                Support for iPhone, iPad, MacBook, browser and screenshot type
                mockups with perfect proportions.
              </p>
            </div>
          </div>

          {/* Caja mediana arriba derecha, ocupa 1 columna y 1 fila */}
          <div className="group col-span-1 md:col-span-1 row-span-1 bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col items-center shadow-md transition-all duration-400 hover:scale-105 hover:shadow-pink-500/20 hover:bg-white/10 hover:backdrop-blur-md hover:border-pink-400/40 relative overflow-hidden">
            {/* Background decorativo de la caja */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-br from-pink-800/30 via-purple-800/20 to-blue-800/30 opacity-60 blur-md"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center">
              <Palette className="w-9 h-9 mb-2 text-pink-300 group-hover:text-pink-200 transition-all duration-300" />
              <h3 className="text-base font-semibold text-white mb-1">
                Custom Backgrounds
              </h3>
              <p className="text-white/60 text-center text-sm">
                Gradient, solid colors, all you need to match your brand.
              </p>
            </div>
          </div>

          {/* Caja vertical grande, ocupa 1 columna y 2 filas, abajo derecha */}
          <div className="group col-span-1 md:col-span-1 row-span-2 bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col justify-center items-center shadow-md transition-all duration-400 hover:scale-[1.04] hover:shadow-blue-500/30 hover:bg-white/10 hover:backdrop-blur-md hover:border-blue-400/40 relative overflow-hidden">
            {/* Background decorativo de la caja */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-br from-blue-800/30 via-indigo-800/20 to-purple-800/30 opacity-60 blur-md"></div>
            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
              <Star className="w-10 h-10 mb-3 text-blue-300 group-hover:text-blue-200 transition-all duration-300" />
              <h3 className="text-lg font-semibold text-white mb-1">
                Layout Presets
              </h3>
              <p className="text-white/70 text-center text-sm">
                Choose from a variety of professional layout presets for
                instant, beautiful arrangements.
              </p>
            </div>
          </div>

          {/* Caja horizontal mediana, ocupa 2 columnas y 1 fila, abajo izquierda */}
          <div className="group col-span-1 sm:col-span-2 md:col-span-2 row-span-1 bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col items-center shadow-md transition-all duration-400 hover:scale-105 hover:shadow-blue-500/20 hover:bg-white/10 hover:backdrop-blur-md hover:border-blue-400/40 relative overflow-hidden">
            {/* Background decorativo de la caja */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-br from-blue-800/30 via-purple-800/20 to-indigo-800/30 opacity-60 blur-md"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center">
              <Download className="w-9 h-9 mb-2 text-blue-300 group-hover:text-blue-200 transition-all duration-300" />
              <h3 className="text-base font-semibold text-white mb-1">
                High-Quality Export
              </h3>
              <p className="text-white/60 text-center text-sm">
                Export your mockups in PNG, JPEG, and WebP formats with high
                resolution.
              </p>
            </div>
          </div>

          {/* Caja cuadrada pequeña, centro arriba */}
          <div className="group col-span-1 md:col-span-1 row-span-1 bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col items-center shadow-md transition-all duration-400 hover:scale-105 hover:shadow-purple-500/20 hover:bg-white/10 hover:backdrop-blur-md hover:border-purple-400/40 relative overflow-hidden">
            {/* Background decorativo de la caja */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-br from-purple-800/30 via-blue-800/20 to-indigo-800/30 opacity-60 blur-md"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center">
              <RotateCcw className="w-8 h-8 mb-2 text-purple-300 group-hover:text-purple-200 transition-all duration-300" />
              <h3 className="text-base font-semibold text-white mb-1">
                Undo/Redo
              </h3>
              <p className="text-white/60 text-center text-sm">
                Full history management with unlimited undo and redo for
                seamless editing.
              </p>
            </div>
          </div>

          {/* Caja cuadrada pequeña, centro abajo */}
          <div className="group col-span-1 md:col-span-1 row-span-1 bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col items-center shadow-md transition-all duration-400 hover:scale-105 hover:shadow-pink-500/20 hover:bg-white/10 hover:backdrop-blur-md hover:border-pink-400/40 relative overflow-hidden">
            {/* Background decorativo de la caja */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-br from-pink-800/30 via-purple-800/20 to-blue-800/30 opacity-60 blur-md"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center">
              <Zap className="w-8 h-8 mb-2 text-pink-300 group-hover:text-pink-200 transition-all duration-300" />
              <h3 className="text-base font-semibold text-white mb-1">
                Real-time Preview
              </h3>
              <p className="text-white/60 text-center text-sm">
                See changes instantly with live preview and zoom/pan controls.
              </p>
            </div>
          </div>

          {/* Nuevo feature: No Login Required & Free to Use */}
          <div className="group col-span-1 md:col-span-1 row-span-1 bg-neutral-900 border border-white/5 rounded-2xl p-7 flex flex-col items-center shadow-md transition-all duration-400 hover:scale-105 hover:shadow-green-400/20 hover:bg-white/10 hover:backdrop-blur-md hover:border-green-400/40 relative overflow-hidden">
            {/* Background decorativo de la caja */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-linear-to-br from-green-800/30 via-blue-800/20 to-purple-800/30 opacity-60 blur-md"></div>
            <div className="relative z-10 w-full h-full flex flex-col items-center">
              <UserCheck className="w-8 h-8 mb-2 text-green-300 group-hover:text-green-200 transition-all duration-300" />
              <h3 className="text-base font-semibold text-white mb-1">
                No Login Required and Free
              </h3>
              <p className="text-white/60 text-center text-sm">
                Free to use, no registration or login needed. Start creating
                instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
