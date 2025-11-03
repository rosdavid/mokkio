"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is Mokkio free to use?",
    answer:
      "Yes! Mokkio is completely free to use. No signup required, no hidden fees.",
  },
  {
    question: "What devices can I create mockups for?",
    answer:
      "You can create mockups for iPhone, iPad, MacBook, screenshots, and various browser frames with perfect proportions.",
  },
  {
    question: "Can I export my mockups in different formats?",
    answer:
      "Absolutely! Export your mockups in PNG, JPEG and WEBP with high-quality formats and different resolutions.",
  },
  {
    question: "Do I need design skills to use Mokkio?",
    answer:
      "Not at all! Mokkio is designed to be user-friendly. Just upload your designs and customize with our intuitive tools.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes, your designs are processed locally in your browser. We don't store or upload your files to our servers.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative px-4 sm:px-8 py-12 sm:py-20 bg-linear-to-br from-purple-900/20 via-blue-900/10 to-indigo-900/20 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-in slide-in-from-top duration-700">
            Frequently Asked{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-300">
            Everything you need to know about MokkiO
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden animate-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <span className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-white/70">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
