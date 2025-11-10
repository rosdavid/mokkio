"use client";

import { Palette, Droplet, Zap, Layers } from "lucide-react";

const styles = [
  {
    icon: Palette,
    title: "Background Styles",
    description:
      "Gradient, solid colors, cosmic patterns, and texture backgrounds",
    features: [
      "Linear Gradients",
      "Radial Gradients",
      "Solid Colors",
      "Textures",
    ],
  },
  {
    icon: Droplet,
    title: "Shadow Effects",
    description:
      "Advanced shadow system with full control over blur, opacity, and positioning",
    features: [
      "Preset Shadows",
      "Custom Shadows",
      "Soft/Hard Edges",
      "Full Control",
    ],
  },
  {
    icon: Zap,
    title: "Effects",
    description: "Add stunning effects to make your mockups pop",
    features: [
      "Noise Efect",
      "Blur Effect",
      "Lense Blur (Comming Soon)",
      "Intensity Adjustment",
    ],
  },
  {
    icon: Layers,
    title: "Perspective",
    description:
      "Manage and adjust the perspective of your mockups for a better look",
    features: [
      "Zoom Control",
      "Position Adjustment",
      "Layout Presets",
      "Multiple Mockups",
    ],
  },
];

export function StylesEffectsSection() {
  return (
    <section className="relative px-4 sm:px-8 py-12 sm:py-20 bg-linear-to-br from-indigo-900/20 via-purple-900/10 to-blue-900/20 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-in slide-in-from-top duration-700">
            Styles &{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Effects
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-in fade-in duration-1000 delay-300">
            Powerful styling tools to make your mockups look professional and
            stunning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {styles.map((style, index) => (
            <div
              key={style.title}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all animate-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Border gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-purple-500/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <style.icon className="w-12 h-12 mb-6 text-purple-400 group-hover:text-purple-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
                  {style.title}
                </h3>
                <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
                  {style.description}
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-purple-400 mb-3">
                    Features:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {style.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2 text-sm text-white/60"
                      >
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
