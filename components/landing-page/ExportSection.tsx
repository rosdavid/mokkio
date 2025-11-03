"use client";

import { Download, Image, FileImage, Settings } from "lucide-react";

const exportOptions = [
  {
    icon: Image,
    format: "PNG",
    description: "High-quality raster format",
    features: ["Multiple Render Sizes", "Lossless Quality", "Web Optimized"],
  },
  {
    icon: FileImage,
    format: "JPEG",
    description: "Compressed format perfect for web and social media",
    features: ["Small File Size", "Wide Compatibility", "Quality Control"],
  },
  {
    icon: Settings,
    format: "WEBP",
    description: "Modern format with superior compression and quality",
    features: ["Superior Compression", "Lossless & Lossy", "Web Optimized"],
  },
];

export function ExportSection() {
  return (
    <section
      className="relative px-4 sm:px-8 py-12 sm:py-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 80% 20%, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-20 right-20 w-28 h-28 border border-indigo-500/10 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-36 h-36 border border-purple-500/10 rounded-full animate-spin delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-in slide-in-from-top duration-700">
            Export &{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Share
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-in fade-in duration-1000 delay-300">
            Download your professional mockups in multiple formats with high
            quality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {exportOptions.map((option, index) => (
            <div
              key={option.format}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all animate-in slide-in-from-bottom duration-700 text-center"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Border gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <option.icon className="w-12 h-12 mb-6 text-purple-400 group-hover:text-purple-300 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 mx-auto" />
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors duration-300">
                  {option.format}
                </h3>
                <p className="text-white/70 mb-6 group-hover:text-white/90 transition-colors duration-300">
                  {option.description}
                </p>
                <div className="space-y-2">
                  {option.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center justify-center space-x-2 text-sm text-white/60"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center animate-in fade-in duration-1000 delay-500">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <Download className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Export?
            </h3>
            <p className="text-white/70 mb-6">
              Your mockups are exported instantly with professional quality. No
              watermarks, no limits.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Instant Download</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>High Resolution</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Multiple Render Sizes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
