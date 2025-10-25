"use client";

import { HeroSection } from "./HeroSection";
import { Footer } from "../landing-page/Footer";
/*import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { MockupsLayoutsSection } from "./MockupsLayoutsSection";
import { StylesEffectsSection } from "./StylesEffectsSection";
import { ExportSection } from "./ExportSection";
import { FAQSection } from "./FAQSection";*/

export function MobileLandingPage() {
  return (
    <div className="min-h-dvh bg-black overflow-x-hidden">
      <HeroSection />
      {/*
      <FeaturesSection />
      <HowItWorksSection />
      <MockupsLayoutsSection />
      <StylesEffectsSection />
      <ExportSection />
      <FAQSection />
      */}
      <Footer variant="minimal" />
    </div>
  );
}
