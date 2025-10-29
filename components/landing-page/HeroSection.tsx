"use client";

import { Rocket, Download, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative px-8 py-20 text-center max-h-screen overflow-hidden">
      {/* Video de fondo y overlay degradado */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ pointerEvents: "none" }}
        >
          <source src="/demo-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay degradado y filtro: de color a transparente en el bottom */}
        <div className="absolute inset-0 w-full h-full bg-linear-to-b from-blue-900/70 via-purple-900/60 to-transparent backdrop-blur-sm"></div>
      </div>

      <div className="relative max-w-4xl mx-auto z-10">
        <div className="mb-8 mt-8 animate-in fade-in duration-1000 delay-100">
          <span className="inline-block bg-purple-500/60 text-purple-100 border border-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-in fade-in duration-1000 delay-200">
            ✨ Currently in v1.0.0-beta.2 - Free to Use! 🚀
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 leading-tight animate-in fade-in duration-1000 delay-300">
          Create Stunning
          <span className="block bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-in fade-in duration-1000 delay-400">
            Mockups
          </span>
          <span className="text-4xl md:text-5xl font-light text-white/80 animate-in fade-in duration-1000 delay-500">
            in Seconds
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-600">
          Transform your designs into professional device mockups with Mokkio.
          Perfect for presentations, portfolios, and marketing materials.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-in fade-in duration-1000 delay-700">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-sm text-white/90 font-medium hover:bg-white/20 transition-all animate-in fade-in duration-1000 delay-800 flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            No signup required
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-sm text-white/90 font-medium hover:bg-white/20 transition-all animate-in fade-in duration-1000 delay-900 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export in multiple formats
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-sm text-white/90 font-medium hover:bg-white/20 transition-all animate-in fade-in duration-1000 delay-1000 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Real-time preview
          </div>
        </div>
      </div>
    </section>
  );
}
