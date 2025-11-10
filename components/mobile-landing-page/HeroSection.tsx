"use client";

import {
  Smartphone,
  Heart,
  Share,
  EllipsisVertical,
  SquarePlus,
} from "lucide-react";
import { useEffect, useState } from "react";

function PWATutorial() {
  const [deviceInfo, setDeviceInfo] = useState<{
    os: string;
    instructions: React.ReactNode[];
  } | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    let os = "unknown";
    let instructions: React.ReactNode[] = [];

    // Detect OS
    if (/iPad|iPhone|iPod/.test(ua)) {
      os = "iOS";
    } else if (/Android/.test(ua)) {
      os = "Android";
    }

    // Set instructions
    if (os === "iOS") {
      instructions = [
        <>
          Tap the share button{" "}
          <span className="ml-1 inline-flex items-center justify-center w-8 h-8 bg-foreground rounded-full">
            <Share className="w-5 h-5 text-accent" />
          </span>
        </>,
        <>
          Tap
          <span className="inline-flex items-center ml-2 gap-2 px-3 py-1 bg-foreground text-accent rounded-md text-sm font-semibold shadow-md">
            <SquarePlus className="w-5 h-5 text-accent" />
            Add to Home Screen
          </span>
        </>,
        "Tap 'Add' to confirm",
        "The Mokkio app will appear on your home screen!",
      ];
    } else if (os === "Android") {
      instructions = [
        <>
          Tap the menu button{" "}
          <span className="ml-1 inline-flex items-center justify-center w-8 h-8 bg-foreground rounded-full">
            <EllipsisVertical className="w-5 h-5 text-accent" />
          </span>{" "}
          in the top-right corner
        </>,
        <>
          Tap
          <span className="inline-flex items-center ml-2 gap-2 px-3 py-1 bg-foreground text-accent rounded-xl text-sm font-semibold shadow-md">
            <SquarePlus className="w-5 h-5 text-accent" />
            Add to Home screen
          </span>
        </>,
        "Tap 'Add' to confirm",
        "The Mokkio app will appear on your home screen!",
      ];
    } else {
      instructions = [
        <>
          Look for{" "}
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 text-gray-900 rounded-full text-sm font-semibold shadow-md">
            <SquarePlus className="w-3 h-3 text-green-600" />
            Add to Home Screen
          </span>{" "}
          or &apos;Install App&apos; in your browser menu
        </>,
        "Follow the prompts to install Mokkio",
        "The app will be added to your device!",
      ];
    }

    setDeviceInfo({ os, instructions });
  }, []);

  if (!deviceInfo) return null;

  return (
    <div className="bg-linear-to-br from-white/15 via-white/8 to-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 sm:p-10 max-w-lg mx-auto shadow-2xl shadow-black/30 ring-1 ring-white/10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/20 shadow-lg">
          <Smartphone className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            Install Mokkio PWA
          </h3>
          <p className="text-sm text-white/70 font-medium">
            Quick setup for {deviceInfo.os} devices • 30 seconds
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {deviceInfo.instructions.map((step, index) => (
          <div key={index} className="flex items-start gap-4 group">
            <div className="shrink-0">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-lg backdrop-blur-sm group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/20 transition-all duration-300">
                {index + 1}
              </div>
            </div>
            <div className="flex-1 pt-1.5 text-left">
              <div className="text-white/90 leading-relaxed group-hover:text-white transition-all duration-300 text-base">
                {step}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-white/20">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center">
            <span className="text-yellow-300 text-lg">💡</span>
          </div>
          <p className="text-sm text-white/80 font-medium">
            Pro tip: The app works offline once installed!
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradientMove {
            background-size: 200% 200%;
            animation: gradientMove 3s ease-in-out infinite;
          }
          @keyframes heartbeatColor {
            0%, 100% { color: #f43f5e; }
            40% { color: #b91c1c; }
            60% { color: #b91c1c; }
            80% { color: #f43f5e; }
          }
          .animate-heartbeat {
            animation: heartbeatColor 1.6s infinite;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 10px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.18);
            border-radius: 8px;
            border: 2px solid rgba(0,0,0,0.12);
            box-shadow: 0 0 8px 2px rgba(0,0,0,0.12);
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          /* Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.18) transparent;
          }
          }
        `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <section className="relative text-center overflow-hidden min-h-screen">
      {/* Video de fondo y overlay degradado */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ pointerEvents: "none", height: "100vh" }}
        >
          <source src="/demo-video.mp4" type="video/mp4" />
        </video>
        {/* Overlay degradado y filtro: de color a transparente en el bottom */}
        <div className="absolute inset-0 w-full h-full bg-linear-to-b from-blue-900/70 via-purple-900/60 to-transparent backdrop-blur-sm"></div>
      </div>

      <div className="relative w-full z-10 px-4 sm:px-6 lg:px-8 sm:max-w-7xl sm:mx-auto pt-16 sm:pt-20 md:pt-24">
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

        <div className="mb-8 mt-8 animate-in fade-in duration-1000 delay-100">
          <span className="inline-block bg-purple-500/60 text-purple-100 border border-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-in fade-in duration-1000 delay-200">
            ✨ Currently in v1.0.0-beta.4 - Free to Use! 🚀
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extrabold text-white mb-4 sm:mb-6 md:mb-8 leading-tight animate-in fade-in duration-1000 delay-300">
          Create Stunning
          <span className="block bg-linear-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-in fade-in duration-1000 delay-400">
            Mockups
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-white/80 animate-in fade-in duration-1000 delay-500">
            in Seconds
          </span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-white/80 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed animate-in fade-in duration-1000 delay-600">
          To use Mokkio on mobile or tablet devices, please install the PWA
          version. Remember that this is still in beta and some features may not
          be available yet or not working as expected.
        </p>
        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 animate-in fade-in duration-1000 delay-1100 flex flex-col items-center gap-4 mb-8">
          <a
            href="https://buymeacoffee.com/mokkio"
            target="_blank"
            rel="noopener noreferrer"
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <button className="relative overflow-hidden text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg animate-in fade-in group transform hover:scale-105 will-change-transform cursor-pointer bg-linear-to-r from-purple-800 via-pink-800 to-blue-800 animate-gradientMove transition-all duration-300 border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-xl hover:shadow-white/10">
              <span className="relative z-10 flex items-center gap-2 text-sm md:text-md">
                <Heart className="w-4 h-4 animate-heartbeat text-pink-400" />
                Support Mokkio
              </span>
            </button>
          </a>

          <div className="text-sm flex flex-row items-center justify-center gap-4">
            <span className="text-white flex items-center gap-1">
              Made with
              <Heart className="inline w-4 h-4 animate-heartbeat text-pink-500" />
              by David Ros
            </span>
            <a
              className="text-blue-500 hover:underline"
              href="https://davidros.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit my website
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12 animate-in fade-in duration-1000 delay-700">
          <PWATutorial />
        </div>
      </div>
    </section>
  );
}
