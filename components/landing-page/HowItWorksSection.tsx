"use client";

import { Upload, Smartphone, Palette, Download } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Design",
    description: "Upload your screenshots or images directly into the canvas.",
  },
  {
    step: "02",
    icon: Smartphone,
    title: "Choose Your Device",
    description:
      "Select from iPhone, iPad, MacBook, browser, and screenshot type frames with perfect dimensions.",
  },
  {
    step: "03",
    icon: Palette,
    title: "Customize & Style",
    description:
      "Adjust backgrounds, shadows, borders, effects, and perspective to match your vision.",
  },
  {
    step: "04",
    icon: Download,
    title: "Export & Share",
    description:
      "Download your professional mockups in high resolution for any use.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="relative px-4 sm:px-8 py-16 sm:py-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 40%, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
      }}
    >
      {/* Elementos decorativos únicos */}
      <div className="absolute inset-0 opacity-5">
        {/* Líneas diagonales */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="diagonalLines"
                patternUnits="userSpaceOnUse"
                width="10"
                height="10"
              >
                <path
                  d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
                  stroke="rgba(139, 92, 246, 0.1)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonalLines)" />
          </svg>
        </div>
        {/* Formas geométricas */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-cyan-500/10 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-pink-500/10 rounded-full animate-spin delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-indigo-500/5 rotate-12 animate-bounce delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 animate-in slide-in-from-top duration-700">
            How It{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto animate-in fade-in duration-1000 delay-300 px-4">
            Create stunning device mockups in just four simple steps. From
            upload to export, we&apos;ve made it effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {/* Líneas conectadoras para desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 transform -translate-y-1/2 z-0"></div>
          <div className="hidden lg:flex absolute top-1/2 left-1/4 w-8 h-8 bg-purple-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="hidden lg:flex absolute top-1/2 left-2/4 w-8 h-8 bg-blue-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="hidden lg:flex absolute top-1/2 left-3/4 w-8 h-8 bg-indigo-500/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center">
            <svg
              className="w-4 h-4 text-indigo-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="group relative text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all animate-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Border gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-purple-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="bg-purple-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-500/30 transition-colors duration-300">
                  <step.icon className="w-8 h-8 text-purple-400 group-hover:text-purple-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                </div>
                <div className="text-purple-400/60 text-sm font-medium mb-2 group-hover:text-purple-300 transition-colors duration-300">
                  Step {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
