"use client";

import { HeroSection } from "./HeroSection";
import { Footer } from "@/components/landing-page/Footer";

export function MobileLandingPage() {
  return (
    <div className="min-h-dvh bg-black overflow-x-hidden">
      <HeroSection />
      <Footer variant="minimal" />
    </div>
  );
}
