"use client";

import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { MockupsLayoutsSection } from "./MockupsLayoutsSection";
import { StylesEffectsSection } from "./StylesEffectsSection";
import { ExportSection } from "./ExportSection";
import { FAQSection } from "./FAQSection";

export function MobileLandingPage() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MockupsLayoutsSection />
      <StylesEffectsSection />
      <ExportSection />
      <FAQSection />
    </div>
  );
}
