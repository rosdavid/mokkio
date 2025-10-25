"use client";

import { useEffect, useState } from "react";
import { MobileLandingPage } from "./mobile-landing-page/MobileLandingPage";

export function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 1024);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return <MobileLandingPage />;
  }
  return <>{children}</>;
}
