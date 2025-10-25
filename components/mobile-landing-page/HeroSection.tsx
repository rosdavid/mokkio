"use client";

import { Smartphone, Tablet, AlertTriangle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative px-4 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 text-center overflow-hidden min-h-screen flex items-center">
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

      <div className="relative max-w-7xl mx-auto z-10 w-full px-4 sm:px-6 lg:px-8">
        {/* Logo y título centrado */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10 animate-in fade-in duration-1000 delay-50">
          <div className="shrink-0 flex items-center gap-2">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 200 200"
              className="drop-shadow-lg"
            >
              <path
                d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                fill="#fff"
              />
            </svg>
            <span className="text-2xl font-bold text-white">Mokkio</span>
          </div>
        </div>

        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 mt-4 sm:mt-6 md:mt-8 animate-in fade-in duration-1000 delay-100">
          <span className="inline-flex items-center gap-2 bg-orange-500/60 text-orange-100 border border-orange-400 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium mb-4 animate-in fade-in duration-1000 delay-200">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">🚧 </span>Coming Soon for Mobile
            & Tablet!<span className="hidden sm:inline"> 🚧</span>
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold text-white mb-4 sm:mb-6 md:mb-8 leading-tight animate-in fade-in duration-1000 delay-300">
          Mokkio is
          <span className="block bg-linear-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-in fade-in duration-1000 delay-400">
            Coming Soon
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-white/80 animate-in fade-in duration-1000 delay-500">
            to Mobile & Tablet
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-600">
          We&apos;re working hard to bring Mokkio to your mobile and tablet
          devices. For now, please access from a desktop computer for the best
          experience.
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10 lg:mb-12 animate-in fade-in duration-1000 delay-700">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-sm sm:text-base text-white/90 font-medium hover:bg-white/20 transition-all animate-in fade-in duration-1000 delay-800 flex items-center gap-1.5 sm:gap-2">
            <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Mobile Support </span>Soon
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-sm sm:text-base text-white/90 font-medium hover:bg-white/20 transition-all animate-in fade-in duration-1000 delay-900 flex items-center gap-1.5 sm:gap-2">
            <Tablet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Tablet Support </span>Soon
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-sm sm:text-base text-white/90 font-medium hover:bg-white/20 transition-all animate-in fade-in duration-1000 delay-1000 flex items-center gap-1.5 sm:gap-2">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Desktop Only </span>for Now
          </div>
        </div>
      </div>
    </section>
  );
}
