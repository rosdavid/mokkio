"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MobileLandingPage } from "./mobile-landing-page/MobileLandingPage";

export function MobileBlocker({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 1024);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Excluir rutas específicas del bloqueo móvil
  const excludedPaths = [
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
  ];
  const shouldBlockMobile = !excludedPaths.includes(pathname);

  if (isMobile && shouldBlockMobile) {
    return <MobileLandingPage />;
  }
  return <>{children}</>;
}
