"use client";

import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { FAQSection } from "./FAQSection";
import { MockupsLayoutsSection } from "./MockupsLayoutsSection";
import { StylesEffectsSection } from "./StylesEffectsSection";
import { ExportSection } from "./ExportSection";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { Footer } from "./Footer";

interface LandingPopupProps {
  onClose: () => void;
}

export function LandingPopup({ onClose }: LandingPopupProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Esperar a que termine la animación antes de cerrar
    setTimeout(() => {
      onClose();
    }, 300);
  };
  // Inyectar el CSS global para la animación del gradiente
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
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // IDs para cada sección
  const sectionIds = [
    "hero-section",
    "features-section",
    "howitworks-section",
    "mockups-section",
    "styles-section",
    "export-section",
    "faq-section",
  ];
  const sectionLabels = [
    "Hero",
    "Features",
    "How It Works",
    "Mockups",
    "Styles",
    "Export",
    "FAQ",
  ];

  // Scroll suave a la sección
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300 ${
        isClosing ? "animate-out fade-out duration-300" : ""
      }`}
    >
      <div className="bg-[#0a0a0a] w-full max-w-[1600px] h-full max-h-[90vh] rounded-lg overflow-hidden relative mx-4 shadow-2xl">
        {/* Header flotante, glassmorphism, centrado y redondeado */}
        <div
          className="fixed z-30 left-1/2 top-16 -translate-x-1/2 flex items-center justify-center px-6 py-2 gap-4 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl border border-white/20 animate-in fade-in duration-500 w-max"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
        >
          {/* Logo SVG */}
          <div className="shrink-0 flex items-center gap-2">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 200 200"
              className="drop-shadow-lg"
            >
              <path
                d="M6 99.9V147l2.8-.1c5.3-.1 15.9-3.5 21.6-6.9 10-6 16.8-14.9 20.7-27l1.8-5.5v19.7L53 147h2.3c4.4 0 15.1-3.1 20.1-5.8 10.8-5.8 21.6-19.9 23.2-30.4.8-4.9 2-4.9 2.8 0 1 6.3 6.6 16.3 12.5 22.3 10.5 10.5 26 15.5 40.3 13.1 12.9-2.2 25.5-10.4 32-20.8 5.2-8.1 7.1-15.2 7.1-25.4s-1.9-17.3-7.1-25.4c-6.5-10.4-19.1-18.6-32-20.8-14.3-2.4-29.8 2.6-40.3 13.1-5.9 6-11.5 16-12.5 22.3-.8 4.9-2 4.9-2.8 0C97 79.2 87.5 66.1 77.4 60c-5.7-3.4-16.3-6.8-21.6-6.9L53 53l-.1 19.7v19.8L51.1 87C45 68.2 30.5 55.8 11.8 53.5L6 52.8z"
                fill="#fff"
              />
            </svg>
            <span className="text-sm font-bold text-white">Mokkio</span>
          </div>

          {/* Separador */}
          <div className="w-px h-6 bg-white/30"></div>

          {sectionLabels.map((label, idx) => (
            <button
              key={label}
              onClick={() => scrollToSection(sectionIds[idx])}
              className="relative font-medium px-3 py-1 rounded-xl overflow-hidden transition-all duration-300 focus:outline-none group cursor-pointer"
              style={{ zIndex: 1 }}
            >
              <span className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-150 group-hover:opacity-100 group-hover:scale-105 group-hover:blur-md group-hover:bg-white/20 group-hover:shadow-pink-500/30"></span>
              <span className="relative z-10 transition-all text-white duration-300 group-hover:text-pink-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
                {label}
              </span>
              <span className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:shadow-[0_0_16px_4px_rgba(236,72,153,0.4)]"></span>
            </button>
          ))}
        </div>
        <div className="h-full overflow-y-auto pb-20 custom-scrollbar">
          <div id="hero-section">
            <HeroSection />
          </div>
          <div id="features-section">
            <FeaturesSection />
          </div>
          <div id="howitworks-section">
            <HowItWorksSection />
          </div>
          <div id="mockups-section">
            <MockupsLayoutsSection />
          </div>
          <div id="styles-section">
            <StylesEffectsSection />
          </div>
          <div id="export-section">
            <ExportSection />
          </div>
          <div id="faq-section">
            <FAQSection />
          </div>
          <Footer />
        </div>
        {/* Botón sticky siempre visible en el bottom center del popup */}
        <div className="absolute bottom-0 left-0 right-0 py-4 text-center z-10">
          <span className="absolute left-0 right-0 bottom-0 w-full h-32 pointer-events-none bg-linear-to-t from-black/70 to-transparent blur-md rounded-b-xl"></span>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleClose}
              className="relative overflow-hidden text-white px-4 py-3 rounded-full font-semibold text-lg shadow-lg transition-colors animate-in fade-in duration-700 group transform hover:scale-105 will-change-transform cursor-pointer"
            >
              <span className="absolute inset-0 z-0 bg-linear-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradientMove transition-all duration-300 rounded-full group-hover:opacity-100 group-hover:blur-sm"></span>
              <span className="relative z-10">Start Editing Now</span>
            </button>
            <a
              href="https://ko-fi.com/R5R31NC8IM"
              target="_blank"
              className="hover:opacity-100 opacity-80"
            >
              <Image
                width={180}
                height={0}
                style={{ border: "0px", height: "36px" }}
                src="https://storage.ko-fi.com/cdn/brandasset/v2/support_me_on_kofi_beige.png?_gl=1*jzb8ds*_gcl_au*ODc1MTI4ODI0LjE3NjEzNjc4OTA.*_ga*MjEwMjUwMjk4MS4xNzYxMzY3ODkw*_ga_M13FZ7VQ2C*czE3NjEzNjc4ODkkbzEkZzEkdDE3NjEzNjk0MzUkajUzJGwwJGgw"
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
          </div>
          <div className="mt-4 text-sm flex flex-row items-center justify-center gap-4">
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
      </div>
    </div>
  );
}
